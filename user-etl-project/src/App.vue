<script setup lang="ts">
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';
import UserTable from './components/UserTable.vue';
import { useUsers } from './composables/useUsers';

const { isLoading, isError } = useUsers();
</script>

<template>
  <div class="container">
    <h1>ETL Pipeline con Vue 3</h1>
    
    <div v-if="isLoading">Cargando y transformando datos...</div>
    <div v-else-if="isError">Error en la extracción de datos.</div>
    <UserTable v-else />

    <VueQueryDevtools />
  </div>
</template>