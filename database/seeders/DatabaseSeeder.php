<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use Database\Seeders\RoleSeeder;
use Database\Seeders\SystemAdminSeeder;
use Database\Seeders\RestaurantSeeder;
use Database\Seeders\DeliveryUserSeeder;
use Database\Seeders\OrderSeeder;
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
            SystemAdminSeeder::class,
            RestaurantSeeder::class,
            DeliveryUserSeeder::class,
            OrderSeeder::class,
        ]);

        // Créer l'utilisateur test
        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // Assigner le rôle admin à l'utilisateur test
        $adminRole = Role::where('slug', 'admin')->first();
        if ($adminRole) {
            $user->update(['role_id' => $adminRole->id]);
        }

        // Créer l'utilisateur admin
        // $this->call([
        //     AdminUserSeeder::class,
        // ]);
    }
}
