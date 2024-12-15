<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User;

class Restaurant extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'business_name',
        'business_phone',
        'business_address',
        'latitude',
        'longitude',
        'cuisine_type',
        'description',
        'is_open',
        'opening_time',
        'closing_time'
    ];

    protected $casts = [
        'is_open' => 'boolean',
        'opening_time' => 'datetime',
        'closing_time' => 'datetime',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
