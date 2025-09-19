// wtf is NAVLINK

import {useState} from 'react';

import {HeaderBar} from './HeaderBar.jsx';
import {MediaBar} from './MediaBar.jsx';
import {SettingsBar} from './SettingsBar.jsx';
import {ContentSection} from './ContentSection.jsx';
import {FileUploadBar} from './FileUploadBar.jsx';
import {FooterBar} from '../../components/FooterBar.jsx';

// this is a PARENT (for ContentSection and MediaBar... whatever)
export default function Features() {

    const [media, setMedia] = useState('song');

    function handleMediaChange(mediaFromChild) {
        setMedia(mediaFromChild);
    }

    return (
        <body className="features">

            {/* header bar */}
            <HeaderBar />

            {/* media bar */}
            <MediaBar media={media} handleMediaChange={handleMediaChange} />

            <div className="belowSettings">
                
                {/* settings bar */}
                <SettingsBar />

                {/* content section */}
                <ContentSection media={media} />

            </div>

            <div className="belowOptions">
                
                {/* errr file upload bar */}
                <FileUploadBar />

            </div>

            {/* the footer */}
            <FooterBar />
            
        </body>
    );
}