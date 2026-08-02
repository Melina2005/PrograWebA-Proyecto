const usuario =
JSON.parse(localStorage.getItem("usuarioActivo"));

if(!usuario){

    window.location.href = "login.html";

}

document.getElementById("perfilNombre").textContent =
usuario.nombre.split(" ")[0];

document.getElementById("nombreCompleto").textContent =
usuario.nombre;

document.getElementById("correoUsuario").textContent =
usuario.correo;



const pedidos = [

    {

        numero:"DC-2026001",

        fecha:"26/07/2026",

        estado:"En preparación",

        total:"₡18 500"

    },

    {

        numero:"DC-2026002",

        fecha:"18/07/2026",

        estado:"En camino",

        total:"₡27 300"

    },

    {

        numero:"DC-2026003",

        fecha:"10/07/2026",

        estado:"Entregado",

        total:"₡9 990"

    }

];



const lista =
document.getElementById("listaPedidos");

pedidos.forEach(pedido=>{

    let badge="secondary";

    switch(pedido.estado){

        case "En preparación":

            badge="warning";

            break;

        case "En camino":

            badge="primary";

            break;

        case "Entregado":

            badge="success";

            break;

    }

    lista.innerHTML += `

    <div class="card border mb-3 rounded-4">

        <div class="card-body">

            <div class="d-flex justify-content-between align-items-center">

                <div>

                    <h6 class="fw-bold mb-1">

                        Pedido ${pedido.numero}

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

            <div class="d-flex justify-content-between">

                <span>Total</span>

                <strong>${pedido.total}</strong>

            </div>

        </div>

    </div>

    `;

});



document.getElementById("btnCerrarSesion")

.addEventListener("click",()=>{

    localStorage.removeItem("usuarioActivo");

    window.location.href="login.html";

});