function submitData() {

let firstNameDOM = document.querySelector('input[name = firstname]');
let lastNameDOM = document.querySelector('input[name = lastname]');
let ageDOM = document.querySelector('input[name = age]');

let interest = '';

let genderDOM = document.querySelector('input[name = gender]:checked');
let interestsDOM = document.querySelectorAll('input[name = interest]:checked');
let descriptionDOM = document.querySelector('textarea[name=description]');

for(let i=0; i<interestsDOM.length; i++){
    interest += interestsDOM[i].value;
    if(i < interest.length-1){
        interest += ",";
    }

}

let userData = {
    firstname : firstNameDOM.value,
    lastname : lastNameDOM.value,
    age : ageDOM.value,
    gender : genderDOM.value,
    description: descriptionDOM.value,
    interests: interest
}

console.log('submitData', userData);
}