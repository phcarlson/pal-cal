import { BusyEvent, PlannedEvent } from './datatypes.js';

// TODO: abstract dictionary/hashset getAll/add/remove functions

/**
 * Returns an object allowing indirect querying and modifying a given user
 * database
 * @returns A closure holding a bunch of crud fetch functions for the given user
 */

async function _getProperty(id, property, isUser){
    let idParam = isUser? "username" : "groupId";

    try {
        const response = await fetch(`/get/${property}?${idParam}=${id}`, {
            method: 'GET',
        });
        
        const data = await response.json();
        return data;
    }
    catch (err) {
        console.log(err);
    }
}

async function _setProperty(id, property, value){
    let idParam = isUser? "username" : "groupId";
    let changes = {};
    changes[property] = value;

    try {
        const response = await fetch(`/set/${property}?${idParam}=${id}`, {
            method: 'PUT',
            body: JSON.stringify(changes)
        });
    }
    catch (err) {
        console.log(err);
    }
}

function getUser(username) {
    const imageId = "userImage";

    const user = {
        /**
         * Set the user's profile picture
         * @param {Buffer} image The new image
         */
        setImage: async function(image) {
            let changes = {}
            changes['image'] = image;

            try {
                const response = await fetch(`/set/image?username=${username}`, {
                    method: 'PUT',
                    body: JSON.stringify(changes)
                });
            }
            catch (err) {
                console.log(err);
            }
        },

        /**
         * Get the user's profile picture
         * @returns A Buffer representing the image
         */
        getImage: async function() {
            try {
                const response = await fetch(`/get/image?username=${username}`, {
                    method: 'GET',
                });

                // TODO: figure out image return
                const data = await response.json();
                return data;
            }
            catch (err) {
                console.log(err);
            }
        },

        /**
         * Add a time the user is busy to their calendar
         * @param {BusyEvent} busyEvent 
         */
        addBusyEvent: async function(busyEvent) {
            // TODO: verify user doesn't have a conflicting event?
            let changes = {};
            changes["busyEvent"] = busyEvent;

            try {
                const response = await fetch(`/add/busyEvent?username=${username}`, {
                    method: 'PUT',
                    body: JSON.stringify(changes)
                });
            }
            catch (err) {
                console.log(err);
            }
        },

        /**
         * Get all of this user's recurring busy events
         * @returns An array of BusyEvent objects
         */
        getBusyEvents: async function() {
            try {
                const response = await fetch(`/get/busyEvents?username=${username}`, {
                    method: 'GET',
                });

                const data = await response.json();
                return data;
            }
            catch (err) {
                console.log(err);
            }
        },

        // TODO: delete busy event, edit busy event
        // How to identify the event to delete? Do events need IDs too?

        /**
         * Add another user to this user's friends list, by username
         * Note this is not reciprocal - adding A to B's friends does not
         * add B to A's friends, so make sure to do both
         * Also note: does not currently validate that friendUsername refers to
         * an actual user, just naively adds whatever name you give it
         * @param {string} friendUsername Username of the friend to add
         */
        addFriend: async function(friendUsername) {
            let changes = {};
            changes[friendUsername] = 1;

            try {
                const response = await fetch(`/add/friend?username=${username}`, {
                    method: 'PUT',
                    body: JSON.stringify(changes)
                });
            }
            catch (err) {
                console.log(err);
            }
        },

        /**
         * Remove a user from this user's friends list, by username
         * @param {string} friendUsername Username of the friend to remove
         */
        removeFriend: async function(friendUsername) {
            // TODO: verify users are friends
            try {
                const response = await fetch(`/delete/friend?username=${username}&friendUsername=${friendUsername}`, {
                    method: 'DELETE',
                });
            }
            catch (err) {
                console.log(err);
            }
        },

        /**
         * Check if this user has the given user in their friends list
         * @param {string} friendUsername Username of the friend to check
         * @returns True iff user friendUsername is in this user's friends
         */
        hasFriend: async function(friendUsername) {
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
        },

        /**
         * Get a list of this user's friends
         * Note - if you just want to check if this user has a specific friend,
         * hasFriend will be more efficient
         * @returns An Array of the usernames of everybody in this user's
         * friends list
         */
        getAllFriends: async function() {
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
        },

        /**
         * Record that this user has a pending friend request from the given user
         * Note: does not currently verify that the other user exists, that they
         * are not already friends, or that there is not already a request from
         * them.
         * @param {username} friendUsername 
         */
        addFriendRequestFrom: async function(friendUsername) {
            // TODO:
            //   - verify friend exists
            //   - verify not already friends
            //   - verify not already requested
            let changes = {};
            changes[friendUsername] = 1;
            
            try {
                const response = await fetch(`/add/friendRequest?username=${username}`, {
                    method: 'PUT',
                    body: JSON.stringify(changes)
                  });
            }
            catch (err) {
                console.log(err);
            }
        },

        /**
         * Remove any friend request from the given user, indicating it has
         * been accepted or rejected
         * @param {string} friendUsername Username of the friend who sent the request
         */
        removeFriendRequestFrom: async function(friendUsername) {
            try {
                const response = await fetch(`/delete/friend?username=${username}&friendusername=${friendUsername}`, {
                    method: 'DELETE',
                  });
            }
            catch (err) {
                console.log(err);
            }
        },

        /**
         * Get the usernames of everyone who has sent a pending friend request
         * to this user
         * @returns An array of usernames
         */
        getAllFriendRequests: async function() {
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
        },

        /**
         * Get the id of every group this user is a member of
         * @param {PouchDB} localGroupDb The PouchDB database storing groups.
         * Optional - defaults to the main group database, a different db can be
         * provided e.g. for testing purposes
         * @returns An Array of group IDs
         */
        getAllGroups: async function() {
            try {
                const response = await fetch(`/get/groups?username=${username}`, {
                    method: 'GET',
                });

                const data = await response.json();
                return data;
            }
            catch (err) {
                console.log(err);
            }
        },

        getFirstName: async () => await _getProperty(username, "firstName", true),
        getLastName:  async () => await _getProperty(username, "lastName", true),
        getCollege:   async () => await _getProperty(username, "college", true),
        getBio:       async () => await _getProperty(username, "bio", true),

        setFirstName: async value => await _setProperty(username, "firstName", value, true),
        setLastName:  async value => await _setProperty(username, "lastName", value, true),
        setCollege:   async value => await _setProperty(username, "college", value, true),
        setBio:       async value => await _setProperty(username, "bio", value, true),
    };
    return user;
}

/**
 * Create a new user with the given username
 * All other user fields default to empty
 * Note: username must be unique! There is not yet proper error handling, so
 * this will just crash if you provide a username that is taken.
 * In the future, this should throw a custom exception you can catch and handle
 * @param {string} username 
 * @param {PouchDB} db The database holding users. OPTIONAL - defaults to the main user
 * database, a different database can be provided for test purposes
 */
async function createUser(username) {
    let newUser = {}
    newUser["username"] = username;

    try {
        const response = await fetch(`/create/user/`, {
            method: 'PUT',
            body: JSON.stringify(newUser)
        });
    }
    catch (err) {
        console.log(err);
    }

    // try {
    //     const response = await fetch(`/create/user/username=${username}`);
    // }
    // catch (err) {
    //     console.log(err);
    // }
}

/**
 * Check if there is a user with the given username
 * @param {string} username 
 * @param {*} db The database holding users. OPTIONAL - defaults to the main user
 * database, a different database can be provided for test purposes
 * @returns True iff a user called `username` exists in the database
 */
async function userExists(username) {
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
 * @param {*} db The database holding users. OPTIONAL - defaults to the main user
 * database, a different database can be provided for test purposes
 * @returns An Array of strings representing all users' usernames
 */
async function getAllUsernames() {
    try {
        const response = await fetch(`/get/users`);

        const data = await response.json();
        return data;
    }
    catch (err) {
        console.log(err);
    }
}

/**
 * Create a new group. All group fields default to empty.
 * @returns The unique ID of the new group. Make sure to save if you want to
 * refer to the group after!
 */
async function createGroup() {
    try {
        //TODO whether we create group here or on server end
        const response = await fetch(`/create/group`, {
            method: 'PUT',
        });

        const data = await response.json();
        return data;
    }
    catch (err) {
        console.log(err);
    }
}

/**
 * Returns an object allowing querying and modifying a given group
 * @param {string} groupId The unique ID identifying the group, as returned by
 * createGroup
 * @param {PouchDB} db The database holding groups. OPTIONAL - defaults to the main group
 * database, a different database can be provided for test purposes
 * @returns A closure holding a bunch of crud functions for the given group
 */
function getGroup(groupId) {
    const imageId = "groupImage";
    const group = {
        /**
         * Set the group image
         * How this is actually typed is still tbd, image types seem a little
         * complicated
         * See https://pouchdb.com/guides/attachments.html#allow-the-user-to-store-an-attachment
         * for info on blob vs buffer vs base64 etc
         * How we actually handle this will depend on how we do image uploads
         * @param {Buffer} image The new image
         */
        setImage: async function(image) {
            let changes = {}
            changes['image'] = image;

            try {
                const response = await fetch(`/set/image?groupId=${groupId}`, {
                    method: 'PUT',
                    body: JSON.stringify(changes)
                });
            }
            catch (err) {
                console.log(err);
            }
        },

        /**
         * Get the group image
         * @returns A Buffer object representing the image
         */
        getImage: async function() {
            try {
                const response = await fetch(`/get/image?groupId=${groupId}`, {
                    method: 'GET',
                });

                const data = await response.json();
                return data;
            }
            catch (err) {
                console.log(err);
            }
        },

        /**
         * Add the given user to this group, if not already a member
         * Note: does not currently validate that the given user exists!
         * @param {string} username The unique username of the user to add
         * @param {*} localUserDb The database holding users. OPTIONAL - 
         * defaults to the main user database, a different database can be 
         * provided for test purposes
         */
        addMember: async function(username) {
            // TODO: verify user exists?
            // TODO: verify user not already in group
            try {
                const response = await fetch(`/add/member?groupId=${groupId}&username=${username}`, {
                    method: 'PUT',
                });
            }
            catch (err) {
                console.log(err);
            }
        },

        /**
         * Remove the given user from this group, if they are a member
         * @param {string} username Username of the user to remove
         */
        removeMember: async function(username) {
            // TODO: verify user is in group
            try {
                const response = await fetch(`/delete/member?groupId=${groupId}&username=${username}`, {
                    method: 'DELETE',
                });
            }
            catch (err) {
                console.log(err);
            }
        },

        /**
         * Check if the given user is in this group
         * @param {string} username 
         * @returns True iff there is a user with the given username in this group
         */
        hasMember: async function(username) {
            try {
                const response = await fetch(`/has/member?groupId=${groupId}&username=${username}`, {
                    method: 'GET',
                });
            }
            catch (err) {
                console.log(err);
            }
        },

        /**
         * Get a list of all group members
         * @returns An Array of the usernames of everybody in the group
         */
        getAllMemberIds: async function() {
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
        },

        /**
         * Add a planned event to the group calendar
         * @param {PlannedEvent} plannedEvent 
         */
        addPlannedEvent: async function(plannedEvent) {
            try {
                let changes = {};
                changes["plannedEvent"] = plannedEvent;

                const response = await fetch(`/add/plannedEvent?groupId=${groupId}`, {
                    method: 'PUT',
                    body: JSON.stringify(changes)
                });
            }
            catch (err) {
                console.log(err);
            }
        },

        /**
         * Get a list of all planned events on the group calendar
         * @returns An Array of PlannedEvent objects
         */
        getPlannedEvents: async function() {
            try {
                const response = await fetch(`/get/plannedEvents?groupId=${groupId}`, {
                    method: 'GET',
                });

                const data = await response.json();
                return data;
            }
            catch (err) {
                console.log(err);
            }
        },
        
        getGroupName: async ()    => await _getProperty(groupId, "groupName", false),
        setGroupName: async value => await _setProperty(groupId, "groupName", value, false)
    }
    return group;
}

export { getUser, getGroup, getAllUsernames, userExists, createGroup, createUser }
