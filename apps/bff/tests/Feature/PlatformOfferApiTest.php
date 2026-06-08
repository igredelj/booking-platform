<?php

namespace Tests\Feature;

use Tests\TestCase;

class PlatformOfferApiTest extends TestCase
{
    public function test_routes_endpoint_returns_platform_route_options(): void
    {
        $this->getJson('/api/flights/routes')
            ->assertOk()
            ->assertJsonPath('routes.0.id', 'LHR-BCN')
            ->assertJsonPath('routes.0.origin.airports.0.code', 'LHR')
            ->assertJsonPath('routes.0.destination.airports.0.code', 'BCN');
    }

    public function test_low_fare_calendar_endpoint_returns_platform_fare_dates(): void
    {
        $this->postJson('/api/flights/calendar', [
            'tripType' => 'round-trip',
            'origin' => 'LHR',
            'destination' => 'BCN',
            'departureDate' => '2026-07-12',
            'returnDate' => '2026-07-19',
            'passengers' => [
                'adult' => 2,
                'child' => 0,
                'senior' => 0,
            ],
            'directOnly' => false,
            'flexibleDates' => true,
        ])
            ->assertOk()
            ->assertJsonPath('dates.0.date', '2026-07-12')
            ->assertJsonPath('dates.0.price.currency', 'EUR');
    }

    public function test_availability_endpoint_returns_platform_flight_offers(): void
    {
        $this->postJson('/api/flights/offers', [
            'search' => [
                'tripType' => 'round-trip',
                'origin' => 'LHR',
                'destination' => 'BCN',
                'departureDate' => '2026-07-12',
                'returnDate' => '2026-07-19',
                'passengers' => [
                    'adult' => 2,
                    'child' => 0,
                    'senior' => 0,
                ],
                'directOnly' => false,
                'flexibleDates' => true,
            ],
            'bound' => 'outbound',
        ])
            ->assertOk()
            ->assertJsonPath('bound', 'outbound')
            ->assertJsonPath('flights.0.fareBundles.1.name', 'Smart')
            ->assertJsonPath('flights.0.fareBundles.1.providerReferences.offerId', 'offer-out-1-smart');
    }

    public function test_offer_endpoints_return_normalized_validation_errors(): void
    {
        $this->postJson('/api/flights/calendar', [
            'tripType' => 'round-trip',
            'origin' => 'LHR',
        ])
            ->assertStatus(422)
            ->assertJsonPath('error.code', 'VALIDATION_ERROR')
            ->assertJsonPath('error.fields.destination.0', 'The destination field is required.');
    }
}
