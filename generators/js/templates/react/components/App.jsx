var React = require('react');

var App = React.createClass({

    render: function()
    {
        /*jshint ignore:start */
        return (
            <div>
                { this.props.children }
            </div>
        );
        /*jshint ignore:end */
    }

});

module.exports = App;
