import React from 'react';
import PropTypes from 'prop-types';

import Container from './Container';

const propTypes = {

};

const defaultProps = {

};

const App = ({
    ...otherProps
}) => (
    <Container
        {...otherProps}
        getStoreInitialState={() => ({

        })}
    />
);

App.propTypes = propTypes;
App.defaultProps = defaultProps;

export default App;
