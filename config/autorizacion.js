document.addEventListener('DOMContentLoaded', function() {
    const accessToken = sessionStorage.getItem("accessToken");
    const usuarioLogueado = sessionStorage.getItem("usuarioLogueado");
    const userRole = sessionStorage.getItem("userRole");
    const navAuthItem = document.getElementById('nav-auth-item');

    const isProtectedPage = window.location.pathname.includes("formAltaMedicos.html") || window.location.pathname.includes("usuarios.html") || window.location.pathname.includes("especialidades.html") || window.location.pathname.includes("obrasSociales.html") || window.location.pathname.includes("formAltaTurnos.html") || window.location.pathname.includes("reservasAdmin.html");
    if (isProtectedPage && !accessToken) {
        window.location.replace("login.html");
        return;
    }

    if (accessToken && navAuthItem) {
        let navLinks = '';

        if (userRole === 'admin') {
            navLinks = `
                <div class="d-flex">
                    <a class="nav-link" id="enlace-usuarios" href="usuarios.html" title="Usuarios"><i class="bi bi-people" style="color: white;"></i></a>
                    <a class="nav-link" id="enlace-medicos" href="formAltaMedicos.html" title="Alta Médicos"><i class="bi bi-heart-pulse" style="color: white;"></i></a>
                    <a class="nav-link" id="enlace-especialidades" href="especialidades.html" title="Especialidades"><i class="bi bi-clipboard-data" style="color: white;"></i></a>
                    <a class="nav-link" id="enlace-obras-sociales" href="obrasSociales.html" title="Obras Sociales"><i class="bi bi-shield-check" style="color: white;"></i></a>
                    <a class="nav-link" id="enlace-turnos" href="formAltaTurnos.html" title="Alta Turnos"><i class="bi bi-calendar-check" style="color: white;"></i></a>
                    <a class="nav-link" id="enlace-reservas-admin" href="reservasAdmin.html" title="Reservas Admin"><i class="bi bi-calendar-event" style="color: white;"></i></a>
                    <a class="nav-link" id="enlace-contactos-admin" href="contactosAdmin.html" title="Contactos Admin"><i class="bi bi-envelope" style="color: white;"></i></a>
                    <a class="nav-link" id="enlace-logout" href="#" title="Cerrar Sesión" style="font-weight: bold; color: var(--color-primary-hover);"><i class="bi bi-box-arrow-right" style="color: white;"></i></a>
                </div>
            `;
        }

        navAuthItem.innerHTML = navLinks;

        const logoutLink = document.getElementById('enlace-logout');
        if (logoutLink) {
            logoutLink.addEventListener('click', function(event) {
                event.preventDefault();
                sessionStorage.removeItem("accessToken");
                sessionStorage.removeItem("usuarioLogueado");
                sessionStorage.removeItem("userRole");
                window.location.href = "login.html";
            });
        }
    }
});
