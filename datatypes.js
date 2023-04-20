/**
 * The User class is made to represent a single User in a session, 
 * Users that belong to a group as members, or Users that are in another User's friendList
 * 
 * A User has a uniquely identifying username, name, profile info, friends, 
 * groups they're in, a profile photo, and booked time slots in their personal schedule that they set. 
 * They also have a list of pending requests that have yet to be answered
 * 
 * username = unique string
 * firstName, lastName = string
 * eventsList = List of BusyEvent objects
 * friendsList = List of User objects
 * groupsList = List of Group objects
 * college = string 
 * bio = string
 * requestsList = List of User objects
 * image = ?
 */
class User {
    constructor(username, firstName, lastName, eventsList, friendsList, groupsList, college, bio, image, requestsList) {

        this.username = username;

        this.firstName = firstName;
        this.lastName = lastName;

        this.eventsList = eventsList;
        this.friendsList = friendsList;
        this.groupsList = groupsList;

        this.college = college;
        this.bio = bio;
        this.image = image;
        this.requestsList = requestsList;
    }
}

/**
 * The Group class is made to represent a single Group that has been created by some User 
 * 
 * A Group has an identifying unique id, name, image, 
 * list of members joined, and list of booked/planned events
 * 
 * id = unique int
 * groupName = string
 * memberList = List of User objects
 * plannedList = List of PlannedEvent objects
 * image = ?
 */
class Group {
    constructor(id, groupName, memberList, plannedList, image) {
        this.id = id;
        this.groupName = groupName;

        this.memberList = memberList;
        this.plannedList = plannedList;

        this.image = image;
    }
}

/**
 * The BusyEvent class is made to represent a generic event
 * 
 * A BusyEvent has a title, start/end times 
 * and days in a standardized date/time format that can be parsed easily
 * 
 * title = string
 * startHour, endHour = int in range 0-23 for hours in military time
 * startMinute, endMinute = int in range 0-59 for minute of the hour
 * startDay, endDay = int in range of 0-6, where 0 = Sunday, 1 = Monday... 6 = Saturday
 */
class BusyEvent {
    constructor(title, startHour, endHour, startMinute, endMinute, startDay, endDay) {
        this.title = title;

        this.startHour = startHour;
        this.endHour = endHour;

        this.startMinute = startMinute;
        this.endMinute = endMinute;

        this.startDay = startDay;
        this.endDay = endDay;
    }
}

/**
 * The PlannedEvent class inherits BusyEvent, made to represent a planned event in a Group object's plannedList
 * 
 * A PlannedEvent has everything that a BusyEvent has, in addition to location, description so members can learn more, 
 * dictionaries of RSVP responses to easily access whether a specific User responded, and the username of the User who created the PlannedEvent
 * 
 * creatorUsername = unique string
 * location = string
 * description = string
 * yesDict, noDict, maybeDict = Generic object AKA dictionary of Users where key is a User's username and value is ''
 */
class PlannedEvent extends BusyEvent {
    constructor(title, startHour, endHour, startMinute, endMinute, startDay, endDay, 
        creatorUsername, location, description, yesDict, noDict, maybeDict) {

        super(title, startHour, endHour, startMinute, endMinute, startDay, endDay);

        this.creatorUsername = creatorUsername;

        this.location = location;
        this.description = description;

        this.yesDict = yesDict;
        this.noDict = noDict;
        this.maybeDict = maybeDict;
    }
}

export { User, Group, BusyEvent, PlannedEvent };