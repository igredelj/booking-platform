import type { BookingStep } from '@eebkg/config-schema';
import { bravoSmartTripBuilderComposition } from '../product-bravo/composition';

export const stepRoutes: Record<BookingStep, string> = bravoSmartTripBuilderComposition.stepRoutes;

export const stepLabels: Record<BookingStep, string> = bravoSmartTripBuilderComposition.stepLabels;

export const defaultFlow: BookingStep[] = [...bravoSmartTripBuilderComposition.steps];
