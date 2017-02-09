module.exports = {

    <% if(hasBrowserSync) { %>/**
     * Browsersync
     */
    browsersync: {
        server: {
            baseDir: <%- JSON.stringify(browserSyncBaseDir).replace(/\"/gi, '\'') %>,
            index: 'index.html',
        },

        <% if(browserSyncProxy) { %>
        host: '<%= browserSyncHost %>',
        proxy: '<%= browserSyncProxy %>',
        <% } %>

        files: <%- JSON.stringify(browserSyncFiles).replace(/\"/gi, '\'') %>,
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
            poll: true,
        },

        stats: {
            colors: true,
        },
    },<% } %>

    imagemin: {
        files: [
            '<%= imagesSrcPath %>',
        ],
        output: '<%= imagesDestPath %>',
    },

    /**
     * PostCSS
     */
    postcss: {
        autoprefixer: {
            browsers: '> 5%',
        },
    },

    /**
     * Modernizr
     */
    modernizr: {
        cache: true,

        devFile: false,

        dest: '<%= modernizrDestPath %>',

        options: [
            'setClasses',
            'addTest',
            'html5printshiv',
            'testProp',
            'fnBind',
        ],

        uglify: false,

        tests: [],

        excludeTests: [],

        crawl: true,

        useBuffers: false,

        files: {
            src: [
                '*[^(g|G)runt(file)?].{js,css,scss}',
                '**[^node_modules]/**/*.{js,css,scss}',
                '!lib/**/*',
            ],
        },

        customTests: [],
    }

};
