<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\DeliveryRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DeliveryRequestController extends Controller
{
    public function store(Order $order)
    {
        // Vérifier que l'utilisateur est bien le propriétaire du restaurant
        if ($order->restaurant->user_id !== Auth::id()) {
            abort(403);
        }

        // Créer la demande de livraison
        $deliveryRequest = DeliveryRequest::create([
            'restaurant_id' => $order->restaurant_id,
            'order_id' => $order->id,
            'status' => 'pending',
            'delivery_fee' => $this->calculateDeliveryFee($order),
            'special_instructions' => $order->special_instructions,
            'estimated_delivery_time' => now()->addMinutes(45), // Temps estimé par défaut
        ]);

        return redirect()->back()->with('success', 'Demande de livraison créée avec succès');
    }

    private function calculateDeliveryFee(Order $order)
    {
        // Logique de calcul des frais de livraison
        // Pour l'instant, on met un montant fixe
        return 5.00;
    }

    public function index()
    {
        $deliveryRequests = DeliveryRequest::query()
            ->when(Auth::user()->isRestaurant(), function ($query) {
                return $query->whereHas('restaurant', function ($q) {
                    $q->where('user_id', Auth::id());
                });
            })
            ->with(['restaurant', 'order'])
            ->latest()
            ->get();

        return Inertia::render('DeliveryRequests/Index', [
            'deliveryRequests' => $deliveryRequests
        ]);
    }

    public function show(DeliveryRequest $deliveryRequest)
    {
        // Vérifier l'accès
        if (Auth::user()->isRestaurant() && $deliveryRequest->restaurant->user_id !== Auth::id()) {
            abort(403);
        }

        $deliveryRequest->load(['restaurant', 'order', 'driver']);

        return Inertia::render('DeliveryRequests/Show', [
            'deliveryRequest' => $deliveryRequest
        ]);
    }
}
