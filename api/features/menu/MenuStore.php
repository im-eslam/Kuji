<?php

class MenuStore
{
    public const SCHEMA_VERSION = 1;

    public function __construct(private string $path)
    {
    }

    // -- public api -----------------------------------------------------------

    public function read(): array
    {
        $raw = is_readable($this->path) ? file_get_contents($this->path) : false;
        if ($raw === false) {
            throw new RuntimeException('Menu file is missing or unreadable.');
        }

        try {
            $menu = json_decode($raw, true, 512, JSON_THROW_ON_ERROR);
        } catch (JsonException $e) {
            throw new RuntimeException('Menu file contains invalid JSON: ' . $e->getMessage());
        }

        if (!is_array($menu) || !$this->hasShape($menu)) {
            throw new RuntimeException('Menu file does not match the expected document shape.');
        }

        return $menu;
    }

    public function validate(array $menu): ?string
    {
        if (!$this->hasShape($menu)) {
            return 'Invalid menu document: missing required top-level keys.';
        }
        if ($menu['schemaVersion'] !== self::SCHEMA_VERSION) {
            return 'Unsupported schema version: expected ' . self::SCHEMA_VERSION . '.';
        }

        $refs = $this->buildRefs($menu);
        if (is_string($refs)) {
            return $refs;
        }

        foreach ($menu['addOns'] as $addOn) {
            if ($err = $this->validateAddOn($addOn, $refs['products'])) {
                return "addOn {$addOn['id']}: $err";
            }
        }

        foreach ($menu['products'] as $product) {
            if ($err = $this->validateProduct($product, $refs)) {
                return "product {$product['id']}: $err";
            }
        }

        if ($err = $this->validateMarketing($menu['marketing'], $refs['products'])) {
            return "marketing: $err";
        }

        return null;
    }

    public function write(array $menu): array
    {
        $menu['updatedAt'] = gmdate(DATE_ATOM);

        $encoded = json_encode(
            $menu,
            JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR
        ) . "\n";

        $tmp = $this->path . '.' . bin2hex(random_bytes(4)) . '.tmp';

        if (file_put_contents($tmp, $encoded, LOCK_EX) === false || !rename($tmp, $this->path)) {
            @unlink($tmp);
            throw new RuntimeException('Could not write the menu file.');
        }

        return $menu;
    }

    // -- shape ----------------------------------------------------------------

    private function hasShape(array $menu): bool
    {
        foreach (['schemaVersion', 'updatedAt', 'categories', 'sizes', 'badges', 'addOns', 'products', 'marketing'] as $key) {
            if (!array_key_exists($key, $menu)) {
                return false;
            }
        }
        foreach (['categories', 'sizes', 'badges', 'addOns', 'products'] as $key) {
            if (!is_array($menu[$key])) {
                return false;
            }
        }
        return is_array($menu['marketing']);
    }

    // -- refs -----------------------------------------------------------------

    private function buildRefs(array $menu): array|string
    {
        $refs = [];
        foreach (['categories', 'sizes', 'badges', 'addOns', 'products'] as $list) {
            $ids = $this->collectIds($menu[$list]);
            if ($ids === null) {
                return "$list: each item must have a unique, non-empty id.";
            }
            $refs[$list] = $ids;
        }
        return $refs;
    }

    // -- validators -----------------------------------------------------------

    private function validateAddOn(mixed $addOn, array $productIds): ?string
    {
        if (!is_array($addOn)) {
            return 'must be an object.';
        }
        if (!is_numeric($addOn['price'] ?? null) || $addOn['price'] < 0) {
            return 'price must be a non-negative number.';
        }
        if (!is_array($addOn['scope'] ?? null)) {
            return 'scope must be an array.';
        }
        if (!$this->refsExist($addOn['scope'], $productIds)) {
            return 'scope contains an unknown product id.';
        }
        return null;
    }

    private function validateProduct(mixed $product, array $refs): ?string
    {
        if (!is_array($product)) {
            return 'must be an object.';
        }
        if (!isset($refs['categories'][$product['categoryId'] ?? ''])) {
            return "categoryId '{$product['categoryId']}' does not exist.";
        }
        if (!is_numeric($product['price'] ?? null) || $product['price'] < 0) {
            return 'price must be a non-negative number.';
        }
        if (!is_int($product['sort'] ?? null)) {
            return 'sort must be an integer.';
        }
        if (!is_bool($product['inStock'] ?? null)) {
            return 'inStock must be a boolean.';
        }

        if (!is_array($product['sizes'] ?? null)) {
            return 'sizes must be an array.';
        }
        foreach ($product['sizes'] as $sp) {
            if (!is_array($sp) || !isset($refs['sizes'][$sp['id'] ?? ''])) {
                return 'sizes contains an unknown size id.';
            }
            if (!is_numeric($sp['price'] ?? null) || $sp['price'] < 0) {
                return "size '{$sp['id']}': price must be a non-negative number.";
            }
        }

        if (!is_array($product['badges'] ?? null)) {
            return 'badges must be an array.';
        }
        if (!$this->refsExist($product['badges'], $refs['badges'])) {
            return 'badges contains an unknown badge id.';
        }

        if (!is_null($product['discount'] ?? 'MISSING')) {
            if ($err = $this->validateDiscount($product['discount'])) {
                return "discount: $err";
            }
        }

        if (!is_null($product['baristaWay'] ?? 'MISSING')) {
            if ($err = $this->validateBaristaWay($product['baristaWay'], $refs['addOns'])) {
                return "baristaWay: $err";
            }
        }

        if (!is_array($product['oftenOrderedWith'] ?? null)) {
            return 'oftenOrderedWith must be an array.';
        }
        if (!$this->refsExist($product['oftenOrderedWith'], $refs['products'])) {
            return 'oftenOrderedWith contains an unknown product id.';
        }
        if (in_array($product['id'], $product['oftenOrderedWith'], true)) {
            return 'oftenOrderedWith must not include the product itself.';
        }

        return null;
    }

    private function validateDiscount(mixed $discount): ?string
    {
        if (!is_array($discount)) {
            return 'must be null or an object.';
        }
        if (!in_array($discount['type'] ?? '', ['amount', 'percent'], true)) {
            return "type must be 'amount' or 'percent'.";
        }
        if (!is_numeric($discount['value'] ?? null) || $discount['value'] <= 0) {
            return 'value must be a positive number.';
        }
        if ($discount['type'] === 'percent' && $discount['value'] > 100) {
            return 'percent discount value must not exceed 100.';
        }
        return null;
    }

    private function validateBaristaWay(mixed $baristaWay, array $addOnIds): ?string
    {
        if (!is_array($baristaWay)) {
            return 'must be null or an object.';
        }
        if (!is_array($baristaWay['addOns'] ?? null)) {
            return 'addOns must be an array.';
        }
        if (!$this->refsExist($baristaWay['addOns'], $addOnIds)) {
            return 'addOns contains an unknown add-on id.';
        }
        return null;
    }

    private function validateMarketing(mixed $marketing, array $productIds): ?string
    {
        if (!is_array($marketing)) {
            return 'must be an object.';
        }

        if (!is_array($marketing['signatures'] ?? null)) {
            return 'signatures must be an array.';
        }
        if (!$this->refsExist($marketing['signatures'], $productIds)) {
            return 'signatures contains an unknown product id.';
        }

        if (!is_array($marketing['pairings'] ?? null)) {
            return 'pairings must be an array.';
        }
        if ($this->collectIds($marketing['pairings']) === null) {
            return 'each pairing must have a unique, non-empty id.';
        }
        foreach ($marketing['pairings'] as $pairing) {
            if ($err = $this->validatePairing($pairing, $productIds)) {
                return "pairing {$pairing['id']}: $err";
            }
        }

        if (!is_array($marketing['popup'] ?? null)) {
            return 'popup must be an object.';
        }
        if (!is_bool($marketing['popup']['enabled'] ?? null)) {
            return 'popup.enabled must be a boolean.';
        }
        if (!is_int($marketing['popup']['delaySeconds'] ?? null) || $marketing['popup']['delaySeconds'] < 0) {
            return 'popup.delaySeconds must be a non-negative integer.';
        }

        return null;
    }

    private function validatePairing(mixed $pairing, array $productIds): ?string
    {
        if (!is_array($pairing)) {
            return 'must be an object.';
        }

        $items = $pairing['items'] ?? null;
        if (!is_array($items) || count($items) !== 2) {
            return 'items must be an array of exactly 2 product ids.';
        }
        if (!$this->refsExist($items, $productIds)) {
            return 'items contains an unknown product id.';
        }
        if ($items[0] === $items[1]) {
            return 'items must reference two different products.';
        }

        $bp = $pairing['bundlePrice'] ?? null;
        if (!is_null($bp) && (!is_numeric($bp) || $bp < 0)) {
            return 'bundlePrice must be null or a non-negative number.';
        }

        return null;
    }

    // -- helpers --------------------------------------------------------------

    private function collectIds(array $records): ?array
    {
        $seen = [];
        foreach ($records as $record) {
            $id = $record['id'] ?? null;
            if (!is_string($id) || trim($id) === '' || isset($seen[$id])) {
                return null;
            }
            $seen[$id] = true;
        }
        return $seen;
    }

    private function refsExist(mixed $refs, array $knownIds): bool
    {
        if (!is_array($refs)) {
            return false;
        }
        foreach ($refs as $id) {
            if (!is_string($id) || !isset($knownIds[$id])) {
                return false;
            }
        }
        return true;
    }
}