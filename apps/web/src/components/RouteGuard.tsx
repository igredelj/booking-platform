import type { BookingStep } from '@eebkg/config-schema';
import { Navigate } from 'react-router';
import { useAppSelector } from '../app/hooks';
import { useExperienceComposition } from '../app/compositionContext';

interface RouteGuardProps {
  step: BookingStep;
  children: React.ReactNode;
}

export const RouteGuard = ({ step, children }: RouteGuardProps) => {
  const composition = useExperienceComposition();
  const available = useAppSelector((state) => composition.canEnterStep(state.booking, step));

  if (!available) {
    return <Navigate to={composition.stepRoutes.search} replace />;
  }

  return children;
};
