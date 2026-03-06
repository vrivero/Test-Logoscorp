import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from '../schemas/user.schema';

/*export const useUserStore = defineStore('user', () => {
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
});*/


export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([]);
  const selectedIds = ref<number[]>([]); // Control de checkboxes

  const setUsers = (data: User[]) => { users.value = data; };
  
  const updateUser = (id: number, data: Partial<User>) => {
    const index = users.value.findIndex(u => u.id === id);
    if (index !== -1) {
      users.value[index] = { ...users.value[index], ...data } as User;
    }
  };

  const toggleSelection = (id: number) => {
    const index = selectedIds.value.indexOf(id);
    if (index > -1) selectedIds.value.splice(index, 1);
    else selectedIds.value.push(id);
  };

  return { users, selectedIds, setUsers, updateUser, toggleSelection };
});