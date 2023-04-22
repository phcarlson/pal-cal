import PouchDB from 'pouchdb';

const userDb = new PouchDB("users.pouchdb");
const groupDb = new PouchDB("groups.pouchdb");


async function _getProperty(db, _id, property) {
    try {
        const data = await db.get(_id);
        return data[property];
    }
    catch (err) {
        console.log(err);
    }
}

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
        },

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

async function userExists(username, db=userDb) {
    try {
        await db.get(username);
        return true;
    }
    catch(err) {
        return false;
    }
}

async function getAllUsernames(db=userDb) {
    const docs = await db.allDocs();
    return docs.rows.map(row => row.id);
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

        addMember: async function(username, localUserDb=userDb) {
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