<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Contracts\BookingProvider;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AncillaryController extends Controller
{
    public function __invoke(Request $request, BookingProvider $provider): JsonResponse
    {
        $booking = $request->validate([
            'fareId' => ['required', 'string'],
            'passengersComplete' => ['accepted'],
        ]);

        return response()->json($provider->ancillaries($booking));
    }
}
