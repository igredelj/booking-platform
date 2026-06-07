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

export const searchFlights = (criteria: unknown) =>
  postJson<{ flights: FlightOption[] }>('/api/flights/search', criteria);

export const fetchFares = (selection: unknown) => postJson<{ fares: FareOption[] }>('/api/fares', selection);

export const fetchAncillaries = (booking: unknown) =>
  postJson<{ ancillaries: AncillaryOption[] }>('/api/ancillaries', booking);

export const confirmBooking = (booking: unknown) =>
  postJson<{ confirmationCode: string }>('/api/booking/confirm', booking);
