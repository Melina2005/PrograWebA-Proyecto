<script setup>
import { ref } from 'vue'
import OrderDetailModal from '../components/admin/OrderDetailModal.vue'
import OrderTable from '../components/admin/OrderTable.vue'
import ProductFormModal from '../components/admin/ProductFormModal.vue'
import ProductTable from '../components/admin/ProductTable.vue'
import { useCatalogStore } from '../stores/catalog'
import { useOrdersStore } from '../stores/orders'

const catalog = useCatalogStore()
const orders = useOrdersStore()
const activeTab = ref('products')
const productModalOpen = ref(false)
const editingProduct = ref(null)
const selectedOrder = ref(null)

const openNewProduct = () => {
  editingProduct.value = null
  productModalOpen.value = true
}

const openEditProduct = (product) => {
  editingProduct.value = product
  productModalOpen.value = true
}

const saveProduct = (product) => {
  catalog.saveProduct(product)
  productModalOpen.value = false
  editingProduct.value = null
}

const deleteProduct = (product) => {
  if (confirm(`¿Eliminar "${product.nombre}"? Esta acción no se puede deshacer.`)) {
    catalog.deleteProduct(product.id)
  }
}
</script>

<template>
  <main class="container py-5">
    <div class="text-center mb-5">
      <h1 class="display-4 fw-bold">Panel de Administrador</h1>
      <p class="lead text-muted">Gestiona productos, inventario y órdenes.</p>
    </div>

    <ul class="nav nav-tabs mb-4" role="tablist">
      <li class="nav-item">
        <button
          type="button"
          class="nav-link"
          :class="{ active: activeTab === 'products' }"
          role="tab"
          @click="activeTab = 'products'"
        >
          Productos
        </button>
      </li>
      <li class="nav-item">
        <button
          type="button"
          class="nav-link"
          :class="{ active: activeTab === 'orders' }"
          role="tab"
          @click="activeTab = 'orders'"
        >
          Órdenes
        </button>
      </li>
    </ul>

    <section v-if="activeTab === 'products'">
      <div class="d-flex justify-content-end mb-3">
        <button
          type="button"
          class="btn btn-dark text-white rounded-pill px-4"
          @click="openNewProduct"
        >
          <i class="bi bi-plus-lg me-2"></i>Nuevo Producto
        </button>
      </div>
      <ProductTable :products="catalog.products" @edit="openEditProduct" @delete="deleteProduct" />
    </section>

    <section v-else>
      <OrderTable
        :orders="orders.orders"
        @status-change="orders.updateStatus"
        @view="selectedOrder = $event"
      />
    </section>
  </main>

  <ProductFormModal
    :open="productModalOpen"
    :product="editingProduct"
    @close="productModalOpen = false"
    @save="saveProduct"
  />
  <OrderDetailModal :order="selectedOrder" @close="selectedOrder = null" />
</template>
