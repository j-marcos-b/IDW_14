import {staffInicial} from '../config/medicosiniciales.js';
import {especialidadesIniciales} from '../config/especialidades.js';
import {obrasSocialesIniciales} from '../config/obrasSociales.js';

function inicializarLocalStorageSimple(){
    if (!localStorage.getItem('medicos')) {
        localStorage.setItem('medicos', JSON.stringify(staffInicial));
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

    const imagenMap = {
        "Dr. Knee": 'public/im7.jpg', "Dra. Liguori": 'public/im1.jpg',
        "Dr. Pérez": 'public/im6.jpg', "Dra. Otero": 'public/im3.jpg',
        "Dr. Bolívar": 'public/im9.jpg', "Dra. Sánchez": 'public/im4.jpg',
        "Dra. Piatti": 'public/im8.jpg', "Dra. Porta": 'public/im10.jpg',
        "Dr. Camacho": 'public/im5.jpg', "Dra. Martínez": 'public/im2.jpg'
    };

    let medicosFiltrados = medicos;

    if (filtroEspecialidad) {
        medicosFiltrados = medicosFiltrados.filter(medico => medico.especialidad == filtroEspecialidad);
    }

    if (filtroObraSocial) {
        medicosFiltrados = medicosFiltrados.filter(medico => medico.obraSocial.includes(Number(filtroObraSocial)));
    }

    medicosFiltrados.forEach(medico => {
        const nombreMedicoBase = medico.nombre.split(',')[0].trim();
        const imagenSrc = imagenMap[nombreMedicoBase] || 'public/im5.jpg';

        const especialidadNombre = especialidades.find(e => e.id == medico.especialidad)?.nombre || 'Desconocida';
        const obrasSocialesNombres = Array.isArray(medico.obraSocial) ? medico.obraSocial.map(id => obrasSociales.find(os => os.id === id)?.nombre || 'Desconocida').join(', ') : 'Desconocida';
        const descripcion = `Especialista en ${especialidadNombre.toLowerCase()}.`;

        const cardHTML = `
            <div class="col">
                <div class="card h-100 shadow-sm border-0 p-4 text-center">
                    <img src="${imagenSrc}" alt="Imagen del ${medico.nombre}" class="card-img rounded-circle border border-3 mb-3 mx-auto d-block">
                    <h5 class="card-title" style="color: var(--color-secondary)">${medico.nombre}</h5>
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
