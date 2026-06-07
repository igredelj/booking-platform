import { describe, expect, it } from 'vitest';
import { experienceProfileSchema } from '@eebkg/config-schema';

describe('experienceProfileSchema', () => {
  it('validates a customer experience profile with separated responsibilities', () => {
    const profile = experienceProfileSchema.parse({
      identity: {
        customerId: 'skywing',
        experienceId: 'skywing-default',
        displayName: 'SkyWing',
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
      runtime: {
        defaultExperience: true,
      },
    });

    expect(profile.identity.customerId).toBe('skywing');
    expect(profile.composition.id).toBe('bravo-smart-trip-builder');
    expect(profile.content.currency).toBe('EUR');
  });
});
