import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import { persistState } from 'redux-devtools';

import DevTools from '../components/DevTools';
import reducers from '../reducers/index';
import withUrlGeneratorMiddleware from './withUrlGeneratorMiddleware';

export default (initialState, urlGenerator) => {
    const reducer = combineReducers(reducers);
    const router = routerMiddleware(browserHistory);
    const withUrlGenerator = withUrlGeneratorMiddleware(urlGenerator);

    const sessionId = typeof window !== 'undefined' ? window.location.href.match(/[?&]debug_session=([^&#]+)\b/) : null;

    const enhancer = compose(
        applyMiddleware(withUrlGenerator, thunk, promise, router),
        DevTools.instrument(),
        persistState(sessionId),
    );
    return createStore(reducer, initialState, enhancer);
};
