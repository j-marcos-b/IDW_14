function cargarContactos() {
  try {
    return JSON.parse(localStorage.getItem('contactos')) || [];
  } catch (_) {
    return [];
  }
}

function guardarContactos(items) {
  localStorage.setItem('contactos', JSON.stringify(items));
}

function renderTabla() {
  const tbody = document.getElementById('contactosTableBody');
  tbody.innerHTML = '';
  const items = cargarContactos();

  items.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.nombre}</td>
      <td>${item.email}</td>
      <td>${item.asunto}</td>
      <td>${item.mensaje}</td>
      <td>${new Date(item.fecha).toLocaleString()}</td>
      <td>
        <button class="btn btn-sm btn-danger" data-id="${item.id}">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function exportarCSV() {
  const items = cargarContactos();
  if (!items.length) {
    alert('No hay datos para exportar.');
    return;
  }
  const encabezados = ['Nombre','Email','Asunto','Mensaje','Fecha'];
  const filas = items.map(it => [
    '"' + (it.nombre || '').replace(/"/g,'""') + '"',
    '"' + (it.email || '').replace(/"/g,'""') + '"',
    '"' + (it.asunto || '').replace(/"/g,'""') + '"',
    '"' + (it.mensaje || '').replace(/"/g,'""') + '"',
    '"' + new Date(it.fecha).toISOString() + '"'
  ].join(','));
  const contenido = [encabezados.join(','), ...filas].join('\n');
  const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'contactos.csv';
  a.click();
  URL.revokeObjectURL(url);
}

function manejarAccionesTabla(e) {
  const btn = e.target.closest('button[data-id]');
  if (!btn) return;
  const id = Number(btn.getAttribute('data-id'));
  if (!confirm('¿Eliminar este mensaje?')) return;
  const items = cargarContactos();
  const idx = items.findIndex(i => i.id === id);
  if (idx !== -1) {
    items.splice(idx, 1);
    guardarContactos(items);
    renderTabla();
  }
}

function limpiarTodo() {
  if (!confirm('¿Eliminar todos los mensajes?')) return;
  localStorage.removeItem('contactos');
  renderTabla();
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnExportarCSV').addEventListener('click', exportarCSV);
  document.getElementById('btnLimpiarTodo').addEventListener('click', limpiarTodo);
  document.getElementById('contactosTableBody').addEventListener('click', manejarAccionesTabla);
  renderTabla();
});
