import axios from 'axios';
import { UserTransformedSchema } from '../schemas/user.schema';
import type { User } from '../schemas/user.schema';

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
});

export const fetchUsers = async (): Promise<User[]> => {
  const { data } = await api.get('/users');
  
  return data.map((item: any) => {
    try {
      return UserTransformedSchema.parse(item);
    } catch (error) {
      // Esto te dirá EXACTAMENTE qué usuario falló y por qué
      console.error("Error validando usuario ID:", item.id, error);
      return null; 
    }
  }).filter(Boolean) as User[]; // Filtramos los que fallaron
};

export const sendToExternalSystem = async (users: User | User[]) => {
  // Simulación de carga (Load) a otro sistema
  console.log('Transmitiendo a sistema externo:', users);
  return api.post('/posts', users); // Endpoint de prueba
};