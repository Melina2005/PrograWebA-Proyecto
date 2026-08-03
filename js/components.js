// ==========================
// Carga de componentes HTML
// ==========================

async function cargarComponente(id, archivo) {

    const contenedor = document.getElementById(id);

    if (!contenedor) return;

    try {

        const respuesta = await fetch(archivo);

        if (!respuesta.ok) {

            throw new Error(`No se pudo cargar ${archivo}`);

        }

        contenedor.innerHTML = await respuesta.text();

    }

    catch (error) {

        console.error(error);

    }

}

// ==========================
// Cargar todos los componentes
// ==========================

async function cargarLayout() {

    await Promise.all([

        cargarComponente("header", "components/header.html"),

        cargarComponente("mobile-menu", "components/mobile-menu.html"),

        cargarComponente("footer", "components/footer.html"),

        cargarComponente("product-modal", "components/product-modal.html")

    ]);

    // Avisar que los componentes ya existen

    document.dispatchEvent(
        new Event("layoutCargado")
    );

}

// Ejecutar

cargarLayout();