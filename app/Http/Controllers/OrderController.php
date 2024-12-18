<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Driver;
use Illuminate\Http\Request;
use App\Http\Requests\OrderRequest;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'verified']); 
    }

    public function index()
    {
        $user = Auth::user()->load(['role', 'restaurant', 'driver']);
        
        $orders = Order::with(['user', 'restaurant.user', 'driver.user', 'user.role'])
            ->when($user->isRestaurant(), function ($query) use ($user) {
                return $query->where('restaurant_id', $user->restaurant?->id);
            })
            ->when($user->isDriver(), function ($query) use ($user) {
                return $query->where('driver_id', $user->driver?->id);
            })
            ->when($user->isCustomer(), function ($query) use ($user) {
                return $query->where('user_id', $user->id);
            })
            ->latest()
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'created_at' => $order->created_at,
                    'status' => $order->status,
                    'total_amount' => $order->total_amount,
                    'user' => $order->user ? [
                        'name' => $order->user->name,
                        'email' => $order->user->email,
                    ] : null,
                    'restaurant' => $order->restaurant ? [
                        'name' => $order->restaurant->name,
                        'address' => $order->restaurant->address,
                        'user' => $order->restaurant->user ? [
                            'name' => $order->restaurant->user->name,
                            'email' => $order->restaurant->user->email,
                        ] : null,
                    ] : null,
                    'driver' => $order->driver ? [
                        'user' => $order->driver->user ? [
                            'name' => $order->driver->user->name,
                        ] : null,
                        'phone' => $order->driver->phone,
                    ] : null,
                    'restaurant_id' => $order->restaurant_id,
                    'driver_id' => $order->driver_id,
                ];
            });

        return Inertia::render('Orders/Index', [
            'orders' => $orders
        ]);
    }

    public function store(OrderRequest $request)
    {
        $order = Auth::user()->orders()->create($request->validated());

        return redirect()->route('orders.show', $order)
            ->with('success', 'Order placed successfully.');
    }

    public function show(Order $order)
    {
        $this->authorize('view', $order);

        $order->load(['user', 'restaurant', 'driver', 'payment']);

        return inertia('Orders/Show', [
            'order' => $order
        ]);
    }

    public function update(OrderRequest $request, Order $order)
    {
        $this->authorize('update', $order);
        
        $order->update($request->validated());

        return redirect()->route('orders.show', $order)
            ->with('success', 'Order updated successfully.');
    }

    public function assignDriver(Request $request, Order $order)
    {
        $this->authorize('update', $order);

        $request->validate([
            'driver_id' => ['required', 'exists:drivers,id']
        ]);

        $driver = Driver::findOrFail($request->driver_id);
        
        if (!$driver->is_available) {
            return back()->with('error', 'Selected driver is not available.');
        }

        $order->update([
            'driver_id' => $driver->id,
            'status' => 'assigned_to_driver'
        ]);

        return redirect()->route('orders.show', $order)
            ->with('success', 'Driver assigned successfully.');
    }

    public function updateStatus(Order $order, Request $request)
    {
        $request->validate([
            'status' => ['required', 'string', 'in:pending,preparing,ready,delivering,delivered,cancelled'],
        ]);

        // Vérifier les autorisations
        $user = auth()->user()->load(['role', 'restaurant', 'driver']);

        // Vérifier que l'utilisateur a le droit de changer ce statut
        $allowedStatusChanges = [
            'restaurant' => [
                'pending' => ['preparing', 'cancelled'],
                'preparing' => ['ready'],
            ],
            'driver' => [
                'ready' => ['delivering'],
                'delivering' => ['delivered'],
            ],
        ];

        $userRole = $user->isRestaurant() ? 'restaurant' : ($user->isDriver() ? 'driver' : null);

        if (!$userRole || !isset($allowedStatusChanges[$userRole][$order->status]) || 
            !in_array($request->status, $allowedStatusChanges[$userRole][$order->status])) {
            return back()->with('error', 'Vous n\'êtes pas autorisé à effectuer ce changement de statut.');
        }

        // Pour un restaurant, vérifier que c'est bien son restaurant
        if ($user->isRestaurant() && $order->restaurant_id !== $user->restaurant->id) {
            return back()->with('error', 'Cette commande n\'appartient pas à votre restaurant.');
        }

        // Pour un livreur, vérifier que c'est bien sa commande
        if ($user->isDriver() && $order->driver_id !== $user->driver->id) {
            return back()->with('error', 'Cette commande ne vous est pas assignée.');
        }

        $order->update(['status' => $request->status]);

        return back()->with('success', 'Le statut de la commande a été mis à jour.');
    }

    public function updateStatusOld(Request $request, Order $order)
    {
        $this->authorize('update', $order);

        $request->validate([
            'status' => ['required', 'string', 'in:pending,confirmed,preparing,ready_for_pickup,picked_up,delivered,cancelled']
        ]);

        $order->update([
            'status' => $request->status,
            'delivered_at' => $request->status === 'delivered' ? now() : null
        ]);

        return redirect()->route('orders.show', $order)
            ->with('success', 'Order status updated successfully.');
    }

    // API endpoints
    public function apiIndex()
    {
        $orders = Order::with(['user', 'restaurant', 'driver'])
            ->when(Auth::user()->isRestaurant(), function ($query) {
                return $query->where('restaurant_id', Auth::user()->restaurant->id);
            })
            ->when(Auth::user()->isDriver(), function ($query) {
                return $query->where('driver_id', Auth::user()->driver->id);
            })
            ->when(Auth::user()->isCustomer(), function ($query) {
                return $query->where('user_id', Auth::id());
            })
            ->when(request('status'), function ($query, $status) {
                return $query->where('status', $status);
            })
            ->latest()
            ->paginate(10);

        return response()->json($orders);
    }

    public function apiStore(OrderRequest $request)
    {
        $order = Auth::user()->orders()->create($request->validated());

        return response()->json($order, 201);
    }

    public function apiShow(Order $order)
    {
        $this->authorize('view', $order);

        $order->load(['user', 'restaurant', 'driver', 'payment']);

        return response()->json($order);
    }

    public function apiUpdate(OrderRequest $request, Order $order)
    {
        $this->authorize('update', $order);
        
        $order->update($request->validated());

        return response()->json($order);
    }

    public function apiUpdateStatus(Request $request, Order $order)
    {
        $this->authorize('update', $order);

        $request->validate([
            'status' => ['required', 'string', 'in:pending,confirmed,preparing,ready_for_pickup,picked_up,delivered,cancelled']
        ]);

        $order->update([
            'status' => $request->status,
            'delivered_at' => $request->status === 'delivered' ? now() : null
        ]);

        return response()->json($order);
    }
}
