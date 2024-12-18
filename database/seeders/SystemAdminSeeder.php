<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SystemAdminSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole = Role::where('slug', 'admin')->first();

        // Premier administrateur
        User::create([
            'name' => 'System Administrator',
            'email' => 'admin@livraison.com',
            'password' => Hash::make('admin123!@#'),
            'role_id' => $adminRole->id,
        ]);

        // Second administrateur
        User::create([
            'name' => 'Second Administrator',
            'email' => 'admin2@livraison.com',
            'password' => Hash::make('password'),
            'role_id' => $adminRole->id,
        ]);
    }
}
