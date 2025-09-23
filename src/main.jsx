// copied from william feng

// $ npm install react-router-dom
import {createRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';

// will need to import "initialize app" ... for fire base

import App2 from './App2.jsx';
import './style.css';

createRoot(document.getElementById("root")).render (
    <BrowserRouter>
        <App2 />
    </BrowserRouter>
);