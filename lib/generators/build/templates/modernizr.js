#!/usr/bin/env node
import program from 'commander';
import modernizr from 'customizr';
import config from './config';

const settings = config.modernizr;
program
    .option('-d, --dist', 'Production build')
    .parse(process.argv);

if (program.prod) {
    settings.dest = 'dist/js/modernizr.js';
    settings.uglify = true;
    settings.cache = false;
}

modernizr(settings, () => {

});
