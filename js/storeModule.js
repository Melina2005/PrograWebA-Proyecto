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

        const pagina = window.location.pathname.split("/").pop();

        if (document.getElementById('productos-container')) {

            let productosFiltrados = [];

            switch (pagina) {

                case 'maquillaje.html':
                    productosFiltrados = productosGlobales.filter(
                        p => p.categoria === 'Maquillaje'
                    );
                    break;

                case 'skincare.html':
                    productosFiltrados = productosGlobales.filter(
                        p => p.categoria === 'Skincare'
                    );
                    break;

                case 'cabello.html':
                    productosFiltrados = productosGlobales.filter(
                        p => p.categoria === 'Cabello'
                    );
                    break;

                case 'fragancias.html':
                    productosFiltrados = productosGlobales.filter(
                        p => p.categoria === 'Fragancias'
                    );
                    break;

                case 'corporal.html':
                    productosFiltrados = productosGlobales.filter(
                        p => p.categoria === 'Corporal'
                    );
                    break;

                case 'mas-vendidos.html':
                    productosFiltrados = productosGlobales.filter(
                        p => p.seccion === 'mas_vendidos'
                    );
                    break;

                case 'nuevos-productos.html':
                    productosFiltrados = productosGlobales.filter(
                        p => p.seccion === 'nuevos_productos'
                    );
                    break;
            }

            renderizarLista(productosFiltrados, 'productos-container');

        } else {

            renderizarSecciones(productosGlobales);

        }
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
        const wrapper = document.createElement('div');

        if(containerId === 'productos-container'){
            wrapper.className = 'col-md-4 col-lg-3';
        }else{
            wrapper.className = '';
        }

        const card = document.createElement('article');
        card.className = 'product-card';
        card.onclick = () => abrirModal(producto);

        const imgWrapper = document.createElement('div');
        imgWrapper.className = 'product-img-wrapper';

      const img = document.createElement('img');

        img.src = producto.imagen; // 👈 así directo
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

        const price = document.createElement('p');
        price.className = 'fw-bold mt-2 mb-1';
        price.textContent = `₡${Number(producto.precio).toLocaleString('es-CR')}`;

        card.append(imgWrapper, title, description, price);

        if(containerId === 'productos-container'){
            wrapper.appendChild(card);
            fragmento.appendChild(wrapper);
        }else{
            fragmento.appendChild(card);
        }
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
    const titulo = document.getElementById('modal-titulo');
    const categoria = document.getElementById('modal-categoria');
    const precio = document.getElementById('modal-precio');
    const descripcion = document.getElementById('modal-descripcion');
    const disponibilidad = document.getElementById('modal-disponibilidad');

    if (imgModal) {
        imgModal.src = producto.imagen;
        imgModal.onerror = () => {
            imgModal.src = FALLBACK_URL;
        };
    }

    if (titulo) titulo.textContent = producto.nombre;
    if (categoria) categoria.textContent = producto.categoria;

    if (precio) {
        precio.textContent = `₡${Number(producto.precio).toLocaleString('es-CR')}`;
    }

    if (descripcion) descripcion.textContent = producto.descripcion;

    if (disponibilidad) {
        disponibilidad.textContent = producto.disponible ? 'Disponible' : 'Agotado';
        disponibilidad.className =
            `badge p-2 px-3 rounded-pill mt-2 ${
                producto.disponible ? 'badge-disponibilidad' : 'bg-danger'
            }`;
    }

    const modalElement = document.getElementById('productModal');
    const productModal = bootstrap.Modal.getOrCreateInstance(modalElement);
    productModal.show();
}