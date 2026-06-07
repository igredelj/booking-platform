import { z } from 'zod';

export const bookingStepSchema = z.enum([
  'search',
  'flight-selection',
  'fare-selection',
  'passenger-details',
  'extras',
  'review',
  'payment',
  'confirmation',
]);

const themeSchema = z.object({
  colors: z.object({
    primary: z.string().min(1),
    primaryText: z.string().min(1),
    background: z.string().min(1),
    surface: z.string().min(1),
    border: z.string().min(1),
    text: z.string().min(1),
    mutedText: z.string().min(1),
    accent: z.string().min(1),
    danger: z.string().min(1),
  }),
  radius: z.string().min(1),
  fontFamily: z.string().min(1),
});

const featuresSchema = z.object({
  seniorPassenger: z.boolean(),
  ancillaries: z.boolean(),
  promoCode: z.boolean(),
});

export const experienceProfileSchema = z.object({
  identity: z.object({
    customerId: z.string().min(1),
    experienceId: z.string().min(1),
    displayName: z.string().min(1).optional(),
  }),
  brand: z.object({
    name: z.string().min(1),
    logo: z.string().min(1),
  }),
  theme: themeSchema,
  content: z.object({
    locale: z.string().min(2),
    currency: z.string().length(3),
  }),
  features: featuresSchema,
  composition: z.object({
    id: z.string().min(1),
    steps: z.array(bookingStepSchema).min(1),
  }),
  provider: z.object({
    id: z.string().min(1),
  }),
  runtime: z.record(z.string(), z.unknown()).default({}),
});

export const tenantConfigSchema = experienceProfileSchema;

export type BookingStep = z.infer<typeof bookingStepSchema>;
export type ExperienceProfile = z.infer<typeof experienceProfileSchema>;
export type TenantConfig = ExperienceProfile;
