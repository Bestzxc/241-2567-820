const express = require('express'); //express = เว็บ framework ของ node.js เพื่อให้สร้าง API ได้ง่ายขึ้น
const bodyParser = require('body-parser'); // body-parser = แปลงข้อมูล HTTP ที่เข้ามาให้เป็น json 
const app = express(); //เก็บ express ไว้ในตัวแปร app
const cors = require('cors'); //cors = ใช้ในการเปิดให้เว็บเเราสามารถเรียกใช้ API ได้
const mysql = require('mysql2/promise'); // ใช้เชื่อมต่อเเละสั่งงานเเบบ async/await
app.use(bodyParser.json()); //กำหนดให้ express รองรับ JSON request body
app.use(cors());
const port = 8000; //กำหนดให้รันที่ port 8000
let users = [] //เก็บข้อมูล user ทั้งหมดในหน่วยความจำ
let conn = null //เก็บ connection ไว้ใช้งาน


//*** GET /users สำหรับ get ข้อมูล user ทั้งหมด
//*** POST /user สำหรับสร้าง create user ใหม่บันทึกเข้าไป
//*** PUT /user/:id สำหรับ update ข้อมูล user รายคนที่ต้องการบันทึกเข้าไป
//*** DELETE /user/:id สำหรับลบ user รายคนที่ต้องการออกไป

// http://localhost:8000/(path)

//1.GET /user/:id สำหรับ get ข้อมูล user รายคนที่ต้องการ
app.get('/testdb', (req, res) => { // /testdb คือ path ที่เราต้องการให้เข้าถึง สำหรับ get 
    mysql.createConnection({ //เชื่อมต่อกับ MySQL ด้วย createConnection
        host: 'localhost', //localhost = ที่อยู่ของ MySQL บนเครื่องเรา สามารถเปลี่ยนเป็น IP ของ MySQL ได้
        user: 'root',   //บัญชีหลักของ MySQL ที่เราต้องการใช้งาน
        password: 'root',
        database: 'webdb', //ชื่อฐานข้อมูลที่เราต้องการใช้งาน (ดูได้จาก phpMyAdmin)
        port: 8830 //ค่าเริ่มต้นคือ 3306 สามารถเปลี่ยนได้ตามที่เราตั้งค่าไว้ได้
    }).then((conn) => { //.then() คือทำงานเมื่อทำอันก่อนหน้าเสร็จ
        conn //เรียกใช้ ตัวแปร conn ที่เราสร้างไว้
            .query('SELECT * FROM users') //ดึงข้อมูลจากตาราง users ทั้งหมด(*) จากที่อยู่ใน conn
            .then((results) => { //ทำงานต่อหลังจากทำอันก่อนหน้าเสร็จ
                res.json(results[0]) //ส่งข้อมูลที่ดึงมาจาก MySQL กลับไปให้ client ในรูปแบบ JSON
            })
            .catch((error) => { //ทำงานเมื่อเกิด error
                console.log('Error fetching users:', error.message) //แสดงข้อความ error ใน console
                res.status(500).json({ error: 'Error fetching users' }) //บอกว่าเกิด error ในการดึงข้อมูลฝั่ง server รหัสคือ 500
            })
    })
})

const initMySQL = async () => { // สร้างฟังก์ชัน initMySQL รูปเเบบ arrow-function
    conn = await mysql.createConnection({ // การใช้ async/await จะมาเเทนการใช้ then()/catch() ทำให้ง่ายขึ้น
        host: 'localhost', //ที่อยู่ของ MySQL บนเครื่องเรา
        user: 'root', //บัญชีของ MySQL
        password: 'root',
        database: 'webdb', //ชื่อฐานข้อมูลที่เราใช้
        port: 8830 //port ที่ MySQL ใช้
    })
}
const validateData = (userData) => {
    let errors = [];
    if (!userData.firstname){
        errors.push('กรุณากรอกชื่อ')
    }
    if (!userData.lastname){
        errors.push('กรุณากรอกนามสกุล')
    }
    if (!userData.age){
        errors.push('กรุณากรอกอายุ')
    }
    if (!userData.gender){
        errors.push('กรุณากรอกเพศ')
    }
    if (!userData.interest){
        errors.push('กรุณากรอกสิ่งที่สนใจ')
    }
    if (!userData.description){
        errors.push('กรุณากรอกข้อมูลส่วนตัว')
    }
    return errors;
}

app.get('/testdb-new', async (req, res) => { //สร้าง path /testdb-new สำหรับ get 
    try { //ใช้ try/catch ในการจัดการ error
        const results = await conn.query('SELECT * FROM users') //เข้าถึง MySQL เเละดึงข้อมูลจากใน conn ทั้งหมด
        res.json(results[0]) //ส่งข้อมูลที่ดึงมาไปที่ client ในรูปแบบ JSON
    } catch (error) {
        console.log('Error fetching users:', error.message)
        res.status(500).json({ error: 'Error fetching users' })
    }
})


//1.1.path = / Get / Users สำหรับ get ข้อมูล user ทั้งหมด
app.get('/users', async (req, res) => {
    const results = await conn.query('SELECT * FROM users')
    res.json(results[0])
})
// get ตาม id
app.get('/users/:id', async (req, res) => {
    try {
        let id = req.params.id; //รับค่า id ที่ส่งมาจาก client ผ่าน parameter เเละเก็บไว้ในตัวแปร id
        const results = await conn.query('SELECT * FROM users WHERE id = ?', id)
        res.json(results[0])
    } catch (error) {
        console.log('Error fetching users:', error.message)
        res.status(500).json({
            error: 'Something went wrong',
            errorMessage: error.message
        })
    }
})

//2.path = POST / User
app.post('/users', async (req, res) => { //สร้าง path /users สำหรับ post (สร้างข้อมูลใหม่)
    try {
        let user = req.body; //เก็บข้อมูลที่ส่งมาจาก client ที่อยู่ใน body ไว้ในตัวแปร user
        const errors = validateData(user);
        if(errors.length > 0){
            throw {
                message: 'กรุณากรอกข้อมูลให้ครบถ้วน', 
                errors: errors
            }
        }
        
        const results = await conn.query('INSERT INTO users SET ?', user) // SET ? ทำให้เก็บข้อมูลได้ง่ายไม่ต้องระบุฟิลด์ทีละฟิลด์
        console.log('results', results)
        res.json({
            message: 'User created', //ส่งข้อความกลับไปให้ client ว่าสร้างข้อมูลเสร็จสิ้น
            data: results[0]   //ส่งข้อมูลที่สร้างไปให้ client
        });
    } catch (error) {
        const errorMessage = error.message || 'something went wrong';
        const errors =error.errors || [];
        console.error('Error fetching users:', error.message)
        res.status(500).json({
            message: errorMessage,
            errors: errors
        })
    }
})

//3.path = PUT / user/:id 
app.put('/user/:id', async (req, res) => { //สร้าง path สำหรับ put (อัพเดทข้อมูล)
    try {
        let id = req.params.id; //รับค่า id ที่ส่งมาจาก client เเละเก็บไว้ในตัวแปร id
        let updateUser = req.body; //รับข้อมูลที่ส่งมาจาก client ที่อยู่ใน body ไว้ในตัวแปร updateUser
        const results = await conn.query('UPDATE users SET ? WHERE id = ?', [updateUser, id]) // SET ? ทำให้เก็บข้อมูลได้ง่ายไม่ต้องระบุฟิลด์ทีละฟิลด์
        res.json({
            message: 'User updated', //ส่งข้อความกลับไปให้ client ว่าสร้างข้อมูลเสร็จสิ้น
            data: results[0]   //ส่งข้อมูลที่สร้างไปให้ client
        });
    } catch (error) {
        console.log('errorMessage:', error.message)
        res.status(500).json({
            message: 'Something went wrong',
            errorMessage: error.message
        })
    }
})

//4.Path = DELETE / user/:id
app.delete('/user/:id', async (req, res) => { //สร้าง path สำหรับ delete (ลบข้อมูล)
    try {
        let id = req.params.id; //รับค่า id ที่ส่งมาจาก client เเละเก็บไว้ในตัวแปร id
        const results = await conn.query('DELETE From users WHERE id = ?', id) // SET ? ทำให้เก็บข้อมูลได้ง่ายไม่ต้องระบุฟิลด์ทีละฟิลด์
        res.json({
            message: 'User deleted', //ส่งข้อความกลับไปให้ client ว่าสร้างข้อมูลเสร็จสิ้น
            data: results[0]   //ส่งข้อมูลที่สร้างไปให้ client
        });
    } catch (error) {
        console.log('errorMessage:', error.message)
        res.status(500).json({
            message: 'Something went wrong',
            errorMessage: error.message
        })
    }
});

app.listen(port, async (req, res) => { //เปิด server ที่ port 8000 หรือคือเริ่มต้น express
    await initMySQL() //เรียกใช้ฟังก์ชัน initMySQL เพื่อเชื่อมต่อกับ MySQL
    console.log(`Server is running on port:` + port);
});