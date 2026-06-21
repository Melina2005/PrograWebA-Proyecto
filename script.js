const URL = "./productos.json";
let productosGlobales = [];

document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los inputs de búsqueda
    const inputBuscadorDesktop = document.getElementById('buscador-desktop');
    const inputBuscadorMobile = document.getElementById('buscador-mobile');

    // Cargar JSON
    fetch(URL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la petición: ${response.status}`);
            }
            return response.json();
        })
        .then(productos => {
            productosGlobales = productos;
            renderizarSecciones(productosGlobales);
        })
        .catch(error => {
            console.error("Hubo un error cargando el JSON:", error);
            const errorMsg = `<p class="text-danger">Error al cargar el catálogo de productos.</p>`;
            document.getElementById('mas-vendidos-container').innerHTML = errorMsg;
            document.getElementById('nuevos-productos-container').innerHTML = errorMsg;
        });

    // Eventos de búsqueda
    if(inputBuscadorDesktop) inputBuscadorDesktop.addEventListener('input', manejarBusqueda);
    if(inputBuscadorMobile) inputBuscadorMobile.addEventListener('input', manejarBusqueda);
});

// Filtra las secciones para inyectar a cada contenedor correspondiente
function renderizarSecciones(productos) {
    const masVendidos = productos.filter(p => p.seccion === 'mas_vendidos');
    const nuevos = productos.filter(p => p.seccion === 'nuevos_productos');

    renderizarLista(masVendidos, 'mas-vendidos-container');
    renderizarLista(nuevos, 'nuevos-productos-container');
}

// Crea las cartas dinámicamente según el array recibido
function renderizarLista(lista, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Limpiar contenedor
    container.innerHTML = '';

    if (lista.length === 0) {
        container.innerHTML = `<p class="text-muted w-100 mt-2">No se encontraron resultados.</p>`;
        return;
    }

    lista.forEach(producto => {
        const card = document.createElement('article');
        card.className = 'product-card';
        card.onclick = () => abrirModal(producto);

        // Se usa un div envoltura para la imagen para replicar el cuadro color arena del wireframe
        card.innerHTML = `
            <div class="product-img-wrapper">
                <!-- Se usa un icono de imagen como placeholder si no hay imagen -->
                <img src="${producto.imagen}" alt="${producto.nombre}" onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0iIzcxNjFlZiIgY2xhc3M9ImJpIGJpLWltYWdlIiB2aWV3Qm94PSIwIDAgMTYgMTYiPjxwYXRoIGQ9Ik02LjAwMiA1LjVBMi41IDIuNSAwIDEgMSA4LjUgOCAyLjUgMi41IDAgMCAxIDYuMDAyIDUuNXoiLz48cGF0aCBkPSJNMTEuMDAyIDEuNWExLjUgMS41IDAgMCAxIDEuNSAxLjV2MTBhMS41IDEuNSAwIDAgMS0xLjUgMS41aC0xMGExLjUgMS41IDAgMCAxLTEuNS0xLjV2LTEwYTEuNSAxLjUgMCAwIDEgMS41LTEuNWgxMHptLS41IDZhLjUuNSAwIDAgMC0uNDg1LjM3OWwtMS41IDVhLjUuNSAwIDAgMCAuOTcuMjQybDEuMTE2LTMuNzE5IDEuMTI2IDIuMjVhLjUuNSAwIDAgMCAuODItLjU3M2wtMi41LTV6bS03Ljg3OS0uM2ExLjUgMS41IDAgMCAwLTEuMDg1LjI2M0wzLjUgOS41M2wxLjU1OC0zLjExNWEuNS41IDAgMCAxIC44OTUgMGwzIDYgMS40NDEtMi44ODJhLjUuNSAwIDAgMSAuODg2LjAxNWwuNzUgMS41YS41LjUgMCAwIDEgLS44OTQuNDRMMTAgMTAuMjYgNy41IDUuMjZsLTMuNCA2LjhBMiAyIDAgMCAxIDQgMTJ2LTEuNzRsMi4xMi00LjI0MnoiLz48L3N2Zz4=';">
            </div>
            <h6 class="text-truncate mb-1">${producto.nombre}</h6>
            <small class="d-block text-truncate mb-auto">${producto.descripcion}</small>
        `;
        container.appendChild(card);
    });
}

// Filtro de búsqueda cruzada para título o categoría
function manejarBusqueda(evento) {
    const termino = evento.target.value.toLowerCase().trim();
    
    // Sincronizar ambos buscadores (mobile y desktop) si el usuario cambia de vista
    const desktop = document.getElementById('buscador-desktop');
    const mobile = document.getElementById('buscador-mobile');
    if(desktop && evento.target.id === 'buscador-mobile') desktop.value = termino;
    if(mobile && evento.target.id === 'buscador-desktop') mobile.value = termino;

    if(termino === '') {
        renderizarSecciones(productosGlobales);
        return;
    }

    const filtrados = productosGlobales.filter(producto => {
        const coincideNombre = producto.nombre.toLowerCase().includes(termino);
        const coincideCategoria = producto.categoria.toLowerCase().includes(termino);
        return coincideNombre || coincideCategoria;
    });

    // Inyecta los mismos resultados filtrados en ambas secciones para que sea evidente
    renderizarSecciones(filtrados);
}

// Maneja la información del modal
function abrirModal(producto) {
    const imgModal = document.getElementById('modal-img');
    imgModal.src = producto.imagen;
    // Fallback imagen para el modal
    imgModal.onerror = function() {
        this.onerror=null; 
        this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0iIzcxNjFlZiIgY2xhc3M9ImJpIGJpLWltYWdlIiB2aWV3Qm94PSIwIDAgMTYgMTYiPjxwYXRoIGQ9Ik02LjAwMiA1LjVBMi41IDIuNSAwIDEgMSA4LjUgOCAyLjUgMi41IDAgMCAxIDYuMDAyIDUuNXoiLz48cGF0aCBkPSJNMTEuMDAyIDEuNWExLjUgMS41IDAgMCAxIDEuNSAxLjV2MTBhMS41IDEuNSAwIDAgMS0xLjUgMS41aC0xMGExLjUgMS41IDAgMCAxLTEuNS0xLjV2LTEwYTEuNSAxLjUgMCAwIDEgMS41LTEuNWgxMHptLS41IDZhLjUuNSAwIDAgMC0uNDg1LjM3OWwtMS41IDVhLjUuNSAwIDAgMCAuOTcuMjQybDEuMTE2LTMuNzE5IDEuMTI2IDIuMjVhLjUuNSAwIDAgMCAuODItLjU3M2wtMi41LTV6bS03Ljg3OS0uM2ExLjUgMS41IDAgMCAwLTEuMDg1LjI2M0wzLjUgOS41M2wxLjU1OC0zLjExNWEuNS41IDAgMCAxIC44OTUgMGwzIDYgMS40NDEtMi44ODJhLjUuNSAwIDAgMSAuODg2LjAxNWwuNzUgMS41YS41LjUgMCAwIDEgLS44OTQuNDRMMTAgMTAuMjYgNy41IDUuMjZsLTMuNCA2LjhBMiAyIDAgMCAxIDQgMTJ2LTEuNzRsMi4xMi00LjI0MnoiLz48L3N2Zz4=';
    };

    document.getElementById('modal-titulo').textContent = producto.nombre;
    document.getElementById('modal-categoria').textContent = producto.categoria;
    document.getElementById('modal-precio').textContent = `₡${producto.precio.toLocaleString('es-CR')}`;
    document.getElementById('modal-descripcion').textContent = producto.descripcion;
    
    const disponibilidad = document.getElementById('modal-disponibilidad');
    disponibilidad.textContent = producto.disponible ? 'Disponible' : 'Agotado';
    disponibilidad.className = `badge p-2 px-3 rounded-pill mt-2 ${producto.disponible ? 'badge-disponibilidad' : 'bg-danger'}`;

    // Abrir Modal de Bootstrap
    const productModal = new bootstrap.Modal(document.getElementById('productModal'));
    productModal.show();
}
