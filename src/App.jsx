// COPIED FROM FIREBASE TUTORIAL

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAdGd8Th7RDrbZS09PlvKUsMEUJuPsBA0o",
  authDomain: "spotify-analysis-history.firebaseapp.com",
  projectId: "spotify-analysis-history",
  storageBucket: "spotify-analysis-history.firebasestorage.app",
  messagingSenderId: "949348013861",
  appId: "1:949348013861:web:ef94ebdb40a90d9d69eccc",
  measurementId: "G-X73G2VNM3Q"
};

// initialize firebase
const app = initializeApp(firebaseConfig);

import {Route, Routes, useNavigate} from 'react-router-dom';

import Home from './pages/Home/Home.jsx';
import Features from './pages/Features/Features.jsx';

// PARENTING vvv
import { useState } from 'react';

export default function App(props) {
    const [playArrayArray, setPlayArrayArray] = useState([]);

    // remember to set this to idle when the features page is loaded
    const [uploadStatus, setUploadStatus] = useState('idle');

    // bruh?
    const navigate = useNavigate();

    async function handleFileUpload(fileArrayFromChild) {

        console.log('handling file upload...');

        setUploadStatus('uploading');

        for (let i = 0; i < fileArrayFromChild.length; i++) {
            const playArray = await parseJsonFile(fileArrayFromChild[i]);

            console.log(playArray);

            if (playArray === undefined) {
                return;
            }

            setPlayArrayArray(playArrayArray.push(playArray));
        }

        setUploadStatus('success');

        console.log(playArrayArray);

        // redirect
        navigate('features', {state: {playArrayArray: playArrayArray}});
    }

    // huge thanks to stack overflow for this
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

    // PARENTING ^^^

    return (
        <Routes>

            <Route index element={<Home playArrayArray={playArrayArray} setPlayArrayArray={setPlayArrayArray}
                uploadStatus={uploadStatus} setUploadStatus={setUploadStatus} handleFileUpload={handleFileUpload}/>} />
            
            <Route path='features' element={<Features playArrayArray={playArrayArray} setPlayArrayArray={setPlayArrayArray} 
                uploadStatus={uploadStatus} setUploadStatus={setUploadStatus}/>} />

        </Routes>
    );
}