<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '../stores/userStore';
import { transmitToZoho } from '../api/zohoService';
import UserEditForm from './UserEditForm.vue';

const store = useUserStore();
const editingUser = ref<any>(null);

// Lógica Masiva Reutilizando el Servicio Central
const handleSyncSelected = async () => {
  const toSync = store.users.filter(u => store.selectedIds.includes(u.id));
  if (toSync.length === 0) return;

  const summary = await transmitToZoho(toSync);

  // Actualizamos el estado en Pinia solo para los que tuvieron éxito
  summary.details.forEach(item => {
    if (item.status === 'ok') {
      store.updateUser(item.id, { status: 'processed' });
    } else {
      store.updateUser(item.id, { status: 'error' });
    }
  });

  store.selectedIds = []; // Limpiamos selección
  
  // Feedback final
  alert(`Proceso finalizado: ${summary.successCount} guardados, ${summary.errorCount} fallidos.`);
};
</script>

<template>
  <div class="container">
    <div class="toolbar">
      <button 
        @click="handleSyncSelected" 
        :disabled="store.selectedIds.length === 0"
        class="btn-sync"
      >
        Sincronizar Seleccionados ({{ store.selectedIds.length }})
      </button>
    </div>

    <table class="data-table">
      <thead>
        <tr>
          <th><input type="checkbox" disabled /></th>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Company</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="user in store.users" 
          :key="user.id" 
          :class="{ 
            'row-disabled': !user.isBusinessValid, 
            'row-error': user.status === 'error' 
          }"
        >
          <td>
            <input 
              type="checkbox" 
              :disabled="!user.isBusinessValid || user.status === 'processed'"
              :checked="store.selectedIds.includes(user.id)"
              @change="store.toggleSelection(user.id)"
            />
          </td>
          <td>{{ user.fullName }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.phone }}</td>
          <td>{{ user.companyName }}</td>
          <td>
            <button @click="editingUser = user" class="btn-edit">Editar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <UserEditForm :user="editingUser" @close="editingUser = null" />
  </div>
</template>

<style scoped>
.toolbar { 
   margin-bottom: 15px;
   display: flex;
   justify-content: flex-end;
}
.row-disabled { 
  background-color: #f1f1f1;
   color: #999;
}
.row-disabled td { 
  opacity: 0.6;
}
.btn-sync { 
  background: #28a745;
   color: white;
   border: none;
   padding: 10px 20px;
   border-radius: 4px;
   cursor: pointer;
   }
.btn-sync:disabled { 
  background: #ccc;
}
.btn-edit { 
  background: #6c757d;
   color: white;
   border: none;
   padding: 5px 10px;
   border-radius: 4px;
   cursor: pointer;
}

.btn-action.error {
  background-color: #e53e3e;
  color: white;
}

.row-error {
  border-left: 4px solid #e53e3e;
}
</style>