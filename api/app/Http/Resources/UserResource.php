<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'         => (string) $this->id,
            'roles'      => $this->roles->pluck('name')->toArray(),
            'user'       => $this->username ?? $this->user, // Usa el campo correcto (username o user)
            'email'      => $this->email,
            'first_name' => $this->first_name,
            'last_name'  => $this->last_name,
            'avatar'     => $this->avatar,
            'created_at' => $this->created_at?->timestamp,
        ];
    }
}
