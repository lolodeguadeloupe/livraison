<?php

namespace App\Http\Controllers;

use App\Models\Driver;
use Illuminate\Http\Request;
use App\Http\Requests\DriverRequest;
use Illuminate\Support\Facades\Auth;

class DriverController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('role:admin,driver')->except(['index']);
    }

    public function index()
    {
        $drivers = Driver::with('user')
            ->when(request('available'), function ($query) {
                return $query->where('is_available', true);
            })
            ->when(request('search'), function ($query, $search) {
                return $query->whereHas('user', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
            })
            ->paginate(10);

        return inertia('Drivers/Index', [
            'drivers' => $drivers
        ]);
    }

    public function create()
    {
        return inertia('Drivers/Create');
    }

    public function store(DriverRequest $request)
    {
        $driver = Auth::user()->driver()->create($request->validated());

        return redirect()->route('drivers.show', $driver)
            ->with('success', 'Driver profile created successfully.');
    }

    public function show(Driver $driver)
    {
        $driver->load(['user', 'reviews' => function ($query) {
            $query->latest()->with('user')->take(5);
        }]);

        return inertia('Drivers/Show', [
            'driver' => $driver
        ]);
    }

    public function edit(Driver $driver)
    {
        $this->authorize('update', $driver);

        return inertia('Drivers/Edit', [
            'driver' => $driver
        ]);
    }

    public function update(DriverRequest $request, Driver $driver)
    {
        $this->authorize('update', $driver);
        
        $driver->update($request->validated());

        return redirect()->route('drivers.show', $driver)
            ->with('success', 'Driver profile updated successfully.');
    }

    public function destroy(Driver $driver)
    {
        $this->authorize('delete', $driver);
        
        $driver->delete();

        return redirect()->route('drivers.index')
            ->with('success', 'Driver profile deleted successfully.');
    }

    public function updateLocation(Request $request, Driver $driver)
    {
        $this->authorize('update', $driver);
        
        $request->validate([
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
        ]);

        $driver->update([
            'current_latitude' => $request->latitude,
            'current_longitude' => $request->longitude,
        ]);

        return response()->json($driver);
    }

    public function toggleAvailability(Driver $driver)
    {
        $this->authorize('update', $driver);
        
        $driver->update([
            'is_available' => !$driver->is_available,
        ]);

        return response()->json($driver);
    }

    // API endpoints
    public function apiIndex()
    {
        $drivers = Driver::with('user')
            ->when(request('available'), function ($query) {
                return $query->where('is_available', true);
            })
            ->when(request('search'), function ($query, $search) {
                return $query->whereHas('user', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
            })
            ->paginate(10);

        return response()->json($drivers);
    }

    public function apiStore(DriverRequest $request)
    {
        $driver = Auth::user()->driver()->create($request->validated());

        return response()->json($driver, 201);
    }

    public function apiShow(Driver $driver)
    {
        $driver->load(['user', 'reviews' => function ($query) {
            $query->latest()->with('user')->take(5);
        }]);

        return response()->json($driver);
    }

    public function apiUpdate(DriverRequest $request, Driver $driver)
    {
        $this->authorize('update', $driver);
        
        $driver->update($request->validated());

        return response()->json($driver);
    }

    public function apiDestroy(Driver $driver)
    {
        $this->authorize('delete', $driver);
        
        $driver->delete();

        return response()->json(null, 204);
    }
}
