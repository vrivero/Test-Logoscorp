import { useQuery } from '@tanstack/vue-query';
import { fetchUsers } from '../api/userService';
import { useUserStore } from '../stores/userStore';
import { watch } from 'vue';

export function useUsers() {
  const store = useUserStore();
  
  const query = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  // Sincronizamos el resultado de la API con el Store de Pinia
  watch(query.data, (newData) => {
    if (newData) store.setUsers(newData);
  }, { immediate: true });

  return query;
}