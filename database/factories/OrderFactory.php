<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\User;
use App\Models\Restaurant;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'restaurant_id' => Restaurant::factory(),
            'driver_id' => null,
            'total_amount' => $this->faker->randomFloat(2, 10, 200),
            'status' => $this->faker->randomElement(['pending', 'preparing', 'delivering', 'delivered', 'cancelled'])
        ];
    }

    public function withDriver(): self
    {
        return $this->state(function (array $attributes) {
            return [
                'driver_id' => User::factory()->create([
                    'role_id' => \App\Models\Role::where('slug', 'driver')->first()?->id
                ])->id
            ];
        });
    }
}
