<?php

namespace Tests\Feature;

use App\Http\Controllers\Api\FlightRoutesController;
use App\Services\Contracts\BookingProvider;
use App\Services\Exceptions\BookingProviderException;
use App\Services\MockBookingProvider;
use ReflectionMethod;
use Tests\TestCase;

class PlatformProviderAdapterTest extends TestCase
{
    public function test_mock_provider_is_selected_from_booking_configuration(): void
    {
        config(['booking.api_mode' => 'mock']);

        $this->assertInstanceOf(MockBookingProvider::class, app(BookingProvider::class));
    }

    public function test_platform_controllers_depend_on_the_provider_contract(): void
    {
        $method = new ReflectionMethod(FlightRoutesController::class, '__invoke');
        $providerParameter = $method->getParameters()[0];

        $this->assertSame(BookingProvider::class, $providerParameter->getType()?->getName());
    }

    public function test_provider_failures_return_normalized_platform_errors(): void
    {
        $this->app->instance(BookingProvider::class, new class implements BookingProvider
        {
            public function experienceProfile(string $experienceId): array
            {
                throw new BookingProviderException('Provider unavailable.');
            }

            public function tenantConfig(string $tenantId): array
            {
                throw new BookingProviderException('Provider unavailable.');
            }

            public function searchFlights(array $criteria, string $tenantId = 'skywing'): array
            {
                throw new BookingProviderException('Provider unavailable.');
            }

            public function flightRoutes(): array
            {
                throw new BookingProviderException('Provider unavailable.');
            }

            public function lowFareCalendar(array $criteria): array
            {
                throw new BookingProviderException('Provider unavailable.');
            }

            public function flightOffers(array $search, string $bound): array
            {
                throw new BookingProviderException('Provider unavailable.');
            }

            public function fares(array $selection): array
            {
                throw new BookingProviderException('Provider unavailable.');
            }

            public function ancillaries(array $booking): array
            {
                throw new BookingProviderException('Provider unavailable.');
            }

            public function confirm(array $booking): array
            {
                throw new BookingProviderException('Provider unavailable.');
            }
        });

        $this->getJson('/api/flights/routes')
            ->assertStatus(502)
            ->assertJsonPath('error.code', 'PROVIDER_ERROR')
            ->assertJsonPath('error.message', 'Booking provider is unavailable.');
    }
}
