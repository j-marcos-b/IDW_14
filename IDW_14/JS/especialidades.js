import {especialidadesIniciales} from '../config/especialidades.js';

const listadoEspecialidadesBody = document.querySelector('#listadoEspecialidades tbody');
const especialidadModalElement = document.getElementById('especialidadModal');
const especialidadModal = new bootstrap.Modal(especialidadModalElement);
const formAltaEspecialidades = document.getElementById('altaEspecialidadesForm');
const inputNombreEspecialidad = document.getElementById('nombreEspecialidad');
const btnCrearEspecialidad = document.getElementById('btnCrearEspecialidad');
const btnGuardarEspecialidad = document.getElementById('btnGuardarEspecialidad');
const especialidadId = document.getElementById('especialidadId');

especialidadModalElement.addEventListener('show.bs.modal', function () {
    especialidadModalElement.removeAttribute('aria-hidden');
});
especialidadModalElement.addEventListener('hide.bs.modal', function () {
    especialidadModalElement.setAttribute('aria-hidden', 'true');
});

let editando = false;

function inicializarLocalStorageEspecialidades(){
    if (!localStorage.getItem('especialidades')) {
        localStorage.setItem('especialidades', JSON.stringify(especialidadesIniciales));
    }
}

function actualizarTablaEspecialidades(){
    let especialidades = JSON.parse(localStorage.getItem('especialidades')) || [];
    listadoEspecialidadesBody.innerHTML = '';

    especialidades.forEach((especialidad, index) => {
        let fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${especialidad.id}</td>
            <td>${especialidad.nombre}</td>
            <td>
                <button class="btn btn-sm btn-warning me-2" onclick="editarEspecialidad(${index})">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="eliminarEspecialidad(${index})">Eliminar</button>
            </td>
        `;
        listadoEspecialidadesBody.appendChild(fila);
    });
}

function actualizarFilaEnTabla(index, especialidadActualizada) {
    const filas = listadoEspecialidadesBody.querySelectorAll('tr');
    if (filas[index]) {
        filas[index].cells[1].textContent = especialidadActualizada.nombre;
    }
}

function agregarFilaATabla(nuevaEspecialidad) {
    const fila = document.createElement('tr');
    fila.innerHTML = `
        <td>${nuevaEspecialidad.id}</td>
        <td>${nuevaEspecialidad.nombre}</td>
        <td>
            <button class="btn btn-sm btn-warning me-2" onclick="editarEspecialidad(${JSON.parse(localStorage.getItem('especialidades')).length - 1})">Editar</button>
            <button class="btn btn-sm btn-danger" onclick="eliminarEspecialidad(${JSON.parse(localStorage.getItem('especialidades')).length - 1})">Eliminar</button>
        </td>
    `;
    listadoEspecialidadesBody.appendChild(fila);
}

function eliminarFilaDeTabla(index) {
    const filas = listadoEspecialidadesBody.querySelectorAll('tr');
    if (filas[index]) {
        filas[index].remove();
    }
}

function crearEspecialidad() {
    const nuevaEspecialidad = {
        id: Date.now(),
        nombre: inputNombreEspecialidad.value.trim()
    };

    if (!nuevaEspecialidad.nombre) {
        alert('Por favor, complete el nombre de la especialidad');
        return;
    }

    let especialidades = JSON.parse(localStorage.getItem('especialidades')) || [];
    especialidades.push(nuevaEspecialidad);
    localStorage.setItem('especialidades', JSON.stringify(especialidades));
    agregarFilaATabla(nuevaEspecialidad);
    alert('Especialidad creada exitosamente');
    especialidadModal.hide();
}

function editarEspecialidad(index) {
    let especialidades = JSON.parse(localStorage.getItem('especialidades')) || [];
    let especialidad = especialidades[index];

    especialidadId.value = index;
    inputNombreEspecialidad.value = especialidad.nombre;

    document.getElementById('especialidadModalLabel').textContent = 'Editar Especialidad';
    editando = true;
    especialidadModal.show();
}

function actualizarEspecialidad() {
    const index = parseInt(especialidadId.value);
    const especialidadActualizada = {
        id: JSON.parse(localStorage.getItem('especialidades'))[index].id,
        nombre: inputNombreEspecialidad.value.trim()
    };

    if (!especialidadActualizada.nombre) {
        alert('Por favor, complete el nombre de la especialidad');
        return;
    }

    let especialidades = JSON.parse(localStorage.getItem('especialidades')) || [];
    especialidades[index] = especialidadActualizada;
    localStorage.setItem('especialidades', JSON.stringify(especialidades));
    actualizarFilaEnTabla(index, especialidadActualizada);
    alert('Especialidad actualizada exitosamente');
    especialidadModal.hide();
}

function eliminarEspecialidad(index) {
    if (!confirm('¿Está seguro de eliminar esta especialidad?')) return;

    let especialidades = JSON.parse(localStorage.getItem('especialidades')) || [];
    especialidades.splice(index, 1);
    localStorage.setItem('especialidades', JSON.stringify(especialidades));
    eliminarFilaDeTabla(index);
    alert('Especialidad eliminada exitosamente');
}

btnCrearEspecialidad.addEventListener('click', () => {
    formAltaEspecialidades.reset();
    especialidadId.value = '';
    document.getElementById('especialidadModalLabel').textContent = 'Crear Especialidad';
    editando = false;
});

btnGuardarEspecialidad.addEventListener('click', async () => {
    if (!formAltaEspecialidades.checkValidity()) {
        formAltaEspecialidades.reportValidity();
        return;
    }

    if (editando) {
        await actualizarEspecialidad();
    } else {
        await crearEspecialidad();
    }
});

inicializarLocalStorageEspecialidades();
actualizarTablaEspecialidades();

window.editarEspecialidad = editarEspecialidad;
window.eliminarEspecialidad = eliminarEspecialidad;