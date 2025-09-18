import React from 'react';

// ehhh
import {FileButton} from './FileButton.jsx;';

export function FileUploadBar(props) {
    return (
        <div className="fileManagement">

            <h2>File Management</h2>

            <div className="fileButtonsBox"> 

                <label for="userFile">
                    <div className="uploadFileDiv">
                        Add another JSON file to the analysis pool
                        <input id="userFile" type="file" className="uploadFileButton"></input>
                    </div>
                </label>

                <button className="fileButton">Remove a JSON file from the analysis pool</button>

            </div>

        </div>
    );
}