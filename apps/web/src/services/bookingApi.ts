import {
  apiErrorSchema,
  availabilityResponseSchema,
  flightRoutesResponseSchema,
  lowFareCalendarResponseSchema,
} from '@eebkg/config-schema';
import type {
  AvailabilityRequest,
  AvailabilityResponse,
  FlightRoutesResponse,
  LowFareCalendarRequest,
  LowFareCalendarResponse,
} from '@eebkg/config-schema';

export interface FlightOption {
  id: string;
  direction: 'outbound' | 'inbound';
  airline: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  price: number;
}

export interface FareOption {
  id: string;
  name: string;
  price: number;
  conditions: string[];
}

export interface AncillaryOption {
  id: string;
  name: string;
  description: string;
  price: number;
}

let apiExperienceId = 'skywing';

export const setApiExperience = (experienceId: string) => {
  apiExperienceId = experienceId;
};

export const setApiTenant = setApiExperience;

const postJson = async <ResponseBody>(url: string, body: unknown): Promise<ResponseBody> => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Tenant-Id': apiExperienceId,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<ResponseBody>;
};

const readPlatformResponse = async <ResponseBody>(
  response: Response,
  parse: (payload: unknown) => ResponseBody,
): Promise<ResponseBody> => {
  const payload: unknown = await response.json();

  if (!response.ok) {
    const parsedError = apiErrorSchema.safeParse(payload);

    if (parsedError.success) {
      throw new Error(parsedError.data.error.message);
    }

    throw new Error(`Request failed: ${response.status}`);
  }

  return parse(payload);
};

const getPlatformJson = async <ResponseBody>(
  url: string,
  parse: (payload: unknown) => ResponseBody,
): Promise<ResponseBody> => {
  const response = await fetch(url, {
    headers: {
      'X-Tenant-Id': apiExperienceId,
    },
  });

  return readPlatformResponse(response, parse);
};

const postPlatformJson = async <ResponseBody>(
  url: string,
  body: unknown,
  parse: (payload: unknown) => ResponseBody,
): Promise<ResponseBody> => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Tenant-Id': apiExperienceId,
    },
    body: JSON.stringify(body),
  });

  return readPlatformResponse(response, parse);
};

export const fetchFlightRoutes = (): Promise<FlightRoutesResponse> =>
  getPlatformJson('/api/flights/routes', flightRoutesResponseSchema.parse);

export const fetchLowFareCalendar = (
  criteria: LowFareCalendarRequest,
): Promise<LowFareCalendarResponse> =>
  postPlatformJson('/api/flights/calendar', criteria, lowFareCalendarResponseSchema.parse);

export const fetchFlightOffers = (request: AvailabilityRequest): Promise<AvailabilityResponse> =>
  postPlatformJson('/api/flights/offers', request, availabilityResponseSchema.parse);

export const searchFlights = (criteria: unknown) =>
  postJson<{ flights: FlightOption[] }>('/api/flights/search', criteria);

export const fetchFares = (selection: unknown) => postJson<{ fares: FareOption[] }>('/api/fares', selection);

export const fetchAncillaries = (booking: unknown) =>
  postJson<{ ancillaries: AncillaryOption[] }>('/api/ancillaries', booking);

export const confirmBooking = (booking: unknown) =>
  postJson<{ confirmationCode: string }>('/api/booking/confirm', booking);
