<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Support\Collection;

trait CrudOperations
{
    /**
     * Devuelve una colección (paginada o completa) envuelta en Resource.
     *
     * @param  Request                 $request        la request entrante
     * @param  Builder|Collection      $query          query builder o colección
     * @param  string                  $resourceClass  Nombre completo del Resource (p.e. UserResource::class)
     * @param  int|null                $defaultPerPage fallback para `per_page`
     * @param  bool                    $allWhenMissing si no llega ?per_page, ¿devolver todo?
     */
    protected function respondWithCollection(
        Request $request,
        $query,
        string $resourceClass,
        ?int $defaultPerPage = 10,
        bool $allWhenMissing = false
    ) {
        $perPage = $request->input('per_page', $defaultPerPage);

        // Si front NO pide paginar y queremos todo:
        if ($allWhenMissing && !$request->has('per_page')) {
            $data = $query instanceof Builder ? $query->get() : $query;
            return $resourceClass::collection($data);
        }

        // Paginado normal
        $paginator = $query instanceof Builder ? $query->paginate($perPage) : $query;
        
        // ¿Necesitas añadir algo personalizado al META?
        // Usa ->additional()
        return $resourceClass::collection($paginator)
               ->additional([
                   // 'extra' => 'value',
               ]);
    }

    /** Respuesta JSON estándar para acciones simples (store / update / delete). */
    protected function ok(array $payload = [], int $status = 200)
    {
        return response()->json($payload, $status);
    }
}
