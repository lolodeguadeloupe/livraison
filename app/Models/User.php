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
        'role_id',
        'phone',
        'address',
        'latitude',
        'longitude'
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
     * Check if the user is an admin.
     *
     * @return bool
     */
    public function isAdmin()
    {
        return $this->role->slug === 'admin';
    }

    /**
     * Check if the user is a restaurant.
     *
     * @return bool
     */
    public function isRestaurant()
    {
        return $this->role->slug === 'restaurant';
    }

    /**
     * Check if the user is a driver.
     *
     * @return bool
     */
    public function isDriver()
    {
        return $this->role->slug === 'driver';
    }
}
