module.exports = {

    <% if(hasBrowserSync) { %>/**
     * Browsersync
     */
    browsersync: {
        server: {
            baseDir: <%- JSON.stringify(browserSyncBaseDir, null, 4).replace(/\"/gi, '\'') %>,
            index: 'index.html',
        },<% if(browserSyncProxy) { %>

        host: '<%= browserSyncHost %>',
        proxy: '<%= browserSyncProxy %>',
        <% } %>
        files: <%- JSON.stringify(browserSyncFiles, null, 4).replace(/\"/gi, '\'') %>,
        ghostMode: false,
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
            poll: false,
            ignored: /node_modules/,
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
        map: {
            inline: false,
        },
        plugins: {
            autoprefixer: {},
            cssnano: {
                preset: 'default',
                zindex: false,
            },
        },
        env: {
            dev: {
                plugins: {
                    autoprefixer: false,
                    cssnano: false,
                },
            },
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
    },

};
