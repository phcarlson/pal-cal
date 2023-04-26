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
// console.log(await testuser.getAllFriendRequests());


let testGroup;
// load up mock groups and their members, half of which should include user0
for (let i = 0; i < 20; i++){
    const thisGroupId = await createGroup();
    const thisGroup = getGroup(thisGroupId);

    await thisGroup.setGroupName(`groupName${i}`);

    for(let j = 0; j < 10; j++){
        let usernum = i*10 + j + 1;
        await thisGroup.addMember(`user${usernum}`);
    }
    if(i < 10){
        await thisGroup.addMember("user0");
    }
    if (i === 0) {
        testGroup = thisGroup;
    }

    // console.log(`Group ${i}: ${await thisGroup.getAllMemberIds()}`);
}


let planned = new PlannedEvent( "TitleEvent1", 13, 14, 30, 30, 1, 1, "", "library", "group study", {}, {},);
await testGroup.addPlannedEvent(planned);
planned = new PlannedEvent( "TitleEvent2", 18, 20, 0, 0, 1, 1, "", "restaurant", "dinner", {}, {},);
await testGroup.addPlannedEvent(planned);

planned = new PlannedEvent( "TitleEvent3", 21, 23, 0, 0, 4, 4, "", "home", "movie", {}, {},);
await testGroup.addPlannedEvent(planned);

planned = new PlannedEvent( "TitleEvent4", 14, 16, 30, 45, 3, 3, "", "class", "super cool guest lecture", {}, {},);
await testGroup.addPlannedEvent(planned);

planned = new PlannedEvent( "TitleEvent5", 12, 12, 0, 0, 5, 6, "", "somewhere", "24 dance hour marathon", {}, {},);
await testGroup.addPlannedEvent(planned);

// console.log(await testGroup.getPlannedEvents());

//add busy events to testuser
let busy = new BusyEvent( "BusyEvent1", 16, 17, 15, 0, 1, 1);
await testuser.addBusyEvent(busy);

busy = new BusyEvent( "BusyEvent2", 12, 17, 0, 0, 2, 2);
await testuser.addBusyEvent(busy);

busy = new BusyEvent( "BusyEvent3", 10, 13, 30, 0, 3, 3);
await testuser.addBusyEvent(busy);

busy = new BusyEvent( "BusyEvent4", 9, 10, 30, 30, 4, 4);
await testuser.addBusyEvent(busy);
busy = new BusyEvent( "BusyEvent5", 14, 15, 0, 0, 4, 4);
await testuser.addBusyEvent(busy);

busy = new BusyEvent( "BusyEvent6", 10, 11, 0, 0, 5, 5);
await testuser.addBusyEvent(busy);

// console.log(await testuser.getBusyEvents());