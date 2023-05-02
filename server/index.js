import express from 'express';
import logger from 'morgan';
import { readFile, writeFile } from 'fs/promises';
import * as http from 'http';
import * as url from 'url';
// import { getUser, getGroup, getAllUsernames, userExists, createGroup, createUser } from "./database.js"
import * as Pool from 'pg';
import env from 'dotenv';

env.config();

// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'testdb',
//   password: 'password',
//   port: 5432,
// });

console.log(process.env.DATABASE_URL);
console.log(process.env.API_KEY);

const app = express();
const port = 3000;
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use('/client', express.static('client'));


// HANDLE USER RELATED REQUESTS:

// Create new user with obj
app.post('/create/user', async (request, response) => {
  const options = request.query;
  const requestBody = request.body;
});

// Get user by id
app.get('/get/user', async (request, response) => {
  const options = request.query;
});

// Patch a user obj by id
app.patch('/update/user', async (request, response) => {
  const options = request.query;
  const requestBody = request.body;
});

// Delete a user obj by id
app.delete('/delete/user', async (request, response) => {
  const options = request.query;
});

// Get all user objs from ids listed 
app.get('/get/users', async (request, response) => {
  const options = request.query;
  const requestBody = request.body;
});

// Sees if username exists in DB
app.get('/has/user', async (request, response) => {
  const options = request.query;
});

// Gets group ids of groups that user is in
app.get('/get/groupIds', async (request, response) => {
  const options = request.query;
});

// Get all usernames in DB
app.get('/get/usernames', async (request, response) => {
  const options = request.query;
});


// HANDLING USER BUSY EVENTS REQUESTS:

// TODO make sure you retrieve busy event correctly from body
// Create busy event for specified user id's calendar
app.post('/create/busyEvent', async (request, response) => {
  const options = request.query;
  const requestBody = request.body;
});

// Get busy event from specified user id's calendar
app.get('/get/busyEvent', async (request, response) => {
  const options = request.query;
});

// Get busy events from ids listed 
app.get('/get/busyEvents', async (request, response) => {
  const options = request.query;
});

// Get all busy event ids from user specified
app.get('/get/busyEventIds', async (request, response) => {
  const options = request.query;
});

// Update busy event from id specified
app.patch('/update/busyEvent', async (request, response) => {
  const options = request.query;
});

// Delete busy event from id specified
app.delete('/delete/busyEvent', async (request, response) => {
  const options = request.query;
});


// HANDLING USER FRIENDS:

// Add friend from user id to user id
app.put('/add/friend', async (request, response) => {
  const options = request.query;
});

// Get all friends from specified user id
app.get('/get/friends', async (request, response) => {
  const options = request.query;
  const username = options.username;
});

// See if two users are friends
app.get('/has/friend', async (request, response) => {
  const options = request.query;
});

// Remove friendship between two users
app.delete('/delete/friend', async (request, response) => {
  const options = request.query;
});


// HANDLING USER FRIEND REQUESTS:

// TODO make sure you retrieve request correctly from body
// Add friend request from user to user
app.put('/add/friendRequest', async (request, response) => {
  const options = request.query;
});

// Remove friend request from user to user
app.delete('/delete/friendRequest', async (request, response) => {
  const options = request.query;
});

// Get all friend requests to specified user id
app.get('/get/friendRequests/to', async (request, response) => {
  const options = request.query;
});

// Get all friend requests from specified user id
app.get('/get/friendRequests/from', async (request, response) => {
  const options = request.query;
});


// HANDLING GROUPS:

// Create group from obj provided, must return in response new group id
app.patch('/create/group', async (request, response) => {
  const options = request.query;  
});


// Get group by id
app.get('/get/group', async (request, response) => {
  const options = request.query;  
});

// Update group by id with obj provided
app.patch('/update/group', async (request, response) => {
  const options = request.query;  
});

// Delete group by id
app.delete('/delete/group', async (request, response) => {
  const options = request.query;  
});


// Get groups by id list
app.get('/get/groups', async (request, response) => {
  const options = request.query;  
});


// HANDLLE GROUP MEMBERS

// Add member to specified group id
app.post('/add/member', async (request, response) => {
  const options = request.query;
});

// Check if member exists in specified group id
app.get('/has/member', async (request, response) => {
  const options = request.query;
});

// Get all group member ids in specified group id
app.get('/get/memberIds', async (request, response) => {
  const options = request.query;
});

// Remove member from specified group id
app.delete('/delete/member', async (request, response) => {
  const options = request.query;
});


// HANDLING GROUP PLANNED EVENTS:

// TODO make sure you retrieve planned event correctly from body
// Add planned event to specified group id
app.post('/create/plannedEvent', async (request, response) => {
  const options = request.query;
  const groupId = options.groupId;
  const requestBody = request.body;
});

// Get planned event by id
app.get('/get/plannedEvent', async (request, response) => {
  const options = request.query;
  const groupId = options.groupId;
});

// Get planned event objs by id list
app.get('/get/plannedEvents', async (request, response) => {
  const options = request.query;
});

// Get planned event ids from specified group id
app.get('/get/plannedEventIds', async (request, response) => {
  const options = request.query;
});

// Update planned event by id with request obj
app.patch('/update/plannedEvent', async (request, response) => {
  const options = request.query;
});

// Delete planned event by id
app.delete('/delete/plannedEvent', async (request, response) => {
  const options = request.query;
});


// HANDLE RSVPS FOR PLANNED EVENTS:

// Add RSVP to planned event with id specified
app.post('/add/plannedEventRSVP', async (request, response) => {
  const options = request.query;
  const requestBody = request.body;
});

// Delete RSVP from planned event with id specified
app.delete('/delete/plannedEventRSVP', async (request, response) => {
  const options = request.query;
  const requestBody = request.body;
});

// Get RSVP yes list from planned event with id specified
app.get('/get/plannedEventRSVPs/yes', async (request, response) => {
  const options = request.query;
});

// Get RSVP no list from planned event with id specified
app.get('/get/plannedEventRSVPs/no', async (request, response) => {
  const options = request.query;
});

// Get RSVP maybe list from planned event with id specified
app.get('/get/plannedEventRSVPs/maybe', async (request, response) => {
  const options = request.query;
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
