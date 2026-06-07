<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\ReturnsPlatformErrors;
use App\Http\Controllers\Controller;
use App\Services\Contracts\BookingProvider;
use App\Services\Exceptions\BookingProviderException;
use Illuminate\Http\JsonResponse;

class FlightRoutesController extends Controller
{
    use ReturnsPlatformErrors;

    public function __invoke(BookingProvider $provider): JsonResponse
    {
        try {
            return response()->json($provider->flightRoutes());
        } catch (BookingProviderException $exception) {
            return $this->providerErrorResponse($exception);
        }
    }
}
