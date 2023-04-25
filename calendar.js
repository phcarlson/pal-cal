const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

function initializeCalendar(calendarDiv) {
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
        dayDiv.classList.add("col", "m-2");
        dayDiv.id = `column-${day.toLowerCase()}`
        const dayHeader = document.createElement("div");
        dayHeader.classList.add("sticky-top", "calendar-weekday-header");
        dayHeader.innerText = day[0].toUpperCase() + day.slice(1);
        dayDiv.appendChild(dayHeader);
        calendarDiv.appendChild(dayDiv);
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
 * @param {boolean} isFiller True if this represents an event, false if this is a "filler" div representing time without an event
 * @param {string} text Text to display on the event block
 */
function addEventBlock(day, duration, isFiller, text="") {
    const weekdayCol = document.getElementById(`column-${days[day]}`);
    const cssClass = isFiller ? "calendar-filler" : "calendar-free-time";
    const eventDiv = document.createElement("div");
    eventDiv.classList.add("row", cssClass);
    eventDiv.style.height = `calc((100%/12) * ${duration})`
    eventDiv.innerText = text;
    weekdayCol.appendChild(eventDiv);
}

function addEvents(events) {
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
                addEventBlock(event.startDay, fillerDuration, false);
                const eventDuration = getDurationHours(event.startHour, event.startMinute, event.endHour, event.endMinute);
                const eventStartTime = toTwelveHour(event.startHour, event.startMinute);
                const eventEndTime = toTwelveHour(event.endHour, event.endMinute);
                const label = `Event ${eventStartTime}-${eventEndTime}`;
                addEventBlock(event.startDay, eventDuration, true, label);
                prevEventEndDay = event.endDay;
                prevEventEndHour = event.endHour;
                prevEventEndMinute = event.endMinute;
            }
            else {
                if (prevEventEndDay !== -1 && compareTimes(prevEventEndDay, prevEventEndHour, prevEventEndMinute, prevEventEndDay, 23, 59) < 0) {
                    // Fill in free time at the end of the day
                    const eventDuration = getDurationHours(prevEventEndHour, prevEventEndMinute, 23, 59);
                    addEventBlock(prevEventEndDay, eventDuration, false);
                }
                if (!(event.startHour === 0 && event.startMinute === 0)) {
                    const fillerDuration = getDurationHours(0, 0, event.startHour, event.startMinute);
                    addEventBlock(event.startDay, fillerDuration, false);
                }
                for (let day = prevEventEndDay + 1; day < event.startDay; ++day) {
                    // Fill in free time on days in between
                    addEventBlock(day, 24, false);
                }
                const eventDuration = getDurationHours(event.startHour, event.startMinute, event.endHour, event.endMinute);
                const eventStartTime = toTwelveHour(event.startHour, event.startMinute);
                const eventEndTime = toTwelveHour(event.endHour, event.endMinute);
                const label = `Busy ${eventStartTime}-${eventEndTime}`;
                addEventBlock(event.startDay, eventDuration, true, label);
                prevEventEndDay = event.endDay;
                prevEventEndHour = event.endHour;
                prevEventEndMinute = event.endMinute;
            }
        }
    }
    if (prevEventEndDay !== -1 && compareTimes(prevEventEndDay, prevEventEndHour, prevEventEndMinute, prevEventEndDay, 23, 59) < 0) {
        // Fill in free time at the end of the day
        const eventDuration = getDurationHours(prevEventEndHour, prevEventEndMinute, 23, 59);
        addEventBlock(prevEventEndDay, eventDuration, false);
    }
    for (let day = prevEventEndDay + 1; day <= 6; ++day) {
        // Fill in free time on days after the last busy time
        addEventBlock(day, 24, false);
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
            if (compareTimes(lastEvent.endDay, lastEvent.endHour, lastEvent.endMinute, event.startDay, event.startHour, event.startMinute) >= 0) {
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

initializeCalendar(document.getElementById("calendar"));

// Some random test events
const events = [
    {startDay: 0, startHour: 5,  startMinute: 30, endDay: 0, endHour: 10, endMinute: 45},
    {startDay: 0, startHour: 1,  startMinute: 0,  endDay: 0, endHour: 3,  endMinute: 0},
    {startDay: 0, startHour: 7,  startMinute: 30, endDay: 0, endHour: 11, endMinute: 0},
    {startDay: 2, startHour: 0,  startMinute: 0,  endDay: 2, endHour: 1,  endMinute: 30},
    {startDay: 2, startHour: 10, startMinute: 0,  endDay: 2, endHour: 13, endMinute: 30},
    {startDay: 5, startHour: 10, startMinute: 0,  endDay: 5, endHour: 11, endMinute: 30},
]

addEvents(consolidateEvents(events));