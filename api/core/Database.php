<?php

class Database
{
    private static ?PDO $pdo = null;

    public static function connect(array $db): PDO
    {
        if (self::$pdo === null) {
            if (empty($db['dsn'])) {
                throw new RuntimeException('DB_DSN is not set (see .env.example)');
            }
            self::$pdo = new PDO($db['dsn'], $db['user'] ?? null, $db['password'] ?? null, ($db['options'] ?? []) + [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_TIMEOUT            => 5,
            ]);
        }
        return self::$pdo;
    }
}
