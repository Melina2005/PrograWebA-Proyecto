<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import { useOrdersStore } from '../stores/orders'
import { assetUrl, formatPrice } from '../utils/format'

const router = useRouter()
const auth = useAuthStore()
const cart = useCartStore()
const orders = useOrdersStore()

const imageFallback = (event) => {
  event.target.onerror = null
  event.target.src = assetUrl('data/assets/fallback.webp')
}

const emptyCart = () => {
  if (confirm('¿Deseas vaciar el carrito?')) cart.clear()
}

const checkout = async () => {
  if (!cart.items.length) return
  if (!auth.activeUser) {
    alert('Inicia sesión para finalizar tu compra.')
    await router.push({ name: 'login', query: { redirect: '/carrito' } })
    return
  }
  if (!confirm('¿Confirmas la compra?')) return

  orders.createOrder(auth.activeUser, cart.items, cart.total)
  cart.clear()
  alert('¡Compra realizada exitosamente!')
}
</script>

<template>
  <main class="container py-5">
    <div class="d-flex align-items-center justify-content-between mb-5">
      <h1 class="mb-0">Mi Carrito</h1>
      <RouterLink to="/" class="btn btn-outline-secondary">Seguir comprando</RouterLink>
    </div>

    <div class="card shadow border-0">
      <div class="card-body">
        <div v-if="cart.items.length === 0" class="text-center py-5">
          <i class="bi bi-cart-x display-4 text-muted"></i>
          <p class="lead text-muted mt-3 mb-0">Tu carrito está vacío.</p>
          <RouterLink to="/" class="btn btn-dark mt-4">Explorar productos</RouterLink>
        </div>

        <template v-else>
          <div class="table-responsive">
            <table class="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                  <th><span class="visually-hidden">Acciones</span></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in cart.items" :key="item.id">
                  <td class="cart-product">
                    <img
                      :src="assetUrl(item.product.imagen)"
                      :alt="item.product.nombre"
                      @error="imageFallback"
                    />
                    <span>{{ item.product.nombre }}</span>
                  </td>
                  <td>{{ formatPrice(item.product.precio) }}</td>
                  <td>
                    <div class="input-group input-group-sm cart-quantity">
                      <button
                        type="button"
                        class="btn btn-outline-secondary"
                        :aria-label="`Disminuir cantidad de ${item.product.nombre}`"
                        @click="cart.setQuantity(item.id, item.cantidad - 1)"
                      >
                        −
                      </button>
                      <span
                        class="form-control text-center"
                        :aria-label="`Cantidad de ${item.product.nombre}`"
                      >
                        {{ item.cantidad }}
                      </span>
                      <button
                        type="button"
                        class="btn btn-outline-secondary"
                        :disabled="item.cantidad >= item.product.stock"
                        :aria-label="`Aumentar cantidad de ${item.product.nombre}`"
                        @click="cart.setQuantity(item.id, item.cantidad + 1)"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>{{ formatPrice(item.product.precio * item.cantidad) }}</td>
                  <td>
                    <button
                      type="button"
                      class="btn btn-sm btn-outline-danger"
                      @click="cart.remove(item.id)"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <hr />
          <div class="d-flex justify-content-end align-items-center gap-3">
            <h4 class="mb-0">Total:</h4>
            <h4 class="mb-0">{{ formatPrice(cart.total) }}</h4>
          </div>
          <div class="d-flex flex-column flex-md-row gap-3 mt-4">
            <button type="button" class="btn btn-outline-danger flex-fill" @click="emptyCart">
              Vaciar carrito
            </button>
            <button type="button" class="btn btn-success flex-fill" @click="checkout">
              Finalizar compra
            </button>
          </div>
        </template>
      </div>
    </div>
  </main>
</template>
