//import module เพิ่มสร้าง server ด้วย http
const http = require('http');

const host = 'localhost'; //กำหนด host ที่จะรอรับ request
const port = 8000; //กำหนด port ที่จะรอรับ request

//กำหนดค่าเพริ่มต้นของ server
const requestListener = function (req, res) {
    res.writeHead(200); //ส่ง status code 200 กลับไป
    res.end('My first server!'); //ส่ง response กลับไปให้ client
}

const server = http.createServer(requestListener); //สร้าง server ด้วย http.createServer โดยใช้ requestListener ที่เราสร้างไว้
    server.listen(port, host, () => { //เริ่มรอรับ request ด้วย server.listen โดยรอรับที่ port 8000 และ host ที่กำหนดไว้
        console.log(`Server is running on http://${host}:${port}`); //แสดงข้อความว่า server กำลังทำงานอยู่ที่ http://localhost:8000
    });