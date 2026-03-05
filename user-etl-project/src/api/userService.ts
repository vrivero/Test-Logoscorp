import axios from 'axios';
import { UserTransformedSchema } from '../schemas/user.schema';
import type { User } from '../schemas/user.schema';

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
});

export const fetchUsers = async (): Promise<User[]> => {
  const { data } = await api.get('/users');
  
  // Validamos y transformamos cada item del array
  return data.map((item: any) => {
    const result = UserTransformedSchema.safeParse(item);
    if (!result.success) {
      console.error('Error validando usuario:', result.error);
      throw new Error('Data corruption from API');
    }
    return result.data;
  });
};

export const sendToExternalSystem = async (users: User | User[]) => {
  // Simulación de carga (Load) a otro sistema
  console.log('Transmitiendo a sistema externo:', users);
  return api.post('/posts', users); // Endpoint de prueba
};