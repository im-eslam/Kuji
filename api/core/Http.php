<?php

class Http
{
    private const MAX_BODY = 16384; 

    public static function securityHeaders(): void
    {
        header('X-Content-Type-Options: nosniff');
        header('Referrer-Policy: no-referrer');
        header('X-Frame-Options: DENY');
    }

    public static function json(array $data, int $status = 200): never
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        header('Cache-Control: no-store');
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        exit;
    }

    public static function fail(int $status, string $message, ?string $code = null): never
    {
        $body = ['ok' => false, 'error' => $message];
        if ($code !== null) {
            $body['code'] = $code;
        }
        self::json($body, $status);
    }

    public static function input(int $maxBody = self::MAX_BODY): array
    {
        $type = strtolower($_SERVER['CONTENT_TYPE'] ?? '');
        if (!str_starts_with($type, 'application/json')) {
            self::fail(415, 'Content-Type must be application/json', 'UNSUPPORTED_MEDIA_TYPE');
        }
        if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > $maxBody) {
            self::fail(413, 'Payload too large', 'PAYLOAD_TOO_LARGE');
        }
        $raw = file_get_contents('php://input', false, null, 0, $maxBody + 1) ?: '';
        if (strlen($raw) > $maxBody) {
            self::fail(413, 'Payload too large', 'PAYLOAD_TOO_LARGE');
        }
        $data = json_decode($raw, true);
        return is_array($data) ? $data : [];
    }

    public static function text(array $input, string $key): string
    {
        return is_string($input[$key] ?? null) ? trim($input[$key]) : '';
    }

    public static function raw(array $input, string $key): string
    {
        return is_string($input[$key] ?? null) ? $input[$key] : '';
    }
}
