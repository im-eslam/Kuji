<?php

define('API_ENTRY', true);

require __DIR__ . '/core/Autoload.php';
Autoload::register(__DIR__);

Env::load(__DIR__ . '/.env');
$config = require __DIR__ . '/config.php';

Http::securityHeaders();
Cors::handle($config); 

Router::dispatch($config);
