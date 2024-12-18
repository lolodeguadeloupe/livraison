<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Role;
use App\Models\Restaurant;
use App\Models\Order;
use App\Models\Driver;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

class RestaurantControllerTest extends TestCase
{
    use RefreshDatabase;

    private $admin;
    private $owner;
    private $restaurant;
    private $adminRole;
    private $ownerRole;
    private $driver;

    protected function setUp(): void
    {
        parent::setUp();

        // Créer les rôles
        $this->adminRole = Role::create([
            'name' => 'Administrateur',
            'slug' => 'admin',
            'description' => 'Administrateur du système'
        ]);

        $this->ownerRole = Role::create([
            'name' => 'Propriétaire',
            'slug' => 'restaurant_owner',
            'description' => 'Propriétaire de restaurant'
        ]);

        // Créer les utilisateurs
        $this->admin = User::factory()->create([
            'role_id' => $this->adminRole->id
        ]);

        $this->owner = User::factory()->create([
            'role_id' => $this->ownerRole->id
        ]);

        // Créer le chauffeur
        $driverUser = User::factory()->create([
            'role_id' => Role::create([
                'name' => 'Chauffeur',
                'slug' => 'driver',
                'description' => 'Chauffeur livreur'
            ])->id
        ]);
        
        $this->driver = Driver::factory()->create([
            'user_id' => $driverUser->id
        ]);

        // Créer le restaurant
        $this->restaurant = Restaurant::factory()->create([
            'user_id' => $this->owner->id
        ]);

        // Créer quelques commandes
        Order::factory()->count(3)->create([
            'restaurant_id' => $this->restaurant->id,
            'status' => 'pending'
        ]);

        Order::factory()->count(2)->create([
            'restaurant_id' => $this->restaurant->id,
            'driver_id' => $this->driver->id,
            'status' => 'delivered'
        ]);
    }

    public function test_admin_can_view_all_restaurants()
    {
        $response = $this->actingAs($this->admin)->get('/admin/restaurants');
        
        $response->assertStatus(200)
                 ->assertInertia(fn (Assert $page) => $page
                     ->component('Admin/Restaurants/Index')
                     ->has('restaurants')
                 );
    }

    public function test_owner_is_redirected_to_dashboard()
    {
        $response = $this->actingAs($this->owner)->get('/admin/restaurants');
        $response->assertRedirect('/restaurant/dashboard');
    }

    public function test_owner_can_view_own_restaurant_dashboard()
    {
        $response = $this->actingAs($this->owner)->get('/restaurant/dashboard');
        
        $response->assertStatus(200)
                 ->assertInertia(fn (Assert $page) => $page
                     ->component('Restaurant/Dashboard')
                     ->has('restaurant')
                     ->has('orders')
                     ->has('todayOrders')
                     ->has('stats')
                 );
    }

    public function test_owner_cannot_view_other_restaurants()
    {
        $otherOwner = User::factory()->create([
            'role_id' => $this->ownerRole->id
        ]);

        $otherRestaurant = Restaurant::factory()->create([
            'user_id' => $otherOwner->id
        ]);

        $response = $this->actingAs($this->owner)
                        ->get("/admin/restaurants/{$otherRestaurant->id}");
        
        $response->assertRedirect('/restaurant/dashboard');
    }

    public function test_admin_can_view_specific_restaurant()
    {
        $response = $this->actingAs($this->admin)
                        ->get("/admin/restaurants/{$this->restaurant->id}");
        
        $response->assertStatus(200)
                 ->assertInertia(fn (Assert $page) => $page
                     ->component('Admin/Restaurants/Show')
                     ->has('restaurant')
                 );
    }

    public function test_restaurant_orders_have_correct_driver_relations()
    {
        $order = Order::where('restaurant_id', $this->restaurant->id)
                     ->where('driver_id', $this->driver->id)
                     ->first();

        $this->assertNotNull($order);
        $this->assertInstanceOf(Driver::class, $order->driver);
        $this->assertEquals($this->driver->id, $order->driver->id);
        $this->assertEquals($this->driver->user->id, $order->driver->user->id);
    }
}
