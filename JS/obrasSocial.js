import {obrasSocialesIniciales} from '../config/obrasSociales.js';

const listadoObrasSocialesBody = document.querySelector('#listadoObrasSociales tbody');
const obraSocialModalElement = document.getElementById('obraSocialModal');
const obraSocialModal = new bootstrap.Modal(obraSocialModalElement);
const formAltaObrasSociales = document.getElementById('altaObrasSocialesForm');
const inputNombreObraSocial = document.getElementById('nombreObraSocial');
const inputDescripcionObraSocial = document.getElementById('descripcionObraSocial');
const btnCrearObraSocial = document.getElementById('btnCrearObraSocial');
const btnGuardarObraSocial = document.getElementById('btnGuardarObraSocial');
const obraSocialId = document.getElementById('obraSocialId');

obraSocialModalElement.addEventListener('show.bs.modal', function () {
    obraSocialModalElement.removeAttribute('aria-hidden');
});
obraSocialModalElement.addEventListener('hide.bs.modal', function () {
    obraSocialModalElement.setAttribute('aria-hidden', 'true');
});

let editando = false;

function inicializarLocalStorageObrasSociales(){
    if (!localStorage.getItem('obrasSociales')) {
        localStorage.setItem('obrasSociales', JSON.stringify(obrasSocialesIniciales));
    }
}

function actualizarTablaObrasSociales(){
    let obrasSociales = JSON.parse(localStorage.getItem('obrasSociales')) || [];
    listadoObrasSocialesBody.innerHTML = '';

    obrasSociales.forEach((obraSocial, index) => {
        let fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${obraSocial.id}</td>
            <td>${obraSocial.nombre}</td>
            <td>${obraSocial.descripcion}</td>
            <td>
                <button class="btn btn-sm btn-warning me-2" onclick="editarObraSocial(${index})">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="eliminarObraSocial(${index})">Eliminar</button>
            </td>
        `;
        listadoObrasSocialesBody.appendChild(fila);
    });
}

function actualizarFilaEnTabla(index, obraSocialActualizada) {
    const filas = listadoObrasSocialesBody.querySelectorAll('tr');
    if (filas[index]) {
        filas[index].cells[1].textContent = obraSocialActualizada.nombre;
        filas[index].cells[2].textContent = obraSocialActualizada.descripcion;
    }
}

function agregarFilaATabla(nuevaObraSocial) {
    const fila = document.createElement('tr');
    fila.innerHTML = `
        <td>${nuevaObraSocial.id}</td>
        <td>${nuevaObraSocial.nombre}</td>
        <td>${nuevaObraSocial.descripcion}</td>
        <td>
            <button class="btn btn-sm btn-warning me-2" onclick="editarObraSocial(${JSON.parse(localStorage.getItem('obrasSociales')).length - 1})">Editar</button>
            <button class="btn btn-sm btn-danger" onclick="eliminarObraSocial(${JSON.parse(localStorage.getItem('obrasSociales')).length - 1})">Eliminar</button>
        </td>
    `;
    listadoObrasSocialesBody.appendChild(fila);
}

function eliminarFilaDeTabla(index) {
    const filas = listadoObrasSocialesBody.querySelectorAll('tr');
    if (filas[index]) {
        filas[index].remove();
    }
}

function crearObraSocial() {
    const nuevaObraSocial = {
        id: Date.now(),
        nombre: inputNombreObraSocial.value.trim(),
        descripcion: inputDescripcionObraSocial.value.trim()
    };

    if (!nuevaObraSocial.nombre || !nuevaObraSocial.descripcion) {
        alert('Por favor, complete nombre y descripción');
        return;
    }

    let obrasSociales = JSON.parse(localStorage.getItem('obrasSociales')) || [];
    obrasSociales.push(nuevaObraSocial);
    localStorage.setItem('obrasSociales', JSON.stringify(obrasSociales));
    agregarFilaATabla(nuevaObraSocial);
    alert('Obra social creada exitosamente');
    obraSocialModal.hide();
}

function editarObraSocial(index) {
    let obrasSociales = JSON.parse(localStorage.getItem('obrasSociales')) || [];
    let obraSocial = obrasSociales[index];

    obraSocialId.value = index;
    inputNombreObraSocial.value = obraSocial.nombre;
    inputDescripcionObraSocial.value = obraSocial.descripcion;

    document.getElementById('obraSocialModalLabel').textContent = 'Editar Obra Social';
    editando = true;
    obraSocialModal.show();
}

function actualizarObraSocial() {
    const index = parseInt(obraSocialId.value);
    const obraSocialActualizada = {
        id: JSON.parse(localStorage.getItem('obrasSociales'))[index].id,
        nombre: inputNombreObraSocial.value.trim(),
        descripcion: inputDescripcionObraSocial.value.trim()
    };

    if (!obraSocialActualizada.nombre || !obraSocialActualizada.descripcion) {
        alert('Por favor, complete nombre y descripción');
        return;
    }

    let obrasSociales = JSON.parse(localStorage.getItem('obrasSociales')) || [];
    obrasSociales[index] = obraSocialActualizada;
    localStorage.setItem('obrasSociales', JSON.stringify(obrasSociales));
    actualizarFilaEnTabla(index, obraSocialActualizada);
    alert('Obra social actualizada exitosamente');
    obraSocialModal.hide();
}

function eliminarObraSocial(index) {
    if (!confirm('¿Está seguro de eliminar esta obra social?')) return;

    let obrasSociales = JSON.parse(localStorage.getItem('obrasSociales')) || [];
    obrasSociales.splice(index, 1);
    localStorage.setItem('obrasSociales', JSON.stringify(obrasSociales));
    eliminarFilaDeTabla(index);
    alert('Obra social eliminada exitosamente');
}

btnCrearObraSocial.addEventListener('click', () => {
    formAltaObrasSociales.reset();
    obraSocialId.value = '';
    document.getElementById('obraSocialModalLabel').textContent = 'Crear Obra Social';
    editando = false;
});

btnGuardarObraSocial.addEventListener('click', async () => {
    if (!formAltaObrasSociales.checkValidity()) {
        formAltaObrasSociales.reportValidity();
        return;
    }

    if (editando) {
        await actualizarObraSocial();
    } else {
        await crearObraSocial();
    }
});

inicializarLocalStorageObrasSociales();
actualizarTablaObrasSociales();

window.editarObraSocial = editarObraSocial;
window.eliminarObraSocial = eliminarObraSocial;