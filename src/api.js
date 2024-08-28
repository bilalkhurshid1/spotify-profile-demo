export async function fetchProfile(token) {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
    });
    return await result.json();
}

export async function fetchTopArtists(token) {
    const result = await fetch("https://api.spotify.com/v1/me/top/tracks?limit=9&time_range=short_term", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
    });
    return await result.json();
}
