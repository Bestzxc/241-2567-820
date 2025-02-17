const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql2/promise');
app.use(bodyParser.json());
const port = 8000;
let users = []
let conn = null


//*GET /users สำหรับ get ข้อมูล user ทั้งหมด
//*POST /user สำหรับสร้าง create user ใหม่บันทึกเข้าไป
//*PUT /user/:id สำหรับ update ข้อมูล user รายคนที่ต้องการบันทึกเข้าไป
//*DELETE /user/:id สำหรับลบ user รายคนที่ต้องการออกไป

//1.GET /user/:id สำหรับ get ข้อมูล user รายคนที่ต้องการ
app.get('/testdb', (req, res) => {
    mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'webdb',
        port: 8830
    }).then((conn) => {
        conn
            .query('SELECT * FROM users')
            .then((results) => {
                res.json(results[0])
            })
            .catch((error) => {
                console.log('Error fetching users:', error.message)
                res.status(500).json({ error: 'Error fetching users' })
            })
    })
})

const initMySQL = async () => {
    conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'webdb',
        port: 8830
    })
}

app.get('/testdb-new', async (req, res) => {
    try {
        const results = await conn.query('SELECT * FROM users')
        res.json(results[0])
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

//2.path = POST / User
app.post('/users', async (req, res) => {
    let user = req.body; 
    const results = await conn.query('INSERT INTO users SET ?', user)
    console.log('results', results)
    res.json({
        message: 'User created',
        data: results[0]
    });
})

//3.path = PUT / user/:id
app.put('/user/:id', (req, res) => {
    let id = req.params.id;
    let updateUser = req.body;
    // find users from id request
    let selectedIndex = users.findIndex(user => user.id == id)
    // update user 
    if (updateUser.firstname) {
        users[selectedIndex].firstname = updateUser.firstname
    }
    if (updateUser.lastname) {
        users[selectedIndex].lastname = updateUser.lastname
    }

    users[selectedIndex].firstname = updateUser.firstname || users[selectedIndex].firstname
    users[selectedIndex].lastname = updateUser.lastname || users[selectedIndex].lastname

    res.json({
        message: 'User updated successfully',
        data: {
            user: updateUser,
            indexUpdate: selectedIndex
        }
    });
    // sent user info in update to where it belongs
    /* 
    GET / USERS = get all users
    POST / USERS = create new user in data
    GET /users/:id = get user by id
    PUT /users/:id = get user by id
    */
})

//4.Path = DELETE / user/:id
app.delete('/user/:id', (req, res) => {
    let id = req.params.id;
    // find index of user
    let selectedIndex = users.findIndex(user => user.id == id)

    users.splice(selectedIndex, 1)
    delete users[selectedIndex]
    res.json({
        message: 'Delete Completed',
        indexDelete: selectedIndex
    });
});

app.listen(port, async (req, res) => {
    await initMySQL()
    console.log(`Server is running on port` + port);
});