// copied from william feng
import {createRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router';

// will need to import "initialize app" ... for fire base

import App from './App.jsx';
import './style.css';

createRoot(document.getElementById("root")).render (
    <BrowserRouter>
        <App />
    </BrowserRouter>
);