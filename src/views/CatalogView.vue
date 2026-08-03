<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import CategoryHeader from '../components/catalog/CategoryHeader.vue'
import ProductGrid from '../components/catalog/ProductGrid.vue'
import ProductModal from '../components/catalog/ProductModal.vue'
import { useCatalogStore } from '../stores/catalog'
import { normalizeText } from '../utils/format'

const route = useRoute()
const catalog = useCatalogStore()
const selectedProduct = ref(null)

const products = computed(() => {
  const filter = route.meta.filter
  const query = normalizeText(catalog.searchQuery)

  return catalog.products.filter((product) => {
    const matchesRoute = filter ? product[filter.type] === filter.value : true
    const matchesSearch =
      !query ||
      normalizeText(product.nombre).includes(query) ||
      normalizeText(product.categoria).includes(query)
    return matchesRoute && matchesSearch
  })
})
</script>

<template>
  <main class="container py-5">
    <CategoryHeader :title="route.meta.heading" :description="route.meta.description" />
    <ProductGrid :products="products" @select="selectedProduct = $event" />
  </main>
  <ProductModal :product="selectedProduct" @close="selectedProduct = null" />
</template>
