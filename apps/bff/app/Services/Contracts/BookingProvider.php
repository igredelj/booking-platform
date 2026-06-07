<?php

namespace App\Services\Contracts;

interface BookingProvider
{
    public function experienceProfile(string $experienceId): array;

    public function tenantConfig(string $tenantId): array;

    public function searchFlights(array $criteria, string $tenantId = 'skywing'): array;

    public function flightRoutes(): array;

    public function lowFareCalendar(array $criteria): array;

    public function flightOffers(array $search, string $bound): array;

    public function fares(array $selection): array;

    public function ancillaries(array $booking): array;

    public function confirm(array $booking): array;
}
