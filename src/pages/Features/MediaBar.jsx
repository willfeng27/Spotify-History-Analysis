export function MediaBar(props) {

    return (
        <div className="featureSettings">

                <label for="song">
                    <div className={props.media === 'song' ? 'checkedDiv' : 'radioDiv'}>
                        <input type="radio" id="song" name="analyze" value="songListeningHistory"
                            className="checkOrRadio" onChange={() => props.handleMediaChange('song')}
                            checked={props.media === 'song'}></input>
                        Analyze song listening history
                    </div>
                </label>

                <label for="podcast">
                    <div className={props.media === 'podcast' ? 'checkedDivMid' : 'radioDivMid'}>
                        <input type="radio" id="podcast" name="analyze" value="pCastListeningHistory" 
                            className="checkOrRadio" onChange={() => props.handleMediaChange('podcast')} 
                            checked={props.media === 'podcast'}></input>
                        Analyze podcast listening history
                    </div>
                </label>

                <label for="audiobook">
                    <div className={props.media === 'audiobook' ? 'checkedDiv' : 'radioDiv'}>
                        <input type="radio" id="audiobook" name="analyze" value="aBookListeningHistory" 
                            className="checkOrRadio" onChange={() => props.handleMediaChange('audiobook')} 
                            checked={props.media === 'audiobook'}></input>
                        Analyze audiobook listening history
                    </div>
                </label>

        </div>
    );
}