// ==========================
// Usuario con sesión iniciada
// ==========================

// Obtener el usuario activo desde localStorage
const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));

// ==========================
// Elementos Desktop
// ==========================

const nombreUsuario = document.getElementById("nombreUsuario");
const btnUsuario = document.getElementById("btnUsuario");

// ==========================
// Elementos Mobile
// ==========================

const nombreUsuarioMobile = document.getElementById("nombreUsuarioMobile");
const btnUsuarioMobile = document.getElementById("btnUsuarioMobile");

// ==========================
// Actualizar interfaz
// ==========================

if (usuario) {

    const primerNombre = usuario.nombre.split(" ")[0];

    // -------- Desktop --------

    if (nombreUsuario) {
        nombreUsuario.textContent = primerNombre;
    }

    if (btnUsuario) {
        btnUsuario.href = "mi-cuenta.html";
    }

    // -------- Mobile --------

    if (nombreUsuarioMobile) {
        nombreUsuarioMobile.textContent = primerNombre;
    }

    if (btnUsuarioMobile) {
        btnUsuarioMobile.href = "mi-cuenta.html";
    }

} else {

    // -------- Desktop --------

    if (nombreUsuario) {
        nombreUsuario.textContent = "Invitado";
    }

    if (btnUsuario) {
        btnUsuario.href = "login.html";
    }

    // -------- Mobile --------

    if (nombreUsuarioMobile) {
        nombreUsuarioMobile.textContent = "Invitado";
    }

    if (btnUsuarioMobile) {
        btnUsuarioMobile.href = "login.html";
    }

}