<?php

use Carbon\Carbon;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Route;

if (! function_exists('array_key_by')) {
    /**
     * Replace root array key with child array key.
     * Note that the specified key must exist in the query result, or it will be ignored.
     *
     * @param  array  $data
     * @param  string  $key
     * @return array
     */
    function array_key_by(array $data, string $key): array
    {
        $output = [];

        foreach ($data as $k => $value) {
            $output[(isset($value[$key])) ? $value[$key] : $k] = $value;
        }

        return $output;
    }
}

if (! function_exists('datetime')) {
    /**
     * Parse datetime with Carbon.
     *
     * @param  mixed  $time
     * @param  string|null  $format
     * @return \Carbon\Carbon
     */
    function datetime($time = null, ?string $format = null): Carbon
    {
        return $format ? Carbon::createFromFormat($format, $time) : Carbon::parse($time);
    }
}

if (! function_exists('page_title')) {
    /**
     * Set the page title.
     *
     * @param  string  $title
     * @param  string  $delimiter
     * @return string
     */
    function page_title(string $title, string $delimiter = '|'): string
    {
        return sprintf('%s %s %s', $title, $delimiter, config('app.name'));
    }
}

if (! function_exists('active_route')) {
    /**
     * Return the "active" class if current route is matched.
     *
     * @param  string|array  $route
     * @param  string  $class
     * @return string
     */
    function active_route($route, string $class = 'active'): string
    {
        $routes = Arr::wrap($route);

        return Route::is(...$routes) ? $class : '';
    }
}
