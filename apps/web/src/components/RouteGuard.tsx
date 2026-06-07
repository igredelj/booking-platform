import type { BookingStep } from '@eebkg/config-schema';
import { Navigate } from 'react-router';
import { useAppSelector } from '../app/hooks';
import { useExperienceComposition } from '../app/compositionContext';
import { isStepAvailable } from '../features/booking/selectors';

interface RouteGuardProps {
  step: BookingStep;
  children: React.ReactNode;
}

export const RouteGuard = ({ step, children }: RouteGuardProps) => {
  const composition = useExperienceComposition();
  const available = useAppSelector((state) => isStepAvailable(state, step));

  if (!available) {
    return <Navigate to={composition.stepRoutes.search} replace />;
  }

  return children;
};
