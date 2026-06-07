import type { ExperienceProfile } from '@eebkg/config-schema';
import { Link, Outlet, useLocation } from 'react-router';
import { useAppSelector } from '../app/hooks';
import { useExperienceComposition } from '../app/compositionContext';
import { isStepAvailable } from '../features/booking/selectors';

interface AppLayoutProps {
  profile: ExperienceProfile;
}

export const AppLayout = ({ profile }: AppLayoutProps) => {
  const location = useLocation();
  const composition = useExperienceComposition();
  const booking = useAppSelector((state) => state);
  const isSearchPage = location.pathname === composition.stepRoutes.search;
  const currentRoute = composition.routes.find((route) => route.path === location.pathname);
  const isFullBleedFlowPage = Boolean(currentRoute?.fullBleed);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to booking content
      </a>
      <header className="site-header">
        <Link
          className="brand"
          to={composition.stepRoutes.search}
          aria-label={`${profile.brand.name} booking home`}
        >
          <img src={profile.brand.logo} alt="" width="40" height="40" />
          <span>{profile.brand.name}</span>
        </Link>
        <nav className="site-nav" aria-label="Primary">
          <Link aria-current={isSearchPage ? 'page' : undefined} to={composition.stepRoutes.search}>
            Book
          </Link>
          <a href="#main-content">Manage</a>
          <a href="#main-content">Check-in</a>
          <a href="#main-content">Flight status</a>
          <a href="#main-content">Help</a>
        </nav>
        <a className="sign-in-link" href="#main-content">
          Sign in
        </a>
      </header>

      <div className="booking-frame" data-search-layout={isFullBleedFlowPage}>
        <aside className="flow-panel" aria-label="Booking progress" hidden={isFullBleedFlowPage}>
          <ol className="step-list">
            {composition.steps.map((step, index) => {
              const route = composition.stepRoutes[step];
              const available = isStepAvailable(booking, step);
              const current = location.pathname === route;

              return (
                <li key={step}>
                  <Link
                    className="step-link"
                    data-current={current}
                    data-disabled={!available}
                    to={available ? route : '#'}
                    aria-current={current ? 'step' : undefined}
                    aria-disabled={!available}
                    onClick={(event) => {
                      if (!available) {
                        event.preventDefault();
                      }
                    }}
                  >
                    <span className="step-index">{index + 1}</span>
                    <span>{composition.stepLabels[step]}</span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </aside>

        <main id="main-content" className="page-content" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
