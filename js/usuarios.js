// Lista de usuarios almacenados
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

// Usuario con sesión iniciada
let usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

// ==============================
// FORMULARIOS
// ==============================

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

// ==============================
// LOGIN
// ==============================

if (loginForm) {

    loginForm.addEventListener("submit", function (e) {

        e.preventDefault();

        limpiarErrores();

        const correo = document.getElementById("loginCorreo").value.trim();
        const password = document.getElementById("loginPassword").value;

        let valido = true;

        if (correo === "") {

            mostrarError("loginCorreo");
            valido = false;

        }

        if (password === "") {

            mostrarError("loginPassword");
            valido = false;

        }

        if (!valido) return;

        const usuario = usuarios.find(u =>
            u.correo === correo &&
            u.password === password
        );

        if (!usuario) {

            mostrarMensaje(
                "Correo o contraseña incorrectos.",
                "danger"
            );

            return;
        }

        localStorage.setItem(
            "usuarioActivo",
            JSON.stringify(usuario)
        );

        window.location.href = "index.html";

    });

}

// ==============================
// REGISTRO
// ==============================

if (registerForm) {

    registerForm.addEventListener("submit", function (e) {

        e.preventDefault();

        limpiarErrores();

        const nombre = document.getElementById("registroNombre").value.trim();

        const correo = document.getElementById("registroCorreo").value.trim();

        const password = document.getElementById("registroPassword").value;

        const confirmar = document.getElementById("registroConfirmacion").value;

        let valido = true;

        // Nombre

        if (nombre.length < 3) {

            mostrarError("registroNombre");
            valido = false;

        }

        // Correo

        if (!validarCorreo(correo)) {

            mostrarError("registroCorreo");
            valido = false;

        }

        // Contraseña

        if (password.length < 8) {

            mostrarError("registroPassword");
            valido = false;

        }

        // Confirmación

        if (password !== confirmar) {

            mostrarError("registroConfirmacion");
            valido = false;

        }

        // Correo repetido

        const existe = usuarios.some(u => u.correo === correo);

        if (existe) {

            mostrarMensaje(
                "Este correo ya está registrado.",
                "warning"
            );

            return;

        }

        if (!valido) return;

        const nuevoUsuario = {

            nombre,
            correo,
            password

        };

        usuarios.push(nuevoUsuario);

        localStorage.setItem(
            "usuarios",
            JSON.stringify(usuarios)
        );

        mostrarMensaje(
            "Cuenta creada correctamente. Ahora puedes iniciar sesión.",
            "success"
        );

        registerForm.reset();

        document.getElementById("login-tab").click();

    });

}

// ==============================
// FUNCIONES AUXILIARES
// ==============================

function validarCorreo(correo) {

    const expresion =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return expresion.test(correo);

}

function mostrarError(id) {

    document
        .getElementById(id)
        .classList.add("is-invalid");

}

function limpiarErrores() {

    document
        .querySelectorAll(".form-control")
        .forEach(input => {

            input.classList.remove("is-invalid");

        });

}

function mostrarMensaje(texto, tipo) {

    const mensaje = document.getElementById("mensajeGeneral");

    mensaje.innerHTML =

        `
        <div class="alert alert-${tipo}">
            ${texto}
        </div>
        `;

}

// ==============================
// FUNCIONES REUTILIZABLES
// ==============================

// Saber si hay sesión iniciada

function usuarioHaIniciadoSesion() {

    return localStorage.getItem("usuarioActivo") != null;

}

// Obtener usuario activo

function obtenerUsuarioActivo() {

    return JSON.parse(
        localStorage.getItem("usuarioActivo")
    );

}

// Cerrar sesión

function cerrarSesion() {

    localStorage.removeItem("usuarioActivo");

    window.location.href = "login.html";

}