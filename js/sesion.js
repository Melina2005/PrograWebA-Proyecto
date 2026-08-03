document.addEventListener("layoutCargado", () => {

    const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));

    const nombreUsuario = document.getElementById("nombreUsuario");
    const btnUsuario = document.getElementById("btnUsuario");

    const nombreUsuarioMobile = document.getElementById("nombreUsuarioMobile");
    const btnUsuarioMobile = document.getElementById("btnUsuarioMobile");

    if (usuario) {

        const primerNombre = usuario.nombre.split(" ")[0];

        if (nombreUsuario) {
            nombreUsuario.textContent = primerNombre;
        }

        if (btnUsuario) {
            btnUsuario.href = "mi-cuenta.html";
        }

        if (nombreUsuarioMobile) {
            nombreUsuarioMobile.textContent = primerNombre;
        }

        if (btnUsuarioMobile) {
            btnUsuarioMobile.href = "mi-cuenta.html";
        }

    } else {

        if (nombreUsuario) {
            nombreUsuario.textContent = "Invitado";
        }

        if (btnUsuario) {
            btnUsuario.href = "login.html";
        }

        if (nombreUsuarioMobile) {
            nombreUsuarioMobile.textContent = "Invitado";
        }

        if (btnUsuarioMobile) {
            btnUsuarioMobile.href = "login.html";
        }

    }

});