import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import { persistState } from 'redux-devtools';

import DevTools from '../containers/DevTools';
const reducers = require('../reducers/index');

const reducer = combineReducers(reducers);
const router = routerMiddleware(browserHistory);
const logger = createLogger();

const enhancer = compose(
    applyMiddleware(thunk, promise, router/*, logger*/),
    DevTools.instrument(),
    persistState(
        window.location.href.match(
            /[?&]debug_session=([^&#]+)\b/
        )
    )
);

module.exports = function(initialState)
{
    return createStore(reducer, initialState, enhancer);
};
