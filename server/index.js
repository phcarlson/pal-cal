import express from 'express';
import logger from 'morgan';
import { readFile, writeFile } from 'fs/promises';
import * as http from 'http';
import * as url from 'url';
import * as database from './database.js';
import env from 'dotenv';

const app = express();
const port = 3000;
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', express.static('client'));


// HANDLE USER RELATED REQUESTS:

// Create new user with obj
app.post('/create/user', async (request, response) => {
  const requestBody = request.body;

  try{
    await database.createUser(requestBody);
    response.status(200).end();
  }
  catch(error){
    console.log(error);
  // Postgres should provide an error if username already exists, so that we have to find another username
    response.status(500).send(error.message);
  // Postgres should provide error when properties in object do not exist
  }
});

// Get user by id
app.get('/get/user', async (request, response) => {
  const options = request.query;
  const username = options.username;

  // Check if username is even specified to get user from
  if(username === undefined){
    response.status(400).send("Bad request: Username is undefined");
  }
  // If good, try to retrieve
  else {
    try{
      const userRetrieved = await database.getUser(username);
      response.status(200).json(userRetrieved);
    }
    catch(error){
      response.status(500).send(error.message);
    }
  }
});

// Patch a user obj by id
app.patch('/update/user', async (request, response) => {
  const options = request.query;
  const requestBody = request.body;
  const username = options.username;

  // Check if username is even specified to patch user from
  if(username === undefined){
    response.status(400).send("Bad request: Username is undefined");
  }
  else{
    try{  
      await database.updateUser(username, requestBody);
      const userRetrieved = await database.getUser(username);
      response.status(200).send();
    }
    catch(error){
      //TODO:
      // Postgres should catch if user does not exist to patch
      // Postgres should catch if properties in object do not exist

      response.status(500).send(error.message);
    }
  }
});

// Delete a user obj by id
app.delete('/delete/user', async (request, response) => {
  const options = request.query;
  const username = options.username;
  // Check if username is even specified to patch user from
  if(username === undefined){
    response.status(400).send("Bad request: Username is undefined");
  }
  else{
    try{  
      await database.deleteUser(username);
      response.status(200).send();
    }
    catch(error){
      //TODO:
      // Postgres should catch if user does not exist to patch
      response.status(500).send(error.message);
    }
  }
});

// Sees if username exists in DB
app.get('/has/user', async (request, response) => {
  const options = request.query;
  const username = options.username;

  // Check if username is even specified in order check against DB
  if(username === undefined){
    response.status(400).send("Bad request: Username is undefined");
  }
  else{
    try{  
      //{exists: true}
      const exists = await database.userExists(username); 
      response.status(200).json({exists: exists});
    }
    catch(error){
      response.status(500).send(error.message);
    }
  }
});


// Get all user objs from ids listed 
app.get('/get/users', async (request, response) => {
  const options = request.query;
  const usernames = options.usernames;

  try{  
      if(usernames === undefined){
        response.status(400).send('Bad request: comma separated usernames undefined')
      }
      else if(usernames === ''){
        response.status(200).json({users: []});
      }
      else{
        const users = await database.getUsers(usernames.split(',')); 
        response.status(200).json({users: users});
      }
    }
    catch(error){
      // TODO: error for user that doesn't exist?
      response.status(500).send(error.message);
    }
});

// Get all usernames in DB
app.get('/get/usernames', async (request, response) => {
  try{
    const usernames = await database.getAllUsernames(); 

    response.status(200).json({usernames: usernames});
  }
  catch(error){
    response.status(500).send(error.message);
  }
});

// Gets group ids of groups that user is in
app.get('/get/groupIds', async (request, response) => {
  const options = request.query;
  const username = options.username;

  // Check if username is even specified in order retreive its group IDs
  if(username === undefined){
    response.status(400).send("Bad request: Username is undefined");
  }
  else{
    try{  
      const groupIds = await database.getGroupIdsOfUser(username); 
      response.status(200).json({groupIds: groupIds});
    }
    catch(error){
      // TODO have db check for username not exists 
      response.status(500).send(error.message);
    }
  }
});


// HANDLING USER BUSY EVENTS REQUESTS:

// TODO make sure you retrieve busy event correctly from body
// Create busy event for specified user id's calendar
app.post('/create/busyEvent', async (request, response) => {
  const requestBody = request.body;
  try{
    const eventId = await database.createBusyEvent(requestBody);
    response.status(200).send({eventId: eventId});
  }
  catch(error){
    response.status(500).send(error.message);
  }
});

// Get busy event from specified user id's calendar
app.get('/get/busyEvent', async (request, response) => {
  const options = request.query;
  const busyEventId = options.busyEventId;
   // Check if username is even specified in order retreive its group IDs
  if(busyEventId === undefined){
    response.status(400).send("Bad request: busyEvent id is undefined");
  }
  else{
    try{  
      const busyEvent = await database.getBusyEvent(busyEventId); 
      response.status(200).json({busyEvent: busyEvent});
    }
    catch(error){
      // TODO have db check for username not exists 
      response.status(500).send(error.message);
    }
  }
});

// Get busy events from id list 
app.get('/get/busyEvents', async (request, response) => {
  const options = request.query;
  const busyEventIds = options.busyEventIds;
  try{  
    if(busyEventIds === undefined){
      response.status(400).send('Bad request: comma separated busy event ids undefined')
    }
    else if(busyEventIds === ''){
      response.status(200).json({busyEvents: []});
    }
    else{
      const busyEvents = await database.getBusyEvents(busyEventIds.split(',')); 
      response.status(200).json({busyEvents: busyEvents});
    }

  }
  catch(error){
    // TODO have db check for bad busyeventids
    response.status(500).send(error.message);
  }
});

// Get all busy event ids from user specified
app.get('/get/busyEventIds', async (request, response) => {
  const options = request.query;
  const username = options.username;
   // Check if username is even specified in order retreive its group IDs
   if(username === undefined){
    response.status(400).send("Bad request: Username is undefined");
  }
  else{
    try{  
      const busyEventIds = await database.getUserBusyEventIds(username); 
      response.status(200).json({busyEventIds: busyEventIds});
    }
    catch(error){
      response.status(500).send(error.message);
    }
  }
});

// Update busy event from id specified
app.patch('/update/busyEvent', async (request, response) => {
  const options = request.query;
  const requestBody = request.body;
  const busyEventId = options.busyEventId;

  if(busyEventId === undefined){
    response.status(400).send("Bad request: busyEvent id is undefined");
  }
  else{
    try{  
      await database.updateBusyEvent(busyEventId, requestBody);
      response.status(200).end();
    }
    catch(error){
      response.status(500).send(error.message);
    }
  }
});

// Delete busy event from id specified
app.delete('/delete/busyEvent', async (request, response) => {
  const options = request.query;
  const busyEventId = options.busyEventId;

  if(busyEventId === undefined){
    response.status(400).send("Bad request: busyEvent id is undefined");
  }
  else{
    try{  
      await database.deleteBusyEvent(busyEventId);
      response.status(200).end();
    }
    catch(error){
      //TODO: check if delete didn't apply ?
      response.status(500).send(error.message);
    }
  }
});


// HANDLING USER FRIENDS:

// Add friend from user id to user id
app.post('/add/friend', async (request, response) => {
  const options = request.query;
  const username1 = options.username1;
  const username2 = options.username2;

  if(username1 === undefined){
    response.status(400).send("Bad request: username1 is undefined");
  }
  else if(username2 === undefined){
    response.status(400).send("Bad request: username2 is undefined");
  }
  else{
    try{
      await database.addFriend(username1, username2);
      response.status(200).end();

    }
    catch(error){

      // TODO: when trying to add two friends that are already friends, in other order, validation error
      response.status(500).send(error.message);
    }
  }
});

// Get all friends from specified user id
app.get('/get/friends', async (request, response) => {
  const options = request.query;
  const username = options.username;
  if(username === undefined){
    response.status(400).send("Bad request: username is undefined");
  }
  else{
    try{
      const usernames = await database.getFriendUsernamesOf(username);
      response.status(200).json({usernames:usernames});
    }
    catch(error){
      response.status(500).send(error.message);
    }
  }
});

// See if two users are friends
app.get('/has/friend', async (request, response) => {
  const options = request.query;
  const username1 = options.username1;
  const username2 = options.username2;

  if(username1 === undefined){
    response.status(400).send("Bad request: username1 is undefined");
  }
  else if(username2 === undefined){
    response.status(400).send("Bad request: username2 is undefined");
  }
  else{
    try{
      const hasFriend = await database.areFriends(username1, username2);
      response.status(200).send({hasFriend:hasFriend});
    }
    catch(error){
      response.status(500).send(error.message);
    }
  }
});

// Remove friendship between two users
app.delete('/delete/friend', async (request, response) => {
  const options = request.query;
  const username1 = options.username1;
  const username2 = options.username2;

  if(username1 === undefined){
    response.status(400).send("Bad request: username1 is undefined");
  }
  else if(username2 === undefined){
    response.status(400).send("Bad request: username2 is undefined");
  }
  else{
    try{
      const hasFriend = await database.deleteFriend(username1, username2);
      response.status(200).end();
    }
    catch(error){
      response.status(500).send(error.message);
    }
}});


// HANDLING USER FRIEND REQUESTS:

// Add friend request from user to user
app.post('/add/friendRequest', async (request, response) => {
  const options = request.query;
  const fromUsername = options.fromUsername;
  const toUsername = options.toUsername;

  if(fromUsername === undefined){
    response.status(400).send("Bad request: fromUsername is undefined");
  }
  else if(toUsername === undefined){
    response.status(400).send("Bad request: toUsername is undefined");
  }
  else{
    try{
      await database.addFriendRequest(fromUsername, toUsername);
      response.status(200).end();

    }
    catch(error){
      response.status(500).send(error.message);
    }
  }
});

// Remove friend request from user to user
app.delete('/delete/friendRequest', async (request, response) => {
  const options = request.query;
  const fromUsername = options.fromUsername;
  const toUsername = options.toUsername;

  if(fromUsername === undefined){
    response.status(400).send("Bad request: fromUsername is undefined");
  }
  else if(toUsername === undefined){
    response.status(400).send("Bad request: toUsername is undefined");
  }
  else{
    try{
      await database.deleteFriendRequest(fromUsername, toUsername);
      response.status(200).end();

    }
    catch(error){
      response.status(500).send(error.message);
    }
  }
});

// Get all friend requests to specified user id
app.get('/get/friendRequests/to', async (request, response) => {
  const options = request.query;
  const username = options.username;

  if(username === undefined){
    response.status(400).send("Bad request: username is undefined");
  }
  else{
    try{
      const friendRequestsTo = await database.getRequestUsernamesTo(username);
      response.status(200).send({friendRequestsTo:friendRequestsTo});

    }
    catch(error){
      response.status(500).send(error.message);
    }
  }
});

// Get all friend requests from specified user id
app.get('/get/friendRequests/from', async (request, response) => {
  const options = request.query;
  const username = options.username;
  
  if(username === undefined){
    response.status(400).send("Bad request: username is undefined");
  }
  else{
    try{
      const friendRequestsFrom = await database.getRequestUsernamesFrom(username);
      response.status(200).send({friendRequestsFrom:friendRequestsFrom});

    }
    catch(error){
      response.status(500).send(error.message);
    }
  }
});

// HANDLING GROUPS:

// Create group from obj provided, must return in response new group id
app.post('/create/group', async (request, response) => {
  const requestBody = request.body;
  
  try{
    const groupId = await database.createGroup(requestBody);
    response.status(200).send({groupId: groupId});
  }
  catch(error){
    response.status(500).send(error.message);
  }
});

// Get group by id
app.get('/get/group', async (request, response) => {
  const options = request.query; 
  const groupId = options.groupId;
  if(groupId === undefined){
    response.status(400).send("Bad request: Group id is undefined");
  }
  else{
    try{
      const groupRetrieved = await database.getGroup(groupId);
      response.status(200).send(groupRetrieved);
    }
    catch(error){
      response.status(500).send(error.message);
    } 
  }
});

// Update group by id with obj provided
app.patch('/update/group', async (request, response) => {
  const options = request.query;
  const requestBody = request.body;
  const groupId = options.groupId;

  // Check if username is even specified to patch user from
  if(groupId === undefined){
    response.status(400).send("Bad request: Group id is undefined");
  }
  else{
    try{  
      await database.updateGroup(groupId, requestBody);
      response.status(200).send();
    }
    catch(error){
      response.status(500).send(error.message);
    }
  }});

// Delete group by id
app.delete('/delete/group', async (request, response) => {
  const options = request.query;
  const groupId = options.groupId;

  // Check if username is even specified to patch user from
  if(groupId === undefined){
    response.status(400).send("Bad request: Group id is undefined");
  }
  else{
    try{  
      await database.deleteGroup(groupId);
      response.status(200).send();
    }
    catch(error){
      response.status(500).send(error.message);
    }
  }});

// Get groups by id list
app.get('/get/groups', async (request, response) => {
  const options = request.query;
  const groupIds = options.groupIds;
  try{  
    if(groupIds === undefined){
      response.status(400).send('Bad request: comma separated group ids undefined')
    }
    else if(groupIds === ''){
      response.status(200).json({groups: []});
    }
    else{
      const groups = await database.getGroups(groupIds.split(',')); 
      response.status(200).json({groups: groups});
    }
  }
  catch(error){
    // TODO have db check for bad group ids
    response.status(500).send(error.message);
  }
});


// HANDLING GROUP MEMBERS

// Add member to specified group id
app.post('/add/member', async (request, response) => {
  const options = request.query;
  const groupId = options.groupId;
  const username = options.username;

  if(groupId === undefined){
    response.status(400).send("Bad request: Group id is undefined");
  }
  else if (username === undefined){
    response.status(400).send("Bad request: Username is undefined");
  }
  else{
    try{
      await database.addGroupMember(groupId, username);
      response.status(200).end();
    }
    catch(error){
      response.status(500).send(error.message);
    }
  }
});

// Check if member exists in specified group id
app.get('/has/member', async (request, response) => {
  const options = request.query;
  const username = options.username;
  const groupId = options.groupId;
  
  if (username === undefined){
    response.status(400).send("Bad request: Username is undefined");
  }
  else{
    try{
      const exists = await database.hasMember(groupId, username);
      response.status(200).json({exists:exists});
    }
    catch(error){
      response.status(500).send(error.message);
    }
  }
});

// Get all group member ids in specified group id
app.get('/get/memberUsernames', async (request, response) => {
  const options = request.query;
  const groupId = options.groupId;

  if(groupId === undefined){
    response.status(400).send("Bad request: Group id is undefined");
  }
  else{
    try{
      const memberIds = await database.getGroupMemberUsernames(groupId);
      response.status(200).json({memberIds:memberIds});
    }
    catch(error){
      response.status(500).send(error.message);
    }
  }
});

// Remove member from specified group id
app.delete('/delete/member', async (request, response) => {
  const options = request.query;
  const groupId = options.groupId;
  const username = options.username;
  
  if(groupId === undefined){
    response.status(400).send("Bad request: Group id is undefined");
  }
  else if (username === undefined){
    response.status(400).send("Bad request: Username is undefined");
  }
  else{
    try{
      await database.removeGroupMember(groupId, username);
      response.status(200).end();
    }
    catch(error){
      response.status(500).send(error.message);
    }
  }
});


// HANDLING GROUP PLANNED EVENTS:

// TODO make sure you retrieve planned event correctly from body
// Add planned event to specified group id
app.post('/create/plannedEvent', async (request, response) => {
  const requestBody = request.body;
  try{
    const eventId = await database.createPlannedEvent(requestBody);
    response.status(200).send({eventId: eventId});
  }
  catch(error){
    response.status(500).send(error.message);
  }
});

// Get planned event by id
app.get('/get/plannedEvent', async (request, response) => {
  const options = request.query;
  const plannedEventId = options.plannedEventId;
   // Check if username is even specified in order retrieve its group IDs
  if(plannedEventId === undefined){
    response.status(400).send("Bad request: plannedEvent id is undefined");
  }
  else{
    try{  
      const plannedEvent = await database.getPlannedEvent(plannedEventId); 
      response.status(200).json({plannedEvent: plannedEvent});
    }
    catch(error){
      response.status(500).send(error.message);
    }
  }
});

// Get planned event objs by id list
app.get('/get/plannedEvents', async (request, response) => {
  const options = request.query;
  const plannedEventIds = options.plannedEventIds;

  try{  
    if(plannedEventIds === undefined){
      response.status(400).send('Bad request: comma separated planned event ids undefined')
    }
    else if(plannedEventIds === ''){
      response.status(200).json({plannedEvents: []});
    }
    else{
      const plannedEvents = await database.getPlannedEvents(plannedEventIds.split(',')); 
      response.status(200).json({plannedEvents: plannedEvents});
    }
  }
  catch(error){
    // TODO have db check for bad plannedEventIds
    response.status(500).send(error.message);
  }
});

// Get planned event ids from specified group id
app.get('/get/plannedEventIds', async (request, response) => {
  const options = request.query;
  const groupId = options.groupId;
  // Is group id even defined to get event ids from?
  if(groupId === undefined){
    response.status(400).send("Bad request: Username is undefined");
  }
  else{
    try{  
      const plannedEventIds = await database.getGroupPlannedEventIds(groupId); 
      response.status(200).json({plannedEventIds: plannedEventIds});
    }
    catch(error){
      response.status(500).send(error.message);
    }
  }
});

// Update planned event by id with request obj
app.patch('/update/plannedEvent', async (request, response) => {
  const options = request.query;
  const requestBody = request.body;
  const plannedEventId = options.plannedEventId;
  // is plannedEventId or username even defined to delete rsvp from?

  if(plannedEventId === undefined){
    response.status(400).send("Bad request: plannedEvent id is undefined");
  }
  else{
    try{  
      await database.updatePlannedEvent(plannedEventId, requestBody);
      response.status(200).end();
    }
    catch(error){
      response.status(500).send(error.message);
    }
  }
});
// Delete planned event by id
app.delete('/delete/plannedEvent', async (request, response) => {
  const options = request.query;
  const plannedEventId = options.plannedEventId;

  if(plannedEventId === undefined){
    response.status(400).send("Bad request: plannedEvent id is undefined");
  }
  else{
    try{  
      await database.deletePlannedEvent(plannedEventId);
      response.status(200).end();
    }
    catch(error){
      //TODO: check if delete didn't apply ?
      response.status(500).send(error.message);
    }
  }
});


// HANDLING RSVPS FOR PLANNED EVENTS:

// Add RSVP to planned event with id specified
app.post('/add/plannedEventRSVP', async (request, response) => {
  const options = request.query;
  const plannedEventId = options.plannedEventId;
  const username = options.username;
  const rsvp = options.rsvp
  // is plannedEventId, username, or yes/no/maybe even defined to add rsvp?
  if(plannedEventId === undefined){
    response.status(400).send("Bad request: plannedEvent id is undefined");
  }
  else if(username === undefined){
    response.status(400).send("Bad request: username is undefined");
  }
  else if(rsvp === undefined){
    response.status(400).send("Bad request: rsvp response is undefined");
  }
  else{
    try{  
      await database.addRsvp(plannedEventId, username, rsvp);
      response.status(200).end();
    }
    catch(error){
      //TODO: check if rsvp didn't apply ?
      response.status(500).send(error.message);
    }
  }
});

// Delete RSVP from planned event with id specified
app.delete('/delete/plannedEventRSVP', async (request, response) => {
  const options = request.query;
  const plannedEventId = options.plannedEventId;
  const username = options.username;
  // is plannedEventId or username even defined to delete rsvp from?
  if(plannedEventId === undefined){
    response.status(400).send("Bad request: plannedEvent id is undefined");
  }
  else if(username === undefined){
    response.status(400).send("Bad request: username is undefined");
  }
  else{
    try{  
      await database.deleteRsvp(plannedEventId, username);
      response.status(200).end();
    }
    catch(error){
      //TODO: check if rsvp didn't delete ?
      response.status(500).send(error.message);
    }
  }
});

// Get RSVP yes list from planned event with id specified
app.get('/get/plannedEventRSVPs/yes', async (request, response) => {
  const options = request.query;
  const plannedEventId = options.plannedEventId;
  // is plannedEventId even defined to get yesList from?
  if(plannedEventId === undefined){
    response.status(400).send("Bad request: plannedEvent id is undefined");
  }
  else{
    try{  
      const yesList = await database.getYesRsvpsTo(plannedEventId);
      response.status(200).json({yesList:yesList});
    }
    catch(error){
      response.status(500).send(error.message);
    }
  }
});

// Get RSVP no list from planned event with id specified
app.get('/get/plannedEventRSVPs/no', async (request, response) => {
  const options = request.query;
  const plannedEventId = options.plannedEventId;
  // is plannedEventId even defined to get noList from?
  if(plannedEventId === undefined){
    response.status(400).send("Bad request: plannedEvent id is undefined");
  }
  else{
    try{  
      const noList = await database.getNoRsvpsTo(plannedEventId);
      response.status(200).json({noList:noList});
    }
    catch(error){
      response.status(500).send(error.message);
    }
  }
});


// Get RSVP maybe list from planned event with id specified
app.get('/get/plannedEventRSVPs/maybe', async (request, response) => {
  const options = request.query;
  const plannedEventId = options.plannedEventId;
  // is plannedEventId even defined to get maybeList from?
  if(plannedEventId === undefined){
    response.status(400).send("Bad request: plannedEvent id is undefined");
  }
  else{
    try{  
      const maybeList = await database.getMaybeRsvpsTo(plannedEventId);
      response.status(200).json({maybeList:maybeList});
    }
    catch(error){
      response.status(500).send(error.message);
    }
  }
});

// HANDLING PAGE RETRIEVALS:

app.get('*', async (request, response) => {
  try {
    const parsedUrl = url.parse(request.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;
    // Determine the content type of the requested file (if it is a file).
    let type = '';
    if (pathname.endsWith('.css')) {
      type = 'text/css';
    } else if (pathname.endsWith('.js')) {
      type = 'text/javascript';
    } else if (pathname.endsWith('.json')) {
      type = 'application/json';
    } else if (pathname.endsWith('.html')) {
      type = 'text/html';
    } else if (pathname.endsWith('/')) {
      type = 'text/html';
    } else {
      type = 'text/plain';
    }
    // The client files are found in the client directory, so we must prepend
    // the client path to the file requested. We also recognize the meaning of
    // a '/' to refer to the index.html file.
    const file = pathname === '/' ? 'client/index.html' : `client${pathname}`;
    const data = await readFile(file, 'utf8');
    response.writeHead(200, { 'Content-Type': type });
    response.write(data);
    response.end();
  } 
  catch (err) {
    response.status(404).send(`Not found: ${request.path}`);
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
