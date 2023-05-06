
import * as crud from "./crudclient.js";

// Collect column for friends and groups to render in
let friendsCol = document.getElementById('scrollableFriendsList');
let groupsCol = document.getElementById('scrollableGroupList');
let potentialMembers = document.getElementById('potentialMembers');
// Collect some interactive elems
let searchFriendButton = document.getElementById("searchFriendButton");
let searchFriendModal = document.getElementById("friendSearchModalDialog");

// Selection for making new group with members which starts empty
let selectedMembers = [];

// Our pretend user ID logged in currently
let mockusername = "username1";


// FRIEND COLUMN RELATED FUNCTIONS:

/**
 * Pushes friend cards dynamically to current user's friend column
 * @param {string} username current user's username
 */
async function renderFriends(username) {
    try{
        // Wipe stale friend cards
        friendsCol.innerHTML = "";
        // Retrieve fresh friends list for current user
        const friendsList = await crud.getFriends(username);
        // Temp for all friends until we figure out images
        let image = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaIOsrWSBcmzWt30slQn0bplk5h92cKZSn84TfE4j6sI-rsxNLKWGWRbTpdP_LB9B8fEs&usqp=CAU";
        
        // For each friend username, retrieve fresh friend obj/data with their image to make card 
        for(let friend of friendsList){
            let friendObj = await crud.getUser(friend);

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

            // Push friend found to column
            friendsCol.insertAdjacentHTML("beforeend", friendToInsert);

            // Dropdown menu features: delete friend or navigate to their profile
            let friendDeleteButton = document.getElementById(friend + 'RemoveCard');
            friendDeleteButton.addEventListener('click', async (event) => {
                await removeFriendFromUser(friend, mockusername);
            });
            let friendProfileButton = document.getElementById(friend + 'Profile');
            friendProfileButton.addEventListener('click', (event) => {
            //TODO route to friend's profile
            });   
        }  
    }
    catch(error){
         // Create temp alert of issue
         let child = document.createElement('div')
         child.innerHTML = '<div id="deleteAlert" class="alert alert-danger" role="alert">'+
                         'Refresh page as friends failed to load, possibly offline</div>';   
         // Alert added to friend column that has failed to render correctly
         friendsCol.appendChild(child);
    }
}

/**
 * Takes input and provides results based on whether friend is found, not, or error
 * @param {string} username current user's username
 * @param {Element} potentialFriends column for adding found user
 */
async function searchForFriend(friendToFind, potentialFriends){
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
}

// Add friend button waits to pop up search bar modal to
searchFriendButton.addEventListener('click', async (event) => {
    let friendToFind = document.getElementById("friendToFind");
    let potentialFriends = document.getElementById("potentialFriends");
    await searchForFriend(friendToFind, potentialFriends);
});


/**
 * Pushes friend search result card dynamically to current user's friend search column
 * Currently only provides card for exact username match, later if time could make load multiple similar to
 * @param {string} userIDToFriendRequest requested username to retrieve obj of
 * @param {string} currUserID current user's username
 * @param {Element} potentialFriends element to add card to
 */
async function renderPotentialFriend(userIDToFriendRequest, currUserID, potentialFriends){
    // Temp image while we sort out image upload
    let image = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaIOsrWSBcmzWt30slQn0bplk5h92cKZSn84TfE4j6sI-rsxNLKWGWRbTpdP_LB9B8fEs&usqp=CAU";
    // User that we know exists to be found in friend search
    let userToFriendRequest = await crud.getUser(userIDToFriendRequest);
    // If already friends, then indicate that in the card result. Otherwise allow us to add them!
    let areFriends = await crud.areFriends(currUserID, userIDToFriendRequest);
    let buttonType = areFriends ? 'class="btn btn-success disabled">Already added' : 'class="btn btn-outline-secondary">Add';

    // This is the card for each friend found by the username searched, dynamic to the userID's content in DB
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
            await sendFriendRequestToUser(userIDToFriendRequest, currUserID, addFriendButton);
        });
        return;
    }
}

/**
 * Makes request from current user to the user searched
 * @param {string} userIDToFriendRequest requested username to add
 * @param {string} currUserID current user's username
 * @param {Element} addFriendButton button to change based on result of action
 */
async function sendFriendRequestToUser(userIDToFriendRequest, currUserID, addFriendButton){
    // Try to send user found a friend request, as they are not yet friends with curr user
    // await crud.addFriendRequest(currUserID, userIDToFriendRequest);
    try {
        // Testing purposes: Try to add user found as friend, as they are not yet friends with curr user
        await crud.addFriend(currUserID, userIDToFriendRequest);
        // Reload relevant parts of the page 
        await renderFriends(currUserID);
        await renderPotentialMembers(currUserID);
        // Alert user after CRUD request that the friend adding worked
        addFriendButton.className = "btn btn-success";
        addFriendButton.innerText = "Request Sent"
        addFriendButton.disabled = true;
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
}


/**
 * Tries to delete friend and provides alert if issue
 * @param {string} friendUserID friend username to delete
 * @param {string} currUserID current user's username
 */
async function removeFriendFromUser(friendUserID, currUserID){
    // Attempt to remove friend through friend card dropdown and rerender impacted elements
    try{
        await crud.deleteFriend(currUserID, friendUserID);
        await renderFriends(currUserID);
        await renderPotentialMembers(currUserID);
    }
    // In the case that it cannot delete, there is either an error with DB or the server is offline so we alert of that
    catch(error){
        // Create temp alert of issue
        let child = document.createElement('div')
        child.innerHTML = '<div id="deleteAlert" class="alert alert-danger" role="alert">'+
                        'Try again later, possibly offline</div>';   

        // Alert added directly after card to delete, then short delay before removing alert
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

// GROUP RELATED FUNCTIONS:


/**
 * Pushes group cards dynamically to current user's group column
 * @param {string} username current user's username
 */
async function renderGroups(currUserID) {
    // Wipe stale group cards
    groupsCol.innerHTML = "";

    try{
        let groupsList = await crud.getGroupIdsOfUser(currUserID);
        for(let groupID of groupsList){
            await renderGroup(groupID, currUserID);
        }
    }
    catch(error){
         // Create temp alert of issue
         let child = document.createElement('div')
         child.innerHTML = '<div id="deleteAlert" class="alert alert-danger" role="alert">'+
                         'Refresh page as groups failed to load, possibly offline</div>';   
         // Alert added to friend column that has failed to render correctly
         groupsCol.appendChild(child);
    }
}



/**
 * Pushes group card dynamically to current user's group column
 * @param {string} groupID group to render
 * @param {string} currUserID current user's username
 */
async function renderGroup(groupID, currUserID){
    // Retrieve fresh group info 
    let group = await crud.getGroup(groupID);
    // Temp until we figure out images
    let image = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaIOsrWSBcmzWt30slQn0bplk5h92cKZSn84TfE4j6sI-rsxNLKWGWRbTpdP_LB9B8fEs&usqp=CAU";
    // Create card with fresh info
    let groupToInsert =
    `<div id=${groupID}GroupCard class="card my-3">` +
        '<div class="row g-0">' +
            '<div class="col-md-2 d-flex">' +
                `<img src=${image}` +
                    'alt="generic profile pic" class="img-fluid rounded-start">' +
            '</div>' +
            '<div class="col-md-8 d-flex align-items-center">' +
                '<div class="card-body">' +
                    `<h5 class="card-title text-start">${group.name}</h5>` +
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

    // Append group card to group col
    groupsCol.insertAdjacentHTML("afterbegin", groupToInsert);

    // Allow deleting group from dropdown
    let groupDeleteButton = document.getElementById(groupID + 'RemoveCard');
    groupDeleteButton.addEventListener('click', async (event) => {
        await removeGroupFromUser(currUserID, groupID);
    });
}

/**
 * Pushes checkbox friend card dynamically to module for creating a group, as a possible member to add
 * @param {string} userToAdd friend username that could be made a member
 */
async function renderPotentialMember(userToAdd, potentialMembers){
    // Temp while we fig out
    let image = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaIOsrWSBcmzWt30slQn0bplk5h92cKZSn84TfE4j6sI-rsxNLKWGWRbTpdP_LB9B8fEs&usqp=CAU";
    // Get fresh friend info like their image
    let friend = await crud.getUser(userToAdd);
    
    // Card with dynamic data for this one friend
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

    //Append new potential member card
    potentialMembers.insertAdjacentHTML("beforeend", potentialMember);
}


/**
 * Pushes each potential member to add to group to modal
 * @param {string} currUserID current user's username
 */
async function renderPotentialMembers(currUserID){
    try{
        // Wipe stale potential members cards
        potentialMembers.innerHTML = "";
        // Retrieve fresh friends list of current user
        let friendsList = await crud.getFriends(currUserID);
        // Temp
        let image = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaIOsrWSBcmzWt30slQn0bplk5h92cKZSn84TfE4j6sI-rsxNLKWGWRbTpdP_LB9B8fEs&usqp=CAU";
        
        // For each friend, get card to insert
        for(let friend of friendsList){
            await renderPotentialMember(friend, potentialMembers);

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
        }
    }
    catch(error){
        // Create temp alert of issue
        let child = document.createElement('div')
        child.innerHTML = '<div id="deleteAlert" class="alert alert-danger" role="alert">'+
                        'Refresh page as potential members failed to load, possibly offline</div>';   
        // Alert added to friend column that has failed to render correctly
        potentialMembers.appendChild(child);
    }
}

async function removeGroupFromUser(currUserID, groupID){
    try{
        await crud.removeMember(groupID, currUserID);
        // let groupToDelete = document.getElementById(groupID + 'GroupCard');
        // groupsCol.removeChild(groupToDelete);
        await renderGroups(currUserID);
    }
    catch(error){
        // Create temp alert of issue
        let child = document.createElement('div')
        child.innerHTML = '<div id="deleteAlert" class="alert alert-danger" role="alert">'+
                        'Try again later, possibly offline</div>';   

        // Alert added directly after card to delete, then short delay before removing alert
        let grooupCardToDelete = document.getElementById(`${groupID}GroupCard`);
        grooupCardToDelete.after(child);
        setTimeout(function(){
            let toRemove = document.getElementById(`deleteAlert`);
            toRemove.remove();
            },3500);
    }
}

//deselects boxes and wipes those that are selected
async function createGroup(currUserID, groupName){

    try{
        //TODO: collapse accordion of potential members on close always
        let accordionFriends = document.getElementById('flush-collapseOne');

        // Form new group with unique id returned, passing in name/image property 
        // TODO: pass in image property when figured out
        let newGroupID = await crud.createGroup({name: groupName.value});

        // Add ourselves, the group creator, to the members list and then add others
        await crud.addMember(newGroupID, currUserID);
        for(let memberToAdd of selectedMembers){
            await crud.addMember(newGroupID, memberToAdd);
        }

        // Unselect selected members checkboxes for next group creation
        selectedMembers.forEach((member)=>{
            let box = document.getElementById(`${member}Checkbox`);
            box.checked = false;
        });

        // Wipe selected members for next group creation as well as  group input and accordion collapse
        selectedMembers = [];
        groupName.value = '';
        // accordionFriends.collapse('hide');

        //Render fresh groups
        await renderGroups(mockusername);
    }
    catch(error){
        // Create temp alert of issue
        let child = document.createElement('div')
        child.innerHTML = '<div id="deleteAlert" class="alert alert-danger" role="alert">'+
                        'Refresh page as group creation failed, possibly offline</div>';   
        // Alert added to friend column that has failed to render correctly
        groupsCol.prepend(child);
    }
}


// Listens for group creation, when clicked to create, makes group with name/image/members provided
let makeGroupButton = document.getElementById("makeGroupButton");
makeGroupButton.addEventListener('click', async (event) => {
    let groupName = document.getElementById('groupNameInput');
    await createGroup(mockusername, groupName);
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



//TODO: Clear modal on hidden
// $("#friendSearchModal").on("hidden.bs.modal", function () {
//     alert("test");
// });
// searchFriendModal.addEventListener(gid, async (event) => {
//     alert("test");

// });



// INITIAL RENDERING OF HOME PAGE LOGGED IN:

await renderFriends(mockusername);

await renderGroups(mockusername);

await renderPotentialMembers(mockusername);