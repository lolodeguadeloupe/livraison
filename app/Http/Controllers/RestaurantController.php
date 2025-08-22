<?php

namespace App\Http\Controllers;

use App\Models\Restaurant;
use App\Models\Role;
use Illuminate\Http\Request;
use App\Http\Requests\RestaurantRequest;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\User; // Ajout de l'import du modèle User

class RestaurantController extends Controller
{
    
public function index()
{
    $user = auth()->user();
    
    // Préparation de la requête de base avec les relations
    $query = Restaurant::with(['user', 'orders']);

    // Si l'utilisateur a le rôle 'admin', on montre tous les restaurants
    if ($user->hasRole('admin')) {
        $restaurants = $query->latest()->get();
    } 
    // Si l'utilisateur est un restaurateur, on ne montre que son restaurant
    else if ($user->hasRole('restaurant')) {
        $restaurants = $query->where('user_id', $user->id)->get();
    }
    // Pour les autres utilisateurs (clients), on montre tous les restaurants actifs
    else {
        $restaurants = $query->where('is_active', true)->latest()->get();
    }

    // Transformation des données pour la vue
    $restaurantsData = $restaurants->map(function ($restaurant) {
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

    // Rendu de la vue appropriée selon le rôle
    if ($user->hasRole('admin')) {
        return Inertia::render('Admin/Restaurants/Index', [
            'restaurants' => $restaurantsData
        ]);
    }

    return Inertia::render('Restaurants/Index', [
        'restaurants' => $restaurantsData
    ]);
}

    public function dashboard()
    {
        $user = auth()->user();
        $restaurant = Restaurant::where('user_id', $user->id)
            ->with(['orders' => function($query) {
                $query->latest();
            }, 'orders.user', 'orders.driver'])
            ->firstOrFail();

        // Récupérer les commandes du jour
        $todayOrders = $restaurant->orders()
            ->whereDate('created_at', now()->toDateString())
            ->with(['user', 'driver'])
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'status' => $order->status,
                    'total_amount' => $order->total_amount,
                    'customer' => $order->user->name,
                    'driver' => $order->driver ? $order->driver->name : null,
                    'created_at' => $order->created_at
                ];
            });

        // Statistiques
        $stats = [
            'today_orders' => $todayOrders->count(),
            'total_orders' => $restaurant->orders->count(),
            'today_revenue' => $todayOrders->sum('total_amount'),
            'total_revenue' => $restaurant->orders->sum('total_amount'),
            'pending_orders' => $restaurant->orders->where('status', 'pending')->count(),
            'completed_orders' => $restaurant->orders->whereIn('status', ['delivered', 'completed'])->count(),
            'average_order_value' => $restaurant->orders->count() > 0 
                ? $restaurant->orders->average('total_amount') 
                : 0
        ];

        return Inertia::render('Restaurant/Dashboard', [
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
                'created_at' => $restaurant->created_at
            ],
            'orders' => $restaurant->orders->map(function ($order) {
                return [
                    'id' => $order->id,
                    'status' => $order->status,
                    'total_amount' => $order->total_amount,
                    'customer' => $order->user->name,
                    'driver' => $order->driver ? $order->driver->name : null,
                    'created_at' => $order->created_at
                ];
            }),
            'todayOrders' => $todayOrders,
            'stats' => $stats
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
        // Vérifier que l'utilisateur a le droit d'accéder à ce restaurant
        $user = auth()->user();
        $userRole = Role::find($user->role_id);
        
        if ($userRole->slug !== 'admin' && $restaurant->user_id !== $user->id) {
            return redirect()->back()->with('error', 'Vous n\'avez pas accès à ce restaurant.');
        }

        // Récupérer les commandes avec leurs relations
        $orders = $restaurant->orders()
            ->with(['user', 'driver'])
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'customer_name' => $order->user->name,
                    'driver_name' => $order->driver ? $order->driver->name : null,
                    'total_amount' => $order->total_amount,
                    'status' => $order->status,
                    'created_at' => $order->created_at,
                    'items' => $order->items // Si vous avez une relation pour les items de commande
                ];
            });

        // Séparer les commandes par statut
        $currentOrders = $orders->filter(function ($order) {
            return in_array($order['status'], ['pending', 'preparing', 'ready']);
        })->values();

        $upcomingOrders = $orders->filter(function ($order) {
            return $order['status'] === 'scheduled';
        })->values();

        $pastOrders = $orders->filter(function ($order) {
            return in_array($order['status'], ['delivered', 'cancelled']);
        })->values();

        // Préparer les données du restaurant
        $restaurantData = [
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
            'current_orders' => $currentOrders,
            'upcoming_orders' => $upcomingOrders,
            'past_orders' => $pastOrders,
            'total_orders' => $orders->count(),
            'total_revenue' => $orders->where('status', 'delivered')->sum('total_amount')
        ];

        return Inertia::render('Restaurants/Show', [
            'restaurant' => $restaurantData
        ]);
    }

    public function myRestaurant()
    {
        $user = auth()->user();
        $restaurant = Restaurant::where('user_id', $user->id)->firstOrFail();
        
        return $this->show($restaurant);
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

    public function orders(Restaurant $restaurant)
    {
        // Vérifier que l'utilisateur est autorisé à voir ces commandes
        $user = auth()->user()->load('role');
        if (!$user->isRestaurant() || $restaurant->user_id !== $user->id) {
            abort(403, 'Vous n\'êtes pas autorisé à voir ces commandes.');
        }

        $orders = $restaurant->orders()
            ->with(['user', 'driver'])
            ->latest()
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'created_at' => $order->created_at,
                    'status' => $order->status,
                    'total_amount' => $order->total_amount,
                    'user' => [
                        'name' => $order->user->name,
                        'email' => $order->user->email,
                    ],
                    'driver' => $order->driver ? [
                        'name' => $order->driver->user->name,
                        'phone' => $order->driver->phone,
                    ] : null,
                ];
            });

        return Inertia::render('Restaurant/Orders', [
            'restaurant' => [
                'id' => $restaurant->id,
                'name' => $restaurant->name,
            ],
            'orders' => $orders
        ]);
    }
}
