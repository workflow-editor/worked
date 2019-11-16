import React from 'react';

export default class Info extends React.Component {

    // because of this:
    // https://github.com/facebookincubator/create-react-app/tree/master/packages/react-scripts/template#adding-images-fonts-and-files
    render() {
        return (
            <div className='info'>
                <svg viewBox="0 0 200 200" version="1.1">
                    <circle cx="100" cy="100" r="85" fill="none" strokeWidth="15"/>
                    <circle cx="100" cy="50" r="10"/>
                    <line x1="100" y1="80" x2="100" y2="150" strokeWidth="15" strokeLinecap="round"/>
                </svg>
            </div>
        );
    }
}
