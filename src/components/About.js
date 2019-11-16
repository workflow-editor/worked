import React from 'react';

export default class About extends React.Component {
    render() {
        return (
            <div className='about'>
                <h1>workED</h1>
                <h2>A graphical workflow editor</h2>

                <p>For the best experience use Google Chrome / Chromium with at least FullHD resolution. Drag'n'drop is not supported on mobile version.</p>
                <br />
                <p>Documentation for developers and how to host the application can be found in the README file provided with this application.</p>

                <h3>Shortcuts</h3>
                <p>Select: MOUSE CLICK or SHIFT+MOUSE DRAG</p>
                <p>Select all: CTRL+SHIFT+A</p>
                <p>Deselect all: CTRL+SHIFT+D</p>
                <p>Copy selected nodes: CTRL+ALT+C</p>
                <p>Paste selected nodes: CTRL+ALT+V</p>
                <p>Delete selected nodes: CTRL+ALT+D</p>
            </div>
        )
    }
}
