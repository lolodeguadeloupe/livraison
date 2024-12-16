<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
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
        $orders = Order::with(['user', 'restaurant', 'driver'])
            ->when(Auth::user()->isRestaurant(), function ($query) {
                return $query->where('restaurant_id', Auth::user()->restaurant->id);
            })
            ->when(Auth::user()->isDriver(), function ($query) {
                return $query->where('driver_id', Auth::user()->driver->id);
            })
            ->when(Auth::user()->isCustomer(), function ($query) {
                return $query->where('user_id', Auth::user()->id);
            })
            ->latest()
            ->get();

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

    public function updateStatus(Request $request, Order $order)
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
