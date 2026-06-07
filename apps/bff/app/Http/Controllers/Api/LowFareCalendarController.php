<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\ReturnsPlatformErrors;
use App\Http\Controllers\Controller;
use App\Services\Contracts\BookingProvider;
use App\Services\Exceptions\BookingProviderException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class LowFareCalendarController extends Controller
{
    use ReturnsPlatformErrors;

    public function __invoke(Request $request, BookingProvider $provider): JsonResponse
    {
        try {
            $criteria = $this->validatePlatformPayload($request->all(), $this->searchCriteriaRules());
        } catch (ValidationException $exception) {
            return $this->validationErrorResponse($exception);
        }

        try {
            return response()->json($provider->lowFareCalendar($criteria));
        } catch (BookingProviderException $exception) {
            return $this->providerErrorResponse($exception);
        }
    }

    private function searchCriteriaRules(): array
    {
        return [
            'tripType' => ['required', 'string', 'in:one-way,round-trip'],
            'origin' => ['required', 'string', 'min:3', 'max:8'],
            'destination' => ['required', 'string', 'min:3', 'max:8'],
            'departureDate' => ['required', 'date_format:Y-m-d'],
            'returnDate' => ['required_if:tripType,round-trip', 'date_format:Y-m-d', 'after_or_equal:departureDate'],
            'passengers.adult' => ['required', 'integer', 'min:1'],
            'passengers.child' => ['required', 'integer', 'min:0'],
            'passengers.senior' => ['required', 'integer', 'min:0'],
            'directOnly' => ['required', 'boolean'],
            'flexibleDates' => ['required', 'boolean'],
            'promoCode' => ['sometimes', 'string', 'min:1'],
        ];
    }
}
