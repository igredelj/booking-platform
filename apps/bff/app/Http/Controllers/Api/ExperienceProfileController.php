<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\MockBookingApi;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExperienceProfileController extends Controller
{
    public function __invoke(Request $request, MockBookingApi $api): JsonResponse
    {
        $experienceId = $request->query('experience', $request->query('tenant', 'skywing'));

        return response()->json($api->experienceProfile($experienceId));
    }
}
