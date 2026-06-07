<?php

namespace App\Services;

use Illuminate\Support\Arr;
use Illuminate\Support\Facades\File;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class MockBookingApi
{
    public function experienceProfile(string $experienceId): array
    {
        return $this->readJson("customers/{$experienceId}/profile.json");
    }

    public function tenantConfig(string $tenantId): array
    {
        return $this->experienceProfile($tenantId);
    }

    public function searchFlights(array $criteria, string $tenantId = 'skywing'): array
    {
        $response = $this->readJson('api-responses/search-results.json');
        $brandName = Arr::get($this->tenantConfig($tenantId), 'brand.name', 'SkyWing');
        $prefix = match ($tenantId) {
            'acme-air' => 'AC',
            'skyline' => 'SL',
            default => 'SW',
        };

        $response['flights'] = collect($response['flights'])
            ->values()
            ->map(function (array $flight, int $index) use ($brandName, $prefix): array {
                $flight['airline'] = $brandName;
                $flight['flightNumber'] = $prefix.($index + 101);

                return $flight;
            })
            ->all();

        return $response;
    }

    public function fares(array $selection): array
    {
        return $this->readJson('api-responses/fares.json');
    }

    public function ancillaries(array $booking): array
    {
        return $this->readJson('api-responses/ancillaries.json');
    }

    public function confirm(array $booking): array
    {
        $confirmation = $this->readJson('api-responses/confirmation.json');

        return [
            'confirmationCode' => Arr::get($confirmation, 'confirmationCode', 'BOOKING-CONFIRMED'),
        ];
    }

    private function readJson(string $relativePath): array
    {
        $path = config('booking.mock_data_path').DIRECTORY_SEPARATOR.$relativePath;

        if (! File::exists($path)) {
            throw new NotFoundHttpException("Mock response was not found: {$relativePath}");
        }

        return json_decode(File::get($path), true, flags: JSON_THROW_ON_ERROR);
    }
}
