import { describe, expect, it } from 'vitest';
import { BookingApiError, toBookingApiError } from './bookingApi';

describe('toBookingApiError', () => {
  it('maps normalized platform errors into typed application errors', () => {
    const error = toBookingApiError(422, {
      error: {
        code: 'VALIDATION_ERROR',
        message: 'The request payload is invalid.',
        fields: {
          destination: ['The destination field is required.'],
        },
      },
    });

    expect(error).toBeInstanceOf(BookingApiError);
    expect(error.code).toBe('VALIDATION_ERROR');
    expect(error.status).toBe(422);
    expect(error.fields?.destination[0]).toBe('The destination field is required.');
  });

  it('falls back to request status when the error payload is not normalized', () => {
    const error = toBookingApiError(500, { message: 'Unexpected shape' });

    expect(error.code).toBe('REQUEST_FAILED');
    expect(error.message).toBe('Request failed: 500');
  });
});
