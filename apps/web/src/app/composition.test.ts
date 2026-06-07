import { describe, expect, it } from 'vitest';
import type { ExperienceProfile } from '@eebkg/config-schema';
import { experienceCompositions, resolveKnownExperienceComposition } from './availableCompositions';

const profile = {
  identity: {
    customerId: 'skywing',
    experienceId: 'skywing-default',
  },
  brand: {
    name: 'SkyWing',
    logo: '/tenants/skywing/logo.svg',
  },
  theme: {
    colors: {
      primary: '#070316',
      primaryText: '#FFFFFF',
      background: '#F8F8FA',
      surface: '#FFFFFF',
      border: '#DEDDE4',
      text: '#11121A',
      mutedText: '#5F6472',
      accent: '#5147FF',
      danger: '#B42318',
    },
    radius: '10px',
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  content: {
    locale: 'en-US',
    currency: 'EUR',
  },
  features: {
    seniorPassenger: true,
    ancillaries: true,
    promoCode: true,
  },
  composition: {
    id: 'bravo-smart-trip-builder',
    steps: ['search', 'flight-selection', 'fare-selection', 'review'],
  },
  provider: {
    id: 'mock',
  },
  runtime: {},
} satisfies ExperienceProfile;

describe('resolveKnownExperienceComposition', () => {
  it('resolves the registered Bravo booking composition selected by the profile', () => {
    const composition = resolveKnownExperienceComposition(profile);

    expect(composition.id).toBe('bravo-smart-trip-builder');
    expect(composition.steps).toEqual(['search', 'flight-selection', 'fare-selection', 'review']);
    expect(composition.stepRoutes.search).toBe('/search');
    expect(composition.stepLabels['flight-selection']).toBe('Flights');
    expect(composition.routes.map((route) => route.path)).toContain('/flights');
  });

  it('fails clearly when a profile selects an unknown composition', () => {
    expect(() =>
      resolveKnownExperienceComposition({
        ...profile,
        composition: {
          ...profile.composition,
          id: 'unknown-composition',
        },
      }),
    ).toThrow('Unknown experience composition "unknown-composition".');
  });

  it('keeps the registry keyed by composition id', () => {
    expect(experienceCompositions['bravo-smart-trip-builder'].id).toBe('bravo-smart-trip-builder');
  });
});
