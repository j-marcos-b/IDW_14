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
            sessionStorage.setItem("accessToken", data.token);
            sessionStorage.setItem("usuarioLogueado", usuarioInput);
            sessionStorage.setItem("userRole", rolInput);
            mostrarMensaje('Bienvenido ' + rolInput, "success");

            if (rolInput === 'admin') {
                window.location.href = "usuarios.html";
            }
        } else {
            mostrarMensaje('Acceso inválido. Verifique usuario y contraseña.', "danger");
        }
    } catch (error) {
        console.error('Error en login:', error);
        mostrarMensaje('Error de conexión. Intente nuevamente.', "danger");
    }
})
