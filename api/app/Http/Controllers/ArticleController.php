<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Category;
use Illuminate\Http\Request;

class ArticleController extends \App\Http\Controllers\Controller
{
    public function index(Request $request)
    {
        $articles = Article::with(['category', 'media'])->paginate(10);
        $articles->getCollection()->transform(function($article) {
            $data = $article->toArray();
            $data['category'] = $article->category ? $article->category->only(['id','name']) : null;
            $data['images'] = $article->getMedia('images')->map(function($media) {
                return [
                    'url' => $media->getUrl(),
                    'file_name' => $media->file_name,
                    'mime_type' => $media->mime_type,
                    'size' => $media->size,
                ];
            });
            return $data;
        });
        return response()->json($articles);
    }

    public function show($id)
    {
        $article = Article::with(['category', 'media'])->findOrFail($id);
        $data = $article->toArray();
        $data['category'] = $article->category ? $article->category->only(['id','name']) : null;
        $data['images'] = $article->getMedia('images')->map(function($media) {
            return [
                'url' => $media->getUrl(),
                'file_name' => $media->file_name,
                'mime_type' => $media->mime_type,
                'size' => $media->size,
            ];
        });
        return response()->json($data);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'images.*' => 'image|max:10000',
        ]);
        $article = Article::create($validated);
        if($request->hasFile('images')) {
            foreach($request->file('images') as $image) {
                $article->addMedia($image)->toMediaCollection('images');
            }
        }
        $article->load(['category', 'media']);
        $data = $article->toArray();
        $data['category'] = $article->category ? $article->category->only(['id','name']) : null;
        $data['images'] = $article->getMedia('images')->map(function($media) {
            return [
                'url' => $media->getUrl(),
                'file_name' => $media->file_name,
                'mime_type' => $media->mime_type,
                'size' => $media->size,
            ];
        });
        return response()->json(['message' => 'Artículo creado exitosamente', 'article' => $data], 201);
    }

    public function update(Request $request, $id)
    {
        $article = Article::findOrFail($id);
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
            'category_id' => 'sometimes|exists:categories,id',
            'images.*' => 'image|max:10000',
        ]);
        $article->update($validated);
        if($request->hasFile('images')) {
            $article->clearMediaCollection('images');
            foreach($request->file('images') as $image) {
                $article->addMedia($image)->toMediaCollection('images');
            }
        }
        $article->load(['category', 'media']);
        $data = $article->toArray();
        $data['category'] = $article->category ? $article->category->only(['id','name']) : null;
        $data['images'] = $article->getMedia('images')->map(function($media) {
            return [
                'url' => $media->getUrl(),
                'file_name' => $media->file_name,
                'mime_type' => $media->mime_type,
                'size' => $media->size,
            ];
        });
        return response()->json(['message' => 'Artículo actualizado exitosamente', 'article' => $data], 200);
    }

    public function destroy($id)
    {
        $article = Article::findOrFail($id);
        $article->delete();
        return response()->json(['message' => 'Artículo eliminado exitosamente']);
    }
}
