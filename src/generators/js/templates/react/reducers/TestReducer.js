import Immutable from 'immutable';
import {
    TEST_ACTION,
} from '../actions/TestActions';

const initialState = {
    tested: false,
};

const TestReducer = (previousState, action) => {
    const state = previousState || initialState;

    switch (action.type) {
    case TEST_ACTION:
        return state.set('tested', true);
    default:
        return state;
    }
};

export default TestReducer;
