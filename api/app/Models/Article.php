<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\Image\Enums\Fit;

class Article extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $fillable = [
        'title',
        'content',
        'slug',
        'published_at',
        'category_id',
    ];

    protected $casts = [
        'published_at' => 'datetime',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function registerMediaCollections(): void
    {
        // Colección para imagen principal del artículo
        $this->addMediaCollection('featured_image')
            ->singleFile();

        // Colección para galería de imágenes del artículo
        $this->addMediaCollection('gallery');

        // Colección para archivos adjuntos
        $this->addMediaCollection('attachments');
    }

    public function registerMediaConversions(Media $media = null): void
    {
        // Solo para imágenes principales y galería
        if ($media && in_array($media->collection_name, ['featured_image', 'gallery'])) {
            // Miniatura
            $this->addMediaConversion('thumb')
                ->fit(Fit::Crop, 300, 200)
                ->format('jpg')
                ->quality(80)
                ->nonQueued();

            // Tamaño medio
            $this->addMediaConversion('medium')
                ->fit(Fit::Crop, 800, 600)
                ->format('jpg')
                ->quality(85)
                ->nonQueued();

            // Tamaño grande
            $this->addMediaConversion('large')
                ->fit(Fit::Contain, 1200, 900)
                ->format('jpg')
                ->quality(90)
                ->nonQueued();
        }
    }
}
