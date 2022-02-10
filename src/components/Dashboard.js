// DASHBOARD COMPONENT //
import { useState, useEffect } from 'react'
import { playback } from '../functions/spotify-functions'
import Player from './Player'
import Search from './Search';
import './dashboard.css';

const Dashboard = props => {
    // COMPONENT VARIABLES //
    const [player, setPlayer] = useState(null) // PLAYER OBJECT (Spotify Player)
    const [state, setState] = useState(null)   // STATE OBJECT (Current Song Playing)
    const [deviceID, setDevice] = useState(null) // DEVICE ID

    // When The Page Renders
    useEffect(() => {
        // Imports The Spotify Script
        const script = document.createElement("script")
        script.src = "https://sdk.scdn.co/spotify-player.js"
        script.async = true
        document.body.appendChild(script)

        // Creates A Spotify Player
        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: 'Web Playback SDK', // Name Of The Project
                getOAuthToken: cb => { cb(props.token) }, // Grabs The Access Token
                volume: 0.5 // Sets The Default Volume
            })
            setPlayer(player);

            // Runs When The Player Is Online
            player.addListener('ready', ({device_id}) => {
                console.log(`Player Is Online (DEVICE ID: ${device_id})`)
                playback.load(device_id, props.token)
                setDevice(device_id)
            })

            // Runs When The Player Is Offline
            player.addListener('not_ready', ({device_id}) => {
                console.log(`Player Is Offline (DEVICE ID: ${device_id})`)
            })

            // Runs When The Player State Changes (Connecting, Changing Song, Pausing)
            player.addListener('player_state_changed', state => {
                if (!state) {
                    return;
                }
                setState(state)
            })

            // Connects Player Online
            player.connect();
        }
    }, [])

    return (
        <div className='Dashboard'>
            {player && state ? 
            (   <>
                    <Player state={state} player={player} token={props.token} />
                    <Search token={props.token} device={deviceID} />
                </>
            ) : 
            <p>{'PAGE LOADING...'}</p>}
        </div>
    )
}

export default Dashboard;