import {applyMiddleware, compose, createStore} from 'redux';
import createLogger from 'redux-logger';
import {reducer} from './reducer';

const logger = createLogger({
    level: 'info',
    collapsed: true
});

const middleware = applyMiddleware(logger);

export default createStore(
    reducer,
    compose(
        middleware,
        process.env.NODE_ENV !== 'production' &&
        window.devToolsExtension ? window.devToolsExtension() : f => f
    ));
