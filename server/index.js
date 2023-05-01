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

// TODO Get user obj by id

// TODO Get group obj by id

// TODO Get all usernames

// TODO Check userExists

// TODO Create group

// TODO Create user

// app.post('/create', async (request, response) => {
//   const options = request.body;
//   createCounter(response, options.name);
// });

// app.get('/user', async (request, response) => {
//   const options = request.query;
//   readCounter(response, options.name);
// });

// app.put('/update', async (request, response) => {
//   const options = request.query;
//   updateCounter(response, options.name);
// });

// app.delete('/delete', async (request, response) => {
//   const options = request.query;
//   deleteCounter(response, options.name);
// });

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
