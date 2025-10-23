import {staffInicial} from '../config/medicosiniciales.js';

function inicializarLocalStorageSimple(){

    if (!localStorage.getItem('medicos')) {
        localStorage.setItem('medicos', JSON.stringify(staffInicial));
    }
}

 
    function cargarProfesionales() {
     const medicos = JSON.parse(localStorage.getItem('medicos')) || [];
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
    

    medicos.forEach(medico => {
        const nombreMedicoBase = medico.nombre.split(',')[0].trim();
        const imagenSrc = imagenMap[nombreMedicoBase] || 'public/im5.jpg'; 
        const descripcion = `Especialista en ${medico.especialidad.toLowerCase()}.`;
        
        const cardHTML = `
            <div class="col">
                <div class="card h-100 shadow-sm border-0 p-4 text-center">
                    <img src="${imagenSrc}" alt="Imagen del ${medico.nombre}" class="card-img rounded-circle border border-3 mb-3 mx-auto d-block">
                    <h5 class="card-title" style="color: var(--color-secondary)">${medico.nombre}</h5>
                    <p class="text-primary fw-bold mb-1">${medico.especialidad}</p>
                    <p class="text-muted mb-1">Matrícula: ${medico.matricula}</p>
                    <p class="text-body mb-1">${descripcion}</p>
                    <p class="small">Obras Sociales: ${medico.obraSocial}</p>
                </div>
            </div>
        
        `;
        contenedorProfesionales.insertAdjacentHTML('beforeend', cardHTML);
    });
}


inicializarLocalStorageSimple();
document.addEventListener('DOMContentLoaded', cargarProfesionales);