<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray($request): array
    {
        \Log::info("UserResource toArray - Datos del usuario:", [
            'id' => $this->id,
            'user' => $this->user,
            'email' => $this->email,
            'has_roles' => isset($this->roles),
            'resource_class' => get_class($this->resource)
        ]);
        
        return [
            'id'         => (string) $this->id,
            'roles'      => $this->roles ? $this->roles->pluck('name')->toArray() : [],
            'user'       => $this->user,
            'email'      => $this->email,
            'first_name' => $this->first_name,
            'last_name'  => $this->last_name,
            'avatar'     => $this->getAvatarData(),
            'created_at' => $this->created_at ? $this->created_at->timestamp : null,
        ];
    }
    
    /**
     * Obtiene toda la información del avatar del usuario
     */
    private function getAvatarData()
    {
        $avatar = $this->getFirstMedia('avatar');
        
        if (!$avatar) {
            return [
                'url' => null,
                'thumb_url' => null,
                'has_avatar' => false,
            ];
        }
        
        return [
            'url' => $avatar->getUrl('main'),
            'thumb_url' => $avatar->getUrl('thumb'),
            'original_url' => $avatar->getUrl(), // URL del archivo original si se necesita
            'file_name' => $avatar->file_name,
            'mime_type' => $avatar->mime_type,
            'size' => $avatar->size,
            'has_avatar' => true,
        ];
    }
}
