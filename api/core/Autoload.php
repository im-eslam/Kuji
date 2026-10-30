<?php

class Autoload
{
    private static array $map = [];

    public static function register(string $root): void
    {
        foreach (['core', 'features'] as $dir) {
            $files = new RecursiveIteratorIterator(
                new RecursiveDirectoryIterator("$root/$dir", FilesystemIterator::SKIP_DOTS)
            );
            foreach ($files as $file) {
                $name = $file->getBasename('.php');
                if ($file->getExtension() === 'php' && ctype_upper($name[0])) {
                    self::$map[$name] = $file->getPathname();
                }
            }
        }
        spl_autoload_register(fn(string $class) => isset(self::$map[$class]) ? require_once self::$map[$class] : null);
    }
}
