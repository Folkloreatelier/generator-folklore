var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');
var attachFastClick = require('fastclick');
import { syncHistoryWithStore } from 'react-router-redux';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';

import configureStore from './store/configureStore';
import routes from './routes';

const store = configureStore();

$(function()
{
    if(!$('#app').length)
    {
        return;
    }
    
    var history = syncHistoryWithStore(browserHistory, store);
    var router = React.createElement(Router, {
        history: history,
        routes: routes
    });
    var provider = React.createElement(Provider, {
        store: store
    }, router);
    ReactDOM.render(provider, $('#app')[0]);
    
    if(Modernizr.touchevents)
    {
        attachFastClick(document.body);
    }
});
