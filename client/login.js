import * as crud from './crudclient.js';

// collect html elements
const usernameInput = document.getElementById('usernameInput');
const submitButton = document.getElementById('submit-button');
const userNotFoundWarning = document.getElementById('user-not-found-warning');
const databaseErrorWarning = document.getElementById('database-error-warning');

submitButton.addEventListener('click', async () => {
    const usernameText = usernameInput.value; // get username from text area
    try {
        if (await crud.userExists(usernameText)) { // if user exists, set cookie and redirect
            document.cookie = `currUsername=${usernameText}`;
            window.location.pathname = '/homeloggedin.html';
        }
        else {
            databaseErrorWarning.hidden = true; // hide "database error" warning
            userNotFoundWarning.hidden = false; // show "user not found" warning
        }
    } catch (error) {
        userNotFoundWarning.hidden = true; // hide "user not found" warning
        databaseErrorWarning.innerText = error;
        databaseErrorWarning.hidden = false; // show "database error" warning
    }
});