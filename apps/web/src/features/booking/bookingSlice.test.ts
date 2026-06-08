import { describe, expect, it } from 'vitest';
import bookingReducer, {
  resetBooking,
  selectOutboundOffer,
  selectReturnOffer,
  setSearch,
} from './bookingSlice';

const search = {
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
} as const;

describe('bookingReducer', () => {
  it('stores submitted search criteria and resets selections', () => {
    const state = bookingReducer(
      {
        search,
        selection: {
          outboundOfferId: 'old-outbound',
          returnOfferId: 'old-return',
          fareBundleId: 'old-fare',
          ancillaryIds: ['bag'],
        },
        status: 'reviewed',
      },
      setSearch({
        ...search,
        destination: 'JFK',
      }),
    );

    expect(state.search?.destination).toBe('JFK');
    expect(state.selection).toEqual({ ancillaryIds: [] });
    expect(state.status).toBe('search_submitted');
  });

  it('tracks selected outbound and return offers as normalized selection state', () => {
    const withSearch = bookingReducer(undefined, setSearch(search));
    const withOutbound = bookingReducer(withSearch, selectOutboundOffer('offer-out-1-smart'));
    const withReturn = bookingReducer(withOutbound, selectReturnOffer('offer-ret-1-smart'));

    expect(withOutbound.selection).toEqual({
      outboundOfferId: 'offer-out-1-smart',
      ancillaryIds: [],
    });
    expect(withOutbound.status).toBe('outbound_selected');
    expect(withReturn.selection.returnOfferId).toBe('offer-ret-1-smart');
    expect(withReturn.status).toBe('return_selected');
  });

  it('resets durable booking state', () => {
    const withSearch = bookingReducer(undefined, setSearch(search));

    expect(bookingReducer(withSearch, resetBooking())).toEqual({
      selection: {
        ancillaryIds: [],
      },
      status: 'idle',
    });
  });
});
