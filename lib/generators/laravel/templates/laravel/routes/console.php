<?php

use Illuminate\Foundation\Inspiring;

//Db Install
Artisan::command('db:install {--force}', function () {
    $args = [];
    if ($this->option('force')) {
        $args['--force'] = true;
    }

    Artisan::run('migrate:reset', $args);
    Artisan::call('db:seed', $args);
})->describe('Install database');

//DB update
Artisan::command('db:update {--force}', function () {
    $args = [];
    if ($this->option('force')) {
        $args['--force'] = true;
    }

    Artisan::run('migrate', $args);
    Artisan::call('db:seed', $args);
})->describe('Update database');
