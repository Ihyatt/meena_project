import React from 'react';
import 'src/assets/css/Loading.css';

function Loading() {
    return (
        <div className="loading-overlay">
            <div className="spinner"></div>
        </div>
    );
}

export default Loading;