import { redirectToAuthCodeFlow, getAccessToken } from './auth.js';
import { fetchProfile, fetchTopArtists } from './api.js';
import { populateUI, populateUI2 } from './ui.js';
import './scss/styles.scss'

const clientId = "ec8cb7b304fa4772868545d97cc74fbf";

async function handleAuthorization() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
        const accessToken = await getAccessToken(clientId, code);
        const profile = await fetchProfile(accessToken);
        const top = await fetchTopArtists(accessToken);
        populateUI(profile);
        populateUI2(top);
        
    }


    // Clean up URL after authorization
    const newUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, newUrl);

}

document.addEventListener('DOMContentLoaded', async () => {
    // Check if the user has already authorized and returned with a code
    await handleAuthorization();

    // Set up event listener for the button
    const authButton = document.getElementById('auth-button');
    authButton.addEventListener('click', () => {
        redirectToAuthCodeFlow(clientId);
    });
});

