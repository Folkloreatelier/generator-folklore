import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';

var reducers = require('../reducers/index');

var reducer = combineReducers(reducers);
var router = routerMiddleware(browserHistory);
var enhancer = applyMiddleware(thunk, promise, router);

module.exports = function(initialState)
{
    return createStore(reducer, initialState, enhancer);
};
