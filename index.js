const validatedata = (userData) => {
    let errors = [];
    if (!userData.firstname) {
        errors.push('กรุณากรอกชื่อ');
    }
    if (!userData.lastName) {
        errors.push('กรุณากรอกนามสกุล')
    }
    if (!userData.age) {
        errors.push('กรุณากรอกอายุ')
    }
    if (!userData.gender) {
        errors.push('กรุณากรอกนามสกุล')
    }
    if (!userData.interests) {
        errors.push('กรุณากรอกสิ่งที่สนใจ')
    }
    if (!userData.description) {
        errors.push('กรุณากรอกข้อมูลตัวเอง')
    }
    return errors;
}
const submitData = async () => {

    let firstNameDOM = document.querySelector('input[name = firstname]');
    let lastNameDOM = document.querySelector('input[name = lastname]');
    let ageDOM = document.querySelector('input[name = age]');



    let genderDOM = document.querySelector('input[name = gender]:checked') || {};
    let interestsDOM = document.querySelectorAll('input[name = interest]:checked') || {};
    let descriptionDOM = document.querySelector('textarea[name=description]');

    let messageDOM = document.querySelector('.message');

    try {
        let interest = '';

        for (let i = 0; i < interestsDOM.length; i++) {
            interest += interestsDOM[i].value;
            if (i < interest.length - 1) {
                interest += ",";
            }

        }

        let userData = {
            firstname: firstNameDOM.value,
            lastname: lastNameDOM.value,
            age: ageDOM.value,
            gender: genderDOM.value,
            description: descriptionDOM.value,
            interests: interest
        }

        console.log('submitData', userData);
        const errors = validatedata(userData);
        // if (errors.lenght > 0) {
        //     throw {
        //         message: 'กรุณากรอกข้อมูลให้ครบถ้วน',
        //         errors: errors
        //     }
        // }


        const response = await axios.post('http://localhost:8000/users', userData);
        console.log('response', response.data);
        messageDOM.innerText = "บันทึกข้อมูลเรียบร้อย";
        messageDOM.className = "message success";
    } catch (error) {
        console.log('error message', error.message)
        console.log('error', error.errors)
        if (error.response) {
            console.log(error.response)
            console.message = error.response.data.message;
            console.error = error.response.data.errors;
        }

        let htmlData = '<div>'
        htmlData += `<div>${error.message}</div>`
        htmlData += '<ul>'
        for (let i = 0; i < error.errors; i++) {
            htmlData += `<li>${error.errors[i]}</li>`
        }
        htmlData += '</ul>'
        htmlData += '</div>'

        messageDOM.innerText = "เกิดข้อผิดพลาด";
        messageDOM.className = "message danger";

    }
}