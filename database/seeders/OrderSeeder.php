<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Restaurant;
use App\Models\Role;
use App\Models\Driver;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $restaurants = Restaurant::all();
        $drivers = Driver::all();
        
        if ($drivers->isEmpty()) {
            throw new \Exception('No drivers found. Please ensure DeliveryUserSeeder has been run.');
        }

        $statuses = ['pending', 'preparing', 'delivering', 'delivered', 'cancelled'];
        $paymentMethods = ['cash', 'card'];

        foreach ($restaurants as $restaurant) {
            // Générer entre 5 et 15 commandes par restaurant
            $numOrders = rand(5, 15);
            
            for ($i = 0; $i < $numOrders; $i++) {
                $amount = rand(1500, 10000) / 100; // Entre 15€ et 100€
                $status = $statuses[array_rand($statuses)];
                $deliveredAt = null;
                $estimatedDeliveryTime = null;
                
                if ($status === 'delivered') {
                    $deliveredAt = Carbon::now()->subHours(rand(1, 72));
                } elseif ($status !== 'cancelled') {
                    $estimatedDeliveryTime = Carbon::now()->addMinutes(rand(30, 120));
                }

                $order = Order::create([
                    'restaurant_id' => $restaurant->id,
                    'user_id' => $restaurant->user_id, // L'utilisateur qui a passé la commande (admin du restaurant)
                    'driver_id' => $status !== 'pending' ? $drivers->random()->id : null,
                    'status' => $status,
                    'total_amount' => $amount,
                    'delivery_address' => rand(1, 100) . " Rue de la Livraison, Paris",
                    'delivery_latitude' => $restaurant->latitude + (rand(-100, 100) / 10000),
                    'delivery_longitude' => $restaurant->longitude + (rand(-100, 100) / 10000),
                    'special_instructions' => rand(0, 1) ? "Sonner à l'interphone" : null,
                    'estimated_delivery_time' => $estimatedDeliveryTime,
                    'delivered_at' => $deliveredAt,
                    'created_at' => $deliveredAt ? $deliveredAt->subMinutes(rand(30, 60)) : Carbon::now()->subHours(rand(1, 72)),
                ]);

                // Créer le paiement associé
                if ($status !== 'cancelled') {
                    Payment::create([
                        'order_id' => $order->id,
                        'payment_method' => $paymentMethods[array_rand($paymentMethods)],
                        'amount' => $amount,
                        'status' => $status === 'delivered' ? 'completed' : 'pending',
                        'transaction_id' => 'TRX' . strtoupper(uniqid()),
                        'created_at' => $order->created_at,
                    ]);
                }
            }
        }
    }
}
