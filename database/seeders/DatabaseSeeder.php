<?php

namespace Database\Seeders;

use App\Models\User;
use Database\Seeders\RoleSeeder;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Créer d'abord les rôles
        $this->call([
            RoleSeeder::class,
        ]);

        // Ensuite créer l'utilisateur test avec le rôle admin
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'role_id' => 1, // ID du rôle admin
        ]);
    }
}
