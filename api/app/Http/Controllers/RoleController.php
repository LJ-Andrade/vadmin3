<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Illuminate\Validation\Rule;
use App\Http\Resources\RoleResource;
use App\Helpers\DebugHelper;


class RoleController extends Controller
{
    public function index()
    {
        return RoleResource::collection(
            Role::orderBy('id', 'asc')->get()
        );
    }

 
   

    public function show($id)
    {
        $role = Role::findOrFail($id);

        return response()->json([
            'success' => true,
            'data'    => RoleResource::make($role)->resolve(),
        ]);
    }

    public function store(Request $request)
    {
        // return DebugHelper::ddJson($request->all(), true);
        return $this->save($request);
    }

    public function update(Request $request, $id)
    {
        // return DebugHelper::ddJson($request->all(), true);
        return $this->save($request, $id);
    }

    private function save(Request $request, $id = null)
    {
        // DebugHelper::ddJson($request->all(),true);

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

        return response()->json([
            'success' => true,
            'data'    => new RoleResource($role),
        ], $id ? 200 : 201);
    }



    public function destroy($id)
    {
        $role = Role::findOrFail($id);
        $role->delete();

        return response()->json(['success' => true]);
    }


}
