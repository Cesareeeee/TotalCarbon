/**
 * Servicios en Proceso del Cliente
 * Archivo: recursos/js/Cliente/ServiciosProceso.js
 * Propósito: Manejar la visualización de servicios en proceso
 */

// Variables globales en español
let serviciosActuales = [];
let servicioSeleccionado = null;

// Pasos del proceso
const PASOS_PROCESO = [
    { paso: 1, nombre: 'Cotización Enviada', icono: 'fas fa-clipboard-check' },
    { paso: 2, nombre: 'Aceptada', icono: 'fas fa-check-circle' },
    { paso: 3, nombre: 'Reparación Iniciada', icono: 'fas fa-wrench' },
    { paso: 4, nombre: 'Pintura', icono: 'fas fa-paint-brush' },
    { paso: 5, nombre: 'Empacado', icono: 'fas fa-box' },
    { paso: 6, nombre: 'Enviado', icono: 'fas fa-truck' },
    { paso: 7, nombre: 'Completado', icono: 'fas fa-flag-checkered' }
];

// Variable para controlar el polling
let pollingInterval = null;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    cargarServiciosProceso();

    // Iniciar polling automático para actualizaciones en tiempo real
    iniciarPollingServicios();

    // Inicializar filtro de servicios
    const filtroEstadoServicios = document.getElementById('filtroEstadoServicios');
    if (filtroEstadoServicios) {
        filtroEstadoServicios.addEventListener('change', function() {
            filtrarServiciosProceso(this.value);
        });
    }
});

/**
 * Carga todos los servicios en proceso del usuario
 */
function cargarServiciosProceso() {

    fetch('../../controlador/Cliente/obtener_servicios_proceso.php')
    .then(respuesta => {
        return respuesta.json();
    })
    .then(datos => {

        if (datos.exito && datos.servicios) {
            serviciosActuales = datos.servicios;
            mostrarListaServicios(datos.servicios);
        } else if (datos.servicios && datos.servicios.length === 0) {
            mostrarMensajeVacio();
        } else {
            console.error('ERROR:', datos.mensaje);
            Swal.fire('Error', datos.mensaje || 'Error al cargar servicios', 'error');
        }
    })
    .catch(error => {
        console.error('ERROR de conexión:', error);
        Swal.fire('Error', 'Error de conexión: ' + error.message, 'error');
    })
    .finally(() => {
    });
}

// Función global para recargar servicios desde otros módulos
window.cargarServiciosProceso = cargarServiciosProceso;

/**
 * Inicia el polling automático para verificar cambios en los servicios
 */
function iniciarPollingServicios() {

    // Verificar cada 30 segundos si hay cambios
    pollingInterval = setInterval(() => {
        verificarCambiosServicios();
    }, 30000); // 30 segundos

}

/**
 * Detiene el polling automático
 */
function detenerPollingServicios() {
    if (pollingInterval) {
        clearInterval(pollingInterval);
        pollingInterval = null;
    }
}

/**
 * Verifica si hay cambios en los servicios del usuario
 */
function verificarCambiosServicios() {

    fetch('../../controlador/Cliente/obtener_servicios_proceso.php')
    .then(respuesta => respuesta.json())
    .then(datos => {
        if (datos.exito && datos.servicios) {
            // Comparar con los servicios actuales
            const serviciosNuevos = datos.servicios;
            let hayCambios = false;

            // Verificar si hay cambios en estados o decisiones
            if (serviciosActuales.length !== serviciosNuevos.length) {
                hayCambios = true;
            } else {
                for (let i = 0; i < serviciosActuales.length; i++) {
                    const actual = serviciosActuales[i];
                    const nuevo = serviciosNuevos.find(s => s.id_cotizacion === actual.id_cotizacion);

                    if (nuevo) {
                        // Verificar cambios en estado o decisión de reparaciones
                        if (actual.estado !== nuevo.estado ||
                            actual.reparacion_aceptada_cliente !== nuevo.reparacion_aceptada_cliente) {
                            hayCambios = true;
                            break;
                        }
                    }
                }
            }

            if (hayCambios) {
                serviciosActuales = serviciosNuevos;
                mostrarListaServicios(serviciosNuevos);

                // Si estamos viendo detalles de un servicio, verificar si aún debe mostrarse
                const contenedorDetalles = document.getElementById('detallesServicioProceso');
                if (contenedorDetalles && contenedorDetalles.style.display !== 'none') {
                    // Verificar si el servicio actual aún cumple las condiciones
                    const servicioActual = serviciosNuevos.find(s => s.id_cotizacion == servicioSeleccionado);
                    if (servicioActual) {
                        // Si el servicio ya fue decidido, ocultar los botones
                        if (servicioActual.reparacion_aceptada_cliente !== 'NO_ACEPTADA') {
                            // Recargar los detalles para ocultar los botones
                            mostrarDetallesServicio(servicioSeleccionado);
                        }
                    }
                }
            } else {
            }
        }
    })
    .catch(error => {
        console.error('Error en polling de servicios:', error);
    });
}

/**
 * Muestra una notificación cuando hay actualizaciones automáticas
 */
function mostrarNotificacionActualizacion() {
    // Crear notificación temporal
    const notification = document.createElement('div');
    notification.className = 'notification success show';
    notification.innerHTML = `
        <i class="fas fa-sync-alt"></i>
        <span>Servicios actualizados automáticamente</span>
    `;

    // Agregar al DOM
    const existingNotification = document.getElementById('notification');
    if (existingNotification) {
        existingNotification.appendChild(notification);

        // Remover después de 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }
}

/**
 * Muestra la lista de servicios en proceso
 */
function mostrarListaServicios(servicios) {

    const contenedor = document.getElementById('listaServiciosProceso');
    if (!contenedor) {
        console.error('ERROR: Contenedor de servicios no encontrado');
        return;
    }
    
    contenedor.innerHTML = '';
    
    // Filtrar servicios por estado
    const pendientes = servicios.filter(s => s.estado === 'PENDIENTE');
    const enProceso = servicios.filter(s => s.estado === 'EN_PROCESO' || s.estado === 'APROBADA');
    const completados = servicios.filter(s => s.estado === 'COMPLETADO');
    const rechazados = servicios.filter(s => s.estado === 'RECHAZADA');
    
    // Mostrar secciones
    if (pendientes.length > 0) {
        contenedor.innerHTML += crearSeccionServicios('Pendientes', pendientes, 'pendiente');
    }
    
    if (enProceso.length > 0) {
        contenedor.innerHTML += crearSeccionServicios('En Proceso', enProceso, 'proceso');
    }
    
    if (completados.length > 0) {
        contenedor.innerHTML += crearSeccionServicios('Completados', completados, 'completado');
    }
    
    if (rechazados.length > 0) {
        contenedor.innerHTML += crearSeccionServicios('Rechazados', rechazados, 'rechazado');
    }
    
    if (servicios.length === 0) {
        mostrarMensajeVacio();
    }
}

/**
 * Crea una sección de servicios
 */
function crearSeccionServicios(titulo, servicios, tipo) {

    let html = `<div class="seccion-servicios">
        <h4 class="seccion-titulo">
            <i class="fas fa-${tipo === 'pendiente' ? 'hourglass-start' : tipo === 'proceso' ? 'spinner' : tipo === 'completado' ? 'check-circle' : 'times-circle'}"></i>
            ${titulo} (${servicios.length})
        </h4>
        <div class="servicios-grid">`;
    
    servicios.forEach((servicio, indice) => {
        const estadoClase = `estado-${servicio.estado.toLowerCase().replace('_', '-')}`;
        html += `
            <div class="tarjeta-servicio">
                <div class="tarjeta-encabezado">
                    <div class="tarjeta-info">
                        <h5>${servicio.marca_bicicleta} ${servicio.modelo_bicicleta}</h5>
                        <p class="tarjeta-tipo">${servicio.tipo_trabajo} - ${servicio.tipo_reparacion}</p>
                    </div>
                    <span class="estado-badge ${estadoClase}">
                        ${servicio.estado}
                    </span>
                </div>
                <div class="tarjeta-cuerpo">
                    <div class="tarjeta-meta">
                        <span><i class="fas fa-calendar"></i> ${new Date(servicio.creado_en).toLocaleDateString()}</span>
                        <span><i class="fas fa-images"></i> ${servicio.total_imagenes} imágenes</span>
                        <span><i class="fas fa-comments"></i> ${servicio.total_comentarios} comentarios</span>
                    </div>
                    <p class="tarjeta-zona"><strong>Zona afectada:</strong> ${servicio.zona_afectada}</p>
                </div>
                <div class="tarjeta-pie">
                    <button class="btn btn-primary btn-sm" onclick="verDetallesServicio(${servicios.indexOf(servicio)})">
                        <i class="fas fa-eye"></i> Ver Detalles
                    </button>
                </div>
            </div>
        `;
    });
    
    html += `</div></div>`;
    return html;
}

/**
 * Filtra los servicios en proceso por estado
 */
function filtrarServiciosProceso(estadoFiltro) {

    if (!serviciosActuales || serviciosActuales.length === 0) {
        return;
    }

    let serviciosFiltrados;

    if (estadoFiltro === 'todos') {
        serviciosFiltrados = serviciosActuales;
    } else {
        serviciosFiltrados = serviciosActuales.filter(servicio => servicio.estado === estadoFiltro);
    }

    if (serviciosFiltrados.length === 0) {
        mostrarMensajeVacioFiltro(estadoFiltro);
    } else {
        mostrarListaServicios(serviciosFiltrados);
    }
}

/**
 * Muestra el mensaje cuando no hay servicios para el filtro seleccionado
 */
function mostrarMensajeVacioFiltro(estadoFiltro) {

    const contenedor = document.getElementById('listaServiciosProceso');
    if (!contenedor) {
        console.error('ERROR: Contenedor de servicios no encontrado');
        return;
    }

    const estadoTexto = estadoFiltro === 'todos' ? 'ningún estado' : `estado "${estadoFiltro}"`;

    contenedor.innerHTML = `
        <div class="mensaje-vacio">
            <i class="fas fa-filter fa-3x"></i>
            <h3>No hay servicios</h3>
            <p>No tienes servicios con ${estadoTexto}.</p>
            <button class="btn btn-outline-primary mt-3" onclick="document.getElementById('filtroEstadoServicios').value='todos'; filtrarServiciosProceso('todos');">
                <i class="fas fa-list me-2"></i>Ver todos los servicios
            </button>
        </div>
    `;
}

/**
 * Muestra el mensaje cuando no hay servicios
 */
function mostrarMensajeVacio() {

    const contenedor = document.getElementById('listaServiciosProceso');
    if (!contenedor) {
        console.error('ERROR: Contenedor de servicios no encontrado');
        return;
    }

    contenedor.innerHTML = `
        <div class="mensaje-vacio">
            <i class="fas fa-inbox fa-3x"></i>
            <h3>No tienes servicios en proceso</h3>
            <p>Aún no tienes servicios en proceso. Cuando envíes una cotización, aparecerá aquí.</p>
        </div>
    `;
}

/**
 * Ver detalles de un servicio
 */
function verDetallesServicio(indice) {

    if (indice < 0 || indice >= serviciosActuales.length) {
        console.error('ERROR: Índice de servicio inválido');
        return;
    }

    servicioSeleccionado = serviciosActuales[indice];

    mostrarDetallesServicio(servicioSeleccionado);
}

/**
 * Muestra los detalles completos de un servicio
 */
function mostrarDetallesServicio(servicio) {

    const contenedor = document.getElementById('detallesServicioProceso');
    if (!contenedor) {
        console.error('ERROR: Contenedor de detalles no encontrado');
        return;
    }
    
    const estadoClase = `estado-${servicio.estado.toLowerCase().replace('_', '-')}`;
    const pasoActual = servicio.paso_actual || 1;
    
    // Crear HTML de pasos con barra de progreso visual
    let htmlPasos = '<div class="progreso-container">';
    htmlPasos += '<div class="progreso-header">';
    htmlPasos += `<div class="progreso-titulo">Paso ${pasoActual} de ${PASOS_PROCESO.length}: ${PASOS_PROCESO[pasoActual - 1]?.nombre || 'Desconocido'}</div>`;
    htmlPasos += `<div class="progreso-porcentaje">${Math.round((pasoActual / PASOS_PROCESO.length) * 100)}% Completado</div>`;
    htmlPasos += '</div>';

    // Barra de progreso
    htmlPasos += '<div class="barra-progreso">';
    htmlPasos += '<div class="barra-fondo">';
    htmlPasos += `<div class="barra-llenado" style="width: ${(pasoActual / PASOS_PROCESO.length) * 100}%"></div>`;
    htmlPasos += '</div>';
    htmlPasos += '</div>';

    // Pasos individuales
    htmlPasos += '<div class="pasos-proceso">';
    PASOS_PROCESO.forEach(paso => {
        const activo = paso.paso <= pasoActual ? 'activo' : '';
        const completado = paso.paso < pasoActual ? 'completado' : '';
        const actual = paso.paso === pasoActual ? 'actual' : '';
        htmlPasos += `
            <div class="paso-proceso ${activo} ${completado} ${actual}">
                <div class="paso-icono">
                    <i class="${paso.icono}"></i>
                </div>
                <div class="paso-nombre">${paso.nombre}</div>
                <div class="paso-numero">${paso.paso}</div>
            </div>
        `;
    });
    htmlPasos += '</div>';
    htmlPasos += '</div>';
    
    // Crear HTML de imágenes del proceso (subidas por el administrador)
    let htmlImagenes = '';
    if (servicio.imagenes && servicio.imagenes.length > 0) {
        htmlImagenes = servicio.imagenes.map((img, idx) => `
            <div class="col-md-4 mb-3">
                <img src="${img.ruta_imagen}" alt="${img.nombre_archivo}" class="img-fluid rounded imagen-estado"
                     onclick="abrirImagenModal('${img.ruta_imagen}', '${img.nombre_archivo}')">
                <p class="text-center mt-2 small">${img.nombre_archivo}</p>
            </div>
        `).join('');
    } else {
        htmlImagenes = '<div class="text-center text-muted"><i class="fas fa-image fa-2x mb-2"></i><p>El administrador aún no ha subido imágenes del proceso de reparación</p></div>';
    }
    
    // Crear HTML de comentarios del administrador
    let htmlComentarios = '';
    if (servicio.comentarios && servicio.comentarios.length > 0) {
        htmlComentarios = servicio.comentarios.map(com => `
            <div class="elemento-comentario">
                <div class="encabezado-comentario">
                    <strong>${com.autor || 'Administrador'}</strong>
                    <span class="fecha-comentario">${new Date(com.creado_en).toLocaleDateString()}</span>
                </div>
                <p class="texto-comentario">${com.mensaje}</p>
            </div>
        `).join('');
    } else {
        htmlComentarios = '<div class="text-center text-muted"><i class="fas fa-comments fa-2x mb-2"></i><p>El administrador aún no ha agregado comentarios sobre el progreso</p></div>';
    }

    // Determinar qué mostrar
    let mostrarBotonesDecision = servicio.estado === 'APROBADA' && servicio.reparacion_aceptada_cliente === 'NO_ACEPTADA';
    
    const html = `
        <div class="detalle-servicio">
            <!-- Encabezado -->
            <div class="encabezado-detalle">
                <div>
                    <h2>${servicio.marca_bicicleta} ${servicio.modelo_bicicleta}</h2>
                    <p class="text-muted">${servicio.tipo_trabajo} - ${servicio.tipo_reparacion}</p>
                </div>
                <span class="estado-badge ${estadoClase}">
                    ${servicio.estado}
                </span>
            </div>
            
            <!-- Información General -->
            <div class="seccion-detalle">
                <h4><i class="fas fa-info-circle"></i> Información General</h4>
                <div class="row">
                    <div class="col-md-6">
                        <label><i class="fas fa-calendar"></i> Fecha de Solicitud:</label>
                        <p>${new Date(servicio.creado_en).toLocaleDateString()}</p>
                    </div>
                    <div class="col-md-6">
                        <label><i class="fas fa-user"></i> Nombre:</label>
                        <p>${servicio.nombre_completo}</p>
                    </div>
                    <div class="col-md-6">
                        <label><i class="fas fa-tag"></i> Marca:</label>
                        <p>${servicio.marca_bicicleta}</p>
                    </div>
                    <div class="col-md-6">
                        <label><i class="fas fa-bicycle"></i> Modelo:</label>
                        <p>${servicio.modelo_bicicleta}</p>
                    </div>
                    <div class="col-md-6">
                        <label><i class="fas fa-map-marker-alt"></i> Zona Afectada:</label>
                        <p>${servicio.zona_afectada}</p>
                    </div>
                    <div class="col-md-6">
                        <label><i class="fas fa-tools"></i> Tipo de Reparación:</label>
                        <p>${servicio.tipo_reparacion}</p>
                    </div>
                    <div class="col-12">
                        <label><i class="fas fa-file-alt"></i> Descripción:</label>
                        <p>${servicio.descripcion_otros || 'Sin descripción adicional'}</p>
                    </div>
                </div>
            </div>
            
            <!-- Progreso del Servicio -->
            <div class="seccion-detalle">
                <h4><i class="fas fa-tasks"></i> Progreso del Servicio</h4>
                ${htmlPasos}
            </div>
            
            <!-- Imágenes del Proceso (subidas por el administrador) -->
            <div class="seccion-detalle">
                <h4><i class="fas fa-images"></i> Imágenes del Proceso</h4>
                <div class="row">
                    ${htmlImagenes}
                </div>
            </div>
            
            <!-- Comentarios del Administrador -->
            <div class="seccion-detalle">
                <h4><i class="fas fa-comments"></i> Comentarios del Administrador (${servicio.comentarios ? servicio.comentarios.length : 0})</h4>
                <div class="lista-comentarios">
                    ${htmlComentarios}
                </div>
            </div>

            <!-- Botones de Aceptar/Rechazar Reparaciones -->
            ${servicio.estado === 'APROBADA' && servicio.reparacion_aceptada_cliente === 'NO_ACEPTADA' ? `
            <div class="seccion-detalle">
                <h4><i class="fas fa-question-circle"></i> Propuesta de Reparaciones</h4>
                <p class="text-muted">El administrador ha enviado una propuesta de reparaciones para tu bicicleta. Por favor, revisa los detalles y decide si aceptas o rechazas la propuesta.</p>
                <div class="botones-decision-reparaciones">
                    <button class="btn btn-success btn-lg me-3" onclick="aceptarReparaciones(${servicio.id_cotizacion})">
                        <i class="fas fa-check-circle me-2"></i>
                        Aceptar Propuesta
                    </button>
                    <button class="btn btn-danger btn-lg" onclick="rechazarReparaciones(${servicio.id_cotizacion})">
                        <i class="fas fa-times-circle me-2"></i>
                        Rechazar Propuesta
                    </button>
                </div>
            </div>
            ` : ''}

            <!-- Botones de Acción -->
            <div class="acciones-servicio">
                <button class="btn btn-secondary" onclick="volverListaServicios()">
                    <i class="fas fa-arrow-left"></i> Volver
                </button>
            </div>
        </div>
    `;
    
    contenedor.innerHTML = html;
    contenedor.style.display = 'block';
    document.getElementById('listaServiciosProceso').style.display = 'none';
}

/**
 * Vuelve a la lista de servicios
 */
function volverListaServicios() {
    document.getElementById('listaServiciosProceso').style.display = 'block';
    document.getElementById('detallesServicioProceso').style.display = 'none';
    servicioSeleccionado = null;
}

/**
 * Abre una imagen en modal
 */
function abrirImagenModal(ruta, nombre) {

    Swal.fire({
        title: nombre,
        imageUrl: ruta,
        imageWidth: 600,
        imageHeight: 400,
        imageAlt: nombre,
        showConfirmButton: true,
        confirmButtonText: 'Cerrar'
    });
}

/**
 * Aceptar reparaciones del servicio
 */
function aceptarReparaciones(idCotizacion) {

    Swal.fire({
        title: '¿Confirmar aceptación?',
        text: '¿Estás seguro de que deseas aceptar la propuesta de reparaciones para tu bicicleta?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, aceptar propuesta',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            enviarDecisionReparacion(idCotizacion, 'ACEPTADA');
        }
    });
}

/**
 * Rechazar reparaciones del servicio
 */
function rechazarReparaciones(idCotizacion) {

    Swal.fire({
        title: '¿Confirmar rechazo?',
        text: '¿Estás seguro de que deseas rechazar la propuesta de reparaciones para tu bicicleta?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, rechazar propuesta',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            enviarDecisionReparacion(idCotizacion, 'RECHAZADA');
        }
    });
}

/**
 * Enviar decisión de aceptación/rechazo al backend
 */
function enviarDecisionReparacion(idCotizacion, decision) {

    fetch('../../controlador/Cliente/aceptar_rechazar_reparaciones.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id_cotizacion: idCotizacion,
            decision: decision
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Actualizar el servicio actual en memoria inmediatamente
            const servicioActual = serviciosActuales.find(s => s.id_cotizacion == idCotizacion);
            if (servicioActual) {
                servicioActual.reparacion_aceptada_cliente = decision;
            }

            // Si estamos viendo los detalles de este servicio, actualizar la vista inmediatamente
            if (servicioSeleccionado == idCotizacion) {
                // Ocultar los botones de decisión inmediatamente
                const botonesDecision = document.querySelector('.botones-decision-reparaciones');
                if (botonesDecision) {
                    botonesDecision.style.display = 'none';
                }

                // Agregar mensaje de estado decidido
                const seccionDecision = document.querySelector('.seccion-detalle h4');
                if (seccionDecision && seccionDecision.textContent.includes('Decisión sobre Reparaciones')) {
                    const contenedorPadre = seccionDecision.parentElement;
                    contenedorPadre.innerHTML = `
                        <h4><i class="fas fa-check-circle"></i> Decisión Registrada</h4>
                        <div class="alert alert-${decision === 'ACEPTADA' ? 'success' : 'warning'}">
                            <i class="fas fa-${decision === 'ACEPTADA' ? 'check' : 'times'}-circle me-2"></i>
                            Has ${decision === 'ACEPTADA' ? 'aceptado' : 'rechazado'} la propuesta de reparaciones.
                        </div>
                    `;
                }
            }

            Swal.fire({
                title: 'Decisión enviada',
                text: `Has ${decision === 'ACEPTADA' ? 'aceptado' : 'rechazado'} la propuesta de reparaciones exitosamente.`,
                icon: 'success',
                confirmButtonColor: '#28a745'
            }).then(() => {
                // Recargar la lista de servicios para reflejar cambios
                cargarServiciosProceso();
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: data.message || 'Error al procesar la decisión',
                icon: 'error',
                confirmButtonColor: '#dc3545'
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error de conexión',
            text: 'No se pudo conectar con el servidor',
            icon: 'error',
            confirmButtonColor: '#dc3545'
        });
    });
}

// Función para manejar navegación entre secciones
function manejarNavegacionSeccion(seccionId) {
    if (seccionId === 'proceso') {
        // Si volvemos a la sección de proceso, reiniciar polling
        if (!pollingInterval) {
            iniciarPollingServicios();
        }
    } else {
        // Si salimos de la sección de proceso, detener polling
        detenerPollingServicios();
    }
}

// Exponer función global para que otros módulos puedan llamarla
window.manejarNavegacionSeccion = manejarNavegacionSeccion;

