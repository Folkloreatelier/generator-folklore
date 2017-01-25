import React from 'react';
import { connect } from 'react-redux';
import Home from '../../components/pages/Home';

const HomeContainer = (props) => {
    return (
        <Home {...props} />
    );
};

export default connect(state => (
    {
        test: state.test,
    }
))(HomeContainer);
