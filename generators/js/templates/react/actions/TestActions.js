var ActionTypes = require('./ActionTypes');

var TestActions = {

    testAction: function()
    {
        return {
            type: ActionTypes.TEST_ACTION
        };
    }

};

module.exports = TestActions;
