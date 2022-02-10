import { playback } from "../functions/spotify-functions";
import { change } from "../functions/math-functions";
import { useState, useEffect } from "react";
import * as Unicons from '@iconscout/react-unicons';

// PLAYER COMPONENT //
const Player = props => {
    // COMPONENT VARIABLES //

    // Serves As A Placeholder For Tracks
    const placeholder = {
        id: "",
        name: "TRACK",
        album: {
            images: [
                { url: "https://designshack.net/wp-content/uploads/placeholder-image.png" }
            ]
        },
        artists: [
            { name: "ARTIST" }
        ]
    }

    const [isPaused, setPaused] = useState(null)   // Checks If Current Song Is Paused
    const [track, setTrack] = useState(placeholder)       // Sets Current Track Details
    const [duration, setDuration] = useState(null) // Sets The Duration (length) of the Current Track
    const [position, setPosition] = useState(0)   // Sets The Position of The Song Playing
    const [isLiked, setLiked] = useState(false) // Checks If Current Song Playing Is Liked
    const [volume, setVolume] = useState(0.5) // Checks The Volume

    const player = props.player // PLAYER OBJECT (To Run Functions)

    // Runs When Props Change
    useEffect(() => {
        // Checks If Player Data Is Avaliable
        if (props.state) {
            // Updates Song States
            setPaused(props.state.paused)
            setTrack(props.state.track_window.current_track)
            setDuration(Math.floor(props.state.duration / 1000))

            // Update The Position Of The Song
            let pos = Math.floor(props.state.position / 1000)
            const slider = document.querySelector('.progress-bar')
            if (isPaused) {
                setPosition(pos)
            } else {
                const refreshPos = setInterval(() => {
                    setPosition(pos += 1)
                    // Update Progress Bar
                    if (slider) {
                        slider.value = pos
                    }
                }, 1000)
                return () => clearInterval(refreshPos)
            }
        }
    }, [props])

    // Runs When Track Updates
    useEffect(() => {
        if (track.id) {
            playback.checkSave(track.id, props.token).then(data => {
                setLiked(data)
            })
        }
    }, [track])

    return (
        <div className='player'>
            <div className='duration-container'>
                <input className="progress-bar" type="range" min="0" max={duration} onChange={(e) => {
                        player.seek(e.target.value * 1000);
                    }} />
            </div>
            <div className='player-container'>
                <div className='left-side'>
                    <div className='c-track-container'>
                        <img className='player-img' src={track.album.images[0].url} />
                        <div className='track-details'>
                            <span className='song-name'>{track.name}</span>
                            <span className='artist-name'>{track.artists[0].name}</span>
                        </div>
                        <button onClick={() => {
                            // Toggle Save Track Button
                            { isLiked ? playback.toggleSave(track.id, "DELETE", props.token) : playback.toggleSave(track.id, "PUT", props.token); };
                            setLiked(!isLiked);
                        }}>
                            {isLiked ? <Unicons.UilHeartMedical color="#FDADE9" /> : <Unicons.UilHeart color="#FFFAF0"/>}
                        </button>
                    </div>
                </div>

                <div className='center'>
                    <div className='player-controls'>
                        <button className='btn-skip' onClick={() => { player.previousTrack()}}>
                            <Unicons.UilStepBackward />
                        </button>
                        <button className='btn-play' onClick={() => { player.togglePlay() }}>
                            {isPaused ? <Unicons.UilPlay /> : <Unicons.UilPause />}
                        </button>
                        <button className='btn-skip' onClick={() => { player.nextTrack()}}>
                            <Unicons.UilSkipForward />
                        </button>
                    </div>
                    <div className='duration-text'>
                        <p className="time">{change.secsToHMS(position)}</p>
                        <p>/</p>
                        <p className="time">{change.secsToHMS(duration)}</p>
                    </div>
                </div>

                <div className='right-side'>
                    <span>{volume > 0.6 ?
                    <Unicons.UilVolumeUp /> :
                    volume > 0.3 ?
                    <Unicons.UilVolume /> :
                    volume == 0.01 ?
                    <Unicons.UilVolumeMute /> :
                    <Unicons.UilVolumeDown />
                    }</span>
                    <input className='volume-bar' type='range' min='1' max='99' onChange={(e) => {
                        player.setVolume(e.target.value / 100); player.getVolume().then(vol => setVolume(vol))
                    }} />
                </div>
            </div>
        </div>
    )
}

export default Player;