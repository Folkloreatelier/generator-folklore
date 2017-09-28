import React from 'react';
import PropTypes from 'prop-types';

import '../styles/main.global.scss';

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

export default App;
