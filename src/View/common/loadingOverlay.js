import React, { Component } from 'react';

import {
    Spinner
} from 'react-bootstrap';

export default () => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 1055,
            width: '100%',
            height: '100%',
            overflowX: 'hidden',
            overflowY: 'auto',
            outline: 0,
            backgroundColor: 'rgba(0,0,0,0.5)'
        }}>
            <div style={{
                maxWidth: '500px',
                margin: '1.75rem auto',
            }} className="text-center"><Spinner animation="grow" variant="danger" /></div>
        </div>
    );
}