const tablaUsuarios = document.querySelector('#tablaUsuarios tbody');
const usuarioModalElement = document.getElementById('usuarioModal');
const usuarioModal = new bootstrap.Modal(usuarioModalElement);
const formUsuario = document.getElementById('formUsuario');
const btnCrearUsuario = document.getElementById('btnCrearUsuario');
const btnGuardarUsuario = document.getElementById('btnGuardarUsuario');
const usuarioId = document.getElementById('usuarioId');
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const email = document.getElementById('email');
const phone = document.getElementById('phone');
const username = document.getElementById('username');
const password = document.getElementById('password');

usuarioModalElement.addEventListener('show.bs.modal', function () {
    usuarioModalElement.removeAttribute('aria-hidden');
});
usuarioModalElement.addEventListener('hide.bs.modal', function () {
    usuarioModalElement.setAttribute('aria-hidden', 'true');
});

let editando = false;

function getHeaders() {
    const token = sessionStorage.getItem('accessToken');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
}

async function cargarUsuarios() {
    try {
        const response = await fetch('https://dummyjson.com/users', {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Error al cargar usuarios');
        const data = await response.json();
        mostrarUsuarios(data.users);
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar usuarios');
    }
}

function mostrarUsuarios(usuarios) {
    tablaUsuarios.innerHTML = '';
    usuarios.forEach(usuario => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${usuario.id}</td>
            <td>${usuario.firstName}</td>
            <td>${usuario.lastName}</td>
            <td>
                <button class="btn btn-sm btn-warning me-2" onclick="editarUsuario(${usuario.id})">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="eliminarUsuario(${usuario.id})">Eliminar</button>
            </td>
        `;
        tablaUsuarios.appendChild(fila);
    });
}

function actualizarFilaEnTabla(id, usuarioActualizado) {
    const filas = tablaUsuarios.querySelectorAll('tr');
    filas.forEach(fila => {
        const idCelda = fila.cells[0].textContent;
        if (parseInt(idCelda) === id) {
            fila.cells[1].textContent = usuarioActualizado.firstName;
            fila.cells[2].textContent = usuarioActualizado.lastName;
        }
    });
}

function agregarFilaATabla(nuevoUsuario) {
    const fila = document.createElement('tr');
    fila.innerHTML = `
        <td>${nuevoUsuario.id}</td>
        <td>${nuevoUsuario.firstName}</td>
        <td>${nuevoUsuario.lastName}</td>
        <td>
            <button class="btn btn-sm btn-warning me-2" onclick="editarUsuario(${nuevoUsuario.id})">Editar</button>
            <button class="btn btn-sm btn-danger" onclick="eliminarUsuario(${nuevoUsuario.id})">Eliminar</button>
        </td>
    `;
    tablaUsuarios.appendChild(fila);
}

function eliminarFilaDeTabla(id) {
    const filas = tablaUsuarios.querySelectorAll('tr');
    filas.forEach(fila => {
        const idCelda = fila.cells[0].textContent;
        if (parseInt(idCelda) === id) {
            fila.remove();
        }
    });
}

async function crearUsuario() {
    const nuevoUsuario = {
        firstName: firstName.value.trim(),
        lastName: lastName.value.trim(),
        email: email.value.trim(),
        phone: phone.value.trim(),
        username: username.value.trim(),
        password: password.value.trim()
    };

    try {
        const response = await fetch('https://dummyjson.com/users/add', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(nuevoUsuario)
        });
        if (!response.ok) throw new Error('Error al crear usuario');
        const data = await response.json();
        agregarFilaATabla(data);
        alert('Usuario creado exitosamente');
        usuarioModal.hide();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al crear usuario');
    }
}

async function editarUsuario(id) {
    try {
        const response = await fetch(`https://dummyjson.com/users/${id}`, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Error al obtener usuario');
        const usuario = await response.json();

        usuarioId.value = usuario.id;
        firstName.value = usuario.firstName;
        lastName.value = usuario.lastName;
        email.value = usuario.email;
        phone.value = usuario.phone || '';
        username.value = usuario.username;
        password.value = ''; 

        document.getElementById('usuarioModalLabel').textContent = 'Editar Usuario';
        editando = true;
        usuarioModal.show();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar usuario para editar');
    }
}

async function actualizarUsuario() {
    const id = parseInt(usuarioId.value);
    const usuarioActualizado = {
        firstName: firstName.value.trim(),
        lastName: lastName.value.trim(),
        email: email.value.trim(),
        phone: phone.value.trim(),
        username: username.value.trim()
    };

    if (password.value.trim()) {
        usuarioActualizado.password = password.value.trim();
    }

    try {
        const response = await fetch(`https://dummyjson.com/users/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(usuarioActualizado)
        });
        if (!response.ok) throw new Error('Error al actualizar usuario');
        const data = await response.json();
        actualizarFilaEnTabla(id, data);
        alert('Usuario actualizado exitosamente');
        usuarioModal.hide();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al actualizar usuario');
    }
}

async function eliminarUsuario(id) {
    if (!confirm('¿Está seguro de eliminar este usuario?')) return;

    try {
        const response = await fetch(`https://dummyjson.com/users/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Error al eliminar usuario');
        eliminarFilaDeTabla(id);
        alert('Usuario eliminado exitosamente');
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar usuario');
    }
}

btnCrearUsuario.addEventListener('click', () => {
    formUsuario.reset();
    usuarioId.value = '';
    document.getElementById('usuarioModalLabel').textContent = 'Crear Usuario';
    editando = false;
});

btnGuardarUsuario.addEventListener('click', async () => {
    if (!formUsuario.checkValidity()) {
        formUsuario.reportValidity();
        return;
    }

    if (editando) {
        await actualizarUsuario();
    } else {
        await crearUsuario();
    }
});

document.addEventListener('DOMContentLoaded', cargarUsuarios);

window.editarUsuario = editarUsuario;
window.eliminarUsuario = eliminarUsuario;
