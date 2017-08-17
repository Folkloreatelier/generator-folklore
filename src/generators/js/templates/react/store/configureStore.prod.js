import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';

import reducers from '../reducers/index';
import withUrlGeneratorMiddleware from './withUrlGeneratorMiddleware';

export default (initialState, urlGenerator) => {
    const reducer = combineReducers(reducers);
    const router = routerMiddleware(browserHistory);
    const withUrlGenerator = withUrlGeneratorMiddleware(urlGenerator);
    const enhancer = applyMiddleware(withUrlGenerator, thunk, promise, router);
    return createStore(reducer, initialState, enhancer);
};
