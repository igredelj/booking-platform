import type { BookingStep, ExperienceProfile } from '@eebkg/config-schema';
import type { ReactNode } from 'react';

export interface ExperienceRoute {
  step: BookingStep;
  path: string;
  render: (profile: ExperienceProfile) => ReactNode;
  guarded?: boolean;
  fullBleed?: boolean;
}

export interface ExperienceComposition {
  id: string;
  steps: readonly BookingStep[];
  stepRoutes: Record<BookingStep, string>;
  stepLabels: Record<BookingStep, string>;
  routes: readonly ExperienceRoute[];
}

export type ExperienceCompositionRegistry = Record<string, ExperienceComposition>;

export const defineExperienceComposition = <Composition extends ExperienceComposition>(
  composition: Composition,
) => composition;

export const resolveExperienceComposition = (
  profile: ExperienceProfile,
  registry: ExperienceCompositionRegistry,
): ExperienceComposition => {
  const composition = registry[profile.composition.id];

  if (!composition) {
    throw new Error(`Unknown experience composition "${profile.composition.id}".`);
  }

  return {
    ...composition,
    steps: profile.composition.steps,
  };
};
