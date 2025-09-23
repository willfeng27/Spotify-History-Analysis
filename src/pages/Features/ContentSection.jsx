import { collection, addDoc } from "firebase/firestore";

import { useLocation } from 'react-router-dom';

export function ContentSection(props) {

    const {state} = useLocation();
    const {playArrayArray} = state;

    return (
        <div className="body"> 

            {/* IDEA: split-up... summary, song tools, artist tools */}

            <h2>Summary</h2>

            {props.media === 'song' && (
                <>
                    <ul className="bodyList">
                        <li>Your most-played song & how many plays: <em>{playArrayArray[0].length}</em></li>
                        <li>Your most-played artist & how many artists: <em>{playArrayArray.length}</em></li>
                        <li>Percentage skipped: <em>Stuff</em></li>
                    </ul>

                    <h2>Song-specific tools</h2>

                    <ul className="bodyList">
                        <li>Find the number of plays for a song with a particular title: <input type="text" className="bodyInput"></input></li>
                        <li>Displaying your top <input type="text" className="bodyInput"></input> most played songs</li>
                    </ul>

                    <h2>Artist-specific tools</h2>

                    <ul className="bodyList">
                        <li>Find the number of plays for songs with a particular artist: <input type="text" className="bodyInput"></input></li>
                        <li>Displaying your top <input type="text" className="bodyInput"></input> most played artists</li>
                    </ul>
                </>
            )}

            {props.media === 'podcast' && (
                <>
                    <ul className="bodyList">
                        <li><em>Podcast stuff</em></li>
                        <li><em>Podcast stuff</em></li>
                        <li><em>Podcast stuff</em></li>
                    </ul>

                    <h2>Podcast-specific tools</h2>

                    Podcast-specific tools are not supported yet 🥀🥀🥀
                </>
            )}

            {props.media === 'audiobook' && (
                <>
                    <ul className="bodyList">
                        <li><em>Audiobook stuff</em></li>
                        <li><em>Audiobook stuff</em></li>
                        <li><em>Audiobook stuff</em></li>
                    </ul>

                    <h2>Audiobook-specific tools</h2>

                    Audiobook-specific tools are not supported yet 🥀🥀🥀
                </>
            )}

        </div>
    );
}