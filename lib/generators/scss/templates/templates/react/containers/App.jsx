import React from 'react';
import { connect } from 'react-redux';
import App from '../components/App';
import DevTools from './DevTools';

const AppContainer = (props) => {

    if (__DEV__) {
        return (
            <div>
                <App {...props} />
                <DevTools />
            </div>
        );
    }

    return (
        <App {...props} />
    );
};

export default connect(state => (
    {
        test: state.test,
    }
))(AppContainer);
