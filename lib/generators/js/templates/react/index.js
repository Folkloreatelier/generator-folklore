import React from 'react';
import ReactDOM from 'react-dom';<%
if(react_features.indexOf('relay') !== -1) { %>
import Relay from 'react-relay';
<% } %>
import domready from 'domready';
import { match } from 'react-router';
import { load as loadHypernova } from 'hypernova';
import HypernovaComponents from './hypernova';

import createRoutes from './routes';
<% if(react_features.indexOf('relay') !== -1) {
%>/* global __DEV__ */
/* eslint global-require:0 */
if (__DEV__) {
    const SuperagentNetworkLayer = require('./lib/SuperagentNetworkLayer').default;
    Relay.injectNetworkLayer(new SuperagentNetworkLayer('/graphql'));
}<%
} %>

const FastClick = require('fastclick');

domready(() => {
    function findComponent(name) {
        return HypernovaComponents[name] || null;
    }

    function renderReact(el, componentName, props) {
        const Component = findComponent(componentName);
        if (!Component) {
            console.warn(`Component ${componentName} not found.`);
            return;
        }
        ReactDOM.render(React.createElement(Component, props), el);
    }

    function createRenderReact(node, componentName, props) {
        return () => {
            renderReact(node, componentName, props);
        };
    }

    // Render the hypernova elements
    const elements = document.querySelectorAll('div[data-hypernova-key]');
    let el;
    let componentName;
    let nodes;
    let node;
    let props;
    let routes;
    for (let i = 0, elementsCount = elements.length; i < elementsCount; i += 1) {
        el = elements[i];
        componentName = el.dataset ? el.dataset.hypernovaKey : el.getAttribute('data-hypernova-key');
        nodes = loadHypernova(componentName);
        for (let ii = 0, nodesCount = nodes.length; ii < nodesCount; ii += 1) {
            node = nodes[ii].node;
            props = nodes[ii].data;
            if (props.url) {
                routes = createRoutes(props.routes || null);
                match({
                    routes,
                    location: props.url,
                }, createRenderReact(node, componentName, { routerRoutes: routes, ...props }));
            } else {
                renderReact(node, componentName, props);
            }
        }
    }

    FastClick.attach(document.body);
});
