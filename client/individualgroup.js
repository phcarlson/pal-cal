import { User, Group, BusyEvent, PlannedEvent } from './datatypes.js';
import * as crud from './crudclient.js';

const queryString = window.location.search; // Returns:'?q=123'
const params = new URLSearchParams(queryString);
let currGroupId = null;
let groupObj = null;
let currUser = null;

try{
    currGroupId = params.get("groupId");
    const groupObj = await crud.getGroup(params.get("groupId"));

    currUser = document.cookie
    .split("; ")
    .find((row) => row.startsWith("currUser="))
    ?.split("=")[1];

}
catch(error){
    console.log(error);
    
}

// containers
const membersContainer = document.getElementById("members-container");
const plannedEventsContainer = document.getElementById("planned-events-container");

// buttons
const selectAllButton = document.getElementById("select-all-button");
const deselectAllButton = document.getElementById("deselect-all-button");
const searchMemberButton = document.getElementById("searchMemberButton");

membersContainer.innerHTML = ''; // clear all members
plannedEventsContainer.innerHTML = ''; // clear all planned events

let eventsAdded = 0;

let mockusername = "username1";

function addMember(userObj) {
    
    let memberToInsert = `<div class="card my-3">
                            <div class="row g-0">
                                <div class="col-md-2 d-flex justify-content-center align-items-center">
                                    <div class="form-check checkbox-xl">
                                        <input class="form-check-input member-checkbox" type="checkbox" value="" id="flexCheckDefault">

                                    </div>
                                </div>
                                <div class="col-md-2 d-flex">
                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaIOsrWSBcmzWt30slQn0bplk5h92cKZSn84TfE4j6sI-rsxNLKWGWRbTpdP_LB9B8fEs&usqp=CAU"
                                        alt="generic profile pic" class="img-fluid rounded-start">
                                </div>
                                <div class="col-md-8 d-flex align-items-center">
                                    <div class="card-body">
                                        <h5 class="card-title text-start">${userObj.username}</h5>
                                    </div>
                                </div>
                            </div>
                        </div>`;

    membersContainer.insertAdjacentHTML("afterbegin", memberToInsert);

    //document.getElementById("flexCheckDefault").checked = true;
}

async function addPlannedEvent(startTime, endTime, startDay, title, location, description) {
    let plannedEventToInsert =  `<div class="card card-margin">
                                            <div class="card-header no-border">
                                                <h5 class="card-title">${title}</h5>
                                            </div>
                                            <div class="card-body pt-0">
                                                <div class="widget-49">
                                                    <div class="widget-49-title-wrapper">
                                                        <div class="widget-49-date-primary">
                                                            <span class="widget-49-date-day">${startDay}</span>
                                                            <span class="widget-49-date-month">mar</span>
                                                        </div>
                                                        <div class="widget-49-meeting-info">
                                                            <span class="widget-49-pro-title">${location}</span>
                                                            <span class="widget-49-meeting-time">${startTime} - ${endTime}</span>
                                                        </div>
                                                    </div>

                                                    ${description}

                                                    <div class="widget-49-meeting-action">
                                                        <div class="dropdown">
                                                            <button class="btn btn-lg btn-flash-border-primary dropdown-toggle"
                                                                type="button" id="dropdownMenuButton-${eventsAdded}-0" data-bs-toggle="dropdown"
                                                                aria-expanded="false">
                                                                RSVP
                                                            </button>
                                                            <div class="dropdown-menu opacity-75 " aria-labelledby="dropdownMenuButton-${eventsAdded}-0">
                                                                <button id="yes-${eventsAdded}" class="dropdown-item event-${eventsAdded}" type="button" href="#">Yes</button>
                                                                <button id="no-${eventsAdded}" class="dropdown-item event-${eventsAdded}" type="button" href="#">No</button>
                                                                <button id="maybe-${eventsAdded}" class="dropdown-item event-${eventsAdded}" type="button" href="#">Maybe</button>
                                                            </div>
                                                            <button class="btn btn-lg btn-flash-border-primary dropdown-toggle"
                                                                type="button" id="dropdownMenuButton-${eventsAdded}-1" data-bs-toggle="dropdown"
                                                                aria-expanded="false">
                                                                Attending
                                                            </button>
                                                            <ul class="dropdown-menu scrollable-menu" role="menu" aria-labelledby="dropdownMenuButton-${eventsAdded}-1">
                                                                <li id="attending-yes-${eventsAdded}">
                                                                    Yes:
                                                                </li>
                                                                <li id="attending-no-${eventsAdded}">
                                                                    No:
                                                                </li>
                                                                <li id="attending-maybe-${eventsAdded}">
                                                                    Maybe:
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>`;
                                        
    plannedEventsContainer.insertAdjacentHTML("afterbegin", plannedEventToInsert);

    const yesButton = document.getElementById(`yes-${eventsAdded}`);
    const noButton = document.getElementById(`no-${eventsAdded}`);
    const maybeButton = document.getElementById(`maybe-${eventsAdded}`);

    // const thisGroup = crud.getGroup(__currentGroupID__);
    // const plannedEvents = await thisGroup.getPlannedEvents();

    yesButton.addEventListener("click", () => {
        yesButton.classList.add("active");
        noButton.classList.remove("active");
        maybeButton.classList.remove("active");
        // plannedEvents[eventsAdded].yesDict[__currentUserID__] = 1;
    });
    noButton.addEventListener("click", () => {
        yesButton.classList.remove("active");
        noButton.classList.add("active");
        maybeButton.classList.remove("active");
        // plannedEvents[eventsAdded].noDict[__currentUserID__] = 1;
    });
    maybeButton.addEventListener("click", () => {
        yesButton.classList.remove("active");
        noButton.classList.remove("active");
        maybeButton.classList.add("active");
        // plannedEvents[eventsAdded].maybeDict[__currentUserID__] = 1;
    });

    const attendingYes = document.getElementById(`attending-yes-${eventsAdded}`);
    const attendingNo = document.getElementById(`attending-no-${eventsAdded}`);
    const attendingMaybe = document.getElementById(`attending-maybe-${eventsAdded}`);

    // reset innertexts
    attendingYes.innerText = "Yes:";
    attendingNo.innerText = "\nNo:";
    attendingMaybe.innerText = "\nMaybe:";

    // add all people attending events to the dropdown info lists
    for (attendee in plannedEvents[eventsAdded].yesDict) {
        attendingYes.innerText += "\n" + attendee;
    }
    for (attendee in plannedEvents[eventsAdded].noDict) {
        attendingNo.innerText += "\n" + attendee;
    }
    for (attendee in plannedEvents[eventsAdded].maybeDict) {
        attendingMaybe.innerText += "\n" + attendee;
    }

    eventsAdded += 1;
}

function selectAllMembers() {
    const checkBoxes = document.getElementsByClassName("member-checkbox");
    
    for (const box of checkBoxes) {
        box.checked = true;
    }
}

function deselectAllMembers() {
    const checkBoxes = document.getElementsByClassName("member-checkbox");
    
    for (const box of checkBoxes) {
        box.checked = false;
    }
}


/**
 * Takes input and provides results based on whether friend who could be member is found, not, or error
 * @param {string} username current user's username
 * @param {Element} potentialMembers column for adding found user who must be a friend of current user
 */
async function searchForMember(memberToFind, potentialMembers){
    try{
        //reset friend search results before searching
        potentialMembers.innerHTML = "";
        let areFriends = await crud.areFriends(mockusername, memberToFind.value);

        if(areFriends && memberToFind.value !== mockusername){
            await renderPotentialMember(memberToFind.value, currGroupId, potentialMembers);
        }
        else if(memberToFind.value === mockusername){
            potentialMembers.innerHTML =  "<span style='color: red;'>Hey, that's your username.</span>";
        }
        else {
            potentialMembers.innerHTML =  "<span style='color: red;'>Sorry, there aren't any other users close to that name!</span>";
        }
    }
    catch(error){
        potentialMembers.innerHTML =  "<span style='color: red;'>An unexpected error occured, please try again!</span>";
    }
}

// Add friend button waits to pop up search bar modal to
searchMemberButton.addEventListener('click', async (event) => {
    let memberToFind = document.getElementById("memberToFind");
    let potentialMembers = document.getElementById("potentialMembers");
    await searchForMember(memberToFind, potentialMembers);
});


/**
 * Pushes friend search result card dynamically to current user's member search column
 * Currently only provides card for exact username match, later if time could make load multiple similar to
 * @param {string} userIDToAdd requested username to retrieve obj of
 * @param {string} currGroupID current group's id
 * @param {Element} potentialMembers element to add card to
 */
async function renderPotentialMember(userIDToAdd, currGroupId, potentialMembers){
    // Temp image while we sort out image upload
    let image = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaIOsrWSBcmzWt30slQn0bplk5h92cKZSn84TfE4j6sI-rsxNLKWGWRbTpdP_LB9B8fEs&usqp=CAU";
    // User that we know exists to be found in friend search
    let userToAdd = await crud.getUser(userIDToAdd);
    // If already friends, then indicate that in the card result. Otherwise allow us to add them!
    let groupMembers = await crud.getGroupMemberUsernames(currGroupId);

    let isMember = groupMembers.includes(userIDToAdd);
    let buttonType = isMember ? 'class="btn btn-success disabled">Already a member' : 'class="btn btn-outline-secondary">Add';

    // This is the card for each friend found by the username searched, dynamic to the userID's content in DB
    let potentialMember = '<div class="card my-3">' +
        '<div class="row g-0">' +
            '<div class="col-md-2 d-flex">' +
                `<img src=${image}` +
                    'alt="generic profile pic" class="img-fluid rounded-start">'+
            '</div>' +
            '<div class="col-md-8 d-flex align-items-center">'+
                '<div class="card-body">'+
                    `<h5 class="card-title text-start">${userIDToAdd}</h5>`+
                '</div>'+
            '</div>'+
            '<div class="col-md-2 d-flex flex-column align-items-end justify-content-end">'+
                `<button id="${userIDToAdd}AddButton" type="button" ${buttonType}</button>`+
            '</div>'+
        '</div>'+
    '</div>';
    
    // Whether or not they are already friends, add respective card to indicate that
    potentialMembers.insertAdjacentHTML("afterbegin", potentialMember);

    let addMemberButton = document.getElementById(`${userIDToAdd}AddButton`);
    addMemberButton.addEventListener('click', async (event) => {
        await addMemberToGroup(userIDToAdd, currGroupId, addMemberButton)
    });
}


/**
 * Adds user found from current user's friends list to current group 
 * @param {string} userIdToAdd username to add
 * @param {string} currGroupId current group's id to add to
 * @param {Element} addMemberButton button to change based on result of action
 */
async function addMemberToGroup(userIdToAdd, currGroupId, addMemberButton){
    try {
        // Try to add user found as member, as they are not yet a member in group
        await crud.addMember(currGroupId, userIdToAdd);
        // Add just the new member card to smoothly update page rendered
        const userToAdd = await crud.getUser(userIdToAdd);
        addMember(userToAdd);

        // Alert user after CRUD request that the friend request worked
        addMemberButton.className = "btn btn-success";
        addMemberButton.innerText = "Added"
        addMemberButton.disabled = true;
    }
    catch(error){
        // Indicate that some error occurred when trying to add
        addMemberButton.className = "btn btn-danger";
        addMemberButton.innerText = "Try again later";
        // After certain amount of time, flip it back to Add button to try again
        setTimeout(function() {   
            addMemberButton.className = "btn btn-outline-primary";
            addMemberButton.innerText = "Add";
        }, 1000);
    }
}


async function renderGroupMembers() {
    // Wipe col to rerender
    membersContainer.innerHTML = "";

    const groupMemberIDs = await crud.getGroupMemberUsernames(currGroupId); // get list of IDs in Group

    for (const id of groupMemberIDs) { // for each ID, look up the member and add it to the display
        const user = await crud.getUser(id);
        addMember(user);
    }
}

async function renderPlannedEvents() {
    const currentGroup = crud.getGroup(currGroupId); // get Group object -- CURRENT_GROUP_ID_CURRENTLY_NOT_DETERMINED
    const plannedEventList = await currentGroup.getPlannedList(); // list of PlannedEvent objects

    for (const event of plannedEventList) { // for each PlannedEvent object in list
        addPlannedEvent(getTime(event.startHour, event.startMinute), getTime(event.endHour, event.endMinute), getDay(event.startDay), event.title, event.location, event.description);
    }
}

function getTime(hour, minute) {
    let suffix = 'am';

    if (hour == 12) {
        suffix = 'pm';
    }
    else if (hour >= 13) {
        hour -= 12;
        suffix = 'pm';
    }

    return hour + ':' + minute + suffix;
}

function getDay(dayNum) {
    const dayArr = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
    return dayArr[dayNum];
}

// event listeners
selectAllButton.addEventListener("click", selectAllMembers);
deselectAllButton.addEventListener("click", deselectAllMembers);


// INITIAL RENDERING OF INDIVIDUAL GROUP:
await renderGroupMembers();

await renderPlannedEvents();
