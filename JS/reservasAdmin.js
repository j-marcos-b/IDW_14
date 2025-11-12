import { especialidadesIniciales } from '../config/especialidades.js';
import { staffInicial } from '../config/medicosiniciales.js';
import { obrasSocialesIniciales } from '../config/obrasSociales.js';
import { turnosIniciales } from '../config/turnosIniciales.js';

const filtroEspecialidad = document.getElementById('filtroEspecialidad');
const filtroMedico = document.getElementById('filtroMedico');
const filtroFecha = document.getElementById('filtroFecha');
const reservasTableBody = document.getElementById('reservasTableBody');

function inicializarLocalStorageReservasAdmin() {
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

function cargarFiltros() {
    const especialidades = JSON.parse(localStorage.getItem('especialidades')) || [];
    filtroEspecialidad.innerHTML = '<option value="">Todas</option>';
    especialidades.forEach(especialidad => {
        const option = document.createElement('option');
        option.value = especialidad.id;
        option.textContent = especialidad.nombre;
        filtroEspecialidad.appendChild(option);
    });

    const medicos = JSON.parse(localStorage.getItem('medicos')) || [];
    filtroMedico.innerHTML = '<option value="">Todos</option>';
    medicos.forEach(medico => {
        const option = document.createElement('option');
        option.value = medico.id;
        let nombreCompleto = medico.nombre || `${medico.titulo || ''} ${medico.firstName || ''} ${medico.lastName || ''}`.trim();
        option.textContent = nombreCompleto;
        filtroMedico.appendChild(option);
    });
}

function cargarReservas(filtros = {}) {
    const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
    const medicos = JSON.parse(localStorage.getItem('medicos')) || [];
    const especialidades = JSON.parse(localStorage.getItem('especialidades')) || [];
    const obrasSociales = JSON.parse(localStorage.getItem('obrasSociales')) || [];
    const turnos = JSON.parse(localStorage.getItem('turnos')) || [];

    let reservasFiltradas = reservas;

    if (filtros.especialidad) {
        reservasFiltradas = reservasFiltradas.filter(r => r.especialidad == filtros.especialidad);
    }
    if (filtros.medico) {
        reservasFiltradas = reservasFiltradas.filter(r => {
            const turno = turnos.find(t => t.id == r.turno);
            return turno && turno.medico == filtros.medico;
        });
    }
    if (filtros.fecha) {
        reservasFiltradas = reservasFiltradas.filter(r => {
            const turno = turnos.find(t => t.id == r.turno);
            return turno && turno.fecha === filtros.fecha;
        });
    }

    reservasTableBody.innerHTML = '';

    reservasFiltradas.forEach(reserva => {
        const medico = medicos.find(m => {
            const turno = turnos.find(t => t.id == reserva.turno);
            return turno && turno.medico == m.id;
        });
        const especialidad = especialidades.find(e => e.id == reserva.especialidad);
        const obraSocial = obrasSociales.find(o => o.id == reserva.obraSocial);
        const turno = turnos.find(t => t.id == reserva.turno);

        let nombreMedico = 'Desconocido';
        if (medico) {
            nombreMedico = medico.nombre || `${medico.titulo || ''} ${medico.firstName || ''} ${medico.lastName || ''}`.trim();
        }

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${reserva.nombre}</td>
            <td>${reserva.documento}</td>
            <td>${nombreMedico}</td>
            <td>${especialidad ? especialidad.nombre : 'Desconocida'}</td>
            <td>${obraSocial ? obraSocial.nombre : 'Sin obra social'}</td>
            <td>${turno ? `${turno.fecha} ${turno.hora}` : 'Desconocido'}</td>
            <td>$${reserva.valorTotal}</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="cancelarReserva(${reserva.id})">Cancelar</button>
            </td>
        `;
        reservasTableBody.appendChild(row);
    });
}

function cancelarReserva(reservaId) {
    if (confirm('¿Está seguro de que desea cancelar esta reserva?')) {
        const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
        const turnos = JSON.parse(localStorage.getItem('turnos')) || [];

        const reservaIndex = reservas.findIndex(r => r.id == reservaId);
        if (reservaIndex !== -1) {
            const reserva = reservas[reservaIndex];
            // Liberar turno
            const turnoIndex = turnos.findIndex(t => t.id == reserva.turno);
            if (turnoIndex !== -1) {
                turnos[turnoIndex].disponible = true;
                localStorage.setItem('turnos', JSON.stringify(turnos));
            }
            // Eliminar reserva
            reservas.splice(reservaIndex, 1);
            localStorage.setItem('reservas', JSON.stringify(reservas));
            cargarReservas();
        }
    }
}

// Event listeners para filtros
filtroEspecialidad.addEventListener('change', () => {
    const filtros = {
        especialidad: filtroEspecialidad.value,
        medico: filtroMedico.value,
        fecha: filtroFecha.value
    };
    cargarReservas(filtros);
});

filtroMedico.addEventListener('change', () => {
    const filtros = {
        especialidad: filtroEspecialidad.value,
        medico: filtroMedico.value,
        fecha: filtroFecha.value
    };
    cargarReservas(filtros);
});

filtroFecha.addEventListener('change', () => {
    const filtros = {
        especialidad: filtroEspecialidad.value,
        medico: filtroMedico.value,
        fecha: filtroFecha.value
    };
    cargarReservas(filtros);
});

// Inicialización
inicializarLocalStorageReservasAdmin();
cargarFiltros();
cargarReservas();

// Exponer función global para onclick
window.cancelarReserva = cancelarReserva;
