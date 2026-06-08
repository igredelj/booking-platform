<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Contracts\BookingProvider;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FareController extends Controller
{
    public function __invoke(Request $request, BookingProvider $provider): JsonResponse
    {
        $selection = $request->validate([
            'outboundFlightId' => ['required', 'string'],
            'inboundFlightId' => ['required', 'string'],
        ]);

        return response()->json($provider->fares($selection));
    }
}
