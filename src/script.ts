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
    const result = await fetch("https://api.spotify.com/v1/me/top/artists?limit=10&time_range=long_term", {
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
    for (let i = 0; i < 10; i++) {
        const element = document.getElementById(`name${i + 1}`);
        if (element) {
            element.innerText = top.items[i]?.name || "Name not available";
        }
    }
    // const artist1 = new Image();
    // artist1.src = top.images[0].url;
    // artist1.width = 640; 
    // artist1.height = 640; 
    for (let i = 0; i < 10; i++) {
        const artistImage = new Image(160, 160);
        artistImage.src = top.items[i]?.images[2]?.url;
        
        // Assuming there are elements with IDs like 'artist1', 'artist2', ..., 'artist10'
        const artistElement = document.getElementById(`artist${i + 1}`);
        
        if (artistElement) {
            artistElement.appendChild(artistImage);
        }
    }
    
}