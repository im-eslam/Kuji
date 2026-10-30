<?php

return [

    'file'     => __DIR__ . '/../../storage/menu.json',
    'max_body' => 1_024 * 1_024, // 1 MB

    'routes' => [
        'GET /menu'        => [MenuController::class, 'index'],
        'POST /admin/menu' => [MenuController::class, 'save'],
    ],

];