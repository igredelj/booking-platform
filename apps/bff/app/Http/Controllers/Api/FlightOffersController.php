<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\ReturnsPlatformErrors;
use App\Http\Controllers\Controller;
use App\Services\MockBookingApi;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class FlightOffersController extends Controller
{
    use ReturnsPlatformErrors;

    public function __invoke(Request $request, MockBookingApi $api): JsonResponse
    {
        try {
            $payload = $this->validatePlatformPayload($request->all(), [
                'search.tripType' => ['required', 'string', 'in:one-way,round-trip'],
                'search.origin' => ['required', 'string', 'min:3', 'max:8'],
                'search.destination' => ['required', 'string', 'min:3', 'max:8'],
                'search.departureDate' => ['required', 'date_format:Y-m-d'],
                'search.returnDate' => ['required_if:search.tripType,round-trip', 'date_format:Y-m-d', 'after_or_equal:search.departureDate'],
                'search.passengers.adult' => ['required', 'integer', 'min:1'],
                'search.passengers.child' => ['required', 'integer', 'min:0'],
                'search.passengers.senior' => ['required', 'integer', 'min:0'],
                'search.directOnly' => ['required', 'boolean'],
                'search.flexibleDates' => ['required', 'boolean'],
                'search.promoCode' => ['sometimes', 'string', 'min:1'],
                'bound' => ['required', 'string', 'in:outbound,return'],
            ]);
        } catch (ValidationException $exception) {
            return $this->validationErrorResponse($exception);
        }

        return response()->json($api->flightOffers($payload['search'], $payload['bound']));
    }
}
