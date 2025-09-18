// import "navlink" at some point...

import React from 'react';

import {HeaderBar} from 'HeaderBar.jsx';
import {MediaBar} from 'MediaBar.jsx';
import {SettingsBar} from 'SettingsBar.jsx';
import {ContentSection} from 'ContentSection.jsx';
import {FileUploadBar} from 'FileUploadBar.jsx';
import {FooterBar} from '../../components/FooterBar.jsx';

export default function Features() {
    return (
        <body className="features">

            {/* header bar */}
            <HeaderBar />

            {/* media bar */}
            <MediaBar />

            <div className="belowSettings">
                
                {/* settings bar */}
                <SettingsBar />

                {/* content section */}
                <ContentSection />

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