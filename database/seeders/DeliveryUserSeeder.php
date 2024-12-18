<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use App\Models\Driver;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DeliveryUserSeeder extends Seeder
{
    public function run(): void
    {
        $deliveryRole = Role::where('slug', 'driver')->first();
        
        if (!$deliveryRole) {
            throw new \Exception('Driver role not found. Please ensure RoleSeeder has been run first.');
        }
        
        $vehicleTypes = ['Scooter', 'Vélo', 'Voiture'];
        $deliveryUsers = [
            'Jean Dupont', 'Marie Martin', 'Pierre Bernard', 'Sophie Petit',
            'Lucas Dubois', 'Emma Leroy', 'Thomas Moreau', 'Julie Roux',
            'Nicolas Lambert', 'Laura Michel', 'Antoine Simon', 'Claire David',
            'Paul Henri', 'Sarah Bertrand', 'Marc Robert'
        ];

        foreach ($deliveryUsers as $index => $name) {
            $user = User::create([
                'name' => $name,
                'email' => strtolower(str_replace(' ', '.', $name)) . "@delivery.com",
                'password' => Hash::make('password'),
                'role_id' => $deliveryRole->id
            ]);

            // Créer l'entrée correspondante dans la table drivers
            Driver::create([
                'user_id' => $user->id,
                'vehicle_type' => $vehicleTypes[array_rand($vehicleTypes)],
                'license_number' => 'LIC' . str_pad($index + 1, 4, '0', STR_PAD_LEFT),
                'is_available' => true,
                'current_latitude' => 48.8566 + (rand(-100, 100) / 10000), // Paris area
                'current_longitude' => 2.3522 + (rand(-100, 100) / 10000),
                'vehicle_number' => Str::random(10),
            ]);
        }
    }
}
