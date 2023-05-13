
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
document.cookie = "currUser=username1";
const currUsername = document.cookie
  .split("; ")
  .find((row) => row.startsWith("currUser="))
  ?.split("=")[1];


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
        for(let friendUsername of friendsList){
            let friendObj = await crud.getUser(friendUsername);

            let friendToInsert =
            `<div id=${friendUsername}FriendCard class="card my-3">` +
                '<div class="row g-0">' +
                    '<div class="col-md-2 d-flex">' +
                        `<a href="/myprofile.html?profileUser=${friendUsername}" class="stretched-link"></a>` +

                        `<img src=${image}` +
                            'alt="generic profile pic" class="img-fluid rounded-start">' +
                    '</div>' +
                    '<div class="col-md-8 d-flex align-items-center">' +
                        '<div class="card-body">' +
                            `<h5 class="card-title text-start">${friendUsername}</h5>` +
                        '</div>' +
                    '</div>' +
                    '<div class="col-md-2 d-flex flex-column align-items-end justify-content-end">' +
                        '<div class="dropdown">' +
                            '<button class="btn btn btn-lg btn-flash-border-primary dropdown-toggle"' +
                                'type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown"' +
                                'aria-expanded="false"></button>' +
                            '<ul class="dropdown-menu opacity-75 " aria-labelledby="dropdownMenuButton1">' +
                                `<li><a id=${friendUsername}Profile class="dropdown-item" href="/myprofile.html?profileUser=${friendUsername}">Go to profile <i ` +
                                    'class="bi bi-person-fill"></i></a></li>'+
                                `<li><a id=${friendUsername}RemoveCard class="dropdown-item" href="#">Remove friend` +
                                    '<i class="bi bi-trash"></i></a></li>' +
                            '</ul>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>';

            // Push friend found to column
            friendsCol.insertAdjacentHTML("afterbegin", friendToInsert);

            // Dropdown menu features: delete friend or navigate to their profile
            let friendDeleteButton = document.getElementById(friendUsername + 'RemoveCard');
            friendDeleteButton.addEventListener('click', async (event) => {
                await removeFriendFromUser(friendUsername, currUsername);
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
        // Reset friend search results before searching
        potentialFriends.innerHTML = "";

        // Only attempt rendering card found if user exists and it's not you
        let exists = await crud.userExists(friendToFind.value);
        if(exists && friendToFind.value !== currUsername){
            await renderPotentialFriend(friendToFind.value, currUsername, potentialFriends);
        }
        else if(friendToFind.value === currUsername){
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
 * @param {string} usernameToFriendRequest requested username to retrieve obj of
 * @param {string} currUsername current user's username
 * @param {Element} potentialFriends search results to add card to
 */
async function renderPotentialFriend(usernameToFriendRequest, currUsername, potentialFriends){
    // Temp image while we sort out image upload
    let image = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaIOsrWSBcmzWt30slQn0bplk5h92cKZSn84TfE4j6sI-rsxNLKWGWRbTpdP_LB9B8fEs&usqp=CAU";
    // User that we know exists to be found in friend search
    let userToFriendRequest = await crud.getUser(usernameToFriendRequest);
    // If already friends, then indicate that in the card result. Otherwise allow us to add them!
    let areFriends = await crud.areFriends(currUsername, usernameToFriendRequest);
    let inRequestsAlready = usernameToFriendRequest in await crud.getRequestsFrom(currUsername);
    let buttonType = '';
    if(areFriends){
        buttonType = 'class="btn btn-success disabled">Already added';
    }
    else if (!areFriends && inRequestsAlready){
        buttonType = 'class="btn btn-success disabled">Already requested';
    }
    else{
        buttonType = 'class="btn btn-outline-secondary">Add';
    }

    // This is the card for each friend found by the username searched, dynamic to the userID's content in DB
    let potentialFriend = '<div class="card my-3">' +
        '<div class="row g-0">' +
            '<div class="col-md-2 d-flex">' +
                `<img src=${image}` +
                    'alt="generic profile pic" class="img-fluid rounded-start">'+
            '</div>' +
            '<div class="col-md-8 d-flex align-items-center">'+
                '<div class="card-body">'+
                    `<h5 class="card-title text-start">${usernameToFriendRequest}</h5>`+
                '</div>'+
            '</div>'+
            '<div class="col-md-2 d-flex flex-column align-items-end justify-content-end">'+
                `<button id="${usernameToFriendRequest}AddButton" type="button" ${buttonType}</button>`+
            '</div>'+
        '</div>'+
    '</div>';
    
    // Whether or not they are already friends, add respective card to indicate that
    potentialFriends.insertAdjacentHTML("afterbegin", potentialFriend);
    
    // No need for event handlers, no adding mechanism necessary for user that's already a friend so just return
    if(areFriends){
        return;
    }
    else{
        let addFriendButton = document.getElementById(`${usernameToFriendRequest}AddButton`);
        addFriendButton.addEventListener('click', async (event) => {
            await sendFriendRequestToUser(usernameToFriendRequest, currUsername, addFriendButton);
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
async function sendFriendRequestToUser(usernameToFriendRequest, currUsername, addFriendButton){
    // Try to send user found a friend request, as they are not yet friends with curr user
    // await crud.addFriendRequest(currUserID, userIDToFriendRequest);
    try {
        // Testing purposes: Try to add user found as friend, as they are not yet friends with curr user
        await crud.addFriend(currUsername, usernameToFriendRequest);
        // Reload relevant parts of the page 
        await renderFriends(currUsername);
        await renderPotentialMembers(currUsername);

        // await crud.addFriendRequest(currUserID, userIDToFriendRequest);

        // Alert user after CRUD request that the friend request worked
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
 * @param {string} friendUsername friend username to delete
 * @param {string} currUsername current user's username
 */
async function removeFriendFromUser(friendUsername, currUsername){
    // Attempt to remove friend through friend card dropdown and rerender impacted elements
    try{
        await crud.deleteFriend(currUsername, friendUsername);
        await renderPotentialMembers(currUsername);
        // Remove single friend card without rerendering entire friends list
        let friendToDelete = document.getElementById(friendUsername + 'FriendCard');
        friendsCol.removeChild(friendToDelete);
    }
    // In the case that it cannot delete, there is either an error with DB or the server is offline so we alert of that
    catch(error){
        // Create temp alert of issue
        let child = document.createElement('div')
        child.innerHTML = '<div id="deleteAlert" class="alert alert-danger" role="alert">'+
                        'Try again later, possibly offline</div>';   

        // Alert added directly after card to delete, then short delay before removing alert
        let friendCardToDelete = document.getElementById(`${friendUsername}FriendCard`);
        friendCardToDelete.after(child);
        setTimeout(function(){
            let toRemove = document.getElementById(`deleteAlert`);
            toRemove.remove();
            },2500);
    }
}


// GROUP RELATED FUNCTIONS:


/**
 * Pushes group cards dynamically to current user's group column
 * @param {string} currUsername current user's username
 */
async function renderGroups(currUsername) {
    // Wipe stale group cards
    groupsCol.innerHTML = "";

    try{
        // Iterate over groups current user is in and render cards
        let groupsList = await crud.getGroupIdsOfUser(currUsername);
        for(let groupId of groupsList){
            await renderGroup(groupId, currUsername);
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
 * @param {string} groupId group to render
 * @param {string} currUsername current user's username
 */
async function renderGroup(groupId, currUsername){
    // Retrieve fresh group info 
    let group = await crud.getGroup(groupId);
    let members = await crud.getGroupMemberUsernames(groupId);
    let image = group.image !== '' ? group.image : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaIOsrWSBcmzWt30slQn0bplk5h92cKZSn84TfE4j6sI-rsxNLKWGWRbTpdP_LB9B8fEs&usqp=CAU";

    // Create card with fresh info
    //TODO: Hover effect when image hovered over to know you can go to group that way
    let groupToInsert =
    `<div id=${groupId}GroupCard class="card my-3">` +
        '<div class="row g-0">' +
            `<a class="col-md-2 d-flex flex-column" href="/individualgroup.html?groupId=${groupId}">`+
                `<img src=${image} style="width: 100%; height: 10vw; object-fit: cover;"` +
                    'alt="generic profile pic" class="img-fluid rounded-start">' +
            '</a>' +
            '<div class="col-md-8 d-flex justify-content-center align-items-center">' +
                '<div class="card-body">' +
                    `<h3 class="card-title text-center">${group.name}</h3>` +
                '</div>' +
            '</div>' +

            '<div class="col-md-2 d-flex flex-column align-items-center justify-content-center">' +
                `<div class="row d-flex mx-0 pt-1">`+
                    '<div class="col d-flex flex-column align-items-center justify-content-center">' +
                    `<h6 class="card-text">${members.length} Joined</h6>` +
                    '</div>'+
                    '</div>'+
                `<div class="row d-flex mx-0 px-0">`+

                '<div class="dropdown align-items-center justify-content-center">' +
                    '<button class="btn btn btn-lg btn-flash-border-primary dropdown-toggle"' +
                        'type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown"' +
                        'aria-expanded="false"></button>' +
                    '<ul class="dropdown-menu opacity-75 " aria-labelledby="dropdownMenuButton1">' +
                    `<li><a id=${groupId}Route class="dropdown-item" href="/individualgroup.html?groupId=${groupId}">Go to group<i ` +
                    'class="bi bi-person-fill"></i></a></li>'+
                    `<li><a id=${groupId}RemoveCard class="dropdown-item" href="#">Leave group<i ` +
                                'class="bi bi-trash"></i></a></li></ul>'+
                    '</ul></div></div></div></div></div>';

    // Append group card to group col
    groupsCol.insertAdjacentHTML("afterbegin", groupToInsert);

    // Allow deleting group from dropdown
    let groupDeleteButton = document.getElementById(groupId + 'RemoveCard');
    groupDeleteButton.addEventListener('click', async (event) => {
        await removeGroupFromUser(currUsername, groupId);
    });
}


/**
 * Pushes checkbox friend card dynamically to module for creating a group, as a possible member to add
 * @param {string} usernameToAdd friend username that could be made a member
 * @param {Element} potentialMembers modal column for search results
 */
async function renderPotentialMember(usernameToAdd, potentialMembers){
    // Temp while we fig out
    let image = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaIOsrWSBcmzWt30slQn0bplk5h92cKZSn84TfE4j6sI-rsxNLKWGWRbTpdP_LB9B8fEs&usqp=CAU";
    // Get fresh friend info like their image
    let friend = await crud.getUser(usernameToAdd);
    
    // Card with dynamic data for this one friend
    let potentialMember = '<div class="card my-3">' +
        '<div class="row g-0">' +
            '<div class="col-md-2 d-flex justify-content-center align-items-center">'+
                '<div class="form-check checkbox-xl">'+
                    `<input class="form-check-input" type="checkbox" value="" id=${usernameToAdd}Checkbox>`+
                '</div>'+
            '</div>'+
            '<div class="col-md-2 d-flex">' +
                `<img src=${image}` +
                    'alt="generic profile pic" class="img-fluid rounded-start">'+
            '</div>' +
            '<div class="col-md-8 d-flex align-items-center">'+
                '<div class="card-body">'+
                    `<h5 class="card-title text-start">${usernameToAdd}</h5>`+
                '</div>'+
            '</div>'+
        '</div>'+
    '</div>';

    //Append new potential member card
    potentialMembers.insertAdjacentHTML("beforeend", potentialMember);
}


/**
 * Pushes each potential member to add to group to modal
 * @param {string} currUsername current user's username
 */
async function renderPotentialMembers(currUsername){
    try{
        // Wipe stale potential members cards
        potentialMembers.innerHTML = "";
        // Retrieve fresh friends list of current user
        const friendsList = await crud.getFriends(currUsername);
        // Temp
        let image = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaIOsrWSBcmzWt30slQn0bplk5h92cKZSn84TfE4j6sI-rsxNLKWGWRbTpdP_LB9B8fEs&usqp=CAU";
        
        // For each friend, get card to insert
        for(let friend of friendsList){
            await renderPotentialMember(friend, potentialMembers);
            // Listen for checking friend card to be a part of members to add to group when created
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


/**
 * Removes current user as a member of group, then rerenders fresh group list
 * @param {string} currUsername username to remove from group
 * @param {string} groupId group to remove user from
 */
async function removeGroupFromUser(currUsername, groupId){
    try{
        // First attempt to remove curr user from group specified
        await crud.removeMember(groupId, currUsername);
        // Rerender by only removing the one element and not the entire column to be smoother
        let groupToDelete = document.getElementById(groupId + 'GroupCard');
        groupsCol.removeChild(groupToDelete);
    }
    catch(error){
        // Create temp alert of issue
        let child = document.createElement('div')
        child.innerHTML = '<div id="deleteAlert" class="alert alert-danger" role="alert">'+
                        'Try again later, possibly offline</div>';   

        // Alert added directly after card to delete, then short delay before removing alert
        let groupCardToDelete = document.getElementById(`${groupId}GroupCard`);
        groupCardToDelete.after(child);
        setTimeout(function(){
            let toRemove = document.getElementById(`deleteAlert`);
            toRemove.remove();
        },3500);
    }
}


/**
 * Adds all selected members to new group created 
 * @param {string} currUsername username as the group creator to be added
 */
async function createGroupForUser(currUsername){
    try{
        let groupName = document.getElementById('groupNameInput');
        let imageElem = document.getElementById("groupPhotoUpload");
        let image = null;
        // If image uploaded, sent that in base64, otherwise empty string
        if(imageElem.files[0] !== undefined){
            image =  await toBase64(imageElem.files[0]);
        }
        else{
            image = '';
        }
    
        //TODO: collapse accordion of potential members on close always
        let accordionFriends = document.getElementById('flush-collapseOne');

        // Form new group with unique id returned, passing in name/image property 
        let newGroupId = await crud.createGroup({name: groupName.value, image: image});

        // Add ourselves, the group creator, to the members list and then add others
        await crud.addMember(newGroupId, currUsername);
        for(let memberToAdd of selectedMembers){
            await crud.addMember(newGroupId, memberToAdd);
        }

        // Wipe selected members for next group creation as well as  group input and accordion collapse
        wipeGroupCreateModal();

        //Rerender only the new group card to be added to be smoother
        await renderGroup(newGroupId, currUsername);
    }
    catch(error){
        let child = document.createElement('div')
        console.log("Message is" + error.message);
        if(error.message.startsWith("Unexpected error: Error: Payload Too Large")){
            // Create temp alert of issue
            child.innerHTML = '<div id="deleteAlert" class="alert alert-danger" role="alert">'+
                                'Image too large, failed to create group</div>';  
            setTimeout(function(){
                child.remove();
                },2500); 
        }
        else{
            // Create temp alert of issue
            child.innerHTML = '<div id="deleteAlert" class="alert alert-danger" role="alert">'+
                                'Refresh page as group creation failed, possibly offline</div>';   
        }
        // Alert added to friend column that has failed to render correctly
        groupsCol.prepend(child);

        // Clear modal because of error
        wipeGroupCreateModal();
    }
}

// Helper to clear group create modal inputs on create or cancel
function wipeGroupCreateModal(){
    let groupName = document.getElementById('groupNameInput');
    let imageElem = document.getElementById("groupPhotoUpload");

    // Uncheck everybody
    selectedMembers.forEach((member)=>{
        let box = document.getElementById(`${member}Checkbox`);
        box.checked = false;
    });

    // Wipe inputs
    selectedMembers = [];
    groupName.value = '';
    imageElem.value = '';

    // Collapse potental members accordion, uses jQuery but possibly a way to do it faster with just JS in future
    $("#flush-collapseOne").collapse('hide');

    // let accordion = document.getElementById("flush-collapseOne");
    // accordion.classList.remove("show");

}

// Allows us to convert uploaded group image to string
const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});

// Listens for group creation, when clicked to create, makes group with name/image/members provided
let makeGroupButton = document.getElementById("makeGroupButton");
makeGroupButton.addEventListener('click', async (event) => {
    await createGroupForUser(currUsername);
});

let changedMindButton = document.getElementById("changedMindButton");
changedMindButton.addEventListener('click', (event) => {
    wipeGroupCreateModal();
});


// INITIAL RENDERING OF HOME PAGE LOGGED IN:

await renderFriends(currUsername);

await renderGroups(currUsername);

await renderPotentialMembers(currUsername);