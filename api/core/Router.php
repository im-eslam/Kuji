<?php

class Router
{
    public static function dispatch(array $config): void
    {
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        $path   = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
        $path   = preg_replace('#^.*?/api(?=/|$)#', '', $path);
        $path   = '/' . trim($path, '/');

        $route = $config['routes']["$method $path"] ?? null;
        if ($route === null) {
            // Known path, wrong method -> 405 instead of 404.
            foreach (array_keys($config['routes']) as $key) {
                if (str_ends_with($key, " $path")) {
                    header('Allow: ' . substr($key, 0, strpos($key, ' ')));
                    Http::fail(405, 'Method not allowed', 'METHOD_NOT_ALLOWED');
                }
            }
            Http::fail(404, 'Not found', 'NOT_FOUND');
        }

        [$class, $action] = $route;

        try {
            (new $class($config))->$action();
        } catch (Throwable $error) {
            error_log($error);
            Http::fail(500, 'Server error', 'INTERNAL_ERROR');
        }
    }
}
