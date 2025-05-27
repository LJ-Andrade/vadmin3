<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleAndPermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Lista de permisos
        $permissions = [
            'users.list',
            'users.store',
            'users.show',
            'users.update',
            'users.delete',
            // agrega más si los necesitás
        ];

        // Crear permisos con guard_name = 'api'
        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'api',
            ]);
        }

        // Crear rol admin con guard_name = 'api'
        $adminRole = Role::firstOrCreate([
            'name' => 'admin',
            'guard_name' => 'api',
        ]);

        // Asignar todos los permisos al rol admin
        $adminRole->syncPermissions(Permission::all());

        $this->command->info('Permisos y rol admin (guard: api) creados correctamente.');
    }
}
