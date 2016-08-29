var Immutable = require('immutable');

var ActionTypes = require('../actions/ActionTypes');

var initialState = {
    'tested': false
};

var TestReducer = function(state, action)
{
    if(typeof(state) === 'undefined')
    {
        state = new Immutable.Map(initialState);
    }

    switch(action.type)
    {
        case ActionTypes.TEST_ACTION:
            return state.set('tested', true);
        default:
            return state;
    }
};

module.exports = TestReducer;
