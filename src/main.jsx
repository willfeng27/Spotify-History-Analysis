// a special thank you to William Feng

// $ npm install react-router-dom ... i guess
import {createRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';

// initialize app for firebase?

import App2 from './App2.jsx';
import './style.css';

createRoot(document.getElementById("root")).render (
    <BrowserRouter>
        <App2 />
    </BrowserRouter>
);