<?php

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

require __DIR__ . '/../core/Autoload.php';
Autoload::register(__DIR__ . '/..');

Env::load(__DIR__ . '/../.env');
$config = require __DIR__ . '/../config.php';
$pdo    = Database::connect($config['db']);

foreach (glob(__DIR__ . '/../features/*/schema.sql') ?: [] as $file) {
    $pdo->exec(file_get_contents($file));
    echo 'OK  ' . basename(dirname($file)) . "/schema.sql\n";
}
