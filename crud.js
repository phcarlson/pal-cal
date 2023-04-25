import PouchDB from 'pouchdb';
import { BusyEvent, PlannedEvent } from './datatypes.js';

const userDb = new PouchDB("users.pouchdb");
const groupDb = new PouchDB("groups.pouchdb");


/**
 * Wrapper around getting a property of a document in a PouchDB store
 * @param {PouchDB} db The database to access
 * @param {string} _id The id of the document
 * @param {string} property The name of the property to access
 * @returns The current value of the given property of the given document
 */
async function _getProperty(db, _id, property) {
    try {
        const data = await db.get(_id);
        return data[property];
    }
    catch (err) {
        console.log(err);
    }
}

/**
 * Wrapper around setting a property of a document in a PouchDB store
 * @param {PouchDB} db The database to access
 * @param {string} _id The id of the document
 * @param {string} property The name of the property to access
 * @param {*} value New value to set the property to
 */
async function _setProperty(db, _id, property, value) {
    try {
        const data = await db.get(_id);
        data[property] = value;
        db.put(data);
    }
    catch (err) {
        console.log(err);
    }
}

// TODO: abstract dictionary/hashset getAll/add/remove functions

/**
 * Returns an object allowing querying and modifying a given user
 * @param {string} username The unique username identifying the user
 * @param {PouchDB} db The database holding users. OPTIONAL - defaults to the main user
 * database, a different database can be provided for test purposes
 * @returns A closure holding a bunch of crud functions for the given user
 */
function getUser(username, db=userDb) {
    const imageId = "userImage";

    const user = {
        /**
         * Set the user's profile picture
         * How this is actually typed is still tbd, image types seem a little
         * complicated
         * See https://pouchdb.com/guides/attachments.html#allow-the-user-to-store-an-attachment
         * for info on blob vs buffer vs base64 etc
         * How we actually handle this will depend on how we do image uploads
         * @param {Buffer} image The new image
         */
        setImage: async function(image) {
            try {
                const data = await db.get(username);
                db.putAttachment(data._id, imageId, data._rev, image);
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
                return db.getAttachment(username, imageId);
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
            const data = await db.get(username);
            // TODO: verify user doesn't have a conflicting event?
            data.eventsList.push(busyEvent);
            await db.put(data);
        },

        /**
         * Get all of this user's recurring busy events
         * @returns An array of BusyEvent objects
         */
        getBusyEvents: async function() {
            const data = await db.get(username);
            return data.eventsList;
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
            const data = await db.get(username);
            // TODO: verify friend ID exists
            // TODO: verify not already a friend?
            data.friendsDict[friendUsername] = 1;
            await db.put(username);
        },

        /**
         * Remove a user from this user's friends list, by username
         * @param {string} friendUsername Username of the friend to remove
         */
        removeFriend: async function(friendUsername) {
            // TODO: verify users are friends
            const data = await db.get(username);
            delete data.friendsDict[friendUsername];
        },

        /**
         * Check if this user has the given user in their friends list
         * @param {string} friendUsername Username of the friend to check
         * @returns True iff user friendUsername is in this user's friends
         */
        hasFriend: async function(friendUsername) {
            const data = await db.get(username);
            return (friendUsername in data.friendsDict);
        },

        /**
         * Get a list of this user's friends
         * Note - if you just want to check if this user has a specific friend,
         * hasFriend will be more efficient
         * @returns An Array of the usernames of everybody in this user's
         * friends list
         */
        getAllFriends: async function() {
            const data = await db.get(username);
            return Object.keys(data.friendsDict);
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
            const data = await db.get(username);
            data.requestsDict[friendUsername] = 1;
            await db.put(data);
        },

        /**
         * Remove any friend request from the given user, indicating it has
         * been accepted or rejected
         * @param {string} friendUsername Username of the friend who sent the request
         */
        removeFriendRequestFrom: async function(friendUsername) {
            const data = await db.get(username);
            delete data.requestsDict[friendUsername];
            await db.put(data);
        },

        /**
         * Get the id of every group this user is a member of
         * @param {PouchDB} localGroupDb The PouchDB database storing groups.
         * Optional - defaults to the main group database, a different db can be
         * provided e.g. for testing purposes
         * @returns An Array of group IDs
         */
        getAllGroups: async function(localGroupDb=groupDb) {
            // This linear scan is a pretty inefficient way to do it!
            // Ideally I'd like to figure out PouchDB indexing but haven't gotten there yet
            const allGroups = await localGroupDb.allDocs({include_docs: true});
            return allGroups.rows.reduce((acc, row) => {
                if (username in row.doc.memberDict) {
                    acc.push(row.id);
                    return acc;
                }
            }, []);
        },

        getFirstName: async () => await _getProperty(db, username, "firstName"),
        getLastName:  async () => await _getProperty(db, username, "lastName"),
        getCollege:   async () => await _getProperty(db, username, "college"),
        getBio:       async () => await _getProperty(db, username, "bio"),

        setFirstName: async value => await _setProperty(db, username, "firstName", value),
        setLastName:  async value => await _setProperty(db, username, "lastName", value),
        setCollege:   async value => await _setProperty(db, username, "college", value),
        setBio:       async value => await _setProperty(db, username, "bio", value),
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
async function createUser(username, db=userDb) {
    try {
        const user = {
            _id: username,
            eventsList: [],
            friendsDict: {},
            firstName: "",
            lastName: "",
            college: "",
            bio: "",
            requestsDict: {}
        };
        await db.put(user);
    }
    catch (err){
        console.log(err);
    }
}

/**
 * Check if there is a user with the given username
 * @param {string} username 
 * @param {*} db The database holding users. OPTIONAL - defaults to the main user
 * database, a different database can be provided for test purposes
 * @returns True iff a user called `username` exists in the database
 */
async function userExists(username, db=userDb) {
    try {
        await db.get(username);
        return true;
    }
    catch(err) {
        return false;
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
async function getAllUsernames(db=userDb) {
    const docs = await db.allDocs();
    return docs.rows.map(row => row.id);
}

/**
 * Create a new group. All group fields default to empty.
 * @param {PouchDB} db The database holding groups. OPTIONAL - defaults to the main group
 * database, a different database can be provided for test purposes
 * @returns The unique ID of the new group. Make sure to save if you want to
 * refer to the group after!
 */
async function createGroup(db=groupDb) {
    try {
        const group = {
            groupName: "",
            memberDict: {},
            eventsList: []
        };
        const response = await db.post(group);
        return response.id;
    }
    catch(err) {
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
function getGroup(groupId, db=groupDb) {
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
            try {
                const data = await db.get(groupId);
                db.putAttachment(data._id, imageId, data._rev, image);
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
                return db.getAttachment(groupId, imageId);
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
        addMember: async function(username, localUserDb=userDb) {
            // TODO: verify user exists?
            // TODO: verify user not already in group
            const group = await db.get(groupId);
            group.memberDict[username] = 1;
            await db.put(group);
        },

        /**
         * Remove the given user from this group, if they are a member
         * @param {string} username Username of the user to remove
         */
        removeMember: async function(username) {
            // TODO: verify user is in group
            const group = await db.get(groupId);
            delete group.memberDict[username];
            await db.put(group);
        },

        /**
         * Check if the given user is in this group
         * @param {string} username 
         * @returns True iff there is a user with the given username in this group
         */
        hasMember: async function(username) {
            const group = await db.get(groupId);
            return (username in group.memberDict);
        },

        /**
         * Get a list of all group members
         * @returns An Array of the usernames of everybody in the group
         */
        getAllMemberIds: async function() {
            const group = await db.get(groupId);
            return Object.keys(group.memberDict);
        },

        /**
         * Add a planned event to the group calendar
         * @param {PlannedEvent} plannedEvent 
         */
        addPlannedEvent: async function(plannedEvent) {
            const data = await db.get(groupId);
            // TODO: verify user doesn't have a conflicting event?
            data.eventsList.push(plannedEvent);
            await db.put(data);
        },

        /**
         * Get a list of all planned events on the group calendar
         * @returns An Array of PlannedEvent objects
         */
        getPlannedEvents: async function() {
            const data = await db.get(groupId);
            return data.eventsList;
        },
        
        getGroupName: async ()    => await _getProperty(db, groupId, "groupName"),
        setGroupName: async value => await _setProperty(db, groupId, "groupName", value)
    }
    return group;
}

export { getUser, getGroup, getAllUsernames, userExists, createGroup, createUser }

// Just a little test
// TODO: make a real unit test suite
await createUser("user1");
const user1 = getUser("user1");
await user1.setFirstName("Foo");
console.log(await user1.getFirstName());
// Checking if getAllGroups works
const group1id = await createGroup();
const group2id = await createGroup();
const group1 = getGroup(group1id);
const group2 = getGroup(group2id);
console.log(`Group 1 id: ${group1id}`)
console.log(`Group 2 id: ${group2id}`)
await group1.addMember("user1");
await group2.addMember("user1");
console.log(await user1.getAllGroups());