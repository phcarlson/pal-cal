import PouchDB from 'pouchdb';

const userDb = new PouchDB("users");
const groupDb = new PouchDB("groups");


function _makeGetter(db, key, property) {
    return async function() {
        try {
            const data = await db.get(key);
            return data[property];
        }
        catch (err) {
            console.log(err);
        }
    }
}

function _makeSetter(db, key, property) {
    return async function(value) {
        try {
            const data = await db.get(key);
            data[property] = value;
            db.put(data);
        }
        catch (err) {
            console.log(err);
        }
    }
}

// TODO: abstract dictionary/hashset getAll/add/remove functions

/**
 * Adds PouchDB getter and setter methods to an object
 * For property "foo", creates functions obj.getFoo() and obj.setFoo(value),
 * which are wrappers around getting/setting the given properties
 * on a document in a PouchDB database
 * This is an internal function used to speed up creating crud methods
 * @param {Object} obj The object to modify
 * @param {PouchDB} db The PouchDb database to interface with
 * @param {string} key The _id of the document in the database
 * @param {string} property The name of the property to add getter/setters
 */
function _addProperty(obj, db, key, property) {
    const propertyCaps = property[0].toUpperCase() + property.slice(1);
    obj[`get${propertyCaps}`] = _makeGetter(db, key, property);
    obj[`set${propertyCaps}`] = _makeSetter(db, key, property);
}

function getUser(username, db=userDb) {
    const imageId = "userImage";

    const user = {
        setImage: async function(image) {
            try {
                const data = await db.get(username);
                db.putAttachment(data._id, imageId, data._rev, image);
            }
            catch (err) {
                console.log(err);
            }
        },

        getImage: async function() {
            try {
                return db.getAttachment(username, imageId);
            }
            catch (err) {
                console.log(err);
            }
        },

        addBusyEvent: async function(busyEvent) {
            const data = await db.get(username);
            // TODO: verify user doesn't have a conflicting event?
            data.eventsList.push(busyEvent);
            await db.put(data);
        },

        getBusyEvents: async function() {
            const data = await db.get(username);
            return data.eventsList;
        },

        // TODO: delete busy event
        // How to identify the event to delete? Do events need IDs too?

        addFriend: async function(friendUsername) {
            const data = await db.get(username);
            // TODO: verify friend ID exists
            // TODO: verify not already a friend?
            data.friendsDict[friendUsername] = 1;
            await db.put(username);
        },

        removeFriend: async function(friendUsername) {
            // TODO: verify users are friends
            const data = await db.get(username);
            delete data.friendsDict[friendUsername];
        },

        hasFriend: async function(friendUsername) {
            const data = await db.get(username);
            return (friendUsername in data.friendsDict);
        },

        getAllFriends: async function() {
            const data = await db.get(username);
            return Object.keys(data.friendsDict);
        },

        addFriendRequestFrom: async function(friendUsername) {
            // TODO:
            //   - verify friend exists
            //   - verify not already friends
            //   - verify not already requested
            const data = await db.get(username);
            data.requestsDict[friendUsername] = 1;
            await db.put(data);
        },

        removeFriendRequestFrom: async function(friendUsername) {
            const data = await db.get(username);
            delete data.requestsDict[friendUsername];
            await db.put(data);
        }
    };
    ["firstName", "lastName", "college", "bio"].forEach(
        property => _addProperty(user, db, username, property)
    );
    return user;
}

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

function getGroup(groupId, db=groupDb) {
    const imageId = "groupImage";
    const group = {
        setImage: async function(image) {
            try {
                const data = await db.get(groupId);
                db.putAttachment(data._id, imageId, data._rev, image);
            }
            catch (err) {
                console.log(err);
            }
        },

        getImage: async function() {
            try {
                return db.getAttachment(groupId, imageId);
            }
            catch (err) {
                console.log(err);
            }
        },

        addMember: async function(username, userDb=userDb) {
            // TODO: verify user exists?
            // TODO: verify user not already in group
            const group = await db.get(groupId);
            group.memberDict[username] = 1;
            await db.put(group);
        },

        removeMember: async function(username) {
            // TODO: verify user is in group
            const group = await db.get(groupId);
            delete group.memberDict[username];
            await db.put(group);
        },

        hasMember: async function(username) {
            const group = await db.get(groupId);
            return (username in group.memberDict);
        },

        getAllMemberIds: async function() {
            const group = await db.get(groupId);
            return Object.keys(group.memberDict);
        },

        addPlannedEvent: async function(plannedEvent) {
            const data = await db.get(groupId);
            // TODO: verify user doesn't have a conflicting event?
            data.eventsList.push(plannedEvent);
            await db.put(data);
        },

        getPlannedEvents: async function() {
            const data = await db.get(groupId);
            return data.eventsList;
        }
    }
    ["groupName"].forEach(
        property => _addProperty(group, db, groupId, property)
    );
    return group;
}

export { getUser, getGroup }

// Just a little test
// TODO: make a real unit test suite
await createUser("user1");
const user1 = getUser("user1");
await user1.setFirstName("Foo");
console.log(await user1.getFirstName());