<?php

abstract class Controller
{
    protected const FEATURE = '';

    public function __construct(protected array $config)
    {
    }

    protected function db(): PDO
    {
        return Database::connect($this->config['db']);
    }

    /** This feature's block from features/<name>/config.php */
    protected function settings(): array
    {
        return $this->config['features'][static::FEATURE];
    }
}
