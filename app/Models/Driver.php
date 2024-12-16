<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Order;
use App\Models\Review;

class Driver extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'vehicle_type',
        'vehicle_number',
        'license_number',
        'is_available',
        'is_verified',
        'current_latitude',
        'current_longitude'
    ];

    protected $casts = [
        'is_available' => 'boolean',
        'is_verified' => 'boolean',
        'current_latitude' => 'decimal:8',
        'current_longitude' => 'decimal:8'
    ];

    // Relations
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
