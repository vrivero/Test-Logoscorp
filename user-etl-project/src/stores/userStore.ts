import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from '../schemas/user.schema';

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([]);

  function setUsers(newData: User[]) {
    users.value = newData;
  }

  function updateUser(id: number, data: Partial<User>) {
    const index = users.value.findIndex(u => u.id === id);
    if (index !== -1) {
      users.value[index] = { 
        ...users.value[index], 
        ...data 
      } as User;
    }
  }

  const processedUsers = computed(() => 
    users.value.filter(u => u.status === 'processed')
  );

  return { users, setUsers, updateUser, processedUsers };
});