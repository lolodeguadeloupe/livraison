<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Order;
use Illuminate\Http\Request;
use App\Http\Requests\PaymentRequest;
use Illuminate\Support\Facades\Auth;

class PaymentController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $payments = Payment::with('order')->get();

        return inertia('Payments/Index', [
            'payments' => $payments
        ]);
    }

    public function show(Payment $payment)
    {
        $payment->load('order');

        return inertia('Payments/Show', [
            'payment' => $payment
        ]);
    }

    // API endpoints
    public function apiIndex()
    {
        $this->authorize('viewAny', Payment::class);

        $payments = Payment::with('order')->get();

        return response()->json($payments);
    }

    public function apiStore(PaymentRequest $request, Order $order)
    {
        $this->authorize('create', [Payment::class, $order]);

        $payment = $order->payment()->create($request->validated());

        if ($payment->status === 'completed') {
            $order->update(['status' => 'confirmed']);
        }

        return response()->json($payment, 201);
    }

    public function apiShow(Payment $payment)
    {
        $this->authorize('view', $payment);

        $payment->load('order');

        return response()->json($payment);
    }

    public function webhook(Request $request)
    {
        // Validate webhook signature
        // Process payment status update
        // Update order status if needed
        
        return response()->json(['message' => 'Webhook processed successfully']);
    }
}
