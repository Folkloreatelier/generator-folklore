import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/App';
import Home from './components/pages/Home';

// eslint-disable-next-line no-unused-vars
export default urlGenerator => (
    <Route path="*" component={App}>
        <IndexRoute component={Home} />
    </Route>
);
