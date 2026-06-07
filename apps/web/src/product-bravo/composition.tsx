import { defineExperienceComposition } from '../app/composition';
import { ConfirmationPage } from '../pages/ConfirmationPage';
import { ExtrasPage } from '../pages/ExtrasPage';
import { FareSelectionPage } from '../pages/FareSelectionPage';
import { FlightSelectionPage } from '../pages/FlightSelectionPage';
import { PassengerDetailsPage } from '../pages/PassengerDetailsPage';
import { PaymentPage } from '../pages/PaymentPage';
import { ReviewPage } from '../pages/ReviewPage';
import { SearchPage } from '../pages/SearchPage';

export const bravoSmartTripBuilderComposition = defineExperienceComposition({
  id: 'bravo-smart-trip-builder',
  steps: [
    'search',
    'flight-selection',
    'fare-selection',
    'passenger-details',
    'extras',
    'review',
    'payment',
    'confirmation',
  ],
  stepRoutes: {
    search: '/search',
    'flight-selection': '/flights',
    'fare-selection': '/fares',
    'passenger-details': '/passengers',
    extras: '/extras',
    review: '/review',
    payment: '/payment',
    confirmation: '/confirmation',
  },
  stepLabels: {
    search: 'Search',
    'flight-selection': 'Flights',
    'fare-selection': 'Fares',
    'passenger-details': 'Passengers',
    extras: 'Extras',
    review: 'Review',
    payment: 'Payment',
    confirmation: 'Confirmation',
  },
  routes: [
    {
      step: 'search',
      path: '/search',
      render: (profile) => <SearchPage profile={profile} />,
      fullBleed: true,
    },
    {
      step: 'flight-selection',
      path: '/flights',
      render: () => <FlightSelectionPage />,
      guarded: true,
      fullBleed: true,
    },
    {
      step: 'fare-selection',
      path: '/fares',
      render: () => <FareSelectionPage />,
      guarded: true,
    },
    {
      step: 'passenger-details',
      path: '/passengers',
      render: () => <PassengerDetailsPage />,
      guarded: true,
    },
    {
      step: 'extras',
      path: '/extras',
      render: () => <ExtrasPage />,
      guarded: true,
    },
    {
      step: 'review',
      path: '/review',
      render: () => <ReviewPage />,
      guarded: true,
    },
    {
      step: 'payment',
      path: '/payment',
      render: () => <PaymentPage />,
      guarded: true,
    },
    {
      step: 'confirmation',
      path: '/confirmation',
      render: () => <ConfirmationPage />,
      guarded: true,
    },
  ],
});
