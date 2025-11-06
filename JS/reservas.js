import { especialidadesIniciales } from '../config/especialidades.js';
import { staffInicial } from '../config/medicosiniciales.js';
import { obrasSocialesIniciales } from '../config/obrasSociales.js';
import { turnosIniciales } from '../config/turnosIniciales.js';

const formReserva = document.querySelector('.reserva_form');
const selectEspecialidad = document.getElementById('especialidad');
const selectMedico = document.getElementById('medico');
const selectTurnoDisponible = document.getElementById('turnoDisponible');
const inputNombre = document.getElementById('nombre');
const inputDni = document.getElementById('dni');
const inputTelefono = document.getElementById('telefono');
const inputEmail = document.getElementById('email');

// Agregar select de obra social si no existe
if (!document.getElementById('obraSocial')) {
    const labelObraSocial = document.createElement('label');
    labelObraSocial.setAttribute('for', 'obraSocial');
    labelObraSocial.textContent = 'Obra Social:';
    const selectObraSocial = document.createElement('select');
    selectObraSocial.id = 'obraSocial';
    selectObraSocial.name = 'obraSocial';
    selectObraSocial.className = 'form-select';
    selectObraSocial.required = true;
    selectObraSocial.innerHTML = '<option value="">Seleccione una obra social</option>';
    // Insertar después de especialidad
    selectEspecialidad.parentNode.insertAdjacentElement('afterend', labelObraSocial);
    labelObraSocial.insertAdjacentElement('afterend', selectObraSocial);
    labelObraSocial.insertAdjacentHTML('afterend', '<br><br>');
}
const selectObraSocial = document.getElementById('obraSocial');

function inicializarLocalStorageReservas() {
    if (!localStorage.getItem('reservas')) {
        localStorage.setItem('reservas', JSON.stringify([]));
    }
    if (!localStorage.getItem('medicos')) {
        localStorage.setItem('medicos', JSON.stringify(staffInicial));
    }
    if (!localStorage.getItem('especialidades')) {
        localStorage.setItem('especialidades', JSON.stringify(especialidadesIniciales));
    }
    if (!localStorage.getItem('obrasSociales')) {
        localStorage.setItem('obrasSociales', JSON.stringify(obrasSocialesIniciales));
    }
    if (!localStorage.getItem('turnos')) {
        localStorage.setItem('turnos', JSON.stringify(turnosIniciales));
    }
}

function cargarEspecialidades() {
    const especialidades = JSON.parse(localStorage.getItem('especialidades')) || [];
    selectEspecialidad.innerHTML = '<option value="">Seleccione una especialidad</option>';
    especialidades.forEach(especialidad => {
        const option = document.createElement('option');
        option.value = especialidad.id;
        option.textContent = especialidad.nombre;
        selectEspecialidad.appendChild(option);
    });
}

function cargarObrasSociales() {
    const obrasSociales = JSON.parse(localStorage.getItem('obrasSociales')) || [];
    selectObraSocial.innerHTML = '<option value="">Seleccione una obra social</option>';
    obrasSociales.forEach(obra => {
        const option = document.createElement('option');
        option.value = obra.id;
        option.textContent = obra.nombre;
        selectObraSocial.appendChild(option);
    });
}

function filtrarMedicosPorEspecialidad(especialidadId) {
    const medicos = JSON.parse(localStorage.getItem('medicos')) || [];
    return medicos.filter(medico => medico.especialidad == especialidadId);
}

function cargarMedicos(especialidadId) {
    const medicosFiltrados = especialidadId ? filtrarMedicosPorEspecialidad(especialidadId) : [];
    selectMedico.innerHTML = '<option value="">Seleccione un médico</option>';
    medicosFiltrados.forEach(medico => {
        const option = document.createElement('option');
        option.value = medico.id;
        option.textContent = medico.nombre;
        selectMedico.appendChild(option);
    });
    // Reset turnos disponibles cuando cambia médico
    selectTurnoDisponible.innerHTML = '<option value="">Seleccione un turno disponible</option>';
}

function cargarTurnosDisponibles(medicoId) {
    const turnos = JSON.parse(localStorage.getItem('turnos')) || [];
    const turnosFiltrados = turnos.filter(turno => turno.medico == medicoId && turno.disponible);
    selectTurnoDisponible.innerHTML = '<option value="">Seleccione un turno disponible</option>';
    turnosFiltrados.forEach(turno => {
        const option = document.createElement('option');
        option.value = turno.id;
        option.textContent = `${turno.fecha} ${turno.hora}`;
        selectTurnoDisponible.appendChild(option);
    });
}

function calcularCosto(medicoId, obraSocialId) {
    const medicos = JSON.parse(localStorage.getItem('medicos')) || [];
    const medico = medicos.find(m => m.id == medicoId);
    if (!medico) return 0;
    let costo = medico.valorConsulta;
    // Descuentos por obra social
    const descuentos = {
        1: 0.2, // Galeno 20%
        2: 0.1, // Medicus 10%
        3: 0.1, // Omint 10%
        4: 0.2, // Swiss Medical 20%
        5: 0.1, // IOMA 10%
        6: 0.1, // Medifé 10%
        7: 0.1, // OSPe 10%
        8: 0.4, // PAMI 40%
        9: 0.1, // Apres 10%
        10: 0.1, // OSECAC 10%
        11: 0.1, // OSERA 10%
        12: 0.1, // OSPLAD 10%
        13: 0.3, // Luis Pasteur 30%
        14: 0.3, // OSDE 30%
        15: 0.1, // UPCN 10%
    };
    const descuento = descuentos[obraSocialId] || 0;
    return costo * (1 - descuento);
}

function mostrarResumen(reserva) {
    const medicos = JSON.parse(localStorage.getItem('medicos')) || [];
    const especialidades = JSON.parse(localStorage.getItem('especialidades')) || [];
    const obrasSociales = JSON.parse(localStorage.getItem('obrasSociales')) || [];
    const turnos = JSON.parse(localStorage.getItem('turnos')) || [];

    const medico = medicos.find(m => m.id == reserva.medico);
    const especialidad = especialidades.find(e => e.id == reserva.especialidad);
    const obraSocial = obrasSociales.find(o => o.id == reserva.obraSocial);
    const turno = turnos.find(t => t.id == reserva.turno);

    const resumen = `
Reserva Confirmada

Paciente: ${reserva.nombre}
DNI: ${reserva.documento}
Médico: ${medico ? medico.nombre : 'Desconocido'}
Especialidad: ${especialidad ? especialidad.nombre : 'Desconocida'}
Obra Social: ${obraSocial ? obraSocial.nombre : 'Sin obra social'}
Fecha y Hora: ${turno ? `${turno.fecha} ${turno.hora}` : 'Desconocido'}
Valor Total: $${reserva.valorTotal}
    `;
    alert(resumen);
}

formReserva.addEventListener('submit', function(event) {
    event.preventDefault();

    const especialidad = Number(selectEspecialidad.value);
    const medico = Number(selectMedico.value);
    const turnoId = Number(selectTurnoDisponible.value);
    const nombre = inputNombre.value.trim();
    const documento = inputDni.value.trim();
    const telefono = inputTelefono.value.trim();
    const email = inputEmail.value.trim();
    const obraSocial = Number(selectObraSocial.value);

    if (!turnoId) {
        alert('Seleccione un turno disponible.');
        return;
    }

    // Obtener turno seleccionado
    const turnos = JSON.parse(localStorage.getItem('turnos')) || [];
    const turnoSeleccionado = turnos.find(t => t.id == turnoId);
    if (!turnoSeleccionado || !turnoSeleccionado.disponible) {
        alert('El turno seleccionado no está disponible.');
        return;
    }

    // Calcular costo
    const valorTotal = calcularCosto(medico, obraSocial);

    // Crear reserva
    const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
    const nuevaReserva = {
        id: Date.now(),
        documento,
        nombre,
        turno: turnoSeleccionado.id,
        especialidad,
        obraSocial,
        valorTotal
    };
    reservas.push(nuevaReserva);
    localStorage.setItem('reservas', JSON.stringify(reservas));

    // Actualizar turno a no disponible
    const turnoIndex = turnos.findIndex(t => t.id == turnoSeleccionado.id);
    if (turnoIndex !== -1) {
        turnos[turnoIndex].disponible = false;
        localStorage.setItem('turnos', JSON.stringify(turnos));
    }

    // Mostrar resumen
    mostrarResumen(nuevaReserva);

    // Reset form
    formReserva.reset();
    cargarMedicos();
});

selectEspecialidad.addEventListener('change', function() {
    const especialidadId = this.value;
    cargarMedicos(especialidadId);
});

selectMedico.addEventListener('change', function() {
    const medicoId = this.value;
    cargarTurnosDisponibles(medicoId);
});

inicializarLocalStorageReservas();
cargarEspecialidades();
cargarObrasSociales();