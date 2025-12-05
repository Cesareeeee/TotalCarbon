// Dashboard functionality - Total Carbon
let cotizacionesChart = null;
let trabajosChart = null;
let reparacionesChart = null;
let usuariosRolChart = null;
let cotizacionesMensualesChart = null;
let ingresosGastosMensualesChart = null;

// Filtros actuales
let filtrosActuales = {
    periodo: 'hoy',
    fechaInicio: null,
    fechaFin: null,
    estado: 'todos'
};

async function cargarDashboard() {
    await Promise.all([
        cargarEstadisticas(),
        cargarGraficos(),
        cargarTablas(),
        cargarResumenIngresosGastos(),
        cargarTablaIngresosGastos()
    ]);
}

async function cargarEstadisticas() {
    try {
        const [statsResponse, messagesResponse] = await Promise.all([
            fetch('../../controlador/Administrador/dashboard_controller.php?action=estadisticas'),
            fetch('../../controlador/Administrador/dashboard_controller.php?action=mensajes_sin_leer')
        ]);

        if (!statsResponse.ok) {
            throw new Error('Error en la respuesta del servidor');
        }

        const [data, messagesData] = await Promise.all([
            statsResponse.json(),
            messagesResponse.json()
        ]);

        console.log('Datos del dashboard:', data);
        const totalClientesEl = document.getElementById('totalClientes');
        if (totalClientesEl) totalClientesEl.textContent = data.total_clientes || 0;
        const totalCotizacionesEl = document.getElementById('totalCotizaciones');
        if (totalCotizacionesEl) totalCotizacionesEl.textContent = data.total_cotizaciones || 0;
        const cotizacionesPendientesEl = document.getElementById('cotizacionesPendientes');
        if (cotizacionesPendientesEl) cotizacionesPendientesEl.textContent = data.cotizaciones_pendientes || 0;
        const cotizacionesCompletadasEl = document.getElementById('cotizacionesCompletadas');
        if (cotizacionesCompletadasEl) cotizacionesCompletadasEl.textContent = data.cotizaciones_completadas || 0;
        const garantiasActivasEl = document.getElementById('garantiasActivas');
        if (garantiasActivasEl) garantiasActivasEl.textContent = data.garantias_activas || 0;
        const totalProveedoresEl = document.getElementById('totalProveedores');
        if (totalProveedoresEl) totalProveedoresEl.textContent = data.total_proveedores || 0;
        const mensajesSinLeerEl = document.getElementById('mensajesSinLeer');
        if (mensajesSinLeerEl) mensajesSinLeerEl.textContent = messagesData.cantidad || 0;
        const serviciosPendientesEl = document.getElementById('serviciosPendientes');
        if (serviciosPendientesEl) serviciosPendientesEl.textContent = data.servicios_pendientes || 0;
        
    } catch (error) {
        console.error('Error cargando estadísticas:', error);
        // Valores por defecto
        const totalClientesEl = document.getElementById('totalClientes');
        if (totalClientesEl) totalClientesEl.textContent = '0';
        const totalCotizacionesEl = document.getElementById('totalCotizaciones');
        if (totalCotizacionesEl) totalCotizacionesEl.textContent = '0';
        const cotizacionesPendientesEl = document.getElementById('cotizacionesPendientes');
        if (cotizacionesPendientesEl) cotizacionesPendientesEl.textContent = '0';
        const cotizacionesCompletadasEl = document.getElementById('cotizacionesCompletadas');
        if (cotizacionesCompletadasEl) cotizacionesCompletadasEl.textContent = '0';
        const garantiasActivasEl = document.getElementById('garantiasActivas');
        if (garantiasActivasEl) garantiasActivasEl.textContent = '0';
        const totalProveedoresEl = document.getElementById('totalProveedores');
        if (totalProveedoresEl) totalProveedoresEl.textContent = '0';
        const mensajesSinLeerEl = document.getElementById('mensajesSinLeer');
        if (mensajesSinLeerEl) mensajesSinLeerEl.textContent = '0';
    }
}

async function cargarGraficos() {
    await Promise.all([
        cargarGraficoCotizaciones(),
        cargarGraficoTrabajos(),
        cargarGraficoReparaciones(),
        cargarGraficoUsuariosRol(),
        cargarGraficoCotizacionesMensuales(),
        cargarGraficoIngresosGastosMensuales()
    ]);
}

function cargarGraficoCotizaciones() {
    const canvas = document.getElementById('cotizacionesChart');
    if (!canvas) return;

    const url = construirUrlCotizaciones();
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const ctx = canvas.getContext('2d');

            if (cotizacionesChart) {
                cotizacionesChart.destroy();
                cotizacionesChart = null;
            }

            const tipoGrafico = document.getElementById('tipoGraficoCotizaciones').value;

            cotizacionesChart = new Chart(ctx, {
                type: tipoGrafico,
                data: {
                    labels: data.map(item => traducirEstado(item.estado)),
                    datasets: [{
                        data: data.map(item => item.cantidad),
                        backgroundColor: [
                            '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
                            '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
                        ],
                        borderColor: '#ffffff',
                        borderWidth: 3,
                        hoverBorderWidth: 5,
                        hoverBorderColor: '#ffffff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 20,
                                usePointStyle: true,
                                font: { size: 12, weight: 'bold' }
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            titleColor: '#ffffff',
                            bodyColor: '#ffffff',
                            cornerRadius: 8,
                            displayColors: true
                        }
                    },
                    animation: {
                        animateScale: true,
                        animateRotate: true,
                        duration: 2000,
                        easing: 'easeInOutQuart'
                    }
                }
            });
        })
        .catch(error => console.error('Error cargando gráfico de cotizaciones:', error));

    return Promise.resolve();
}


function cargarGraficoTrabajos() {
    fetch('../../controlador/Administrador/dashboard_controller.php?action=tipos_trabajo')
        .then(response => response.json())
        .then(data => {
            const ctx = document.getElementById('trabajosChart').getContext('2d');

            if (trabajosChart) {
                trabajosChart.destroy();
                trabajosChart = null;
            }

            trabajosChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: data.map(item => traducirTipoTrabajo(item.tipo_trabajo)),
                    datasets: [{
                        data: data.map(item => item.cantidad),
                        backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'],
                        borderColor: '#ffffff',
                        borderWidth: 3
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom' },
                        tooltip: {
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            titleColor: '#ffffff',
                            bodyColor: '#ffffff',
                            cornerRadius: 8
                        }
                    }
                }
            });
        })
        .catch(error => console.error('Error cargando gráfico de trabajos:', error));

    return Promise.resolve();
}

function cargarGraficoReparaciones() {
    fetch('../../controlador/Administrador/dashboard_controller.php?action=tipos_reparacion')
        .then(response => response.json())
        .then(data => {
            const ctx = document.getElementById('reparacionesChart').getContext('2d');

            if (reparacionesChart) {
                reparacionesChart.destroy();
                reparacionesChart = null;
            }

            reparacionesChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: data.map(item => traducirTipoReparacion(item.tipo_reparacion)),
                    datasets: [{
                        label: 'Cantidad de Reparaciones',
                        data: data.map(item => item.cantidad),
                        backgroundColor: 'rgba(78, 205, 196, 0.6)',
                        borderColor: '#4ECDC4',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { stepSize: 1 }
                        }
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            titleColor: '#ffffff',
                            bodyColor: '#ffffff',
                            cornerRadius: 8
                        }
                    }
                }
            });
        })
        .catch(error => console.error('Error cargando gráfico de reparaciones:', error));

    return Promise.resolve();
}

function cargarGraficoUsuariosRol() {
    fetch('../../controlador/Administrador/dashboard_controller.php?action=usuarios_por_rol')
        .then(response => response.json())
        .then(data => {
            const ctx = document.getElementById('usuariosRolChart').getContext('2d');

            if (usuariosRolChart) {
                usuariosRolChart.destroy();
                usuariosRolChart = null;
            }

            usuariosRolChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: data.map(item => item.nombre_rol),
                    datasets: [{
                        data: data.map(item => item.cantidad),
                        backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'],
                        borderColor: '#ffffff',
                        borderWidth: 3
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom' },
                        tooltip: {
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            titleColor: '#ffffff',
                            bodyColor: '#ffffff',
                            cornerRadius: 8
                        }
                    }
                }
            });
        })
        .catch(error => console.error('Error cargando gráfico de usuarios por rol:', error));

    return Promise.resolve();
}

function cargarGraficoCotizacionesMensuales() {
    const canvas = document.getElementById('cotizacionesMensualesChart');
    if (!canvas) return;

    fetch('../../controlador/Administrador/dashboard_controller.php?action=cotizaciones_mensuales')
        .then(response => response.json())
        .then(data => {
            const ctx = canvas.getContext('2d');

            if (cotizacionesMensualesChart) {
                cotizacionesMensualesChart.destroy();
                cotizacionesMensualesChart = null;
            }

            cotizacionesMensualesChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.map(item => item.mes_formateado),
                    datasets: [{
                        label: 'Cotizaciones por Mes',
                        data: data.map(item => item.cantidad),
                        borderColor: '#45B7D1',
                        backgroundColor: 'rgba(69, 183, 209, 0.2)',
                        borderWidth: 3,
                        pointBackgroundColor: '#45B7D1',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 5,
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { stepSize: 1 }
                        }
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            titleColor: '#ffffff',
                            bodyColor: '#ffffff',
                            cornerRadius: 8
                        }
                    }
                }
            });
        })
        .catch(error => console.error('Error cargando gráfico de cotizaciones mensuales:', error));

    return Promise.resolve();
}

async function cargarTablas() {
    await Promise.all([
        cargarTablaClientesFrecuentes(),
        cargarTablaUbicaciones()
    ]);
}

function cargarTablaMarcas() {
    fetch('../../controlador/Administrador/dashboard_controller.php?action=marcas_atendidas')
        .then(response => response.json())
        .then(data => {
            const gridData = data.map(item => ({
                marca: item.marca || 'Sin especificar',
                cantidad: item.cantidad,
                porcentaje: item.porcentaje + '%'
            }));

            new gridjs.Grid({
                columns: [
                    { name: 'Marca', id: 'marca' },
                    { name: 'Cantidad de Servicios', id: 'cantidad' },
                    { name: 'Porcentaje', id: 'porcentaje' }
                ],
                data: gridData,
                search: {
                    placeholder: '🔍 Buscar marcas...'
                },
                pagination: {
                    limit: 10,
                    summary: true,
                    prevButton: '⬅️ Anterior',
                    nextButton: 'Siguiente ➡️',
                    buttonsCount: 3
                },
                sort: true,
                language: {
                    'search': {
                        'placeholder': '🔍 Buscar...'
                    },
                    'pagination': {
                        'showing': 'Mostrando',
                        'of': 'de',
                        'to': 'a',
                        'results': 'resultados'
                    }
                },
                style: {
                    table: {
                        'font-size': '14px',
                        'border-collapse': 'collapse',
                        'width': '100%'
                    },
                    th: {
                        'background-color': '#343a40',
                        'color': '#ffffff',
                        'border': '1px solid #dee2e6',
                        'padding': '12px 8px',
                        'text-align': 'left',
                        'font-weight': '600',
                        'font-size': '13px'
                    },
                    td: {
                        'padding': '10px 8px',
                        'border': '1px solid #dee2e6',
                        'background-color': '#ffffff'
                    },
                    container: {
                        'box-shadow': '0 2px 8px rgba(0,0,0,0.1)',
                        'border-radius': '8px',
                        'overflow': 'hidden'
                    },
                    search: {
                        'border': '1px solid #ced4da',
                        'border-radius': '4px',
                        'padding': '8px 12px',
                        'margin-bottom': '15px'
                    },
                    pagination: {
                        'margin-top': '15px'
                    }
                }
            }).render(document.getElementById('marcasTable'));
        })
        .catch(error => console.error('Error cargando tabla de marcas:', error));
}


function cargarTablaClientesFrecuentes() {
    fetch('../../controlador/Administrador/dashboard_controller.php?action=clientes_frecuentes')
        .then(response => response.json())
        .then(data => {
            // Limpiar contenedor antes de renderizar
            document.getElementById('clientesFrecuentesTable').innerHTML = '';

            const gridData = data.map(item => ({
                cliente: item.nombres + ' ' + item.apellidos,
                total_cotizaciones: item.total_cotizaciones,
                ultima_cotizacion: new Date(item.ultima_cotizacion).toLocaleDateString('es-MX'),
                estado: `<span class="badge badge-${item.estado.toLowerCase()}">${traducirEstado(item.estado)}</span>`
            }));

            new gridjs.Grid({
                columns: [
                    { name: 'Cliente', id: 'cliente' },
                    { name: 'Total de Cotizaciones', id: 'total_cotizaciones' },
                    { name: 'Última Cotización', id: 'ultima_cotizacion' },
                    {
                        name: 'Estado',
                        formatter: (cell, row) => gridjs.html(cell)
                    }
                ],
                data: gridData,
                search: {
                    placeholder: '🔍 Buscar clientes...'
                },
                pagination: {
                    limit: 10,
                    summary: true,
                    prevButton: '⬅️ Anterior',
                    nextButton: 'Siguiente ➡️',
                    buttonsCount: 3
                },
                sort: true,
                language: {
                    'search': {
                        'placeholder': '🔍 Buscar...'
                    },
                    'pagination': {
                        'showing': 'Mostrando',
                        'of': 'de',
                        'to': 'a',
                        'results': 'resultados'
                    }
                },
                style: {
                    table: {
                        'font-size': '14px',
                        'border-collapse': 'collapse',
                        'width': '100%',
                        'border-radius': '8px',
                        'overflow': 'hidden'
                    },
                    th: {
                        'background': 'linear-gradient(135deg, #1a1a1a 0%, #343a40 100%)',
                        'color': '#ffffff',
                        'border': '1px solid #495057',
                        'padding': '15px 12px',
                        'text-align': 'left',
                        'font-weight': '700',
                        'font-size': '14px',
                        'text-transform': 'uppercase',
                        'letter-spacing': '0.5px'
                    },
                    td: {
                        'padding': '12px 12px',
                        'border': '1px solid #e9ecef',
                        'background-color': '#ffffff',
                        'transition': 'all 0.2s ease',
                        'vertical-align': 'middle'
                    },
                    tr: {
                        'transition': 'background-color 0.2s ease',
                        '&:hover td': {
                            'background-color': '#f8f9fa'
                        }
                    },
                    container: {
                        'box-shadow': '0 4px 20px rgba(0,0,0,0.15)',
                        'border-radius': '12px',
                        'overflow': 'hidden',
                        'border': '1px solid #e9ecef'
                    },
                    search: {
                        'border': '2px solid #ced4da',
                        'border-radius': '8px',
                        'padding': '10px 14px',
                        'margin-bottom': '20px',
                        'font-size': '14px',
                        'transition': 'border-color 0.2s ease',
                        '&:focus': {
                            'border-color': '#1a1a1a',
                            'outline': 'none'
                        }
                    },
                    pagination: {
                        'margin-top': '20px',
                        'padding': '10px 0'
                    }
                },
                columnStyles: {
                    0: { minWidth: '250px' }, // Cliente
                    1: { width: '120px' }, // Total de Cotizaciones
                    2: { width: '150px' }, // Última Cotización
                    3: { width: '100px' } // Estado
                }
            }).render(document.getElementById('clientesFrecuentesTable'));
        })
        .catch(error => console.error('Error cargando tabla de clientes frecuentes:', error));

    return Promise.resolve();
}

function cargarTablaUbicaciones() {
    fetch('../../controlador/Administrador/dashboard_controller.php?action=distribucion_geografica')
        .then(response => response.json())
        .then(data => {
            // Limpiar contenedor antes de renderizar
            document.getElementById('ubicacionesTable').innerHTML = '';

            const gridData = data.map(item => ({
                ubicacion: item.ciudad + ', ' + item.estado,
                cantidad_clientes: item.cantidad_clientes,
                porcentaje: item.porcentaje + '%'
            }));

            new gridjs.Grid({
                columns: [
                    { name: 'Ciudad/Estado', id: 'ubicacion' },
                    { name: 'Cantidad de Clientes', id: 'cantidad_clientes' },
                    { name: 'Porcentaje', id: 'porcentaje' }
                ],
                data: gridData,
                search: {
                    placeholder: '🔍 Buscar ubicaciones...'
                },
                pagination: {
                    limit: 10,
                    summary: true,
                    prevButton: '⬅️ Anterior',
                    nextButton: 'Siguiente ➡️',
                    buttonsCount: 3
                },
                sort: true,
                language: {
                    'search': {
                        'placeholder': '🔍 Buscar...'
                    },
                    'pagination': {
                        'showing': 'Mostrando',
                        'of': 'de',
                        'to': 'a',
                        'results': 'resultados'
                    }
                },
                style: {
                    table: {
                        'font-size': '14px',
                        'border-collapse': 'collapse',
                        'width': '100%',
                        'border-radius': '8px',
                        'overflow': 'hidden'
                    },
                    th: {
                        'background': 'linear-gradient(135deg, #1a1a1a 0%, #343a40 100%)',
                        'color': '#ffffff',
                        'border': '1px solid #495057',
                        'padding': '15px 12px',
                        'text-align': 'left',
                        'font-weight': '700',
                        'font-size': '14px',
                        'text-transform': 'uppercase',
                        'letter-spacing': '0.5px'
                    },
                    td: {
                        'padding': '12px 12px',
                        'border': '1px solid #e9ecef',
                        'background-color': '#ffffff',
                        'transition': 'all 0.2s ease',
                        'vertical-align': 'middle'
                    },
                    tr: {
                        'transition': 'background-color 0.2s ease',
                        '&:hover td': {
                            'background-color': '#f8f9fa'
                        }
                    },
                    container: {
                        'box-shadow': '0 4px 20px rgba(0,0,0,0.15)',
                        'border-radius': '12px',
                        'overflow': 'hidden',
                        'border': '1px solid #e9ecef'
                    },
                    search: {
                        'border': '2px solid #ced4da',
                        'border-radius': '8px',
                        'padding': '10px 14px',
                        'margin-bottom': '20px',
                        'font-size': '14px',
                        'transition': 'border-color 0.2s ease',
                        '&:focus': {
                            'border-color': '#1a1a1a',
                            'outline': 'none'
                        }
                    },
                    pagination: {
                        'margin-top': '20px',
                        'padding': '10px 0'
                    }
                }
            }).render(document.getElementById('ubicacionesTable'));
        })
        .catch(error => console.error('Error cargando tabla de ubicaciones:', error));

    return Promise.resolve();
}

// Funciones de filtros
function cambiarPeriodo() {
    const periodo = document.getElementById('periodoFiltro').value;
    filtrosActuales.periodo = periodo;

    const fechaPersonalizada = document.getElementById('fechaPersonalizada');
    if (periodo === 'personalizado') {
        fechaPersonalizada.style.display = 'flex';
    } else {
        fechaPersonalizada.style.display = 'none';
        aplicarFiltros();
    }
}

function aplicarFiltros() {
    const fechaInicio = document.getElementById('fechaInicio').value;
    const fechaFin = document.getElementById('fechaFin').value;
    const estado = document.getElementById('estadoFiltro').value;

    filtrosActuales.fechaInicio = fechaInicio;
    filtrosActuales.fechaFin = fechaFin;
    filtrosActuales.estado = estado;

    cargarGraficoCotizaciones();
}

function construirUrlCotizaciones() {
    let url = '../../controlador/Administrador/dashboard_controller.php?action=cotizaciones_estado';

    if (filtrosActuales.fechaInicio && filtrosActuales.fechaFin) {
        url += `&fecha_inicio=${filtrosActuales.fechaInicio}&fecha_fin=${filtrosActuales.fechaFin}`;
    }

    if (filtrosActuales.estado !== 'todos') {
        url += `&estado=${filtrosActuales.estado}`;
    }

    return url;
}

// Funciones de cambio de tipo de gráfico
function cambiarTipoGraficoCotizaciones() {
    cargarGraficoCotizaciones();
}

function cambiarTipoGraficoIngresosGastos() {
    cargarGraficoIngresosGastosMensuales();
}

// Funciones de exportación
function exportarDashboardPDF() {
    // Mostrar loading
    const btn = event.target.closest('button');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando...';
    btn.disabled = true;

    // Abrir nueva ventana para generar PDF imprimible
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Dashboard Total Carbon - ${new Date().toLocaleDateString('es-MX')}</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    margin: 20px;
                    color: #333;
                    line-height: 1.6;
                }
                h1 {
                    color: #000;
                    text-align: center;
                    margin-bottom: 30px;
                    font-size: 24px;
                    border-bottom: 3px solid #000;
                    padding-bottom: 10px;
                }
                h2 {
                    color: #000;
                    margin-top: 30px;
                    margin-bottom: 15px;
                    font-size: 18px;
                    border-left: 4px solid #000;
                    padding-left: 10px;
                }
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 15px;
                    margin: 20px 0;
                }
                .stat-card {
                    background: #f8f9fa;
                    border: 2px solid #000;
                    border-radius: 10px;
                    padding: 20px;
                    text-align: center;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
                .stat-card h3 {
                    margin: 0;
                    font-size: 2rem;
                    color: #000;
                    font-weight: bold;
                }
                .stat-card p {
                    margin: 8px 0 0 0;
                    color: #666;
                    font-size: 14px;
                    font-weight: 600;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 15px 0;
                    font-size: 12px;
                }
                th, td {
                    border: 1px solid #000;
                    padding: 8px;
                    text-align: left;
                }
                th {
                    background-color: #000;
                    color: white;
                    font-weight: bold;
                    text-transform: uppercase;
                    font-size: 11px;
                }
                tr:nth-child(even) {
                    background-color: #f8f9fa;
                }
                .chart-placeholder {
                    background: #f0f0f0;
                    border: 2px dashed #ccc;
                    padding: 30px;
                    text-align: center;
                    margin: 20px 0;
                    color: #666;
                    font-style: italic;
                }
                .footer {
                    margin-top: 40px;
                    text-align: center;
                    font-size: 10px;
                    color: #666;
                    border-top: 1px solid #ccc;
                    padding-top: 10px;
                }
                @media print {
                    body { margin: 0; }
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            <h1>Dashboard Total Carbon</h1>
            <p style="text-align: center; margin-bottom: 30px;">Fecha de generación: ${new Date().toLocaleString('es-MX')}</p>

            <div class="stats-grid" id="statsContainer">
                <div class="stat-card">
                    <h3 id="pdfTotalClientes">-</h3>
                    <p>Total de Clientes</p>
                </div>
                <div class="stat-card">
                    <h3 id="pdfTotalCotizaciones">-</h3>
                    <p>Total de Cotizaciones</p>
                </div>
                <div class="stat-card">
                    <h3 id="pdfCotizacionesPendientes">-</h3>
                    <p>Cotizaciones Pendientes</p>
                </div>
                <div class="stat-card">
                    <h3 id="pdfIngresosTotales">$-</h3>
                    <p>Ingresos Totales</p>
                </div>
            </div>

            <h2>Tipos de Reparaciones Más Comunes</h2>
            <div id="reparacionesTableContainer">
                <div class="chart-placeholder">Cargando datos...</div>
            </div>

            <h2>Tipos de Trabajo Más Solicitados</h2>
            <div id="trabajosTableContainer">
                <div class="chart-placeholder">Cargando datos...</div>
            </div>

            <h2>Cotizaciones por Estado</h2>
            <div id="cotizacionesTableContainer">
                <div class="chart-placeholder">Cargando datos...</div>
            </div>

            <h2>Historial de Ingresos y Salidas</h2>
            <div id="ingresosGastosTableContainer">
                <div class="chart-placeholder">Cargando datos...</div>
            </div>

            <div class="footer">
                Reporte generado por el Sistema de Gestión Total Carbon<br>
                ${new Date().toLocaleString('es-MX')}
            </div>

            <script>
                // Cargar datos y generar contenido
                Promise.all([
                    fetch('/TotalCarbon/controlador/Administrador/dashboard_controller.php?action=estadisticas').then(r => r.json()),
                    fetch('/TotalCarbon/controlador/Administrador/dashboard_controller.php?action=tipos_reparacion').then(r => r.json()),
                    fetch('/TotalCarbon/controlador/Administrador/dashboard_controller.php?action=tipos_trabajo').then(r => r.json()),
                    fetch('/TotalCarbon/controlador/Administrador/dashboard_controller.php?action=cotizaciones_estado').then(r => r.json()),
                    fetch('/TotalCarbon/controlador/Administrador/dashboard_controller.php?action=ingresos_gastos').then(r => r.json())
                ]).then(([stats, reparaciones, trabajos, cotizaciones, ingresosGastos]) => {
                    // Actualizar estadísticas
                    document.getElementById('pdfTotalClientes').textContent = stats.total_clientes || 0;
                    document.getElementById('pdfTotalCotizaciones').textContent = stats.total_cotizaciones || 0;
                    document.getElementById('pdfCotizacionesPendientes').textContent = stats.cotizaciones_pendientes || 0;
                    document.getElementById('pdfIngresosTotales').textContent = '$' + (parseFloat(stats.ingresos_totales || 0)).toLocaleString('es-MX', {minimumFractionDigits: 2});

                    // Generar tabla de reparaciones
                    let html = '<table><thead><tr><th>Tipo de Reparación</th><th>Cantidad</th></tr></thead><tbody>';
                    const reparacionesTraducidas = {
                        'FISURA': 'Fisura',
                        'FRACTURA': 'Fractura',
                        'RECONSTRUCCION': 'Reconstrucción',
                        'ADAPTACION': 'Adaptación',
                        'OTROS': 'Otros'
                    };
                    reparaciones.forEach(item => {
                        const reparacionTraducida = reparacionesTraducidas[item.tipo_reparacion] || item.tipo_reparacion;
                        html += '<tr><td>' + reparacionTraducida + '</td><td>' + (item.cantidad || 0) + '</td></tr>';
                    });
                    html += '</tbody></table>';
                    document.getElementById('reparacionesTableContainer').innerHTML = html;

                    // Generar tabla de trabajos
                    html = '<table><thead><tr><th>Tipo de Trabajo</th><th>Cantidad</th></tr></thead><tbody>';
                    const trabajosTraducidos = {
                        'EXPRESS': 'Express',
                        'NORMAL': 'Normal',
                        'PINTURA_TOTAL': 'Pintura Total'
                    };
                    trabajos.forEach(item => {
                        const trabajoTraducido = trabajosTraducidos[item.tipo_trabajo] || item.tipo_trabajo;
                        html += '<tr><td>' + trabajoTraducido + '</td><td>' + (item.cantidad || 0) + '</td></tr>';
                    });
                    html += '</tbody></table>';
                    document.getElementById('trabajosTableContainer').innerHTML = html;

                    // Generar tabla de cotizaciones
                    html = '<table><thead><tr><th>Estado</th><th>Cantidad</th></tr></thead><tbody>';
                    const estadosTraducidos = {
                        'PENDIENTE': 'Pendiente',
                        'APROBADA': 'Aprobada',
                        'RECHAZADA': 'Rechazada',
                        'EN_PROCESO': 'En Proceso',
                        'COMPLETADO': 'Completada'
                    };
                    cotizaciones.forEach(item => {
                        const estadoTraducido = estadosTraducidos[item.estado] || item.estado;
                        html += '<tr><td>' + estadoTraducido + '</td><td>' + (item.cantidad || 0) + '</td></tr>';
                    });
                    html += '</tbody></table>';
                    document.getElementById('cotizacionesTableContainer').innerHTML = html;

                    // Generar tabla de ingresos y gastos
                    html = '<table><thead><tr><th>Fecha</th><th>Concepto</th><th>Tipo</th><th>Monto</th><th>Descripción</th></tr></thead><tbody>';
                    ingresosGastos.forEach(item => {
                        const tipoTraducido = item.tipo === 'INGRESO' ? 'Ingreso' : 'Salida';
                        html += '<tr><td>' + new Date(item.fecha).toLocaleDateString('es-MX') + '</td><td>' + item.concepto + '</td><td>' + tipoTraducido + '</td><td>$' + parseFloat(item.monto).toLocaleString('es-MX', {minimumFractionDigits: 2}) + '</td><td>' + (item.descripcion || '') + '</td></tr>';
                    });
                    html += '</tbody></table>';
                    document.getElementById('ingresosGastosTableContainer').innerHTML = html;

                    // Auto-imprimir después de cargar
                    setTimeout(() => {
                        window.print();
                    }, 500);
                }).catch(error => {
                    console.error('Error cargando datos:', error);
                    document.querySelectorAll('.chart-placeholder').forEach(el => {
                        el.textContent = 'Error al cargar datos';
                    });
                });
            </script>
        </body>
        </html>
    `);

    // Restaurar botón después de un tiempo
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        mostrarMensaje('PDF generado. Use la función de imprimir del navegador para guardar como PDF.', 'success');
    }, 1000);
}

function exportarDashboardExcel() {
    // Mostrar loading
    const btn = event.target.closest('button');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando...';
    btn.disabled = true;

    // Crear archivo Excel con datos del dashboard
    const excelData = [];
    const fecha = new Date().toLocaleString('es-MX');

    // Título
    excelData.push(['Dashboard Total Carbon']);
    excelData.push(['Fecha de generación:', fecha]);
    excelData.push(['']);

    // Estadísticas
    excelData.push(['ESTADÍSTICAS GENERALES']);
    excelData.push(['Métrica', 'Valor']);
    excelData.push(['Total de Clientes', 'Cargando...']);
    excelData.push(['Total de Cotizaciones', 'Cargando...']);
    excelData.push(['Cotizaciones Pendientes', 'Cargando...']);
    excelData.push(['Cotizaciones Completadas', 'Cargando...']);
    excelData.push(['Ingresos Totales', 'Cargando...']);
    excelData.push(['Garantías Activas', 'Cargando...']);
    excelData.push(['Total de Proveedores', 'Cargando...']);
    excelData.push(['Mensajes Sin Leer', 'Cargando...']);
    excelData.push(['']);

    // Obtener datos y generar Excel
    Promise.all([
        fetch('../../controlador/Administrador/dashboard_controller.php?action=estadisticas').then(r => r.json()),
        fetch('../../controlador/Administrador/dashboard_controller.php?action=tipos_reparacion').then(r => r.json()),
        fetch('../../controlador/Administrador/dashboard_controller.php?action=tipos_trabajo').then(r => r.json()),
        fetch('../../controlador/Administrador/dashboard_controller.php?action=cotizaciones_estado').then(r => r.json()),
        fetch('../../controlador/Administrador/dashboard_controller.php?action=ingresos_gastos').then(r => r.json()),
        fetch('../../controlador/Administrador/dashboard_controller.php?action=resumen_ingresos_gastos').then(r => r.json())
    ]).then(([stats, reparaciones, trabajos, cotizaciones, ingresosGastos, resumenFinanciero]) => {
        // Actualizar estadísticas
        excelData[4] = ['Métrica', 'Valor'];
        excelData[5] = ['Total de Clientes', stats.total_clientes || 0];
        excelData[6] = ['Total de Cotizaciones', stats.total_cotizaciones || 0];
        excelData[7] = ['Cotizaciones Pendientes', stats.cotizaciones_pendientes || 0];
        excelData[8] = ['Cotizaciones Completadas', stats.cotizaciones_completadas || 0];
        excelData[9] = ['Ingresos Totales', '$' + (parseFloat(stats.ingresos_totales || 0)).toLocaleString('es-MX', {minimumFractionDigits: 2})];
        excelData[10] = ['Garantías Activas', stats.garantias_activas || 0];
        excelData[11] = ['Total de Proveedores', stats.total_proveedores || 0];
        excelData[12] = ['Mensajes Sin Leer', stats.mensajes_sin_leer || 0];

        // Tipos de reparaciones
        excelData.push(['']);
        excelData.push(['TIPOS DE REPARACIONES MÁS COMUNES']);
        excelData.push(['Tipo de Reparación', 'Cantidad']);
        const reparacionesTraducidas = {
            'FISURA': 'Fisura',
            'FRACTURA': 'Fractura',
            'RECONSTRUCCION': 'Reconstrucción',
            'ADAPTACION': 'Adaptación',
            'OTROS': 'Otros'
        };
        reparaciones.forEach(item => {
            const reparacionTraducida = reparacionesTraducidas[item.tipo_reparacion] || item.tipo_reparacion;
            excelData.push([reparacionTraducida, item.cantidad || 0]);
        });

        // Tipos de trabajo
        excelData.push(['']);
        excelData.push(['TIPOS DE TRABAJO MÁS SOLICITADOS']);
        excelData.push(['Tipo de Trabajo', 'Cantidad']);
        const trabajosTraducidos = {
            'EXPRESS': 'Express',
            'NORMAL': 'Normal',
            'PINTURA_TOTAL': 'Pintura Total'
        };
        trabajos.forEach(item => {
            const trabajoTraducido = trabajosTraducidos[item.tipo_trabajo] || item.tipo_trabajo;
            excelData.push([trabajoTraducido, item.cantidad || 0]);
        });

        // Cotizaciones por estado
        excelData.push(['']);
        excelData.push(['COTIZACIONES POR ESTADO']);
        excelData.push(['Estado', 'Cantidad']);
        const estadosTraducidos = {
            'PENDIENTE': 'Pendiente',
            'APROBADA': 'Aprobada',
            'RECHAZADA': 'Rechazada',
            'EN_PROCESO': 'En Proceso',
            'COMPLETADO': 'Completada'
        };
        cotizaciones.forEach(item => {
            const estadoTraducido = estadosTraducidos[item.estado] || item.estado;
            excelData.push([estadoTraducido, item.cantidad || 0]);
        });

        // Resumen financiero
        excelData.push(['']);
        excelData.push(['RESUMEN FINANCIERO']);
        excelData.push(['Total Ingresos', '$' + (parseFloat(resumenFinanciero.total_ingresos || 0)).toLocaleString('es-MX', {minimumFractionDigits: 2})]);
        excelData.push(['Total Salidas', '$' + (parseFloat(resumenFinanciero.total_gastos || 0)).toLocaleString('es-MX', {minimumFractionDigits: 2})]);
        excelData.push(['Balance Total', '$' + (parseFloat(resumenFinanciero.balance || 0)).toLocaleString('es-MX', {minimumFractionDigits: 2})]);

        // Historial de ingresos y gastos
        excelData.push(['']);
        excelData.push(['HISTORIAL DE INGRESOS Y SALIDAS']);
        excelData.push(['Fecha', 'Concepto', 'Tipo', 'Monto', 'Descripción']);
        ingresosGastos.forEach(item => {
            const tipoTraducido = item.tipo === 'INGRESO' ? 'Ingreso' : 'Salida';
            excelData.push([
                new Date(item.fecha).toLocaleDateString('es-MX'),
                item.concepto,
                tipoTraducido,
                '$' + parseFloat(item.monto).toLocaleString('es-MX', {minimumFractionDigits: 2}),
                item.descripcion || ''
            ]);
        });

        // Crear CSV
        let csv = '';
        excelData.forEach(row => {
            csv += row.map(cell => `"${cell}"`).join(',') + '\n';
        });

        // Descargar
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Dashboard_TotalCarbon_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        // Restaurar botón
        btn.innerHTML = originalText;
        btn.disabled = false;
        mostrarMensaje('Excel generado exitosamente', 'success');
    }).catch(error => {
        console.error('Error generando Excel:', error);
        btn.innerHTML = originalText;
        btn.disabled = false;
        mostrarMensaje('Error al generar Excel', 'error');
    });
}


// Función para mostrar mensajes
function mostrarMensaje(mensaje, tipo) {
    // Crear elemento de mensaje
    const mensajeDiv = document.createElement('div');
    mensajeDiv.className = `mensaje-${tipo}`;
    mensajeDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: bold;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;

    if (tipo === 'success') {
        mensajeDiv.style.backgroundColor = '#28a745';
    } else {
        mensajeDiv.style.backgroundColor = '#dc3545';
    }

    mensajeDiv.textContent = mensaje;
    document.body.appendChild(mensajeDiv);

    // Remover después de 3 segundos
    setTimeout(() => {
        mensajeDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(mensajeDiv);
        }, 300);
    }, 3000);
}

// Funciones de actualización
async function actualizarDashboard() {
    Swal.fire({
        title: 'Actualizando...',
        text: 'Cargando datos del dashboard',
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
            Swal.showLoading();
        }
    });

    try {
        await cargarDashboard();
        Swal.fire({
            icon: 'success',
            title: 'Actualizado',
            text: 'Los datos del dashboard han sido actualizados.',
            timer: 2000,
            showConfirmButton: false
        });
    } catch (error) {
        console.error('Error actualizando dashboard:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron actualizar los datos.',
            confirmButtonColor: '#1a1a1a'
        });
    }
}

// Funciones de traducción
function traducirEstado(estado) {
    const traducciones = {
        'PENDIENTE': 'Pendiente',
        'APROBADA': 'Aprobada',
        'RECHAZADA': 'Rechazada',
        'EN_PROCESO': 'En Proceso',
        'COMPLETADO': 'Completada'
    };
    return traducciones[estado] || estado;
}

function traducirTipoTrabajo(tipo) {
    const traducciones = {
        'EXPRESS': 'Express',
        'NORMAL': 'Normal',
        'PINTURA_TOTAL': 'Pintura Total'
    };
    return traducciones[tipo] || tipo;
}

function traducirTipoReparacion(tipo) {
    const traducciones = {
        'FISURA': 'Fisura',
        'FRACTURA': 'Fractura',
        'RECONSTRUCCION': 'Reconstrucción',
        'ADAPTACION': 'Adaptación',
        'OTROS': 'Otros'
    };
    return traducciones[tipo] || tipo;
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (document.getElementById('dashboard-section') && document.getElementById('dashboard-section').classList.contains('active')) {
            cargarDashboard();
        }
    }, 100);
});

// Variables para tabla de ingresos/gastos
let allIngresosGastos = [];
let filteredIngresosGastos = [];
let currentPageIngresosGastos = 1;
const itemsPerPageIngresosGastos = 10;

// Income/Expense Functions
async function cargarResumenIngresosGastos() {
    try {
        const response = await fetch('../../controlador/Administrador/dashboard_controller.php?action=resumen_ingresos_gastos');
        const data = await response.json();

        document.getElementById('totalIngresos').textContent = '$' + (parseFloat(data.total_ingresos || 0)).toLocaleString('es-MX', {minimumFractionDigits: 2});
        document.getElementById('totalGastos').textContent = '$' + (parseFloat(data.total_gastos || 0)).toLocaleString('es-MX', {minimumFractionDigits: 2});
        document.getElementById('balanceTotal').textContent = '$' + (parseFloat(data.balance || 0)).toLocaleString('es-MX', {minimumFractionDigits: 2});

        // Color del balance
        const balanceElement = document.getElementById('balanceTotal');
        const balance = parseFloat(data.balance || 0);
        if (balance > 0) {
            balanceElement.style.color = '#28a745';
        } else if (balance < 0) {
            balanceElement.style.color = '#dc3545';
        } else {
            balanceElement.style.color = '#17a2b8';
        }
    } catch (error) {
        console.error('Error cargando resumen ingresos/gastos:', error);
    }
}

async function cargarTablaIngresosGastos() {
    try {
        const response = await fetch('../../controlador/Administrador/dashboard_controller.php?action=ingresos_gastos');
        const data = await response.json();
        allIngresosGastos = data;
        filteredIngresosGastos = [...allIngresosGastos];
        currentPageIngresosGastos = 1;
        renderTablaIngresosGastosGrid();
    } catch (error) {
        console.error('Error cargando tabla ingresos/gastos:', error);
    }
}

function filtrarIngresosGastos() {
    const searchTerm = document.getElementById('buscadorIngresosGastos').value.toLowerCase();
    filteredIngresosGastos = allIngresosGastos.filter(item =>
        item.concepto.toLowerCase().includes(searchTerm) ||
        item.tipo.toLowerCase().includes(searchTerm) ||
        (item.descripcion && item.descripcion.toLowerCase().includes(searchTerm))
    );
    currentPageIngresosGastos = 1;
    renderTablaIngresosGastosGrid();
}

function renderTablaIngresosGastosGrid() {
    // Limpiar contenedor antes de renderizar
    document.getElementById('ingresosGastosTable').innerHTML = '';

    const gridData = filteredIngresosGastos.map(item => {
        const tipoClass = item.tipo === 'INGRESO' ? 'tipo-ingreso' : 'tipo-gasto';
        const tipoText = item.tipo === 'INGRESO' ? 'Ingreso' : 'Salida';
        return {
            fecha: new Date(item.fecha).toLocaleDateString('es-MX'),
            concepto: item.concepto,
            tipo: `<span class="${tipoClass}">${tipoText}</span>`,
            monto: '$' + parseFloat(item.monto).toLocaleString('es-MX', {minimumFractionDigits: 2}),
            descripcion: item.descripcion || '',
            id_ingreso_gasto: item.id_ingreso_gasto
        };
    });

    new gridjs.Grid({
        columns: [
            { name: 'Fecha', id: 'fecha' },
            { name: 'Concepto', id: 'concepto' },
            {
                name: 'Tipo',
                formatter: (cell, row) => gridjs.html(cell)
            },
            { name: 'Monto', id: 'monto' },
            { name: 'Descripción', id: 'descripcion' },
            { name: 'ID', id: 'id_ingreso_gasto', hidden: true },
            {
                name: 'Acciones',
                formatter: (cell, row) => gridjs.html(`
                    <div class="table-actions">
                        <button class="action-btn btn-edit-income" onclick="editarIngresoGasto(${row.cells[5].data})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn btn-delete-income" onclick="eliminarIngresoGasto(${row.cells[5].data})" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `)
            }
        ],
        data: gridData,
        search: {
            placeholder: '🔍 Buscar registros...'
        },
        pagination: {
            limit: 10,
            summary: true,
            prevButton: '⬅️ Anterior',
            nextButton: 'Siguiente ➡️',
            buttonsCount: 3
        },
        sort: true,
        language: {
            'search': {
                'placeholder': '🔍 Buscar...'
            },
            'pagination': {
                'showing': 'Mostrando',
                'of': 'de',
                'to': 'a',
                'results': 'resultados'
            }
        },
        style: {
            table: {
                'font-size': '14px',
                'border-collapse': 'collapse',
                'width': '100%',
                'border-radius': '8px',
                'overflow': 'hidden'
            },
            th: {
                'background': 'linear-gradient(135deg, #1a1a1a 0%, #343a40 100%)',
                'color': '#ffffff',
                'border': '1px solid #495057',
                'padding': '15px 12px',
                'text-align': 'left',
                'font-weight': '700',
                'font-size': '14px',
                'text-transform': 'uppercase',
                'letter-spacing': '0.5px'
            },
            td: {
                'padding': '12px 12px',
                'border': '1px solid #e9ecef',
                'background-color': '#ffffff',
                'transition': 'all 0.2s ease',
                'vertical-align': 'middle'
            },
            tr: {
                'transition': 'background-color 0.2s ease',
                '&:hover td': {
                    'background-color': '#f8f9fa'
                }
            },
            container: {
                'box-shadow': '0 4px 20px rgba(0,0,0,0.15)',
                'border-radius': '12px',
                'overflow': 'hidden',
                'border': '1px solid #e9ecef'
            },
            search: {
                'border': '2px solid #ced4da',
                'border-radius': '8px',
                'padding': '10px 14px',
                'margin-bottom': '20px',
                'font-size': '14px',
                'transition': 'border-color 0.2s ease',
                '&:focus': {
                    'border-color': '#1a1a1a',
                    'outline': 'none'
                }
            },
            pagination: {
                'margin-top': '20px',
                'padding': '10px 0'
            }
        }
    }).render(document.getElementById('ingresosGastosTable'));
}

function renderPaginationIngresosGastos() {
    // Grid.js maneja la paginación automáticamente, no necesitamos esta función
}

function cargarGraficoIngresosGastosMensuales() {
    fetch('../../controlador/Administrador/dashboard_controller.php?action=ingresos_gastos')
        .then(response => response.json())
        .then(data => {
            // Filtrar por fechas si están set
            let filteredData = data;
            if (filtrosIngresosGastosChart.fechaInicio && filtrosIngresosGastosChart.fechaFin) {
                filteredData = data.filter(item => {
                    const fecha = new Date(item.fecha);
                    const inicio = new Date(filtrosIngresosGastosChart.fechaInicio);
                    const fin = new Date(filtrosIngresosGastosChart.fechaFin);
                    return fecha >= inicio && fecha <= fin;
                });
            }

            // Ordenar por fecha
            filteredData.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

            const ctx = document.getElementById('ingresosGastosMensualesChart').getContext('2d');

            if (ingresosGastosMensualesChart) {
                ingresosGastosMensualesChart.destroy();
                ingresosGastosMensualesChart = null;
            }

            const tipoMostrar = document.getElementById('tipoGraficoIngresosGastos').value;
            const datasets = [];

            if (tipoMostrar === 'todos' || tipoMostrar === 'ingresos') {
                const ingresos = filteredData.filter(item => item.tipo === 'INGRESO');
                datasets.push({
                    label: 'Ingresos',
                    data: ingresos.map(item => parseFloat(item.monto)),
                    borderColor: '#28a745',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    borderWidth: 3,
                    pointBackgroundColor: '#28a745',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    tension: 0.4,
                    fill: false
                });
            }

            if (tipoMostrar === 'todos' || tipoMostrar === 'salidas') {
                const salidas = filteredData.filter(item => item.tipo === 'SALIDA');
                datasets.push({
                    label: 'Salidas',
                    data: salidas.map(item => parseFloat(item.monto)),
                    borderColor: '#dc3545',
                    backgroundColor: 'rgba(220, 53, 69, 0.1)',
                    borderWidth: 3,
                    pointBackgroundColor: '#dc3545',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    tension: 0.4,
                    fill: false
                });
            }

            if (tipoMostrar === 'balance') {
                // Para balance, calcular acumulado
                let balance = 0;
                const balances = [];
                filteredData.forEach(item => {
                    if (item.tipo === 'INGRESO') {
                        balance += parseFloat(item.monto);
                    } else {
                        balance -= parseFloat(item.monto);
                    }
                    balances.push(balance);
                });
                datasets.push({
                    label: 'Balance',
                    data: balances,
                    borderColor: '#17a2b8',
                    backgroundColor: 'rgba(23, 162, 184, 0.1)',
                    borderWidth: 3,
                    pointBackgroundColor: '#17a2b8',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    tension: 0.4,
                    fill: false
                });
            }

            // Labels basados en el tipo mostrar
            let labels = [];
            if (tipoMostrar === 'todos') {
                labels = filteredData.map(item => new Date(item.fecha).toLocaleDateString('es-MX'));
            } else if (tipoMostrar === 'ingresos') {
                labels = filteredData.filter(item => item.tipo === 'INGRESO').map(item => new Date(item.fecha).toLocaleDateString('es-MX'));
            } else if (tipoMostrar === 'salidas') {
                labels = filteredData.filter(item => item.tipo === 'SALIDA').map(item => new Date(item.fecha).toLocaleDateString('es-MX'));
            } else if (tipoMostrar === 'balance') {
                labels = filteredData.map(item => new Date(item.fecha).toLocaleDateString('es-MX'));
            }

            ingresosGastosMensualesChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0,0,0,0.05)'
                            },
                            ticks: {
                                callback: function(value) {
                                    return '$' + value.toLocaleString('es-MX');
                                },
                                font: {
                                    size: 12,
                                    weight: 'bold'
                                }
                            }
                        },
                        x: {
                            grid: {
                                color: 'rgba(0,0,0,0.05)'
                            },
                            ticks: {
                                font: {
                                    size: 11
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                usePointStyle: true,
                                padding: 20,
                                font: {
                                    size: 12,
                                    weight: 'bold'
                                }
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0,0,0,0.9)',
                            titleColor: '#ffffff',
                            bodyColor: '#ffffff',
                            cornerRadius: 12,
                            titleFont: {
                                size: 14,
                                weight: 'bold'
                            },
                            bodyFont: {
                                size: 13
                            },
                            padding: 15,
                            callbacks: {
                                label: function(context) {
                                    return context.dataset.label + ': $' + context.parsed.y.toLocaleString('es-MX');
                                }
                            }
                        }
                    },
                    elements: {
                        point: {
                            hoverBorderWidth: 4
                        }
                    },
                    animation: {
                        duration: 2000,
                        easing: 'easeInOutQuart'
                    }
                }
            });
        })
        .catch(error => console.error('Error cargando gráfico de ingresos/egresos individuales:', error));

    return Promise.resolve();
}

function openIncomeExpenseModal() {
    const modal = document.getElementById('incomeExpenseModal');
    modal.classList.add('active');
    document.getElementById('incomeExpenseModalTitle').textContent = 'Nuevo Registro de Ingreso/Salida';
    document.getElementById('incomeExpenseForm').reset();
    document.getElementById('fecha').value = new Date().toISOString().split('T')[0];
    // Resetear el botón de guardar
    const saveBtn = document.getElementById('incomeExpenseSaveBtn');
    saveBtn.textContent = 'Guardar Registro';
    saveBtn.onclick = saveIncomeExpense;
}

function closeIncomeExpenseModal() {
    const modal = document.getElementById('incomeExpenseModal');
    modal.classList.remove('active');
}

function saveIncomeExpense() {
    // Limpiar validaciones previas
    document.querySelectorAll('.form-control').forEach(el => {
        el.style.borderColor = '#ddd';
    });
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
    });

    const formData = {
        concepto: document.getElementById('concepto').value.trim(),
        tipo: document.getElementById('ingreso_tipo').value,
        monto: parseFloat(document.getElementById('monto').value),
        fecha: document.getElementById('fecha').value,
        descripcion: document.getElementById('descripcion_ingreso').value.trim()
    };

    let hasErrors = false;

    // Validación con colores rojos
    if (!formData.concepto) {
        document.getElementById('concepto').classList.add('error');
        hasErrors = true;
    } else {
        document.getElementById('concepto').classList.remove('error');
    }

    if (!formData.tipo) {
        document.getElementById('ingreso_tipo').classList.add('error');
        hasErrors = true;
    } else {
        document.getElementById('ingreso_tipo').classList.remove('error');
    }

    if (!formData.monto || formData.monto <= 0) {
        document.getElementById('monto').classList.add('error');
        hasErrors = true;
    } else {
        document.getElementById('monto').classList.remove('error');
    }

    if (!formData.fecha) {
        document.getElementById('fecha').classList.add('error');
        hasErrors = true;
    } else {
        document.getElementById('fecha').classList.remove('error');
    }

    if (hasErrors) {
        Swal.fire({
            icon: 'error',
            title: 'Campos requeridos',
            text: 'Por favor complete todos los campos obligatorios marcados en rojo',
            confirmButtonColor: '#dc3545'
        });
        return;
    }

    fetch('../../controlador/Administrador/dashboard_controller.php?action=guardar_ingreso_gasto', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire({
                icon: 'success',
                title: '¡Guardado!',
                text: 'El registro se guardó exitosamente',
                confirmButtonColor: '#28a745',
                timer: 2000,
                timerProgressBar: true
            });
            closeIncomeExpenseModal();
            // Recargar la página para mostrar cambios
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al guardar el registro',
                confirmButtonColor: '#dc3545'
            });
        }
    })
    .catch(error => {
        console.error('Error guardando ingreso/gasto:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al guardar el registro',
            confirmButtonColor: '#dc3545'
        });
    });
}

function editarIngresoGasto(id) {
    // Obtener datos del registro
    fetch(`../../controlador/Administrador/dashboard_controller.php?action=obtener_ingreso_gasto&id=${id}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Llenar el modal con los datos
                document.getElementById('incomeExpenseModalTitle').textContent = 'Editar Registro de Ingreso/Salida';
                document.getElementById('concepto').value = data.registro.concepto;
                document.getElementById('ingreso_tipo').value = data.registro.tipo;
                document.getElementById('monto').value = data.registro.monto;
                document.getElementById('fecha').value = data.registro.fecha;
                document.getElementById('descripcion_ingreso').value = data.registro.descripcion || '';

                // Cambiar el botón de guardar
                const saveBtn = document.getElementById('incomeExpenseSaveBtn');
                saveBtn.textContent = 'Actualizar Registro';
                saveBtn.onclick = function() { actualizarIngresoGasto(id); };

                // Abrir modal sin resetear
                const modal = document.getElementById('incomeExpenseModal');
                modal.classList.add('active');
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo cargar el registro',
                    confirmButtonColor: '#dc3545'
                });
            }
        })
        .catch(error => {
            console.error('Error obteniendo ingreso/gasto:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al cargar el registro',
                confirmButtonColor: '#dc3545'
            });
        });
}

function actualizarIngresoGasto(id) {
    // Limpiar validaciones previas
    document.querySelectorAll('.form-control').forEach(el => {
        el.style.borderColor = '#ddd';
    });
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
    });

    const formData = {
        id: id,
        concepto: document.getElementById('concepto').value.trim(),
        tipo: document.getElementById('ingreso_tipo').value,
        monto: parseFloat(document.getElementById('monto').value),
        fecha: document.getElementById('fecha').value,
        descripcion: document.getElementById('descripcion_ingreso').value.trim()
    };

    let hasErrors = false;

    // Validación con colores rojos
    if (!formData.concepto) {
        document.getElementById('concepto').classList.add('error');
        hasErrors = true;
    } else {
        document.getElementById('concepto').classList.remove('error');
    }

    if (!formData.tipo) {
        document.getElementById('ingreso_tipo').classList.add('error');
        hasErrors = true;
    } else {
        document.getElementById('ingreso_tipo').classList.remove('error');
    }

    if (!formData.monto || formData.monto <= 0) {
        document.getElementById('monto').classList.add('error');
        hasErrors = true;
    } else {
        document.getElementById('monto').classList.remove('error');
    }

    if (!formData.fecha) {
        document.getElementById('fecha').classList.add('error');
        hasErrors = true;
    } else {
        document.getElementById('fecha').classList.remove('error');
    }

    if (hasErrors) {
        Swal.fire({
            icon: 'error',
            title: 'Campos requeridos',
            text: 'Por favor complete todos los campos obligatorios marcados en rojo',
            confirmButtonColor: '#dc3545'
        });
        return;
    }

    fetch('../../controlador/Administrador/dashboard_controller.php?action=actualizar_ingreso_gasto', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire({
                icon: 'success',
                title: '¡Actualizado!',
                text: 'El registro se actualizó exitosamente',
                confirmButtonColor: '#28a745',
                timer: 2000,
                timerProgressBar: true
            });
            closeIncomeExpenseModal();
            // Recargar la página para mostrar cambios
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al actualizar el registro',
                confirmButtonColor: '#dc3545'
            });
        }
    })
    .catch(error => {
        console.error('Error actualizando ingreso/gasto:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al actualizar el registro',
            confirmButtonColor: '#dc3545'
        });
    });
}

function eliminarIngresoGasto(id) {
    Swal.fire({
        title: '¿Eliminar registro?',
        text: '¿Está seguro de que desea eliminar este registro? Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            const formData = new FormData();
            formData.append('id', id);

            fetch('../../controlador/Administrador/dashboard_controller.php?action=eliminar_ingreso_gasto', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Eliminado!',
                        text: 'El registro se eliminó exitosamente',
                        confirmButtonColor: '#28a745',
                        timer: 2000,
                        timerProgressBar: true
                    });
                    // Recargar la página para mostrar cambios
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error al eliminar el registro',
                        confirmButtonColor: '#dc3545'
                    });
                }
            })
            .catch(error => {
                console.error('Error eliminando ingreso/gasto:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al eliminar el registro',
                    confirmButtonColor: '#dc3545'
                });
            });
        }
    });
}

// Filtros para ingresos/gastos
let filtrosIngresosGastos = {
    periodo: 'mes',
    fechaInicio: null,
    fechaFin: null
};

// Filtros para el gráfico de ingresos/gastos
let filtrosIngresosGastosChart = {
    periodo: 'mes',
    fechaInicio: null,
    fechaFin: null
};

function cambiarPeriodoIngresosGastos() {
    const periodo = document.getElementById('periodoIngresosGastos').value;
    const fechaPersonalizada = document.getElementById('fechaPersonalizadaIngresosGastos');

    filtrosIngresosGastos.periodo = periodo;

    if (periodo === 'personalizado') {
        fechaPersonalizada.style.display = 'flex';
        // No aplicar filtros automáticamente, esperar a que el usuario seleccione fechas
    } else {
        fechaPersonalizada.style.display = 'none';
        aplicarFiltrosIngresosGastos();
    }
}

function aplicarFiltrosIngresosGastos() {
    const periodo = filtrosIngresosGastos.periodo;
    let fechaInicio = null;
    let fechaFin = null;

    const hoy = new Date();
    const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const ultimoDiaMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

    switch (periodo) {
        case 'hoy':
            fechaInicio = hoy.toISOString().split('T')[0];
            fechaFin = hoy.toISOString().split('T')[0];
            break;
        case 'semana':
            const primerDiaSemana = new Date(hoy);
            primerDiaSemana.setDate(hoy.getDate() - hoy.getDay());
            const ultimoDiaSemana = new Date(primerDiaSemana);
            ultimoDiaSemana.setDate(primerDiaSemana.getDate() + 6);
            fechaInicio = primerDiaSemana.toISOString().split('T')[0];
            fechaFin = ultimoDiaSemana.toISOString().split('T')[0];
            break;
        case 'mes':
            fechaInicio = primerDiaMes.toISOString().split('T')[0];
            fechaFin = ultimoDiaMes.toISOString().split('T')[0];
            break;
        case 'anio':
            fechaInicio = new Date(hoy.getFullYear(), 0, 1).toISOString().split('T')[0];
            fechaFin = new Date(hoy.getFullYear(), 11, 31).toISOString().split('T')[0];
            break;
        case 'personalizado':
            fechaInicio = document.getElementById('fechaInicioIngresosGastos').value;
            fechaFin = document.getElementById('fechaFinIngresosGastos').value;
            if (!fechaInicio || !fechaFin) {
                return; // No aplicar si no hay fechas
            }
            break;
    }

    filtrosIngresosGastos.fechaInicio = fechaInicio;
    filtrosIngresosGastos.fechaFin = fechaFin;

    cargarGraficoIngresosGastosMensuales();
}

function cambiarPeriodoIngresosGastosChart() {
    const periodo = document.getElementById('periodoIngresosGastosChart').value;
    const fechaPersonalizada = document.getElementById('fechaPersonalizadaIngresosGastosChart');

    filtrosIngresosGastosChart.periodo = periodo;

    if (periodo === 'personalizado') {
        fechaPersonalizada.style.display = 'flex';
        // No aplicar filtros automáticamente, esperar a que el usuario seleccione fechas
    } else {
        fechaPersonalizada.style.display = 'none';
        aplicarFiltrosIngresosGastosChart();
    }
}

function aplicarFiltrosIngresosGastosChart() {
    const periodo = filtrosIngresosGastosChart.periodo;
    let fechaInicio = null;
    let fechaFin = null;

    const hoy = new Date();
    const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const ultimoDiaMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

    switch (periodo) {
        case 'hoy':
            fechaInicio = hoy.toISOString().split('T')[0];
            fechaFin = hoy.toISOString().split('T')[0];
            break;
        case 'semana':
            const primerDiaSemana = new Date(hoy);
            primerDiaSemana.setDate(hoy.getDate() - hoy.getDay());
            const ultimoDiaSemana = new Date(primerDiaSemana);
            ultimoDiaSemana.setDate(primerDiaSemana.getDate() + 6);
            fechaInicio = primerDiaSemana.toISOString().split('T')[0];
            fechaFin = ultimoDiaSemana.toISOString().split('T')[0];
            break;
        case 'mes':
            fechaInicio = primerDiaMes.toISOString().split('T')[0];
            fechaFin = ultimoDiaMes.toISOString().split('T')[0];
            break;
        case 'anio':
            fechaInicio = new Date(hoy.getFullYear(), 0, 1).toISOString().split('T')[0];
            fechaFin = new Date(hoy.getFullYear(), 11, 31).toISOString().split('T')[0];
            break;
        case 'personalizado':
            fechaInicio = document.getElementById('fechaInicioIngresosGastosChart').value;
            fechaFin = document.getElementById('fechaFinIngresosGastosChart').value;
            if (!fechaInicio || !fechaFin) {
                return; // No aplicar si no hay fechas
            }
            break;
    }

    filtrosIngresosGastosChart.fechaInicio = fechaInicio;
    filtrosIngresosGastosChart.fechaFin = fechaFin;

    cargarGraficoIngresosGastosMensuales();
}

// Refresh dashboard data every 5 minutes
setInterval(function() {
    if (document.getElementById('dashboard-section').classList.contains('active')) {
        cargarDashboard();
        cargarResumenIngresosGastos();
        cargarTablaIngresosGastos();
    }
}, 300000);