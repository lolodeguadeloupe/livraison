<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RestaurantController;
use App\Http\Controllers\DriverController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\DashboardController;
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

    // Orders routes
    Route::resource('orders', OrderController::class);
    
    // Restaurants routes
    Route::resource('restaurants', RestaurantController::class)->except(['index', 'show'])->middleware('role:admin,restaurant');
    Route::get('restaurants', [RestaurantController::class, 'index'])->name('restaurants.index');
    Route::get('restaurants/{restaurant}', [RestaurantController::class, 'show'])->name('restaurants.show');
    
    // Drivers routes
    Route::resource('drivers', DriverController::class);
    
    // Payments routes
    Route::resource('payments', PaymentController::class);
    
    // Reviews routes
    Route::resource('reviews', ReviewController::class);
    Route::post('reviews/{review}/respond', [ReviewController::class, 'respond'])->name('reviews.respond');
});

// Admin routes
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('dashboard');
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

require __DIR__.'/auth.php';
