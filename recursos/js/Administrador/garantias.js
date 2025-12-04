// Módulo de Gestión de Garantías - Administrador
let garantiasData = [];
let garantiaActual = null;
let currentSearch = '';
let currentStatus = 'todos';

// Función para cargar garantías
function cargarGarantias() {
    fetch('../../controlador/Administrador/garantias_controller.php?action=getGarantias')
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data)) {
                garantiasData = data;
                currentSearch = '';
                currentStatus = 'todos';
                applyFilters();
            } else {
                Swal.fire('Error', data.error || 'Error al cargar garantías', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire('Error', 'Error de conexión', 'error');
        });
}

// Función para mostrar lista de garantías
function mostrarListaGarantias() {
    const container = document.getElementById('garantiasList');
    if (!container) return;

    const html = garantiasData.map(garantia => `
        <div class="garantia-card">
            <div class="card-header">
                <div class="card-id">#${garantia.id_garantia}</div>
                <div class="card-status">
                    <span class="estado-badge estado-${garantia.estado.toLowerCase()}">${garantia.estado}</span>
                </div>
            </div>
            <div class="card-body">
                <div class="card-info">
                    <div class="info-item">
                        <i class="fas fa-user"></i>
                        <span>${garantia.nombres} ${garantia.apellidos}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-bicycle"></i>
                        <span>${garantia.marca_bicicleta} ${garantia.modelo_bicicleta}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-calendar"></i>
                        <span>Vence: ${new Date(garantia.fecha_fin).toLocaleDateString()}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-shield-alt"></i>
                        <span>${garantia.tipo_garantia} - ${garantia.cobertura}</span>
                    </div>
                </div>
            </div>
            <div class="card-actions">
                <button class="btn btn-primary" onclick="verGarantia(${garantia.id_garantia})">
                    <i class="fas fa-eye"></i> Ver Detalles
                </button>
                <button class="btn btn-secondary" onclick="editarGarantia(${garantia.id_garantia})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <select class="estado-select" onchange="cambiarEstadoGarantia(${garantia.id_garantia}, this.value)">
                    <option value="">Cambiar Estado</option>
                    <option value="activa">Activa</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="reclamada">Reclamada</option>
                    <option value="cancelada">Cancelada</option>
                </select>
            </div>
        </div>
    `).join('');
    container.innerHTML = html;
}

// Función para aplicar filtros combinados
function applyFilters() {
    let filtered = garantiasData;
    if (currentSearch) {
        filtered = filtered.filter(garantia =>
            garantia.nombres.toLowerCase().includes(currentSearch) ||
            garantia.apellidos.toLowerCase().includes(currentSearch) ||
            garantia.marca_bicicleta.toLowerCase().includes(currentSearch) ||
            garantia.modelo_bicicleta.toLowerCase().includes(currentSearch) ||
            garantia.id_garantia.toString().includes(currentSearch)
        );
    }
    if (currentStatus !== 'todos') {
        filtered = filtered.filter(garantia => garantia.estado === currentStatus);
    }
    mostrarListaGarantiasFiltrada(filtered);
}

// Función para ver detalles de garantía
function verGarantia(id) {
    fetch(`../../controlador/Administrador/garantias_controller.php?action=getGarantia&id=${id}`)
        .then(response => response.json())
        .then(data => {
            if (data) {
                mostrarDetalleGarantia(data);
            } else {
                Swal.fire('Error', 'Error al cargar garantía', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire('Error', 'Error de conexión', 'error');
        });
}

// Función para editar garantía
function editarGarantia(id) {
    fetch(`../../controlador/Administrador/garantias_controller.php?action=getGarantia&id=${id}`)
        .then(response => response.json())
        .then(data => {
            if (data) {
                garantiaActual = data;
                openEditarGarantiaModal();
            } else {
                Swal.fire('Error', 'Error al cargar garantía', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire('Error', 'Error de conexión', 'error');
        });
}

// Función para mostrar detalle de garantía
function mostrarDetalleGarantia(garantia) {
    garantiaActual = garantia;
    Swal.fire({
        title: `Garantía #${garantia.id_garantia}`,
        html: `
            <div style="text-align: left; max-height: 400px; overflow-y: auto;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                    <div style="background: #f0f8ff; padding: 12px; border-radius: 8px; border-left: 4px solid #1a1a1a;">
                        <h4 style="margin: 0 0 10px 0; color: #1a1a1a; font-size: 14px;">Información del Cliente</h4>
                        <p style="margin: 5px 0; font-size: 13px;"><strong>Cliente:</strong> ${garantia.nombres} ${garantia.apellidos}</p>
                        <p style="margin: 5px 0; font-size: 13px;"><strong>Bicicleta:</strong> ${garantia.marca_bicicleta} ${garantia.modelo_bicicleta}</p>
                        <p style="margin: 5px 0; font-size: 13px;"><strong>Zona Afectada:</strong> ${garantia.zona_afectada}</p>
                    </div>
                    <div style="background: #fff0f5; padding: 12px; border-radius: 8px; border-left: 4px solid #dc3545;">
                        <h4 style="margin: 0 0 10px 0; color: #dc3545; font-size: 14px;">Detalles de la Garantía</h4>
                        <p style="margin: 5px 0; font-size: 13px;"><strong>Tipo:</strong> ${garantia.tipo_garantia}</p>
                        <p style="margin: 5px 0; font-size: 13px;"><strong>Cobertura:</strong> ${garantia.cobertura}</p>
                        <p style="margin: 5px 0; font-size: 13px;"><strong>Estado:</strong> ${garantia.estado}</p>
                    </div>
                </div>
                <div style="background: #f5f5f5; padding: 12px; border-radius: 8px; border-left: 4px solid #17a2b8;">
                    <h4 style="margin: 0 0 10px 0; color: #17a2b8; font-size: 14px;">Fechas</h4>
                    <p style="margin: 5px 0; font-size: 13px;"><strong>Inicio:</strong> ${new Date(garantia.fecha_inicio).toLocaleDateString('es-MX')}</p>
                    <p style="margin: 5px 0; font-size: 13px;"><strong>Fin:</strong> ${new Date(garantia.fecha_fin).toLocaleDateString('es-MX')}</p>
                    <p style="margin: 5px 0; font-size: 13px;"><strong>Creada:</strong> ${new Date(garantia.creado_en).toLocaleDateString('es-MX')}</p>
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonColor: '#1a1a1a',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Editar Garantía',
        cancelButtonText: 'Cerrar',
        width: '700px'
    }).then((result) => {
        if (result.isConfirmed) {
            openEditarGarantiaModal();
        }
    });
}

// Función para cambiar estado de garantía
function cambiarEstadoGarantia(id, estado) {
    if (!estado) return;

    fetch(`../../controlador/Administrador/garantias_controller.php?action=updateEstado&id=${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: estado })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire('Éxito', 'Estado de garantía actualizado correctamente', 'success');
            cargarGarantias();
        } else {
            Swal.fire('Error', data.error || 'Error al actualizar estado', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire('Error', 'Error de conexión', 'error');
    });
}

// Función para abrir modal de nueva garantía
function openNuevaGarantiaModal() {
    // Cargar servicios completados
    fetch('../../controlador/Administrador/garantias_controller.php?action=getServiciosCompletados')
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById('id_cotizacion_garantia');
            select.innerHTML = '<option value="">Seleccionar servicio completado</option>';
            data.forEach(servicio => {
                select.innerHTML += `<option value="${servicio.id_cotizacion}">${servicio.nombre_completo} - ${servicio.marca_bicicleta} ${servicio.modelo_bicicleta} (${servicio.zona_afectada})</option>`;
            });
            document.getElementById('nuevaGarantiaModal').classList.add('active');
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire('Error', 'Error al cargar servicios completados', 'error');
        });
}

// Función para cerrar modal de nueva garantía
function closeNuevaGarantiaModal() {
    document.getElementById('nuevaGarantiaModal').classList.remove('active');
    document.getElementById('nuevaGarantiaForm').reset();
}

// Función para guardar nueva garantía
function saveNuevaGarantia() {
    const formData = {
        id_cotizacion: document.getElementById('id_cotizacion_garantia').value,
        tipo_garantia: document.getElementById('tipo_garantia').value,
        cobertura: document.getElementById('cobertura').value,
        fecha_inicio: document.getElementById('fecha_inicio').value,
        fecha_fin: document.getElementById('fecha_fin').value
    };

    if (!formData.id_cotizacion || !formData.tipo_garantia || !formData.cobertura || !formData.fecha_inicio || !formData.fecha_fin) {
        Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
        return;
    }

    fetch('../../controlador/Administrador/garantias_controller.php?action=createGarantia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire('Éxito', 'Garantía creada correctamente', 'success');
            closeNuevaGarantiaModal();
            cargarGarantias();
        } else {
            Swal.fire('Error', data.error || 'Error al crear garantía', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire('Error', 'Error de conexión', 'error');
    });
}

// Función para abrir modal de editar garantía
function openEditarGarantiaModal() {
    if (!garantiaActual) return;

    document.getElementById('editTipoGarantia').value = garantiaActual.tipo_garantia;
    document.getElementById('editCobertura').value = garantiaActual.cobertura;
    document.getElementById('editFechaInicio').value = garantiaActual.fecha_inicio.split(' ')[0];
    document.getElementById('editFechaFin').value = garantiaActual.fecha_fin.split(' ')[0];
    document.getElementById('editEstado').value = garantiaActual.estado;

    document.getElementById('editarGarantiaModal').classList.add('active');
}

// Función para cerrar modal de editar garantía
function closeEditarGarantiaModal() {
    document.getElementById('editarGarantiaModal').classList.remove('active');
    garantiaActual = null;
}

// Función para guardar edición de garantía
function saveEditarGarantia() {
    if (!garantiaActual) return;

    const formData = {
        tipo_garantia: document.getElementById('editTipoGarantia').value,
        cobertura: document.getElementById('editCobertura').value,
        fecha_inicio: document.getElementById('editFechaInicio').value,
        fecha_fin: document.getElementById('editFechaFin').value,
        estado: document.getElementById('editEstado').value
    };

    if (!formData.tipo_garantia || !formData.cobertura || !formData.fecha_inicio || !formData.fecha_fin || !formData.estado) {
        Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
        return;
    }

    fetch(`../../controlador/Administrador/garantias_controller.php?action=updateGarantia&id=${garantiaActual.id_garantia}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire('Éxito', 'Garantía actualizada correctamente', 'success');
            closeEditarGarantiaModal();
            cargarGarantias();
        } else {
            Swal.fire('Error', data.error || 'Error al actualizar garantía', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire('Error', 'Error de conexión', 'error');
    });
}

// Función para filtrar garantías
function filtrarGarantias() {
    currentSearch = document.getElementById('buscadorGarantias').value.toLowerCase();
    applyFilters();
}

// Función para filtrar por estado
function filtrarGarantiasPorEstado() {
    currentStatus = document.getElementById('estadoFiltroGarantias').value;
    applyFilters();
}

// Función auxiliar para mostrar lista filtrada
function mostrarListaGarantiasFiltrada(data) {
    const container = document.getElementById('garantiasList');
    if (!container) return;

    const html = data.map(garantia => `
        <div class="garantia-card">
            <div class="card-header">
                <div class="card-id">#${garantia.id_garantia}</div>
                <div class="card-status">
                    <span class="estado-badge estado-${garantia.estado.toLowerCase()}">${garantia.estado}</span>
                </div>
            </div>
            <div class="card-body">
                <div class="card-info">
                    <div class="info-item">
                        <i class="fas fa-user"></i>
                        <span>${garantia.nombres} ${garantia.apellidos}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-bicycle"></i>
                        <span>${garantia.marca_bicicleta} ${garantia.modelo_bicicleta}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-calendar"></i>
                        <span>Vence: ${new Date(garantia.fecha_fin).toLocaleDateString()}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-shield-alt"></i>
                        <span>${garantia.tipo_garantia} - ${garantia.cobertura}</span>
                    </div>
                </div>
            </div>
            <div class="card-actions">
                <button class="btn btn-primary" onclick="verGarantia(${garantia.id_garantia})">
                    <i class="fas fa-eye"></i> Ver Detalles
                </button>
                <select class="estado-select" onchange="cambiarEstadoGarantia(${garantia.id_garantia}, this.value)">
                    <option value="">Cambiar Estado</option>
                     <option value="activa">Activa</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="reclamada">Reclamada</option>
                    <option value="cancelada">Cancelada</option>
                </select>
            </div>
        </div>
    `).join('');
    container.innerHTML = html;
}

// Función para calcular fecha fin en nueva garantía
function calcularFechaFin() {
    const fechaInicio = document.getElementById('fecha_inicio').value;
    const duracion = document.getElementById('duracion_garantia').value;
    if (fechaInicio && duracion) {
        const fecha = new Date(fechaInicio);
        switch (duracion) {
            case '1_mes':
                fecha.setMonth(fecha.getMonth() + 1);
                break;
            case '3_meses':
                fecha.setMonth(fecha.getMonth() + 3);
                break;
            case '6_meses':
                fecha.setMonth(fecha.getMonth() + 6);
                break;
            case '1_año':
                fecha.setFullYear(fecha.getFullYear() + 1);
                break;
            case '2_años':
                fecha.setFullYear(fecha.getFullYear() + 2);
                break;
            case '3_años':
                fecha.setFullYear(fecha.getFullYear() + 3);
                break;
        }
        document.getElementById('fecha_fin').value = fecha.toISOString().split('T')[0];
    }
}

// Función para calcular fecha fin en editar garantía
function calcularFechaFinEdit() {
    const fechaInicio = document.getElementById('editFechaInicio').value;
    const duracion = document.getElementById('editDuracionGarantia').value;
    if (fechaInicio && duracion) {
        const fecha = new Date(fechaInicio);
        switch (duracion) {
            case '1_mes':
                fecha.setMonth(fecha.getMonth() + 1);
                break;
            case '3_meses':
                fecha.setMonth(fecha.getMonth() + 3);
                break;
            case '6_meses':
                fecha.setMonth(fecha.getMonth() + 6);
                break;
            case '1_año':
                fecha.setFullYear(fecha.getFullYear() + 1);
                break;
            case '2_años':
                fecha.setFullYear(fecha.getFullYear() + 2);
                break;
            case '3_años':
                fecha.setFullYear(fecha.getFullYear() + 3);
                break;
        }
        document.getElementById('editFechaFin').value = fecha.toISOString().split('T')[0];
    }
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Se llamará desde administrador.js cuando se active la sección
});

// Función para inicializar el módulo de garantías
function initializeGarantias() {
    cargarGarantias();
}