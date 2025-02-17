const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
const port = 8000;

//เก็บ user
let users = []
let counter = 1

/*
GET /user สำหรับ get users ทั้งหมด
POST /users สำหรับเพิ่ม user ใหม่เข้าไป
DELETE /users/:id สำหรับลบ user ที่มี id ตามที่ระบุ
GET /users/:id สำหรับ get user ที่มี id ตามที่ระบุ
PUT /users/:id สำหรับ update user ที่มี id ตามที่ระบุ
*/

//path = GET /users
app.get('/users', (req, res) => {
    res.json(users);
});

//path = POST /user
app.post('/user', (req, res) => {
    let user = req.body;
    user.id = counter
    counter += 1
    users.push(user);
    res.json({message: "User created",user: user});
});

//path = PUT /user/:id
app.put('/user/:id', (req, res) => {
  let id = req.params.id;
  let updateUser = req.body;
  // หา user จาก id ที่ส่งมา
  let selectedIndex = users.findIndex(user => user.id == id)
  // update user นั้น
  if (updateUser.firstname) {
    users[selectedIndex].firstname = updateUser.firstname
  }
  if (updateUser.lastname) {
    users[selectedIndex].lastname = updateUser.lastname
  }

  res.json({message: "User updated",
    data:{
     user: updateUser,
     indxUpdate: selectedIndex
    }
});
  //ส่งข้อมูล user ที่ update กลับเข้าที่เดิม
  res.send(id)
});

//path = DELETE /user/:id
app.delete('/user/:id', (req, res) => {
  let id = req.params.id;
  //หา index ของ user ที่ต้องการลบ
  let selectedIndex = users.findIndex(user => user.id == id)

users.splice(selectedIndex, 1);
  res.json({message: "Delete Completed",indexDelete: selectedIndex});
});
app.listen(port, (req, res) => {
    console.log('Server is running on port' + port);
});