import { getUser, getGroup, getAllUsernames, userExists, createGroup, createUser} from "./crud.js";
import { BusyEvent, PlannedEvent } from './datatypes.js';

let userDb = new PouchDB("users.pouchdb");
let groupDb = new PouchDB("groups.pouchdb");

// await userDb.destroy();
// await groupDb.destroy();

// userDb = new PouchDB("users.pouchdb");
// groupDb = new PouchDB("groups.pouchdb");

// TESTING CRUD THROUGH MOCK DATA

// load up mock 101 users to pouch
for (let i = 0; i < 101; i++){
    await createUser(`user${i}`);
    const testuser = getUser(`user${i}`);
    await testuser.setFirstName(`firstName${i}`);
    await testuser.setLastName(`lastName${i}`);

    let firstName = await testuser.getFirstName();
    let lastName = await testuser.getFirstName();

    // console.log(firstName);
    // console.log(lastName);
}


// load up mock friends of test user0
const testuser = getUser(`user0`);
for (let i = 0; i < 20; i += 3){
    await testuser.addFriend(`user${i}`);
}
console.log(await testuser.getAllFriends());


// load up mock friend REQUESTS of test user0
for (let i = 1; i < 20; i += 3){
    await testuser.addFriendRequestFrom(`user${i}`)
}
console.log(testuser.getAllFriendRequests());


// load up mock groups and their members, half of which should include user0
for (let i = 0; i < 20; i++){
    const testgroupID = await createGroup();
    const testGroup = getGroup(testgroupID);

    await testGroup.setGroupName(`groupName${i}`);

    for(let j = 0; j < 10; j++){
        let usernum = i*10 + j + 1;
        await testGroup.addMember(`user${usernum}`);
    }
    if(i < 10){
        await testGroup.addMember("user0");
    }

    console.log(await testGroup.getAllMemberIds());
}



// let testGroupID = None;

for (let i = 0; i < 20; i++){
    const testgroupID = await createGroup();
    const testGroup = getGroup(testgroupID);
    if(i === 0){
        // testGroupID = testGroupID;
    }
    await testGroup.setGroupName(`groupName${i}`);

    for(let j = 0; j < 10; j++){
        let usernum = i*10 + j + 1;
        await testGroup.addMember(`user${usernum}`);
    }
    if(i < 10){
        await testGroup.addMember("user0");
    }

    console.log(await testGroup.getAllMemberIds());
}


// add planned events to test group 0
let testGroup = getGroup(testGroupID);

let planned = new PlannedEvent(
    title = "TitleEvent1",
    startHour = 13,
    endHour = 14, 
    startMinute = 30,
    endMinute = 30,
    startDay = 1,
    endDay = 1,
    creatorUsername = "",
    location = "library",
    description = "group study",
    yesDict = {},
    noDict = {},
    maybeDict ={}
);
await testGroup.addPlannedEvent(planned);

planned = new PlannedEvent(
    title = "TitleEvent2",
    startHour = 18,
    endHour = 20, 
    startMinute = 0,
    endMinute = 0,
    startDay = 1,
    endDay = 1,
    creatorUsername = "",
    location = "restaurant",
    description = "dinner",
    yesDict = {},
    noDict = {},
    maybeDict ={}
    );
await testGroup.addPlannedEvent(planned);

planned = new PlannedEvent(
    title = "TitleEvent3",
    startHour = 21,
    endHour = 23, 
    startMinute = 0,
    endMinute = 0,
    startDay = 4,
    endDay = 4,
    creatorUsername = "",
    location = "home",
    description = "movie",
    yesDict = {},
    noDict = {},
    maybeDict ={}
    );
await testGroup.addPlannedEvent(planned);

planned = new PlannedEvent(
    title = "TitleEvent4"
    startHour = 14,
    endHour = 16, 
    startMinute = 30,
    endMinute = 45,
    startDay = 3,
    endDay = 3,
    creatorUsername = "",
    location = "class",
    description = "super cool guest lecture",
    yesDict = {},
    noDict = {},
    maybeDict ={}
    );
await testGroup.addPlannedEvent(planned);

planned = new PlannedEvent(
    title = "TitleEvent5"
    startHour = 12,
    endHour = 12, 
    startMinute = 0,
    endMinute = 0,
    startDay = 5,
    endDay = 6,
    creatorUsername = "",
    location = "somewhere",
    description = "24 dance hour marathon",
    yesDict = {},
    noDict = {},
    maybeDict ={}
    );
await testGroup.addPlannedEvent(planned);

console.log(await testGroup.getPlannedEvents());

//add busy events to testuser
