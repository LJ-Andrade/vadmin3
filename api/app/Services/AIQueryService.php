<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class AIQueryService
{
    public function generateSQL(string $prompt): ?string
    {
        $schema = $this->buildDatabaseSchemaDescription();
    
        $response = Http::withToken(config('services.groq.token'))
            ->post('https://api.groq.com/openai/v1/chat/completions', [
                'model' => 'llama3-70b-8192',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => "Sos un generador de consultas SQL seguro. Usá solo las tablas permitidas. El esquema es: $schema. Respondé solo con el SQL, sin explicaciones, sin comentarios, sin texto adicional. Solo devolvé una línea limpia de SQL lista para ejecutar."
                    ],
                    [
                        'role' => 'user',
                        'content' => $prompt,
                    ],
                ],
            ]);
    
        if (!$response->successful()) {
            Log::error('Error Groq API (generateSQL): ' . $response->body());
            return null;
        }
    
        $content = $response->json('choices.0.message.content');
    
        // Si viene envuelto en bloque ```sql
        preg_match('/```sql(.*?)```/s', $content, $matches);
        $sql = $matches[1] ?? $content;
    
        // Si aún queda texto raro, tomamos solo la primera línea que empiece con SELECT
        if (preg_match('/(select .*?)(;|$)/i', $sql, $cleaned)) {
            $sql = $cleaned[1];
        }
    
        return trim($sql);
    }
    



    public function buildDatabaseSchemaDescription(): string
    {
        $tables = DB::select('SHOW TABLES');
        $schemaDescription = '';

        foreach ($tables as $tableObj) {
            $tableName = array_values((array)$tableObj)[0];
            $columns = Schema::getColumnListing($tableName);
            $schemaDescription .= "Tabla $tableName: " . implode(', ', $columns) . ". ";
        }

        return $schemaDescription;
    }


    public function generateNaturalResponse(string $originalPrompt, string $queryResult): ?string
    {
        $response = Http::withToken(config('services.groq.token'))
            ->post('https://api.groq.com/openai/v1/chat/completions', [
                'model' => 'llama3-70b-8192',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'Te paso la pregunta original del usuario y el resultado crudo de la base de datos en formato JSON. Armá una respuesta humana clara, directa y breve para mostrarle al usuario final. Solo devolvé el texto, sin etiquetas ni formato JSON.'
                    ],
                    [
                        'role' => 'user',
                        'content' => "Pregunta original: $originalPrompt. Resultado de la base: $queryResult"
                    ],
                ],
            ]);

        if (!$response->successful()) {
            Log::error('Error Groq API (generateNaturalResponse): ' . $response->body());
            return null;
        }

        return $response->json('choices.0.message.content');
    }



    public function rawChat(string $prompt): ?string
    {
        $response = Http::withToken(config('services.groq.token'))
            ->post('https://api.groq.com/openai/v1/chat/completions', [
                'model' => 'llama3-70b-8192',  // <-- CAMBIÁ ESTE NOMBRE SEGÚN LO QUE TE RECOMIENDEN
                'messages' => [
                    ['role' => 'system', 'content' => 'Respondé como un asistente normal, podés charlar, contar chistes, lo que sea.'],
                    ['role' => 'user', 'content' => $prompt],
                ],
            ]);

        if (!$response->successful()) {
            Log::error('Error Groq API (rawChat): ' . $response->body());
            return null;
        }

        return $response->json('choices.0.message.content');
    }

}
