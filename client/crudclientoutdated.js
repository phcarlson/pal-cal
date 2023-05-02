import { BusyEvent, PlannedEvent } from './datatypes.js';

// USER RELATED CLIENT CRUD CALLS:

/**
 * Creates a user with the given properties
 * @param {Object} user must have a field called username.
 * Can have zero or more of these fields: firstName, lastName, college, bio, image
 * Missing fields will be given sane default values
 */
export async function createUser(user) {

    //TODO: check if user already exists and handle if so
    try {
        const response = await fetch(`/create/user`, {
            method: 'POST',
            body: JSON.stringify(user)
        });
    }
    catch (err) {
        console.log(err);
    }
}

/**
 * Fetches user object of this id from the server
 * @param {string} username Unique username of user object to get
 * @returns A User object
 */
export async function getUser(username){
    try {
        const response = await fetch(`/get/user?username=${username}`, {
            method: 'GET',
        });
    }
    catch (err) {
        console.log(err);
    }
}

/**
 * Update a user
 * @param {string} username The unique username of the user to update
 * @param {Object} userPatch An object containing just the properties to change
 * Has one or more of these fields: username, firstName, lastName, college, bio, image
 * Missing fields will be unchanged
 */
export async function updateUser(username, userPatch){
    try {
        const response = await fetch(`/patch/user?username=${username}`, {
            method: 'PATCH',
            body: JSON.stringify(userPatch)
        });
    }
    catch (err) {
        console.log(err);
    }
}

/**
 * Delete user object of this id
 * @param {string} username username id to delete
 */
export async function deleteUser(username){
    try {
        const response = await fetch(`/delete/user?username=${username}`, {
            method: 'DELETE',
        });
    }
    catch (err) {
        console.log(err);
    }
}

/**
 * Check if there is a user with the given username
 * @param {string} username 
 * @returns True iff a user called `username` exists in the database
 */
export async function userExists(username) {
    try {
        const response = await fetch(`/has/user/username=${username}`);

        const data = await response.json();
        return data;
    }
    catch (err) {
        console.log(err);
    }
}

/**
 * Get the username of every user in the system
 * Note: if you just want to use this list to check if a user exists, use
 * userExists instead, it's more efficient
 * @returns An Array of strings representing all users' usernames
 */
export async function getAllUsernames() {
    try {
        const response = await fetch(`/get/users`);

        const data = await response.json();
        return data;
    }
    catch (err) {
        console.log(err);
    }
}


// USER BUSY EVENT CLIENT CRUD CALLS FOR PROFILE CALENDAR 

/**
 * Add a time range the user is busy to their calendar
 * @param {string}  username user id to add to
 * @param {BusyEvent} busyEvent event to add
 */
export async function addBusyEvent(username, busyEvent){
    // TODO: verify user doesn't have a conflicting event?
    try {
        const response = await fetch(`/add/busyEvent?username=${username}`, {
            method: 'PUT',
            body: JSON.stringify(busyEvent)
        });
    }
    catch (err) {
        console.log(err);
    }
}

/**
 * Batch retrieve info about the list of busy event ids specified from a specified user
 * @param {string} username 
 * @param {Array[string]} busyEventIds 
 * @returns a list of busyEvent objects
 */
export async function getBusyEvents(username, busyEventIds) {
    try {
        const response = await fetch(`/get/busyEvents?username=${username}`, {
            method: 'GET',
            body: JSON.stringify(busyEventIds)
        });

        const data = await response.json();
        return data;
    }
    catch (err) {
        console.log(err);
    }
}

/**
 * Add a time range the user is busy to their calendar
 * @param {string}  username user id to add to
 * @param {object} busyEventPatches busyEvent properties to patch
 */
export async function updateBusyEvent(username, busyEventPatches){
    // TODO: verify user doesn't have a conflicting event

    try {
        const response = await fetch(`/add/busyEvent?username=${username}`, {
            method: 'PATCH',
            body: JSON.stringify(busyEventPatches)
        });
    }
    catch (err) {
        console.log(err);
    }
}

/**
 * Remove a time range the user is busy to their calendar
 * @param {string}  username Username to delete from
 * @param {string} busyEventId Event id to delete
 */
export async function deleteBusyEvent(username, busyEventId){

    try {
        const response = await fetch(`/delete/busyEvent?username=${username}busyEventId=${busyEventId}`, {
            method: 'DELETE',
        });
    }
    catch (err) {
        console.log(err);
    }
}


// USER FRIEND RELATED CLIENT CRUD CALLS:

/**
 * Add another user to this user's friends list, by username
 * Note this is not reciprocal - adding A to B's friends does not
 * add B to A's friends, so make sure to do both
 * Also note: does not currently validate that friendUsername refers to
 * an actual user, just naively adds whatever name you give it
 * @param {string} username Username of the user to add a friend to
 * @param {string} friendUsername Username of the friend to add
 */
export async function addFriend(username, friendUsername) {
    try {
        const response = await fetch(`/add/friend?username=${username}`, {
            method: 'POST',
        });
    }
    catch (err) {
        console.log(err);
    }
}

/**
 * Check if this user has the given user in their friends list
 * @param {string} username Username of the user to check for the friend
 * @param {string} friendUsername Username of the friend to check
 * @returns True iff user friendUsername is in this user's friends
 */
export async function hasFriend(username, friendUsername) {
    try {
        const response = await fetch(`/has/friend?username=${username}&friendUsername=${friendUsername}`, {
            method: 'GET',
        });

        const data = await response.json();
        return data;
    }
    catch (err) {
        console.log(err);
    }
}

/**
 * Delete another user from this user's friends list, by username
 * Note this is not reciprocal - deleting A from B's friends does not
 * delete B from A's friends, so make sure to do both
 * Also note: does not currently validate that friendUsername refers to
 * an actual user, just naively adds whatever name you give it
 * @param {string} username Username of the user to delete a friend from
 * @param {string} friendUsername Username of the friend to delete
 */
export async function deleteFriend(username, friendUsername) {
    // TODO: verify users are friends
    try {
        const response = await fetch(`/delete/friend?username=${username}&friendUsername=${friendUsername}`, {
            method: 'DELETE',
        });
    }
    catch (err) {
        console.log(err);
    }
}

/**
 * Get a list of this user's friends
 * Note - if you just want to check if this user has a specific friend,
 * hasFriend will be more efficient
 * @param {string} username Username of the user
 * @returns An Array of the usernames of everybody in this user's friends list
 */
export async function getAllFriends(username) {
    try {
        const response = await fetch(`/get/friends?username=${username}`, {
            method: 'GET',
        });

        const data = await response.json();
        return data;
    }
    catch (err) {
        console.log(err);
    }
}

// USER FRIEND REQUEST RELATED CLIENT CRUD CALLS:

/**
 * Record that this user has a pending friend request from the given user
 * Note: does not currently verify that the other user exists, that they
 * are not already friends, or that there is not already a request from
 * them.
 * @param {string} username Username to add friend request to
 * @param {string} friendUsername Username of user who sent the friend request
 */
export async function addFriendRequest(username, friendUsername) {
    // TODO:
    //   - verify friend exists
    //   - verify not already friends
    //   - verify not already requested 
    try {
        const response = await fetch(`/add/friendRequest?username=${username}friendUsername=${friendUsername}`, {
            method: 'POST',
        });
    }
    catch (err) {
        console.log(err);
    }
}

/**
 * Delete any friend request from the given user, indicating it has
 * been accepted or rejected
 * @param {string} username Username to delete friend request from
 * @param {string} friendUsername Username of the user who previously sent the friend request
 */
export async function deleteFriendRequest (username, friendUsername) {
    try {
        const response = await fetch(`/delete/friend?username=${username}&friendusername=${friendUsername}`, {
            method: 'DELETE',
        });
    }
    catch (err) {
        console.log(err);
    }
}

/**
 * Get the usernames of everyone who has sent a pending friend request
 * to this user
 * @param {string} username Username to get all friend requests from
 * @returns An array of usernames
 */
export async function getAllFriendRequests (username) {
    try {
        const response = await fetch(`/get/friendRequests?username=${username}`, {
            method: 'GET',
        });

        const data = await response.json();
        return data;
    }
    catch (err) {
        console.log(err);
    }
}

// GROUP INFO/PROPERTIES RELATED CLIENT CRUD CALLS:

/**
 * Create a new group. All group fields default to empty.
 * @returns The unique ID of the new group. Make sure to save if you want to
 * refer to the group after!
 */
export async function createGroup() {
    try {
        const response = await fetch(`/create/group`, {
            method: 'POST',
        });

        const data = await response.json();
        return data;
    }
    catch (err) {
        console.log(err);
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

        const data = await response.json();
        return data;
    }
    catch (err) {
        console.log(err);
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
        const response = await fetch(`/patch/group?groupId=${groupId}`, {
            method: 'PATCH',
            body: JSON.stringify(groupPatch)
        });
    }
    catch (err) {
        console.log(err);
    }
}

/**
 * Delete specified group id
 * @param {string} groupId 
 */
export async function deleteGroup(groupId) {
    try {
        const response = await fetch(`/delete/group?groupId=${groupId}`, {
            method: 'DELETE',
        });
    }
    catch (err) {
        console.log(err);
    }
}


/**
 * Batch retrieve group objects for every group id specified
 * @param {string[]} groupIds Array of group ids to retrieve objects for
 * @returns An Array of Group objects
 */
export async function getGroups(groupIds) {
    try {
        const response = await fetch(`/get/groups`, {
            method: 'GET',
            body: JSON.stringify(groupIds)
        });

        const data = await response.json();
        return data;
    }
    catch (err) {
        console.log(err);
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
    }
    catch (err) {
        console.log(err);
    }
}

/**
 * Delete the given user from this group, if they are a member
 * @param {string} groupId Group id to delete member from
 * @param {string} username Username of the user to remove
 */
export async function deleteMember(groupId, username) {
    // TODO: verify user is in group
    try {
        const response = await fetch(`/delete/member?groupId=${groupId}&username=${username}`, {
            method: 'DELETE',
        });
    }
    catch (err) {
        console.log(err);
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

        const data = await response.json();
        return data;
    }
    catch (err) {
        console.log(err);
    }
}

/**
 * Get a list of all group members of a specified group id
 * @param {string} groupId Group id to get members from
 * @returns An Array of the usernames of everybody in the group
 */
export async function getGroupMembers(groupId) {
    try {
        const response = await fetch(`/get/members?groupId=${groupId}`, {
            method: 'GET',
        });

        const data = await response.json();
        return data;
    }
    catch (err) {
        console.log(err);
    }
}


// GROUP PLANNED EVENT RELATED CLIENT CRUD CALLS:

/**
 * Add a planned event to the group calendar
 * @param {string} groupId Group id to add plannedEvent to
 * @param {PlannedEvent} plannedEvent 
 */
export async function addPlannedEvent(groupId, plannedEvent) {
    try {
        const response = await fetch(`/add/plannedEvent?groupId=${groupId}`, {
            method: 'POST',
            body: JSON.stringify(plannedEvent)
        });
    }
    catch (err) {
        console.log(err);
    }
}

/**
 * Batch retrieve info about the list of planned event ids specified
 * @param {string} groupId 
 * @param {Array[string]} plannedEventIds 
 * @returns a list of plannedEvent objects
 */
export async function getPlannedEvents(groupId, plannedEventIds) {
    try {
        const response = await fetch(`/get/plannedEvents?groupId=${groupId}`, {
            method: 'GET',
            body: JSON.stringify(plannedEventIds)
        });

        const data = await response.json();
        return data;
    }
    catch (err) {
        console.log(err);
    }
}