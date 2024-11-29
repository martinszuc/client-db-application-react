import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n/config';

const container = document.getElementById('root');

// Use createRoot instead of ReactDOM.render
const root = ReactDOM.createRoot(container!);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);