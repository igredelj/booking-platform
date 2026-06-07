<?php

namespace App\Http\Controllers\Api\Concerns;

use App\Services\Exceptions\BookingProviderException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

trait ReturnsPlatformErrors
{
    /**
     * @throws ValidationException
     */
    private function validatePlatformPayload(array $payload, array $rules): array
    {
        $validator = Validator::make($payload, $rules);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        return $validator->validated();
    }

    private function validationErrorResponse(ValidationException $exception): JsonResponse
    {
        return response()->json([
            'error' => [
                'code' => 'VALIDATION_ERROR',
                'message' => 'The request payload is invalid.',
                'fields' => $exception->errors(),
            ],
        ], 422);
    }

    private function providerErrorResponse(BookingProviderException $exception): JsonResponse
    {
        return response()->json([
            'error' => [
                'code' => 'PROVIDER_ERROR',
                'message' => 'Booking provider is unavailable.',
            ],
        ], 502);
    }
}
