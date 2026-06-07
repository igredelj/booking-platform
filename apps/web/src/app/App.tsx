import { useEffect, useState } from 'react';
import type { ExperienceProfile } from '@eebkg/config-schema';
import { Navigate, Route, Routes } from 'react-router';
import { AppLayout } from '../components/AppLayout';
import { RouteGuard } from '../components/RouteGuard';
import { applyExperienceTheme, loadExperienceProfile } from '../features/config/experience';
import { ConfirmationPage } from '../pages/ConfirmationPage';
import { ExtrasPage } from '../pages/ExtrasPage';
import { FareSelectionPage } from '../pages/FareSelectionPage';
import { FlightSelectionPage } from '../pages/FlightSelectionPage';
import { PassengerDetailsPage } from '../pages/PassengerDetailsPage';
import { PaymentPage } from '../pages/PaymentPage';
import { ReviewPage } from '../pages/ReviewPage';
import { SearchPage } from '../pages/SearchPage';
import { setApiExperience } from '../services/bookingApi';

export const App = () => {
  const [profile, setProfile] = useState<ExperienceProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadExperienceProfile()
      .then((experienceProfile) => {
        setApiExperience(experienceProfile.identity.customerId);
        applyExperienceTheme(experienceProfile);
        setProfile(experienceProfile);
      })
      .catch(() => {
        setError('We could not load this booking experience. Please check the experience profile.');
      });
  }, []);

  if (error) {
    return (
      <main className="centered-state" role="alert">
        <h1>Booking is unavailable</h1>
        <p>{error}</p>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="centered-state" aria-busy="true">
        <h1>Loading booking experience</h1>
      </main>
    );
  }

  return (
    <Routes>
      <Route element={<AppLayout profile={profile} />}>
        <Route index element={<Navigate to="/search" replace />} />
        <Route path="/search" element={<SearchPage profile={profile} />} />
        <Route
          path="/flights"
          element={
            <RouteGuard step="flight-selection">
              <FlightSelectionPage />
            </RouteGuard>
          }
        />
        <Route
          path="/fares"
          element={
            <RouteGuard step="fare-selection">
              <FareSelectionPage />
            </RouteGuard>
          }
        />
        <Route
          path="/passengers"
          element={
            <RouteGuard step="passenger-details">
              <PassengerDetailsPage />
            </RouteGuard>
          }
        />
        <Route
          path="/extras"
          element={
            <RouteGuard step="extras">
              <ExtrasPage />
            </RouteGuard>
          }
        />
        <Route
          path="/review"
          element={
            <RouteGuard step="review">
              <ReviewPage />
            </RouteGuard>
          }
        />
        <Route
          path="/payment"
          element={
            <RouteGuard step="payment">
              <PaymentPage />
            </RouteGuard>
          }
        />
        <Route
          path="/confirmation"
          element={
            <RouteGuard step="confirmation">
              <ConfirmationPage />
            </RouteGuard>
          }
        />
      </Route>
    </Routes>
  );
};
