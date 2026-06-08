import type { BookingStep } from '@eebkg/config-schema';
import type { RootState } from '../../app/store';
import type { BookingState, BookingStatus } from './bookingSlice';

export const selectBooking = (state: RootState) => state.booking;

const atLeast = (status: BookingStatus, statuses: BookingStatus[]) => statuses.includes(status);

export const isBookingStepAvailable = (booking: BookingState, step: BookingStep) => {
  switch (step) {
    case 'search':
      return true;
    case 'flight-selection':
      return Boolean(booking.search);
    case 'fare-selection':
      return Boolean(booking.selection.outboundOfferId && booking.selection.returnOfferId);
    case 'passenger-details':
      return Boolean(booking.selection.fareBundleId);
    case 'extras':
      return atLeast(booking.status, ['passengers_complete', 'reviewed', 'payment_complete']);
    case 'review':
      return atLeast(booking.status, ['passengers_complete', 'reviewed', 'payment_complete']);
    case 'payment':
      return atLeast(booking.status, ['reviewed', 'payment_complete']);
    case 'confirmation':
      return booking.status === 'payment_complete';
  }
};

export const isStepAvailable = (state: RootState, step: BookingStep) =>
  isBookingStepAvailable(state.booking, step);
