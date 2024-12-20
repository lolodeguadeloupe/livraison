<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole = Role::where('slug', 'admin')->first();

        if (!$adminRole) {
            throw new \Exception('Admin role not found. Please ensure RoleSeeder has been run first.');
        }

        User::create([
            'name' => 'Admin',
            'email' => 'admin@livraison.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'role_id' => $adminRole->id,
        ]);
    }
}
