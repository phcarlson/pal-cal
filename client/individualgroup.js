import { User, Group, BusyEvent, PlannedEvent } from './datatypes.js';
import * as crud from './crudclient.js';

// containers
const membersContainer = document.getElementById("members-container");
const plannedEventsContainer = document.getElementById("planned-events-container");

// buttons
const selectAllButton = document.getElementById("select-all-button");
const deselectAllButton = document.getElementById("deselect-all-button");

membersContainer.innerHTML = ''; // clear all members
plannedEventsContainer.innerHTML = ''; // clear all planned events

let eventsAdded = 0;

// dummy groupIDs and userIDs
const __currentGroupID__ = "f973b67e-bdc5-4fb1-855e-ad824ed1f057";
const __currentUserID__ = "username1";

function addMember(username) {
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
                                                    <h5 class="card-title text-start">${username}</h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;

    //document.getElementById("flexCheckDefault").checked = true;
}

async function addPlannedEvent(eventID, startTime, endTime, startDay, title, location, description) {
    console.log(eventID);
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
                                                        <div class="dropup">
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

    // initial RSVP lists for this event
    const yesRsvpList = await crud.getYesRSVPsTo(eventID);
    const noRsvpList = await crud.getNoRSVPsTo(eventID);
    const maybeRsvpList = await crud.getMaybeRSVPsTo(eventID);
    
    // yes, no, maybe buttons
    const yesButton = document.getElementById(`yes-${eventsAdded}`);
    const noButton = document.getElementById(`no-${eventsAdded}`);
    const maybeButton = document.getElementById(`maybe-${eventsAdded}`);

    // set initial active status for rsvp option buttons
    let activeButton = undefined;

    if (yesRsvpList.includes(__currentUserID__)) {
        yesButton.classList.add("active");
        activeButton = yesButton;
    }
    else if (noRsvpList.includes(__currentUserID__)) {
        noButton.classList.add("active");
        activeButton = noButton;
    }
    else if (maybeRsvpList.includes(__currentUserID__)) {
        maybeButton.classList.add("active");
        activeButton = maybeButton;
    }

    // FUNCTION: Updates RSVP list displays for event
    async function updateAttendingLists() {
        // reset innertexts
        attendingYes.innerText = "Yes:";
        attendingNo.innerText = "\nNo:";
        attendingMaybe.innerText = "\nMaybe:";

        // add all people attending events to the attendee info lists
        for (const attendee of await crud.getYesRSVPsTo(eventID)) {
            attendingYes.innerText += "\n" + attendee;
        }
        for (const attendee of await crud.getNoRSVPsTo(eventID)) {
            attendingNo.innerText += "\n" + attendee;
        }
        for (const attendee of await crud.getMaybeRSVPsTo(eventID)) {
            attendingMaybe.innerText += "\n" + attendee;
        }
        console.log("|"+attendingYes.innerText+"|");
        console.log("|"+attendingNo.innerText+"|");
        console.log("|"+attendingMaybe.innerText+"|");
    }

    yesButton.addEventListener("click", async () => {
        // if a button was active, remove user from RSVP list for event
        if (activeButton !== undefined) {
            await crud.deleteRSVP(eventID, __currentUserID__);
        }

        // if yes was active, remove it from active
        if (activeButton === yesButton) {
            yesButton.classList.remove("active");
            activeButton = undefined;
        }
        else {
            // add user to RSVP list
            await crud.addRSVP(eventID, __currentUserID__, "YES");

            // if another button was active, remove it
            if (activeButton !== undefined) {
                activeButton.classList.remove("active");
            }
            yesButton.classList.add("active");
            activeButton = yesButton;
        }
        await updateAttendingLists();
    });
    noButton.addEventListener("click", async () => {
        // if a button was active, remove user from RSVP list for event
        if (activeButton !== undefined) {
            await crud.deleteRSVP(eventID, __currentUserID__);
        }

        if (activeButton === noButton) {
            noButton.classList.remove("active");
            activeButton = undefined;
        }
        else {
            // add user to RSVP list
            await crud.addRSVP(eventID, __currentUserID__, "NO");

            // if another button was active, remove it
            if (activeButton !== undefined) {
                activeButton.classList.remove("active");
            }
            noButton.classList.add("active");
            activeButton = noButton;
        }
        await updateAttendingLists();
    });
    maybeButton.addEventListener("click", async () => {
        // if a button was active, remove user from RSVP list for event
        if (activeButton !== undefined) {
            await crud.deleteRSVP(eventID, __currentUserID__);
        }

        if (activeButton === maybeButton) {
            maybeButton.classList.remove("active");
            activeButton = undefined;
        }
        else {
            // add user to RSVP list
            await crud.addRSVP(eventID, __currentUserID__, "MAYBE");

            // if another button was active, remove it
            if (activeButton !== undefined) {
                activeButton.classList.remove("active");
            }
            maybeButton.classList.add("active");
            activeButton = maybeButton;
        }
        await updateAttendingLists();
    });

    // dropdown list items
    const attendingYes = document.getElementById(`attending-yes-${eventsAdded}`);
    const attendingNo = document.getElementById(`attending-no-${eventsAdded}`);
    const attendingMaybe = document.getElementById(`attending-maybe-${eventsAdded}`);

    await updateAttendingLists();

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
    const groupMemberUsernames = await crud.getGroupMemberUsernames(__currentGroupID__); // get usernameList for current group

    for (const username of groupMemberUsernames) { // for each username, add it to the display
        addMember(username);
    }
}

async function renderPlannedEvents() {
    const plannedEventIDs = await crud.getGroupPlannedEventIds(__currentGroupID__); // list of PlannedEvent IDs

    for (const eventID of plannedEventIDs) { // for each PlannedEventID in list
        const event = await crud.getPlannedEvent(eventID);
        addPlannedEvent(eventID, getTime(event.startHour, event.startMinute), getTime(event.endHour, event.endMinute), getDay(event.startDay), event.title, event.location, event.description);
    }
}

function getTime(hour, minute) {
    let suffix = 'am';

    // set 'am' or 'pm' suffix
    if (hour == 12) {
        suffix = 'pm';
    }
    else if (hour >= 13) {
        hour -= 12;
        suffix = 'pm';
    }

    // if minute is less than 10, add a leading 0
    const preMinuteZero = minute < 10 ? "0" : "";

    // if hour is 0, change it to 12
    if (hour === 0) { hour = 12; }

    return hour + ':' + preMinuteZero + minute + suffix;
}

function getDay(dayNum) {
    const dayArr = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
    return dayArr[dayNum];
}

// event listeners
selectAllButton.addEventListener("click", selectAllMembers);
deselectAllButton.addEventListener("click", deselectAllMembers);

await renderGroupMembers();
await renderPlannedEvents();

// dummy data -- REST LOADED IN USING individualgroup.html, through loadmockdata.js file
// addMember("Screen Name");
// addMember("NAH");
// addPlannedEvent("aa", "1:00pm", "3:00pm", 3, "My Party", "My HOuseEEE", "Big fat party");
// addPlannedEvent("2:00pm", "4:00pm", 3, "Move in", "College Dorm", "College move in, drag stuff up a bunch of stairs");