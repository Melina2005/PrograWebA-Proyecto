const usuario =
    JSON.parse(localStorage.getItem("usuarioActivo"));

if (!usuario) {

    window.location.href = "login.html";

}

document.getElementById("perfilNombre").textContent =
    usuario.nombre.split(" ")[0];

document.getElementById("nombreCompleto").textContent =
    usuario.nombre;

document.getElementById("correoUsuario").textContent =
    usuario.correo;

const pedidos =
    JSON.parse(localStorage.getItem("distritoCosmeticoPedidos")) || [];

const pedidosUsuario =
    pedidos.filter(pedido => pedido.usuario === usuario.correo);

const lista =
    document.getElementById("listaPedidos");

if (pedidosUsuario.length === 0) {

    lista.innerHTML = `

        <div class="alert alert-light border rounded-4 text-center">

            <h5 class="mb-2">
                Aún no has realizado compras
            </h5>

            <p class="text-muted mb-0">
                Cuando finalices una compra aparecerá aquí el historial de tus pedidos.
            </p>

        </div>

    `;

} else {

    pedidosUsuario.forEach(pedido => {

        let badge = "secondary";

        switch (pedido.estado) {

            case "En preparación":
                badge = "warning";
                break;

            case "En camino":
                badge = "primary";
                break;

            case "Entregado":
                badge = "success";
                break;

        }

        lista.innerHTML += `

            <div class="card border mb-3 rounded-4 shadow-sm">

                <div class="card-body">

                    <div class="d-flex justify-content-between align-items-center">

                        <div>

                            <h6 class="fw-bold mb-1">

                                ${pedido.id}

                            </h6>

                            <small class="text-muted">

                                ${pedido.fecha}

                            </small>

                        </div>

                        <span class="badge bg-${badge}">

                            ${pedido.estado}

                        </span>

                    </div>

                    <hr>

                    <div class="mb-3">

                        ${pedido.productos.map(producto => `

                            <div class="d-flex justify-content-between">

                                <span>

                                    ${producto.cantidad} × ${producto.nombre}

                                </span>

                                <span>

                                    ₡${(producto.precio * producto.cantidad).toLocaleString("es-CR")}

                                </span>

                            </div>

                        `).join("")}

                    </div>

                    <hr>

                    <div class="d-flex justify-content-between">

                        <strong>Total</strong>

                        <strong>

                            ₡${pedido.total.toLocaleString("es-CR")}

                        </strong>

                    </div>

                </div>

            </div>

        `;

    });

}

document.getElementById("btnCerrarSesion")
    .addEventListener("click", () => {

        localStorage.removeItem("usuarioActivo");

        window.location.href = "login.html";

    });