import {Routes, Route} from 'react-router';

import Home from './pages/Home/Home.jsx';
import Features from './pages/Features/Features.jsx';

export default function App(props) {
    return (
        <Routes>

            <Route index element={<Home />} />
            
            <Route path='features' element={<Features />} />

        </Routes>
    );
}