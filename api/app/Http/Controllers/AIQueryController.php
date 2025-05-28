<?php

namespace App\Http\Controllers;

use App\Services\AIQueryService;
use App\Services\SQLCleaner;
use App\Services\SQLValidator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AIQueryController extends Controller
{
    public function handle(Request $request)
    {
        $prompt = $request->input('prompt');

        if (!$prompt) {
            return response()->json(['error' => 'Prompt vacío'], 400);
        }

        $aiQueryService = app(AIQueryService::class);
        $sqlValidator = app(SQLValidator::class);

        $sql = $aiQueryService->generateSQL($prompt);

        if (!$sql) {
            return response()->json(['error' => 'No se pudo generar SQL'], 500);
        }

        Log::info('SQL generado por Groq: ' . $sql);

        $sql = SQLCleaner::clean($sql);

        if (SQLCleaner::hasSubquery($sql)) {
            return response()->json(['error' => 'Subqueries no permitidas'], 400);
        }

        if (!$sqlValidator->isValid($sql)) {
            return response()->json(['error' => 'SQL inválido o no permitido'], 400);
        }

        $isAggregateQuery = preg_match('/\\b(count|sum|avg|min|max)\\s*\\(/i', $sql);

        if (!$isAggregateQuery && !preg_match('/limit\\s+\\d+/i', strtolower($sql))) {
            $sql .= ' LIMIT 100';
        }

        try {
            $results = DB::select($sql);
        } catch (\Exception $e) {
            Log::error('Error ejecutando SQL IA: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error al ejecutar la consulta',
                'details' => $e->getMessage()
            ], 500);
        }

        // Convertimos el resultado a JSON legible para pasarlo a Groq
        $resultJson = json_encode($results, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

        $naturalResponse = $aiQueryService->generateNaturalResponse($prompt, $resultJson);

        if (!$naturalResponse) {
            return response()->json(['error' => 'No se pudo generar respuesta natural'], 500);
        }

        return response()->json(['response' => $naturalResponse]);
    }
}
