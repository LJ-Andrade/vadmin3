<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->input('list_regs_per_page', 15);

        $allowedSorts = ['id', 'name', 'created_at', 'updated_at']; # Prevent SQL injection by allowing only specific fields to be sorted
        $sortBy = in_array($request->input('sort_by'), $allowedSorts) ? $request->input('sort_by') : 'created_at';
        $sortDirection = $request->input('sort_direction') === 'asc' ? 'asc' : 'desc';


        $categories = Category::filter($request->all())
            ->orderBy($sortBy, $sortDirection)
            ->paginate($perPage);

        return response()->json($categories);
    }


    public function show($id)
    {
        $category = Category::findOrFail($id);
        return response()->json($category);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:50',
        ]);
        $category = Category::create($validated);
        return response()->json(['message' => 'Categoría creada', 'category' => $category], 201);
    }

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'type' => 'sometimes|string|max:50',
        ]);
        $category->update($validated);
        return response()->json(['message' => 'Categoría actualizada', 'category' => $category], 200);
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();
        return response()->json(['message' => 'Categoría eliminada']);
    }
}
