import { z } from 'zod';

export const bookingStepSchema = z.enum([
  'search',
  'flight-selection',
  'fare-selection',
  'passenger-details',
  'extras',
  'review',
  'payment',
  'confirmation',
]);

const themeSchema = z.object({
  colors: z.object({
    primary: z.string().min(1),
    primaryText: z.string().min(1),
    background: z.string().min(1),
    surface: z.string().min(1),
    border: z.string().min(1),
    text: z.string().min(1),
    mutedText: z.string().min(1),
    accent: z.string().min(1),
    danger: z.string().min(1),
  }),
  radius: z.string().min(1),
  fontFamily: z.string().min(1),
});

const featuresSchema = z.object({
  seniorPassenger: z.boolean(),
  ancillaries: z.boolean(),
  promoCode: z.boolean(),
});

export const experienceProfileSchema = z.object({
  identity: z.object({
    customerId: z.string().min(1),
    experienceId: z.string().min(1),
    displayName: z.string().min(1).optional(),
  }),
  brand: z.object({
    name: z.string().min(1),
    logo: z.string().min(1),
  }),
  theme: themeSchema,
  content: z.object({
    locale: z.string().min(2),
    currency: z.string().length(3),
  }),
  features: featuresSchema,
  composition: z.object({
    id: z.string().min(1),
    steps: z.array(bookingStepSchema).min(1),
  }),
  provider: z.object({
    id: z.string().min(1),
  }),
  runtime: z.record(z.string(), z.unknown()).default({}),
});

export const tenantConfigSchema = experienceProfileSchema;

const isoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const tripTypeSchema = z.enum(['one-way', 'round-trip']);
export const flightBoundSchema = z.enum(['outbound', 'return']);

export const moneySchema = z.object({
  amount: z.number().nonnegative(),
  currency: z.string().length(3),
});

export const passengerCountsSchema = z.object({
  adult: z.number().int().min(1),
  child: z.number().int().min(0),
  senior: z.number().int().min(0),
});

export const searchCriteriaSchema = z
  .object({
    tripType: tripTypeSchema,
    origin: z.string().min(3).max(8),
    destination: z.string().min(3).max(8),
    departureDate: isoDateSchema,
    returnDate: isoDateSchema.optional(),
    passengers: passengerCountsSchema,
    directOnly: z.boolean().default(false),
    flexibleDates: z.boolean().default(false),
    promoCode: z.string().min(1).optional(),
  })
  .refine((criteria) => criteria.tripType === 'one-way' || Boolean(criteria.returnDate), {
    message: 'Return date is required for round trips.',
    path: ['returnDate'],
  });

export const airportSchema = z.object({
  code: z.string().min(3).max(8),
  name: z.string().min(1),
});

export const routeEndpointSchema = z.object({
  cityCode: z.string().min(3).max(8),
  cityName: z.string().min(1),
  airports: z.array(airportSchema).min(1),
});

export const routeOptionSchema = z.object({
  id: z.string().min(1),
  origin: routeEndpointSchema,
  destination: routeEndpointSchema,
});

export const flightRoutesResponseSchema = z.object({
  routes: z.array(routeOptionSchema),
});

export const lowFareCalendarRequestSchema = searchCriteriaSchema;

export const fareDateSchema = z.object({
  date: isoDateSchema,
  available: z.boolean(),
  price: moneySchema.optional(),
  cheapest: z.boolean().optional(),
  selected: z.boolean().optional(),
  bestValue: z.boolean().optional(),
});

export const lowFareCalendarResponseSchema = z.object({
  dates: z.array(fareDateSchema),
});

export const locationTimeSchema = z.object({
  airportCode: z.string().min(3).max(8),
  airportName: z.string().min(1),
  dateTime: z.string().min(1),
});

export const fareBundleSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  recommended: z.boolean().default(false),
  price: moneySchema,
  included: z.array(z.string().min(1)),
  providerReferences: z.record(z.string(), z.string()),
});

export const flightOptionSchema = z.object({
  id: z.string().min(1),
  bound: flightBoundSchema,
  airlineName: z.string().min(1),
  flightNumber: z.string().min(1),
  departure: locationTimeSchema,
  arrival: locationTimeSchema,
  durationMinutes: z.number().int().positive(),
  stops: z.number().int().min(0),
  fareBundles: z.array(fareBundleSchema).min(1),
});

export const availabilityRequestSchema = z.object({
  search: searchCriteriaSchema,
  bound: flightBoundSchema,
});

export const availabilityResponseSchema = z.object({
  search: searchCriteriaSchema,
  bound: flightBoundSchema,
  flights: z.array(flightOptionSchema),
});

export const tripSelectionSchema = z.object({
  search: searchCriteriaSchema,
  selectedFareBundleIds: z.array(z.string().min(1)).min(1),
});

export const apiErrorSchema = z.object({
  error: z.object({
    code: z.string().min(1),
    message: z.string().min(1),
    fields: z.record(z.string(), z.array(z.string())).optional(),
  }),
});

export type BookingStep = z.infer<typeof bookingStepSchema>;
export type ExperienceProfile = z.infer<typeof experienceProfileSchema>;
export type TenantConfig = ExperienceProfile;
export type TripType = z.infer<typeof tripTypeSchema>;
export type FlightBound = z.infer<typeof flightBoundSchema>;
export type Money = z.infer<typeof moneySchema>;
export type PassengerCounts = z.infer<typeof passengerCountsSchema>;
export type SearchCriteria = z.infer<typeof searchCriteriaSchema>;
export type Airport = z.infer<typeof airportSchema>;
export type RouteOption = z.infer<typeof routeOptionSchema>;
export type FlightRoutesResponse = z.infer<typeof flightRoutesResponseSchema>;
export type LowFareCalendarRequest = z.infer<typeof lowFareCalendarRequestSchema>;
export type FareDate = z.infer<typeof fareDateSchema>;
export type LowFareCalendarResponse = z.infer<typeof lowFareCalendarResponseSchema>;
export type FareBundle = z.infer<typeof fareBundleSchema>;
export type PlatformFlightOption = z.infer<typeof flightOptionSchema>;
export type AvailabilityRequest = z.infer<typeof availabilityRequestSchema>;
export type AvailabilityResponse = z.infer<typeof availabilityResponseSchema>;
export type TripSelection = z.infer<typeof tripSelectionSchema>;
export type ApiError = z.infer<typeof apiErrorSchema>;
