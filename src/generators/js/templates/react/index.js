import React from 'react';
import ReactDOM from 'react-dom';<%
if(react_features.indexOf('relay') !== -1) { %>
import Relay from 'react-relay';
<% } %>
import domready from 'domready';
import { match } from 'react-router';
import { load as loadHypernova } from 'hypernova';
<% if (!options['react-hot-reload']) { %>import createRoutes from './routes';
import HypernovaComponents from './hypernova';
<% } %>
import UrlGenerator from './lib/UrlGenerator';
<% if(react_features.indexOf('relay') !== -1) {
%>/* global __DEV__ */
/* eslint global-require:0 */
if (__DEV__) {
    const SuperagentNetworkLayer = require('./lib/SuperagentNetworkLayer').default;
    Relay.injectNetworkLayer(new SuperagentNetworkLayer('/graphql'));
}<%
} %>
const FastClick = require('fastclick');
<% if (options['react-hot-reload']) { %>let createRoutes = require('./routes').default;
let HypernovaComponents = require('./hypernova').default;
<% } %>
domready(() => {
    const findComponent = name => HypernovaComponents[name] || null;

    const renderReact = (el, componentName, props) => {
        const Component = findComponent(componentName);
        if (Component === null) {
            console.warn(`Component ${componentName} not found.`);
            return;
        }
        <%
        if (options['react-hot-reload']) { %>
        let element = React.createElement(Component, props);

        if (__DEV__) {
            if (typeof __REACT_HOT_LOADER__ !== 'undefined') {
                // eslint-disable-next-line import/no-extraneous-dependencies, global-require
                const AppContainer = require('react-hot-loader').AppContainer;
                element = React.createElement(AppContainer, {}, element);
            }
        }<% } else { %>
        const element = React.createElement(Component, props);<% } %>

        ReactDOM.render(element, el);
    };

    const createRenderReact = (...args) => () => renderReact(...args);

    const renderHypernovaElements = (elements) => {
        elements.forEach((el) => {
            const componentName = el.dataset ? el.dataset.hypernovaKey : el.getAttribute('data-hypernova-key');
            const nodes = loadHypernova(componentName);
            nodes.forEach(({ node, data }) => {
                const props = {
                    ...data,
                };
                if (typeof window === 'undefined' && typeof props.url !== 'undefined') {
                    const urlGenerator = new UrlGenerator(data.routes || null);
                    const routes = createRoutes(urlGenerator);
                    match({
                        routes,
                        location: data.url,
                    }, createRenderReact(node, componentName, {
                        ...props,
                        routerRoutes: routes,
                        urlGenerator,
                    }));
                } else {
                    renderReact(node, componentName, props);
                }
            });
        });
    };

    FastClick.attach(document.body);

    const hypernovaElements = document.querySelectorAll('div[data-hypernova-key]');
    renderHypernovaElements(hypernovaElements);<%
    if (options['react-hot-reload']) { %>
    if (__DEV__) {
        // Hot reloading
        if (module.hot) {
            module.hot.accept([
                './hypernova',
                './routes',
            ], () => {
                createRoutes = require('./routes').default; // eslint-disable-line global-require
                HypernovaComponents = require('./hypernova').default; // eslint-disable-line global-require
                renderHypernovaElements(hypernovaElements);
            });
        }
    }<% } %>
});
