<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Contracts\BookingProvider;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FlightSearchController extends Controller
{
    public function __invoke(Request $request, BookingProvider $provider): JsonResponse
    {
        $criteria = $request->validate([
            'origin' => ['required', 'string', 'max:8'],
            'destination' => ['required', 'string', 'max:8'],
            'departureDate' => ['required', 'date'],
            'returnDate' => ['required', 'date', 'after_or_equal:departureDate'],
            'passengers.adult' => ['required', 'integer', 'min:1'],
            'passengers.child' => ['required', 'integer', 'min:0'],
            'passengers.senior' => ['required', 'integer', 'min:0'],
        ]);

        return response()->json($provider->searchFlights($criteria, $request->header('X-Tenant-Id', 'skywing')));
    }
}
