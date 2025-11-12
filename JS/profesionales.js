import {staffInicial} from '../config/medicosiniciales.js';
import {especialidadesIniciales} from '../config/especialidades.js';
import {obrasSocialesIniciales} from '../config/obrasSociales.js';

function inicializarLocalStorageSimple(){
    if (!localStorage.getItem('medicos')) {
        localStorage.setItem('medicos', JSON.stringify(staffInicial));
    } else {
        // Limpiar fotografias inválidas de médicos precargados
        let medicos = JSON.parse(localStorage.getItem('medicos'));
        medicos.forEach(medico => {
            if (medico.id <= 10 && medico.fotografia) {
                delete medico.fotografia;
            }
        });
        localStorage.setItem('medicos', JSON.stringify(medicos));
    }
    if (!localStorage.getItem('especialidades')) {
        localStorage.setItem('especialidades', JSON.stringify(especialidadesIniciales));
    }
    if (!localStorage.getItem('obrasSociales')) {
        localStorage.setItem('obrasSociales', JSON.stringify(obrasSocialesIniciales));
    }
}

function cargarFiltros() {
    const especialidades = JSON.parse(localStorage.getItem('especialidades')) || [];
    const obrasSociales = JSON.parse(localStorage.getItem('obrasSociales')) || [];

    const filtroEspecialidad = document.getElementById('filtroEspecialidad');
    const filtroObraSocial = document.getElementById('filtroObraSocial');

    filtroEspecialidad.innerHTML = '<option value="">Todas las especialidades</option>';
    especialidades.forEach(especialidad => {
        const option = document.createElement('option');
        option.value = especialidad.id;
        option.textContent = especialidad.nombre;
        filtroEspecialidad.appendChild(option);
    });

    filtroObraSocial.innerHTML = '<option value="">Todas las obras sociales</option>';
    obrasSociales.forEach(obra => {
        const option = document.createElement('option');
        option.value = obra.id;
        option.textContent = obra.nombre;
        filtroObraSocial.appendChild(option);
    });
}

function cargarProfesionales(filtroEspecialidad = '', filtroObraSocial = '') {
    const medicos = JSON.parse(localStorage.getItem('medicos')) || [];
    const especialidades = JSON.parse(localStorage.getItem('especialidades')) || [];
    const obrasSociales = JSON.parse(localStorage.getItem('obrasSociales')) || [];
    const contenedorProfesionales = document.getElementById('contenedorProfesionales');

    if (!contenedorProfesionales) {
        console.error("No se encontró el contenedor de profesionales.");
        return;
    }

    contenedorProfesionales.innerHTML = '';

    let medicosFiltrados = medicos;

    if (filtroEspecialidad) {
        medicosFiltrados = medicosFiltrados.filter(medico => medico.especialidad == filtroEspecialidad);
    }

    if (filtroObraSocial) {
        medicosFiltrados = medicosFiltrados.filter(medico => medico.obraSocial.includes(Number(filtroObraSocial)));
    }

    const imagenMap = {
        "Dr. Knee": 'public/im7.jpg', "Dra. Liguori": 'public/im1.jpg',
        "Dr. Pérez": 'public/im6.jpg', "Dra. Otero": 'public/im3.jpg',
        "Dr. Bolívar": 'public/im9.jpg', "Dra. Sánchez": 'public/im4.png',
        "Dra. Piatti": 'public/im8.png', "Dra. Porta": 'public/im10.jpg',
        "Dr. Camacho": 'public/im5.jpg', "Dra. Martínez": 'public/im2.png'
    };

    medicosFiltrados.forEach(medico => {
        const nombreCompleto = medico.nombre || `${medico.titulo || ''} ${medico.firstName || ''} ${medico.lastName || ''}`.trim();
        const nombreMedicoBase = medico.nombre ? nombreCompleto.split(',')[0].trim() : `${medico.titulo} ${medico.lastName}`;
        const imagenSrc = medico.fotografia || imagenMap[nombreMedicoBase] || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='; // Placeholder Base64 si no hay foto

        const especialidadNombre = especialidades.find(e => e.id == medico.especialidad)?.nombre || 'Desconocida';
        const obrasSocialesNombres = Array.isArray(medico.obraSocial) ? medico.obraSocial.map(id => obrasSociales.find(os => os.id === id)?.nombre || 'Desconocida').join(', ') : 'Desconocida';
        const descripcion = `Especialista en ${especialidadNombre.toLowerCase()}.`;

        const cardHTML = `
            <div class="col">
                <div class="card h-100 shadow-sm border-0 p-4 text-center">
                    <img src="${imagenSrc}" alt="Imagen del ${nombreCompleto}" class="border border-3 mb-3 mx-auto d-block" style="width: 150px; height: 150px; object-fit: cover; border-radius: 0;">
                    <h5 class="card-title" style="color: var(--color-secondary)">${nombreCompleto}</h5>
                    <p class="text-primary fw-bold mb-1">${especialidadNombre}</p>
                    <p class="text-muted mb-1">Matrícula: ${medico.matricula}</p>
                    <p class="text-body mb-1">${descripcion}</p>
                    <p class="small">Obras Sociales: ${obrasSocialesNombres}</p>
                </div>
            </div>
        `;
        contenedorProfesionales.insertAdjacentHTML('beforeend', cardHTML);
    });
}

function aplicarFiltros() {
    const filtroEspecialidad = document.getElementById('filtroEspecialidad').value;
    const filtroObraSocial = document.getElementById('filtroObraSocial').value;
    cargarProfesionales(filtroEspecialidad, filtroObraSocial);
}

inicializarLocalStorageSimple();
document.addEventListener('DOMContentLoaded', () => {
    cargarFiltros();
    cargarProfesionales();
    document.getElementById('filtroEspecialidad').addEventListener('change', aplicarFiltros);
    document.getElementById('filtroObraSocial').addEventListener('change', aplicarFiltros);
});
