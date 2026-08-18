import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import FrontendMap from './FrontendMap';

// Find all map roots injected by the shortcode
const mapRoots = document.querySelectorAll('.mpd-frontend-root');

mapRoots.forEach(root => {
    const mapId = root.getAttribute('data-map-id');
    const reactRoot = ReactDOM.createRoot(root);
    
    reactRoot.render(
        <React.StrictMode>
            <FrontendMap mapId={mapId} />
        </React.StrictMode>
    );
});
