<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Order;
use Illuminate\Http\Request;
use App\Http\Requests\ReviewRequest;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $reviews = Review::with(['user', 'restaurant', 'driver'])
            ->when(Auth::user()->isRestaurant(), function ($query) {
                return $query->where('restaurant_id', Auth::user()->restaurant->id);
            })
            ->when(Auth::user()->isDriver(), function ($query) {
                return $query->where('driver_id', Auth::user()->driver->id);
            })
            ->when(Auth::user()->isCustomer(), function ($query) {
                return $query->where('user_id', Auth::id());
            })
            ->latest()
            ->paginate(10);

        return inertia('Reviews/Index', [
            'reviews' => $reviews
        ]);
    }

    public function store(ReviewRequest $request, Order $order)
    {
        $this->authorize('create', [Review::class, $order]);

        $review = $order->review()->create(array_merge(
            $request->validated(),
            ['user_id' => Auth::id()]
        ));

        return redirect()->route('orders.show', $order)
            ->with('success', 'Review submitted successfully.');
    }

    public function show(Review $review)
    {
        $review->load(['user', 'restaurant', 'driver', 'order']);

        return inertia('Reviews/Show', [
            'review' => $review
        ]);
    }

    public function update(ReviewRequest $request, Review $review)
    {
        $this->authorize('update', $review);
        
        $review->update($request->validated());

        return redirect()->route('reviews.show', $review)
            ->with('success', 'Review updated successfully.');
    }

    public function destroy(Review $review)
    {
        $this->authorize('delete', $review);
        
        $review->delete();

        return redirect()->route('reviews.index')
            ->with('success', 'Review deleted successfully.');
    }

    // API endpoints
    public function apiIndex()
    {
        $reviews = Review::with(['user', 'restaurant', 'driver'])
            ->when(Auth::user()->isRestaurant(), function ($query) {
                return $query->where('restaurant_id', Auth::user()->restaurant->id);
            })
            ->when(Auth::user()->isDriver(), function ($query) {
                return $query->where('driver_id', Auth::user()->driver->id);
            })
            ->when(Auth::user()->isCustomer(), function ($query) {
                return $query->where('user_id', Auth::id());
            })
            ->latest()
            ->paginate(10);

        return response()->json($reviews);
    }

    public function apiStore(ReviewRequest $request, Order $order)
    {
        $this->authorize('create', [Review::class, $order]);

        $review = $order->review()->create(array_merge(
            $request->validated(),
            ['user_id' => Auth::id()]
        ));

        return response()->json($review, 201);
    }

    public function apiShow(Review $review)
    {
        $review->load(['user', 'restaurant', 'driver', 'order']);

        return response()->json($review);
    }

    public function apiUpdate(ReviewRequest $request, Review $review)
    {
        $this->authorize('update', $review);
        
        $review->update($request->validated());

        return response()->json($review);
    }

    public function apiDestroy(Review $review)
    {
        $this->authorize('delete', $review);
        
        $review->delete();

        return response()->json(null, 204);
    }
}
