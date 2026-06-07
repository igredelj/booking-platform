import { describe, expect, it } from 'vitest';
import {
  availabilityResponseSchema,
  apiErrorSchema,
  flightRoutesResponseSchema,
  lowFareCalendarResponseSchema,
  searchCriteriaSchema,
  tripSelectionSchema,
} from '@eebkg/config-schema';

describe('provider-neutral booking contracts', () => {
  it('validates search criteria for the Smart Trip Builder PoC', () => {
    const criteria = searchCriteriaSchema.parse({
      tripType: 'round-trip',
      origin: 'LHR',
      destination: 'BCN',
      departureDate: '2026-07-12',
      returnDate: '2026-07-19',
      passengers: {
        adult: 2,
        child: 0,
        senior: 0,
      },
      directOnly: false,
      flexibleDates: true,
      promoCode: 'BRAVO',
    });

    expect(criteria.origin).toBe('LHR');
    expect(criteria.passengers.adult).toBe(2);
  });

  it('validates routes, low-fare calendar, and availability responses', () => {
    const routes = flightRoutesResponseSchema.parse({
      routes: [
        {
          id: 'LHR-BCN',
          origin: {
            cityCode: 'LON',
            cityName: 'London',
            airports: [{ code: 'LHR', name: 'London Heathrow' }],
          },
          destination: {
            cityCode: 'BCN',
            cityName: 'Barcelona',
            airports: [{ code: 'BCN', name: 'Barcelona' }],
          },
        },
      ],
    });

    const calendar = lowFareCalendarResponseSchema.parse({
      dates: [
        {
          date: '2026-07-12',
          available: true,
          price: { amount: 129, currency: 'EUR' },
          cheapest: true,
          selected: true,
        },
      ],
    });

    const availability = availabilityResponseSchema.parse({
      search: {
        tripType: 'round-trip',
        origin: 'LHR',
        destination: 'BCN',
        departureDate: '2026-07-12',
        returnDate: '2026-07-19',
        passengers: {
          adult: 2,
          child: 0,
          senior: 0,
        },
        directOnly: false,
        flexibleDates: true,
      },
      bound: 'outbound',
      flights: [
        {
          id: 'outbound-1',
          bound: 'outbound',
          airlineName: 'Bravo Air',
          flightNumber: 'BR101',
          departure: {
            airportCode: 'LHR',
            airportName: 'London Heathrow',
            dateTime: '2026-07-12T08:15:00+01:00',
          },
          arrival: {
            airportCode: 'BCN',
            airportName: 'Barcelona',
            dateTime: '2026-07-12T11:25:00+02:00',
          },
          durationMinutes: 130,
          stops: 0,
          fareBundles: [
            {
              id: 'outbound-1-smart',
              name: 'Smart',
              recommended: true,
              price: { amount: 189, currency: 'EUR' },
              included: ['Cabin bag', 'Checked bag'],
              providerReferences: {
                offerId: 'offer-1',
              },
            },
          ],
        },
      ],
    });

    expect(routes.routes[0].id).toBe('LHR-BCN');
    expect(calendar.dates[0].price?.currency).toBe('EUR');
    expect(availability.flights[0].fareBundles[0].name).toBe('Smart');
  });

  it('validates trip selections and normalized API errors', () => {
    const selection = tripSelectionSchema.parse({
      search: {
        tripType: 'one-way',
        origin: 'LHR',
        destination: 'BCN',
        departureDate: '2026-07-12',
        passengers: {
          adult: 1,
          child: 0,
          senior: 0,
        },
        directOnly: true,
        flexibleDates: false,
      },
      selectedFareBundleIds: ['outbound-1-smart'],
    });

    const error = apiErrorSchema.parse({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'The request payload is invalid.',
        fields: {
          destination: ['The destination field is required.'],
        },
      },
    });

    expect(selection.selectedFareBundleIds).toEqual(['outbound-1-smart']);
    expect(error.error.fields?.destination[0]).toBe('The destination field is required.');
  });
});
