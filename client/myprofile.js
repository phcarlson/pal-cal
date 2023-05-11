import * as crud from './crudclient.js';
let requestListCol = document.getElementById("requestListCol");

let mockCurrUsername = "ananya";
let mockCurrUser = {username: "ananya", friendsList:[], requestsList:[{username:"paige"}, {username:"amey"}, {username:"adin"}, {username:"other"}, {username:"other2"}]};

const queryString = window.location.search; // Returns:'?q=123'
const params = new URLSearchParams(queryString);
try{
    console.log(params.get("profileUser"));
    const friendObj = await crud.getUser(params.get("profileUser"));
}
catch(error){
    console.log(error);
}

function renderRequests(mockCurrUsername){
    // let user = crud.getUser(mockCurrUsername);
    mockCurrUser.requestsList.forEach((userRequest)=>{

        //userNameRequest
        //let requestObj = usercrud.getUser(userNameRequest);
        //requestObj.image

        let requestImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaIOsrWSBcmzWt30slQn0bplk5h92cKZSn84TfE4j6sI-rsxNLKWGWRbTpdP_LB9B8fEs&usqp=CAU";

        let requestCardToInsert =  `<div id="${userRequest.username}RequestCard" class="card my-3">`+
        '<div class="row g-0">'+
          '<div class="col-md-2 d-flex">'+
            '<img'+
                `src=${requestImage}`+
              'alt="generic profile pic" class="img-fluid rounded-start">'+
          '</div>'+
          '<div class="col-md-4 d-flex align-items-center">'+
            '<div class="card-body">'+
              `<h5 class="card-title text-start">${userRequest.username}</h5>`+
            '</div>'+
          '</div>'+
          '<div class="col-md-4 d-flex align-items-center justify-content-center">'+
            '<div class="btn-group" role="group" aria-label="Basic example">'+

              `<button id="${userRequest.username}AddButton" type="button"`+
                'class="btn btn-outline-success shadow btn-circle btn-lg d-flex align-items-center justify-content-center">'+
                '<i class="bi bi-check2"></i>'+
              '</button>'+
              `<button id="${userRequest.username}RejectButton" type="button"`+
                'class="btn btn-outline-danger shadow btn-circle btn-lg d-flex align-items-center justify-content-center">'+
                '<i class="bi bi-x-lg"></i>'+
              '</button>'+
            '</div>'+

          '</div>'+
        '</div>'+
      '</div>';

      requestListCol.insertAdjacentHTML("beforeend", requestCardToInsert);

      let requestAddButton = document.getElementById(`${userRequest.username}AddButton`);
      let requestRejectButton = document.getElementById(`${userRequest.username}RejectButton`);

      let requestCard = document.getElementById(`${userRequest.username}RequestCard`);

      function setUpRequestHandler(button, buttonClass){
        button.addEventListener("click", (event)=>{
            button.className = `btn ${buttonClass} shadow btn-circle btn-lg d-flex align-items-center justify-content-center`;
            if(buttonClass === 'btn-success'){
            //crud.addFriend(userRequest.username);
            }
            setTimeout(function() {   //  call a 1.5 second setTimeout when the loop is called
                requestListCol.removeChild(requestCard);
              }, 1500);
          });
      }

      setUpRequestHandler(requestAddButton, "btn-success");
      setUpRequestHandler(requestRejectButton, "btn-danger");

    });
}


let screenNameInput = document.getElementById("screenNameInput");
let firstNameInput = document.getElementById("firstNameInput");
let lastNameInput = document.getElementById("lastNameInput");
let collegeInput = document.getElementById("collegeInput");
let majorInput = document.getElementById("majorInput");
let bioInput = document.getElementById("bioInput");
let editProfileButton = document.getElementById("editProfileButton");

function renderProfile(mockCurrUsername){
    // let user = crud.getUser(mockCurrUsername);
    let user = {username: "Me", fN: "Paige", lN: "Carlson", college:"Umas", major:"CS", bio:"AAAAAAAAAAAAAAAAAAAAAAAAA"};

    screenNameInput.value = user.username;
    firstNameInput.value = user.fN;
    lastNameInput.value = user.lN;
    collegeInput.value = user.college;
    majorInput.value = user.major;
    bioInput.value = user.bio;
}

editProfileButton.addEventListener("click", (event)=>{
    if(editProfileButton.innerHTML === '<i class="bi bi-pencil-square"></i>'){
        editProfile(mockCurrUsername);
    }

    else{
        saveProfile(mockCurrUsername);
    }
});

function editProfile(mockCurrUsername){
    let toEdit = [
        screenNameInput, 
        firstNameInput,
        lastNameInput,
        collegeInput,
        majorInput,
        bioInput];

    toEdit.forEach((editElem) =>{
        editElem.removeAttribute("readonly");
    });

    editProfileButton.innerHTML = '<i class="bi bi-check-square-fill"></i>';

}


function saveProfile(mockCurrUsername){

    let toEdit = [
        screenNameInput, 
        firstNameInput,
        lastNameInput,
        collegeInput,
        majorInput,
        bioInput
    ];

    toEdit.forEach((editElem) =>{
        editElem.setAttribute("readonly", editElem.value);
    });

    editProfileButton.innerHTML = '<i class="bi bi-pencil-square"></i>';

    // Once values are set in stone, perform CRUD updates:
    
    //crud.setFirstName(firstNameInput.value);
    //crud.setLastName(lastNameInput.value);
    //crud.setCollege(collegeInput.value);
    //crud.setMajor(majorInput.value); //--> not currently a property in crud
    //crud.setBio(bioInput.value);
}

renderRequests(mockCurrUsername);
renderProfile(mockCurrUsername);