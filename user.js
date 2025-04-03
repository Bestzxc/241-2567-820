BASE_URL = 'http://localhost:8000';

window.onload = async () => {
    await loadedData();
}

const loadedData = async () => {
    console.log('loaded');

    // 1.โหลด user ทั้งหมด จาก api
    const response = await axios.get(`${BASE_URL}/users`);
    console.log(response.data);

    // 2.นำ user ที่โหลดมาเเสดงผลใน HTML
    const userDOM = document.getElementById('user');

    let htmlData = '<div class="user-items-container">';
    for (let i = 0; i < response.data.length; i++) {
        let user = response.data[i];
        htmlData += `
        <div class="user-item">
            <div class="user-info">
                <span>${user.id}</span> 
                <span>${user.firstname}</span>
                <span>${user.age}</span>
                <span>${user.gender}</span>
                <span>${user.interest}</span>
                <span>${user.description}</span>
            </div>
            <div class="gap">
                <a href="index1.html?id=${user.id}" class="edit-btn"><button>Edit</button></a>
                <button class="delete-btn" data-id="${user.id}">Delete</button>
            </div>
        </div>
    `;
    }
    htmlData += '</div>';
    userDOM.innerHTML = htmlData;

    //3.ลบ user 
    const deleteDOMs = document.getElementsByClassName('delete');
    for (let i = 0; i < deleteDOMs.length; i++) {
        deleteDOMs[i].addEventListener('click', async (event) => {
            const id = event.target.dataset.id;
            try {
                await axios.delete(`${BASE_URL}/user/${id}`);
                loadedData(); //recursive function เรียกใช้ฟังก์ชันตัวเอง
            } catch (error) {
                console.log('error', error);
            }
        });
    }
}
