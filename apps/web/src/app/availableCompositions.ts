import type { ExperienceProfile } from '@eebkg/config-schema';
import { bravoSmartTripBuilderComposition } from '../product-bravo/composition';
import type { ExperienceCompositionRegistry } from './composition';
import { resolveExperienceComposition } from './composition';

export const experienceCompositions: ExperienceCompositionRegistry = {
  [bravoSmartTripBuilderComposition.id]: bravoSmartTripBuilderComposition,
};

export const resolveKnownExperienceComposition = (profile: ExperienceProfile) =>
  resolveExperienceComposition(profile, experienceCompositions);
