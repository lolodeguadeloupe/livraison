<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->string('description')->nullable();
            $table->timestamps();
        });

        // Insert default roles
        DB::table('roles')->insert([
            [
                'name' => 'admin',
                'slug' => 'admin',
                'description' => 'Administrator'
            ],
            [
                'name' => 'restaurant',
                'slug' => 'restaurant',
                'description' => 'Restaurant Owner'
            ],
            [
                'name' => 'driver',
                'slug' => 'driver',
                'description' => 'Delivery Driver'
            ],
            [
                'name' => 'customer',
                'slug' => 'customer',
                'description' => 'Customer'
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('roles');
    }
};
