var React = require('react');
var _ = require('lodash');
var connect = require('react-redux').connect;
var Home = require('../../components/pages/Home');

var HomeContainer = React.createClass({

    render: function()
    {
        /*jshint ignore:start */
        return (
            <Home
                {...this.props} />
        );
        /*jshint ignore:end */
    }

});

module.exports = connect(function(state)
{
    return {
        
    };
}, null, function(stateProps, dispatchProps, parentProps)
{
    return _.extend({}, parentProps, stateProps, dispatchProps);
})(HomeContainer);
