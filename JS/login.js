const formLogin = document.getElementById('formLogin');
const usuario = document.getElementById('usuario');
const clave = document.getElementById('clave');
const mensaje = document.getElementById('mensaje');

function mostrarMensaje(texto, tipo){
    mensaje.innerHTML = `
            <div class="container">
                <div class="alert alert-${tipo}">${texto}</div>
            </div>`;
}

formLogin.addEventListener('submit', async function(event){
    event.preventDefault();

    let usuarioInput = usuario.value.trim();
    let claveInput = clave.value.trim();
    let rolInput = document.getElementById('rol').value;

    if (!usuarioInput || !claveInput) {
        mostrarMensaje('Todos los campos son requeridos.', "danger");
        return;
    }

    try {
        const response = await fetch('https://dummyjson.com/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: usuarioInput,
                password: claveInput
            })
        });

        if (response.ok) {
            const data = await response.json();
            // Obtener detalles del usuario para verificar el rol
            try {
                const userResponse = await fetch(`https://dummyjson.com/users/${data.id}`);
                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    if (userData.role === 'admin') {
                        sessionStorage.setItem("accessToken", data.accessToken);
                        sessionStorage.setItem("usuarioLogueado", usuarioInput);
                        sessionStorage.setItem("userRole", 'admin');
                        mostrarMensaje('Bienvenido administrador', "success");
                        window.location.href = "usuarios.html";
                    } else {
                        mostrarMensaje('Solo los administradores pueden loguearse.', "danger");
                    }
                } else {
                    mostrarMensaje('Error al verificar el rol del usuario.', "danger");
                }
            } catch (error) {
                console.error('Error al obtener usuario:', error);
                mostrarMensaje('Error de conexión. Intente nuevamente.', "danger");
            }
        } else {
            mostrarMensaje('Acceso inválido. Verifique usuario y contraseña.', "danger");
        }
    } catch (error) {
        console.error('Error en login:', error);
        mostrarMensaje('Error de conexión. Intente nuevamente.', "danger");
    }
})
