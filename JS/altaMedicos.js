import {staffInicial} from '../config/medicosiniciales.js';

const formAltaMedicos = document.getElementById('altaMedicosForm');
const inputNombre = document.getElementById('nombre');
const inputMatricula = document.getElementById('matricula'); 
const inputEspecialidad = document.getElementById('especialidad');
const inputObraSocial = document.getElementById('obraSocial');
const inputTelefono = document.getElementById('telefono'); 
const inputEmail = document.getElementById('email'); 
const listadoMedicosBody = document.querySelector('#listadoMedicos tbody')
const submitButton = formAltaMedicos.querySelector('button[type="submit"]'); 

function inicializarLocalStorage(){
if (!localStorage.getItem('medicos')) {
    localStorage.setItem('medicos', JSON.stringify(staffInicial));
}
}
inicializarLocalStorage();
let flagIndex = null;
function actualizarTabla(){
    let medicos = JSON.parse(localStorage.getItem('medicos')) || [];
    listadoMedicosBody.innerHTML = '';

    medicos.forEach((medico, index) => {
        let fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${medico.nombre}</td>
            <td>${medico.matricula}</td>
            <td>${medico.especialidad}</td>
            <td>${medico.obraSocial}</td>
            <td>${medico.telefono}</td>
            <td>${medico.email}</td>
            <td>
                <div class="btn-group" role="group" aria-label="Acciones">
                    <button class="btn btn-sm btn-editar" data-index="${index}">Editar</button>
                    <button class="btn btn-sm btn-eliminar" data-index="${index}">Eliminar</button>
                    <button class="btn btn-sm btn-visualizar" data-index="${index}">Ver</button>
                </div>
            </td>
        `;
        listadoMedicosBody.appendChild(fila);
    });
}  

listadoMedicosBody.addEventListener('click', function(event){
    if(event.target.classList.contains('btn-visualizar')){
        const index = Number(event.target.dataset.index);
        visualizarMedicos(index); 
    }
    if(event.target.classList.contains('btn-editar')){
        const index = Number(event.target.dataset.index);
        editarMedicos(index);
    }
    if(event.target.classList.contains('btn-eliminar')){
        const index = Number(event.target.dataset.index);
        eliminarMedicos(index);
    }
})

function editarMedicos(index){
    let medicos = JSON.parse(localStorage.getItem('medicos')) || [];
    let medico = medicos[index];
    inputNombre.value = medico.nombre;
    inputMatricula.value = medico.matricula;
    inputEspecialidad.value = medico.especialidad;
    inputObraSocial.value = medico.obraSocial;
    inputTelefono.value = medico.telefono;
    inputEmail.value = medico.email;
    flagIndex = index;
    submitButton.textContent = 'Guardar Cambios';
}
function eliminarMedicos(index){
    let medicos = JSON.parse(localStorage.getItem('medicos')) || [];
    if(confirm(`Se eliminará a ${medicos[index].nombre} , está seguro?`)){
        medicos.splice(index,1);
        localStorage.setItem('medicos', JSON.stringify(medicos));
        actualizarTabla();
        formAltaMedicos.reset();
        flagIndex = null;
        submitButton.textContent = 'Dar de Alta';
        alert(`Médico eliminado correctamente.`);
    }
}

function visualizarMedicos(index){
    let medicos = JSON.parse(localStorage.getItem('medicos')) || [];
    let medico = medicos[index];

    const infomedico = 
    `Detalles del Médico:\n\n` +
    `Nombre: ${medico.nombre}\n` +
    `Matrícula: ${medico.matricula}\n` +
    `Especialidad: ${medico.especialidad}\n` +
    `Obra Social: ${medico.obraSocial}\n` +
    `Teléfono: ${medico.telefono}\n` +
    `Email: ${medico.email}\n` +
    `\n`;

    alert(infomedico);
}

function altaMedicos(event){
    event.preventDefault();
    
    let nombre = inputNombre.value.trim();
    let matricula = inputMatricula.value.trim();
    let especialidad = inputEspecialidad.value.trim();
    let obraSocial = inputObraSocial.value.trim();
    let telefono = inputTelefono.value.trim();
    let email= inputEmail.value.trim();

    if(!nombre ||!matricula ||!especialidad || !obraSocial || !telefono || !email){
        alert('Por favor, complete los campos requeridos para poder continuar');
        return;
    }
    let medicos = JSON.parse(localStorage.getItem('medicos')) || [];
    const medico = { nombre, matricula, especialidad, obraSocial, telefono, email };

    if(flagIndex !== null){
        medicos[flagIndex] = medico;
        alert(`Médico actualizado:\n\nNombre: ${nombre}`); 
        flagIndex = null;
        submitButton.textContent = 'Dar de Alta'; 
    } 
    else{
        medicos.push(medico);
        alert(
         `Médico registrado:\n\n` +
        `Nombre: ${nombre}\n` +
        `Matricula: ${matricula}\n` +
        `Especialidad: ${especialidad}\n` +
        `Obra Social: ${obraSocial}\n` +
        `Teléfono: ${telefono}\n` +
        `Email: ${email}\n`
        );
    }
    localStorage.setItem('medicos', JSON.stringify(medicos));
    actualizarTabla();
    formAltaMedicos.reset();

}

actualizarTabla();
formAltaMedicos.addEventListener('submit', altaMedicos);
