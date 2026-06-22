const URL = "../data";
const PRODUCTOS_URL = `${URL}/productos.json`;
const ASSETS_URL = `${URL}/assets`;
const FALLBACK_URL = `${ASSETS_URL}/fallback.webp`;

let productosGlobales = [];

export async function initStoreModule() {
    const inputBuscadorDesktop = document.getElementById('buscador-desktop');
    const inputBuscadorMobile = document.getElementById('buscador-mobile');

    try {
        const res = await fetch(PRODUCTOS_URL);
        if (!res.ok) {
            throw new Error(`Error en la petición: ${res.status}`);
        }
        productosGlobales = await res.json();
        renderizarSecciones(productosGlobales);
    } catch (error) {
        console.error("Hubo un error :", error);
        
        const containers = ['mas-vendidos-container', 'nuevos-productos-container'];
        containers.forEach(id => {
            const container = document.getElementById(id);
            if (container) {
                container.replaceChildren();
                const errorMsg = document.createElement('p');
                errorMsg.className = 'text-danger';
                errorMsg.textContent = 'Estamos experimentando problemas para cargar los productos.';
                container.appendChild(errorMsg);
            }
        });
    }

    if (inputBuscadorDesktop) inputBuscadorDesktop.addEventListener('input', manejarBusqueda);
    if (inputBuscadorMobile) inputBuscadorMobile.addEventListener('input', manejarBusqueda);
}

function renderizarSecciones(productos) {
    const masVendidos = productos.filter(p => p.seccion === 'mas_vendidos');
    const nuevos = productos.filter(p => p.seccion === 'nuevos_productos');

    renderizarLista(masVendidos, 'mas-vendidos-container');
    renderizarLista(nuevos, 'nuevos-productos-container');
}

function renderizarLista(lista, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.replaceChildren();

    if (lista.length === 0) {
        const noResults = document.createElement('p');
        noResults.className = 'text-muted w-100 mt-2';
        noResults.textContent = 'No se encontraron resultados.';
        container.appendChild(noResults);
        return;
    }

    const fragmento = document.createDocumentFragment();

    lista.forEach(producto => {
        const card = document.createElement('article');
        card.className = 'product-card';
        card.onclick = () => abrirModal(producto);

        const imgWrapper = document.createElement('div');
        imgWrapper.className = 'product-img-wrapper';

        const img = document.createElement('img');
        img.src = producto.imagen;
        img.alt = producto.nombre;
        img.onerror = (e) => {
            e.target.onerror = null;
            e.target.src = FALLBACK_URL;
        };
        imgWrapper.appendChild(img);

        const title = document.createElement('h6');
        title.className = 'text-truncate mb-1';
        title.textContent = producto.nombre;

        const description = document.createElement('small');
        description.className = 'd-block text-truncate mb-auto';
        description.textContent = producto.descripcion;

        card.append(imgWrapper, title, description);
        fragmento.appendChild(card);
    });

    container.appendChild(fragmento);
}

function manejarBusqueda(evento) {
    const termino = evento.target.value.toLowerCase().trim();

    const desktop = document.getElementById('buscador-desktop');
    const mobile = document.getElementById('buscador-mobile');
    if (desktop && evento.target.id === 'buscador-mobile') desktop.value = evento.target.value;
    if (mobile && evento.target.id === 'buscador-desktop') mobile.value = evento.target.value;

    if (termino === '') {
        renderizarSecciones(productosGlobales);
        return;
    }

    const filtrados = productosGlobales.filter(producto => {
        const coincideNombre = producto.nombre?.toLowerCase().includes(termino);
        const coincideCategoria = producto.categoria?.toLowerCase().includes(termino);
        return coincideNombre || coincideCategoria;
    });

    renderizarSecciones(filtrados);
}

function abrirModal(producto) {
    const imgModal = document.getElementById('modal-img');
    if (imgModal) {
        imgModal.src = producto.imagen;
        imgModal.onerror = function () {
            this.onerror = null;
            this.src = FALLBACK_URL;
        };
    }

    const titulo = document.getElementById('modal-titulo');
    if (titulo) titulo.textContent = producto.nombre;

    const categoria = document.getElementById('modal-categoria');
    if (categoria) categoria.textContent = producto.categoria;

    const precio = document.getElementById('modal-precio');
    if (precio) precio.textContent = `₡${producto.precio.toLocaleString('es-CR')}`;

    const descripcion = document.getElementById('modal-descripcion');
    if (descripcion) descripcion.textContent = producto.descripcion;

    const disponibilidad = document.getElementById('modal-disponibilidad');
    if (disponibilidad) {
        disponibilidad.textContent = producto.disponible ? 'Disponible' : 'Agotado';
        disponibilidad.className = `badge p-2 px-3 rounded-pill mt-2 ${producto.disponible ? 'badge-disponibilidad' : 'bg-danger'}`;
    }

    // Abrir Modal de Bootstrap
    const productModal = new bootstrap.Modal(document.getElementById('productModal'));
    productModal.show();
}