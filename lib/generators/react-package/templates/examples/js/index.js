import React from 'react';
import ReactDOM from 'react-dom';
import domready from 'domready';
import $ from 'jquery';

import Examples from './examples';

domready(() => {
    let exampleIndex = 0;

    const exampleEl = $('#app')[0];
    function renderExample() {
        const Example = Examples[exampleIndex];
        const example = React.createElement(Example);
        ReactDOM.render(example, exampleEl);
    }

    renderExample();
    $(document).on('click', (e) => {
        e.preventDefault();
        exampleIndex = exampleIndex === (Examples.length - 1) ? 0 : (exampleIndex + 1);
        renderExample();
    });
});
