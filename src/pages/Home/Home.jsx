import React from 'react';
import {FooterBar} from '../../components/FooterBar.jsx';
export default function Home() {
    return (
        <body className="features">
            {/* header */}
            <div className="firstBox">

                <h2>Spotify History Analysis</h2>

                <nav>
                    <div id="nav-links">
                        <a href="login.html" className="deadLink">Login</a> •
                        <a href="about.html" className="deadLink">About</a> •

                        {/* Okay, I don't think we need this final link... The user shouldn't have
                        access to the "features" page unless they have already uploaded a
                        JSON file... OR, we can alter the uhhh features page to display
                        something different if the user hasn't uploaded anything.
                        Whatever! */}

                        <a href="features.html" className="deadLink">Features</a>
                    </div>
                </nav>
            </div>

            <div className="instructionsBox">
                <h2><em>Welcome to Spotify History Analysis!</em></h2>
                <p>This website allows you to analyze your Spotify account's extended streaming history in the form of a JSON file.</p>
                <p>You can discover your most-played song, your top five artists over a particular period of time, and much more!</p>
                <p>To download your extended streaming history, take the following steps:</p>
                <details className="instructionDetails">
                    <summary data-open="Hide steps" data-close="Show steps"></summary>
                    <ul className="instructions">
                        <li className="step"><em>If you're using the desktop version of Spotify,</em> go to <span className="stepEmphasis">"Account"</span> (first, click on the circular icon displaying your profile picture in the top-right corner). Then, scroll down to the section titled <span classNameName="stepEmphasis">Security and privacy</span> and go to <span className="stepEmphasis">"Account privacy"</span>.</li>
                        <li className="step"><em>If you're using the Spotify app on a mobile device,</em> tap on your profile picture in the top-left corner, go to <span className="stepEmphasis">"Settings and privacy"</span>, go to <span className="stepEmphasis">"Privacy and social"</span>, then scroll down and tap <span className="stepEmphasis">"View more options on the Account Privacy page on the web"</span>.</li>
                        <li className="step"><em>No matter which device you're using,</em> now scroll down to the section titled <span className="stepEmphasis">"Download your data."</span> Note that the box for "Select Account data" is already checked off. Uncheck this box, and check off the box for <span className="stepEmphasis">"Select Extended streaming history"</span> instead.</li>
                        <li className="step">Scroll down and click/tap the <span className="stepEmphasis">"Request data"</span> button.</li>
                        <li className="step">You should have received a confirmation email from Spotify at the email address linked to your Spotify account. Open this email and click/tap the <span className="stepEmphasis">"confirm"</span> button.</li>
                        <li className="step">Wait up to 30 days to receive an email from Spotify containing your extended streaming history.</li>
                        <li className="step">Once you receive an email titled "Your extended streaming history is ready to download", open the email and click/tap the <span className="stepEmphasis">"download"</span> button. <em>Note that you must complete this step within 14 days of receiving the email.</em></li>
                        <li className="step">Unzip the downloaded (zipped) file and ensure that it contains one or more JSON files.</li>
                    </ul>
                </details>
                <p>Once you have completed these steps, upload your JSON file(s) below!</p>
            </div>

            <div className="containerUploadJSON">
                <label for="uploadJSON">
                    <div className="divUploadJSON">
                        <p>↑</p>
                        <p className="divUploadMid">Upload a JSON file</p>
                        <p>↑</p>
                        <input id="uploadJSON" type="file" className="buttonUploadJSON"></input>
                    </div>
                </label>
            </div>
            
            <FooterBar />
        </body>
    );
}