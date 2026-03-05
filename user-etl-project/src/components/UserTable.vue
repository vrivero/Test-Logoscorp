<script setup lang="ts">
import { useUserStore } from '../stores/userStore';
import { sendToExternalSystem } from '../api/userService';

const store = useUserStore();

const handleProcess = async (id: number) => {
  const user = store.users.find(u => u.id === id);
  if (user) {
    try {
      await sendToExternalSystem(user);
      store.updateUser(id, { status: 'processed' });
      alert('Transmitido con éxito');
    } catch (e) {
      alert('Error en la carga');
    }
  }
};
</script>

<template>
  <table class="data-table">
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Ciudad</th>
        <th>Estado</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="user in store.users" :key="user.id">
        <td>{{ user.fullName }}</td>
        <td>{{ user.city }}</td>
        <td>
          <span :class="user.status">{{ user.status }}</span>
        </td>
        <td>
          <button @click="handleProcess(user.id)" :disabled="user.status === 'processed'">
            {{ user.status === 'processed' ? 'Enviado' : 'Transmitir' }}
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.processed { color: green; font-weight: bold; }
.pending { color: orange; }
</style>