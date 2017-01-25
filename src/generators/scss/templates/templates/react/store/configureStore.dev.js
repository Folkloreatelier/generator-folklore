import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import { persistState } from 'redux-devtools';
import DevTools from '../containers/DevTools';
import reducers from '../reducers/index';

const reducer = combineReducers(reducers);
const router = routerMiddleware(browserHistory);

const sessionId = typeof window !== 'undefined' ? window.location.href.match(/[?&]debug_session=([^&#]+)\b/) : null;

const enhancer = compose(
    applyMiddleware(thunk, promise, router),
    DevTools.instrument(),
    persistState(sessionId),
);

export default initialState => createStore(reducer, initialState, enhancer);
