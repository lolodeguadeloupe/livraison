<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Role;
use App\Models\Restaurant;
use Illuminate\Foundation\Testing\RefreshDatabase;

class RoleMiddlewareTest extends TestCase
{
    use RefreshDatabase;

    private $adminRole;
    private $ownerRole;

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
    }

    public function test_middleware_redirects_unauthenticated_users()
    {
        $response = $this->get('/admin/restaurants');
        $response->assertRedirect('/login');
    }

    public function test_middleware_allows_admin_access()
    {
        $admin = User::factory()->create([
            'role_id' => $this->adminRole->id
        ]);

        $response = $this->actingAs($admin)->get('/admin/restaurants');
        $response->assertStatus(200);
    }

    public function test_middleware_denies_restaurant_owner_access_to_admin_area()
    {
        $owner = User::factory()->create([
            'role_id' => $this->ownerRole->id
        ]);

        Restaurant::factory()->create([
            'user_id' => $owner->id
        ]);

        $response = $this->actingAs($owner)->get('/admin/restaurants');
        $response->assertRedirect('/restaurant/dashboard');
    }

    public function test_middleware_allows_restaurant_owner_access_to_dashboard()
    {
        $owner = User::factory()->create([
            'role_id' => $this->ownerRole->id
        ]);

        Restaurant::factory()->create([
            'user_id' => $owner->id
        ]);

        $response = $this->actingAs($owner)->get('/restaurant/dashboard');
        $response->assertStatus(200);
    }

    public function test_middleware_handles_user_without_role()
    {
        $user = User::factory()->create([
            'role_id' => null
        ]);

        $response = $this->actingAs($user)->get('/admin/restaurants');
        $response->assertRedirect('/login')
                 ->assertSessionHas('error', 'Rôle non défini.');
    }
}
