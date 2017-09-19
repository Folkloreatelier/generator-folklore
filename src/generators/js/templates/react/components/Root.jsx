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
import createRoutes from '../routes';

const DevTools = __DEV__ ? require('./DevTools').default : null;

const propTypes = {
    url: PropTypes.string,
    urlGenerator: PropTypes.instanceOf(UrlGenerator),
    routerRoutes: PropTypes.object,
    renderProps: PropTypes.object,
    routes: PropTypes.object,
};

const defaultProps = {
    url: null,
    urlGenerator: null,
    renderProps: null,
    routerRoutes: null,
    routes: null,
};

const childContextTypes = {
    urlGenerator: PropTypes.object,
    socket: PropTypes.object,
};

class Root extends Component {
    constructor(props) {
        super(props);

        const urlGenerator = props.urlGenerator ?
            props.urlGenerator : new UrlGenerator(props.routes || null);
        const routes = props.routerRoutes ?
            props.routerRoutes : createRoutes(urlGenerator);

        const routerHistory = typeof window === 'undefined' ?
            createMemoryHistory({
                initialEntries: props.url !== null ? [props.url] : [],
            }) : browserHistory;

        const store = configureStore({

        }, urlGenerator);

        const history = syncHistoryWithStore(
            routerHistory,
            store,
        );

        this.state = {
            routerHistory,
            routes,
            urlGenerator,
            history,
            store,
            storeKey: `store-${(new Date()).getTime()}`,
            routerKey: `router-${(new Date()).getTime()}`,
        };
    }

    getChildContext() {
        return {
            urlGenerator: this.props.urlGenerator,
        };
    }

    componentWillReceiveProps(nextProps) {
        const newState = {};
        const routesChanged = (
            JSON.stringify(nextProps.routes) !== JSON.stringify(this.props.routes)
        );
        const routerRoutesChanged = nextProps.routerRoutes !== this.props.routerRoutes;
        const urlGeneratorChanged = nextProps.urlGenerator !== this.props.urlGenerator;
        if (routesChanged) {
            newState.urlGenerator = new UrlGenerator(nextProps.routes || null);
            newState.routes = nextProps.routerRoutes ? nextProps.routerRoutes : createRoutes(
                    newState.urlGenerator || this.state.urlGenerator,
            );
            newState.routerKey = `router-${(new Date()).getTime()}`;
        } else {
            if (urlGeneratorChanged) {
                newState.urlGenerator = nextProps.urlGenerator;
            }
            if (urlGeneratorChanged || routerRoutesChanged) {
                newState.routes = nextProps.routerRoutes ? nextProps.routerRoutes : createRoutes(
                        newState.urlGenerator || this.state.urlGenerator,
                );
                newState.routerKey = `router-${(new Date()).getTime()}`;
            }
        }
        if (typeof newState.urlGenerator !== 'undefined') {
            newState.storeKey = `store-${(new Date()).getTime()}`;
            newState.store = configureStore({

            }, newState.urlGenerator);
            newState.history = syncHistoryWithStore(
                this.state.routerHistory,
                this.state.store,
            );
        }
    }

    render() {
        const { renderProps } = this.props;
        const {
            routes,
            history,
            store,
            routerKey,
            storeKey,
        } = this.state;

        const routerProps = typeof window === 'undefined' || renderProps !== null ? {
            ...renderProps,
        } : {
            history,
            routes,
        };
        const router = (
            <Router
                key={routerKey}
                {...routerProps}
            />
        );

        const rootChildren = __DEV__ ? (
            <div>
                { router }
                <DevTools />
            </div>
        ) : router;

        const root = (
            <Provider store={store} key={storeKey}>
                { rootChildren }
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
