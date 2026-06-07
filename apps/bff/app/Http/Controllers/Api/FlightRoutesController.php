<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\MockBookingApi;
use Illuminate\Http\JsonResponse;

class FlightRoutesController extends Controller
{
    public function __invoke(MockBookingApi $api): JsonResponse
    {
        return response()->json($api->flightRoutes());
    }
}
