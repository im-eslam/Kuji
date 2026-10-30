<?php
/**
 * Admin accounts: login, session, and the account settings screen (language, username, password).
 * Everything under /api/admin/* except login needs a valid session (see Auth::requireAdmin).
 *
 *  - session       : cookie name and lifetimes in seconds (idle = no activity, absolute = since login)
 *  - login_limit   : max FAILED logins per IP inside the window (seconds)
 *  - reauth_limit  : same, for wrong "current password" guesses on the settings screen
 *  - username/password rules are used by the settings screen AND by create-admin.php
 */

return [

    'table' => 'admin_users',

    'session'      => ['name' => 'kuji_sid', 'idle' => 2 * 60 * 60, 'absolute' => 12 * 60 * 60],
    'login_limit'  => ['max' => 5, 'window' => 15 * 60],
    'reauth_limit' => ['max' => 5, 'window' => 15 * 60],

    'languages'        => ['en', 'ar'],
    'username_pattern' => '/^[a-z0-9._-]{3,50}$/',
    'password'         => ['min' => 10, 'max' => 72 /* bcrypt reads 72 bytes */, 'current_max' => 200],

    'routes' => [
        'POST /admin/login'             => [AuthController::class, 'login'],
        'POST /admin/logout'            => [AuthController::class, 'logout'],
        'GET /admin/me'                 => [AuthController::class, 'me'],
        'POST /admin/settings/language' => [AccountController::class, 'language'],
        'POST /admin/settings/username' => [AccountController::class, 'username'],
        'POST /admin/settings/password' => [AccountController::class, 'password'],
    ],
];
