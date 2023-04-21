const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

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
        dayHeader.innerText = day;
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
 * @param {boolean} event True if this represents an event, false if this is a "filler" div representing time without an event
 */
function addEventBlock(day, duration, busy) {
    const weekdayCol = document.getElementById(`column-${days[day]}`);
    const cssClass = busy ? "calendar-event" : "calendar-no-event";
    const eventDiv = document.createElement("div");
    eventDiv.classList.add("row", cssClass);
    eventDiv.style.height = `calc((100%/12) * ${duration})`
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

initializeCalendar(document.getElementById("calendar"));