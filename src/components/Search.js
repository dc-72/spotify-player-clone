// SEARCH COMPONENT //
import { useState, useEffect } from "react";
import { search, playback } from "../functions/spotify-functions";

const Search = props => {
    const [results, setResults] = useState([])

    return (
        <div>
            <form onSubmit={e => {
                e.preventDefault();
                console.log('Submitted!')
                search.all(e.target.firstChild.value, props.token, 10).then(data => {
                    setResults(data.reduce((total, item) => {
                        let result = {
                            id: item.id,
                            name: item.name,
                            artist: item.artists[0].name,
                            type: item.album.album_type,
                            uri: item.uri
                        }
                        return total = [...total, result]
                    }, []))
                })
            }}>
                <input type='text' />
            </form>
            <ol>
                { results.length == 0 ? <li>{'NO RESULTS...'}</li> : <div>TRACKS: {results.map(element =>
                <li key={element.id}>
                    <a href="#" onClick={() => {
                        // SET NEW SONG
                        playback.selectTrack(props.device, element.uri, props.token);
                    }}>
                        {`${element.name} - ${element.artist}`}
                    </a>
                </li> 
                )}</div> }
            </ol>
        </div>
    )
}

export default Search;