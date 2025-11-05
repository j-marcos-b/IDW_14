document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formContacto');
  if (!form) return;

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

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
      id: Date.now(),
      nombre: document.getElementById('nombre').value.trim(),
      email: document.getElementById('email').value.trim(),
      asunto: document.getElementById('asunto').value.trim(),
      mensaje: document.getElementById('mensaje').value.trim(),
      fecha: new Date().toISOString()
    };

    if (!data.nombre || !data.email || !data.asunto || !data.mensaje) {
      alert('Complete todos los campos.');
      return;
    }

    const items = cargarContactos();
    items.push(data);
    guardarContactos(items);
    alert('Mensaje guardado localmente.');
    form.reset();
  });
});
