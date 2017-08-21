import React, { Component } from 'react';
import PropTypes from 'prop-types';
import invariant from 'invariant';
import hoistStatics from 'hoist-non-react-statics';

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

const contextTypes = {
    urlGenerator: PropTypes.object,
};

export default function withUrlGenerator(WrappedComponent, options) {
    const withRef = options && options.withRef;

    class WithUrlGenerator extends Component {

        static getWrappedInstance() {
            invariant(
                withRef,
                'To access the wrapped instance, you need to specify `{ withRef: true }` as the second argument of the withUrlGenerator() call.',
            );
            return this.wrappedInstance;
        }

        render() {
            const {
                urlGenerator,
            } = this.context;

            if (urlGenerator === null) {
                return (
                    <WrappedComponent {...this.props} />
                );
            }

            const props = {
                ...this.props,
                urlGenerator,
            };

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

    WithUrlGenerator.contextTypes = contextTypes;
    WithUrlGenerator.displayName = `withUrlGenerator(${getDisplayName(WrappedComponent)})`;
    WithUrlGenerator.WrappedComponent = WrappedComponent;

    const WithUrlGeneratorComponent = hoistStatics(WithUrlGenerator, WrappedComponent);

    return WithUrlGeneratorComponent;
}
