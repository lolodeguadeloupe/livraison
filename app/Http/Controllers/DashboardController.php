<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\User;
use App\Models\Restaurant;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'todayOrders' => Order::whereDate('created_at', Carbon::today())->count(),
            'activeDrivers' => User::where('role', 'driver')->count(),
            'totalRestaurants' => Restaurant::count(),
            'totalOrders' => Order::count(),
            'revenue' => Order::where('status', 'completed')->sum('total_amount') ?? 0,
            'growthRate' => '12.5%',
        ];

        return Inertia::render('Dashboard', [
            'stats' => $stats
        ]);
    }
}
