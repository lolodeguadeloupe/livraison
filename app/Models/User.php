<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'role_id',
        'phone',
        'address',
        'latitude',
        'longitude',
        'is_active'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8'
    ];

    // Relations
    /**
     * Get the role that owns the user.
     */
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * Get the restaurant that owns the user.
     */
    public function restaurant()
    {
        return $this->hasOne(Restaurant::class);
    }

    /**
     * Get the driver that owns the user.
     */
    public function driver()
    {
        return $this->hasOne(Driver::class);
    }

    /**
     * Get the orders that owns the user.
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Get the reviews that owns the user.
     */
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    // Helper methods
    /**
     * Check if the user has a specific role.
     *
     * @param string|array $role
     * @return bool
     */
    public function hasRole($role): bool
    {
        $userRole = $this->role()->first();
        if (!$userRole) {
            return false;
        }

        if (is_array($role)) {
            return in_array($userRole->slug, $role);
        }
        return $userRole->slug === $role;
    }

    /**
     * Check if the user has admin role
     */
    public function isAdmin(): bool
    {
        $userRole = $this->role()->first();
        return $userRole && $userRole->slug === 'admin';
    }

    /**
     * Check if the user has restaurant role
     */
    public function isRestaurant(): bool
    {
        $userRole = $this->role()->first();
        return $userRole && $userRole->slug === 'restaurant';
    }

    /**
     * Check if the user has driver role
     */
    public function isDriver(): bool
    {
        $userRole = $this->role()->first();
        return $userRole && $userRole->slug === 'driver';
    }

    /**
     * Check if the user has customer role
     */
    public function isCustomer(): bool
    {
        $userRole = $this->role()->first();
        return $userRole && $userRole->slug === 'customer';
    }
}