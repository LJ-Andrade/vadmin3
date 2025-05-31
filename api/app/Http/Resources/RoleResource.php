<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class RoleResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'          => (string) $this->id,
            'name'        => $this->name,
            'permissions' => $this->permissions->pluck('name')->toArray(),
            'created_at'  => $this->created_at?->timestamp,
        ];
    }
}
