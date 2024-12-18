<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsRestaurantAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check() || !auth()->user()->hasRole('restaurant')) {
            return redirect('/')->with('error', 'Accès non autorisé.');
        }

        return $next($request);
    }
} 