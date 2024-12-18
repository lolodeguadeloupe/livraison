<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use App\Models\Restaurant;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class RestaurantSeeder extends Seeder
{
    public function run(): void
    {
        $restaurantRole = Role::where('slug', 'restaurant')->first();
        $restaurants = [
            ['name' => 'Le Petit Bistrot', 'cuisine' => 'French', 'lat' => 48.8566, 'lng' => 2.3522],
            ['name' => 'Pizza Roma', 'cuisine' => 'Italian', 'lat' => 48.8595, 'lng' => 2.3525],
            ['name' => 'Sushi Master', 'cuisine' => 'Japanese', 'lat' => 48.8605, 'lng' => 2.3530],
            ['name' => 'Burger House', 'cuisine' => 'American', 'lat' => 48.8575, 'lng' => 2.3515],
            ['name' => 'Thai Spice', 'cuisine' => 'Thai', 'lat' => 48.8585, 'lng' => 2.3518],
            ['name' => 'La Paella', 'cuisine' => 'Spanish', 'lat' => 48.8590, 'lng' => 2.3520],
            ['name' => 'Le Dragon d\'Or', 'cuisine' => 'Chinese', 'lat' => 48.8570, 'lng' => 2.3525],
            ['name' => 'Kebab Palace', 'cuisine' => 'Turkish', 'lat' => 48.8580, 'lng' => 2.3528],
            ['name' => 'Curry House', 'cuisine' => 'Indian', 'lat' => 48.8565, 'lng' => 2.3530],
            ['name' => 'Le Couscous', 'cuisine' => 'Moroccan', 'lat' => 48.8568, 'lng' => 2.3535],
        ];

        foreach ($restaurants as $index => $restaurantData) {
            // Créer l'administrateur du restaurant
            $admin = User::create([
                'name' => "Admin " . $restaurantData['name'],
                'email' => "admin" . ($index + 1) . "@" . strtolower(str_replace(' ', '', $restaurantData['name'])) . ".com",
                'password' => Hash::make('password'),
                'role_id' => $restaurantRole->id
            ]);

            // Créer le restaurant
            Restaurant::create([
                'user_id' => $admin->id,
                'name' => $restaurantData['name'],
                'description' => "Welcome to " . $restaurantData['name'] . ", serving the best " . $restaurantData['cuisine'] . " cuisine",
                'address' => "123 Food Street, Paris",
                'latitude' => $restaurantData['lat'],
                'longitude' => $restaurantData['lng'],
                'phone' => "+33 1 23 45 67 " . str_pad($index + 1, 2, '0', STR_PAD_LEFT),
                'cuisine_type' => $restaurantData['cuisine'],
                'opening_time' => '10:00',
                'closing_time' => '22:00',
            ]);
        }
    }
}
