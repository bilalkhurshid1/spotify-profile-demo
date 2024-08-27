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

async function redirectToAuthCodeFlow(clientId: string) {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);
    
    localStorage.setItem("verifier", verifier);
    
    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "http://localhost:5173/callback");
    params.append("scope", "user-read-private user-read-email user-top-read");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);
    
    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}
    
function generateCodeVerifier(length: number) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
    
async function generateCodeChallenge(codeVerifier: string) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}
    

async function getAccessToken(clientId: string, code: string) {
    const verifier = localStorage.getItem("verifier");
    
    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "http://localhost:5173/callback");
    params.append("code_verifier", verifier!);
    
    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });
    
    const { access_token } = await result.json();
    return access_token;
}

async function fetchProfile(token: string): Promise<any> {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });
    
        return await result.json();
    }

async function fetchTopArtists(token: string): Promise<any> {
    const result = await fetch("https://api.spotify.com/v1/me/top/tracks?limit=9&time_range=short_term", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
    });
        return await result.json();
    }

function populateUI(profile: any) {
    document.getElementById("displayName")!.innerText = profile.display_name;
    if (profile.images[0]) {
        const profileImage = new Image(200, 200);
        profileImage.src = profile.images[1].url;
        document.getElementById("avatar")!.appendChild(profileImage);
    }
    document.getElementById("id")!.innerText = profile.id;
    document.getElementById("country")!.innerText = profile.country;
    document.getElementById("email")!.innerText = profile.email;
    document.getElementById("uri")!.innerText = profile.uri;
    document.getElementById("url")!.innerText = profile.external_urls.spotify;
    document.getElementById("imgUrl")!.innerText = profile.images[0]?.url ?? '(no profile image)';

}
function populateUI2(top: any) {
    // Populating artist names
    for (let i = 0; i < 9; i++) {
        const element = document.getElementById(`name${i + 1}`);
        if (element) {
            element.innerText = top.items[i]?.name || "Name not available";
        }
    }

    // Populating artist images
    for (let i = 0; i < 9; i++) {
        const artistElement = document.getElementById(`url${i + 1}`) as HTMLImageElement;
        if (artistElement) {
            const imageUrl = top.items[i]?.album.images[0]?.url;
            if (imageUrl) {
                artistElement.src = imageUrl;
            } else {
                artistElement.alt = "Image not available";
            }
        }
    }
}
