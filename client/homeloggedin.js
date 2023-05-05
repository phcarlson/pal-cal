
import * as crud from "./crudclient.js";

// collect column for friends and groups to render in
let friendsCol = document.getElementById('scrollableFriendsList');
let groupsCol = document.getElementById('scrollableGroupList');
let potentialMembers = document.getElementById('potentialMembers');

// selection for making new group with members which starts empty
let selectedMembers = [];

// our pretend user ID logged in currently
let mockusername = "username1";

async function renderFriends(username) {
    //wipe
    friendsCol.innerHTML = "";

    const friendsList = await crud.getFriends(username);

    let image = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaIOsrWSBcmzWt30slQn0bplk5h92cKZSn84TfE4j6sI-rsxNLKWGWRbTpdP_LB9B8fEs&usqp=CAU";
    for(let friend of friendsList){
        let friendToInsert =
        `<div id=${friend}FriendCard class="card my-3">` +
            '<div class="row g-0">' +
                '<div class="col-md-2 d-flex">' +
                    `<img src=${image}` +
                        'alt="generic profile pic" class="img-fluid rounded-start">' +
                '</div>' +
                '<div class="col-md-8 d-flex align-items-center">' +
                    '<div class="card-body">' +
                        `<h5 class="card-title text-start">${friend}</h5>` +
                    '</div>' +
                '</div>' +
                '<div class="col-md-2 d-flex flex-column align-items-end justify-content-end">' +
                    '<div class="dropdown">' +
                        '<button class="btn btn btn-lg btn-flash-border-primary dropdown-toggle"' +
                            'type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown"' +
                            'aria-expanded="false"></button>' +
                        '<ul class="dropdown-menu opacity-75 " aria-labelledby="dropdownMenuButton1">' +
                            `<li><a id=${friend}Profile class="dropdown-item" href="#">Go to profile <i ` +
                                'class="bi bi-person-fill"></i></a></li>'+
                            `<li><a id=${friend}RemoveCard class="dropdown-item" href="#">Remove friend` +
                                '<i class="bi bi-trash"></i></a></li>' +
                        '</ul>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>';

        friendsCol.insertAdjacentHTML("beforeend", friendToInsert);
        let friendDeleteButton = document.getElementById(friend + 'RemoveCard');
        friendDeleteButton.addEventListener('click', async (event) => {
            await removeFriendFromUser(friend, mockusername);
        });

        let friendProfileButton = document.getElementById(friend + 'Profile');
        friendProfileButton.addEventListener('click', (event) => {
            
        });   
    }
}

async function renderGroups(currUserID) {
    groupsCol.innerHTML = "";

    let groupsList = await crud.getGroupIdsOfUser(currUserID);
    for(let groupID of groupsList){
        await renderGroup(groupID, currUserID);
    }
   
}

async function renderGroup(groupID, currUserID){
    let groupObj = getGroup(groupID);
    let groupName = await groupObj.getGroupName();
    let image = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaIOsrWSBcmzWt30slQn0bplk5h92cKZSn84TfE4j6sI-rsxNLKWGWRbTpdP_LB9B8fEs&usqp=CAU";
    let groupToInsert =
    `<div id=${groupID}GroupCard class="card my-3">` +
        '<div class="row g-0">' +
            '<div class="col-md-2 d-flex">' +
                `<img src=${image}` +
                    'alt="generic profile pic" class="img-fluid rounded-start">' +
            '</div>' +
            '<div class="col-md-8 d-flex align-items-center">' +
                '<div class="card-body">' +
                    `<h5 class="card-title text-start">${groupName}</h5>` +
                '</div>' +
            '</div>' +
            '<div class="col-md-2 d-flex flex-column align-items-end justify-content-end">' +
                '<div class="dropdown">' +
                    '<button class="btn btn btn-lg btn-flash-border-primary dropdown-toggle"' +
                        'type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown"' +
                        'aria-expanded="false"></button>' +
                    '<ul class="dropdown-menu opacity-75 " aria-labelledby="dropdownMenuButton1">' +
                    `<li><a id=${groupID}RemoveCard class="dropdown-item" href="#">Leave group<i ` +
                                'class="bi bi-trash"></i></a></li></ul>'+
                    '</ul></div></div></div></div>';

    groupsCol.insertAdjacentHTML("afterbegin", groupToInsert);

    let groupDeleteButton = document.getElementById(groupID + 'RemoveCard');
    groupDeleteButton.addEventListener('click', async (event) => {
        await removeGroupFromUser(currUserID, groupID);
    });
}
async function renderPotentialFriend(userIDToFriendRequest, currUserID, potentialFriends){
    
    // Temp image while we sort out image upload
    let image = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaIOsrWSBcmzWt30slQn0bplk5h92cKZSn84TfE4j6sI-rsxNLKWGWRbTpdP_LB9B8fEs&usqp=CAU";
    // User that we know exists to be found in friend search
    let userToFriendRequest = await crud.getUser(userIDToFriendRequest);
    // If already friends, then indicate that in the card result. Otherwise allow us to add them!
    let areFriends = await crud.areFriends(currUserID, userIDToFriendRequest);
    let buttonType = areFriends ? 'class="btn btn-success disabled">Already added' : 'class="btn btn-outline-secondary">Add';

    let potentialFriend = '<div class="card my-3">' +
        '<div class="row g-0">' +
            '<div class="col-md-2 d-flex">' +
                `<img src=${image}` +
                    'alt="generic profile pic" class="img-fluid rounded-start">'+
            '</div>' +
            '<div class="col-md-8 d-flex align-items-center">'+
                '<div class="card-body">'+
                    `<h5 class="card-title text-start">${userIDToFriendRequest}</h5>`+
                '</div>'+
            '</div>'+
            '<div class="col-md-2 d-flex flex-column align-items-end justify-content-end">'+
                `<button id="${userIDToFriendRequest}AddButton" type="button" ${buttonType}</button>`+
            '</div>'+
        '</div>'+
    '</div>';
    
    // Whether or not they are already friends, add respective card to indicate that
    potentialFriends.insertAdjacentHTML("afterbegin", potentialFriend);
    
    // No need for event handlers, no adding mechanism necessary for user that's already a friend so just return
    if(areFriends){
        return;
    }
    // Otherwise we need to add listeners for adding friend
    else{
        let addFriendButton = document.getElementById(`${userIDToFriendRequest}AddButton`);
        addFriendButton.addEventListener('click', async (event) => {
            // // have a friend request sent, does not immediately add friend
            // await crud.addFriendRequest(currUserID, userIDToFriendRequest);
            try {
                // //just for testing purposes
                // let areFriends = await crud.areFriends(currUserID, userIDToFriendRequest);
                // if(areFriends){
                //     addFriendButton.className = "btn btn-success";
                //     addFriendButton.innerText = "Already added"
                // }
                // else{
                    await crud.addFriend(currUserID, userIDToFriendRequest);
                    await renderFriends(currUserID);
                    await renderPotentialMembers(currUserID);

                    // alert user after CRUD that the friend worked
                    addFriendButton.className = "btn btn-success";
                    addFriendButton.innerText = "Added"
                    addFriendButton.disabled = true;
                // }
            }
            catch(error){
                // Indicate that some error occurred when trying to add
                addFriendButton.className = "btn btn-danger";
                addFriendButton.innerText = "Try again later";
                // After certain amount of time, flip it back to Add button to try again
                setTimeout(function() {   
                    addFriendButton.className = "btn btn-outline-primary";
                    addFriendButton.innerText = "Add";
                }, 1000);
            }
        });
        return;
    }
}

function renderPotentialMember(userToAdd){
    let image = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaIOsrWSBcmzWt30slQn0bplk5h92cKZSn84TfE4j6sI-rsxNLKWGWRbTpdP_LB9B8fEs&usqp=CAU";

    let potentialMember = '<div class="card my-3">' +
    '<div class="row g-0">' +
        '<div class="col-md-2 d-flex justify-content-center align-items-center">'+
            '<div class="form-check checkbox-xl">'+
                `<input class="form-check-input" type="checkbox" value="" id=${userToAdd}Checkbox>`+
            '</div>'+
        '</div>'+
        '<div class="col-md-2 d-flex">' +
            `<img src=${image}` +
                'alt="generic profile pic" class="img-fluid rounded-start">'+
        '</div>' +
        '<div class="col-md-8 d-flex align-items-center">'+
            '<div class="card-body">'+
                `<h5 class="card-title text-start">${userToAdd}</h5>`+
            '</div>'+
        '</div>'+
    '</div>'+
'</div>';

    return potentialMember;
}

async function renderPotentialMembers(currUserID){
    let friendsList = await crud.getFriends(currUserID);
    potentialMembers.innerHTML = ""

    let image = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaIOsrWSBcmzWt30slQn0bplk5h92cKZSn84TfE4j6sI-rsxNLKWGWRbTpdP_LB9B8fEs&usqp=CAU";
     friendsList.forEach((friend) => {
        let potentialMemberToInsert = renderPotentialMember(friend);
        potentialMembers.insertAdjacentHTML("beforeend", potentialMemberToInsert);

        let checkFriend = document.getElementById(`${friend}Checkbox`);
        checkFriend.addEventListener('click', (event) => {
            if (checkFriend.checked == true){ 
                selectedMembers.push(friend);
            }
            else if (checkFriend.checked == false){ 
                let index = selectedMembers.indexOf(friend);
                selectedMembers.splice(index, 1); 
            }
        });
      });
}

async function removeGroupFromUser(currUserID, groupID){
    await crud.removeMember(groupID, currUserID);
    // let groupToDelete = document.getElementById(groupID + 'GroupCard');
    // groupsCol.removeChild(groupToDelete);
    await renderGroups(currUserID);
}

async function removeFriendFromUser(friendUserID, currUserID){
    try{
        await crud.deleteFriend(currUserID, friendUserID);
        await renderFriends(currUserID);
        await renderPotentialMembers(currUserID);
    }
    // In the case that it cannot delete, there is either an error with DB or the server is offline so we alert of that
    catch(error){
        let child = document.createElement('div')
        child.innerHTML = '<div id="deleteAlert" class="alert alert-danger" role="alert">'+
                        'Try again later, possibly offline</div>';   

        let friendCardToDelete = document.getElementById(`${friendUserID}FriendCard`);
        friendCardToDelete.after(child);
        setTimeout(function(){
            let toRemove = document.getElementById(`deleteAlert`);
            toRemove.remove();
            },2500);
    }
   

    // Remove single friend without rerendering entire friends list:
    // let friendToDelete = document.getElementById(friendUsername + 'FriendCard');
    // friendsCol.removeChild(friendToDelete);
}


// Listens for group creation, deselects boxes and wipes those that are selected
let makeGroupButton = document.getElementById("makeGroupButton");
makeGroupButton.addEventListener('click', async (event) => {
    let groupName = document.getElementById('groupNameInput');

    //TODO: collapse accordion of potential members on close always
    let accordionFriends = document.getElementById('flush-collapseOne');

    // form new group with unique id, get the obj, set it's name to inputted name
    let newGroupID = await createGroup();
    let newGroup = getGroup(newGroupID);
    await newGroup.setGroupName(groupName.value);

    selectedMembers.forEach((member)=>{
        let box = document.getElementById(`${member}Checkbox`);
        box.checked = false;
    });

    // Add ourselves, the group creator, to the members list and then add others
    // selectedMembers.push(mockusername);
    newGroup.addMember(mockusername);
    let newlyAdded = getGroup(newGroupID);

    // let groupObj =  {id:5, groupName: groupName.value, membersList: selectedMembers}
    for(let memberToAdd of selectedMembers){
        await newGroup.addMember(memberToAdd);

    }
   
    // Wipe selected members for next creation, wipe group input, and collapse accordion
    selectedMembers = [];
    groupName.value = '';
    // accordionFriends.collapse('hide');

    //Render new group made
    await renderGroups(mockusername);
    
});

let changedMindButton = document.getElementById("changedMindButton");
changedMindButton.addEventListener('click', (event) => {
    // let accordionFriends = document.getElementById('accordionFriends');

    //Wipe group name from mind changed
    document.getElementById('groupNameInput').value = '';

    selectedMembers.forEach((member)=>{
        let box = document.getElementById(`${member}Checkbox`);
        box.checked = false;
    });

    // Wipe selected members for next creation and collapse accordion
    selectedMembers = [];
    // accordionFriends.collapse('hide');    
});

let searchFriendButton = document.getElementById("searchFriendButton");
let searchFriendModal = document.getElementById("friendSearchModalDialog");

//TODO: Clear modal on hidden
// $("#friendSearchModal").on("hidden.bs.modal", function () {
//     alert("test");
// });
// searchFriendModal.addEventListener(gid, async (event) => {
//     alert("test");

// });

searchFriendButton.addEventListener('click', async (event) => {
    let friendToFind = document.getElementById("friendToFind");
    let potentialFriends = document.getElementById("potentialFriends");

    try{
        //reset friend search results before searching
        potentialFriends.innerHTML = "";
        let exists = await crud.userExists(friendToFind.value);

        if(exists && friendToFind.value !== mockusername){
            await renderPotentialFriend(friendToFind.value, mockusername, potentialFriends);
        }
        else if(friendToFind.value === mockusername){
            potentialFriends.innerHTML =  "<span style='color: red;'>Hey, that's your username.</span>";
        }
        else {
            potentialFriends.innerHTML =  "<span style='color: red;'>Sorry, there aren't any other users close to that name!</span>";
        }
    }
    catch(error){
        potentialFriends.innerHTML =  "<span style='color: red;'>An unexpected error occured, please try again!</span>";
    }
});


await renderFriends(mockusername);

await renderGroups(mockusername);

await renderPotentialMembers(mockusername);