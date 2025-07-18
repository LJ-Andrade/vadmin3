<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->all();
        $query = \App\Models\User::with(['roles', 'media']);
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('user',  'like', "%$search%")
                  ->orWhere('first_name','like', "%$search%")
                  ->orWhere('last_name','like', "%$search%")
                  ->orWhere('email','like', "%$search%");
            });
        }
        $users = $query->paginate(10);
        return response()->json($users);
    }

    public function show($id)
    {
        $user = \App\Models\User::with(['roles', 'media'])->findOrFail($id);
        $data = $user->toArray();
        $data['roles'] = $user->roles ? $user->roles->pluck('name')->toArray() : [];
        return response()->json($data);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user'   => 'required|string|max:255|unique:users,user',
            'email'      => 'required|email|max:255|unique:users,email',
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'password'   => 'required|string|min:8',
            'roles'      => 'array',
            'images'     => 'nullable|image|max:10000',
        ]);

        $roles = $validated['roles'] ?? [];
        $user = \App\Models\User::create(\Illuminate\Support\Arr::except($validated, ['roles', 'images', 'password']) + [
            'password' => bcrypt($validated['password']),
        ]);
        if ($roles) {
            $user->syncRoles($roles);
        }

        if( $request->hasFile('images') ) {
            $user->addMediaFromRequest('images')
                ->setFileName('avatar-'.$user->id.'.png')
                ->toMediaCollection('users');
        }

        $user->load(['roles', 'media']);
        $data = $user->toArray();
        $data['roles'] = $user->roles ? $user->roles->pluck('name')->toArray() : [];
        return response()->json([
            'message' => 'Usuario creado exitosamente',
            'user' => $data
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $user = \App\Models\User::findOrFail($id);
        $validated = $request->validate([
            'user'   => "sometimes|string|max:255|unique:users,user,{$user->id}",
            'email'      => "sometimes|email|max:255|unique:users,email,{$user->id}",
            'first_name' => 'sometimes|string|max:255',
            'last_name'  => 'sometimes|string|max:255',
            'password'   => 'sometimes|string|min:8',
            'roles'      => 'sometimes|array',
            'images' => 'sometimes|image|max:2048',
        ]);

        $roles = $validated['roles'] ?? null;
        if (isset($validated['password'])) {
            $validated['password'] = bcrypt($validated['password']);
        }
        $user->update(\Illuminate\Support\Arr::except($validated, ['roles', 'images']));
        if ($roles !== null) {
            $user->syncRoles($roles);
        }

        if ($request->hasFile('images')) {
            $user->addMediaFromRequest('images')
                ->setFileName('avatar-'.$user->id.'.png')
                ->toMediaCollection('users');
        }

        $user->load(['roles', 'media']);
        $data = $user->toArray();
        $data['roles'] = $user->roles ? $user->roles->pluck('name')->toArray() : [];
        return response()->json([
            'message' => 'Usuario actualizado exitosamente',
            'user' => $data
        ], 200);
    }

    public function destroy($id)
    {
        $user = \App\Models\User::findOrFail($id);
        $user->delete();
        return response()->json(null, 204);
    }
    
    /**
     * Obtiene un mensaje descriptivo para los errores de subida de archivos
     */
    private function getUploadErrorMessage($errorCode)
    {
        $errorMessages = [
            UPLOAD_ERR_INI_SIZE => 'El archivo excede el tamaño máximo permitido por PHP (' . ini_get('upload_max_filesize') . ')',
            UPLOAD_ERR_FORM_SIZE => 'El archivo excede el tamaño máximo permitido por el formulario',
            UPLOAD_ERR_PARTIAL => 'El archivo se subió parcialmente',
            UPLOAD_ERR_NO_FILE => 'No se subió ningún archivo',
            UPLOAD_ERR_NO_TMP_DIR => 'Falta la carpeta temporal',
            UPLOAD_ERR_CANT_WRITE => 'No se pudo escribir el archivo en el disco',
            UPLOAD_ERR_EXTENSION => 'Una extensión de PHP detuvo la subida del archivo'
        ];
        
        return $errorMessages[$errorCode] ?? 'Error desconocido en la subida';
    }
    
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('users')->singleFile();
    }
}
