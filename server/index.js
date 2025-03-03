const express = require('express'); //express = เว็บ framework ของ node.js เพื่อให้สร้าง API ได้ง่ายขึ้น
const bodyParser = require('body-parser'); // body-parser = แปลงข้อมูล HTTP ที่เข้ามาให้เป็น json 
const app = express(); //เก็บ express ไว้ในตัวแปร app
const mysql = require('mysql2/promise'); // ใช้เชื่อมต่อเเละสั่งงานเเบบ async/await
app.use(bodyParser.json()); //กำหนดให้ express รองรับ JSON request body
const port = 8000; //กำหนดให้รันที่ port 8000
const cors = require('cors'); //เป็น middleware ที่ช่วยให้เราสามารถเรียกใช้ API จาก domain อื่นได้

let users = [] //เก็บข้อมูล user ทั้งหมดในหน่วยความจำ
let conn = null //เก็บ connection ไว้ใช้งาน
app.use(cors()); //ใช้ cors ใน express

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
app.get('/users/:id', async(req, res) => {
    try{
        let id = req.params.id;
        const results = await conn.query('SELECT * FROM users WHERE id = ?', id)
        if (results[0].length == 0) {
            throw {statusCode: 404, message: 'User not found'}
        }
        res.json(results[0][0])
    } catch (error) {
        console.error('errorMessage',error.message)
        let statusCode = error.statusCode || 500
        res.status(statusCode).json({
           message: 'something went wrong',
           errorMessage: error.message
        })
    }
})

//2.path = POST / User
app.post('/users', async (req, res) => { //สร้าง path /users สำหรับ post (สร้างข้อมูลใหม่)
    try {
        let user = req.body; //เก็บข้อมูลที่ส่งมาจาก client ที่อยู่ใน body ไว้ในตัวแปร user
        const result = await conn.query('INSERT INTO users SET ?', user) //เพิ่มข้อมูลใหม่ลงในตาราง users โดยใช้คำสั่ง SQL
        res.json({
            message: 'User created', //ส่งข้อความกลับไปให้ client
            data: result[0] //id ของ user ที่เพิ่มเข้าไปในตาราง users
        })
    } catch (error) {
        console.log('Error updating user:', error.message) //แสดงข้อความ error ใน console
        res.status(500).json({ //บอกว่าเกิด error ในการอัพเดทข้อมูลฝั่ง server รหัสคือ 500
            message: 'Something went wrong',
            errorMessage: error.message
        })
    }
})

//3.path = PUT / user/:id 
app.put('/user/:id', async (req, res) => { //สร้าง path สำหรับ put (อัพเดทข้อมูล)
    try {
        let id = req.params.id; //เก็บ id ที่ส่งมาจาก client ที่อยู่ใน parameter
        let updateUser = req.body; //เก็บข้อมูลที่ส่งมาจาก client ที่อยู่ใน body ไว้ในตัวแปร user
        const result = await conn.query('UPDATE users SET ? WHERE id = ?', [updateUser, id]) //อัพเดทข้อมูลใหม่ลงในตาราง users โดยใช้คำสั่ง SQL
        res.json({
            message: 'Updated user', //ส่งข้อความกลับไปให้ client
            data: result[0] //id ของ user ที่เพิ่มเข้าไปในตาราง users
        })
    } catch (error) {
        console.log('Error creating user:', error.Message) //แสดงข้อความ error ใน console
        res.status(500).json({ //บอกว่าเกิด error ในการสร้างข้อมูลฝั่ง server รหัสคือ 500
            message: 'Something went wrong',
            errorMessage: error.message
        })
    }
})

//4.Path = DELETE / user/:id
app.delete('/user/:id', async (req, res) => { 
    try {
        let id = req.params.id; //เก็บ id ที่ส่งมาจาก client ที่อยู่ใน parameter
        const result = await conn.query('DELETE FROM users WHERE id = ?', id) //ลบข้อมูลในตาราง users โดยใช้คำสั่ง SQL
        res.json({
            message: 'Deleted user', //ส่งข้อความกลับไปให้ client
            data: result[0] //id ของ user ที่เพิ่มเข้าไปในตาราง users
        })
    } catch (error) {
        console.log('Error creating user:', error.Message) //แสดงข้อความ error ใน console
        res.status(500).json({ //บอกว่าเกิด error ในการสร้างข้อมูลฝั่ง server รหัสคือ 500
            message: 'Something went wrong',
            errorMessage: error.message
        })
    }
});

app.listen(port, async (req, res) => { //เปิด server ที่ port 8000 หรือคือเริ่มต้น express
    await initMySQL() //เรียกใช้ฟังก์ชัน initMySQL เพื่อเชื่อมต่อกับ MySQL
    console.log(`Server is running on port` + port);
});