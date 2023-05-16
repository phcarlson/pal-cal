import * as crud from './crudclient.js';
import { initializeCalendar, rerender } from './calendar.js';
let requestListCol = document.getElementById("requestListCol");
let calendarDiv = document.getElementById("calendar");
let scheduleLabel = document.getElementById("scheduleLabel");
let infoLabel = document.getElementById("infoLabel");

let currUsername = null;
let profileUserObj = null;
let profileUser = null;

const queryString = window.location.search; // Returns:'?q=123'
const params = new URLSearchParams(queryString);
try{
    currUsername = document.cookie
    .split("; ")
    .find((row) => row.startsWith("currUsername="))
    ?.split("=")[1];

    profileUser = params.get("profileUser");
    if(profileUser === null){
      profileUser = currUsername;
      profileUserObj = await crud.getUser(currUsername);
    }
    else{
      profileUserObj = await crud.getUser(profileUser);
    }
}
catch(error){
    // Create alert of issue
    let child = document.createElement('div')
    child.innerHTML = '<div id="deleteAlert" class="alert alert-danger" role="alert">'+
                    'Refresh page, possibly offline</div>';   
    calendarDiv.after(child);
}

//rendering friend requests
async function renderRequests(profileUser){
    let requestsList = await crud.getRequestsTo(profileUser);

    requestsList.forEach(async (requestUsername) => {
      let friendRequestedUser = await crud.getUser(requestUsername);
      let defaultImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaIOsrWSBcmzWt30slQn0bplk5h92cKZSn84TfE4j6sI-rsxNLKWGWRbTpdP_LB9B8fEs&usqp=CAU";
      let image = 
      friendRequestedUser.image !== '' && 
      friendRequestedUser.image !== null && 
      friendRequestedUser.image !== undefined &&
      friendRequestedUser.image !== "/x" ? 
      friendRequestedUser.image : defaultImage;

        let requestCardToInsert =  `<div id="${requestUsername}RequestCard" class="card my-3">`+
        '<div class="row g-0">'+
          '<div class="col-md-2 d-flex">'+
            '<img'+
                `src=${image}`+
              'alt="generic profile pic" class="img-fluid rounded-start">'+
          '</div>'+
          '<div class="col-md-4 d-flex align-items-center">'+
            '<div class="card-body">'+
              `<h5 class="card-title text-start">${requestUsername}</h5>`+
            '</div>'+
          '</div>'+
          '<div class="col-md-4 d-flex align-items-center justify-content-center">'+
            '<div class="btn-group" role="group" aria-label="Basic example">'+

              `<button id="${requestUsername}AddButton" type="button"`+
                'class="btn btn-outline-success shadow btn-circle btn-lg d-flex align-items-center justify-content-center">'+
                '<i class="bi bi-check2"></i>'+
              '</button>'+
              `<button id="${requestUsername}RejectButton" type="button"`+
                'class="btn btn-outline-danger shadow btn-circle btn-lg d-flex align-items-center justify-content-center">'+
                '<i class="bi bi-x-lg"></i>'+
              '</button>'+
            '</div>'+
          '</div>'+
        '</div>'+
      '</div>';

      requestListCol.insertAdjacentHTML("beforeend", requestCardToInsert);

      //collect add and reject button for each friend request
      let requestAddButton = document.getElementById(`${requestUsername}AddButton`);
      let requestRejectButton = document.getElementById(`${requestUsername}RejectButton`);

      //collect the actual friend request card to remove below
      let requestCard = document.getElementById(`${requestUsername}RequestCard`);

      //handles requests: add friends, removes friend requests from list
      async function setUpRequestHandler(button, buttonClass){
        button.addEventListener("click", async (event)=>{
            button.className = `btn ${buttonClass} shadow btn-circle btn-lg d-flex align-items-center justify-content-center`;
            if(buttonClass === 'btn-success'){
              await crud.addFriend(profileUser, requestUsername);
              //buttonType = 'class="btn btn-outline-danger disabled">Already added';
            }
            setTimeout(function() {   //  call a momentary setTimeout when the loop is called
                requestListCol.removeChild(requestCard);
              }, 600);
              await crud.removeFriendRequest(requestUsername, profileUser);
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
let imageInput = document.getElementById("imageInput");

//collect edit button
let editProfileButton = document.getElementById("editProfileButton");
let savePhotoButton = document.getElementById("savePhotoButton");
let editPhotoButton =  document.getElementById("editPhotoButton");
let busyEventbutton = document.getElementById("button-new-busy-event");
//fill user's profile with their information
async function renderProfile(profileUser){
  let user = await crud.getUser(profileUser);

  // Grab info from DB for each info card
  screenNameInput.value = user.username;
  firstNameInput.value = user.firstName;
  lastNameInput.value = user.lastName;
  collegeInput.value = user.college;
  majorInput.value = user.major;
  bioInput.value = user.bio;

  // Check if image exists otherwise use default
  let defaultImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaIOsrWSBcmzWt30slQn0bplk5h92cKZSn84TfE4j6sI-rsxNLKWGWRbTpdP_LB9B8fEs&usqp=CAU";
  let image = 
  profileUserObj.image !== '' && 
  profileUserObj.image !== null && 
  profileUserObj.image !== undefined &&
  profileUserObj.image !== "/x" ? 
  profileUserObj.image : defaultImage;
  imageInput.src = image;

  scheduleLabel.innerText = currUsername === profileUser ? "My Schedule" : `${profileUser}'s Schedule`;
  infoLabel.innerText = currUsername === profileUser ? "My Info" : `${profileUser}'s Info`;

  // Determine inactive input or active based on whether this is your profile
  if(currUsername !== profileUser){
      let toEdit = [
        screenNameInput, 
        firstNameInput,
        lastNameInput,
        collegeInput,
        majorInput,
        bioInput
      ];
    
    // Disable input from being edited
    toEdit.forEach((editElem) =>{
        editElem.setAttribute("readonly", true);
    });

    // Disable buttons 
    editProfileButton.setAttribute("disabled", true);
    editPhotoButton.classList.add('d-none');
    editPhotoButton.setAttribute("disabled", true);
    editProfileButton.classList.add('d-none');
    busyEventbutton.setAttribute("disabled", true);
    busyEventbutton.classList.add('d-none');

    // Remove view of requests and expand person's info
    requestListCol.classList.add('d-none');
    let requestLabelCol = document.getElementById("requestLabelCol");
    requestLabelCol.classList.add('d-none');
    let infoRow = document.getElementById("infoRow");
    infoRow.style.height = "75%";
    
      // Also determine if you can see their schedule based on friendship status
      if(await crud.areFriends(profileUser, currUsername) === false){
        calendarDiv.innerHTML = "<h1>Can't see their calendar? Shoot them a friend request first!</h1>";
        calendarDiv.style.backgroundColor = "gray";
      }
  }
}

// Allows us to convert uploaded group image to string
const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
});

savePhotoButton.addEventListener("click", async (event)=>{
  try {
    let uploadedImage = document.getElementById("profilePhotoUpload");
    let image = null;
    if(uploadedImage.files[0] !== undefined){
      image =  await toBase64(uploadedImage.files[0]);
    }
    else{
      image = '';
    }

    let user = await crud.getUser(currUsername);
    await crud.updateUser(user.username, {image: image}); 
    imageInput.src = image;
  } catch (error) {
    let child = document.createElement('div')

    if(error.message.startsWith("Unexpected error: Error: Payload Too Large")){
        // Create temp alert of issue
        child.innerHTML = '<div id="deleteAlert" class="alert alert-danger" role="alert">'+
                            'Image too large, failed to upload</div>';     
        imageInput.after(child);
        setTimeout(function(){
            child.remove();
            },2500); 
    }
    else{
        // Create temp alert of issue
        child.innerHTML = '<div id="deleteAlert" class="alert alert-danger" role="alert">'+
                            'Refresh page as upload failed, possibly offline</div>';   
    }
  }
});


//click edit button, turns into save button when editing to then save info
editProfileButton.addEventListener("click", async (event)=>{
    if(editProfileButton.innerHTML === '<i class="bi bi-pencil-square"></i>'){
        editProfileMode();
    }
    else{
        await saveProfile(profileUser);
    }
});

//makes input areas edit-able
function editProfileMode(){
    let toEdit = [
        screenNameInput, 
        firstNameInput,
        lastNameInput,
        collegeInput,
        majorInput,
        bioInput
      ];

    toEdit.forEach((editElem) =>{
        editElem.removeAttribute("readonly");
    });

    //switches to save button icon
    editProfileButton.innerHTML = '<i class="bi bi-check-square-fill"></i>';
}

//makes input areas readonly
async function saveProfile(profileUser){
    let toSave = [
        screenNameInput, 
        firstNameInput,
        lastNameInput,
        collegeInput,
        majorInput,
        bioInput
    ]; 

    toSave.forEach((saveElem) =>{
        saveElem.setAttribute("readonly", saveElem.value);
    });
    
    //switches back to edit button icon
    editProfileButton.innerHTML = '<i class="bi bi-pencil-square"></i>';
 
    // Once values are set in stone, perform CRUD updates:
    await crud.updateUser(profileUser, 
      {username: screenNameInput.value, firstName: firstNameInput.value, lastName: lastNameInput.value, 
        college: collegeInput.value, bio: bioInput.value, major: majorInput.value});    
}

await initializeCalendar(document.getElementById("calendar"), "profile");
await rerender("profile");

await renderRequests(profileUser);
await renderProfile(profileUser);

