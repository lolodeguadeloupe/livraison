<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Restaurant;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class RestaurantController extends Controller
{
    public function index()
    {
        $restaurants = Restaurant::with(['user', 'orders'])
            ->get()
            ->map(function ($restaurant) {
                return [
                    'id' => $restaurant->id,
                    'name' => $restaurant->name,
                    'address' => $restaurant->address,
                    'phone' => $restaurant->phone,
                    'orders_count' => $restaurant->orders->count(),
                    'is_active' => $restaurant->is_active,
                    'user' => [
                        'name' => $restaurant->user->name,
                        'email' => $restaurant->user->email
                    ]
                ];
            });

        return Inertia::render('Admin/Restaurants/Index', [
            'restaurants' => $restaurants
        ]);
    }

    public function show(Restaurant $restaurant)
    {
        // Charger les commandes du restaurant
        $orders = Order::where('restaurant_id', $restaurant->id)
            ->with(['driver', 'payment'])
            ->latest()
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'status' => $order->status,
                    'total_amount' => $order->total_amount,
                    'delivery_address' => $order->delivery_address,
                    'created_at' => $order->created_at,
                    'delivered_at' => $order->delivered_at,
                    'is_today' => $order->created_at->isToday(),
                    'driver' => $order->driver ? [
                        'id' => $order->driver->id,
                        'name' => $order->driver->user->name,
                        'phone' => $order->driver->user->phone
                    ] : null,
                    'payment' => $order->payment ? [
                        'status' => $order->payment->status,
                        'amount' => $order->payment->amount,
                        'payment_method' => $order->payment->payment_method
                    ] : null
                ];
            });

        // Statistiques du restaurant
        $stats = [
            'total_orders' => $orders->count(),
            'today_orders' => $orders->where('is_today', true)->count(),
            'total_revenue' => $orders->sum('total_amount'),
            'today_revenue' => $orders->where('is_today', true)->sum('total_amount'),
            'average_order_value' => $orders->avg('total_amount'),
            'completed_orders' => $orders->where('status', 'delivered')->count(),
            'pending_orders' => $orders->where('status', 'pending')->count()
        ];

        return Inertia::render('Admin/Restaurants/Show', [
            'restaurant' => array_merge($restaurant->toArray(), [
                'owner' => $restaurant->user->name,
                'stats' => $stats
            ]),
            'orders' => $orders,
            'todayOrders' => $orders->where('is_today', true)->values()
        ]);
    }
}
