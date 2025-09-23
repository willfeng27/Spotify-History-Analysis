import { useState } from 'react';

export function SelectButton(props) {

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
                                Size: <span className="stepEmphasis">{(file.size / 1024).toFixed(2)} KB</span> &nbsp; &nbsp;

                                <button onClick={() => handleRemoveClick(index)}>Remove File</button>
                            </p>
                        ))
                        }  

                    </div>

                    {props.uploadStatus !== "uploading" && (

                        <button className="buttonUploadJSON" onClick={() => props.handleFileUpload(files)}>
                            <strong>Confirm & upload JSON files!</strong>
                        </button>
                    
                    )}

                    {props.uploadStatus === 'uploading' && (
                        <>
                            <p className="uploadStatus">
                                Uploading {files.length} file(s), please wait...
                            </p>
                            <p className="uploadStatus cyclePara">
                                <span id="cycle"></span>
                            </p>
                        </>
                    )}

                    {/* TODO: instead of displaying this message, just take them to the features page... do it */}
                    {props.uploadStatus === 'success' && (
                        <p className="uploadStatus">
                            {files.length} file(s) uploaded successfully! Redirecting...
                        </p>
                    )}

                    {props.uploadStatus === 'formattingError' && (
                        <p className="uploadStatus">
                            <span class="uploadFailed">Upload(s) failed, please ensure that your JSON files are formatted correctly.</span>
                        </p>
                    )}
                
                </>
            )}

        </div>

    );

}