// Función para manejar el login
async function handleLogin() {
    const formLogin = document.getElementById('formLogin');
    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(formLogin);
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(Object.fromEntries(formData.entries()))
            });
            if (response.ok) {
                window.location.href = '/registro.html';
            } else {
                const error = await response.text();
                alert(error);
            }
        });
    }
}

// Función para cargar despachos en el formulario de registro
async function cargarDespachos() {
    const selectDespacho = document.getElementById('despacho');
    if (selectDespacho) {
        const response = await fetch('/api/despachos');
        const despachos = await response.json();
        selectDespacho.innerHTML = '<option value="">Seleccionar despacho</option>';
        despachos.forEach(despacho => {
            const option = document.createElement('option');
            option.value = despacho.id_despacho;
            option.textContent = despacho.nombre_despacho;
            selectDespacho.appendChild(option);
        });
    }
}

// Función para manejar el registro de visitas
async function handleRegistroVisita() {
    const formRegistro = document.getElementById('formRegistro');
    if (formRegistro) {
        formRegistro.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(formRegistro);
            const visita = Object.fromEntries(formData.entries());

            const response = await fetch('/api/registro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(visita)
            });

            if (response.ok) {
                window.location.href = '/consultas.html';
            } else {
                const error = await response.text();
                alert(error);
            }
        });
    }
}

// Función para cargar visitas en la tabla de consultas
async function cargarVisitas(filtros = {}) {
    const params = new URLSearchParams();
    if (filtros.fecha) params.append('fecha', filtros.fecha);
    if (filtros.visitante) params.append('visitante', filtros.visitante);
    if (filtros.despacho) params.append('despacho', filtros.despacho);

    const response = await fetch(`/api/visitas?${params.toString()}`);
    const visitas = await response.json();
    const tableBody = document.getElementById('tablaResultados');

    if (tableBody) {
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
}

// Función para registrar salida de una visita
async function registrarSalida(id) {
    const response = await fetch(`/api/salida/${id}`, { method: 'POST' });
    if (response.ok) {
        cargarVisitas();
    } else {
        const error = await response.text();
        alert(error);
    }
}

// Función para manejar la búsqueda en consultas
function handleBuscar() {
    const btnBuscar = document.getElementById('btnBuscar');
    if (btnBuscar) {
        btnBuscar.addEventListener('click', () => {
            const filtros = {
                fecha: document.getElementById('filtroFecha').value,
                visitante: document.getElementById('filtroVisitante').value,
                despacho: document.getElementById('filtroDespacho').value
            };
            cargarVisitas(filtros);
        });
    }
}

// Función para cargar reportes
async function cargarReportes() {
    // Visitas por día
    const btnReporteDia = document.getElementById('btnReporteDia');
    if (btnReporteDia) {
        btnReporteDia.addEventListener('click', async () => {
            const fecha = document.getElementById('fechaReporte').value;
            const response = await fetch(`/api/visitas-por-dia?fecha=${fecha}`);
            const visitas = await response.json();
            const reporteDia = document.getElementById('reporteDia');
            reporteDia.innerHTML = `
                <h4>Visitas del ${fecha}</h4>
                <table>
                    <thead>
                        <tr>
                            <th>Visitante</th>
                            <th>DNI</th>
                            <th>Despacho</th>
                            <th>Hora Entrada</th>
                            <th>Hora Salida</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${visitas.map(visita => `
                            <tr>
                                <td>${visita.visitante}</td>
                                <td>${visita.dni}</td>
                                <td>${visita.nombre_despacho}</td>
                                <td>${visita.hora_entrada}</td>
                                <td>${visita.hora_salida || 'No registrada'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        });
    }

    // Visitas por despacho
    const btnReporteDespacho = document.getElementById('btnReporteDespacho');
    if (btnReporteDespacho) {
        btnReporteDespacho.addEventListener('click', async () => {
            const despacho = document.getElementById('despachoReporte').value;
            const response = await fetch(`/api/visitas-por-despacho?despacho=${despacho}`);
            const visitas = await response.json();
            const reporteDespacho = document.getElementById('reporteDespacho');
            reporteDespacho.innerHTML = `
                <h4>Visitas al despacho: ${despacho}</h4>
                <table>
                    <thead>
                        <tr>
                            <th>Visitante</th>
                            <th>DNI</th>
                            <th>Fecha</th>
                            <th>Hora Entrada</th>
                            <th>Hora Salida</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${visitas.map(visita => `
                            <tr>
                                <td>${visita.visitante}</td>
                                <td>${visita.dni}</td>
                                <td>${visita.fecha}</td>
                                <td>${visita.hora_entrada}</td>
                                <td>${visita.hora_salida || 'No registrada'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        });
    }

    // Tiempo promedio de permanencia
    const responseTiempo = await fetch('/api/tiempo-promedio');
    const tiempoPromedio = await responseTiempo.json();
    const tiempoPromedioElement = document.getElementById('tiempoPromedio');
    if (tiempoPromedioElement) {
        tiempoPromedioElement.innerHTML = `
            <h4>Tiempo promedio de permanencia</h4>
            <p>${tiempoPromedio.promedio_horas ? tiempoPromedio.promedio_horas.toFixed(2) : 0} horas</p>
        `;
    }
}

// Inicializar funciones según la página actual
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    // Login
    if (path.includes('login.html')) {
        handleLogin();
    }
    // Registro de visitas
    else if (path.includes('registro.html')) {
        cargarDespachos();
        handleRegistroVisita();
    }
    // Consultas
    else if (path.includes('consultas.html')) {
        cargarVisitas();
        handleBuscar();
    }
    // Reportes
    else if (path.includes('reportes.html')) {
        cargarReportes();
    }
});