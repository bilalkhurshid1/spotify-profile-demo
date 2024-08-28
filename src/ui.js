export function populateUI(profile) {
    document.getElementById("displayName").innerText = profile.display_name;
    if (profile.images[0]) {
        const profileImage = new Image(200, 200);
        profileImage.src = profile.images[1].url;
        document.getElementById("avatar").appendChild(profileImage);
    }  
}

export function populateUI2(top) {
    // Populating artist names
    for (let i = 0; i < 9; i++) {
        const element = document.getElementById(`name${i + 1}`);
        if (element) {
            element.innerText = top.items[i]?.name || "Name not available";
        }
    }

    // Populating artist images
    for (let i = 0; i < 9; i++) {
        const artistElement = document.getElementById(`url${i + 1}`);
        if (artistElement) {
            const imageUrl = top.items[i]?.album.images[0]?.url;
            if (imageUrl) {
                artistElement.src = imageUrl;
            } else {
                artistElement.alt = "Image not available";
            }
        }
    }

    // Populating artist names
    for (let i = 0; i < 9; i++) {
        const element = document.getElementById(`artistname${i + 1}`);
        if (element) {
            element.innerText = top.items[i]?.artists[0].name || "Name not available";
        }
    }
}
