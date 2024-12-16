<?php

namespace App\Http\Controllers;

use App\Models\Restaurant;
use Illuminate\Http\Request;
use App\Http\Requests\RestaurantRequest;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class RestaurantController extends Controller
{
    public function index()
    {
        $restaurants = Restaurant::with(['user', 'orders'])
            ->when(Auth::user()->isRestaurant(), function ($query) {
                return $query->where('user_id', Auth::id());
            })
            ->latest()
            ->get()
            ->map(function ($restaurant) {
                return [
                    'id' => $restaurant->id,
                    'name' => $restaurant->name,
                    'description' => $restaurant->description,
                    'address' => $restaurant->address,
                    'phone' => $restaurant->phone,
                    'cuisine_type' => $restaurant->cuisine_type,
                    'opening_hours' => $restaurant->opening_hours,
                    'is_active' => $restaurant->is_active,
                    'rating' => $restaurant->rating,
                    'total_orders' => $restaurant->orders->count(),
                    'owner' => $restaurant->user->name,
                    'created_at' => $restaurant->created_at
                ];
            });

        return Inertia::render('Restaurants/Index', [
            'restaurants' => $restaurants
        ]);
    }

    public function create()
    {
        return Inertia::render('Restaurants/Create');
    }

    public function store(RestaurantRequest $request)
    {
        $restaurant = Restaurant::create(array_merge(
            $request->validated(),
            ['user_id' => Auth::id()]
        ));

        return redirect()->route('restaurants.show', $restaurant)
            ->with('success', 'Restaurant créé avec succès.');
    }

    public function show(Restaurant $restaurant)
    {
        $restaurant->load(['user', 'orders.user', 'orders.driver', 'reviews.user']);
        
        return Inertia::render('Restaurants/Show', [
            'restaurant' => [
                'id' => $restaurant->id,
                'name' => $restaurant->name,
                'description' => $restaurant->description,
                'address' => $restaurant->address,
                'phone' => $restaurant->phone,
                'cuisine_type' => $restaurant->cuisine_type,
                'opening_hours' => $restaurant->opening_hours,
                'is_active' => $restaurant->is_active,
                'rating' => $restaurant->rating,
                'owner' => $restaurant->user->name,
                'created_at' => $restaurant->created_at,
                'orders' => $restaurant->orders->map(function ($order) {
                    return [
                        'id' => $order->id,
                        'status' => $order->status,
                        'total_amount' => $order->total_amount,
                        'customer' => $order->user->name,
                        'driver' => $order->driver ? $order->driver->user->name : null,
                        'created_at' => $order->created_at
                    ];
                }),
                'reviews' => $restaurant->reviews->map(function ($review) {
                    return [
                        'id' => $review->id,
                        'rating' => $review->rating,
                        'comment' => $review->comment,
                        'user' => $review->user->name,
                        'created_at' => $review->created_at
                    ];
                })
            ]
        ]);
    }

    public function edit(Restaurant $restaurant)
    {
        return Inertia::render('Restaurants/Edit', [
            'restaurant' => $restaurant
        ]);
    }

    public function update(RestaurantRequest $request, Restaurant $restaurant)
    {
        $restaurant->update($request->validated());

        return redirect()->route('restaurants.show', $restaurant)
            ->with('success', 'Restaurant mis à jour avec succès.');
    }

    public function destroy(Restaurant $restaurant)
    {
        $restaurant->delete();

        return redirect()->route('restaurants.index')
            ->with('success', 'Restaurant supprimé avec succès.');
    }
}
