import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux';
import { compose } from 'recompose';

import configureStore from '../store/configureStore';
import createStoreContainer from '../lib/createStoreContainer';
import createRouterContainer from '../lib/createRouterContainer';
import createUrlGeneratorContainer from '../lib/createUrlGeneratorContainer';
import createTranslationsContainer from '../lib/createTranslationsContainer';
import withUrlGeneratorMiddleware from '../lib/withUrlGeneratorMiddleware';
import createRoutes from '../routes';

const DevTools = __DEV__ ? require('./DevTools').default : null;

const propTypes = {
    store: PropTypes.object.isRequired,
    router: PropTypes.node.isRequired,
    history: PropTypes.object.isRequired,
};

const defaultProps = {

};

class Root extends Component {
    constructor(props) {
        super(props);

        this.state = {
            history: props.history && props.store ? syncHistoryWithStore(
                props.history,
                props.store,
            ) : null,
        };
    }

    componentWillReceiveProps(nextProps) {
        const historyChanged = nextProps.history !== this.props.history;
        const storeChanged = nextProps.store !== this.props.store;
        if (historyChanged || storeChanged) {
            this.setState({
                history: nextProps.history && nextProps.store ? syncHistoryWithStore(
                    nextProps.history,
                    nextProps.store,
                ) : null,
            });
        }
    }

    render() {
        const {
            router,
        } = this.props;

        const {
            history,
        } = this.state;

        const routerWithHistory = history !== null ? React.cloneElement(router, {
            history,
        }) : router;

        const root = __DEV__ ? (
            <div>
                { routerWithHistory }
                <DevTools />
            </div>
        ) : routerWithHistory;

        return root;
    }
}

Root.propTypes = propTypes;
Root.defaultProps = defaultProps;

// Creating routes
const selectRoutes = props => (
    props.routerRoutes ?
        props.routerRoutes : createRoutes(props.urlGenerator)
);

// Creating store from props
const createStore = props => configureStore({
    // map props to state
}, [
    routerMiddleware(props.history),
    withUrlGeneratorMiddleware(props.urlGenerator),
]);

// Create rootEnhancer
const rootEnhancer = compose(
    createTranslationsContainer(),
    createUrlGeneratorContainer(),
    createRouterContainer(selectRoutes),
    createStoreContainer(createStore),
);

export default rootEnhancer(Root);
