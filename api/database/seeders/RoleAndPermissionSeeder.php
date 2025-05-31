<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleAndPermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            'read', 'create', 'update', 'delete', 'ai',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'api',
            ]);
        }

        $superadmin = Role::firstOrCreate(['name' => 'superadmin', 'guard_name' => 'api']);
        $superadmin->syncPermissions(Permission::where('guard_name', 'api')->get());

        $admin = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'api']);
        $admin->syncPermissions(['read', 'create', 'update', 'delete']);

        $reader = Role::firstOrCreate(['name' => 'reader', 'guard_name' => 'api']);
        $reader->syncPermissions(['read']);

        $ai = Role::firstOrCreate(['name' => 'ai', 'guard_name' => 'api']);
        $ai->syncPermissions(['ai']);
    }
}
