import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import seedProducts from '../data/productos.json'
import { readStorage, writeStorage } from '../utils/storage'

const STORAGE_KEY = 'distritoCosmeticoProductos'

const normalizeProduct = (product) => ({
  id: Number(product.id),
  nombre: String(product.nombre || ''),
  categoria: String(product.categoria || ''),
  precio: Math.max(0, Number(product.precio) || 0),
  descripcion: String(product.descripcion || ''),
  imagen: String(product.imagen || 'data/assets/fallback.webp'),
  disponible: product.disponible === true,
  seccion: String(product.seccion || ''),
  promocion: product.promocion === true,
  stock: Math.max(0, Math.floor(Number(product.stock) || 0)),
})

export const useCatalogStore = defineStore('catalog', () => {
  const persisted = readStorage(STORAGE_KEY, null)
  const source = Array.isArray(persisted) ? persisted : seedProducts
  const products = ref(source.map(normalizeProduct).filter((product) => product.id > 0))
  const searchQuery = ref('')

  const nextId = computed(() => Math.max(0, ...products.value.map((product) => product.id)) + 1)

  function persist() {
    writeStorage(STORAGE_KEY, products.value)
  }

  function findById(id) {
    return products.value.find((product) => product.id === Number(id))
  }

  function saveProduct(input) {
    const normalized = normalizeProduct({
      ...input,
      id: input.id ? Number(input.id) : nextId.value,
    })
    const index = products.value.findIndex((product) => product.id === normalized.id)

    if (index >= 0) products.value[index] = normalized
    else products.value.push(normalized)

    persist()
    return normalized
  }

  function deleteProduct(id) {
    products.value = products.value.filter((product) => product.id !== Number(id))
    persist()
  }

  return { products, searchQuery, nextId, findById, saveProduct, deleteProduct }
})
