<?php

namespace Database\Factories;

use App\Models\Restaurant;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class RestaurantFactory extends Factory
{
    protected $model = Restaurant::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->company,
            'description' => $this->faker->text,
            'address' => $this->faker->address,
            'phone' => $this->faker->phoneNumber,
            'cuisine_type' => $this->faker->randomElement(['Italien', 'Français', 'Japonais', 'Indien', 'Mexicain']),
            'opening_hours' => json_encode([
                'lundi' => '9:00-22:00',
                'mardi' => '9:00-22:00',
                'mercredi' => '9:00-22:00',
                'jeudi' => '9:00-22:00',
                'vendredi' => '9:00-23:00',
                'samedi' => '10:00-23:00',
                'dimanche' => '10:00-22:00'
            ]),
            'is_active' => true,
            'rating' => $this->faker->randomFloat(1, 3.5, 5),
            'user_id' => User::factory()
        ];
    }
}
