// Módulo de Cotizaciones Pendientes - Administrador
let cotizacionesPendientesData = [];

// Variable para el filtro actual - por defecto muestra solo pendientes
let filtroEstadoActual = 'PENDIENTE';

// Función para inicializar el módulo de cotizaciones pendientes
function initializeCotizacionesPendientes() {
    // Establecer el filtro por defecto en el select
    const filtroSelect = document.getElementById('estadoFiltroCotizacionesPendientes');
    if (filtroSelect) {
        filtroSelect.value = 'PENDIENTE';
    }
    cargarCotizacionesPendientes();
}

// Función para cargar cotizaciones pendientes
function cargarCotizacionesPendientes() {
    return fetch('../../controlador/Administrador/cotizaciones_pendientes_controller.php?accion=obtener_todas')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                cotizacionesPendientesData = data.cotizaciones;
                mostrarTablaCotizacionesPendientes();
            } else {
                Swal.fire('Error', data.message || 'Error al cargar cotizaciones', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire('Error', 'Error de conexión', 'error');
        });
}

// Función para filtrar por estado
function filtrarPorEstado() {
    filtroEstadoActual = document.getElementById('estadoFiltroCotizacionesPendientes').value;
    mostrarTablaCotizacionesPendientes();
}

// Función para filtrar por búsqueda
function filtrarBusqueda() {
    terminoBusquedaActual = document.getElementById('buscadorCotizacionesPendientes').value;
    mostrarTablaCotizacionesPendientes();
}

// Variable para el término de búsqueda actual
let terminoBusquedaActual = '';

// Función para mostrar la tabla de cotizaciones pendientes
function mostrarTablaCotizacionesPendientes() {
    const container = document.getElementById('cotizacionesPendientesTable');
    if (!container) return;

    // Limpiar el contenedor antes de renderizar
    container.innerHTML = '';

    // Aplicar filtros: estado y búsqueda
    let datosFiltrados = cotizacionesPendientesData;

    // Filtrar por estado
    if (filtroEstadoActual !== 'todos') {
        datosFiltrados = datosFiltrados.filter(cot => cot.estado === filtroEstadoActual);
    }

    // Filtrar por búsqueda
    if (terminoBusquedaActual.trim() !== '') {
        const termino = terminoBusquedaActual.toLowerCase();
        datosFiltrados = datosFiltrados.filter(cot =>
            cot.nombre.toLowerCase().includes(termino) ||
            cot.email.toLowerCase().includes(termino) ||
            cot.servicio.toLowerCase().includes(termino)
        );
    }

    // Crear tabla HTML manualmente para mejor control
    let tablaHTML = `
        <table class="custom-table">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                    <th>Servicio</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
    `;

    if (datosFiltrados.length === 0) {
        tablaHTML += `
            <tr>
                <td colspan="6" class="no-data">
                    <i class="fas fa-inbox"></i>
                    <p>No se encontraron cotizaciones ${filtroEstadoActual !== 'todos' ? 'con el estado seleccionado' : ''}</p>
                </td>
            </tr>
        `;
    } else {
        datosFiltrados.forEach(cot => {
            tablaHTML += `
                <tr>
                    <td>${cot.nombre}</td>
                    <td>${cot.email}</td>
                    <td>${cot.telefono}</td>
                    <td>${cot.servicio}</td>
                    <td><span class="estado-badge estado-${cot.estado.toLowerCase().replace(/\s+/g, '_')}">${cot.estado}</span></td>
                    <td>
                        <div class="table-actions">
                            <select class="estado-select" onchange="cambiarEstadoCotizacionPendiente(${cot.id}, this.value)">
                                <option value="" disabled ${cot.estado === 'PENDIENTE' ? 'selected' : ''}>Cambiar estado</option>
                                <option value="APROBADA">✓ Aprobar</option>
                                <option value="RECHAZADA">✗ Rechazar</option>
                            </select>
                            <button class="action-btn btn-view" onclick="verCotizacionPendiente(${cot.id})" title="Ver información completa">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="action-btn btn-delete" onclick="eliminarCotizacion(${cot.id})" title="Eliminar cotización">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });
    }

    tablaHTML += `
            </tbody>
        </table>
    `;

    container.innerHTML = tablaHTML;
}

// Función para cambiar estado de cotización pendiente
function cambiarEstadoCotizacionPendiente(idCotizacion, nuevoEstado) {
    if (!nuevoEstado) return; // Si no hay estado seleccionado, salir

    if (nuevoEstado === 'APROBADA') {
        // Para aprobación, mostrar modal de confirmación de envío de credenciales
        mostrarModalConfirmacionCredenciales(idCotizacion);
    } else {
        // Para otros estados, proceder normalmente
        const estadoTexto = 'rechazar';

        Swal.fire({
            title: `¿${estadoTexto.charAt(0).toUpperCase() + estadoTexto.slice(1)} cotización?`,
            text: `¿Estás seguro de ${estadoTexto} esta cotización?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: `Sí, ${estadoTexto}`,
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch('../../controlador/Administrador/cotizaciones_pendientes_controller.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json; charset=utf-8' },
                    body: JSON.stringify({
                        accion: 'actualizar_estado',
                        id: idCotizacion,
                        estado: nuevoEstado
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Estado actualizado',
                            text: `La cotización ha sido rechazada correctamente.`,
                            timer: 1500,
                            showConfirmButton: false
                        });
                        cargarCotizacionesPendientes();
                    } else {
                        Swal.fire('Error', data.message || 'Error al actualizar estado', 'error');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    Swal.fire('Error', 'Error de conexión', 'error');
                });
            }
        });
    }
}

// Función para mostrar modal de confirmación de envío de credenciales
function mostrarModalConfirmacionCredenciales(idCotizacion) {
    // Obtener datos de la cotización para mostrar el email
    fetch(`../../controlador/Administrador/cotizaciones_pendientes_controller.php?accion=obtener_cotizacion&id=${idCotizacion}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const cotizacion = data.cotizacion;
                const email = cotizacion.email;

                // Mostrar modal personalizado con el email y botón de enviar credenciales
                const modal = document.createElement('div');
                modal.className = 'modal active';
                modal.innerHTML = `
                    <div class="modal-content" style="max-width: 500px; border-radius: 15px; box-shadow: 0 10px 40px rgba(0,0,0,0.3);">
                        <div class="modal-header" style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; border-radius: 15px 15px 0 0; padding: 20px;">
                            <h3 style="margin: 0; font-size: 1.5rem;"><i class="fas fa-envelope"></i> Confirmar Envío de Credenciales</h3>
                            <button class="modal-close" onclick="this.closest('.modal').remove()" style="color: white; font-size: 1.5rem; background: none; border: none;">&times;</button>
                        </div>
                        <div class="modal-body" style="padding: 30px; background: #f8f9fa;">
                            <div class="text-center mb-4">
                                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #28a745 0%, #20c997 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);">
                                    <i class="fas fa-user-plus fa-2x" style="color: white;"></i>
                                </div>
                                <h4 style="color: #333; margin-bottom: 10px; font-weight: 600;">¿Enviar credenciales al cliente?</h4>
                                <p style="color: #666; font-size: 0.95rem; line-height: 1.5;">Al confirmar, se aprobará la cotización, se creará una cuenta de usuario y se enviarán las credenciales por correo electrónico.</p>
                            </div>
                            <div style="background: white; padding: 20px; border-radius: 10px; border-left: 4px solid #28a745; margin-bottom: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                                <div style="display: flex; align-items: center;">
                                    <i class="fas fa-envelope" style="color: #28a745; margin-right: 10px; font-size: 1.2rem;"></i>
                                    <div>
                                        <strong style="color: #333;">Correo del cliente:</strong><br>
                                        <span style="color: #666; font-weight: 500;">${email}</span>
                                    </div>
                                </div>
                            </div>
                            <div style="background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); padding: 15px; border-radius: 10px; border-left: 4px solid #ffc107;">
                                <div style="display: flex; align-items: flex-start;">
                                    <i class="fas fa-info-circle" style="color: #856404; margin-right: 10px; margin-top: 2px;"></i>
                                    <div>
                                        <strong style="color: #856404;">Nota importante:</strong>
                                        <p style="margin: 5px 0 0 0; color: #856404; font-size: 0.9rem;">Se generarán credenciales automáticamente y se enviarán al correo especificado.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer" style="padding: 20px 30px; background: white; border-radius: 0 0 15px 15px; display: flex; justify-content: space-between;">
                            <button type="button" class="btn btn-outline" onclick="this.closest('.modal').remove()" style="padding: 10px 20px; border-radius: 8px; border: 2px solid #6c757d; color: #6c757d; font-weight: 500;">
                                <i class="fas fa-times"></i> Cancelar
                            </button>
                            <button type="button" class="btn btn-success" onclick="aprobarYCreaUsuario(${idCotizacion}); this.closest('.modal').remove()" style="padding: 10px 25px; border-radius: 8px; background: linear-gradient(135deg, #28a745 0%, #20c997 100%); border: none; color: white; font-weight: 600; box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);">
                                <i class="fas fa-paper-plane"></i> Enviar Credenciales
                            </button>
                        </div>
                    </div>
                `;
                document.body.appendChild(modal);
            } else {
                Swal.fire('Error', data.message || 'Error al cargar cotización', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire('Error', 'Error de conexión', 'error');
        });
}

// Función para aprobar cotización y crear usuario
function aprobarYCreaUsuario(idCotizacion) {
    fetch('../../controlador/Administrador/cotizaciones_pendientes_controller.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
            accion: 'aprobar_y_crear_usuario',
            id: idCotizacion
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            let mensaje = data.message;
            if (data.warning) {
                mensaje += ' (Correo no enviado)';
            }

            Swal.fire({
                icon: data.warning ? 'warning' : 'success',
                title: 'Operación Completada',
                text: mensaje,
                timer: 3000,
                showConfirmButton: false
            });

            // Recargar datos
            cargarCotizacionesPendientes();
        } else {
            Swal.fire('Error', data.message || 'Error en la operación', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire('Error', 'Error de conexión', 'error');
    });
}

// Función para eliminar cotización
function eliminarCotizacion(idCotizacion) {
    Swal.fire({
        title: '¿Eliminar cotización?',
        text: '¿Estás seguro de eliminar esta cotización? Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch('../../controlador/Administrador/cotizaciones_pendientes_controller.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json; charset=utf-8' },
                body: JSON.stringify({
                    accion: 'eliminar_cotizacion',
                    id: idCotizacion
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Eliminada',
                        text: 'La cotización ha sido eliminada exitosamente.',
                        timer: 1500,
                        showConfirmButton: false
                    });
                    cargarCotizacionesPendientes();
                } else {
                    Swal.fire('Error', data.message || 'Error al eliminar cotización', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire('Error', 'Error de conexión', 'error');
            });
        }
    });
}

// Función para ver detalles de una cotización pendiente
function verCotizacionPendiente(idCotizacion) {
    fetch(`../../controlador/Administrador/cotizaciones_pendientes_controller.php?accion=obtener_cotizacion&id=${idCotizacion}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                mostrarDetalleCotizacionPendiente(data.cotizacion);
            } else {
                Swal.fire('Error', data.message || 'Error al cargar cotización', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire('Error', 'Error de conexión', 'error');
        });
}

// Función para mostrar detalle de cotización pendiente
function mostrarDetalleCotizacionPendiente(cotizacion) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content large-modal">
            <div class="modal-header">
                <h3><i class="fas fa-file-invoice-dollar"></i> Información Completa - Cotización #${cotizacion.id}</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="cotizacion-detail-header">
                    <div class="detail-status">
                        <span class="estado-badge estado-${cotizacion.estado.toLowerCase().replace(/\s+/g, '_')}">${cotizacion.estado}</span>
                    </div>
                    <div class="detail-date">
                        <i class="fas fa-calendar-alt"></i>
                        ${new Date(cotizacion.fecha).toLocaleDateString('es-MX', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </div>
                </div>

                <div class="detail-section">
                    <h4><i class="fas fa-user"></i> Información del Cliente</h4>
                    <div class="info-grid">
                        <div class="info-item">
                            <label><i class="fas fa-user-circle"></i> Nombre Completo:</label>
                            <span>${cotizacion.nombre}</span>
                        </div>
                        <div class="info-item">
                            <label><i class="fas fa-envelope"></i> Correo Electrónico:</label>
                            <span>${cotizacion.email}</span>
                        </div>
                        <div class="info-item">
                            <label><i class="fas fa-phone"></i> Teléfono:</label>
                            <span>${cotizacion.telefono}</span>
                        </div>
                        <div class="info-item">
                            <label><i class="fas fa-tools"></i> Servicio Solicitado:</label>
                            <span>${cotizacion.servicio}</span>
                        </div>
                    </div>
                </div>

                <div class="detail-section">
                    <h4><i class="fas fa-comment-dots"></i> Mensaje del Cliente</h4>
                    <div class="mensaje-container">
                        <p>${cotizacion.mensaje.replace(/\n/g, '<br>')}</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <div class="modal-actions">
                    <button class="btn btn-outline" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i> Cerrar
                    </button>
                    <div class="quick-actions">
                        <button class="btn btn-success" onclick="cambiarEstadoRapido(${cotizacion.id}, 'APROBADA', this.closest('.modal'))">
                            <i class="fas fa-check"></i> Aprobar
                        </button>
                        <button class="btn btn-danger" onclick="cambiarEstadoRapido(${cotizacion.id}, 'RECHAZADA', this.closest('.modal'))">
                            <i class="fas fa-times"></i> Rechazar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Función para cambiar estado rápidamente desde el modal
function cambiarEstadoRapido(id, estado, modal) {
    if (estado === 'APROBADA') {
        // Para aprobación desde modal, mostrar confirmación de credenciales
        modal.remove(); // Cerrar modal actual
        mostrarModalConfirmacionCredenciales(id);
    } else {
        // Para rechazo, proceder normalmente
        Swal.fire({
            title: '¿Rechazar cotización?',
            text: '¿Estás seguro de rechazar esta cotización?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, rechazar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch('../../controlador/Administrador/cotizaciones_pendientes_controller.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json; charset=utf-8' },
                    body: JSON.stringify({
                        accion: 'actualizar_estado',
                        id: id,
                        estado: estado
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Estado actualizado',
                            text: 'La cotización ha sido rechazada correctamente.',
                            timer: 2000,
                            showConfirmButton: false
                        });
                        modal.remove();
                        cargarCotizacionesPendientes();
                    } else {
                        Swal.fire('Error', data.message || 'Error al actualizar estado', 'error');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    Swal.fire('Error', 'Error de conexión', 'error');
                });
            }
        });
    }
}

// Función para filtrar cotizaciones pendientes (ahora solo actualiza la búsqueda de Grid.js)
function filtrarCotizacionesPendientes() {
    // La búsqueda se maneja automáticamente por Grid.js
    // Esta función puede mantenerse por compatibilidad pero no hace nada específico
}

// Función para enviar credenciales por correo
function enviarCredencialesPorCorreo(codigo_usuario, contrasena, email) {
    fetch('../../controlador/Administrador/cotizaciones_pendientes_controller.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
            accion: 'enviar_credenciales',
            codigo_usuario: codigo_usuario,
            contrasena: contrasena,
            email: email
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire({
                icon: 'success',
                title: 'Credenciales Enviadas',
                text: 'Las credenciales han sido enviadas al correo del cliente.',
                timer: 2000,
                showConfirmButton: false
            });
        } else {
            Swal.fire('Error', data.message || 'Error al enviar credenciales', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire('Error', 'Error de conexión al enviar credenciales', 'error');
    });
}

// Función para actualizar cotizaciones pendientes
function actualizarCotizacionesPendientes() {
    // Mostrar indicador de carga
    const btnActualizar = document.querySelector('button[onclick="actualizarCotizacionesPendientes()"]');
    if (btnActualizar) {
        const originalHTML = btnActualizar.innerHTML;
        btnActualizar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Actualizando...';
        btnActualizar.disabled = true;

        // Recargar datos
        cargarCotizacionesPendientes().finally(() => {
            // Restaurar botón después de completar
            setTimeout(() => {
                btnActualizar.innerHTML = originalHTML;
                btnActualizar.disabled = false;

                // Mostrar mensaje de éxito
                Swal.fire({
                    icon: 'success',
                    title: 'Datos Actualizados',
                    text: 'Las cotizaciones han sido actualizadas correctamente.',
                    timer: 1500,
                    showConfirmButton: false
                });
            }, 500);
        });
    } else {
        // Si no encuentra el botón, solo recargar
        cargarCotizacionesPendientes();
    }
}