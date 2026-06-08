import { useEffect, useState } from 'react';
import type { ExperienceProfile } from '@eebkg/config-schema';
import { Navigate, Route, Routes } from 'react-router';
import type { ExperienceComposition } from './composition';
import { ExperienceCompositionProvider } from './compositionContext';
import { resolveKnownExperienceComposition } from './availableCompositions';
import { AppLayout } from '../components/AppLayout';
import { RouteGuard } from '../components/RouteGuard';
import { applyExperienceTheme, loadExperienceProfile } from '../features/config/experience';
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

  let composition: ExperienceComposition;

  try {
    composition = resolveKnownExperienceComposition(profile);
  } catch {
    return (
      <main className="centered-state" role="alert">
        <h1>Booking is unavailable</h1>
        <p>We could not load this booking experience. Please check the experience profile.</p>
      </main>
    );
  }

  return (
    <ExperienceCompositionProvider composition={composition}>
      <Routes>
        <Route element={<AppLayout profile={profile} />}>
          <Route index element={<Navigate to={composition.stepRoutes.search} replace />} />
          {composition.routes.map((route) => (
            <Route
              key={route.step}
              path={route.path}
              element={
                route.guarded ? (
                  <RouteGuard step={route.step}>{route.render(profile)}</RouteGuard>
                ) : (
                  route.render(profile)
                )
              }
            />
          ))}
        </Route>
      </Routes>
    </ExperienceCompositionProvider>
  );
};
