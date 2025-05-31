<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // ADMIN
        $admin = User::firstOrCreate(
            ['email' => 'admin@admin.com'],
            [
                'first_name' => 'AdminNames',
                'last_name'  => 'Lastname',
                'user'       => 'admin',
                'password'   => bcrypt('admin123'),
            ]
        );
        $admin->assignRole('admin');
        $this->command->info('Usuario admin creado y rol asignado correctamente.');

        // SUPERADMIN
        $superadmin = User::firstOrCreate(
            ['email' => 'superadmin@admin.com'],
            [
                'first_name' => 'Super',
                'last_name'  => 'Admin',
                'user'       => 'superadmin',
                'password'   => bcrypt('superadmin123'),
            ]
        );
        $superadmin->assignRole('superadmin');
        $this->command->info('Usuario superadmin creado y rol asignado correctamente.');

        // AI USER
        $ai = User::firstOrCreate(
            ['email' => 'ai@demo.com'],
            [
                'first_name' => 'AI',
                'last_name'  => 'User',
                'user'       => 'aiuser',
                'password'   => bcrypt('ai123'),
            ]
        );
        $ai->assignRole('ai');
        $this->command->info('Usuario ai creado y rol asignado correctamente.');

        // READER
        $reader = User::firstOrCreate(
            ['email' => 'reader@demo.com'],
            [
                'first_name' => 'Reader',
                'last_name'  => 'Demo',
                'user'       => 'reader',
                'password'   => bcrypt('reader123'),
            ]
        );
        $reader->assignRole('reader');
        $this->command->info('Usuario reader creado y rol asignado correctamente.');

        // Reader + AI (multirol)
        $readerAi = User::firstOrCreate(
            ['email' => 'readerai@demo.com'],
            [
                'first_name' => 'ReaderAI',
                'last_name'  => 'Demo',
                'user'       => 'readerai',
                'password'   => bcrypt('readerai123'),
            ]
        );
        $readerAi->assignRole(['reader', 'ai']);
        $this->command->info('Usuario reader+ai creado y roles asignados correctamente.');

        // 20 usuarios random, todos con rol "reader"
        User::factory(20)->create()->each(function ($user) {
            $user->assignRole('reader');
        });
    }
}
