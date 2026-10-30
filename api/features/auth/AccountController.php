<?php
// POST /api/admin/settings/language   { language: "en" | "ar" }                -> { ok, user }
// POST /api/admin/settings/username   { username, current_password }           -> { ok, user }
// POST /api/admin/settings/password   { current_password, new_password }       -> { ok }
//
// Failures return { ok:false, error, code }. 401 is reserved for "session expired",
// so a wrong current password is 422 with code "wrong_password".

class AccountController extends Controller
{
    protected const FEATURE = 'auth';

    public function language(): void
    {
        $user = Auth::requireAdmin($this->config);

        $language = Http::text(Http::input(), 'language');
        if (!in_array($language, $this->settings()['languages'], true)) {
            Http::fail(422, 'Invalid language', 'invalid_language');
        }

        $this->update($user['id'], 'language', $language);

        Http::json(['ok' => true, 'user' => Auth::publicUser(['language' => $language] + $user)]);
    }

    public function username(): void
    {
        $user = Auth::requireAdmin($this->config);

        $this->assertNotLocked();
        $input    = Http::input();
        $username = strtolower(Http::text($input, 'username'));

        if (!Auth::usernameIsValid($this->config, $username)) {
            Http::fail(422, 'Invalid username', 'invalid_username');
        }
        if ($username === $user['username']) {
            Http::fail(422, 'Username unchanged', 'unchanged');
        }

        $this->confirmCurrentPassword($user['id'], Http::raw($input, 'current_password'));

        try {
            $this->update($user['id'], 'username', $username);
        } catch (PDOException $error) {
            // 23505 = Postgres unique violation (23000 for other drivers): two admins racing for one name.
            if (in_array((string) $error->getCode(), ['23505', '23000'], true)) {
                Http::fail(409, 'Username already taken', 'username_taken');
            }
            throw $error;
        }

        Http::json(['ok' => true, 'user' => Auth::publicUser(['username' => $username] + $user)]);
    }

    public function password(): void
    {
        $user = Auth::requireAdmin($this->config);

        $this->assertNotLocked();
        $input   = Http::input();
        $current = Http::raw($input, 'current_password');
        $new     = Http::raw($input, 'new_password');

        if (!Auth::passwordIsValid($this->config, $new, $user['username'])) {
            Http::fail(422, 'Password does not meet the rules', 'weak_password');
        }
        if ($new === $current) {
            Http::fail(422, 'New password must be different', 'same_password');
        }

        $this->confirmCurrentPassword($user['id'], $current);

        $hash = password_hash($new, PASSWORD_DEFAULT);
        $this->update($user['id'], 'password_hash', $hash);

        // The session stamp is derived from the hash, so every OTHER session is now logged out.
        // Re-issue this one so the admin who just changed the password stays signed in.
        Auth::login(['id' => $user['id'], 'password_hash' => $hash]);

        Http::json(['ok' => true]);
    }

    // ---- helpers ----

    /** $column is always one of our own literals, never user input. */
    private function update(int $id, string $column, string $value): void
    {
        $this->db()->prepare("UPDATE {$this->settings()['table']} SET $column = ? WHERE id = ?")->execute([$value, $id]);
    }

    private function assertNotLocked(): void
    {
        $limit = $this->settings()['reauth_limit'];
        $wait  = RateLimit::blocked('admin_reauth', $limit['max'], $limit['window']);
        if ($wait > 0) {
            header('Retry-After: ' . $wait);
            Http::fail(429, 'Too many attempts', 'too_many_attempts');
        }
    }

    private function confirmCurrentPassword(int $userId, string $password): void
    {
        $cfg   = $this->settings();
        $limit = $cfg['reauth_limit'];

        $stmt = $this->db()->prepare("SELECT password_hash FROM {$cfg['table']} WHERE id = ?");
        $stmt->execute([$userId]);
        $hash = $stmt->fetchColumn();

        $ok = $hash !== false
            && $password !== ''
            && strlen($password) <= $cfg['password']['current_max']
            && password_verify($password, (string) $hash);

        if (!$ok) {
            RateLimit::record('admin_reauth', $limit['window']);
            Http::fail(422, 'Wrong current password', 'wrong_password');
        }
        RateLimit::reset('admin_reauth');
    }
}
