import axios from 'axios';
import type { User } from '../schemas/user.schema';

// Apuntamos a nuestro Proxy local, no a Zoho directamente
const PROXY_URL = 'http://localhost:3001/api/zoho/upsert';

export const transmitToZoho = async (data: User | User[]) => {
  const users = Array.isArray(data) ? data : [data];
  
  try {
    const response = await axios.post(PROXY_URL, users);
    
    // Zoho devuelve un array de resultados por cada registro
    const zohoResults = response.data.data; 

    return {
      successCount: zohoResults.filter((r: any) => r.status === 'success').length,
      errorCount: zohoResults.filter((r: any) => r.status !== 'success').length,
      details: users.map((u, index) => ({
        id: u.id,
        name: u.fullName,
        status: zohoResults[index].status === 'success' ? 'ok' : 'fail',
        message: zohoResults[index].message
      }))
    };
  } catch (error) {
    // Manejo de resiliencia si el proxy falla
    return {
      successCount: 0,
      errorCount: users.length,
      details: users.map(u => ({ id: u.id, name: u.fullName, status: 'fail', message: 'Proxy Inalcanzable' }))
    };
  }
};