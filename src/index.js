import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import store from './redux/store';
import App from './App'
import { Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'

export const alertOptions = {
    position: 'bottom center',
    timeout: 5000,
    offset: '30px',
    transition: 'fade'
};

window.onload = () => {
    const rootEl = document.getElementById('root');

    ReactDOM.render(
        <Provider store={store}>
            <AlertProvider template={AlertTemplate} {...alertOptions}>
                <App/>
            </AlertProvider>
        </Provider>,
        rootEl
    );
};
