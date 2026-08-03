import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import seedOrders from '../data/ordenes.json'
import { readStorage, writeStorage } from '../utils/storage'

const STORAGE_KEY = 'distritoCosmeticoPedidos'

const normalizeItem = (item) => ({
  nombre: String(item.nombre || ''),
  cantidad: Math.max(1, Math.floor(Number(item.cantidad) || 1)),
  precio: Math.max(0, Number(item.precio) || 0),
})

const normalizeOrder = (order) => {
  const products = Array.isArray(order.productos) ? order.productos.map(normalizeItem) : []
  return {
    id: String(order.id || `PED-${Date.now()}`),
    usuario: String(order.usuario || order.cliente || 'Cliente'),
    correo: String(order.correo || ''),
    telefono: String(order.telefono || ''),
    direccion: String(order.direccion || ''),
    fecha: String(order.fecha || ''),
    productos: products,
    total:
      Number(order.total) ||
      products.reduce((sum, product) => sum + product.precio * product.cantidad, 0),
    estado: String(order.estado || 'Pendiente'),
  }
}

export const useOrdersStore = defineStore('orders', () => {
  const stored = readStorage(STORAGE_KEY, null)
  const source = Array.isArray(stored) ? stored : seedOrders
  const orders = ref(source.map(normalizeOrder))

  if (!Array.isArray(stored)) writeStorage(STORAGE_KEY, orders.value)

  const byEmail = computed(() => (email) => orders.value.filter((order) => order.correo === email))

  function createOrder(user, cartItems, total) {
    const order = normalizeOrder({
      id: `PED-${Date.now()}`,
      usuario: user.nombre,
      correo: user.correo,
      fecha: new Date().toLocaleDateString('es-CR'),
      estado: 'En preparación',
      total,
      productos: cartItems.map((item) => ({
        nombre: item.product.nombre,
        cantidad: item.cantidad,
        precio: item.product.precio,
      })),
    })
    orders.value.unshift(order)
    writeStorage(STORAGE_KEY, orders.value)
    return order
  }

  function updateStatus(id, status) {
    const order = orders.value.find((item) => item.id === String(id))
    if (!order) return
    order.estado = status
    writeStorage(STORAGE_KEY, orders.value)
  }

  return { orders, byEmail, createOrder, updateStatus }
})
