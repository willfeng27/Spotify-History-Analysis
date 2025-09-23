export function HeaderBar(props) {

    return (
        <div className="featuresHead">

            <div className="logo">
                <img src="img\logo1.png" alt="logo placeholder"></img>
            </div>

            <div className="titleAndHome"> 
                <h1 className="featuresHeadText">Spotify History Analysis Tools</h1>

                {/* TODO: set up an alert... if you press this button, you're going back to square one.*/}
                {/* ALTERNATIVELY, store state stuff in a parent component, so it's okay... i like this idea, work on it tomorrow */}
                <h4><a href='\'>Home Page</a></h4>
            </div>
            
        </div>
    );
}