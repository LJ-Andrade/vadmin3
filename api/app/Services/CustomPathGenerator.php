<?php

namespace App\Services;

use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\MediaLibrary\Support\PathGenerator\PathGenerator;

class CustomPathGenerator implements PathGenerator
{
    public function getPath(Media $media): string
    {
        return $this->getBasePath($media) . '/';
    }

    public function getPathForConversions(Media $media): string
    {
        return $this->getBasePath($media) . '/conversions/';
    }

    public function getPathForResponsiveImages(Media $media): string
    {
        return $this->getBasePath($media) . '/responsive/';
    }

    protected function getBasePath(Media $media): string
    {
        // Obtener el nombre del modelo
        $modelName = strtolower(class_basename($media->model_type));
        
        // Obtener el nombre de la colección
        $collectionName = $media->collection_name;
        
        // Crear diferentes estructuras según el modelo y colección
        return match ($modelName) {
            'user' => $this->getUserPath($media, $collectionName),
            'article' => $this->getArticlePath($media, $collectionName),
            default => $this->getDefaultPath($media, $modelName, $collectionName)
        };
    }

    protected function getUserPath(Media $media, string $collectionName): string
    {
        return match ($collectionName) {
            'avatar' => "users/avatars/{$media->model_id}",
            'documents' => "users/documents/{$media->model_id}",
            'profile_banner' => "users/banners/{$media->model_id}",
            'users' => "users/{$media->model_id}",
            default => "users/{$collectionName}/{$media->model_id}"
        };
    }

    protected function getArticlePath(Media $media, string $collectionName): string
    {
        return match ($collectionName) {
            'featured_image' => "articles/featured/{$media->model_id}",
            'gallery' => "articles/gallery/{$media->model_id}",
            'attachments' => "articles/files/{$media->model_id}",
            default => "articles/{$collectionName}/{$media->model_id}"
        };
    }

    protected function getDefaultPath(Media $media, string $modelName, string $collectionName): string
    {
        // Para modelos no definidos específicamente, usar estructura genérica
        return "{$modelName}/{$collectionName}/{$media->model_id}";
    }
}
