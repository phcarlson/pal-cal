import * as crud from './crudclient.js';

// collect html elements
const usernameInput = document.getElementById('usernameInput');
const submitButton = document.getElementById('submit-button');
const warningMessageText = document.getElementById('user-not-found-warning');

submitButton.addEventListener('click', async () => {
    const usernameText = usernameInput.value; // get username from text area
    console.log(usernameText);
    if (await crud.userExists(usernameText)) { // if user exists, set cookie and redirect
        document.cookie = `username=${usernameText}`;
        window.location.pathname = '/homeloggedin.html';
    }
    else {
        warningMessageText.hidden = false;
    }
    
});