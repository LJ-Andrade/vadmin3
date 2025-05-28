<?php

namespace App\Services;

class SQLCleaner
{
    public static function clean(string $sql): string
    {
        // Quitar espacios en blanco al principio y final
        $sql = trim($sql);

        // Quitar punto y coma final
        $sql = rtrim($sql, ';');

        // Reemplazar múltiples espacios y saltos por uno solo
        $sql = preg_replace('/\\s+/', ' ', $sql);

        return $sql;
    }

    public static function hasSubquery(string $sql): bool
    {
        // Buscar subqueries con pattern básico
        return preg_match('/\\(\\s*select\\s+/i', $sql) === 1;
    }
}
