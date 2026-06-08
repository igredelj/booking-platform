<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Contracts\BookingProvider;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TenantConfigController extends Controller
{
    public function __invoke(Request $request, BookingProvider $provider): JsonResponse
    {
        $tenantId = $request->query('tenant', 'skywing');

        return response()->json($provider->experienceProfile($tenantId));
    }
}
