import type { User } from '../schemas/user.schema';

/**
 * Servicio único para la transmisión a Zoho CRM.
 * Reutilizable por edición individual y sincronización masiva.
 */
export const transmitToZoho = async (data: User | User[]): Promise<void> => {
  const payload = Array.isArray(data) ? data : [data];
  
  console.log('🚀 Iniciando transmisión a Zoho CRM...', payload);
  
  // Simulamos la latencia del Proxy/Middleware
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('✅ Transmisión completada con éxito');
      resolve();
    }, 1000);
  });
};