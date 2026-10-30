<?php

class MenuController extends Controller
{
    protected const FEATURE = 'menu';

    // ---- public ----

    public function index(): void
    {
        try {
            Http::json($this->store()->read());
        } catch (RuntimeException $e) {
            error_log('[menu] read failed: ' . $e->getMessage());
            Http::fail(500, 'Menu is temporarily unavailable.');
        }
    }

    // ---- admin ----

    public function save(): void
    {
        Auth::requireAdmin($this->config);

        $menu = Http::input($this->settings()['max_body']);

        $store   = $this->store();
        $problem = $store->validate($menu);
        if ($problem !== null) {
            Http::fail(422, $problem);
        }

        try {
            $saved = $store->write($menu);
        } catch (RuntimeException | JsonException $e) {
            error_log('[menu] write failed: ' . $e->getMessage());
            Http::fail(500, 'Menu could not be saved.');
        }

        Http::json(['ok' => true, 'updatedAt' => $saved['updatedAt']]);
    }

    private function store(): MenuStore
    {
        return new MenuStore($this->settings()['file']);
    }
}