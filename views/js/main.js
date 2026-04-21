// Función para cargar visitas en la tabla de consultas
async function cargarVisitas() {
    const response = await fetch('/api/visitas');
    const visitas = await response.json();

    const tableBody = document.querySelector('#visitasTable tbody');
    tableBody.innerHTML = '';

    visitas.forEach(visita => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${visita.visitante}</td>
            <td>${visita.dni}</td>
            <td>${visita.nombre_despacho}</td>
            <td>${visita.persona_visitada}</td>
            <td>${visita.fecha}</td>
            <td>${visita.hora_entrada}</td>
            <td>${visita.hora_salida || 'No registrada'}</td>
            <td>${visita.tiempo_permanencia || 'No calculado'}</td>
            <td>
                ${!visita.hora_salida ?
                    `<button onclick="registrarSalida(${visita.id_visita})">Registrar Salida</button>` :
                    'Salida registrada'}
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Función para registrar salida
async function registrarSalida(id) {
    const response = await fetch(`/api/salida/${id}`, { method: 'POST' });
    if (response.ok) {
        cargarVisitas(); // Recargar la tabla
    }
}

// Cargar visitas al iniciar la página de consultas
if (window.location.pathname.includes('consultas')) {
    document.addEventListener('DOMContentLoaded', cargarVisitas);
}