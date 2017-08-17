import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const propTypes = {
    children: PropTypes.node.isRequired,
};

const App = (props) => {
    const { children } = props;
    return (
        <div>
            { children }
        </div>
    );
};

App.propTypes = propTypes;

const AppContainer = connect(state => ({
    test: state.test,
}))(App);

export default AppContainer;
