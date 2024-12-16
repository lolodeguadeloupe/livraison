<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RestaurantController;
use App\Http\Controllers\DriverController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ReviewController;

Route::middleware('auth:sanctum')->group(function () {
    // Restaurants
    Route::prefix('restaurants')->group(function () {
        Route::get('/', [RestaurantController::class, 'apiIndex']);
        Route::post('/', [RestaurantController::class, 'apiStore']);
        Route::get('/{restaurant}', [RestaurantController::class, 'apiShow']);
        Route::put('/{restaurant}', [RestaurantController::class, 'apiUpdate']);
        Route::delete('/{restaurant}', [RestaurantController::class, 'apiDestroy']);
    });

    // Drivers
    Route::prefix('drivers')->group(function () {
        Route::get('/', [DriverController::class, 'apiIndex']);
        Route::post('/', [DriverController::class, 'apiStore']);
        Route::get('/{driver}', [DriverController::class, 'apiShow']);
        Route::put('/{driver}', [DriverController::class, 'apiUpdate']);
        Route::delete('/{driver}', [DriverController::class, 'apiDestroy']);
        Route::post('/{driver}/location', [DriverController::class, 'updateLocation']);
        Route::post('/{driver}/toggle-availability', [DriverController::class, 'toggleAvailability']);
    });

    // Orders
    Route::prefix('orders')->group(function () {
        Route::get('/', [OrderController::class, 'apiIndex']);
        Route::post('/', [OrderController::class, 'apiStore']);
        Route::get('/{order}', [OrderController::class, 'apiShow']);
        Route::put('/{order}', [OrderController::class, 'apiUpdate']);
        Route::post('/{order}/status', [OrderController::class, 'apiUpdateStatus']);
        Route::post('/{order}/assign-driver', [OrderController::class, 'assignDriver']);
    });

    // Payments
    Route::prefix('payments')->group(function () {
        Route::post('/orders/{order}/payment', [PaymentController::class, 'apiStore']);
        Route::get('/{payment}', [PaymentController::class, 'apiShow']);
    });

    // Reviews
    Route::prefix('reviews')->group(function () {
        Route::get('/', [ReviewController::class, 'apiIndex']);
        Route::post('/orders/{order}/review', [ReviewController::class, 'apiStore']);
        Route::get('/{review}', [ReviewController::class, 'apiShow']);
        Route::put('/{review}', [ReviewController::class, 'apiUpdate']);
        Route::delete('/{review}', [ReviewController::class, 'apiDestroy']);
    });
});

// Payment webhooks (no auth required)
Route::post('webhooks/payment', [PaymentController::class, 'webhook']);
