import React from 'react';
import { connect } from 'react-redux';

const HomePage = () => (
    <div>Accueil</div>
);

const HomePageContainer = connect(state => ({
    test: state.test,
}))(HomePage);

export default HomePageContainer;
