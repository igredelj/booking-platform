import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { SearchCriteria } from '@eebkg/config-schema';

export type PassengerType = 'adult' | 'child' | 'senior';

export type BookingStatus =
  | 'idle'
  | 'search_submitted'
  | 'outbound_selected'
  | 'return_selected'
  | 'fare_selected'
  | 'passengers_complete'
  | 'reviewed'
  | 'payment_complete';

export interface BookingSelection {
  outboundOfferId?: string;
  returnOfferId?: string;
  fareBundleId?: string;
  ancillaryIds: string[];
}

export interface BookingState {
  search?: SearchCriteria;
  selection: BookingSelection;
  status: BookingStatus;
  confirmationCode?: string;
}

const initialState: BookingState = {
  selection: {
    ancillaryIds: [],
  },
  status: 'idle',
};

const emptySelection = (): BookingSelection => ({
  ancillaryIds: [],
});

const clearAfterOutbound = (selection: BookingSelection) => {
  selection.returnOfferId = undefined;
  selection.fareBundleId = undefined;
  selection.ancillaryIds = [];
};

const clearAfterReturn = (selection: BookingSelection) => {
  selection.fareBundleId = undefined;
  selection.ancillaryIds = [];
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    resetBooking() {
      return initialState;
    },
    setSearch(state, action: PayloadAction<SearchCriteria>) {
      state.search = action.payload;
      state.selection = emptySelection();
      state.status = 'search_submitted';
      state.confirmationCode = undefined;
    },
    selectOutboundOffer(state, action: PayloadAction<string>) {
      state.selection.outboundOfferId = action.payload;
      clearAfterOutbound(state.selection);
      state.status = 'outbound_selected';
      state.confirmationCode = undefined;
    },
    selectReturnOffer(state, action: PayloadAction<string>) {
      state.selection.returnOfferId = action.payload;
      clearAfterReturn(state.selection);
      state.status = 'return_selected';
      state.confirmationCode = undefined;
    },
    selectFlights(state, action: PayloadAction<{ outboundFlightId: string; inboundFlightId: string }>) {
      state.selection.outboundOfferId = action.payload.outboundFlightId;
      state.selection.returnOfferId = action.payload.inboundFlightId;
      clearAfterReturn(state.selection);
      state.status = 'return_selected';
      state.confirmationCode = undefined;
    },
    selectFare(state, action: PayloadAction<string>) {
      state.selection.fareBundleId = action.payload;
      state.selection.ancillaryIds = [];
      state.status = 'fare_selected';
      state.confirmationCode = undefined;
    },
    completePassengers(state) {
      state.status = 'passengers_complete';
      state.confirmationCode = undefined;
    },
    setExtras(state, action: PayloadAction<string[]>) {
      state.selection.ancillaryIds = action.payload;
      state.status = 'passengers_complete';
      state.confirmationCode = undefined;
    },
    markReviewed(state) {
      state.status = 'reviewed';
    },
    completePayment(state, action: PayloadAction<string>) {
      state.status = 'payment_complete';
      state.confirmationCode = action.payload;
    },
  },
});

export const {
  completePassengers,
  completePayment,
  markReviewed,
  resetBooking,
  selectFare,
  selectFlights,
  selectOutboundOffer,
  selectReturnOffer,
  setExtras,
  setSearch,
} = bookingSlice.actions;

export default bookingSlice.reducer;
