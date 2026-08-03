<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppFooter from './components/layout/AppFooter.vue'
import AppHeader from './components/layout/AppHeader.vue'

const route = useRoute()
const usesStoreLayout = computed(() => route.meta.layout === 'store')
</script>

<template>
  <div class="app-root" :class="{ 'store-layout': usesStoreLayout }">
    <AppHeader v-if="usesStoreLayout" />
    <RouterView />
    <AppFooter v-if="usesStoreLayout" />
  </div>
</template>
