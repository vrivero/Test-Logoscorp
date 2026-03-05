<script setup lang="ts">
import { ref, watch } from 'vue';
import type { User } from '../schemas/user.schema';
import { transmitToZoho } from '../api/zohoService';
import { useUserStore } from '../stores/userStore';

const props = defineProps<{ user: User | null }>();
const emit = defineEmits(['close']);
const store = useUserStore();

const localUser = ref<User | null>(null);

// Clonamos el usuario al abrir para no editar el store directamente hasta "Guardar"
watch(() => props.user, (newVal) => {
  if (newVal) localUser.value = { ...newVal };
}, { immediate: true });

const handleSaveAndSend = async () => {
  if (!localUser.value) return;
  
  try {
    await transmitToZoho(localUser.value);
    store.updateUser(localUser.value.id, { ...localUser.value, status: 'processed' });
    alert('Guardado y enviado a Zoho');
    emit('close');
  } catch (e) {
    alert('Error al sincronizar');
  }
};
</script>

<template>
  <div v-if="user" class="edit-overlay">
    <div class="edit-card">
      <h3>Editar y Sincronizar CRM</h3>
      <div v-if="localUser" class="form-grid">
        <input v-model="localUser.fullName" placeholder="Nombre" />
        <input v-model="localUser.email" placeholder="Email" />
        <input v-model="localUser.phone" placeholder="Teléfono" />
        <input v-model="localUser.companyName" placeholder="Empresa" />
      </div>
      <div class="actions">
        <button @click="$emit('close')" class="btn-cancel">Cancelar</button>
        <button @click="handleSaveAndSend" class="btn-save">Guardar y Enviar a CRM</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.edit-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 100; }
.edit-card { background: white; padding: 2rem; border-radius: 8px; width: 400px; }
.form-grid { display: flex; flex-direction: column; gap: 10px; margin: 20px 0; }
.form-grid input { padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
.actions { display: flex; justify-content: flex-end; gap: 10px; }
.btn-save { background: #0067ff; color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer; }
</style>