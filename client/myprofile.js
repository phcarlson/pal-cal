import { deleteFriendRequest } from '../server/database.js';
import * as crud from './crudclient.js';

// collect column of friend request lists to render in
let requestListCol = document.getElementById("requestListCol");

let mockCurrUsername = "username1";

let mockCurrUser = {username: "ananya", friendsList:[], requestsList:[{username:"paige"}, {username:"amey"}, {username:"adin"}, {username:"other"}, {username:"other2"}]};

//rendering friend requests
function renderRequests(mockCurrUsername){
    let user = crud.getUser(mockCurrUsername);

    crud.getRequestsTo(user.username).forEach((usernameRequest)=>{
        
      let defaultImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaIOsrWSBcmzWt30slQn0bplk5h92cKZSn84TfE4j6sI-rsxNLKWGWRbTpdP_LB9B8fEs&usqp=CAU";
      let currentImage = defaultImage;
      let friendRequestedUser = crud.getUser(usernameRequest);
      let requestImage = friendRequestedUser.image;
      
      if(requestImage !== ""){
          currentImage = requestImage;
      }
        
        let requestCardToInsert =  `<div id="${usernameRequest}RequestCard" class="card my-3">`+
        '<div class="row g-0">'+
          '<div class="col-md-2 d-flex">'+
            '<img'+
                `src=${currentImage}`+
              'alt="generic profile pic" class="img-fluid rounded-start">'+
          '</div>'+
          '<div class="col-md-4 d-flex align-items-center">'+
            '<div class="card-body">'+
              `<h5 class="card-title text-start">${usernameRequest}</h5>`+
            '</div>'+
          '</div>'+
          '<div class="col-md-4 d-flex align-items-center justify-content-center">'+
            '<div class="btn-group" role="group" aria-label="Basic example">'+

              `<button id="${usernameRequest}AddButton" type="button"`+
                'class="btn btn-outline-success shadow btn-circle btn-lg d-flex align-items-center justify-content-center">'+
                '<i class="bi bi-check2"></i>'+
              '</button>'+
              `<button id="${usernameRequest}RejectButton" type="button"`+
                'class="btn btn-outline-danger shadow btn-circle btn-lg d-flex align-items-center justify-content-center">'+
                '<i class="bi bi-x-lg"></i>'+
              '</button>'+
            '</div>'+
          '</div>'+
        '</div>'+
      '</div>';

      requestListCol.insertAdjacentHTML("beforeend", requestCardToInsert);

      //collect add and reject button for each friend request
      let requestAddButton = document.getElementById(`${usernameRequest}AddButton`);
      let requestRejectButton = document.getElementById(`${usernameRequest}RejectButton`);

      //collect the actual friend request card to remove below
      let requestCard = document.getElementById(`${usernameRequest}RequestCard`);

      //handles requests: add friends, removes friend requests from list
      function setUpRequestHandler(button, buttonClass){
        button.addEventListener("click", (event)=>{
            button.className = `btn ${buttonClass} shadow btn-circle btn-lg d-flex align-items-center justify-content-center`;
            if(buttonClass === 'btn-success'){
            crud.addFriend(user.username, usernameRequest);
            }
            setTimeout(function() {   //  call a momentary setTimeout when the loop is called
                requestListCol.removeChild(requestCard);
              }, 600);
            crud.removeFriendRequest(usernameRequest, user.username); //or removeFriendRequest?
          });
      }

      setUpRequestHandler(requestAddButton, "btn-success");
      setUpRequestHandler(requestRejectButton, "btn-danger");

    });
}

//collect the input holders for user's profile info
let screenNameInput = document.getElementById("screenNameInput");
let firstNameInput = document.getElementById("firstNameInput");
let lastNameInput = document.getElementById("lastNameInput");
let collegeInput = document.getElementById("collegeInput");
let majorInput = document.getElementById("majorInput");
let bioInput = document.getElementById("bioInput");
//let imageInput = document.getElementbyId 

//collect edit button
let editProfileButton = document.getElementById("editProfileButton");

//fill user's profile with their information
function renderProfile(mockCurrUsername){
    let user = crud.getUser(mockCurrUsername);
    // let user = {username: "Me", fN: "Paige", lN: "Carlson", college:"Umas", major:"CS", bio:"AAAAAAAAAAAAAAAAAAAAAAAAA"};

    screenNameInput.value = user.username;
    firstNameInput.value = user.firstName;
    lastNameInput.value = user.lastName;
    collegeInput.value = user.college;
    majorInput.value = user.major;
    bioInput.value = user.bio;
    //imageInput.value = user.image;

}

//click edit button, turns into save button when editing to then save info
editProfileButton.addEventListener("click", (event)=>{
    if(editProfileButton.innerHTML === '<i class="bi bi-pencil-square"></i>'){
        editProfile(mockCurrUsername);
    }
    else{
        saveProfile(mockCurrUsername);
    }
});

//makes input areas edit-able
function editProfile(mockCurrUsername){
    let toEdit = [
        screenNameInput, 
        firstNameInput,
        lastNameInput,
        collegeInput,
        majorInput,
        bioInput
      ]; //and imageInput

    toEdit.forEach((editElem) =>{
        editElem.removeAttribute("readonly");
    });

    //switches to save button icon
    editProfileButton.innerHTML = '<i class="bi bi-check-square-fill"></i>';

}

//makes input areas readonly
function saveProfile(mockCurrUsername){
    let toSave = [
        screenNameInput, 
        firstNameInput,
        lastNameInput,
        collegeInput,
        majorInput,
        bioInput
    ]; //and imageInput

    toSave.forEach((saveElem) =>{
        saveElem.setAttribute("readonly", saveElem.value);
    });
    
    //switches back to edit button icon
    editProfileButton.innerHTML = '<i class="bi bi-pencil-square"></i>';
 
    // Once values are set in stone, perform CRUD updates:
    let user = crud.getUser(mockCurrUsername);
    crud.updateUser(user.username, {username: screenNameInput.value, firstName: firstNameInput.value, lastName: lastNameInput.value, college: collegeInput.value, bio: bioInput.value});
    crud.updateUser(user.username, {major: majorInput}); 
    //crud.updateUser(user.username, {image: imageInput}); 
}

renderRequests(mockCurrUsername);
renderProfile(mockCurrUsername);