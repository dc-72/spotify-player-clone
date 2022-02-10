/// SPOTIFY FUNCTIONS ///

// AUTHORIZATION COMMANDS (OAUTH)
export const auth = {
    // Formats The Spotify Login URL --> Returns URL
    loginURL: (id, redirect, scopes) => {
        return `https://accounts.spotify.com/authorize?client_id=${id}&redirect_uri=${redirect}&scope=${scopes.join('%20')}&response_type=code&show_dialog=true`
    },

    // Get Authorization Info (Access Token, Refresh Token, etc.) --> PROMISE
    getLogin: async (code, id, secret, redirect) => {
        const data = await fetch(`https://accounts.spotify.com/api/token`, {
            body: `client_id=${id}&client_secret=${secret}&grant_type=authorization_code&code=${code}&redirect_uri=${redirect}`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST"
        })
        const result = await data.json()
        return result
    },

    // Get New Access Token From Refresh Token --> PROMISE
    getToken: async (id, secret, refresh) => {
        const data = await fetch(`https://accounts.spotify.com/api/token`, {
            body: `grant_type=refresh_token&refresh_token=${refresh}`,
            headers: {
                "Authorization": "Basic " + btoa(`${id}:${secret}`),
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST"
        })
        const result = await data.json()
        return result
    }
}

// PLAYER CONTROLS
export const playback = {
    // Start Playing When Loaded In
    load: (deviceID, token) => {
        fetch(`https://api.spotify.com/v1/me/player`, {
            body: JSON.stringify({
                "device_ids": [ deviceID ],
                "play" : false
            }),
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            method: "PUT"
        })
    },

    // Checks If Current Track Is Saved
    checkSave: async (trackID, token) => {
        const data = await fetch(`https://api.spotify.com/v1/me/tracks/contains?ids=${trackID}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
        const result = await data.json()
        return result[0]
    },

    // Likes/Dislikes Current Track // METHOD: PUT -> SAVES TRACK + DELETE -> REMOVES TRACK
    toggleSave: (trackID, method, token) => {
        fetch(`https://api.spotify.com/v1/me/tracks?ids=${trackID}`, {
            method: method,
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
    },

    // Selects A New Track
    selectTrack: (deviceID, uri, token) => {
        fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceID}`, {
            body: JSON.stringify({
                "uris": [uri],
                "position_ms": 0
            }),
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            method: "PUT"
        })
    }
}

// SEARCH ITEM
export const search = {
    all: async (item, token, limit) => {
        const data = await fetch(`https://api.spotify.com/v1/search?q=${item}&type=track&market=ES&limit=${limit}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
        const result = await data.json()
        return result.tracks.items;
    }
}