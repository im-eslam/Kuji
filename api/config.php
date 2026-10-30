<?php

$features = [];
foreach (glob(__DIR__ . '/features/*/config.php') ?: [] as $file) {
    $features[basename(dirname($file))] = require $file;
}

return [

    'db' => [
        'dsn'      => Env::get('DB_DSN'),
        'user'     => Env::get('DB_USER'),
        'password' => Env::get('DB_PASSWORD'),
        'options'  => [PDO::ATTR_EMULATE_PREPARES => true],
    ],

    'cors' => [
        'origins' => array_values(array_filter(array_map('trim', explode(',', Env::get('CORS_ORIGINS', ''))))),
    ],

    'features' => $features,

    'routes' => array_merge(...array_column($features, 'routes')),
];
