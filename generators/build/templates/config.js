module.exports = {
    
    <% if(hasBrowserSync) { %>
    /**
     * Browsersync
     */
    browsersync: {
        server: {
            baseDir: <%- JSON.stringify(browserSyncBaseDir).replace(/\"/gi, '\'') %>,
            index: 'index.html'
        },
        
        <% if(browserSyncProxy) { %>
        proxy: '<%= browserSyncProxy %>',
        <% } %>
        
        files: <%- JSON.stringify(browserSyncFiles).replace(/\"/gi, '\'') %>
    },
    
    /**
     * Webpack middleware
     */
    webpackMiddleware: {
        noInfo: false,

        quiet: false,

        lazy: false,

        watchOptions: {
            aggregateTimeout: 300,
            poll: true
        },
        
        stats: {
            colors: true
        }
    },
    <% } %>
    
    /**
     * PostCSS
     */
    postcss: {
        autoprefixer: {
            browsers: '> 5%'
        }
    }
    
};
