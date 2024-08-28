import { redirectToAuthCodeFlow, getAccessToken } from './auth.js';
import { fetchProfile, fetchTopArtists } from './api.js';
import { populateUI, populateUI2 } from './ui.js';

const clientId = "ec8cb7b304fa4772868545d97cc74fbf";
const params = new URLSearchParams(window.location.search);
const code = params.get("code");

if (!code) {
    redirectToAuthCodeFlow(clientId);
} else {
    const accessToken = await getAccessToken(clientId, code);
    const profile = await fetchProfile(accessToken);
    const top = await fetchTopArtists(accessToken);
    populateUI(profile);
    populateUI2(top);
}
