<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (!$request->user()) {
            return redirect()->route('login');
        }

        $userRole = $request->user()->role()->first();
        if (!$userRole) {
            return redirect()->route('login')->with('error', 'Rôle non défini.');
        }

        // Si l'utilisateur a un des rôles autorisés
        if (in_array($userRole->slug, $roles)) {
            return $next($request);
        }

        // Si c'est un propriétaire de restaurant, le rediriger vers son tableau de bord
        if ($userRole->slug === 'restaurant_owner') {
            return redirect()->route('restaurant.dashboard');
        }

        abort(403, 'Action non autorisée.');
    }
}
