<?php

namespace App\Services;

class SQLValidator
{
    protected $allowedTables = ['users'];

    public function isValid(string $sql): bool
    {
        $sqlLower = strtolower($sql);

        if (!str_starts_with(trim($sqlLower), 'select')) {
            return false;
        }

        foreach ($this->allowedTables as $table) {
            if (preg_match('/\\b' . preg_quote($table) . '\\b/', $sqlLower)) {
                return true;
            }
        }

        return false;
    }

    public function getAllowedTables(): array
    {
        return $this->allowedTables;
    }
}
