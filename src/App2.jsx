import { initializeApp } from 'firebase/app';
const firebaseConfig = {
  apiKey: "AIzaSyAdGd8Th7RDrbZS09PlvKUsMEUJuPsBA0o",
  authDomain: "spotify-analysis-history.firebaseapp.com",
  projectId: "spotify-analysis-history",
  storageBucket: "spotify-analysis-history.firebasestorage.app",
  messagingSenderId: "949348013861",
  appId: "1:949348013861:web:ef94ebdb40a90d9d69eccc",
  measurementId: "G-X73G2VNM3Q"
};
const app = initializeApp(firebaseConfig);

import { useState } from 'react';

export default function App2(props) {

    const [files, setFiles] = useState([]);
    const maxUploadSize = 15000000;

    // from a video i watched
    function handleFileChange(event) {
        if (event.target.files) {

            const chosenFiles = [];
            for (let i = 0; i < event.target.files.length; i++) {
                let currFile = event.target.files[i];
                if (currFile.size < maxUploadSize) {
                    chosenFiles.push(currFile);
                }
            }
            setFiles(chosenFiles);

        }
    }

    function handleRemoveClick(index) {
        const revisedFiles = [];
        for (let i = 0; i < files.length; i++) {
            if (i !== index) {
                revisedFiles.push(files[i]);
            }
        }
        setFiles(revisedFiles);
    }

    const [playArrayArray, setPlayArrayArray] = useState([]);
    const[uploadStatus, setUploadStatus] = useState('idle');
    
    async function handleFileUpload(fileArray) {

        console.log('handling file upload...');

        setUploadStatus('uploading');
        for (let i = 0; i < fileArray.length; i++) {
            const playArray = await parseJsonFile(fileArray[i]);
            if (playArray === undefined) {
                return;
            }
            setPlayArrayArray(playArrayArray.push(playArray));
        }

        console.log(playArrayArray);
        console.log(playArrayArray.length);

        setUploadStatus('success');
        // page changes now

        console.log(playArrayArray);
    }

    // de stack overflow
    async function parseJsonFile(file) {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.onload = event => resolve(checkValidJSON(event.target.result));
            fileReader.onerror = error => reject(error);
            fileReader.readAsText(file);
        })
    }

    async function checkValidJSON(stringJSON) {
        try {
            return JSON.parse(stringJSON);
        } catch {
            setUploadStatus('formattingError');
        }
    }

    const [media, setMedia] = useState('song');

    function setMediaTest(mediaType) {
        setMedia(mediaType);
        console.log(mediaType);
        console.log(playArrayArray);
    }

    return (
        <body className="features">
            {uploadStatus !== 'success' && (
                <>

                    {/* header */}
                    <div className="firstBox">
        
                        <h2>Spotify History Analysis</h2>

                    </div>
        
                    {/* instructions */}
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
                        <p>Once you have completed these steps, select and upload your JSON file(s) below!</p>

                        <div className="containerUploadJSON">

                            <label for="selectJSON">

                                <div className="divSelectJSON">

                                    <p className="divSelectMid">Select JSON files</p>

                                    <input id="selectJSON" type="file" className="buttonSelectJSON" onChange={handleFileChange} accept=".JSON" multiple></input>

                                </div>

                            </label>

                            {/* if FILES is not null... */}
                            {files.length !== 0 && (

                                <>
                                    <p className="selectedFilesTitle">Selected Files:</p>
                                    <div className="selectedFiles">
                                        {files.map((file, index) => (
                                            <p>
                                                <strong>• &nbsp; File #{index + 1}</strong>: &nbsp; &nbsp; &nbsp;
                                                File name: <span className="stepEmphasis">{file.name}</span> | 
                                                Size: <span className="stepEmphasis">{(file.size / 1024).toFixed(2)} KB</span> &nbsp; &nbsp;

                                                <button onClick={() => handleRemoveClick(index)}>Remove File</button>
                                            </p>
                                        ))}  
                                    </div>

                                    {uploadStatus !== "uploading" && (
                                        <button className="buttonUploadJSON" onClick={() => handleFileUpload(files)}>
                                            <strong>Confirm & upload JSON files!</strong>
                                        </button>
                                    )}

                                    {uploadStatus === 'uploading' && (
                                        <>
                                            <p className="uploadStatus">
                                                Uploading {files.length} file(s), please wait...
                                            </p>
                                            <p className="uploadStatus cyclePara">
                                                <span id="cycle"></span>
                                            </p>
                                        </>
                                    )}

                                    {uploadStatus === 'formattingError' && (
                                        <p className="uploadStatus">
                                            <span class="uploadFailed">Upload(s) failed, please ensure that your JSON files are formatted correctly.</span>
                                        </p>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
        
                    {/* footer... laws yes */}
                    <div>
                        <footer>
                            <em>
                                Website created by &nbsp;
                                <a href="https://github.com/willfeng27">Will Feng</a>
                                &nbsp; and &nbsp;
                                <a href="https://github.com/cjroper212">Cameron Roper</a>
                            </em>
                        </footer>
                    </div>

                </>
            )}

            {uploadStatus === 'success' && (

                <>
                    {/* header */}
                    <div className="featuresHead">
                        <div className="logo">
                            <img src="img\logo1.png" alt="logo placeholder"></img>
                        </div>
                        <div className="titleAndHome"> 
                            <h1 className="featuresHeadText">Spotify History Analysis Tools</h1>
                        </div>
                    </div>

                    {/* media type??? */}
                    <div className="featureSettings">
                        <label for="song">
                            <div className={media === 'song' ? 'checkedDiv' : 'radioDiv'}>
                                <input type="radio" id="song" name="analyze" value="songListeningHistory"
                                    className="checkOrRadio" onChange={() => setMediaTest('song')}
                                    checked={media === 'song'}></input>
                                Analyze song listening history
                            </div>
                        </label>
                        <label for="podcast">
                            <div className={media === 'podcast' ? 'checkedDivMid' : 'radioDivMid'}>
                                <input type="radio" id="podcast" name="analyze" value="pCastListeningHistory" 
                                    className="checkOrRadio" onChange={() => setMediaTest('podcast')} 
                                    checked={media === 'podcast'}></input>
                                Analyze podcast listening history
                            </div>
                        </label>
                        <label for="audiobook">
                            <div className={media === 'audiobook' ? 'checkedDiv' : 'radioDiv'}>
                                <input type="radio" id="audiobook" name="analyze" value="aBookListeningHistory" 
                                    className="checkOrRadio" onChange={() => setMediaTest('audiobook')} 
                                    checked={media === 'audiobook'}></input>
                                Analyze audiobook listening history
                            </div>
                        </label>
                    </div>

                    {/* stuff below the media bar */}
                    <div className="belowSettings">

                        {/* settings */}
                        <div className="options">
                            <h2 className="h2settings">Settings</h2>
                
                            <div className="settingsDiv">
                                <input type="checkbox" id="option1" name="option1" value="includeSkippedPlays" className="checkOrRadio"></input>
                                <label for="option1" className="settingsLabel">Include skipped plays</label>
                            </div>
                            <div className="settingsDiv">
                                <input type="checkbox" id="option2" name="option2" value="caseSensitive" className="checkOrRadio"></input>
                                <label for="option2" className="settingsLabel">Case-sensitive searches</label>
                            </div>
                            <div className="settingsDiv">
                                <label for="startDate" className="settingsLabel">Starting date:</label>
                                <input type="date" id="startDate" name="startDate" className="dateButton"></input>
                            </div>
                            <div className="settingsDiv">
                                <label for="endDate" className="settingsLabel">Ending date:</label>
                                <br></br>
                                <input type="date" id="endDate" name="endDate" className="dateButton"></input>
                            </div>
                            <div className="updateButtonDiv">
                                <button className="updateButton">
                                    Update Settings
                                </button>
                            </div>
                        </div>

                        {/* content */}
                        <div className="body"> 

                            <h2>Summary</h2>
                            {media === 'song' && (
                                <>
                                    <ul className="bodyList">
                                        <li>Your most-played song & how many plays: <em>{playArrayArray.length}</em></li>
                                        <li>Your most-played artist & how many artists: <em>{playArrayArray + 100}</em></li>
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
                            {media === 'podcast' && (
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
                            {media === 'audiobook' && (
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
                    </div>

                    {/* file management stuff ??? */}

                    {/* footer... laws yes */}
                    <div>
                        <footer>
                            <em>
                                Website created by &nbsp;
                                <a href="https://github.com/willfeng27">Will Feng</a>
                                &nbsp; and &nbsp;
                                <a href="https://github.com/cjroper212">Cameron Roper</a>
                            </em>
                        </footer>
                    </div>
                </>
            )}
            
        </body>
    );
}
