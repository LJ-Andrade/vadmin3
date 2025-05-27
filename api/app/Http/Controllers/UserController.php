<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    // public function index()
    // {
    //     $users = User::paginate(10);
    //     return response()->json(['success' => true, 'data' => $users]);
    // }

    public function index(Request $request)
    {
        // Paginación, por si querés pasar por query el tamaño de página
        $perPage = $request->input('per_page', 10);
        $users = \App\Models\User::paginate($perPage);

        // Adaptar la respuesta al formato de tu frontend
        $pagination = [
            "current_page"       => $users->currentPage(),
            "data"               => $users->items(),
            "first_page_url"     => $users->url(1),
            "from"               => $users->firstItem(),
            "last_page"          => $users->lastPage(),
            "last_page_url"      => $users->url($users->lastPage()),
            "links"              => $users->linkCollection()->toArray(), // Laravel >= 8
            "next_page_url"      => $users->nextPageUrl(),
            "path"               => $users->path(),
            "list_regs_per_page" => $users->perPage(), // Nombre específico para tu frontend
            "per_page"           => $users->perPage(),
            "prev_page_url"      => $users->previousPageUrl(),
            "to"                 => $users->lastItem(),
            "total"              => $users->total(),
        ];

        return response()->json([
            "success"    => true,
            "pagination" => $pagination,
            "message"    => null,
        ]);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8'
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $user = User::create($validated);

        return response()->json(['success' => true, 'message' => 'User created', 'data' => $user]);
    }

    public function show(User $user)
    {
        return response()->json(['success' => true, 'data' => $user]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => ['sometimes', 'required', 'email', Rule::unique('users')->ignore($user->id)],
            'password' => 'sometimes|required|min:8'
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return response()->json(['success' => true, 'message' => 'User updated', 'data' => $user]);
    }

    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(['success' => true, 'message' => 'User deleted']);
    }
}
