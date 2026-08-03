const CARRITO_KEY = 'distritoCosmeticoCarrito';
const PRODUCTOS_URL = 'data/productos.json';
const FALLBACK_URL = 'data/assets/fallback.webp';

function leerCarrito() {
    try {
        const guardado = JSON.parse(localStorage.getItem(CARRITO_KEY) || '[]');
        if (!Array.isArray(guardado)) return [];

        return guardado
            .map(item => ({ id: Number(item.id), cantidad: Number(item.cantidad) }))
            .filter(item => Number.isInteger(item.id) && item.id > 0 && Number.isInteger(item.cantidad) && item.cantidad > 0);
    } catch (error) {
        console.warn('No se pudo leer el carrito guardado.', error);
        return [];
    }
}

function guardarCarrito(carrito) {
    try {
        localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
    } catch (error) {
        console.error('No se pudo guardar el carrito.', error);
    }
    actualizarContadores();
}

function obtenerCantidadTotal(carrito = leerCarrito()) {
    return carrito.reduce((total, item) => total + item.cantidad, 0);
}

export function actualizarContadores() {
    const cantidad = obtenerCantidadTotal();
    document.querySelectorAll('a[href="carrito.html"]').forEach(enlace => {
        let badge = enlace.querySelector('.cart-count');
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'cart-count badge rounded-pill bg-danger';
            enlace.appendChild(badge);
        }
        badge.textContent = cantidad;
        badge.classList.toggle('d-none', cantidad === 0);
    });
}

function productoValido(producto) {
    return producto && producto.disponible === true && Number(producto.stock) > 0;
}

export function agregarAlCarrito(producto) {
    if (!productoValido(producto)) {
        return { ok: false, mensaje: 'Este producto no está disponible.' };
    }

    const carrito = leerCarrito();
    const existente = carrito.find(item => item.id === Number(producto.id));
    const nuevaCantidad = (existente?.cantidad || 0) + 1;

    if (nuevaCantidad > Number(producto.stock)) {
        return { ok: false, mensaje: `Solo hay ${producto.stock} unidad(es) disponible(s).` };
    }

    if (existente) existente.cantidad = nuevaCantidad;
    else carrito.push({ id: Number(producto.id), cantidad: 1 });

    guardarCarrito(carrito);
    return { ok: true, mensaje: 'Producto agregado al carrito.' };
}

export function eliminarDelCarrito(id) {
    guardarCarrito(leerCarrito().filter(item => item.id !== Number(id)));
}

export function vaciarCarrito() {
    guardarCarrito([]);
}

function establecerCantidad(id, cantidad, productosPorId) {
    const producto = productosPorId.get(Number(id));
    const carrito = leerCarrito();
    const item = carrito.find(linea => linea.id === Number(id));
    if (!item || !producto) return;

    const cantidadNormalizada = Math.floor(Number(cantidad));
    if (cantidadNormalizada <= 0) {
        eliminarDelCarrito(id);
        return;
    }

    const cantidadLimitada = Math.min(cantidadNormalizada, Number(producto.stock));
    if (cantidadLimitada <= 0 || !productoValido(producto)) {
        eliminarDelCarrito(id);
        return;
    }

    item.cantidad = cantidadLimitada;
    guardarCarrito(carrito);
}

function formatoPrecio(valor) {
    return `₡${Number(valor).toLocaleString('es-CR')}`;
}

function crearControlCantidad(item, producto, productosPorId) {
    const grupo = document.createElement('div');
    grupo.className = 'input-group input-group-sm cart-quantity';

    const disminuir = document.createElement('button');
    disminuir.type = 'button';
    disminuir.className = 'btn btn-outline-secondary';
    disminuir.textContent = '−';
    disminuir.setAttribute('aria-label', `Disminuir cantidad de ${producto.nombre}`);
    disminuir.addEventListener('click', () => {
        establecerCantidad(item.id, item.cantidad - 1, productosPorId);
        renderizarCarrito(productosPorId);
    });

    const cantidad = document.createElement('span');
    cantidad.className = 'form-control text-center';
    cantidad.textContent = item.cantidad;
    cantidad.setAttribute('aria-label', `Cantidad de ${producto.nombre}`);

    const aumentar = document.createElement('button');
    aumentar.type = 'button';
    aumentar.className = 'btn btn-outline-secondary';
    aumentar.textContent = '+';
    aumentar.disabled = item.cantidad >= Number(producto.stock);
    aumentar.setAttribute('aria-label', `Aumentar cantidad de ${producto.nombre}`);
    aumentar.addEventListener('click', () => {
        if (item.cantidad >= Number(producto.stock)) {
            alert(`Solo hay ${producto.stock} unidad(es) disponible(s).`);
            return;
        }
        establecerCantidad(item.id, item.cantidad + 1, productosPorId);
        renderizarCarrito(productosPorId);
    });

    grupo.append(disminuir, cantidad, aumentar);
    return grupo;
}

function renderizarCarrito(productosPorId) {
    const cuerpo = document.getElementById('carrito-body');
    const vacio = document.getElementById('carrito-vacio');
    const resumen = document.getElementById('carrito-resumen');
    const botonVaciar = document.getElementById('btn-vaciar-carrito');
    if (!cuerpo || !vacio || !resumen) return;

    cuerpo.replaceChildren();
    let total = 0;
    const carritoActual = leerCarrito();
    const carritoValidado = carritoActual
        .map(item => {
            const producto = productosPorId.get(item.id);
            if (!productoValido(producto)) return null;
            return { id: item.id, cantidad: Math.min(item.cantidad, Number(producto.stock)) };
        })
        .filter(item => item && item.cantidad > 0);

    if (JSON.stringify(carritoActual) !== JSON.stringify(carritoValidado)) {
        guardarCarrito(carritoValidado);
    }

    const items = carritoValidado
        .map(item => ({ ...item, producto: productosPorId.get(item.id) }))
        .filter(item => item.producto);

    if (items.length === 0) {
        vacio.classList.remove('d-none');
        resumen.classList.add('d-none');
        botonVaciar?.classList.add('d-none');
        actualizarContadores();
        return;
    }

    vacio.classList.add('d-none');
    resumen.classList.remove('d-none');
    botonVaciar?.classList.remove('d-none');

    items.forEach(item => {
        const subtotal = Number(item.producto.precio) * item.cantidad;
        total += subtotal;

        const fila = document.createElement('tr');
        const productoCelda = document.createElement('td');
        productoCelda.className = 'cart-product';
        const imagen = document.createElement('img');
        imagen.src = item.producto.imagen;
        imagen.alt = item.producto.nombre;
        imagen.onerror = () => { imagen.src = FALLBACK_URL; };
        const nombre = document.createElement('span');
        nombre.textContent = item.producto.nombre;
        productoCelda.append(imagen, nombre);

        const precio = document.createElement('td');
        precio.textContent = formatoPrecio(item.producto.precio);
        const cantidad = document.createElement('td');
        cantidad.appendChild(crearControlCantidad(item, item.producto, productosPorId));
        const subtotalCelda = document.createElement('td');
        subtotalCelda.textContent = formatoPrecio(subtotal);
        const acciones = document.createElement('td');
        const eliminar = document.createElement('button');
        eliminar.type = 'button';
        eliminar.className = 'btn btn-sm btn-outline-danger';
        eliminar.textContent = 'Eliminar';
        eliminar.addEventListener('click', () => {
            eliminarDelCarrito(item.id);
            renderizarCarrito(productosPorId);
        });
        acciones.appendChild(eliminar);
        fila.append(productoCelda, precio, cantidad, subtotalCelda, acciones);
        cuerpo.appendChild(fila);
    });

    document.getElementById('carrito-total').textContent = formatoPrecio(total);
    actualizarContadores();
}

export async function initCartPage() {
    actualizarContadores();
    if (!document.getElementById('carrito-body')) return;

    try {
        const respuesta = await fetch(PRODUCTOS_URL);
        if (!respuesta.ok) throw new Error(`Error al cargar productos: ${respuesta.status}`);
        const productos = await respuesta.json();
        const productosPorId = new Map(productos.map(producto => [Number(producto.id), producto]));

        renderizarCarrito(productosPorId);
        document.getElementById('btn-vaciar-carrito')?.addEventListener('click', () => {
            if (confirm('¿Deseas vaciar el carrito?')) {
                vaciarCarrito();
                renderizarCarrito(productosPorId);
            }
        });
        document.getElementById('btn-finalizar-compra')?.addEventListener('click', () => {
            if (leerCarrito().length === 0) return;
            if (confirm('¿Confirmas la compra? Esta simulación vaciará el carrito.')) {
                vaciarCarrito();
                renderizarCarrito(productosPorId);
                alert('Compra realizada exitosamente.');
            }
        });
    } catch (error) {
        console.error(error);
        const vacio = document.getElementById('carrito-vacio');
        if (vacio) {
            vacio.classList.remove('d-none');
            vacio.textContent = 'No se pudieron cargar los productos del carrito.';
        }
    }
}

export function inicializarBotonAgregar(producto) {
    const boton = document.querySelector('#productModal .modal-footer button');
    if (!boton) return;

    boton.disabled = !productoValido(producto);
    boton.onclick = () => {
        const resultado = agregarAlCarrito(producto);
        alert(resultado.mensaje);
    };
}

actualizarContadores();
