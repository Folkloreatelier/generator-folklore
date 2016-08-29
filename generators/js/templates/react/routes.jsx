import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './containers/App';
import Home from './containers/pages/Home';


/*jshint ignore:start */
module.exports = (
    <Route path="/" component={App}>
        <IndexRoute component={Home} />
    </Route>
);
/*jshint ignore:end */
