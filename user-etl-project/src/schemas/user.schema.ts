import { z } from 'zod';

// Esquema de entrada (lo que viene de la API)
export const ApiUserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  website: z.string().optional(),
  address: z.object({
    city: z.string(),
  }),
  company: z.object({
    name: z.string(),
  }),
});

// Esquema de salida (Transformado para la UI y el Sistema Externo)
export const UserTransformedSchema = ApiUserSchema.transform((raw) => {
  
  // 1. Normalización de Teléfono: Solo dígitos
  // Eliminamos guiones, puntos, paréntesis y todo lo que esté después de la 'x' (extensiones)
  const phonePart = raw.phone?.split('x')[0] ?? '';
  const cleanPhone = phonePart.replace(/\D/g, '');
  // 2. Normalización Web: Anteponer https:// si no existe
  const cleanWebsite = raw.website.startsWith('http') 
    ? raw.website 
    : `https://${raw.website}`;

  // 3. Regla de Negocio (Empresas)
  // Validamos si contiene "Group", "Inc." o "LLC"
  const companyKeywords = ["Group", "Inc.", "LLC"];
  const isCompanyValid = companyKeywords.some(keyword => 
    raw.company.name.includes(keyword)
  );

  return {
    id: raw.id,
    fullName: raw.name,
    email: raw.email.toLowerCase(),
    phone: cleanPhone,
    website: cleanWebsite,
    city: raw.address.city,
    companyName: raw.company.name,
    // Marcado de regla de negocio
    isBusinessValid: isCompanyValid, 
    status: isCompanyValid ? 'pending' : 'error' as 'pending' | 'processed' | 'error',
    lastUpdated: new Date().toISOString(),
  };
});

export type User = z.infer<typeof UserTransformedSchema>;