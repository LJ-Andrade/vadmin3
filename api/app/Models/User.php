<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Image\Enums\Fit;

class User extends Authenticatable implements HasMedia
{
    use HasApiTokens, Notifiable, HasFactory, HasRoles, InteractsWithMedia;

    protected $guard_name = 'api';

    protected $fillable = [
        'user',
        'first_name',
        'last_name',
        'email',
        'password',
        'avatar_url'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    /**
     * Asegura que avatar_url siempre contiene la URL actual del archivo avatar
     */
    public function getAvatarUrlAttribute($value)
    {
        // Si hay un avatar en la colección de medios, usamos la URL de la conversión 'main'
        if ($this->getFirstMedia('avatar')) {
            return $this->getFirstMedia('avatar')->getUrl('main');
        }
        
        // De lo contrario, devolvemos el valor guardado o null
        return $value;
    }
    
    /**
     * Obtiene la URL del avatar en tamaño miniatura
     */
    public function getAvatarThumbUrlAttribute()
    {
        if ($this->getFirstMedia('avatar')) {
            return $this->getFirstMedia('avatar')->getUrl('thumb');
        }
        
        return null;
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('avatar')
            ->singleFile()
            ->withResponsiveImages();
            
        // Puedes agregar más colecciones si necesitas
        $this->addMediaCollection('documents'); // Para documentos del usuario
        $this->addMediaCollection('profile_banner')->singleFile(); // Para banner del perfil
    }

    public function registerMediaConversions(Media $media = null): void
    {
        // Conversión para miniatura (thumb)
        $this->addMediaConversion('thumb')
            ->fit(Fit::Crop, 300, 300)
            ->format('jpg')
            ->quality(80)
            ->sharpen(10)
            ->nonQueued();
            
        // Conversión para tamaño principal (main)
        $this->addMediaConversion('main')
            ->fit(Fit::Contain, 800, 800) // Tamaño máximo 800x800, mantiene proporción
            ->format('jpg')
            ->quality(90)
            ->sharpen(10)
            ->nonQueued();
    }
}
