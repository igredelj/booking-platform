import { experienceProfileSchema, type ExperienceProfile } from '@eebkg/config-schema';

const experienceFromHost = () => {
  const params = new URLSearchParams(window.location.search);
  const experienceParam = params.get('experience') ?? params.get('tenant');

  if (experienceParam) {
    return experienceParam;
  }

  const [subdomain] = window.location.hostname.split('.');

  if (subdomain && !['localhost', '127', '0'].includes(subdomain)) {
    return subdomain;
  }

  return 'skywing';
};

export const loadExperienceProfile = async (): Promise<ExperienceProfile> => {
  const experienceId = experienceFromHost();
  const response = await fetch(`/api/experience-profile?experience=${experienceId}`);

  if (!response.ok) {
    throw new Error('Experience profile could not be loaded.');
  }

  return experienceProfileSchema.parse(await response.json());
};

export const applyExperienceTheme = (profile: ExperienceProfile) => {
  const root = document.documentElement;
  const { colors } = profile.theme;

  root.style.setProperty('--color-primary', colors.primary);
  root.style.setProperty('--color-primary-text', colors.primaryText);
  root.style.setProperty('--color-background', colors.background);
  root.style.setProperty('--color-surface', colors.surface);
  root.style.setProperty('--color-border', colors.border);
  root.style.setProperty('--color-text', colors.text);
  root.style.setProperty('--color-muted-text', colors.mutedText);
  root.style.setProperty('--color-accent', colors.accent);
  root.style.setProperty('--color-danger', colors.danger);
  root.style.setProperty('--radius', profile.theme.radius);
  root.style.setProperty('--font-family', profile.theme.fontFamily);
};
