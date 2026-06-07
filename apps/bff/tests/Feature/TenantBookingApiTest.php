<?php

namespace Tests\Feature;

use Tests\TestCase;

class TenantBookingApiTest extends TestCase
{
    public function test_experience_profile_defaults_to_skywing(): void
    {
        $this->getJson('/api/experience-profile')
            ->assertOk()
            ->assertJsonPath('identity.customerId', 'skywing')
            ->assertJsonPath('identity.experienceId', 'skywing-default')
            ->assertJsonPath('brand.name', 'SkyWing')
            ->assertJsonPath('composition.id', 'bravo-smart-trip-builder')
            ->assertJsonPath('provider.id', 'mock');
    }

    public function test_legacy_tenant_config_route_returns_experience_profile(): void
    {
        $this->getJson('/api/tenant-config')
            ->assertOk()
            ->assertJsonPath('identity.customerId', 'skywing')
            ->assertJsonPath('brand.name', 'SkyWing');
    }

    public function test_search_results_are_branded_for_tenant(): void
    {
        $this->withHeader('X-Tenant-Id', 'skywing')
            ->postJson('/api/flights/search', [
                'origin' => 'ZAG',
                'destination' => 'AMS',
                'departureDate' => '2026-06-20',
                'returnDate' => '2026-06-27',
                'passengers' => [
                    'adult' => 1,
                    'child' => 0,
                    'senior' => 0,
                ],
            ])
            ->assertOk()
            ->assertJsonPath('flights.0.airline', 'SkyWing')
            ->assertJsonPath('flights.0.flightNumber', 'SW101');
    }
}
