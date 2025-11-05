import {turnosIniciales} from '../config/turnosIniciales.js';
import {staffInicial} from '../config/medicosiniciales.js';

const listadoTurnosBody = document.querySelector('#listadoTurnos tbody');
const turnoModalElement = document.getElementById('turnoModal');
const turnoModal = new bootstrap.Modal(turnoModalElement);
const formAltaTurnos = document.getElementById('altaTurnosForm');
const inputMedico = document.getElementById('medico');
const inputFecha = document.getElementById('fecha');
const inputHora = document.getElementById('hora');
const btnCrearTurno = document.getElementById('btnCrearTurno');
const btnGuardarTurno = document.getElementById('btnGuardarTurno');
const turnoId = document.getElementById('turnoId');

turnoModalElement.addEventListener('show.bs.modal', function () {
    turnoModalElement.removeAttribute('aria-hidden');
});
turnoModalElement.addEventListener('hide.bs.modal', function () {
    turnoModalElement.setAttribute('aria-hidden', 'true');
});

let editando = false;

function inicializarLocalStorageTurnos(){
    if (!localStorage.getItem('turnos')) {
        localStorage.setItem('turnos', JSON.stringify(turnosIniciales));
    }
    // Forzar recarga de médicos para asegurar datos correctos
    localStorage.setItem('medicos', JSON.stringify(staffInicial));
}

function cargarMedicos(){
    let medicos = JSON.parse(localStorage.getItem('medicos')) || [];
    inputMedico.innerHTML = '<option value="">Seleccione médico</option>';
    medicos.forEach(medico => {
        let option = document.createElement('option');
        option.value = String(medico.id);
        option.textContent = medico.nombre;
        inputMedico.appendChild(option);
    });
}

function actualizarTabla(){
    let turnos = JSON.parse(localStorage.getItem('turnos')) || [];
    let medicos = JSON.parse(localStorage.getItem('medicos')) || [];
    listadoTurnosBody.innerHTML = '';

    turnos.forEach((turno, index) => {
        let medicoNombre = turno.medico ? medicos.find(m => m.id === turno.medico)?.nombre || 'Desconocido' : 'Sin asignar';
        let fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${turno.id}</td>
            <td>${medicoNombre}</td>
            <td>${turno.fecha}</td>
            <td>${turno.hora}</td>
            <td>
                <button class="btn btn-sm btn-warning me-2" onclick="editarTurno(${index})">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="eliminarTurno(${index})">Eliminar</button>
            </td>
        `;
        listadoTurnosBody.appendChild(fila);
    });
}

function actualizarFilaEnTabla(index, turnoActualizado) {
    const filas = listadoTurnosBody.querySelectorAll('tr');
    if (filas[index]) {
        let medicos = JSON.parse(localStorage.getItem('medicos')) || [];
        let medicoNombre = turnoActualizado.medico ? medicos.find(m => m.id === turnoActualizado.medico)?.nombre || 'Desconocido' : 'Sin asignar';
        filas[index].cells[1].textContent = medicoNombre;
        filas[index].cells[2].textContent = turnoActualizado.fecha;
        filas[index].cells[3].textContent = turnoActualizado.hora;
    }
}

function agregarFilaATabla(nuevoTurno) {
    let medicos = JSON.parse(localStorage.getItem('medicos')) || [];
    let medicoNombre = nuevoTurno.medico ? medicos.find(m => m.id === nuevoTurno.medico)?.nombre || 'Desconocido' : 'Sin asignar';
    const fila = document.createElement('tr');
    fila.innerHTML = `
        <td>${nuevoTurno.id}</td>
        <td>${medicoNombre}</td>
        <td>${nuevoTurno.fecha}</td>
        <td>${nuevoTurno.hora}</td>
        <td>
            <button class="btn btn-sm btn-warning me-2" onclick="editarTurno(${JSON.parse(localStorage.getItem('turnos')).length - 1})">Editar</button>
            <button class="btn btn-sm btn-danger" onclick="eliminarTurno(${JSON.parse(localStorage.getItem('turnos')).length - 1})">Eliminar</button>
        </td>
    `;
    listadoTurnosBody.appendChild(fila);
}

function eliminarFilaDeTabla(index) {
    const filas = listadoTurnosBody.querySelectorAll('tr');
    if (filas[index]) {
        filas[index].remove();
    }
}

function crearTurno() {
    let medico = Number(inputMedico.value);
    let fecha = inputFecha.value;
    let hora = inputHora.value;
    let disponible = true; // Siempre disponible por defecto

    if (!medico || !fecha || !hora) {
        alert('Por favor, complete todos los campos requeridos');
        return;
    }

    let turnos = JSON.parse(localStorage.getItem('turnos')) || [];
    const nuevoTurno = { id: Date.now(), medico, fecha, hora, disponible };
    turnos.push(nuevoTurno);
    localStorage.setItem('turnos', JSON.stringify(turnos));
    agregarFilaATabla(nuevoTurno);
    alert('Turno creado exitosamente');
    turnoModal.hide();
}

function editarTurno(index) {
    let turnos = JSON.parse(localStorage.getItem('turnos')) || [];
    let turno = turnos[index];

    turnoId.value = index;
    inputMedico.value = String(turno.medico);
    inputFecha.value = turno.fecha;
    inputHora.value = turno.hora;

    document.getElementById('turnoModalLabel').textContent = 'Editar Turno';
    editando = true;
    turnoModal.show();
}

function actualizarTurno() {
    const index = parseInt(turnoId.value);
    let medico = Number(inputMedico.value);
    let fecha = inputFecha.value;
    let hora = inputHora.value;
    let disponible = true; // Siempre disponible por defecto

    if (!medico || !fecha || !hora) {
        alert('Por favor, complete todos los campos requeridos');
        return;
    }

    let turnos = JSON.parse(localStorage.getItem('turnos')) || [];
    const turnoActualizado = { id: turnos[index].id, medico, fecha, hora, disponible };
    turnos[index] = turnoActualizado;
    localStorage.setItem('turnos', JSON.stringify(turnos));
    actualizarFilaEnTabla(index, turnoActualizado);
    alert('Turno actualizado exitosamente');
    turnoModal.hide();
}

function eliminarTurno(index) {
    if (!confirm('¿Está seguro de eliminar este turno?')) return;

    let turnos = JSON.parse(localStorage.getItem('turnos')) || [];
    turnos.splice(index, 1);
    localStorage.setItem('turnos', JSON.stringify(turnos));
    eliminarFilaDeTabla(index);
    alert('Turno eliminado exitosamente');
}

btnCrearTurno.addEventListener('click', () => {
    formAltaTurnos.reset();
    turnoId.value = '';
    cargarMedicos();
    document.getElementById('turnoModalLabel').textContent = 'Crear Turno';
    editando = false;
});

btnGuardarTurno.addEventListener('click', async () => {
    if (!formAltaTurnos.checkValidity()) {
        formAltaTurnos.reportValidity();
        return;
    }

    if (editando) {
        await actualizarTurno();
    } else {
        await crearTurno();
    }
});

inicializarLocalStorageTurnos();
cargarMedicos();
actualizarTabla();

window.editarTurno = editarTurno;
window.eliminarTurno = eliminarTurno;
