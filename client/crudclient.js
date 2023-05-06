import { BusyEvent, PlannedEvent } from './datatypes.js';

// USER RELATED CLIENT CRUD CALLS:

/**
 * Creates a user with the given properties
 * @param {Object} user MUST have a field called username.
 * Can have zero or more of these fields: firstName, lastName, college, bio, image
 * Missing fields will be given sane default values
 */
export async function createUser(user) {
    //TODO: check if user already exists and handle if so
    try {
        const response = await fetch(`/create/user`, {
            headers: {
                'Accept': 'application/json,text/html', 
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(user)
        });

        await handleResponseStatus(response);
    }
    catch (err) {
        throw Error(`Unexpected error: ${err}`);
    }
}

/**
 * Get info about a user
 * @param {string} username The unique username of the user to get
 * @returns A User object
 */
export async function getUser(username) {
    try {
        const response = await fetch(`/get/user?username=${username}`, {
            method: 'GET',
        });

        await handleResponseStatus(response);

        const data = await response.json();
        return data;
    }
    catch (err) {
        throw Error(`Unexpected error: ${err}`);
    }
}

/**
 * Update a user
 * @param {string} username The unique username of the user to update
 * @param {Object} userPatch An object containing the values to change
 * Has one or more of these fields: username, firstName, lastName, college, bio, image
 * Missing fields will be unchanged
 */
export async function updateUser(username, userPatch) {
    try {
        const response = await fetch(`/update/user?username=${username}`, {
            headers: {
                'Accept': 'application/json,text/html', 
                'Content-Type': 'application/json',
            },
            method: 'PATCH',
            body: JSON.stringify(userPatch)
        });

        await handleResponseStatus(response);
    }
    catch (err) {
        throw Error(`Unexpected error: ${err}`);
    }
}

/**
 * Delete a user from the database
 * @param {string} username Unique username of user to delete
 */
export async function deleteUser(username) {
    try {
        const response = await fetch(`/delete/user?username=${username}`, {
            method: 'DELETE',
        });

        await handleResponseStatus(response);
    }
    catch (err) {
        throw Error(`Unexpected error: ${err}`);
    }
}

/**
 * Batch retrieve info about multiple users specified
 * @param {Array[string]} usernames A list of usernames
 * @returns A list of User objects
 */
export async function getUsers(usernames) {
    try {
        const response = await fetch(`/get/users`, {
            headers: {
                'Accept': 'application/json,text/html', 
                'Content-Type': 'application/json',
            },
            method: 'GET',
            body: JSON.stringify(usernames)
        });
        
        const data = await response.json();
        await handleResponseStatus(response);        
        
        return data;
    }
    catch (err) {
        throw Error(`Unexpected error: ${err}`);
    }
}

/**
 * Check if the given user exists in the database
 * @param {string} username 
 * @returns true or false
 */
export async function userExists(username) {
    try {
        const response = await fetch(`/has/user?username=${username}`, {
            method: 'GET',
        });

        await handleResponseStatus(response);

        const data = await response.json();
        return data.exists;
    }
    catch (err) {
        throw Error(`Unexpected error: ${err}`);
    }
}

/**
 * Get the IDs of all groups the user is in
 * @param {string} username 
 * @returns An array of string group IDs
 */
export async function getGroupIdsOfUser(username) {
    try {
        const response = await fetch(`/get/groupIds?username=${username}`, {
            method: 'GET',
        });

        await handleResponseStatus(response);

        const data = await response.json();
        return data.groupIds;
    }
    catch (err) {
        throw Error(`Unexpected error: ${err}`);
    }
}

/**
 * Get the usernames of every user in the system
 * @returns An array of String usernames
 */
export async function getAllUsernames() {
    try {
        const response = await fetch(`/get/usernames`, {
            method: 'GET',
        });

        await handleResponseStatus(response);

        const data = await response.json();
        return data.usernames;
    }
    catch (err) {
        throw Error(`Unexpected error: ${err}`);
    }
}

// USER BUSY EVENT CLIENT CRUD CALLS FOR PROFILE CALENDAR: 

/**
 * Create a new busy event with the given properties
 * @param {string}  username Unique username for user's calendar to add busy event to
 * @param {Object} busyEvent May have zero or more of these fields:
 * title, startDay, startHour, startMinute, endDay, endHour, endMinute
 * Missing fields will be given sane default values
 * @returns A unique string ID for the new event
 */
export async function createBusyEvent(username, busyEvent) {
    // TODO: verify user doesn't have a conflicting event?
    try {
        const response = await fetch(`/create/busyEvent`, {
            headers: {
                'Accept': 'application/json,text/html', 
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(busyEvent)
        });

        await handleResponseStatus(response);

        const data = await response.json();
        return data.eventId;
    }
    catch (err) {
        throw Error(`Unexpected error: ${err}`);
    }
}

/**
 * Get info about a busy event
 * @param {string} busyEventId
 * @returns a busyEvent object
 */
export async function getBusyEvent(busyEventId) {
    try {
        const response = await fetch(`/get/busyEvent?busyEventId=${busyEventId}`, {
            method: 'GET',
        });

        await handleResponseStatus(response);

        const data = await response.json();
        return data.busyEvent;
    }
    catch (err) {
        throw Error(`Unexpected error: ${err}`);
    }
}


/**
 * Batch retrieve info about multiple busy events
 * @param {Array[string]} busyEventIds A list of busy event IDs
 * @returns a list of busyEvent objects
 */
export async function getBusyEvents(busyEventIds) {
    try {
        const response = await fetch(`/get/busyEvents`, {
            headers: {
                'Accept': 'application/json,text/html', 
                'Content-Type': 'application/json',
            },
            method: 'GET',
            body: JSON.stringify(busyEventIds)
        });

        await handleResponseStatus(response);

        const data = await response.json();
        return data.busyEvents;
    }
    catch (err) {
        throw Error(`Unexpected error: ${err}`);
    }
}

/**
 * Retrieve ids of busy events from a specified user
 * @param {string} username 
 * @returns a list of busyEvent ids
 */
export async function getBusyEventIdsOfUser(username) {
    try {
        const response = await fetch(`/get/busyEventIds?username=${username}`, {
            method: 'GET',
        });

        await handleResponseStatus(response);

        const data = await response.json();
        return data.busyEventIds;
    }
    catch (err) {
        throw Error(`Unexpected error: ${err}`);
    }
}

/**
 * Update a busy event
 * @param {string} busyEventId 
 * @param {Object} busyEventPatch An object containing the values to change
 * Has one or more of these fields: title, startDay, startHour, startMinute,
 * endDay, endHour, endMinute
 * Missing fields will be unchanged
 */
export async function updateBusyEvent(busyEventId, busyEventPatch) {
    try {
        const response = await fetch(`/update/busyEvent?busyEventId=${busyEventId}`, {
            headers: {
                'Accept': 'application/json,text/html', 
                'Content-Type': 'application/json',
            },
            method: 'PATCH',
            body: JSON.stringify(busyEventPatch)
        });

        await handleResponseStatus(response);
    }
    catch (err) {
        throw Error(`Unexpected error: ${err}`);
    }
}

/**
 * Delete a busy event
 * @param {string} busyEventId 
 */
export async function deleteBusyEvent(busyEventId) {
    try {
        const response = await fetch(`/delete/busyEvent?busyEventId=${busyEventId}`, {
            method: 'DELETE',
        });
        
        await handleResponseStatus(response);
    }
    catch (err) {
        throw Error(`Unexpected error: ${err}`);
    }
}


// USER FRIEND RELATED CLIENT CRUD CALLS:

/**
 * Make these two users friends
 * @param {string} username1 
 * @param {string} username2 
 */
export async function addFriend(username1, username2) {
    try {
        const response = await fetch(`/add/friend?username1=${username1}&username2=${username2}`, {
            method: 'POST',
        });

        await handleResponseStatus(response);
    }
    catch (err) {
        throw Error(`Unexpected error: ${err}`);
    }
}

/**
 * Get the all friends of this user
 * @param {string} username 
 * @returns an array of string usernames
 */
export async function getFriends(username) {
    try {
        const response = await fetch(`/get/friends?username=${username}`, {
            method: 'GET',
        });

        await handleResponseStatus(response);

        const data = await response.json();
        return data.usernames;
    }
    catch (err) {
        throw Error(`Unexpected error: ${err}`);
    }
}

/**
 * Check if these users are friends
 * @param {string} username1 
 * @param {string} username2 
 * @returns boolean true or false
 */
export async function areFriends(username1, username2) {
    try {
        const response = await fetch(`/has/friend?username1=${username1}&username2=${username2}`, {
            method: 'GET',
        });

        await handleResponseStatus(response);

        const data = await response.json();
        return data.hasFriend;
    }
    catch (err) {
        throw Error(`Unexpected error: ${err}`);
    }
}

/**
 * Make these two users no longer friends
 * @param {string} username1 
 * @param {string} username2 
 */
export async function deleteFriend(username1, username2) {
     // TODO: verify users are friends
     try {
        const response = await fetch(`/delete/friend?username1=${username1}&username2=${username2}`, {
            method: 'DELETE',
        });

        await handleResponseStatus(response);
    }
    catch (err) {
        throw Error(`Unexpected error: ${err}`);
    }
}


// USER FRIEND REQUEST RELATED CLIENT CRUD CALLS:

/**
 * Add a friend request from one user to another
 * @param {string} fromUsername 
 * @param {string} toUsername 
 */
export async function addFriendRequest(fromUsername, toUsername) {
 // TODO:
    //   - verify friend exists
    //   - verify not already friends
    //   - verify not already requested possibly in client file not here
    try {
        const response = await fetch(`/add/friendRequest?fromUsername=${fromUsername}&toUsername=${toUsername}`, {
            method: 'POST',
        });

        await handleResponseStatus(response);
    }
    catch (err) {
        throw Error(`Unexpected error: ${err}`);
    }
}

/**
 * Remove a friend request from one user to another
 * @param {string} fromUsername 
 * @param {string} toUsername 
 */
export async function removeFriendRequest(fromUsername, toUsername) {
    try {
        const response = await fetch(`/delete/friendRequest?fromUsername=${fromUsername}&toUsername=${toUsername}`, {
            method: 'DELETE',
        });

        await handleResponseStatus(response);
    }
    catch (err) {
        throw Error(`Unexpected error: ${err}`);
    }
}


/**
 * Get everyone who's sent a friend request to this user
 * @param {string} username 
 * @returns an array of string usernames
 */
export async function getRequestsTo(username) {
    try {
        const response = await fetch(`/get/friendRequests/to?username=${username}`, {
            method: 'GET',
        });

        await handleResponseStatus(response);

        const data = await response.json();
        return data.friendRequestsTo;
    }
    catch (err) {
        throw Error(`Unexpected error: ${err}`);
    }
}

/**
 * Get everyone to whom this user has sent a friend request
 * @param {string} username 
 * @returns an array of string usernames
 */
export async function getRequestsFrom(username) {
    try {
        const response = await fetch(`/get/friendRequests/from?username=${username}`, {
            method: 'GET',
        });
        await handleResponseStatus(response);

        const data = await response.json();
        return data.friendRequestsFrom;
    }
    catch (err) {
        throw Error(`Unexpected error: ${err}`);
    }
}

// GROUP INFO/PROPERTIES RELATED CLIENT CRUD CALLS:

/**
 * Create a group with the given properties
 * @param {Object} group Can have zero or more of these fields: name, image.
 * Missing fields will be given sane default values
 * @returns A unique string ID for the new group. Make sure to save if you want to
 * refer to the group after!
 */
export async function createGroup(group) {
    try {
        const response = await fetch(`/create/group`, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
            method: 'POST',
            body: JSON.stringify(group)
        });

        await handleResponseStatus(response);
        
        const data = await response.json();
        return data.groupId;
    }
    catch (err) {
        throw Error(`Unexpected error: ${err}`);
    }
}

/**
 * Get info about a group
 * @param {string} groupId 
 * @returns a Group object
 */
export async function getGroup(groupId) {
    try {
        const response = await fetch(`/get/group?groupId=${groupId}`, {
            method: 'GET',
        });

        await handleResponseStatus(response);

        const data = await response.json();
        return data;
    }
    catch (err) {
        throw Error(`Unexpected error: ${err}`);
    }
}

/**
 * Update a group
 * @param {string} groupId 
 * @param {Object} groupPatch An object containing the values to change
 * Has one or more of these fields: name, image
 * Missing fields will be unchanged
 */
export async function updateGroup(groupId, groupPatch) {
    try {
        const response = await fetch(`/update/group?groupId=${groupId}`, {
            headers: {
                'Accept': 'application/json,text/html', 
                'Content-Type': 'application/json',
              },
            method: 'PATCH',
            body: JSON.stringify(groupPatch)
        });

        await handleResponseStatus(response);
    }
    catch (err) {
        throw Error(`Unexpected error: ${err}`);
    }
}

/**
 * Delete a group
 * @param {string} groupId 
 */
export async function deleteGroup(groupId) {
    try {
        const response = await fetch(`/delete/group?groupId=${groupId}`, {
            method: 'DELETE',
        });

        await handleResponseStatus(response);
    }
    catch (err) {
        throw Error(`Unexpected error: ${err}`);
    }
}

/**
 * Batch retrieve info about multiple groups
 * @param {Array[string]} groupIds A list of string group IDs
 * @returns an array of Group objects
 */
export async function getGroups(groupIds) {
    try {
        const response = await fetch(`/get/groups`, {
            headers: {
                'Accept': 'application/json,text/html', 
                'Content-Type': 'application/json',
            },
            method: 'GET',
            body: JSON.stringify(groupIds)
        });

        await handleResponseStatus(response);

        const data = await response.json();
        return data.groups;
    }
    catch (err) {
        throw Error(`Unexpected error: ${err}`);
    }
}


// GROUP MEMBER RELATED CLIENT CRUD CALLS:

/**
 * Add the given user to this group, if not already a member
 * Note: does not currently validate that the given user exists!
 * @param {string} groupId Group id to add member to
 * @param {string} username Username of the user to add
 */
export async function addMember(groupId, username) {
    // TODO: verify user exists?
    // TODO: verify user not already in group
    try {
        const response = await fetch(`/add/member?groupId=${groupId}&username=${username}`, {
            method: 'POST',
        });

        await handleResponseStatus(response);
    }
    catch (err) {
        throw Error(`Unexpected error: ${err}`);
    }
}

/**
 * Check if the given user is in this group
 * @param {string} groupId Group id to check if user is member of
 * @param {string} username Username of user to check
 * @returns True iff there is a user with the given username in this group
 */
export async function hasMember(groupId, username) {
    try {
        const response = await fetch(`/has/member?groupId=${groupId}&username=${username}`, {
            method: 'GET',
        });

        await handleResponseStatus(response);

        const data = await response.json();
        return data.exists;
    }
    catch (err) {
        throw Error(`Unexpected error: ${err}`);
    }
}

/**
 * Get the username of every member of this group
 * @param {string} groupId 
 * @returns an array of usernames
 */
export async function getGroupMemberUsernames(groupId) {
    try {
        const response = await fetch(`/get/memberIds?groupId=${groupId}`, {
            method: 'GET',
        });

        await handleResponseStatus(response);

        const data = await response.json();
        return data.memberIds;
    }
    catch (err) {
        throw Error(`Unexpected error: ${err}`);
    }
}

/**
 * Remove the given user from this group, if they are a member
 * @param {string} groupId Group id to delete member from
 * @param {string} username Username of the user to remove
 */
export async function removeMember(groupId, username) {
    // TODO: verify user is in group
    try {
        const response = await fetch(`/delete/member?groupId=${groupId}&username=${username}`, {
            method: 'DELETE',
        });

        await handleResponseStatus(response);
    }
    catch (err) {
        throw Error(`Unexpected error: ${err}`);
    }
}


// GROUP PLANNED EVENT RELATED CLIENT CRUD CALLS:

/**
 * Create a new planned event
 * @param {Object} plannedEvent MUST have a field called creatorUsername
 * Can have zero or more of these fields: title, startDay, startHour, startMinute,
 * endDay, endHour, endMinute, location, description
 * Missing fields will be given sane default values
 * @returns A unique string ID for the new event
 */
export async function createPlannedEvent(groupId, plannedEvent) {
    try {
        const response = await fetch(`/create/plannedEvent`, {
            headers: {
                'Accept': 'application/json,text/html', 
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(plannedEvent)
        });

        await handleResponseStatus(response);

        const data = await response.json();
        return data.eventId;
    }
    catch (err) {
        throw Error(`Unexpected error: ${err}`);
    }
}

/**
 * Get info about a planned event
 * @param {string} plannedEventId 
 * @returns a plannedEvent object
 */
export async function getPlannedEvent(plannedEventId) {
    try {
        const response = await fetch(`/get/plannedEvent?plannedEventId=${plannedEventId}`, {
            method: 'GET',
        });

        await handleResponseStatus(response);

        const data = await response.json();
        return data.plannedEvent;
    }
    catch (err) {
        throw Error(`Unexpected error: ${err}`);
    }
}

/**
 * Batch retrieve info about multiple planned events
 * @param {Array[string]} plannedEventIds 
 * @returns a list of plannedEvent objects
 */
export async function getPlannedEvents(plannedEventIds) {
    try {
        const response = await fetch(`/get/plannedEvents`, {
            headers: {
                'Accept': 'application/json,text/html', 
                'Content-Type': 'application/json',
            },
            method: 'GET',
            body: JSON.stringify(plannedEventIds)
        });

        await handleResponseStatus(response);

        const data = await response.json();
        return data.PlannedEvents
    }
    catch (err) {
        throw Error(`Unexpected error: ${err}`);
    }
}

/**
 * Get all event ids of events planned by this group
 * @param {string} groupId 
 * @returns an array of planned event IDs
 */
export async function getGroupPlannedEventIds(groupId) {
    try {
        const response = await fetch(`/get/plannedEventIds?groupId=${groupId}`, {
            method: 'GET',
        });

        await handleResponseStatus(response);

        const data = await response.json();
        return data.plannedEventIds;
    }
    catch (err) {
        throw Error(`Unexpected error: ${err}`);
    }
}

/**
 * Update a planned event
 * @param {string} plannedEventId 
 * @param {Object} plannedEventPatch An object containing the values to change
 * Has one or more of these fields: title, startDay, startHour, startMinute,
 * endDay, endHour, endMinute, location, description
 * Missing fields will be unchanged
 */
export async function updatePlannedEvent(plannedEventId, plannedEventPatch) {
    try {
        const response = await fetch(`/update/plannedEvent?plannedEventId=${plannedEventId}`, {
            headers: {
                'Accept': 'application/json,text/html', 
                'Content-Type': 'application/json',
            },
            method: 'PATCH',
            body: JSON.stringify(plannedEventPatch)
        });

        await handleResponseStatus(response);
    }
    catch (err) {
        throw Error(`Unexpected error: ${err}`);
    }
}

/**
 * Delete a planned event
 * @param {string} plannedEventId 
 */
export async function deletePlannedEvent(plannedEventId) {
    try {
        const response = await fetch(`/delete/plannedEvent?plannedEventId=${plannedEventId}`, {
            method: 'DELETE',
        });

        await handleResponseStatus(response);
    }
    catch (err) {
        throw Error(`Unexpected error: ${err}`);
    }
}


// PLANNED EVENT RSVP RELATED CRUD CALLS:

/**
 * Record a user RSVPing to a planned event
 * @param {string} plannedEventId 
 * @param {string} username 
 * @param {string} rsvp one of "YES", "NO", "MAYBE"
 */
export async function addRSVP(plannedEventId, username, rsvp) {
    try {
        const response = await fetch(`/add/plannedEventRSVP?plannedEventId=${plannedEventId}&username=${username}&rsvp=${rsvp}`, {
            method: 'POST',
        });

        await handleResponseStatus(response);
    }
    catch (err) {
        throw Error(`Unexpected error: ${err}`);
    }
}

/**
 * Remove a user's RSVP to a planned event
 * @param {string} plannedEventId 
 * @param {string} username 
 */
export async function deleteRSVP(plannedEventId, username) {
    try {
        const response = await fetch(`/delete/plannedEventRSVP?plannedEventId=${plannedEventId}&username=${username}`, {
            method: 'DELETE',
        });

        await handleResponseStatus(response);
    }
    catch (err) {
        throw Error(`Unexpected error: ${err}`);
    }
}

/**
 * Get the username of everyone who RSVPed 'yes' to this event
 * @param {string} plannedEventId 
 */
export async function getYesRSVPsTo(plannedEventId) {
    try {
        const response = await fetch(`/get/plannedEventRSVPs/yes?plannedEventId=${plannedEventId}`, {
            method: 'GET',
        });

        await handleResponseStatus(response);

        const data = await response.json();
        return data.yesList;
    }
    catch (err) {
        throw Error(`Unexpected error: ${err}`);
    }
}

/**
 * Get the username of everyone who RSVPed 'no' to this event
 * @param {string} plannedEventId 
 */
export async function getNoRSVPsTo(plannedEventId) {
    try {
        const response = await fetch(`/get/plannedEventRSVPs/no?plannedEventId=${plannedEventId}`, {
            method: 'GET',
        });

        await handleResponseStatus(response);

        const data = await response.json();
        return data.noList;
    }
    catch (err) {
        throw Error(`Unexpected error: ${err}`);
    }
}

/**
 * Get the username of everyone who RSVPed 'maybe' to this event
 * @param {string} plannedEventId 
 */
export async function getMaybeRSVPsTo(plannedEventId) {
    try {
        const response = await fetch(`/get/plannedEventRSVPs/maybe?plannedEventId=${plannedEventId}`, {
            method: 'GET',
        });

        await handleResponseStatus(response);

        const data = await response.json();
        return data.maybeList;
    }
    catch (err) {
        throw Error(`Unexpected error: ${err}`);
    }
}

async function handleResponseStatus(response){
    if(response.status !== 200){
        let body = await response.text();
        throw Error(`${response.statusText} ${body}`);
    }

    // switch (response.status) {
    //     case "400":
    //         throw Error(`Error: ${response.statusMessage} ${response.body}`);
    //         break;
    //     case "500":
    //         throw Error(`Error: ${response.statusMessage} ${response.body}`);
    //         break;
    //     case "404":
    //         throw Error(`Error: ${response.statusMessage} ${response.body}`);
    //         break;
    //     default:
    //         throw Error(`Error: ${response.statusMessage} ${response.body}`);
    //         break;
    // }
}