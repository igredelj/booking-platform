<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Contracts\BookingProvider;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function __invoke(Request $request, BookingProvider $provider): JsonResponse
    {
        $payload = $request->validate([
            'booking.search.origin' => ['required', 'string'],
            'booking.search.destination' => ['required', 'string'],
            'booking.outboundFlightId' => ['required', 'string'],
            'booking.inboundFlightId' => ['required', 'string'],
            'booking.fareId' => ['required', 'string'],
            'booking.reviewed' => ['accepted'],
            'payment.cardholderName' => ['required', 'string'],
            'payment.cardNumber' => ['required', 'string'],
            'payment.expiry' => ['required', 'string'],
            'payment.cvc' => ['required', 'string'],
        ]);

        return response()->json($provider->confirm($payload));
    }
}
