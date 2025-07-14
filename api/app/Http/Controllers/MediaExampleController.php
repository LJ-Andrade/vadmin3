<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\User;
use Illuminate\Http\Request;

class MediaExampleController extends Controller
{
    public function uploadUserAvatar(Request $request, User $user)
    {
        // Se guardará en: storage/app/public/users/avatars/{user_id}/
        $media = $user->addMediaFromRequest('avatar')
            ->toMediaCollection('avatar');
            
        return response()->json([
            'message' => 'Avatar subido exitosamente',
            'url' => $media->getUrl(),
            'path' => $media->getPath()
        ]);
    }

    public function uploadUserDocument(Request $request, User $user)
    {
        // Se guardará en: storage/app/public/users/documents/{user_id}/
        $media = $user->addMediaFromRequest('document')
            ->toMediaCollection('documents');
            
        return response()->json([
            'message' => 'Documento subido exitosamente',
            'url' => $media->getUrl(),
            'path' => $media->getPath()
        ]);
    }

    public function uploadArticleImage(Request $request, Article $article)
    {
        // Se guardará en: storage/app/public/articles/featured/{article_id}/
        $media = $article->addMediaFromRequest('featured_image')
            ->toMediaCollection('featured_image');
            
        return response()->json([
            'message' => 'Imagen destacada subida exitosamente',
            'url' => $media->getUrl(),
            'path' => $media->getPath()
        ]);
    }

    public function uploadArticleGallery(Request $request, Article $article)
    {
        // Se guardará en: storage/app/public/articles/gallery/{article_id}/
        $media = $article->addMediaFromRequest('gallery_image')
            ->toMediaCollection('gallery');
            
        return response()->json([
            'message' => 'Imagen de galería subida exitosamente',
            'url' => $media->getUrl(),
            'path' => $media->getPath()
        ]);
    }
}
