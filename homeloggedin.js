
// import { mock } from "node:test";
// import * as CRUD from CRUD.js

let friendsCol = document.getElementById('scrollableFriendsList');
let groupsCol = document.getElementById('scrollableGroupList');
let mockusername = "Me";

function renderFriends(username) {
    // let user = CRUD.getUser(username);
    let user = {friendsList: [{username: 'Amana22'}, {username: 'koba'}, {username: 'ananya'},
    {username: 'adin'}, {username: 'amey'}, {username: 'anotheruser'}, {username: 'anotheruser2'}, {username: 'another3'}]}

    let image = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaIOsrWSBcmzWt30slQn0bplk5h92cKZSn84TfE4j6sI-rsxNLKWGWRbTpdP_LB9B8fEs&usqp=CAU";
    user.friendsList.forEach((friend) => {
        let friendToInsert =
        '<div class="card my-3">' +
            '<div class="row g-0">' +
                '<div class="col-md-2 d-flex">' +
                    `<img src=${image}` +
                        'alt="generic profile pic" class="img-fluid rounded-start">' +
                '</div>' +
                '<div class="col-md-8 d-flex align-items-center">' +
                    '<div class="card-body">' +
                        `<h5 class="card-title text-start">${friend.username}</h5>` +
                    '</div>' +
                '</div>' +
                '<div class="col-md-2 d-flex flex-column align-items-end justify-content-end">' +
                    '<div class="dropdown">' +
                        '<button class="btn btn btn-lg btn-flash-border-primary dropdown-toggle"' +
                            'type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown"' +
                            'aria-expanded="false"></button>' +
                        '<ul class="dropdown-menu opacity-75 " aria-labelledby="dropdownMenuButton1">' +
                            '<li><a class="dropdown-item" href="#">Go to profile <i' +
                                'class="bi bi-person-fill"></i></a></li>'+
                            '<li><a class="dropdown-item" href="#">Remove friend<i'+
                                'class="bi bi-trash"></i></a></li>' +
                        '</ul></div></div></div></div>';

        friendsCol.insertAdjacentHTML("beforeend", friendToInsert);
    })     
}

function renderGroups(username) {
    // let user = CRUD.getUser(username);
    let user = {friendsList: [{username: 'Amana22'}, {username: 'koba'}, {username: 'ananya'},
    {username: 'adin'}, {username: 'amey'}, {username: 'anotheruser'}, {username: 'anotheruser2'}, {username: 'another3'}],
    groupsList: [{id:1, groupName: 'Team 19'}, {id:2, groupName: 'Team 20'}, {id:3, groupName: 'Team 21'},  {id:4, groupName: 'Team 22'},
    {id:5, groupName: 'Team 2000'},  {id:6, groupName: 'Team 22222'}]}

    let image = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaIOsrWSBcmzWt30slQn0bplk5h92cKZSn84TfE4j6sI-rsxNLKWGWRbTpdP_LB9B8fEs&usqp=CAU";
    user.groupsList.forEach((group) => {
        let groupToInsert =
        `<div id=${group.id}GroupCard class="card my-3">` +
            '<div class="row g-0">' +
                '<div class="col-md-2 d-flex">' +
                    `<img src=${image}` +
                        'alt="generic profile pic" class="img-fluid rounded-start">' +
                '</div>' +
                '<div class="col-md-8 d-flex align-items-center">' +
                    '<div class="card-body">' +
                        `<h5 class="card-title text-start">${group.groupName}</h5>` +
                    '</div>' +
                '</div>' +
                '<div class="col-md-2 d-flex flex-column align-items-end justify-content-end">' +
                    '<div class="dropdown">' +
                        '<button class="btn btn btn-lg btn-flash-border-primary dropdown-toggle"' +
                            'type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown"' +
                            'aria-expanded="false"></button>' +
                        '<ul class="dropdown-menu opacity-75 " aria-labelledby="dropdownMenuButton1">' +
                        '<li><a class="dropdown-item" href="#">Leave group<i'+
                                    'class="bi bi-trash"></i></a></li></ul>'+
                        '</ul></div></div></div></div>';

        groupsCol.insertAdjacentHTML("beforeend", groupToInsert);
    });
}

function removeGroup(id, username){
      // let user = CRUD.getUser(username);
      let user = {friendsList: [{username: 'Amana22'}, {username: 'koba'}, {username: 'ananya'},
      {username: 'adin'}, {username: 'amey'}, {username: 'anotheruser'}, {username: 'anotheruser2'}, {username: 'another3'}],
      groupsList: [{id:1, groupName: 'Team 19'}, {id:2, groupName: 'Team 20'}, {id:3, groupName: 'Team 21'},  {id:4, groupName: 'Team 22'},
      {id:5, groupName: 'Team 2000'},  {id:6, groupName: 'Team 22222'}]}
}



renderFriends(mockusername);

renderGroups(mockusername);