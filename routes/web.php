<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RestaurantController;
use App\Http\Controllers\DriverController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DeliveryRequestController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Admin routes
    Route::middleware(['role:admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::resource('restaurants', RestaurantController::class);
        Route::resource('drivers', DriverController::class);
        Route::resource('orders', OrderController::class);
        // Admin payment routes
        Route::resource('payments', PaymentController::class)->only(['index', 'show']);
    });

    // Restaurant owner routes
    Route::middleware(['role:restaurant_owner'])->prefix('restaurant')->name('restaurant.')->group(function () {
        Route::get('/dashboard', [RestaurantController::class, 'dashboard'])->name('dashboard');
        Route::resource('orders', OrderController::class)->only(['index', 'show', 'update']);
        // Restaurant owner payment routes
        Route::get('/payments', [PaymentController::class, 'index'])->name('payments.index');
        Route::get('/payments/{payment}', [PaymentController::class, 'show'])->name('payments.show');
        // Restaurant owner restaurant routes
        Route::get('/restaurant', [RestaurantController::class, 'show'])->name('restaurant.show');
    });

    // Orders routes
    Route::resource('orders', OrderController::class);

    // Restaurants routes
    Route::resource('restaurants', RestaurantController::class)->except(['index', 'show'])->middleware('role:admin,restaurant');
    Route::get('restaurants', [RestaurantController::class, 'index'])->name('restaurants.index')->middleware('auth');
    Route::get('restaurants/{restaurant}', [RestaurantController::class, 'show'])->name('restaurants.show')->middleware('auth');
    Route::get('/restaurants/{restaurant}/orders', [RestaurantController::class, 'orders'])->name('restaurants.orders');
    
    // Drivers routes
    Route::resource('drivers', DriverController::class);
    
    // Reviews routes
    Route::resource('reviews', ReviewController::class);
    Route::post('reviews/{review}/respond', [ReviewController::class, 'respond'])->name('reviews.respond');
    
    Route::post('/orders/{order}/update-status', [OrderController::class, 'updateStatus'])
        ->name('orders.update-status');
});

Route::middleware(['auth'])->group(function () {
    // Routes pour les demandes de livraison
    Route::post('/orders/{order}/delivery-request', [DeliveryRequestController::class, 'store'])->name('delivery-requests.store');
    Route::get('/delivery-requests', [DeliveryRequestController::class, 'index'])->name('delivery-requests.index');
    Route::get('/delivery-requests/{deliveryRequest}', [DeliveryRequestController::class, 'show'])->name('delivery-requests.show');

    // Route pour voir les restaurants (différente selon le rôle)
    Route::get('/restaurants', [RestaurantController::class, 'index'])->name('restaurants.index');
    
    // Routes spécifiques aux propriétaires de restaurants
    Route::middleware(['role:restaurant'])->group(function () {
        Route::get('/restaurant/dashboard', [RestaurantController::class, 'dashboard'])->name('restaurant.dashboard');
    });
});

// Admin routes
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('dashboard');
    
    // Route pour le détail d'un restaurant
    Route::get('/restaurants/{restaurant}', [App\Http\Controllers\Admin\RestaurantController::class, 'show'])
        ->name('restaurants.show');
});

// Restaurant dashboard routes
Route::middleware(['auth', 'role:restaurant'])->prefix('restaurant')->name('restaurant.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Restaurant/Dashboard');
    })->name('dashboard');
});

// Driver dashboard routes
Route::middleware(['auth', 'role:driver'])->prefix('driver')->name('driver.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Driver/Dashboard');
    })->name('dashboard');
});

Route::middleware(['auth', 'is_restaurant_admin'])->group(function () {
    Route::get('/restaurant', [RestaurantController::class, 'index'])->name('restaurant.index');
    Route::get('/restaurant/edit', [RestaurantController::class, 'edit'])->name('restaurant.edit');
    Route::put('/restaurant/update', [RestaurantController::class, 'update'])->name('restaurant.update');
    // Ajoutez ici d'autres routes liées au restaurant si nécessaire
});

require __DIR__.'/auth.php';
