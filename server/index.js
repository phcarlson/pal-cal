import express from 'express';
import logger from 'morgan';
import { readFile, writeFile } from 'fs/promises';
import * as http from 'http';
import * as url from 'url';
// import { getUser, getGroup, getAllUsernames, userExists, createGroup, createUser } from "./database.js"

const app = express();
const port = 3000;
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use('/client', express.static('client'));

// SET USER OR GROUP IMAGES REQUESTS
app.put('/set/image', async (request, response) => {
  const options = request.query;

  // Set image for group
  if(options.groupId !== undefined && options.username === undefined){

  }
  // Set image for user
  else if (options.groupId === undefined && options.username !== undefined){
    
  }
});

// GET USER OR GROUP IMAGES REQUESTS
app.get('/get/image', async (request, response) => {
  const options = request.query;

    // Get image from group
    if(options.groupId !== undefined && options.username === undefined){

    }
    // Get image from user
    else if (options.groupId === undefined && options.username !== undefined){
      
    }
});

// HANDLING USER BUSY EVENTS REQUESTS
// TODO make sure you retrieve busy event correctly from body
// Add busy event to specified user id
app.put('/add/busyEvent', async (request, response) => {
  const options = request.query;
  const requestBody = request.body;
});

// Get busy events from specified user id
app.get('/get/busyEvents', async (request, response) => {
  const options = request.query;
  const username = options.username;
});

// HANDLING USER FRIENDS AND FRIEND REQUESTS AND GROUPS REQUESTS

// Add friend to specified user id
app.put('/add/friend', async (request, response) => {
  const options = request.query;
  const username = options.username;
  const friendUsername = options.friendUsername;
});

// Remove friend from specified user id
app.delete('/delete/friend', async (request, response) => {
  const options = request.query;
  const username = options.username;
  const friendUsername = options.friendUsername;
});

// See if friend exists for specified user id
app.get('/has/friend', async (request, response) => {
  const options = request.query;
  const username = options.username;
  const friendUsername = options.friendUsername;
});

// See all friends from specified user id
app.get('/get/friends', async (request, response) => {
  const options = request.query;
  const username = options.username;
});

// TODO make sure you retrieve request correctly from body
// Add friend request to specified user id
app.put('/add/friendRequest', async (request, response) => {
  const options = request.query;
  const username = options.username;
});

// Remove friend request from specified user id
app.delete('/delete/friendRequest', async (request, response) => {
  const options = request.query;
  const username = options.username;
  const friendUsername = options.friendUsername;
});

// Get all friend requests from specified user id
app.get('/get/friendRequests', async (request, response) => {
  const options = request.query;
  const username = options.username;
});

// Get all groups of specified user id
app.get('/get/groups', async (request, response) => {
  const options = request.query;
  const username = options.username;
});

// app.post('/create', async (request, response) => {
//   const options = request.body;
//   createCounter(response, options.name);
// });

//TODO setting and getting properties of user, maybe we use it as PATCH for the obj

// Create new user
app.put('/create/user', async (request, response) => {
  const options = request.query;
  const username = options.username;
});

// See if user exists in db
app.get('/has/user', async (request, response) => {
  const options = request.query;
  const username = options.username;
});

// Get all user ids from db
app.get('/get/users', async (request, response) => {
  const options = request.query;
  const username = options.username;
});


//TODO must return new group id
// Create new group
app.put('/create/group', async (request, response) => {
  const options = request.query;

});

// Add member to specified group id
app.get('/add/member', async (request, response) => {
  const options = request.query;
  const groupId = options.groupId;
  const username = options.username;
});

// Remove member from specified group id
app.delete('/delete/member', async (request, response) => {
  const options = request.query;
  const groupId = options.groupId;
  const username = options.username;
});

// Check if member exists in specified group id
app.get('/has/member', async (request, response) => {
  const options = request.query;
  const groupId = options.groupId;
  const username = options.username;
});

// Get all member ids in specified group id
app.get('/get/members', async (request, response) => {
  const options = request.query;
  const groupId = options.groupId;
});


// HANDLING GROUP PLANNED EVENTS REQUESTS
// TODO make sure you retrieve planned event correctly from body
// Add busy event to specified user id
app.put('/add/plannedEvent', async (request, response) => {
  const options = request.query;
  const groupId = options.groupId;
  const requestBody = request.body;
});

// Get busy events from specified user id
app.get('/get/plannedEvents', async (request, response) => {
  const options = request.query;
  const groupId = options.groupId;
});

// TODO handle getting and setting groupName param



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
