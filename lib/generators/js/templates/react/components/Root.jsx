import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Router,
    browserHistory,
    createMemoryHistory,
} from 'react-router';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';

import configureStore from '../store/configureStore';
import UrlGenerator from '../lib/UrlGenerator';

const DevTools = __DEV__ ? require('./DevTools').default : null;

const propTypes = {
    url: PropTypes.string,
    urlGenerator: PropTypes.instanceOf(UrlGenerator),
    routerRoutes: PropTypes.object,
    renderProps: PropTypes.object,
};

const defaultProps = {
    url: null,
    urlGenerator: null,
    renderProps: null,
    routerRoutes: null,
};

const childContextTypes = {
    urlGenerator: PropTypes.object,
    socket: PropTypes.object,
};

class Root extends Component {
    constructor(props) {
        super(props);

        const routerHistory = typeof window === 'undefined' ?
            createMemoryHistory({
                initialEntries: props.url !== null ? [props.url] : [],
            }) : browserHistory;

        this.store = configureStore({

        }, props.urlGenerator);

        this.history = syncHistoryWithStore(
            routerHistory,
            this.store,
        );
    }

    getChildContext() {
        return {
            urlGenerator: this.props.urlGenerator,
        };
    }

    render() {
        const { routerRoutes, renderProps } = this.props;

        const routerProps = typeof window === 'undefined' || renderProps !== null ? {
            ...renderProps,
        } : {
            history: this.history,
            routes: routerRoutes,
        };
        const router = (
            <Router
                {...routerProps}
            />
        );

        const root = __DEV__ ? (
            <Provider store={this.store}>
                <div>
                    { router }
                    <DevTools />
                </div>
            </Provider>
        ) : (
            <Provider store={this.store}>
                { router }
            </Provider>
        );

        if (__DEV__) {
            if (typeof __REACT_HOT_LOADER__ !== 'undefined') {
                // eslint-disable-next-line import/no-extraneous-dependencies, global-require
                const AppContainer = require('react-hot-loader').AppContainer;
                return React.createElement(AppContainer, {}, root);
            }
        }

        return root;
    }
}

Root.propTypes = propTypes;
Root.defaultProps = defaultProps;
Root.childContextTypes = childContextTypes;

export default Root;
