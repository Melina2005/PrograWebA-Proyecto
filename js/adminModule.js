const URL = "../data";
const PRODUCTOS_URL = `${URL}/productos.json`;
const ORDENES_URL = `${URL}/ordenes.json`;

let productosGlobales = [];
let ordenesGlobales = [];
let siguienteId = 1;

async function initAdminModule() {
    try {
        const res = await fetch(PRODUCTOS_URL);
        if (!res.ok) {
            throw new Error(`Error en la petición: ${res.status}`);
        }
        productosGlobales = await res.json();
        siguienteId = Math.max(...productosGlobales.map(p => p.id)) + 1;

        renderizarProductos();

        const resOrdenes = await fetch(ORDENES_URL);
        if (resOrdenes.ok) {
            ordenesGlobales =
                JSON.parse(localStorage.getItem("distritoCosmeticoPedidos")) || [];

            renderizarOrdenes();
        }

    } catch (error) {
        console.error("Hubo un error cargando datos del admin:", error);
    }

    const btnNuevo = document.getElementById('btn-nuevo-producto');
    if (btnNuevo) btnNuevo.addEventListener('click', abrirModalNuevo);

    const btnGuardar = document.getElementById('btn-guardar-producto');
    if (btnGuardar) btnGuardar.addEventListener('click', guardarProducto);
}

// ---------- PRODUCTOS (incluye categoría, precio, stock y disponibilidad) ----------

function renderizarProductos() {
    const container = document.getElementById('admin-productos-container');
    if (!container) return;

    container.replaceChildren();

    const tabla = document.createElement('table');
    tabla.className = 'table table-hover align-middle';

    tabla.innerHTML = `
        <thead>
            <tr>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Estado</th>
                <th class="text-end">Acciones</th>
            </tr>
        </thead>
        <tbody>
            ${productosGlobales.map(p => `
                <tr>
                    <td>${p.nombre}</td>
                    <td>${p.categoria}</td>
                    <td>₡${Number(p.precio).toLocaleString('es-CR')}</td>
                    <td>${p.stock ?? 0}</td>
                    <td>${obtenerBadgeEstado(p)}</td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-outline-dark me-2 btn-editar" data-id="${p.id}">Editar</button>
                        <button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${p.id}">Eliminar</button>
                    </td>
                </tr>
            `).join('')}
        </tbody>
    `;

    const wrapper = document.createElement('div');
    wrapper.className = 'table-responsive';
    wrapper.appendChild(tabla);

    container.appendChild(wrapper);

    container.querySelectorAll('.btn-editar').forEach(btn => {
        btn.addEventListener('click', () => abrirModalEditar(Number(btn.dataset.id)));
    });

    container.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', () => eliminarProducto(Number(btn.dataset.id)));
    });
}

function obtenerBadgeEstado(producto) {
    const stock = producto.stock ?? 0;

    if (!producto.disponible || stock === 0) {
        return '<span class="badge bg-danger">Agotado</span>';
    }
    if (stock <= 5) {
        return '<span class="badge bg-warning text-dark">Stock bajo</span>';
    }
    return '<span class="badge badge-disponibilidad">Disponible</span>';
}

function abrirModalNuevo() {
    document.getElementById('productoFormModalLabel').textContent = 'Nuevo Producto';
    document.getElementById('form-id').value = '';
    document.getElementById('form-nombre').value = '';
    document.getElementById('form-categoria').value = 'Maquillaje';
    document.getElementById('form-precio').value = '';
    document.getElementById('form-stock').value = 0;
    document.getElementById('form-descripcion').value = '';
    document.getElementById('form-disponible').checked = true;

    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('productoFormModal'));
    modal.show();
}

function abrirModalEditar(id) {
    const producto = productosGlobales.find(p => p.id === id);
    if (!producto) return;

    document.getElementById('productoFormModalLabel').textContent = 'Editar Producto';
    document.getElementById('form-id').value = producto.id;
    document.getElementById('form-nombre').value = producto.nombre;
    document.getElementById('form-categoria').value = producto.categoria;
    document.getElementById('form-precio').value = producto.precio;
    document.getElementById('form-stock').value = producto.stock ?? 0;
    document.getElementById('form-descripcion').value = producto.descripcion;
    document.getElementById('form-disponible').checked = producto.disponible;

    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('productoFormModal'));
    modal.show();
}

function guardarProducto() {
    const form = document.getElementById('form-producto');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const id = document.getElementById('form-id').value;
    const nombre = document.getElementById('form-nombre').value.trim();
    const categoria = document.getElementById('form-categoria').value;
    const precio = Number(document.getElementById('form-precio').value);
    const stock = Number(document.getElementById('form-stock').value);
    const descripcion = document.getElementById('form-descripcion').value.trim();
    const disponible = document.getElementById('form-disponible').checked;

    if (id) {
        const producto = productosGlobales.find(p => p.id === Number(id));
        producto.nombre = nombre;
        producto.categoria = categoria;
        producto.precio = precio;
        producto.stock = stock;
        producto.descripcion = descripcion;
        producto.disponible = disponible;
    } else {
        productosGlobales.push({
            id: siguienteId++,
            nombre,
            categoria,
            precio,
            stock,
            descripcion,
            imagen: 'data/assets/fallback.webp',
            disponible,
            seccion: '',
            promocion: false
        });
    }

    renderizarProductos();

    const modal = bootstrap.Modal.getInstance(document.getElementById('productoFormModal'));
    modal.hide();
}

function eliminarProducto(id) {
    const producto = productosGlobales.find(p => p.id === id);
    if (!producto) return;

    const confirmar = confirm(`¿Eliminar "${producto.nombre}"? Esta acción no se puede deshacer.`);
    if (!confirmar) return;

    productosGlobales = productosGlobales.filter(p => p.id !== id);
    renderizarProductos();
}

// ---------- ÓRDENES (listado + detalle completo del pedido) ----------

function renderizarOrdenes() {
    const container = document.getElementById('admin-ordenes-container');
    if (!container) return;

    container.replaceChildren();

    if (ordenesGlobales.length === 0) {
        container.innerHTML = '<p class="text-muted text-center py-4">No hay órdenes registradas.</p>';
        return;
    }

    const tabla = document.createElement('table');
    tabla.className = 'table table-hover align-middle';

    tabla.innerHTML = `
        <thead>
            <tr>
                <th>Orden #</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
                <th class="text-end">Acciones</th>
            </tr>
        </thead>
        <tbody>
            ${ordenesGlobales.map(o => `
                <tr>
                    <td>#${o.id}</td>
                    <td>${o.usuario}</td>
                    <td>${o.fecha}</td>
                    <td>₡${Number(o.total).toLocaleString('es-CR')}</td>
                    <td>
                        <select class="form-select form-select-sm select-estado" data-id="${o.id}">
                            <option ${o.estado === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                            <option ${o.estado === 'En camino' ? 'selected' : ''}>En camino</option>
                            <option ${o.estado === 'Entregado' ? 'selected' : ''}>Entregado</option>
                        </select>
                    </td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-outline-dark btn-ver-orden" data-id="${o.id}">Ver detalle</button>
                    </td>
                </tr>
            `).join('')}
        </tbody>
    `;

    const wrapper = document.createElement('div');
    wrapper.className = 'table-responsive';
    wrapper.appendChild(tabla);

    container.appendChild(wrapper);

    container.querySelectorAll(".select-estado").forEach(select => {

        select.addEventListener("change", e => {

            const id = e.target.dataset.id;

            const orden = ordenesGlobales.find(o => o.id === id);

            if (!orden) return;

            orden.estado = e.target.value;

            localStorage.setItem(
                "distritoCosmeticoPedidos",
                JSON.stringify(ordenesGlobales)
            );

        });

    });

    container.querySelectorAll('.btn-ver-orden').forEach(btn => {
        btn.addEventListener('click', () => abrirDetalleOrden(Number(btn.dataset.id)));
    });
}

function abrirDetalleOrden(id) {
    const orden = ordenesGlobales.find(o => o.id === id);
    if (!orden) return;

    document.getElementById('ordenDetalleModalLabel').textContent = `Orden #${orden.id}`;

    const body = document.getElementById('orden-detalle-body');
    body.innerHTML = `

<div class="row mb-4">

    <div class="col-md-6">

        <p><strong>Cliente:</strong> ${orden.usuario}</p>

    </div>

    <div class="col-md-6">

        <p><strong>Fecha:</strong> ${orden.fecha}</p>

        <p><strong>Estado:</strong> ${orden.estado}</p>

    </div>

</div>

<h6 class="fw-bold mb-3">

Productos del pedido

</h6>

<table class="table">

    <thead>

        <tr>

            <th>Producto</th>

            <th>Precio</th>

            <th>Cantidad</th>

            <th>Subtotal</th>

        </tr>

    </thead>

    <tbody>

        ${orden.productos.map(producto => `

            <tr>

                <td>${producto.nombre}</td>

                <td>₡${producto.precio.toLocaleString("es-CR")}</td>

                <td>${producto.cantidad}</td>

                <td>

                    ₡${(producto.precio * producto.cantidad).toLocaleString("es-CR")}

                </td>

            </tr>

        `).join("")}

    </tbody>

    <tfoot>

        <tr>

            <td colspan="3" class="text-end fw-bold">

                Total

            </td>

            <td class="fw-bold">

                ₡${orden.total.toLocaleString("es-CR")}

            </td>

        </tr>

    </tfoot>

</table>

`;

    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('ordenDetalleModal'));
    modal.show();
}

document.addEventListener('DOMContentLoaded', initAdminModule);