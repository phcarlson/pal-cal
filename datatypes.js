class User {
    constructor(userName, firstName, lastName, eventsList, friendsList, groupsList, college, bio, image) {
        this.id = -1;
        this.userName = userName;
        this.firstName = firstName;
        this.lastName = lastName;
        this.eventsList = eventsList;
        this.friendsList = friendsList;
        this.groupsList = groupsList;
        this.college = college;
        this.bio = bio;
        this.image = image;
    }
}

class Group {
    constructor(memberList, groupName, image, plannedEvents) {
        this.id = -1;
        this.memberList = memberList;
        this.groupName = groupName;
        this.plannedEvents = plannedEvents;
        this.image = image;
    }
}

class BusyEvent {
    constructor(startTime, startDay, endTime, endDay, title) {
        this.startTime = startTime;
        this.startDay = startDay;
        this.endTime = endTime;
        this.endDay = endDay;
        this.title = title;
    }
}

class PlannedEvent extends BusyEvent {
    constructor(startTime, startDay, endTime, endDay, title, location, description, yesList, noList, maybeList, creatorID) {
        
        super(startTime, startDay, endTime, endDay, title);

        this.location = location;
        this.description = description;
        this.yesList = yesList;
        this.noList = noList;
        this.maybeList = maybeList;
        this.creatorID = creatorID;
    }
}

export { User, Group, BusyEvent, PlannedEvent };