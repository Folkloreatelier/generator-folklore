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
        ReactDOM.render(React.createElement(Component, props), el);
    };

    const createRenderReact = (...args) => () => renderReact(...args);

    const renderHypernovaElements = (elements) => {
        elements.forEach((el) => {
            const componentName = el.dataset ? el.dataset.hypernovaKey : el.getAttribute('data-hypernova-key');
            const nodes = loadHypernova(componentName);
            nodes.forEach(({ node, data }) => {
                const urlGenerator = new UrlGenerator(data.routes || null);
                const routes = createRoutes(urlGenerator);
                const props = {
                    routerRoutes: routes,
                    urlGenerator,
                    ...data,
                };
                if (typeof props.url !== 'undefined') {
                    match({
                        routes,
                        location: data.url,
                    }, createRenderReact(node, componentName, props));
                } else {
                    renderReact(node, componentName, props);
                }
            });
        });
    };

    FastClick.attach(document.body);

    const hypernovaElements = document.querySelectorAll('div[data-hypernova-key]');
    renderHypernovaElements(hypernovaElements);

    <% if (options['react-hot-reload']) { %>if (__DEV__) {
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
