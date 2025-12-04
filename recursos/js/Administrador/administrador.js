
// Variables globales
let arregloUsuarios = [];
let arregloProductos = [];
let arregloGarantias = [];
let arregloServiciosCompletados = [];
let arregloCotizaciones = [];
let seccionActual = 'clientes';
let elementoEditando = null;
let idEditandoActual = null;

// Funciones de inicialización
async function initializeData() {
    await loadProveedores();
    await loadProductos();
    // Cargar otros datos si es necesario
}

function confirmLogout() {
    Swal.fire({
        title: '¿Está seguro?',
        text: "¿Desea cerrar la sesión?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#1a1a1a',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, cerrar sesión',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = '../../controlador/logout.php';
        }
    });
}

// Funciones de navegación
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const hamburger = document.getElementById('hamburger');
    const overlay = document.getElementById('sidebarOverlay');

    sidebar.classList.toggle('visible');
    hamburger.classList.toggle('active');
    overlay.classList.toggle('active');
}

function showSection(section) {
    // Ocultar todas las secciones
    document.querySelectorAll('.content-section').forEach(sec => {
        sec.classList.remove('active');
    });

    
    // Mostrar la sección seleccionada
    const targetSection = document.getElementById(section + '-section');
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Actualizar menú lateral
    document.querySelectorAll('.sidebar-menu a').forEach(link => {
        link.classList.remove('active');
    });
    if (event && event.target) {
        event.target.classList.add('active');
    }

    seccionActual = section;

    // Mostrar/ocultar botón flotante del chat
    const chatFloatingBtn = document.getElementById('chatFloatingBtn');
    if (chatFloatingBtn) {
        if (section === 'chat') {
            chatFloatingBtn.style.display = 'none';
        } else {
            chatFloatingBtn.style.display = 'flex';
        }
    }

    // Cerrar sidebar en móvil
    if (window.innerWidth <= 992) {
        toggleSidebar();
    }

    // Cargar datos específicos de la sección
    if (section === 'dashboard') {
        cargarDashboard();
    } else if (section === 'proveedores') {
        // Verificar si la función existe antes de llamarla
        if (typeof loadProveedores === 'function') {
            setTimeout(() => {
                loadProveedores();
                loadIngresosGastosProveedores();
            }, 100);
        } else {
            // Si no existe, intentar cargarla después de un breve delay
            setTimeout(() => {
                if (typeof loadProveedores === 'function') {
                    loadProveedores();
                    loadIngresosGastosProveedores();
                } else {
                    console.error('Función loadProveedores no encontrada');
                }
            }, 200);
        }
    } else if (section === 'productos') {
        loadProductos();
    } else if (section === 'garantias') {
        // Verificar si la función existe antes de llamarla
        if (typeof initializeGarantias === 'function') {
            initializeGarantias();
        } else {
            // Si no existe, intentar cargarla después de un breve delay
            setTimeout(() => {
                if (typeof initializeGarantias === 'function') {
                    initializeGarantias();
                } else {
                    console.error('Función initializeGarantias no encontrada');
                }
            }, 100);
        }
    } else if (section === 'clientes') {
        if (typeof loadClientes === 'function') {
            loadClientes();
        }
    } else if (section === 'cotizaciones') {
        // Verificar si la función existe antes de llamarla
        if (typeof initializeCotizaciones === 'function') {
            initializeCotizaciones();
        } else {
            // Si no existe, intentar cargarla después de un breve delay
            setTimeout(() => {
                if (typeof initializeCotizaciones === 'function') {
                    initializeCotizaciones();
                } else {
                    console.error('Función initializeCotizaciones no encontrada');
                }
            }, 100);
        }
    } else if (section === 'cotizaciones-pendientes') {
        // Verificar si la función existe antes de llamarla
        if (typeof initializeCotizacionesPendientes === 'function') {
            initializeCotizacionesPendientes();
        } else {
            // Si no existe, intentar cargarla después de un breve delay
            setTimeout(() => {
                if (typeof initializeCotizacionesPendientes === 'function') {
                    initializeCotizacionesPendientes();
                } else {
                    console.error('Función initializeCotizacionesPendientes no encontrada');
                }
            }, 100);
        }
    } else if (section === 'nuevo-servicio') {
        // Verificar si la función existe antes de llamarla
        if (typeof initializeNuevoServicio === 'function') {
            initializeNuevoServicio();
        } else {
            // Si no existe, intentar cargarla después de un breve delay
            setTimeout(() => {
                if (typeof initializeNuevoServicio === 'function') {
                    initializeNuevoServicio();
                } else {
                    console.error('Función initializeNuevoServicio no encontrada');
                }
            }, 100);
        }
    } else if (section === 'piezas') {
        // Verificar si la función existe antes de llamarla
        if (typeof initializePiezas === 'function') {
            initializePiezas();
        } else {
            // Si no existe, intentar cargarla después de un breve delay
            setTimeout(() => {
                if (typeof initializePiezas === 'function') {
                    initializePiezas();
                } else {
                    console.error('Función initializePiezas no encontrada');
                }
            }, 100);
        }
    } else if (section === 'proveedores') {
        // Verificar si la función existe antes de llamarla
        if (typeof initializeProveedores === 'function') {
            initializeProveedores();
        } else {
            // Si no existe, intentar cargarla después de un breve delay
            setTimeout(() => {
                if (typeof initializeProveedores === 'function') {
                    initializeProveedores();
                } else {
                    console.error('Función initializeProveedores no encontrada');
                }
            }, 100);
        }
    }



// Función para cargar tabla de ingresos/gastos en proveedores
async function loadIngresosGastosProveedores() {
    try {
        const response = await fetch('../../controlador/Administrador/dashboard_controller.php?action=ingresos_gastos');
        const data = await response.json();

        const gridData = data.map(item => ({
            fecha: new Date(item.fecha).toLocaleDateString('es-MX'),
            concepto: item.concepto,
            tipo: `<span class="${item.tipo === 'INGRESO' ? 'tipo-ingreso' : 'tipo-gasto'}">${item.tipo === 'INGRESO' ? 'Ingreso' : 'Salida'}</span>`,
            monto: '$' + parseFloat(item.monto).toLocaleString('es-MX', { minimumFractionDigits: 2 }),
            descripcion: item.descripcion || '',
            id_ingreso_gasto: item.id_ingreso_gasto
        }));

        new gridjs.Grid({
            columns: [
                { name: 'Fecha', id: 'fecha' },
                { name: 'Concepto', id: 'concepto' },
                { name: 'Tipo', id: 'tipo', html: true },
                { name: 'Monto', id: 'monto' },
                { name: 'Descripción', id: 'descripcion' },
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
        }).render(document.getElementById('ingresosGastosTableProveedores'));
    } catch (error) {
        console.error('Error cargando tabla ingresos/gastos proveedores:', error);
    }
}



// Funciones de modales
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
    clearForm(modalId);
    elementoEditando = null;
    idEditandoActual = null;
}

function clearForm(modalId) {
    const form = document.querySelector(`#${modalId} form`);
    if (form) {
        form.reset();
        // Limpiar errores
        form.querySelectorAll('.form-control').forEach(input => {
            input.classList.remove('error');
        });
        form.querySelectorAll('.error-message').forEach(error => {
            error.classList.remove('show');
        });
    }
}

function actualizarTablas() {
    // Mostrar indicador de carga
    const btnActualizar = document.querySelector('button[onclick="actualizarTablas()"]');
    const originalText = btnActualizar.innerHTML;
    btnActualizar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Actualizando...';
    btnActualizar.disabled = true;

    // Actualizar datos según la sección actual
    if (seccionActual === 'proveedores') {
        loadProveedores();
        loadIngresosGastosProveedores();
    } else if (seccionActual === 'productos') {
        loadProductos();
    } else if (seccionActual === 'clientes') {
        // Si hay función para cargar clientes, llamarla aquí
        if (typeof loadClientes === 'function') {
            loadClientes();
        }
    } else if (seccionActual === 'garantias') {
        // Si hay función para cargar garantías, llamarla aquí
        if (typeof loadGarantias === 'function') {
            loadGarantias();
        }
    }

    // Restaurar botón después de un breve delay
    setTimeout(() => {
        btnActualizar.innerHTML = originalText;
        btnActualizar.disabled = false;

        // Mostrar mensaje de éxito
        Swal.fire({
            icon: 'success',
            title: 'Tablas Actualizadas',
            text: 'Los datos han sido actualizados correctamente.',
            timer: 1500,
            showConfirmButton: false,
            confirmButtonColor: '#1a1a1a'
        });
    }, 1000);
}

// Dashboard functionality
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

function cargarDashboard() {
    cargarEstadisticas();
    cargarGraficos();
    cargarTablas();
    cargarResumenIngresosGastos();
    cargarTablaIngresosGastos();
}

function cargarEstadisticas() {
    fetch('../../controlador/Administrador/dashboard_controller.php?action=estadisticas')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
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
            if (mensajesSinLeerEl) mensajesSinLeerEl.textContent = data.mensajes_sin_leer || 0;
        })
        .catch(error => {
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
        });

    // Cargar mensajes sin leer
    fetch('../../controlador/Administrador/dashboard_controller.php?action=mensajes_sin_leer')
        .then(response => response.json())
        .then(data => {
            const mensajesSinLeerEl = document.getElementById('mensajesSinLeer');
            if (mensajesSinLeerEl) mensajesSinLeerEl.textContent = data.cantidad || 0;
        })
        .catch(error => console.error('Error cargando mensajes sin leer:', error));
}

function cargarGraficos() {
    cargarGraficoCotizaciones();
    cargarGraficoTrabajos();
    cargarGraficoReparaciones();
    cargarGraficoUsuariosRol();
    cargarGraficoCotizacionesMensuales();
    cargarGraficoIngresosGastosMensuales();
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
}

function cargarGraficoTrabajos() {
    const canvas = document.getElementById('trabajosChart');
    if (!canvas) return;

    fetch('../../controlador/Administrador/dashboard_controller.php?action=tipos_trabajo')
        .then(response => response.json())
        .then(data => {
            const ctx = canvas.getContext('2d');

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
}

function cargarGraficoReparaciones() {
    const canvas = document.getElementById('reparacionesChart');
    if (!canvas) return;

    fetch('../../controlador/Administrador/dashboard_controller.php?action=tipos_reparacion')
        .then(response => response.json())
        .then(data => {
            const ctx = canvas.getContext('2d');

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
}

function cargarGraficoIngresosGastosMensuales() {
    const canvas = document.getElementById('ingresosGastosMensualesChart');
    if (!canvas) return;

    fetch('../../controlador/Administrador/dashboard_controller.php?action=ingresos_gastos')
        .then(response => response.json())
        .then(data => {
            const ctx = canvas.getContext('2d');

            if (ingresosGastosMensualesChart) {
                ingresosGastosMensualesChart.destroy();
                ingresosGastosMensualesChart = null;
            }

            const tipoMostrar = document.getElementById('tipoGraficoIngresosGastos').value;
            const datasets = [];

            if (tipoMostrar === 'todos' || tipoMostrar === 'ingresos') {
                const ingresos = data.filter(item => item.tipo === 'INGRESO');
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
                const salidas = data.filter(item => item.tipo === 'SALIDA');
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
                let balance = 0;
                const balances = [];
                data.forEach(item => {
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

            let labels = [];
            if (tipoMostrar === 'todos') {
                labels = data.map(item => new Date(item.fecha).toLocaleDateString('es-MX'));
            } else if (tipoMostrar === 'ingresos') {
                labels = data.filter(item => item.tipo === 'INGRESO').map(item => new Date(item.fecha).toLocaleDateString('es-MX'));
            } else if (tipoMostrar === 'salidas') {
                labels = data.filter(item => item.tipo === 'SALIDA').map(item => new Date(item.fecha).toLocaleDateString('es-MX'));
            } else if (tipoMostrar === 'balance') {
                labels = data.map(item => new Date(item.fecha).toLocaleDateString('es-MX'));
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
}

function cargarTablas() {
    cargarTablaClientesFrecuentes();
    cargarTablaUbicaciones();
}

function cargarTablaClientesFrecuentes() {
    fetch('../../controlador/Administrador/dashboard_controller.php?action=clientes_frecuentes')
        .then(response => response.json())
        .then(data => {
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
                        'transition': 'background-color 0.2s ease'
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
                    },
                    pagination: {
                        'margin-top': '20px',
                        'padding': '10px 0'
                    }
                },
                columnStyles: {
                    0: { minWidth: '250px' },
                    1: { width: '120px' },
                    2: { width: '150px' },
                    3: { width: '100px' }
                }
            }).render(document.getElementById('clientesFrecuentesTable'));
        })
        .catch(error => console.error('Error cargando tabla de clientes frecuentes:', error));
}

function cargarTablaUbicaciones() {
    fetch('../../controlador/Administrador/dashboard_controller.php?action=distribucion_geografica')
        .then(response => response.json())
        .then(data => {
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
}

function cargarResumenIngresosGastos() {
    fetch('../../controlador/Administrador/dashboard_controller.php?action=resumen_ingresos_gastos')
        .then(response => response.json())
        .then(data => {
            const totalIngresosEl = document.getElementById('totalIngresos');
            if (totalIngresosEl) totalIngresosEl.textContent = '$' + (parseFloat(data.total_ingresos || 0)).toLocaleString('es-MX', {minimumFractionDigits: 2});
            const totalGastosEl = document.getElementById('totalGastos');
            if (totalGastosEl) totalGastosEl.textContent = '$' + (parseFloat(data.total_gastos || 0)).toLocaleString('es-MX', {minimumFractionDigits: 2});
            const balanceTotalEl = document.getElementById('balanceTotal');
            if (balanceTotalEl) {
                balanceTotalEl.textContent = '$' + (parseFloat(data.balance || 0)).toLocaleString('es-MX', {minimumFractionDigits: 2});
                const balance = parseFloat(data.balance || 0);
                if (balance > 0) {
                    balanceTotalEl.style.color = '#28a745';
                } else if (balance < 0) {
                    balanceTotalEl.style.color = '#dc3545';
                } else {
                    balanceTotalEl.style.color = '#17a2b8';
                }
            }
        })
        .catch(error => console.error('Error cargando resumen ingresos/gastos:', error));
}

function cargarTablaIngresosGastos() {
    fetch('../../controlador/Administrador/dashboard_controller.php?action=ingresos_gastos')
        .then(response => response.json())
        .then(data => {
            const gridData = data.map(item => {
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
        })
        .catch(error => console.error('Error cargando tabla ingresos/gastos:', error));
}

// Funciones de traducción
function traducirEstado(estado) {
    const traducciones = {
        'PENDIENTE': 'Pendiente',
        'APROBADA': 'Aprobada',
        'RECHAZADA': 'Rechazada',
        'EN_PROCESO': 'En Proceso',
        'COMPLETADO': 'Completado'
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

// Funciones para el buscador de clientes
let clienteSearchTimeout;
const clienteBuscador = document.getElementById('cliente_buscador');
if (clienteBuscador) {
    clienteBuscador.addEventListener('input', function() {
        clearTimeout(clienteSearchTimeout);
        const query = this.value.trim();

        if (query.length >= 2) {
            clienteSearchTimeout = setTimeout(() => searchClientes(query), 300);
        } else {
            const suggestions = document.getElementById('cliente_suggestions');
            if (suggestions) suggestions.style.display = 'none';
        }
    });
}

async function searchClientes(query) {
    try {
        const response = await fetch(`../../controlador/Administrador/cotizaciones_controller.php?action=getClientesForSearch&q=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (data.success) {
            showClienteSuggestions(data.clientes);
        }
    } catch (error) {
        console.error('Error buscando clientes:', error);
    }
}

function showClienteSuggestions(clientes) {
    const suggestionsDiv = document.getElementById('cliente_suggestions');

    if (clientes.length === 0) {
        suggestionsDiv.style.display = 'none';
        return;
    }

    suggestionsDiv.innerHTML = '';
    clientes.forEach(cliente => {
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        div.innerHTML = `
            <div class="suggestion-info">
                <strong>${cliente.nombres} ${cliente.apellidos}</strong>
                <br><small>${cliente.correo_electronico} | ${cliente.numero_telefono || 'Sin teléfono'}</small>
            </div>
        `;
        div.onclick = () => selectCliente(cliente);
        suggestionsDiv.appendChild(div);
    });

    suggestionsDiv.style.display = 'block';
}

function selectCliente(cliente) {
    document.getElementById('id_usuario_cotizacion').value = cliente.id_usuario;
    document.getElementById('cliente_buscador').value = `${cliente.nombres} ${cliente.apellidos}`;
    document.getElementById('nombre_completo').value = `${cliente.nombres} ${cliente.apellidos}`;
    document.getElementById('correo_electronico').value = cliente.correo_electronico;
    document.getElementById('telefono').value = cliente.numero_telefono || '';
    document.getElementById('direccion').value = cliente.direccion || '';

    document.getElementById('cliente_suggestions').style.display = 'none';
}

// Funciones adicionales del dashboard
function editarIngresoGasto(id) {
    // Implementar edición de ingreso/gasto
    console.log('Editar ingreso/gasto:', id);
}

function eliminarIngresoGasto(id) {
    // Implementar eliminación de ingreso/gasto
    console.log('Eliminar ingreso/gasto:', id);
}

function actualizarDashboard() {
    cargarDashboard();
}

function cambiarTipoGraficoCotizaciones() {
    cargarGraficoCotizaciones();
}

function cambiarTipoGraficoIngresosGastos() {
    cargarGraficoIngresosGastosMensuales();
}

function cambiarPeriodoCotizaciones() {
    const periodo = document.getElementById('periodoCotizaciones').value;
    const fechaPersonalizada = document.getElementById('fechaPersonalizadaCotizaciones');

    filtrosActuales.periodo = periodo;

    if (periodo === 'personalizado') {
        fechaPersonalizada.style.display = 'flex';
        // No aplicar filtros automáticamente, esperar a que el usuario seleccione fechas
    } else {
        fechaPersonalizada.style.display = 'none';
        aplicarFiltrosCotizaciones();
    }
}

function aplicarFiltrosCotizaciones() {
    const periodo = filtrosActuales.periodo;
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
            fechaInicio = document.getElementById('fechaInicioCotizaciones').value;
            fechaFin = document.getElementById('fechaFinCotizaciones').value;
            if (!fechaInicio || !fechaFin) {
                return; // No aplicar si no hay fechas
            }
            break;
    }

    filtrosActuales.fechaInicio = fechaInicio;
    filtrosActuales.fechaFin = fechaFin;

    cargarGraficoCotizaciones();
}

function cambiarPeriodoIngresosGastos() {
    const periodo = document.getElementById('periodoIngresosGastos').value;
    const fechaPersonalizada = document.getElementById('fechaPersonalizadaIngresosGastos');

    if (periodo === 'personalizado') {
        fechaPersonalizada.style.display = 'flex';
        // No aplicar filtros automáticamente, esperar a que el usuario seleccione fechas
    } else {
        fechaPersonalizada.style.display = 'none';
        aplicarFiltrosIngresosGastos();
    }
}

function aplicarFiltrosIngresosGastos() {
    const periodo = document.getElementById('periodoIngresosGastos').value;
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

    // Aplicar filtros a los gráficos
    cargarGraficoIngresosGastosMensuales();
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function () {
    initializeData();

    // Responsive sidebar
    function handleResize() {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.querySelector('.main-content');

        if (window.innerWidth <= 992) {
            sidebar.classList.add('hidden');
            mainContent.classList.add('expanded');
        } else {
            sidebar.classList.remove('hidden');
            mainContent.classList.remove('expanded');
        }
    }

    window.addEventListener('resize', handleResize);
    handleResize();
});}