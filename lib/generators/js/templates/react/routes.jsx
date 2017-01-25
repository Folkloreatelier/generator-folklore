import React from 'react';
import { Route, IndexRoute } from 'react-router';
import URL from './lib/url';

import App from './containers/App';
import Home from './containers/pages/Home';


export default (routes) => {
    const url = typeof routes !== 'undefined' && routes ? new URL(routes) : null;
    return (
        <Route path="*" component={App}>
            <IndexRoute component={Home} />
        </Route>
    );
};
