import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { readStorage, writeStorage } from '../utils/storage'
import { useCatalogStore } from './catalog'

const STORAGE_KEY = 'distritoCosmeticoCarrito'

const normalizeCart = (value) => {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => ({
      id: Number(item.id),
      cantidad: Math.floor(Number(item.cantidad)),
    }))
    .filter(
      (item) =>
        Number.isInteger(item.id) &&
        item.id > 0 &&
        Number.isInteger(item.cantidad) &&
        item.cantidad > 0,
    )
}

export const useCartStore = defineStore('cart', () => {
  const catalog = useCatalogStore()
  const lines = ref(normalizeCart(readStorage(STORAGE_KEY, [])))

  const items = computed(() =>
    lines.value
      .map((line) => ({ ...line, product: catalog.findById(line.id) }))
      .filter((item) => item.product),
  )
  const count = computed(() => lines.value.reduce((total, line) => total + line.cantidad, 0))
  const total = computed(() =>
    items.value.reduce((sum, item) => sum + Number(item.product.precio) * Number(item.cantidad), 0),
  )

  function persist() {
    writeStorage(STORAGE_KEY, lines.value)
  }

  function add(product) {
    if (!product || !product.disponible || Number(product.stock) <= 0) {
      return { ok: false, message: 'Este producto no está disponible.' }
    }

    const existing = lines.value.find((line) => line.id === Number(product.id))
    const quantity = (existing?.cantidad || 0) + 1

    if (quantity > Number(product.stock)) {
      return {
        ok: false,
        message: `Solo hay ${product.stock} unidad(es) disponible(s).`,
      }
    }

    if (existing) existing.cantidad = quantity
    else lines.value.push({ id: Number(product.id), cantidad: 1 })
    persist()
    return { ok: true, message: 'Producto agregado al carrito.' }
  }

  function setQuantity(id, quantity) {
    const product = catalog.findById(id)
    const line = lines.value.find((item) => item.id === Number(id))
    if (!line || !product) return

    const normalized = Math.floor(Number(quantity))
    if (normalized <= 0 || !product.disponible || Number(product.stock) <= 0) {
      remove(id)
      return
    }

    line.cantidad = Math.min(normalized, Number(product.stock))
    persist()
  }

  function remove(id) {
    lines.value = lines.value.filter((line) => line.id !== Number(id))
    persist()
  }

  function clear() {
    lines.value = []
    persist()
  }

  function validate() {
    lines.value = lines.value
      .map((line) => {
        const product = catalog.findById(line.id)
        if (!product?.disponible || Number(product.stock) <= 0) return null
        return { id: line.id, cantidad: Math.min(line.cantidad, Number(product.stock)) }
      })
      .filter(Boolean)
    persist()
  }

  validate()

  return { lines, items, count, total, add, setQuantity, remove, clear, validate }
})
