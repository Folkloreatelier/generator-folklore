import React, { Component } from 'react';
import {
    Router,
    browserHistory,
    createMemoryHistory,
    applyRouterMiddleware,
} from 'react-router';
import { useScroll } from 'react-router-scroll';
import { Provider } from 'react-redux';
import Immutable from 'immutable';
import { syncHistoryWithStore } from 'react-router-redux';
import configureStore from '../store/configureStore';
import DevTools from './DevTools';

const propTypes = {
    url: React.PropTypes.string.isRequired,
    routerRoutes: React.PropTypes.object,
    renderProps: React.PropTypes.object,
};

const defaultProps = {
    bubble: null,
    renderProps: null,
    routerRoutes: null,
};

class Root extends Component {
    constructor(props) {
        super(props);

        const routerHistory = typeof window === 'undefined' ?
            createMemoryHistory({
                initialEntries: [props.url],
            }) : browserHistory;

        const store = configureStore({

        });

        const history = syncHistoryWithStore(
            routerHistory,
            store,
        );

        this.state = {
            store,
            history,
        };
    }

    render() {
        const { store, history } = this.state;
        const { routerRoutes, renderProps } = this.props;
        const routerProps = {
            render: applyRouterMiddleware(useScroll()),
        };
        let router;
        if (typeof window === 'undefined' && renderProps) {
            router = (
                <Router
                    {...renderProps}
                    {...routerProps}
                />
            );
        } else {
            router = (
                <Router
                    history={history}
                    routes={routerRoutes}
                    {...routerProps}
                />
            );
        }

        if (__DEV__) {
            return (
                <Provider store={store}>
                    <div>
                        { router }
                        <DevTools />
                    </div>
                </Provider>
            );
        }

        return (
            <Provider store={store}>
                { router }
            </Provider>
        );
    }
}

Root.propTypes = propTypes;
Root.defaultProps = defaultProps;

module.exports = Root;
