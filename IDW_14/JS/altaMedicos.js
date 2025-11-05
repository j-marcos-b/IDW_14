import {staffInicial} from '../config/medicosiniciales.js';
import {especialidadesIniciales} from '../config/especialidades.js';
import {obrasSocialesIniciales} from '../config/obrasSociales.js';

const listadoMedicosBody = document.querySelector('#listadoMedicos tbody');
const medicoModalElement = document.getElementById('medicoModal');
const medicoModal = new bootstrap.Modal(medicoModalElement);
const formAltaMedicos = document.getElementById('altaMedicosForm');
const inputNombre = document.getElementById('nombre');
const inputMatricula = document.getElementById('matricula');
const inputEspecialidad = document.getElementById('especialidad');
const obraSocialCheckboxes = document.getElementById('obraSocialCheckboxes');
const inputDescripcion = document.getElementById('descripcion');
const inputFotografia = document.getElementById('fotografia');
const inputValorConsulta = document.getElementById('valorConsulta');
const inputTelefono = document.getElementById('telefono');
const inputEmail = document.getElementById('email');
const btnCrearMedico = document.getElementById('btnCrearMedico');
const btnGuardarMedico = document.getElementById('btnGuardarMedico');
const medicoId = document.getElementById('medicoId');

medicoModalElement.addEventListener('show.bs.modal', function () {
    medicoModalElement.removeAttribute('aria-hidden');
});
medicoModalElement.addEventListener('hide.bs.modal', function () {
    medicoModalElement.setAttribute('aria-hidden', 'true');
});

let editando = false;

function inicializarLocalStorage(){
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

function cargarEspecialidades(){
    let especialidades = JSON.parse(localStorage.getItem('especialidades')) || especialidadesIniciales;
    inputEspecialidad.innerHTML = '<option value="">Seleccione especialidad</option>';
    especialidades.forEach(especialidad => {
        let option = document.createElement('option');
        option.value = especialidad.id;
        option.textContent = especialidad.nombre;
        inputEspecialidad.appendChild(option);
    });
}

function cargarObrasSociales(){
    let obrasSociales = JSON.parse(localStorage.getItem('obrasSociales')) || obrasSocialesIniciales;
    obraSocialCheckboxes.innerHTML = '';
    obrasSociales.forEach(obraSocial => {
        let div = document.createElement('div');
        div.className = 'form-check';
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'form-check-input';
        checkbox.id = `obraSocial-${obraSocial.id}`;
        checkbox.value = obraSocial.id;
        let label = document.createElement('label');
        label.className = 'form-check-label';
        label.htmlFor = `obraSocial-${obraSocial.id}`;
        label.textContent = obraSocial.nombre;
        div.appendChild(checkbox);
        div.appendChild(label);
        obraSocialCheckboxes.appendChild(div);
    });
}

function actualizarTabla(){
    let medicos = JSON.parse(localStorage.getItem('medicos')) || [];
    let especialidades = JSON.parse(localStorage.getItem('especialidades')) || especialidadesIniciales;
    let obrasSociales = JSON.parse(localStorage.getItem('obrasSociales')) || obrasSocialesIniciales;
    listadoMedicosBody.innerHTML = '';

    medicos.forEach((medico, index) => {
        let especialidadNombre = especialidades.find(e => e.id === medico.especialidad)?.nombre || 'Desconocida';
        let obrasSocialesNombres = Array.isArray(medico.obraSocial) ? medico.obraSocial.map(id => obrasSociales.find(os => os.id === id)?.nombre || 'Desconocida').join(', ') : 'Desconocida';
        let fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${medico.nombre}</td>
            <td>${medico.matricula}</td>
            <td>${especialidadNombre}</td>
            <td>${obrasSocialesNombres}</td>
            <td>${medico.telefono}</td>
            <td>${medico.email}</td>
            <td>
                <button class="btn btn-sm btn-warning me-2" onclick="editarMedico(${index})">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="eliminarMedico(${index})">Eliminar</button>
            </td>
        `;
        listadoMedicosBody.appendChild(fila);
    });
}

function actualizarFilaEnTabla(index, medicoActualizado) {
    const filas = listadoMedicosBody.querySelectorAll('tr');
    if (filas[index]) {
        let especialidades = JSON.parse(localStorage.getItem('especialidades')) || especialidadesIniciales;
        let obrasSociales = JSON.parse(localStorage.getItem('obrasSociales')) || obrasSocialesIniciales;
        let especialidadNombre = especialidades.find(e => e.id === medicoActualizado.especialidad)?.nombre || 'Desconocida';
        let obrasSocialesNombres = Array.isArray(medicoActualizado.obraSocial) ? medicoActualizado.obraSocial.map(id => obrasSociales.find(os => os.id === id)?.nombre || 'Desconocida').join(', ') : 'Desconocida';
        filas[index].cells[0].textContent = medicoActualizado.nombre;
        filas[index].cells[1].textContent = medicoActualizado.matricula;
        filas[index].cells[2].textContent = especialidadNombre;
        filas[index].cells[3].textContent = obrasSocialesNombres;
        filas[index].cells[4].textContent = medicoActualizado.telefono;
        filas[index].cells[5].textContent = medicoActualizado.email;
    }
}

function agregarFilaATabla(nuevoMedico) {
    let especialidades = JSON.parse(localStorage.getItem('especialidades')) || especialidadesIniciales;
    let obrasSociales = JSON.parse(localStorage.getItem('obrasSociales')) || obrasSocialesIniciales;
    let especialidadNombre = especialidades.find(e => e.id === nuevoMedico.especialidad)?.nombre || 'Desconocida';
    let obrasSocialesNombres = Array.isArray(nuevoMedico.obraSocial) ? nuevoMedico.obraSocial.map(id => obrasSociales.find(os => os.id === id)?.nombre || 'Desconocida').join(', ') : 'Desconocida';
    const fila = document.createElement('tr');
    fila.innerHTML = `
        <td>${nuevoMedico.nombre}</td>
        <td>${nuevoMedico.matricula}</td>
        <td>${especialidadNombre}</td>
        <td>${obrasSocialesNombres}</td>
        <td>${nuevoMedico.telefono}</td>
        <td>${nuevoMedico.email}</td>
        <td>
            <button class="btn btn-sm btn-warning me-2" onclick="editarMedico(${JSON.parse(localStorage.getItem('medicos')).length - 1})">Editar</button>
            <button class="btn btn-sm btn-danger" onclick="eliminarMedico(${JSON.parse(localStorage.getItem('medicos')).length - 1})">Eliminar</button>
        </td>
    `;
    listadoMedicosBody.appendChild(fila);
}

function eliminarFilaDeTabla(index) {
    const filas = listadoMedicosBody.querySelectorAll('tr');
    if (filas[index]) {
        filas[index].remove();
    }
}

function crearMedico() {
    let nombre = inputNombre.value.trim();
    let matricula = inputMatricula.value.trim();
    let especialidad = Number(inputEspecialidad.value);
    let descripcion = inputDescripcion.value.trim();
    let fotografia = inputFotografia.files[0];
    let valorConsulta = Number(inputValorConsulta.value);
    let telefono = inputTelefono.value.trim();
    let email = inputEmail.value.trim();

    // Obtener obras sociales seleccionadas
    let checkboxes = obraSocialCheckboxes.querySelectorAll('input[type="checkbox"]:checked');
    let obraSocial = Array.from(checkboxes).map(cb => Number(cb.value));

    if (!nombre || !matricula || !especialidad || obraSocial.length === 0 || !descripcion || !fotografia || !valorConsulta || !telefono || !email) {
        alert('Por favor, complete todos los campos requeridos');
        return;
    }

    // Convertir imagen a base64
    let reader = new FileReader();
    reader.onload = function(e) {
        let fotografiaBase64 = e.target.result;
        let medicos = JSON.parse(localStorage.getItem('medicos')) || [];
        const nuevoMedico = { id: Date.now(), nombre, matricula, especialidad, descripcion, obraSocial, fotografia: fotografiaBase64, valorConsulta, telefono, email };
        medicos.push(nuevoMedico);
        localStorage.setItem('medicos', JSON.stringify(medicos));
        agregarFilaATabla(nuevoMedico);
        alert('Médico creado exitosamente');
        medicoModal.hide();
    };
    reader.readAsDataURL(fotografia);
}

function editarMedico(index) {
    let medicos = JSON.parse(localStorage.getItem('medicos')) || [];
    let medico = medicos[index];

    medicoId.value = index;
    inputNombre.value = medico.nombre;
    inputMatricula.value = medico.matricula;
    inputEspecialidad.value = medico.especialidad;
    // Marcar checkboxes de obras sociales
    let checkboxes = obraSocialCheckboxes.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = medico.obraSocial.includes(Number(checkbox.value));
    });
    inputDescripcion.value = medico.descripcion;
    inputValorConsulta.value = medico.valorConsulta;
    inputTelefono.value = medico.telefono;
    inputEmail.value = medico.email;

    document.getElementById('medicoModalLabel').textContent = 'Editar Médico';
    editando = true;
    medicoModal.show();
}

function actualizarMedico() {
    const index = parseInt(medicoId.value);
    let nombre = inputNombre.value.trim();
    let matricula = inputMatricula.value.trim();
    let especialidad = Number(inputEspecialidad.value);
    let descripcion = inputDescripcion.value.trim();
    let fotografia = inputFotografia.files[0];
    let valorConsulta = Number(inputValorConsulta.value);
    let telefono = inputTelefono.value.trim();
    let email = inputEmail.value.trim();

    // Obtener obras sociales seleccionadas
    let checkboxes = obraSocialCheckboxes.querySelectorAll('input[type="checkbox"]:checked');
    let obraSocial = Array.from(checkboxes).map(cb => Number(cb.value));

    if (!nombre || !matricula || !especialidad || obraSocial.length === 0 || !descripcion || !valorConsulta || !telefono || !email) {
        alert('Por favor, complete todos los campos requeridos');
        return;
    }

    let medicos = JSON.parse(localStorage.getItem('medicos')) || [];
    const medicoActualizado = { id: medicos[index].id, nombre, matricula, especialidad, descripcion, obraSocial, fotografia: medicos[index].fotografia, valorConsulta, telefono, email };

    if (fotografia) {
        let reader = new FileReader();
        reader.onload = function(e) {
            medicoActualizado.fotografia = e.target.result;
            medicos[index] = medicoActualizado;
            localStorage.setItem('medicos', JSON.stringify(medicos));
            actualizarFilaEnTabla(index, medicoActualizado);
            alert('Médico actualizado exitosamente');
            medicoModal.hide();
        };
        reader.readAsDataURL(fotografia);
    } else {
        medicos[index] = medicoActualizado;
        localStorage.setItem('medicos', JSON.stringify(medicos));
        actualizarFilaEnTabla(index, medicoActualizado);
        alert('Médico actualizado exitosamente');
        medicoModal.hide();
    }
}

function eliminarMedico(index) {
    if (!confirm('¿Está seguro de eliminar este médico?')) return;

    let medicos = JSON.parse(localStorage.getItem('medicos')) || [];
    medicos.splice(index, 1);
    localStorage.setItem('medicos', JSON.stringify(medicos));
    eliminarFilaDeTabla(index);
    alert('Médico eliminado exitosamente');
}

btnCrearMedico.addEventListener('click', () => {
    formAltaMedicos.reset();
    medicoId.value = '';
    cargarEspecialidades();
    cargarObrasSociales();
    document.getElementById('medicoModalLabel').textContent = 'Crear Médico';
    editando = false;
});

btnGuardarMedico.addEventListener('click', async () => {
    if (!formAltaMedicos.checkValidity()) {
        formAltaMedicos.reportValidity();
        return;
    }

    if (editando) {
        await actualizarMedico();
    } else {
        await crearMedico();
    }
});

inicializarLocalStorage();
cargarEspecialidades();
cargarObrasSociales();
actualizarTabla();

window.editarMedico = editarMedico;
window.eliminarMedico = eliminarMedico;
