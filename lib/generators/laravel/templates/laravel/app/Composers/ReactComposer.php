<?php

namespace App\Composers;

use Illuminate\View\View;
use Illuminate\Http\Request;
use Illuminate\Routing\Router;
use Illuminate\Contracts\View\Factory;
use StdClass;

class ReactComposer
{
    protected $defaultRoutes = [
        'home',
    ];

    protected $request = null;
    protected $router = null;

    public function __construct(Request $request, Router $router)
    {
        $this->request = $request;
        $this->router = $router;
    }

    public function compose(View $view)
    {
        $path = '/'.ltrim($this->request->path(), '/');
        $locale = isset($view->locale) ? $view->locale : config('app.locale');
        $routes = $this->getRoutes($locale, isset($view->routes) ? $view->routes : null);
        $translations = isset($view->translations) ? $view->translations : $this->getTranslations($locale);

        $view->props = [
            'url' => $path,
            'routes' => $routes,
            'locale' => $locale,
            'translations' => $translations,
        ];
    }

    protected function getTranslations($locale)
    {
        $translations = [];
        $translations[$locale] = [];
        $content = trans('content', [], $locale);
        if (is_string($content) || is_null($content)) {
            return new StdClass();
        }
        $texts = array_dot($content);
        foreach ($texts as $key => $value) {
            $translations[$locale][$key] = preg_replace('/\:([^\sA-Z]+)/', '%{$1}', $value);
        }

        return $translations;
    }

    protected function getRoutes($locale, $routeNames = null)
    {
        $routes = [];
        $allRoutes = $this->router->getRoutes();
        if (is_null($routeNames)) {
            $routeNames = $this->defaultRoutes;
        }

        foreach ($routeNames as $name) {
            $route = $allRoutes->getByName($name);
            $parameters = $route->parameterNames();
            $key = preg_replace('/\.'.$locale.'$/', '', $name);
            if (sizeof($parameters)) {
                $params = [];
                foreach ($parameters as $parameter) {
                    $params[] = ':'.$parameter;
                }
                $routes[$key] = preg_replace('/^https?\:\/\/[^\/]+/i', '', route($name, $params));
            } else {
                $routes[$key] = preg_replace('/^https?\:\/\/[^\/]+/i', '', route($name));
            }
            $routes[$name] = $routes[$key];
        }

        return $routes;
    }
}
