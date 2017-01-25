<?php

//Redirect to current langage home
Route::get('/', [
    'as' => 'home',
    function()
    {
        return redirect()->route('home.'.config('app.locale'));
    }
]);

//Routes in french
Route::group([
    'prefix' => 'fr',
    'locale' => 'fr'
], function()
{
    Route::get('/', [
        'as' => 'home.fr',
        'uses' => 'HomeController@index'
    ]);
});

//Routes in english
Route::group([
    'prefix' => 'en',
    'locale' => 'en'
], function()
{
    Route::get('/', [
        'as' => 'home.en',
        'uses' => 'HomeController@index'
    ]);
});
