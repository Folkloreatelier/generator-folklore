import React from 'react';
import { Route, IndexRoute } from 'react-router';

import MainLayout from './components/layouts/Main';
import Home from './components/pages/Home';

// eslint-disable-next-line no-unused-vars
export default urlGenerator => (
    <Route component={MainLayout}>
        <Route path="*" component={Home} />
    </Route>
);
