(function sessionManager() {
    const usuarioLogueado = sessionStorage.getItem("usuarioLogueado");
    const navAuthItem = document.getElementById('nav-auth-item');

    const isProtectedPage = window.location.pathname.includes("formAltaMedicos.html");
    if (isProtectedPage && !usuarioLogueado) {
        window.location.replace("login.html");
        return; 
    }
   
    if (usuarioLogueado && navAuthItem) {
        navAuthItem.innerHTML = `
            <a class="nav-link text-center" id="enlace-logout" href="#" style="font-weight: bold; color: var(--color-primary-hover);">CERRAR SESIÓN</a>
        `;
     
        const logoutLink = document.getElementById('enlace-logout');
        if (logoutLink) {
            logoutLink.addEventListener('click', function(event) {
                event.preventDefault();
                sessionStorage.removeItem("usuarioLogueado"); 
                window.location.href = "login.html"; 
            });
        }
    } 
   
})();