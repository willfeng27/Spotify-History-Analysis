import {UpdateSettings} from './UpdateSettings.jsx';

export function SettingsBar(props) {
    return (
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

            {/* UpdateSettings */}
            <UpdateSettings />

        </div>
    );
}