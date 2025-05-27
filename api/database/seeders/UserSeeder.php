<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@admin.com'],
            [
                'first_name' => 'AdminNames',
                'last_name' => 'Lastname',
                'user' => 'admin',
                'password' => bcrypt('admin123'),
            ]
        );
        
        $admin->assignRole('admin');
        
        $this->command->info('Usuario admin creado y rol asignado correctamente.');
    }
}
