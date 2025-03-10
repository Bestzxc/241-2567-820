BASE_URL = 'http://localhost:8000';

window.onload = async() => {
    await loadedData();
}

const loadedData = async() =>{
    console.log('loaded');

    // 1.โหลด user ทั้งหมด จาก api
    const response = await axios.get(`${BASE_URL}/users`);
    console.log(response.data);

    // 2.นำ user ที่โหลดมาเเสดงผลใน HTML
    const userDOM = document.getElementById('user');

    let htmlData = '<div>';
    for (let i=0 ; i<response.data.length; i++){
        let user = response.data[i];
        htmlData += `<div>
        ${user.id} ${user.firstname} ${user.lastname} 
        <a href="index1.html?id=${user.id}"><button>Edit</button></a>
        <button class='delete' data-id='${user.id}'>Delete</button>
        </div>`
    }
    htmlData += '</div>';
    userDOM.innerHTML = htmlData;

    //3.ลบ user 
    const deleteDOMs = document.getElementsByClassName('delete');
    for (let i=0; i<deleteDOMs.length; i++){
        deleteDOMs[i].addEventListener('click', async (event) => {
            const id = event.target.dataset.id;
            try{
                await axios.delete(`${BASE_URL}/user/${id}`);
                loadedData(); //recursive function เรียกใช้ฟังก์ชันตัวเอง
            } catch{
                console.log('error', error);
            }
        });
    }
}
