// for firebase
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

// for react
import { useState, useEffect } from 'react';

export default function App2() {

    // idea... add a home button? keep track of the selected files, nothing else

    // state for first "page"
    const [files, setFiles] = useState([]);
    const maxUploadSize = 15000000;
    const [playArray, setPlayArray] = useState([]); // this shouldn't change after being set... for now
    const[uploadStatus, setUploadStatus] = useState('idle');
    const [media, setMedia] = useState('song');

    // state for second "page"

    // summary items
    const[mostPlayedSong, setMostPlayedSong] = useState(''); // consider keeping track of the artist...? NAH
    const[numPlaysFMPS, setNumPlaysFMPS] = useState(0);
    const[mostPlayedArtist, setMostPlayedArtist] = useState('');
    const[numPlaysFMPA, setNumPlaysFMPA] = useState(0);
    const[percentageNotSkipped, setPercentageNotSkipped] = useState('');

    // settings
    const[excludeSkipped, setExcludeSkipped] = useState(false);
    const[caseInsensitive, setCaseInsensitive] = useState(false);
    const[startDate, setStartDate] = useState('2006-04-22');
    const[endDate, setEndDate] = useState('3025-09-23');

    // searches by title / artist
    const [searchSong, setSearchSong] = useState('');
    const [numPlaysFSS, setNumPlaysFSS] = useState(0);
    const [displaySS, setDisplaySS] = useState(false);
    const [searchArtist, setSearchArtist] = useState('');
    const [numPlaysFSA, setNumPlaysFSA] = useState(0);
    const [displaySA, setDisplaySA] = useState(false);

    // searches by number
    const [numTopSongs, setNumTopSongs] = useState(1);
    const [topSongs, setTopSongs] = useState([]);
    const [displayTS, setDisplayTS] = useState(false);
    const openMessageTS = "Hide your top " + parseInt(numTopSongs) + " song(s)";
    const closeMessageTS = "Show your top " + parseInt(numTopSongs) + " song(s)";
    const [numTopArtists, setNumTopArtists] = useState(1);
    const [topArtists, setTopArtists] = useState([]);
    const [displayTA, setDisplayTA] = useState(false);
    const openMessageTA = "Hide your top " + parseInt(numTopArtists) + " artist(s)";
    const closeMessageTA = "Show your top " + parseInt(numTopArtists) + " artist(s)";

    // this is so dumb but javascript sets are Useless!
    const titleArtistSeparator = "!@#$%^&*()";

    // useEffect stuff

    // reset state when settings are updated
    useEffect(() => {
        generateSummary();

        setDisplaySS(false);
        setDisplaySA(false);
        setDisplayTS(false);
        setDisplayTA(false);
        setTopSongs([]);
        setTopArtists([]);

    }, [excludeSkipped, caseInsensitive, startDate, endDate]);

    // search song
    useEffect(() => {
        setDisplaySS(false);
    }, [searchSong]);

    // search artist
    useEffect(() => {
        setDisplaySA(false);
    }, [searchArtist]);

    // num songs
    useEffect(() => {
        setDisplayTS(false);
        setTopSongs([]);
    }, [numTopSongs]);

    // num artists
    useEffect(() => {
        setDisplayTA(false);
        setTopArtists([]);
    }, [numTopArtists]);

    // FIXING BUGS
    // useEffect(() => {
    //     console.log(parseInt(numTopSongs));
    // }, [numTopSongs])

    // FIXING BUGS
    // useEffect(() => {
    //     console.log(parseInt(numTopArtists));
    // }, [numTopArtists])

    // handling file selection, from a video i watched: https://youtu.be/pWd6Enu2Pjs?si=dF47X75IcU0qA_1Y
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

    // letting the user remove files that they've selected
    function handleRemoveClick(index) {
        const revisedFiles = [];
        for (let i = 0; i < files.length; i++) {
            if (i !== index) {
                revisedFiles.push(files[i]);
            }
        }
        setFiles(revisedFiles);
    }
    
    // creating the "play array"! this sucked. i love async functions
    async function handleFileUpload() {
        setUploadStatus('uploading');
        for (let i = 0; i < files.length; i++) {
            const currPlayArray = await parseJsonFile(files[i]);

            if (currPlayArray === undefined) {
                return;
            }

            if (Array.isArray(currPlayArray)) {
                for (let j = 0; j < currPlayArray.length; j++) {
                    setPlayArray(playArray.push(currPlayArray[j]));
                }
            } else {
                setPlayArray(playArray.push(currPlayArray));
            }
        }

        // create a shallow copy of the current play array and uhhh yeah? sure? why tf did this work lmao
        let playArrayCopy = playArray.slice();
        setPlayArray(playArrayCopy);

        setUploadStatus('success');

        generateSummary();
    }

    // from stack overflow, i probably have it (the post) saved somewhere
    async function parseJsonFile(file) {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.onload = event => resolve(checkValidJSON(event.target.result));
            fileReader.onerror = error => reject(error);
            fileReader.readAsText(file);
        })
    }

    // checking if the JSON file is formatted correctly, there's an error message
    async function checkValidJSON(stringJSON) {
        try {
            return JSON.parse(stringJSON);
        } catch {
            setUploadStatus('formattingError');
        }
    }

    // when the second "page" loads
    // idea: add an "earliest play" and "most recent play" feature...
    function generateSummary() {
        findMostPlayedSong();
        findMostPlayedArtist();
        findPercentageNotSkipped();
    }

    // this algorithm is very clunky, it can probably be done with a single for-loop
    function findMostPlayedSong() {
        let songToNumPlays = new Map();
        for (let i = 0; i < playArray.length; i++) {
            let currSong = playArray[i].master_metadata_track_name;
            let reasonEnd = playArray[i].reason_end;
            if (!excludeSkipped || (excludeSkipped && reasonEnd === 'trackdone' && reasonEnd !== null)) {
                let ts = playArray[i].ts;
                if (ts > startDate && ts < endDate) {
                    if (!songToNumPlays.has(currSong)) {
                        songToNumPlays.set(currSong, 0);
                    }
                    let currNumPlays = songToNumPlays.get(currSong);
                    songToNumPlays.set(currSong, currNumPlays + 1);
                }
            }
        }

        let currMostPlayedSong = '';
        let currMostNumPlays = -1;

        for (const [song, numPlays] of songToNumPlays) {
            if (numPlays > currMostNumPlays) {
                currMostPlayedSong = song;
                currMostNumPlays = numPlays;
            }
        }

        // empty array
        if (currMostNumPlays === -1) {
            currMostPlayedSong = 'N/A';
            currMostNumPlays = 0;
        }

        setMostPlayedSong(currMostPlayedSong);
        setNumPlaysFMPS(currMostNumPlays);
    }

    // again, this algorithm is very clunky, it can probably be done with a single for-loop
    function findMostPlayedArtist() {
        let artistToNumPlays = new Map();

        for (let i = 0; i < playArray.length; i++) {
            let currArtist = playArray[i].master_metadata_album_artist_name;
            let reasonEnd = playArray[i].reason_end;
            if (!excludeSkipped || (excludeSkipped && reasonEnd === 'trackdone' && reasonEnd !== null)) {
                let ts = playArray[i].ts;
                if (ts > startDate && ts < endDate) {
                    if (!artistToNumPlays.has(currArtist)) {
                        artistToNumPlays.set(currArtist, 0);
                    }
                    let currNumPlays = artistToNumPlays.get(currArtist);
                    artistToNumPlays.set(currArtist, currNumPlays + 1);
                }
            }
        }

        let currMostPlayedArtist = '';
        let currMostNumPlays = -1;

        for (const [artist, numPlays] of artistToNumPlays) {
            if (numPlays > currMostNumPlays) {
                currMostPlayedArtist = artist;
                currMostNumPlays = numPlays;
            }
        }

        // empty array
        if (currMostNumPlays === -1) {
            currMostPlayedArtist = 'N/A';
            currMostNumPlays = 0;
        }

        setMostPlayedArtist(currMostPlayedArtist);
        setNumPlaysFMPA(currMostNumPlays);
    }

    // user search
    function findNumPlaysSong() {
        let numPlays = 0;

        for (let i = 0; i < playArray.length; i++) {
            let currSong = playArray[i].master_metadata_track_name;
            let reasonEnd = playArray[i].reason_end;
            if (!excludeSkipped || (excludeSkipped && reasonEnd === 'trackdone' && reasonEnd !== null)) {
                let ts = playArray[i].ts;
                if (ts > startDate && ts < endDate) {
                    // CHECK THAT THE SONG ISN'T NULL!!!
                    if (currSong === searchSong || (caseInsensitive && currSong !== null && currSong.toUpperCase() === searchSong.toUpperCase())) {
                        numPlays++;
                    }
                }
            }
        }

        setNumPlaysFSS(numPlays);
        setDisplaySS(true);
    }

    // user search
    function findNumPlaysArtist() {
        let numPlays = 0;

        for (let i = 0; i < playArray.length; i++) {
            let currArtist = playArray[i].master_metadata_album_artist_name;
            let reasonEnd = playArray[i].reason_end;
            if (!excludeSkipped || (excludeSkipped && reasonEnd === 'trackdone' && reasonEnd !== null)) {
                let ts = playArray[i].ts;
                if (ts > startDate && ts < endDate) {
                    // CHECK THAT THE ARTIST ISN'T NULL!!!
                    if (currArtist === searchArtist || (caseInsensitive && currArtist !== null && currArtist.toUpperCase() === searchArtist.toUpperCase())) {
                        numPlays++;
                    }
                }
            }
        }

        setNumPlaysFSA(numPlays);
        setDisplaySA(true);
    }

    // who cares brother
    function findPercentageNotSkipped() {
        let numNotSkipped = 0;
        let numTotal = 0;

        for (let i = 0; i < playArray.length; i++) {
            let ts = playArray[i].ts;
            if (ts > startDate && ts < endDate) {
                numTotal++;
                let reasonEnd = playArray[i].reason_end;
                if (reasonEnd === 'trackdone' && reasonEnd !== null) {
                    numNotSkipped++;
                }
            }
        }

        // avoid dividing by 0
        if (numTotal === 0) {
            numTotal = 1;       // 0 divided by 1 is 0 in my opinion
        }

        let percentage = 1.0 * (numNotSkipped / numTotal) * 100
        let roundedPercentage = Math.round((percentage + Number.EPSILON) * 100) / 100;  // thx stack overflow
        setPercentageNotSkipped(roundedPercentage);
    }

    // date stuff is weird
    function updateSettings() {
        setExcludeSkipped(document.getElementById('option1').checked);
        setCaseInsensitive(document.getElementById('option2').checked);
        if (document.getElementById('startDate').value !== '') {
            setStartDate(document.getElementById('startDate').value + '');
        }
        if (document.getElementById('endDate').value !== '') {
            setEndDate(document.getElementById('endDate').value + '');
        }
    }

    // helpful for user search (top _ songs)... always case-sensitive
    function findNumUniqueSongs() {
        let uniqueSongs = new Set();
        for (let i = 0; i < playArray.length; i++) {
            let currSongTitle = playArray[i].master_metadata_track_name;
            let currSongArtist = playArray[i].master_metadata_album_artist_name;
            if (currSongTitle !== null && currSongArtist != null) {
                let currSong = currSongTitle + titleArtistSeparator + currSongArtist;   // troll solution
                let reasonEnd = playArray[i].reason_end;
                if (!excludeSkipped || (excludeSkipped && reasonEnd === 'trackdone' && reasonEnd !== null)) {
                    let ts = playArray[i].ts;
                    if (ts > startDate && ts < endDate) {
                        uniqueSongs.add(currSong);
                    }
                }
            }    
        }

        return uniqueSongs.size;
    }

    // helpful for user search (top _ artists)... always case-sensitive
    function findNumUniqueArtists() {
        let uniqueArtists = new Set();
        for (let i = 0; i < playArray.length; i++) {
            let currSongArtist = playArray[i].master_metadata_album_artist_name;
            if (currSongArtist !== null) {
                let reasonEnd = playArray[i].reason_end;
                if (!excludeSkipped || (excludeSkipped && reasonEnd === 'trackdone' && reasonEnd !== null)) {
                    let ts = playArray[i].ts;
                    if (ts > startDate && ts < endDate) {
                        uniqueArtists.add(currSongArtist);
                    }
                }
            }
        }

        return uniqueArtists.size;
    }

    // cool
    function findTopNumSongs() {

        if (!isNaN(parseInt(numTopSongs))) {
             // step one: creating da map
            let songToNumPlays = new Map();
            for (let i = 0; i < playArray.length; i++) {
                let currSongTitle = playArray[i].master_metadata_track_name;
                let currSongArtist = playArray[i].master_metadata_album_artist_name;
                if (currSongTitle !== null && currSongArtist !== null) {
                    let currSong = currSongTitle + titleArtistSeparator + currSongArtist;   // lol...
                    let reasonEnd = playArray[i].reason_end;
                    if (!excludeSkipped || (excludeSkipped && reasonEnd === 'trackdone' && reasonEnd !== null)) {
                        let ts = playArray[i].ts;
                        if (ts > startDate && ts < endDate) {
                            if (!songToNumPlays.has(currSong)) {
                                songToNumPlays.set(currSong, 0);
                            }
                            let currNumPlays = songToNumPlays.get(currSong);
                            songToNumPlays.set(currSong, currNumPlays + 1);
                        }
                    }
                }
            }

            // step two: generating da list
            if (songToNumPlays.size !== 0) {
                let topSongs = [];
                let banishedSongs = new Set();
                let numLoops = Math.min(numTopSongs, findNumUniqueSongs())
                for (let i = 0; i < numLoops; i++) {
                    let currMostPlayedSong = null;
                    let currMostNumPlays = 0;
    
                    // iterate over map... a bit confusing
                    for (const [song, numPlays] of songToNumPlays) {
                        if (!banishedSongs.has(song) && numPlays > currMostNumPlays) {
                            currMostPlayedSong = song;
                            currMostNumPlays = numPlays;
                        }
                    }

                    // because of the aforementioned troll solution
                    let endTitleIndex = currMostPlayedSong.indexOf(titleArtistSeparator);
                    let startArtistIndex = endTitleIndex + titleArtistSeparator.length;
                    let title = currMostPlayedSong.substring(0, endTitleIndex);
                    let artist = currMostPlayedSong.substring(startArtistIndex, currMostPlayedSong.length);

                    topSongs.push([title, artist, currMostNumPlays]);
                    banishedSongs.add(currMostPlayedSong);
                }

                setTopSongs(topSongs);
                setDisplayTS(true);
            }
        }   // don't do anything otherwise...
    }

    // cool again, a bit simpler
    function findTopNumArtists() {

        if (!isNaN(parseInt(numTopArtists))) {
             // step one: creating da map
            let artistToNumPlays = new Map();
            for (let i = 0; i < playArray.length; i++) {
                let currArtist = playArray[i].master_metadata_album_artist_name;
                if (currArtist !== null) {
                    let reasonEnd = playArray[i].reason_end;
                    if (!excludeSkipped || (excludeSkipped && reasonEnd === 'trackdone' && reasonEnd !== null)) {
                        let ts = playArray[i].ts;
                        if (ts > startDate && ts < endDate) {
                            if (!artistToNumPlays.has(currArtist)) {
                                artistToNumPlays.set(currArtist, 0);
                            }
                            let currNumPlays = artistToNumPlays.get(currArtist);
                            artistToNumPlays.set(currArtist, currNumPlays + 1);
                        }
                    }
                }
            }

            // step two: generating da list
            if (artistToNumPlays.size !== 0) {
                let topArtists = [];
                let banishedArtists = new Set();
                let numLoops = Math.min(numTopArtists, findNumUniqueArtists())
                for (let i = 0; i < numLoops; i++) {
                    let currMostPlayedArtist = null;
                    let currMostNumPlays = 0;

                    // iterate over map...
                    for (const [artist, numPlays] of artistToNumPlays) {
                        if (!banishedArtists.has(artist) && numPlays > currMostNumPlays) {
                            currMostPlayedArtist = artist;
                            currMostNumPlays = numPlays;
                        }
                    }

                    topArtists.push([currMostPlayedArtist, currMostNumPlays]);
                    banishedArtists.add(currMostPlayedArtist);
                }

                setTopArtists(topArtists);
                setDisplayTA(true);
            }
        }   // don't do anything otherwise...
    }

    // // // // // // // // // // // // // // // // // // // // // // // // 

    // the HTML... don't use a body tag, worst mistake of my life
    return (
        <>
            {uploadStatus !== 'success' && (
                <>

                    {/* // // // BEFORE SUCCESS // // // */}

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
                                    <li className="step"><em>If you're using the desktop version of Spotify,</em> go to <span className="stepEmphasis">"Account"</span> (first, click on the circular icon displaying your profile picture in the top-right corner). Then, scroll down to the section titled <span className="stepEmphasis">Security and privacy</span> and go to <span className="stepEmphasis">"Account privacy"</span>.</li>
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

                            {/* if FILES is not empty... so, they've selected files */}
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

            {/* // // // AFTER SUCCESS // // // */}

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
                                    className="checkOrRadio" onChange={() => setMedia('song')}
                                    checked={media === 'song'}></input>
                                Analyze song listening history
                            </div>
                        </label>

                        <label for="podcast">
                            <div className={media === 'podcast' ? 'checkedDivMid' : 'radioDivMid'}>
                                <input type="radio" id="podcast" name="analyze" value="pCastListeningHistory" 
                                    className="checkOrRadio" onChange={() => setMedia('podcast')} 
                                    checked={media === 'podcast'}></input>
                                Analyze podcast listening history
                            </div>
                        </label>

                        <label for="audiobook">
                            <div className={media === 'audiobook' ? 'checkedDiv' : 'radioDiv'}>
                                <input type="radio" id="audiobook" name="analyze" value="aBookListeningHistory" 
                                    className="checkOrRadio" onChange={() => setMedia('audiobook')} 
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
                                <input type="checkbox" id="option1" name="option1" value="excludeSkippedPlays" className="checkOrRadio"></input>
                                <label for="option1" className="settingsLabel">Exclude skipped plays</label>
                            </div>

                            <div className="settingsDiv">
                                <input type="checkbox" id="option2" name="option2" value="caseInsensitive" className="checkOrRadio"></input>
                                <label for="option2" className="settingsLabel">Case-insensitive searches</label>
                            </div>

                            <div className="settingsDiv">
                                <label for="startDate" className="settingsLabel">Starting date: &nbsp; </label>
                                <input type="date" id="startDate" name="startDate" className="dateButton"></input>
                            </div>

                            <div className="settingsDiv">
                                <label for="endDate" className="settingsLabel">Ending date: &nbsp; </label>
                                <br></br>
                                <input type="date" id="endDate" name="endDate" className="dateButton"></input>
                            </div>

                            {/* too much work . . . */}
                            <div className="updateButtonDiv">
                                <button className="updateButton" onClick={() => updateSettings()}>
                                    Update Settings
                                </button>

                            </div>

                            {/* i think state is necessary BYE */}
                            {/* {(document.getElementById('option1') !== null && document.getElementById('option1').checked) && (
                                <p>STUFF!!!</p>
                            )} */}

                        </div>

                        {/* content */}
                        <div className="body"> 

                            <h2>Summary</h2>

                            {/* song analysis */}
                            {media === 'song' && (
                                <>
                                    <ul className="bodyList">
                                        <li>Your most-played song & how many plays: <span className="stepEmphasis">{mostPlayedSong}, {numPlaysFMPS} play(s)</span></li>
                                        <li>Your most-played artist & how many plays: <span className="stepEmphasis">{mostPlayedArtist}, {numPlaysFMPA} play(s)</span></li>
                                        <li>Percentage played until completion: <span className="stepEmphasis">{percentageNotSkipped}%</span></li>
                                    </ul>

                                    <h2>Song-specific tools</h2>

                                    <ul className="bodyList">
                                        <li>Find the number of plays for a song with a particular title: &nbsp; <input type="text" className="bodyInputString" value={searchSong} onChange={e => setSearchSong(e.target.value)}></input>
                                            <button className="searchGo" onClick={() => findNumPlaysSong()}>Search</button>
                                        </li>

                                        {displaySS && (
                                            <p className="youHavePlayed"><span className="stepEmphasis">You have played "{searchSong}" {numPlaysFSS} time(s).</span></p>
                                        )}

                                        <li>Displaying your top &nbsp; <input type="text" className="bodyInputInt" value={numTopSongs} onChange={e => setNumTopSongs(e.target.value)}></input> &nbsp; most played songs
                                            <button className="searchGo" onClick={() => findTopNumSongs()}>Display</button>
                                        </li>

                                        {/* RE-FORMAT */}
                                        {(isNaN(parseInt(numTopSongs)) || parseInt(numTopSongs) <= 0) &&  (
                                            <p className="integerMessage">Please input a positive integer.</p>
                                        )}

                                        {displayTS && parseInt(numTopSongs) !== 0 && (
                                            <>

                                                <details className="topDetails">
                                                    <summary data-open={openMessageTS} data-close={closeMessageTS}></summary>


                                                    {topSongs.map((topSong, index) => 
                                                        <p>
                                                            <span className="stepEmphasis">
                                                                #{index + 1}: {topSong[0]} by {topSong[1]} ({topSong[2]} plays)
                                                            </span>
                                                        </p>
                                                    )}

                                                </details>
                                            
                                            </>
                                        )}
                                        
                                    </ul>

                                    <h2>Artist-specific tools</h2>

                                    <ul className="bodyList">
                                        <li>Find the number of plays for songs with a particular artist: &nbsp; <input type="text" className="bodyInputString" value={searchArtist} onChange={e => setSearchArtist(e.target.value)}></input>
                                            <button className="searchGo" onClick={() => findNumPlaysArtist()}>Search</button>
                                        </li>

                                        {displaySA && (
                                            <p className="youHavePlayed"><span className="stepEmphasis">You have played songs by "{searchArtist}" {numPlaysFSA} time(s).</span></p>
                                        )}

                                        <li>Displaying your top &nbsp; <input type="text" className="bodyInputInt" value={numTopArtists} onChange={e => setNumTopArtists(e.target.value)}></input> &nbsp; most played artists
                                            <button className="searchGo" onClick={() => findTopNumArtists()}>Display</button>
                                        </li>

                                        {/* RE-FORMAT */}
                                        {(isNaN(parseInt(numTopArtists)) || parseInt(numTopArtists) <= 0) && (
                                            <p className="integerMessage">Please input a positive integer.</p>
                                        )}

                                        {/* parseInt(numTopArtists) !== 0 && */}

                                        {displayTA && parseInt(numTopArtists) !== 0 && (
                                            <>

                                                <details className="topDetails">
                                                    <summary data-open={openMessageTA} data-close={closeMessageTA}></summary>

                                                    {topArtists.map((topArtist, index) => 
                                                        <p>
                                                            <span className="stepEmphasis">
                                                                #{index + 1}: {topArtist[0]} ({topArtist[1]} plays)
                                                            </span>
                                                        </p>
                                                    )}

                                                </details>

                                            </>
                                        )}

                                    </ul>
                                </>
                            )}

                            {/* podcast analysis */}
                            {media === 'podcast' && (
                                <>
                                    <ul className="bodyList">
                                        <li><em>Podcast stuff Podcast stuff Podcast stuff</em></li>
                                        <li><em>Podcast stuff Podcast stuff Podcast stuff</em></li>
                                        <li><em>Podcast stuff Podcast stuff Podcast stuff</em></li>
                                    </ul>

                                    <h2>Podcast-specific tools</h2>

                                    Podcast-specific tools are not supported yet 🥀🥀🥀
                                </>
                            )}

                            {/* audiobook analysis */}
                            {media === 'audiobook' && (
                                <>
                                    <ul className="bodyList">
                                        <li><em>Audiobook stuff Audiobook stuff Audiobook stuff</em></li>
                                        <li><em>Audiobook stuff Audiobook stuff Audiobook stuff</em></li>
                                        <li><em>Audiobook stuff Audiobook stuff Audiobook stuff</em></li>
                                    </ul>

                                    <h2>Audiobook-specific tools</h2>

                                    Audiobook-specific tools are not supported yet 🥀🥀🥀
                                </>
                            )}

                        </div>
                    </div>

                    {/* file management stuff ??? hell nah */}

                    {/* footer... laws yes, again */}
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
        </>
    );
}