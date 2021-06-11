<!DOCTYPE html>
<html lang="@yield('htmlLang', str_replace('_', '-', app()->getLocale()))" class="@yield('htmlClass')">
<head>
    @section('head')
    <meta charset="@yield('charset', 'utf-8')">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    @stack('meta')

    <title>@yield('title', config('app.name'))</title>

    @stack('css')

    @show
</head>
<body class="@yield('bodyClass')">
    @yield('body')
    @stack('js')
</body>
</html>
