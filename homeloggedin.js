
// import { mock } from "node:test";
import { getUser, getGroup, getAllUsernames, userExists, createGroup, createUser } from "./crud.js";

// collect column for friends and groups to render in
let friendsCol = document.getElementById('scrollableFriendsList');
let groupsCol = document.getElementById('scrollableGroupList');
let potentialMembers = document.getElementById('potentialMembers');

let selectedMembers = [];
let mockusername = "user0";

async function renderFriends(username) {
    //wipe
    friendsCol.innerHTML = "";

    let user = getUser(username);
    let friendsList = await user.getAllFriends();
    // let user = {friendsList: [{username: 'Amana22'}, {username: 'koba'}, {username: 'ananya'},
    // {username: 'adin'}, {username: 'amey'}, {username: 'anotheruser'}, {username: 'anotheruser2'}, {username: 'another3'}]}

    let image = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaIOsrWSBcmzWt30slQn0bplk5h92cKZSn84TfE4j6sI-rsxNLKWGWRbTpdP_LB9B8fEs&usqp=CAU";
    friendsList.forEach((friend) => {
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
    })     
}

async function renderGroups(currUserID) {
      // let user = {friendsList: [{username: 'Amana22'}, {username: 'koba'}, {username: 'ananya'},
    // {username: 'adin'}, {username: 'amey'}, {username: 'anotheruser'}, {username: 'anotheruser2'}, {username: 'another3'}],
    // groupsList: [{id:1, groupName: 'Team 19'}, {id:2, groupName: 'Team 20'}, {id:3, groupName: 'Team 21'},  {id:4, groupName: 'Team 22'},
    // {id:5, groupName: 'Team 2000'},  {id:6, groupName: 'Team 22222'}]}
    groupsCol.innerHTML = "";

    let currUser = getUser(currUserID);
    let groupsList = await currUser.getAllGroups();
    groupsList.forEach(async (groupID) => {
        await renderGroup(groupID, currUserID);
    });
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

    // temp image while we sort out image upload
    let image = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaIOsrWSBcmzWt30slQn0bplk5h92cKZSn84TfE4j6sI-rsxNLKWGWRbTpdP_LB9B8fEs&usqp=CAU";
    let userToFriendRequest = getUser(userIDToFriendRequest);
    let currUser = getUser(currUserID);
    // user found in friend search
    let potentalFriend =  '<div class="card my-3">' +
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
            `<button id="${userIDToFriendRequest}AddButton" type="button" class="btn btn-outline-secondary">Add</button>`+
        '</div>'+
    '</div>'+
'</div>';

    potentialFriends.insertAdjacentHTML("afterbegin", potentalFriend);

    let addFriendButton = document.getElementById(`${userIDToFriendRequest}AddButton`);
    addFriendButton.addEventListener('click', async (event) => {
        // add friend to this current user, update friends list 
        // and members that appear to add to a new group if we make one
        await currUser.addFriend(userIDToFriendRequest);
        await renderFriends(mockusername);
        await renderPotentialMembers(mockusername);
        // alert user after CRUD that the friend worked
        addFriendButton.className = "btn btn-success";
        addFriendButton.innerText = "Added"
    });

    return potentalFriend;
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
    let currUser = getUser(currUserID);
    let friendsList = await currUser.getAllFriends();
    //   let user = {friendsList: [{username: 'Amana22'}, {username: 'koba'}, {username: 'ananya'},
    //   {username: 'adin'}, {username: 'amey'}, {username: 'anotheruser'}, {username: 'anotheruser2'}, {username: 'another3'}],
    //   groupsList: [{id:1, groupName: 'Team 19'}, {id:2, groupName: 'Team 20'}, {id:3, groupName: 'Team 21'},  {id:4, groupName: 'Team 22'},
    //   {id:5, groupName: 'Team 2000'},  {id:6, groupName: 'Team 22222'}]}
  
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
    let groupToKickMember = getGroup(groupID);
    await groupToKickMember.removeMember(currUserID);
    // let groupToDelete = document.getElementById(groupID + 'GroupCard');
    // groupsCol.removeChild(groupToDelete);
    await renderGroups(currUserID);
}

async function removeFriendFromUser(friendUserID, currUserID){
    let currUser = getUser(currUserID);
    await currUser.removeFriend(friendUserID);
 

    await renderFriends(currUserID);

    // Remove single friend without rerendering entire friends list:
    // let friendToDelete = document.getElementById(friendUsername + 'FriendCard');
    // friendsCol.removeChild(friendToDelete);
}


// Listens for group creation, deselects boxes and wipes those that are selected
let makeGroupButton = document.getElementById("makeGroupButton");
makeGroupButton.addEventListener('click', async (event) => {
    let groupName = document.getElementById('groupNameInput');
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
    // let groupObj =  {id:5, groupName: groupName.value, membersList: selectedMembers}
    selectedMembers.forEach(async(memberToAdd)=>{
        newGroup.addMember(memberToAdd);
    });
    // Wipe selected members for next creation, wipe group input, and collapse accordion
    selectedMembers = [];
    groupName.value = '';
    // accordionFriends.collapse('hide');

    // // Render new group made
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
searchFriendButton.addEventListener('click', async (event) => {

    let currUser = getUser(mockusername);
    let friendToFind = document.getElementById("friendToFind");
    let potentialFriends = document.getElementById("potentialFriends");

    //reset friend search results before searching
    potentialFriends.innerHTML = "";
    let exists = await userExists(friendToFind.value);
    if(exists){
        await renderPotentialFriend(friendToFind.value, mockusername, potentialFriends);
    }
    else {
        potentialFriends.innerHTML =  "<span style='color: red;'>Sorry, there aren't any users close to that name!</span>";
    }
    
});


await renderFriends(mockusername);

await renderGroups(mockusername);

await renderPotentialMembers(mockusername);