// ==========================
// Usuario con sesión iniciada
// ==========================

const usuario = JSON.parse(
    localStorage.getItem("usuarioActivo")
);

// Desktop

const nombreUsuario =
document.getElementById("nombreUsuario");

const btnUsuario =
document.getElementById("btnUsuario");

// Mobile

const nombreUsuarioMobile =
document.getElementById("nombreUsuarioMobile");

const btnUsuarioMobile =
document.getElementById("btnUsuarioMobile");

// ==========================

if(usuario){

    const primerNombre =
        usuario.nombre.split(" ")[0];

    if(nombreUsuario){

        nombreUsuario.textContent =
            primerNombre;

    }

    if(nombreUsuarioMobile){

        nombreUsuarioMobile.textContent =
            primerNombre;

    }

    if(btnUsuario){

        btnUsuario.href =
            "mi-cuenta.html";

    }

    if(btnUsuarioMobile){

        btnUsuarioMobile.href =
            "mi-cuenta.html";

    }

}