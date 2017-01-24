import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';

import reducers from '../reducers/index';

const reducer = combineReducers(reducers);
const router = routerMiddleware(browserHistory);
const enhancer = applyMiddleware(thunk, promise, router);

export default initialState => createStore(reducer, initialState, enhancer);
