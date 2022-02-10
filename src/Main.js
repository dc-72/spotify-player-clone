/// ROOT COMPONENT ///
import { auth } from './functions/spotify-functions';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { useState, useEffect } from "react";

// Global Variables
const clientID = process.env.REACT_APP_CLIENT_ID;
const clientSecret = process.env.REACT_APP_CLIENT_SECRET;
const redirectURI = process.env.REACT_APP_REDIRECT_URI;
const scopes = process.env.REACT_APP_SCOPES.split(',');

const Main = () => {
    // COMPONENT VARIABLES //
    const [token, setToken] = useState(null)
    const [refreshToken, setRefreshToken] = useState(null)
    const [expiresIn, setExpiration] = useState(null)

    // When The Page Renders
    useEffect(() => {
        // Checks If The Code Is In The URL
        let url = decodeURI(window.location)
        window.history.pushState({}, null, "/") // Clears Query From URL

        if (url.includes('code')) {
            let code = url.split('=')[1] // Grabs The Code From URL
            auth.getLogin(code, clientID, clientSecret, redirectURI).then(data => {
                setToken(data.access_token)
                setRefreshToken(data.refresh_token)
                setExpiration(data.expires_in)
            })
            .catch(err => console.log(err))
        }
    }, [])

    // Refreshes When The Token Expires
    useEffect(() => {
        // Checks If Token, Refresh Token + Expires In are not NULL
        if (token && refreshToken && expiresIn) {
            const refresh = setInterval(() => {
                auth.getToken(clientID, clientSecret, refreshToken).then(data => {
                    setToken(data.access_token)
                    setExpiration(data.expires_in)
                })
            }, expiresIn * 1000)
            return () => clearInterval(refresh)
        }
    }, [refreshToken, expiresIn])

    return (
        <div>
            {
                // Checks If Token Is Received //
                token ?
                <Dashboard token={token} /> : 
                <Login link ={auth.loginURL(clientID, redirectURI, scopes)} />
            }
           
        </div>
    )
}

export default Main;