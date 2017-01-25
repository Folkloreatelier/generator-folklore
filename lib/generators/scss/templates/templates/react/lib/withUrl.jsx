import React, { Component } from 'react';
import invariant from 'invariant';
import hoistStatics from 'hoist-non-react-statics';
import { connect } from 'react-redux';
import URL from './url';

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

const propTypes = {
    routes: React.PropTypes.shape({
        toJS: React.PropTypes.func,
    }).isRequired,
};

export default function withUrl(WrappedComponent, options) {
    const withRef = options && options.withRef;

    class WithUrl extends Component {

        static getWrappedInstance() {
            invariant(
                withRef,
                'To access the wrapped instance, you need to specify `{ withRef: true }` as the second argument of the withUrl() call.',
            );

            return this.wrappedInstance;
        }

        constructor(props) {
            super(props);
            this.state = {
                url: new URL(props.routes.toJS()),
            };
        }

        componentWillReceiveProps(nextProps) {
            if (this.props.routes !== nextProps.routes) {
                this.setState({
                    url: new URL(nextProps.routes.toJS()),
                });
            }
        }

        render() {
            const url = this.state.url;
            if (!url) {
                return (
                    <WrappedComponent {...this.props} />
                );
            }

            const { routes, dispatch, ...otherProps } = this.props;
            const props = { ...otherProps, url };

            if (withRef) {
                props.ref = (c) => {
                    this.wrappedInstance = c;
                };
            }

            return (
                <WrappedComponent {...props} />
            );
        }
    }

    WithUrl.propTypes = propTypes;
    WithUrl.displayName = `withUrl(${getDisplayName(WrappedComponent)})`;
    WithUrl.WrappedComponent = WrappedComponent;

    const WithUrlComponent = hoistStatics(WithUrl, WrappedComponent);

    return connect(state => ({
        routes: state.routes,
    }))(WithUrlComponent);
}
