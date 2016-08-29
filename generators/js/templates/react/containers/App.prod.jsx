var React = require('react');
var _ = require('lodash');
var connect = require('react-redux').connect;
var App = require('../components/App');
import DevTools from './DevTools';

var AppContainer = React.createClass({

    render: function()
    {
        /*jshint ignore:start */
        return (
            <App {...this.props}/>
        );
        /*jshint ignore:end */
    }

});

module.exports = connect(function(state)
{
    return {
        test: state.test
    };
}, null, function(stateProps, dispatchProps, parentProps)
{
    return _.extend({}, parentProps, stateProps, dispatchProps);
})(AppContainer);
