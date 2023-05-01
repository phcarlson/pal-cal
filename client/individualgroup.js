import { User, Group, BusyEvent, PlannedEvent } from './datatypes.js';
import * as crud from './crud.js';

// containers
const membersContainer = document.getElementById("members-container");
const plannedEventsContainer = document.getElementById("planned-events-container");

// buttons
const selectAllButton = document.getElementById("select-all-button");
const deselectAllButton = document.getElementById("deselect-all-button");

membersContainer.innerHTML = ''; // clear all members
plannedEventsContainer.innerHTML = ''; // clear all planned events

let eventsAdded = 0;

function addMember(screenName) {
    membersContainer.innerHTML += `<div class="card my-3">
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
                                                    <h5 class="card-title text-start">${screenName}</h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;

    //document.getElementById("flexCheckDefault").checked = true;
}

async function addPlannedEvent(startTime, endTime, startDay, title, location, description) {
    plannedEventsContainer.innerHTML += `<div class="card card-margin">
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
                                                            <button class="btn btn btn-lg btn-flash-border-primary dropdown-toggle"
                                                                type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown"
                                                                aria-expanded="false">
                                                                RSVP
                                                            </button>
                                                            <ul class="dropdown-menu opacity-75 " aria-labelledby="dropdownMenuButton1">
                                                                <li><a id="yes-${eventsAdded}" class="dropdown-item event-${eventsAdded}" href="#">Yes</a></li>
                                                                <li><a id="no-${eventsAdded}" class="dropdown-item event-${eventsAdded}" href="#">No</a></li>
                                                                <li><a id="maybe-${eventsAdded}" class="dropdown-item event-${eventsAdded}" href="#">Maybe</a></li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>`;
                                        
                                        const yesButton = document.getElementById(`yes-${eventsAdded}`);
                                        const noButton = document.getElementById(`no-${eventsAdded}`);
                                        const maybeButton = document.getElementById(`maybe-${eventsAdded}`);

                                        const thisGroup = crud.getGroup(__currentGroupID__);
                                        const plannedEvents = await thisGroup.getPlannedEvents();

                                        yesButton.addEventListener("click", () => {
                                            plannedEvents[eventsAdded].yesDict[__currentUserID__] = '';
                                        });
                                        noButton.addEventListener("click", () => {
                                            plannedEvents[eventsAdded].noDict[__currentUserID__] = '';
                                        });
                                        maybeButton.addEventListener("click", () => {
                                            plannedEvents[eventsAdded].maybeDict[__currentUserID__] = '';
                                        });

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

async function renderGroupMembers() {
    const currentGroup = crud.getGroup(__currentGroupID__); // get Group object -- CURRENT_GROUP_ID_CURRENTLY_NOT_DETERMINED
    const groupMemberIDs = await currentGroup.getMemberList(); // get list of IDs in Group

    for (const id of groupMemberIDs) { // for each ID, look up the member and add it to the display
        const user = crud.getUser(id);
        addMember(await user.getFirstName());
    }
}

async function renderPlannedEvents() {
    const currentGroup = crud.getGroup(__currentGroupID__); // get Group object -- CURRENT_GROUP_ID_CURRENTLY_NOT_DETERMINED
    const plannedEventList = await currentGroup.getPlannedList(); // list of PlannedEvent objects

    for (const event of plannedEventList) { // for each PlannedEvent object in list
        addPlannedEvent(getTime(event.startHour, event.startMinute), getTime(event.endHour, event.endMinute), getDay(event.startDay), event.title, event.location, event.description, event.yesDict, event.noDict, event.maybeDict, WHAAAAAAAAA);
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

// dummy data -- REST LOADED IN USING individualgroup.html, through loadmockdata.js file
addMember("Screen Name");
addMember("NAH");
addPlannedEvent("1:00pm", "3:00pm", 3, "My Party", "My HOuseEEE", "Big fat party");
addPlannedEvent("2:00pm", "4:00pm", 3, "Move in", "College Dorm", "College move in, drag stuff up a bunch of stairs");