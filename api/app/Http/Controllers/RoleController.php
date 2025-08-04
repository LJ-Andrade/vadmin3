<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Illuminate\Validation\Rule;

class RoleController extends Controller
{

    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $roles = Role::paginate($perPage);
        return response()->json($roles); 
    }

    public function all(Request $request)
    {
        $roles = Role::all();
        return response()->json($roles);
    }


    public function show($id)
    {
        $role = Role::with('permissions')->findOrFail($id);
        $data = [
            'id' => $role->id,
            'name' => $role->name,
            'guard_name' => $role->guard_name,
            'created_at' => $role->created_at,
            'updated_at' => $role->updated_at,
            'permissions' => $role->permissions->pluck('name')->toArray(),
        ];
        return response()->json(['success' => true, 'data' => $data]);
    }

    public function store(Request $request)
    {
        return $this->save($request);
    }

    public function update(Request $request, $id)
    {
        return $this->save($request, $id);
    }

    private function save(Request $request, $id = null)
    {
        $rules = [
            'name' => ['required', 'string', 'filled', 'max:255', Rule::unique('roles', 'name')],
        ];
        if ($id) {
            $rules['name'][] = Rule::unique('roles', 'name')->ignore($id);
        }
        $validated = $request->validate($rules);
        $role = Role::firstOrNew(['id' => $id]);
        $role->fill($validated);
        $role->save();
        if ($request->has('permissions')) {
            $role->syncPermissions($request->input('permissions', []));
        }
        $role->load('permissions');
        $data = [
            'id' => $role->id,
            'name' => $role->name,
            'guard_name' => $role->guard_name,
            'created_at' => $role->created_at,
            'updated_at' => $role->updated_at,
            'permissions' => $role->permissions->pluck('name')->toArray(),
        ];
        return response()->json([
            'success' => true,
            'data'    => $data,
        ], $id ? 200 : 201);
    }

    public function destroy($id)
    {
        $role = Role::findOrFail($id);
        $role->delete();
        return response()->json(['success' => true]);
    }
}
