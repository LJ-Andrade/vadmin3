<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'module', // 'Article' o 'Product'
    ];

    public function articles()
    {
        return $this->hasMany(Article::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    // En Category.php (o el modelo que uses)
    public function scopeFilter($query, array $filters)
    {
        // Búsqueda general: keyword
        if (!empty($filters['keyword'])) {
            $keyword = $filters['keyword'];
            $query->where(function ($q) use ($keyword) {
                $q->where('name', 'like', "%{$keyword}%");
                // ->orWhere('description', 'like', "%{$keyword}%");
            });
        }

        // Filtros específicos
        if (!empty($filters['name'])) {
            $query->where('name', 'like', "%{$filters['name']}%");
        }

        if (!empty($filters['module'])) {
            $query->where('module', $filters['module']);
        }


        return $query;
    }

}
