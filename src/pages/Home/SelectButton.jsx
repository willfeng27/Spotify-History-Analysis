import React from 'react';
import { ChangeEvent, useState } from 'react';

import {UploadButton} from './UploadButton.jsx';

// i did... uhhh... npm install axios@0.24.0 in GITBASH
import axios from 'axios';

// ??? ts is not x
// const UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export function SelectButton(props) {

    const [files, setFiles] = useState([]);

    const [status, setStatus] = useState('idle');

    function handleFileChange(event) {
        if (event.target.files) {

            const chosenFiles = [];
            for (let i = 0; i < event.target.files.length; i++) {
                chosenFiles.push(event.target.files[i]);
            }
            setFiles(chosenFiles);

        }
    }

    // i am legally stupid
    function handleRemoveClick(index) {
        const revisedFiles = [];
        for (let i = 0; i < files.length; i++) {
            if (i !== index) {
                revisedFiles.push(files[i]);
            }
        }
        setFiles(revisedFiles);
    }

    // ngl this is confusing as hell i just watched a tutorial lol
    async function handleFileUpload() {
        if (files.length === 0) {
            return;
        }

        setStatus('uploading');

        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            const fileString = 'file' + (i + 1);
            formData.append(fileString, files[i]);
        }

        // placeholder backend... thanks
        try {
            await axios.post('https://httpbin.org/post', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setStatus('success');

        } catch {

            setStatus('error');

        }
    }

    return (

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

                        {
                        files.map((file, index) => (
                            <p>
                                <strong>• &nbsp; File #{index + 1}</strong>: &nbsp; &nbsp; &nbsp;
                                File name: <span className="stepEmphasis">{file.name}</span> | 
                                Size: <span className="stepEmphasis">{(file.size / 1024).toFixed(2)} KB</span>

                                 {/* no shit buddy boy  */}
                                {/* Type: <span className="stepEmphasis">{file.type}</span> */} &nbsp; &nbsp;

                                <button onClick={() => handleRemoveClick(index)}>Remove File</button>
                            </p>
                        ))
                        }  

                    </div>

                    {status !== "uploading" && (

                        <button className="buttonUploadJSON" onClick={() => handleFileUpload()}>
                            <strong>Confirm & upload JSON files!</strong>
                        </button>
                    
                    )}

                    {status === 'uploading' && (
                        <p>
                            I NEED TO PISS SO BAD!!!
                        </p>
                    )}

                    {/* TODO: instead of displaying this message, just take them to the features page... do it */}
                    {status === 'success' && (
                        <p>
                            {files.length} file(s) uploaded successfully!!!
                        </p>
                    )}

                    {status === 'error' && (
                        <p>
                            Upload failed!!! Try again, buddy boy.
                        </p>
                    )}
                
                </>
            )}

        </div>

    );

}