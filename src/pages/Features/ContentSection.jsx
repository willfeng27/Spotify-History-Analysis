import React from 'react';

export function ContentSection(props) {
    return (
        <div className="body"> 

            {/* IDEA: split-up... summary, song tools, artist tools */}
            <h2>Summary</h2>

            <ul className="bodyList">
                <li>Your most-played song & how many plays: <em>Stuff</em></li>
                <li>Your most-played artist & how many artists: <em>Stuff</em></li>
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

        </div>
    );
}