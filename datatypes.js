/**
 * The User class is made to represent a single User in a session, 
 * Users that belong to a group as members, or Users that are in another User's friendList
 * 
 * A User has a uniquely identifying username, name, profile info, friends, 
 * groups they're in, a profile photo, and booked time slots in their personal schedule that they set
 * 
 * userName = unique String
 * firstName = String
 * lastName = String
 * eventsList = List of BusyEvent objects
 * friendsList = List of User objects
 * groupsList = List of Group objects
 * college = String 
 * bio = String
 * image = ?
 */
class User {
    constructor(userName, firstName, lastName, eventsList, friendsList, groupsList, college, bio, image, requestsList) {

        this.userName = userName;

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
 * id = unique Integer
 * groupName = String
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
 * A BusyEvent has a title, start/end times and days in a standardized date/time format that can be parsed easily
 * 
 * startTime = String of standard time format: 00:00:00
 * endTime = String of standard time format: 00:00:00
 * startDay = String of standard date format: 2019-08-09
 * endDay = String of standard date format: 2019-08-10
 * title = String
 */
class BusyEvent {
    constructor(title, startTime, endTime, startDay, endDay) {
        this.title = title;

        this.startTime = startTime;
        this.endTime = endTime;

        this.startDay = startDay;
        this.endDay = endDay;
    }
}

/**
 * The PlannedEvent class inherits BusyEvent, made to represent a planned event in a Group object's plannedList
 * 
 * A PlannedEvent has everything that a BusyEvent has, in addition to location, description so members can learn more, 
 * lists of RSVP responses, and the username of the User who created the PlannedEvent
 * 
 * location = String
 * description = String
 * yesList = List of Users
 * noList = List of Users
 * maybeList = List of Users
 * creatorUsername = unique String
 */
class PlannedEvent extends BusyEvent {
    constructor(title, startTime, endTime, startDay, endDay, creatorUsername, location, description, yesList, noList, maybeList) {
        super(startTime, startDay, endTime, endDay, title);

        this.creatorUserName = creatorUserName;

        this.location = location;
        this.description = description;

        this.yesList = yesList;
        this.noList = noList;
        this.maybeList = maybeList;
    }
}

export { User, Group, BusyEvent, PlannedEvent };