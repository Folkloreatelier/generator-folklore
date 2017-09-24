import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Router,
    browserHistory,
    createMemoryHistory,
} from 'react-router';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import isEmpty from 'lodash/isEmpty';
import { compose } from 'recompose';

import configureStore from '../store/configureStore';
import UrlGenerator from '../lib/UrlGenerator';
import createUrlGeneratorContainer from '../lib/createUrlGeneratorContainer';
import createTranslationsContainer from '../lib/createTranslationsContainer';
import createRoutes from '../routes';

const DevTools = __DEV__ ? require('./DevTools').default : null;

const propTypes = {
    url: PropTypes.string,
    urlGenerator: PropTypes.instanceOf(UrlGenerator),
    renderProps: PropTypes.object,
    routerRoutes: PropTypes.object,
};

const defaultProps = {
    url: null,
    urlGenerator: null,
    renderProps: null,
    routerRoutes: null,
};

class Root extends Component {
    constructor(props) {
        super(props);

        const routes = props.routerRoutes ?
            props.routerRoutes : createRoutes(props.urlGenerator);

        const routerHistory = typeof window === 'undefined' ?
            createMemoryHistory({
                initialEntries: props.url !== null ? [props.url] : [],
            }) : browserHistory;

        const store = configureStore({

        }, props.urlGenerator);

        const history = syncHistoryWithStore(
            routerHistory,
            store,
        );

        this.state = {
            routerHistory,
            routes,
            history,
            store,
            storeKey: `store-${(new Date()).getTime()}`,
            routerKey: `router-${(new Date()).getTime()}`,
        };
    }

    componentWillReceiveProps(nextProps) {
        const newState = {};
        const routerRoutesChanged = nextProps.routerRoutes !== this.props.routerRoutes;
        const urlGeneratorChanged = nextProps.urlGenerator !== this.props.urlGenerator;
        if (routerRoutesChanged || urlGeneratorChanged) {
            newState.routes = nextProps.routerRoutes || createRoutes(nextProps.urlGenerator);
            newState.routerKey = `router-${(new Date()).getTime()}`;
        }

        // Update store and history if urlGenerator has changed
        if (urlGeneratorChanged) {
            newState.storeKey = `store-${(new Date()).getTime()}`;
            newState.store = configureStore({

            }, nextProps.urlGenerator);
            newState.history = syncHistoryWithStore(
                this.state.routerHistory,
                this.state.store,
            );
        }

        if (!isEmpty(newState)) {
            this.setState(newState);
        }
    }

    render() {
        const {
            renderProps,
        } = this.props;

        const {
            routes,
            history,
            store,
            routerKey,
            storeKey,
        } = this.state;

        const routerProps = typeof window === 'undefined' || renderProps !== null ? {
            ...renderProps,
            routes,
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
<% if (options['react-hot-reload']) { %>
        if (__DEV__) {
            if (typeof __REACT_HOT_LOADER__ !== 'undefined') {
                // eslint-disable-next-line import/no-extraneous-dependencies, global-require
                const AppContainer = require('react-hot-loader').AppContainer;
                return React.createElement(AppContainer, {}, root);
            }
        }<% } %>
        return root;
    }
}

Root.propTypes = propTypes;
Root.defaultProps = defaultProps;

const enhance = compose(
    createTranslationsContainer(),
    createUrlGeneratorContainer(),
);

export default enhance(Root);
