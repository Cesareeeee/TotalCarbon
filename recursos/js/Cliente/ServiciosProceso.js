/**
 * Servicios en Proceso del Cliente
 * Archivo: recursos/js/Cliente/ServiciosProceso.js
 * Propósito: Manejar la visualización de servicios en proceso
 */

console.log('=== ServiciosProceso.js cargado ===');

// Variables globales
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

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== INICIO: Inicializando servicios en proceso ===');
    cargarServiciosProceso();
});

/**
 * Carga todos los servicios en proceso del usuario
 */
function cargarServiciosProceso() {
    console.log('=== INICIO: Cargando servicios en proceso ===');
    
    fetch('../../controlador/Cliente/obtener_servicios_proceso.php')
    .then(respuesta => {
        console.log('Respuesta recibida. Estado:', respuesta.status);
        return respuesta.json();
    })
    .then(datos => {
        console.log('Datos JSON parseados:', datos);
        
        if (datos.exito && datos.servicios) {
            console.log(`Servicios encontrados: ${datos.servicios.length}`);
            serviciosActuales = datos.servicios;
            mostrarListaServicios(datos.servicios);
        } else if (datos.servicios && datos.servicios.length === 0) {
            console.log('El usuario no tiene servicios en proceso');
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
        console.log('=== FIN: Carga de servicios completada ===');
    });
}

/**
 * Muestra la lista de servicios en proceso
 */
function mostrarListaServicios(servicios) {
    console.log('=== Mostrando lista de servicios en proceso ===');
    
    const contenedor = document.getElementById('listaServiciosProceso');
    if (!contenedor) {
        console.error('ERROR: Contenedor de servicios no encontrado');
        return;
    }
    
    contenedor.innerHTML = '';
    
    // Filtrar servicios por estado
    const pendientes = servicios.filter(s => s.estado === 'PENDIENTE');
    const enProceso = servicios.filter(s => s.estado === 'EN_REVISION' || s.estado === 'APROBADA');
    const completados = servicios.filter(s => s.estado === 'COMPLETADA');
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
    console.log(`Creando sección: ${titulo} con ${servicios.length} servicios`);
    
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
 * Muestra el mensaje cuando no hay servicios
 */
function mostrarMensajeVacio() {
    console.log('Mostrando mensaje de sin servicios');
    
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
    console.log(`=== INICIO: Ver detalles del servicio índice: ${indice} ===`);
    
    if (indice < 0 || indice >= serviciosActuales.length) {
        console.error('ERROR: Índice de servicio inválido');
        return;
    }
    
    servicioSeleccionado = serviciosActuales[indice];
    console.log('Servicio seleccionado:', servicioSeleccionado);
    
    mostrarDetallesServicio(servicioSeleccionado);
}

/**
 * Muestra los detalles completos de un servicio
 */
function mostrarDetallesServicio(servicio) {
    console.log('=== Mostrando detalles del servicio ===');
    
    const contenedor = document.getElementById('detallesServicioProceso');
    if (!contenedor) {
        console.error('ERROR: Contenedor de detalles no encontrado');
        return;
    }
    
    const estadoClase = `estado-${servicio.estado.toLowerCase().replace('_', '-')}`;
    const pasoActual = servicio.paso_actual || 1;
    
    // Crear HTML de pasos
    let htmlPasos = '<div class="pasos-proceso">';
    PASOS_PROCESO.forEach(paso => {
        const activo = paso.paso <= pasoActual ? 'activo' : '';
        const completado = paso.paso < pasoActual ? 'completado' : '';
        htmlPasos += `
            <div class="paso-proceso ${activo} ${completado}">
                <div class="paso-icono">
                    <i class="${paso.icono}"></i>
                </div>
                <div class="paso-nombre">${paso.nombre}</div>
            </div>
        `;
    });
    htmlPasos += '</div>';
    
    // Crear HTML de imágenes
    let htmlImagenes = '';
    if (servicio.imagenes && servicio.imagenes.length > 0) {
        console.log(`Procesando ${servicio.imagenes.length} imágenes`);
        htmlImagenes = servicio.imagenes.map((img, idx) => `
            <div class="col-md-4 mb-3">
                <img src="${img.ruta_imagen}" alt="${img.nombre_archivo}" class="img-fluid rounded imagen-estado" 
                     onclick="abrirImagenModal('${img.ruta_imagen}', '${img.nombre_archivo}')">
                <p class="text-center mt-2 small">${img.nombre_archivo}</p>
            </div>
        `).join('');
    } else {
        htmlImagenes = '<p class="text-muted">No hay imágenes disponibles</p>';
    }
    
    // Crear HTML de comentarios
    let htmlComentarios = '';
    if (servicio.comentarios && servicio.comentarios.length > 0) {
        console.log(`Procesando ${servicio.comentarios.length} comentarios`);
        htmlComentarios = servicio.comentarios.map(com => `
            <div class="elemento-comentario">
                <div class="encabezado-comentario">
                    <strong>${com.autor}</strong>
                    <span class="fecha-comentario">${new Date(com.creado_en).toLocaleDateString()}</span>
                </div>
                <p class="texto-comentario">${com.mensaje}</p>
            </div>
        `).join('');
    } else {
        htmlComentarios = '<p class="text-muted">No hay comentarios disponibles</p>';
    }
    
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
            
            <!-- Imágenes -->
            <div class="seccion-detalle">
                <h4><i class="fas fa-images"></i> Imágenes del Proceso</h4>
                <div class="row">
                    ${htmlImagenes}
                </div>
            </div>
            
            <!-- Comentarios -->
            <div class="seccion-detalle">
                <h4><i class="fas fa-comments"></i> Comentarios (${servicio.comentarios ? servicio.comentarios.length : 0})</h4>
                <div class="lista-comentarios">
                    ${htmlComentarios}
                </div>
            </div>
            
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
    
    console.log('=== FIN: Detalles mostrados ===');
}

/**
 * Vuelve a la lista de servicios
 */
function volverListaServicios() {
    console.log('Volviendo a la lista de servicios');
    document.getElementById('listaServiciosProceso').style.display = 'block';
    document.getElementById('detallesServicioProceso').style.display = 'none';
    servicioSeleccionado = null;
}

/**
 * Abre una imagen en modal
 */
function abrirImagenModal(ruta, nombre) {
    console.log(`Abriendo imagen: ${nombre}`);
    
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

console.log('=== ServiciosProceso.js inicializado ===');

