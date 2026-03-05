import { z } from 'zod';

// 1. Definimos cómo viene el JSON de la API (Input)
export const ApiUserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  address: z.object({
    city: z.string(),
  }),
  company: z.object({
    name: z.string(),
  }),
});

// 2. Definimos la transformación hacia nuestra UI (Output)
export const UserTransformedSchema = ApiUserSchema.transform((raw) => ({
  id: raw.id,
  fullName: raw.name.toUpperCase(), // Transformación de ejemplo
  email: raw.email.toLowerCase(),
  city: raw.address.city,
  companyName: raw.company.name,
  status: 'pending' as 'pending' | 'processed' | 'error',
  lastUpdated: new Date().toISOString(),
}));

export type User = z.infer<typeof UserTransformedSchema>;