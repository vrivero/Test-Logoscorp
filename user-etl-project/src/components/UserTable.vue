<script setup lang="ts">
import { useUserStore } from '../stores/userStore';
import { sendToExternalSystem } from '../api/userService';

// Inicializamos el store para que el template pueda acceder a 'store.users'
const store = useUserStore();

/**
 * Lógica de Carga (Load) individual
 * Transmite los datos transformados al sistema externo
 */
const handleProcess = async (id: number) => {
  const user = store.users.find(u => u.id === id);
  
  if (user) {
    try {
      // Intentamos la transmisión
      await sendToExternalSystem(user);
      
      // Si tiene éxito, actualizamos el estado en el Store
      store.updateUser(id, { status: 'processed' });
      alert(`Usuario ${user.fullName} transmitido con éxito.`);
    } catch (e) {
      console.error('Error en el pipeline de carga:', e);
      alert('Error al transmitir los datos al sistema externo.');
    }
  }
};
</script>

<template>
  <div class="table-container">
    <table class="data-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Teléfono (Normalizado)</th>
          <th>Web</th>
          <th>Empresa</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="user in store.users" 
          :key="user.id" 
          :class="{ 'row-invalid': !user.isBusinessValid }"
        >
          <td class="font-bold">{{ user.fullName }}</td>
          <td>{{ user.phone || 'N/A' }}</td>
          <td>
            <a :href="user.website" target="_blank" class="link">
              {{ user.website }}
            </a>
          </td>
          <td>
            <div class="company-info">
              <span class="company-name">{{ user.companyName }}</span>
              <span v-if="!user.isBusinessValid" class="badge-error">
                ⚠️ Empresa no elegible
              </span>
            </div>
          </td>
          <td>
            <button 
              @click="handleProcess(user.id)" 
              :disabled="user.status === 'processed' || !user.isBusinessValid"
              :class="['btn-action', user.status]"
            >
              {{ user.status === 'processed' ? '✅ Enviado' : 'Transmitir' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
/* Estenedor de la tabla */
.table-container {
  overflow-x: auto;
  margin-top: 20px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-family: sans-serif;
}

.data-table th {
  background-color: #f8fafc;
  padding: 12px;
  border-bottom: 2px solid #e2e8f0;
  color: #64748b;
  font-size: 0.85rem;
  text-transform: uppercase;
}

.data-table td {
  padding: 12px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

/* Estilos de Regla de Negocio */
.row-invalid {
  background-color: #fff5f5; /* Rojo muy tenue para marcar errores de ETL */
}

.badge-error {
  color: #dc3545;
  font-size: 0.7rem;
  display: block;
  margin-top: 4px;
  font-weight: bold;
}

.font-bold { font-weight: 600; }

.link {
  color: #3182ce;
  text-decoration: none;
}

.link:hover { text-decoration: underline; }

/* Botones y Estados */
.btn-action {
  padding: 6px 12px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
  background-color: #4a90e2;
  color: white;
}

.btn-action:hover:not(:disabled) {
  background-color: #357abd;
}

.btn-action:disabled {
  background-color: #cbd5e0;
  cursor: not-allowed;
}

.btn-action.processed {
  background-color: #2f855a;
  color: white;
}

.company-info {
  display: flex;
  flex-direction: column;
}
</style>