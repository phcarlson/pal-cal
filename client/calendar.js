import * as crud from './crudclient.js';

const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
// TODO: get username dynamically
const username = "user1";
const groupId = "343fef37-8bbc-42f8-88b2-911b488ccd08";
let newEventModalTime = {};
let newPlannedEventModal;
let newBusyEventModal;
let editBusyEventModal;

export async function initializeCalendar(calendarDiv, type) {
    calendarDiv.classList.add("row", "d-flex");
    const hoursCol = document.createElement("div");
    hoursCol.innerText = "hours";
    hoursCol.classList.add("col", "m-2");
    
    // Create hour labels
    for (let hour = 0; hour < 24; ++hour) {
        const hourDiv = document.createElement("div");
        hourDiv.classList.add("row", "border");
        hourDiv.style.height = "calc(100%/12)";
        hourDiv.innerText = toTwelveHour(hour, 0);
        hoursCol.appendChild(hourDiv);
    }
    calendarDiv.appendChild(hoursCol);

    // Create weekday columns
    for (let day of days) {
        const dayDiv = document.createElement("div");
        dayDiv.classList.add("col", "m-2", "weekday-column");
        dayDiv.id = `column-${day.toLowerCase()}`
        const dayHeader = document.createElement("div");
        dayHeader.classList.add("sticky-top", "calendar-weekday-header");
        dayHeader.innerText = day[0].toUpperCase() + day.slice(1);
        dayDiv.appendChild(dayHeader);
        calendarDiv.appendChild(dayDiv);
    }

    if (type === "group") {
        const newPlannedEventModalHtml = /*html*/`
            <div class="modal fade" id="modal-new-planned-event" tabindex="-1" role="dialog" aria-hidden="true" aria-labelledby="modal-new-planned-event-label">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="modal-new-planned-event-label">Add event</h5>
                            <button type="button" id="modal-new-planned-event-close-x" class="btn-close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <form>
                                <div class="mb-3">
                                    <label for="title-input" class="form-label">Title</label>
                                    <input type="text" class="form-control" id="new-planned-event-title-input">
                                </div>
                                <div class="mb-3">
                                    <label for="start-time-input" class="form-label">Start time</label>
                                    <input type="time" class="form-control" id="new-planned-event-start-time-input" required>
                                </div>
                                <div class="mb-3">
                                    <label for="new-planned-event-end-time-input" class="form-label">End time</label>
                                    <input type="time" class="form-control" id="new-planned-event-end-time-input" required>
                                </div>
                                <div class="mb-3">
                                    <label for="description-input" class="form-label">Description</label>
                                    <textarea id="new-planned-event-description-input"></textarea>
                                </div>
                            </form>

                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" id="modal-new-planned-event-close" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" id="modal-new-planned-event-save">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML("afterbegin", newPlannedEventModalHtml);
        newPlannedEventModal = new bootstrap.Modal(document.getElementById('modal-new-planned-event'));
        document.getElementById("modal-new-planned-event-close").addEventListener("click", () => newPlannedEventModal.hide());
        document.getElementById("modal-new-planned-event-save").addEventListener("click", () => {
            const newPlannedEventStartTimeInput = document.getElementById("new-planned-event-start-time-input");
            // TODO: support spanning multiple days
            let startDay = newEventModalTime.day;
            let endDay = newEventModalTime.day;
            let [startHour, startMinute] = newPlannedEventStartTimeInput.value.split(":");
            startHour = Number(startHour);
            startMinute = Number(startMinute);

            const newPlannedEventEndTimeInput = document.getElementById("new-planned-event-end-time-input");
            let [endHour, endMinute] = newPlannedEventEndTimeInput.value.split(":");
            endHour = Number(endHour);
            endMinute = Number(endMinute);

            if (compareTimes(0, endHour, endMinute, 0, newEventModalTime.endHour, newEventModalTime.endMinute) > 0 ||
                compareTimes(0, endHour, endMinute, 0, newEventModalTime.startHour, newEventModalTime.startMinute) < 0 ||
                compareTimes(0, startHour, startMinute, 0, newEventModalTime.startHour, newEventModalTime.startMinute) < 0 ||
                compareTimes(0, startHour, startMinute, 0, newEventModalTime.endHour, newEventModalTime.endMinute) > 0
            ) {
                // If the start and end time aren't within this block
                alert(`Select a time between ${toTwelveHour(newEventModalTime.startHour, newEventModalTime.startMinute)} and ${toTwelveHour(newEventModalTime.endHour, newEventModalTime.endMinute)} or select another block of free time`);
                return;
            }

            const title = document.getElementById("new-planned-event-title-input").value;
            const description = document.getElementById("new-planned-event-description-input").value;
            const location = ""; // TODO

            newPlannedEventModal.hide();
            addPlannedEvent({ title: title, startDay: startDay, startHour: startHour, startMinute: startMinute, endDay: endDay, endHour: endHour, endMinute: endMinute, creatorUsername: username, location: location, description: description });
        });

        document.getElementById("modal-new-planned-event-close-x").addEventListener("click", () => newPlannedEventModal.hide());

    }
    else {
        const newBusyEventModalHtml = /*html*/ `
            <div class="modal fade" id="modal-new-busy-event" tabindex="-1" role="dialog" aria-hidden="true" aria-labelledby="modal-new-busy-event-label">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="modal-new-busy-event-label">Add event</h5>
                            <button type="button" id="modal-new-busy-event-close-x" class="btn-close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <form>
                                <div class="mb-3">
                                    <label for="new-busy-event-title-input" class="form-label">Title</label>
                                    <input type="text" class="form-control" id="new-busy-event-title-input">
                                </div>
                                <div class="mb-3">
                                    <label for="new-busy-event-day-input" class="form-label">Weekday</label>
                                    <select class="custom-select"  id="new-busy-event-day-input">
                                        <option value=0>Sunday</option>
                                        <option value=1 selected>Monday</option>
                                        <option value=2>Tuesday</option>
                                        <option value=3>Wednesday</option>
                                        <option value=4>Thursday</option>
                                        <option value=5>Friday</option>
                                        <option value=6>Saturday</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="start-time-input" class="form-label">Start time</label>
                                    <input type="time" class="form-control" id="new-busy-event-start-time-input" required>
                                </div>
                                <div class="mb-3">
                                    <label for="new-busy-event-end-time-input" class="form-label">End time</label>
                                    <input type="time" class="form-control" id="new-busy-event-end-time-input" required>
                                </div>
                            </form>

                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" id="modal-new-busy-event-close" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" id="modal-new-busy-event-save">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML("afterbegin", newBusyEventModalHtml);
        newBusyEventModal = new bootstrap.Modal(document.getElementById('modal-new-busy-event'));
        document.getElementById("modal-new-busy-event-close").addEventListener("click", () => newBusyEventModal.hide());
        document.getElementById("button-new-busy-event").addEventListener("click", () => newBusyEventModal.show());
        document.getElementById("modal-new-busy-event-close-x").addEventListener("click", () => newBusyEventModal.hide());
        document.getElementById("modal-new-busy-event-save").addEventListener("click", async () => {
            const startTimeInput = document.getElementById("new-busy-event-start-time-input");

            let [startHour, startMinute] = startTimeInput.value.split(":");
            startHour = Number(startHour);
            startMinute = Number(startMinute);

            const endTimeInput = document.getElementById("new-busy-event-end-time-input");
            let [endHour, endMinute] = endTimeInput.value.split(":");
            endHour = Number(endHour);
            endMinute = Number(endMinute);

            // TODO: support spanning multiple days
            const startDay = document.getElementById("new-busy-event-day-input").value;
            const endDay = startDay;

            const title = document.getElementById("new-busy-event-title-input").value;

            const newEvent = {
                title: title,
                startDay: startDay,
                startHour: startHour,
                startMinute: startMinute,
                endDay: endDay,
                endHour: endHour,
                endMinute: endMinute
            };
            // TODO: add event with CRUD
            await crud.createBusyEvent(username, newEvent);
            newBusyEventModal.hide();
            await rerender(type);
        });

        const editBusyEventModalHtml = /*html*/ `
            <div class="modal fade" id="modal-edit-busy-event" tabindex="-1" role="dialog" aria-hidden="true" aria-labelledby="modal-edit-busy-event-label">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="modal-edit-busy-event-label">Add event</h5>
                            <button type="button" id="modal-edit-busy-event-close-x" class="btn-close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <form>
                                <div class="mb-3">
                                    <label for="edit-busy-event-title-input" class="form-label">Title</label>
                                    <input type="text" class="form-control" id="edit-busy-event-title-input">
                                </div>
                                <div class="mb-3">
                                    <label for="edit-busy-event-day-input" class="form-label">Weekday</label>
                                    <select class="custom-select"  id="edit-busy-event-day-input">
                                        <option value=0>Sunday</option>
                                        <option value=1 selected>Monday</option>
                                        <option value=2>Tuesday</option>
                                        <option value=3>Wednesday</option>
                                        <option value=4>Thursday</option>
                                        <option value=5>Friday</option>
                                        <option value=6>Saturday</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="edit-busy-event-start-time-input" class="form-label">Start time</label>
                                    <input type="time" class="form-control" id="edit-busy-event-start-time-input" required>
                                </div>
                                <div class="mb-3">
                                    <label for="edit-busy-event-end-time-input" class="form-label">End time</label>
                                    <input type="time" class="form-control" id="edit-busy-event-end-time-input" required>
                                </div>
                            </form>

                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" id="modal-edit-busy-event-close" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-danger" id="edit-busy-event-delete">Delete event</button>
                            <button type="button" class="btn btn-primary" id="modal-edit-busy-event-save">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML("afterbegin", editBusyEventModalHtml);
        editBusyEventModal = new bootstrap.Modal(document.getElementById('modal-edit-busy-event'));
        document.getElementById("modal-edit-busy-event-close").addEventListener("click", () => editBusyEventModal.hide());
        document.getElementById("modal-edit-busy-event-close-x").addEventListener("click", () => editBusyEventModal.hide());
        document.getElementById("modal-new-busy-event-save").addEventListener("click", async () => {
            const startTimeInput = document.getElementById("new-busy-event-start-time-input");

            let [startHour, startMinute] = startTimeInput.value.split(":");
            startHour = Number(startHour);
            startMinute = Number(startMinute);

            const endTimeInput = document.getElementById("new-busy-event-end-time-input");
            let [endHour, endMinute] = endTimeInput.value.split(":");
            endHour = Number(endHour);
            endMinute = Number(endMinute);

            // TODO: support spanning multiple days
            const startDay = document.getElementById("new-busy-event-day-input").value;
            const endDay = startDay;

            const title = document.getElementById("new-busy-event-title-input").value;

            const updatedEvent = {
                title: title,
                startDay: startDay,
                startHour: startHour,
                startMinute: startMinute,
                endDay: endDay,
                endHour: endHour,
                endMinute: endMinute
            };
            // TODO: update event with CRUD
            newBusyEventModal.hide();
            await rerender(type);
        });
        document.getElementById("edit-busy-event-delete").addEventListener("click", () => {
            // TODO: delete event by ID
        });
    }
}

/**
 * Converts a time to a 12-hour string representation
 * e.g. toTwelveHour(13, 5) => "1:05 PM"
 * @param {*} hour The 24-hour time, i.e. the number of hours since midnight
 * @param {*} minute The number of minutes since the start of the hour
 * @returns A string representing the given time in 12-hour format with AM/PM
 */
function toTwelveHour(hour, minute=0) {
    const hourStr = (hour % 12 === 0) ? "12" : String(hour % 12);
    const minuteStr = String(minute).padStart(2, "0");
    const ampm = hour < 12 ? "AM" : "PM";
    return `${hourStr}:${minuteStr} ${ampm}`
}

/**
 * Add a div to the calendar representing an event or lack thereof
 * @param {number} day The day of the week to add the event. 0-6 for sunday-saturday
 * @param {number} duration The length of the event in hours
 * @param {string} type One of "busy", "planned", or "filler"
 * @param {string} text Text to display on the event block
 */
function renderEventBlock(event, type, text="") {
    const weekdayCol = document.getElementById(`column-${days[event.startDay]}`);
    const eventDiv = document.createElement("div");
    const duration = getDurationHours(event.startHour, event.startMinute, event.endHour, event.endMinute);
    eventDiv.classList.add("row", "calendar-element");
    switch (type) {
        case "filler":
            eventDiv.classList.add("calendar-filler");
            break;
        case "free":
            eventDiv.classList.add("calendar-block", "calendar-free");
            eventDiv.dataset.day = event.startDay;
            eventDiv.dataset.startHour = event.startHour;
            eventDiv.dataset.startMinute = event.startMinute;
            eventDiv.dataset.endHour = event.endHour;
            eventDiv.dataset.endMinute = event.endMinute;
            break;
        case "planned":
            eventDiv.classList.add("calendar-block", "calendar-planned");
            break;
        case "busy":
            eventDiv.classList.add("calendar-block", "calendar-busy");
            eventDiv.dataset.busyEventId = event.busyEventId;
            break;
    }
    eventDiv.style.height = `calc((100%/12) * ${duration})`;
    eventDiv.innerText = text;
    weekdayCol.appendChild(eventDiv);
}

function renderEvents(events, type="group") {
    let prevEventEndDay = -1;
    let prevEventEndHour = -1;
    let prevEventEndMinute = -1;

    for (let event of events) {
        // TODO: also handle events spanning multiple days
        if (event.startDay === event.endDay) {
            if (event.startDay === prevEventEndDay) {
                // If this is not the first event of the day, add padding after
                // the last event
                const fillerDuration = getDurationHours(prevEventEndHour, prevEventEndMinute, event.startHour, event.startMinute);
                if (fillerDuration > 0.25) {
                    const blockType = type === "group" ? "free" : "filler";
                    renderEventBlock({startDay: prevEventEndDay, startHour: prevEventEndHour, startMinute: prevEventEndMinute, endHour: event.startHour, endMinute: event.startMinute}, blockType, "");
                }
                const eventStartTime = toTwelveHour(event.startHour, event.startMinute);
                const eventEndTime = toTwelveHour(event.endHour, event.endMinute);
                const label = `${event.title ? event.title : "event"} ${eventStartTime}-${eventEndTime}`;
                renderEventBlock(event, event.type, label);
                prevEventEndDay = event.endDay;
                prevEventEndHour = event.endHour;
                prevEventEndMinute = event.endMinute;
            }
            else {
                // Add padding between midnight and the first event of the day
                if (!(event.startHour === 0 && event.startMinute === 0)) {
                    const blockType = type === "group" ? "free" : "filler";
                    renderEventBlock({startDay: event.startDay, startHour: 0, startMinute: 0, endHour: event.startHour, endMinute: event.startMinute}, blockType, "");
                }
                const eventStartTime = toTwelveHour(event.startHour, event.startMinute);
                const eventEndTime = toTwelveHour(event.endHour, event.endMinute);
                const label = `${event.title ? event.title : "event"} ${eventStartTime}-${eventEndTime}`;
                renderEventBlock(event, event.type, label);
                if (type === "group") {
                    if (prevEventEndDay !== -1 && compareTimes(prevEventEndDay, prevEventEndHour, prevEventEndMinute, prevEventEndDay, 23, 59) < 0) {
                        // Fill in free time at the end of the day
                        renderEventBlock({startDay: prevEventEndDay, startHour: prevEventEndHour, startMinute: prevEventEndMinute, endHour: 23, endMinute: 59}, "free", "");
                    }

                    for (let day = prevEventEndDay + 1; day < event.startDay; ++day) {
                        // Fill in free time on days in between
                        renderEventBlock({startDay: day, startHour: 0, startMinute: 0, endHour: 23, endMinute: 59}, "free");
                    }
                }
                prevEventEndDay = event.endDay;
                prevEventEndHour = event.endHour;
                prevEventEndMinute = event.endMinute;
            }
        }
    }
    if (type === "group") {
        if (prevEventEndDay !== -1 && compareTimes(prevEventEndDay, prevEventEndHour, prevEventEndMinute, prevEventEndDay, 23, 59) < 0) {
            // Fill in free time at the end of the day
            renderEventBlock({startDay: prevEventEndDay, startHour: prevEventEndHour, startMinute: prevEventEndMinute, endHour: 23, endMinute: 59}, "free");
        }
        for (let day = prevEventEndDay + 1; day <= 6; ++day) {
            // Fill in free time on days after the last busy time
            renderEventBlock({startDay: day, startHour: 0, startMinute: 0, endHour: 23, endMinute: 59}, "free");
        }
    }

}

/**
 * Get the length of a timespan in (fractional) hours
 * @param {number} startHour The start hour, in 24-hour time
 * @param {number} startMinute The minute of the start hour
 * @param {number} endHour The end hour, in 24-hour time
 * @param {number} endMinute The minute of the end hour
 * @returns Returns the difference between the two times in hours. e.g. getDurationHours(10, 0, 15, 30) -> 5.5
 */
function getDurationHours(startHour, startMinute, endHour, endMinute) {
    return (endHour + 1/60 * endMinute) - (startHour + 1/60 * startMinute);
}

/**
 * Takes two times and checks if time A is before, equal, or after time B
 * @param {number} dayA 
 * @param {number} hourA 
 * @param {number} minuteA 
 * @param {number} dayB 
 * @param {number} hourB 
 * @param {number} minuteB 
 * @returns Positive number if A is after B, negative if B is after A, 0 if
 * they are the same
 */
function compareTimes(dayA, hourA, minuteA, dayB, hourB, minuteB) {
    if (dayA !== dayB) {
        return dayA - dayB;
    }
    else if (hourA !== hourB) {
        return hourA - hourB;
    }
    else {
        return minuteA - minuteB;
    }
}

/**
 * Combines any busy events that overlap into a single event
 * Ex: if A is busy from 1-3 and B is busy from 2-4, then there is *someone*
 * busy from 1-4, so this should show as a single busy block on the group calendar
 * @param {Array[BusyEvent]} events 
 */
function consolidateEvents(events) {
    let consolidated = [];
    const eventsSorted = events.slice(0);
    // Sort events by increasing start time
    eventsSorted.sort((a, b) => 
        compareTimes(a.startDay, a.startHour, a.startMinute, b.startDay, b.startHour, b.startMinute)
    );

    for (let event of eventsSorted) {
        if (consolidated.length === 0) {
            consolidated.push(event);
        }
        else {
            let lastEvent = consolidated.at(-1);
            // If this new event starts before the last event ends, merge them
            if (lastEvent.type === "filler" && event.type === "filler" &&
                    compareTimes(lastEvent.endDay, lastEvent.endHour, lastEvent.endMinute, event.startDay, event.startHour, event.startMinute) >= 0) 
            {
                lastEvent.endDay = event.endDay;
                lastEvent.endHour = event.endHour;
                lastEvent.endMinute = event.endMinute;
            }
            else {
                consolidated.push(event);
            }
        }
    }
    return consolidated;
}

async function addPlannedEvent(event) {
    // For now, just add to this list
    // Once CRUD is working, will add to the group's planned events database
    plannedEvents.push(event);
    await rerender();
}

/**
 * Delete every element with the given classname
 * Credit: https://stackoverflow.com/a/14066534
 * @param {string} className 
 */
function removeElementsByClass(className){
    const elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}


export async function rerender(type="group") {
    removeElementsByClass("calendar-element");
    let events;
    if (type === "profile") {
        const busyEventIds = await crud.getBusyEventIdsOfUser(username);
        const busyEvents = await crud.getBusyEvents(busyEventIds);            
        events = busyEvents.map(event => {
            let newEvent = structuredClone(event);
            newEvent.type = "busy";
            return newEvent;
        });
    }
    else {
        const usernames = await crud.getGroupMemberUsernames(groupId);
        const busyEventIds = [];
        for (let username of usernames) {
            const userEventIds = await crud.getBusyEventIdsOfUser(username);
            busyEventIds.push(...userEventIds);
        }
        const busyEvents = await crud.getBusyEvents(busyEventIds);
        const groupPlannedEventIds = await crud.getGroupPlannedEventIds(groupId);
        const plannedEvents = await crud.getPlannedEvents(groupPlannedEventIds);
        events = busyEvents.map(event => {
            let newEvent = structuredClone(event);
            newEvent.type = "filler";
            return newEvent;
        }).concat(plannedEvents.map(event => {
            let newEvent = structuredClone(event);
            newEvent.type = "planned";
            return newEvent;
        }));
    }

    renderEvents(consolidateEvents(events), type);

    for (let element of document.getElementsByClassName("calendar-free")) {
        element.addEventListener("click", (event) => {
            const clickedBlock = event.target;
            const blockDay = clickedBlock.dataset.day;
            const blockStartHour = clickedBlock.dataset.startHour;
            const blockStartMinute = clickedBlock.dataset.startMinute;
            const blockEndHour = clickedBlock.dataset.endHour;
            const blockEndMinute = clickedBlock.dataset.endMinute;

            newEventModalTime = { day: Number(blockDay), startHour: Number(blockStartHour), startMinute: Number(blockStartMinute), endHour: Number(blockEndHour), endMinute: Number(blockEndMinute) };

            const startTimeInput = document.getElementById("new-planned-event-start-time-input");
            startTimeInput.value = `${String(blockStartHour).padStart(2, 0)}:${String(blockStartMinute).padStart(2, 0)}`
            const endTimeInput = document.getElementById("new-planned-event-end-time-input");
            endTimeInput.value = `${String(blockEndHour).padStart(2, 0)}:${String(blockEndMinute).padStart(2, 0)}`

            startTimeInput.min = startTimeInput.value;
            startTimeInput.max = endTimeInput.value;
            endTimeInput.min = startTimeInput.value;
            endTimeInput.max = endTimeInput.value;

            newPlannedEventModal.show();
        });
    }

    for (let element of document.getElementsByClassName("calendar-busy")) {
        element.addEventListener("click", async (event) => {
            const clickedBlock = event.target;
            const busyEventId = clickedBlock.dataset.busyEventId;
            // TODO: populate with busy event data from CRUD
            await populateBusyEventModal(busyEventId);
            editBusyEventModal.show();
        });
    }
}

async function populateBusyEventModal(busyEventId) {
    const busyEvent = await crud.getBusyEvent(busyEventId);
    const dayInput = document.getElementById("edit-busy-event-day-input");
    dayInput.value = busyEvent.startDay;

    const titleInput = document.getElementById("edit-busy-event-title-input");
    titleInput.value = busyEvent.title;

    const startTimeInput = document.getElementById("edit-busy-event-start-time-input");
    const endTimeInput = document.getElementById("edit-busy-event-end-time-input");
    startTimeInput.value = `${String(busyEvent.startHour).padStart(2, 0)}:${String(busyEvent.startMinute).padStart(2, 0)}`;
    endTimeInput.value = `${String(busyEvent.endHour).padStart(2, 0)}:${String(busyEvent.endMinute).padStart(2, 0)}`;

    document.getElementById("modal-edit-busy-event-save").addEventListener("click", async () => {
        await updateEventFromModal(busyEventId);
        editBusyEventModal.hide();
        await rerender("profile");
    });
}

async function updateEventFromModal(busyEventId) {
    const dayInput = document.getElementById("edit-busy-event-day-input");

    const titleInput = document.getElementById("edit-busy-event-title-input");

    const startTimeInput = document.getElementById("edit-busy-event-start-time-input");
    const endTimeInput = document.getElementById("edit-busy-event-end-time-input");
    let [startHour, startMinute] = startTimeInput.value.split(":");
    startHour = Number(startHour);
    startMinute = Number(startMinute);
    let [endHour, endMinute] = endTimeInput.value.split(":");
    endHour = Number(endHour);
    endMinute = Number(endMinute);

    await crud.updateBusyEvent(busyEventId, {
        title: titleInput.value,
        startDay: dayInput.value,
        endDay: dayInput.value,
        startHour: startHour,
        startMinute: startMinute,
        endHour: endHour, 
        endMinute: endMinute
    });
}