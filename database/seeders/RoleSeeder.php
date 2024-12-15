<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'name' => 'Administrator',
                'slug' => 'admin',
                'description' => 'System administrator'
            ],
            [
                'name' => 'Restaurant',
                'slug' => 'restaurant',
                'description' => 'Restaurant owner/manager'
            ],
            [
                'name' => 'Driver',
                'slug' => 'driver',
                'description' => 'Delivery driver'
            ]
        ];

        foreach ($roles as $role) {
            \App\Models\Role::create($role);
        }
    }
}
