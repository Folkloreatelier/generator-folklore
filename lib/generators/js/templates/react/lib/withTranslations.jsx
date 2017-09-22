import React, { Component } from 'react';
import PropTypes from 'prop-types';
import invariant from 'invariant';
import hoistStatics from 'hoist-non-react-statics';
import Translations from './Translations';

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

const contextTypes = {
    translations: PropTypes.instanceOf(Translations),
};

export default function withTranslations(WrappedComponent, opts) {
    const options = {
        withRef: false,
        ...opts,
    };

    class WithTranslations extends Component {

        static getWrappedInstance() {
            invariant(
                options.withRef,
                'To access the wrapped instance, you need to specify `{ withRef: true }` as the second argument of the withTranslations() call.',
            );
            return this.wrappedInstance;
        }

        constructor(props) {
            super(props);
            this.getTranslation = this.getTranslation.bind(this);
        }

        getTranslation(...args) {
            const { translations } = this.context;
            return translations.get(...args);
        }

        render() {
            const {
                translations,
            } = this.context;

            if (translations === null) {
                return (
                    <WrappedComponent {...this.props} />
                );
            }

            const props = {
                ...this.props,
                translations,
                t: this.getTranslation,
            };

            if (options.withRef) {
                props.ref = (c) => {
                    this.wrappedInstance = c;
                };
            }

            return (
                <WrappedComponent {...props} />
            );
        }
    }

    WithTranslations.contextTypes = contextTypes;
    WithTranslations.displayName = `withTranslations(${getDisplayName(WrappedComponent)})`;
    WithTranslations.WrappedComponent = WrappedComponent;

    const WithTranslationsComponent = hoistStatics(WithTranslations, WrappedComponent);

    return WithTranslationsComponent;
}
