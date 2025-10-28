/**
 * Fichas Técnicas del Cliente
 * Archivo: recursos/js/Cliente/FichasTecnicas.js
 * Propósito: Manejar la visualización de fichas técnicas
 */

console.log('=== FichasTecnicas.js cargado ===');

// Variables globales
let fichasActuales = [];
let fichaSeleccionada = null;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== INICIO: Inicializando fichas técnicas ===');
    cargarFichasTecnicas();
});

/**
 * Carga todas las fichas técnicas del usuario
 */
function cargarFichasTecnicas() {
    console.log('=== INICIO: Cargando fichas técnicas ===');
    
    fetch('../../controlador/Cliente/obtener_fichas_tecnicas.php')
    .then(response => {
        console.log('Respuesta recibida. Status:', response.status);
        return response.json();
    })
    .then(data => {
        console.log('Datos JSON parseados:', data);
        
        if (data.success && data.fichas) {
            console.log(`Fichas técnicas encontradas: ${data.fichas.length}`);
            fichasActuales = data.fichas;
            mostrarListaFichas(data.fichas);
        } else if (data.fichas && data.fichas.length === 0) {
            console.log('El usuario no tiene fichas técnicas');
            mostrarMensajeVacio();
        } else {
            console.error('ERROR:', data.message);
            Swal.fire('Error', data.message || 'Error al cargar fichas técnicas', 'error');
        }
    })
    .catch(error => {
        console.error('ERROR de conexión:', error);
        Swal.fire('Error', 'Error de conexión: ' + error.message, 'error');
    })
    .finally(() => {
        console.log('=== FIN: Carga de fichas técnicas completada ===');
    });
}

/**
 * Muestra la lista de fichas técnicas
 */
function mostrarListaFichas(fichas) {
    console.log('=== Mostrando lista de fichas técnicas ===');
    
    const contenedor = document.getElementById('listaFichasTecnicas');
    if (!contenedor) {
        console.error('ERROR: Contenedor de fichas técnicas no encontrado');
        return;
    }
    
    contenedor.innerHTML = '';
    
    fichas.forEach((ficha, indice) => {
        console.log(`Procesando ficha ID: ${ficha.id_cotizacion}`);
        
        const estadoClase = `estado-${ficha.estado.toLowerCase().replace('_', '-')}`;
        const div = document.createElement('div');
        div.className = 'ficha-item';
        div.innerHTML = `
            <div class="ficha-header">
                <div class="ficha-info">
                    <h4>${ficha.marca_bicicleta} ${ficha.modelo_bicicleta}</h4>
                    <p class="ficha-tipo">${ficha.tipo_trabajo} - ${ficha.tipo_reparacion}</p>
                </div>
                <span class="estado-badge ${estadoClase}">
                    ${ficha.estado}
                </span>
            </div>
            <div class="ficha-body">
                <div class="ficha-meta">
                    <span><i class="fas fa-calendar"></i> ${new Date(ficha.creado_en).toLocaleDateString()}</span>
                    <span><i class="fas fa-images"></i> ${ficha.total_imagenes} imágenes</span>
                    <span><i class="fas fa-comments"></i> ${ficha.total_comentarios} comentarios</span>
                </div>
                <p class="ficha-zona"><strong>Zona afectada:</strong> ${ficha.zona_afectada}</p>
            </div>
            <div class="ficha-footer">
                <button class="btn btn-primary btn-sm" onclick="verFichaTecnica(${indice})">
                    <i class="fas fa-eye"></i> Ver Detalles
                </button>
            </div>
        `;
        contenedor.appendChild(div);
    });
}

/**
 * Muestra el mensaje cuando no hay fichas técnicas
 */
function mostrarMensajeVacio() {
    console.log('Mostrando mensaje de sin fichas técnicas');
    
    const contenedor = document.getElementById('listaFichasTecnicas');
    if (!contenedor) {
        console.error('ERROR: Contenedor de fichas técnicas no encontrado');
        return;
    }
    
    contenedor.innerHTML = `
        <div class="mensaje-vacio">
            <i class="fas fa-file-alt fa-3x"></i>
            <h3>No tienes fichas técnicas</h3>
            <p>Aún no tienes trabajos completados. Cuando completes una cotización, aparecerá aquí.</p>
        </div>
    `;
}

/**
 * Ver detalles de una ficha técnica
 */
function verFichaTecnica(indice) {
    console.log(`=== INICIO: Ver ficha técnica índice: ${indice} ===`);
    
    if (indice < 0 || indice >= fichasActuales.length) {
        console.error('ERROR: Índice de ficha inválido');
        return;
    }
    
    fichaSeleccionada = fichasActuales[indice];
    console.log('Ficha seleccionada:', fichaSeleccionada);
    
    mostrarDetallesFicha(fichaSeleccionada);
}

/**
 * Muestra los detalles completos de una ficha técnica
 */
function mostrarDetallesFicha(ficha) {
    console.log('=== Mostrando detalles de ficha técnica ===');
    
    const contenedor = document.getElementById('detallesFichaTecnica');
    if (!contenedor) {
        console.error('ERROR: Contenedor de detalles no encontrado');
        return;
    }
    
    const estadoClase = `estado-${ficha.estado.toLowerCase().replace('_', '-')}`;
    
    let htmlImagenes = '';
    if (ficha.imagenes && ficha.imagenes.length > 0) {
        console.log(`Procesando ${ficha.imagenes.length} imágenes`);
        htmlImagenes = ficha.imagenes.map((img, idx) => `
            <div class="col-md-4 mb-3">
                <img src="${img.ruta_imagen}" alt="${img.nombre_archivo}" class="img-fluid rounded status-image" 
                     onclick="abrirImagenModal('${img.ruta_imagen}', '${img.nombre_archivo}')">
                <p class="text-center mt-2 small">${img.nombre_archivo}</p>
            </div>
        `).join('');
    } else {
        htmlImagenes = '<p class="text-muted">No hay imágenes disponibles</p>';
    }
    
    let htmlComentarios = '';
    if (ficha.comentarios && ficha.comentarios.length > 0) {
        console.log(`Procesando ${ficha.comentarios.length} comentarios`);
        htmlComentarios = ficha.comentarios.map(com => `
            <div class="comentario-item">
                <div class="comentario-header">
                    <strong>${com.autor}</strong>
                    <span class="comentario-fecha">${new Date(com.creado_en).toLocaleDateString()}</span>
                </div>
                <p class="comentario-texto">${com.mensaje}</p>
            </div>
        `).join('');
    } else {
        htmlComentarios = '<p class="text-muted">No hay comentarios disponibles</p>';
    }
    
    const html = `
        <div class="ficha-detalle">
            <!-- Encabezado -->
            <div class="ficha-detalle-header">
                <div>
                    <h2>${ficha.marca_bicicleta} ${ficha.modelo_bicicleta}</h2>
                    <p class="text-muted">${ficha.tipo_trabajo} - ${ficha.tipo_reparacion}</p>
                </div>
                <span class="estado-badge ${estadoClase}">
                    ${ficha.estado}
                </span>
            </div>
            
            <!-- Información General -->
            <div class="ficha-seccion">
                <h4><i class="fas fa-info-circle"></i> Información General</h4>
                <div class="row">
                    <div class="col-md-6">
                        <label><i class="fas fa-calendar"></i> Fecha de Solicitud:</label>
                        <p>${new Date(ficha.creado_en).toLocaleDateString()}</p>
                    </div>
                    <div class="col-md-6">
                        <label><i class="fas fa-user"></i> Nombre:</label>
                        <p>${ficha.nombre_completo}</p>
                    </div>
                    <div class="col-md-6">
                        <label><i class="fas fa-tag"></i> Marca:</label>
                        <p>${ficha.marca_bicicleta}</p>
                    </div>
                    <div class="col-md-6">
                        <label><i class="fas fa-bicycle"></i> Modelo:</label>
                        <p>${ficha.modelo_bicicleta}</p>
                    </div>
                    <div class="col-md-6">
                        <label><i class="fas fa-map-marker-alt"></i> Zona Afectada:</label>
                        <p>${ficha.zona_afectada}</p>
                    </div>
                    <div class="col-md-6">
                        <label><i class="fas fa-tools"></i> Tipo de Reparación:</label>
                        <p>${ficha.tipo_reparacion}</p>
                    </div>
                    <div class="col-12">
                        <label><i class="fas fa-file-alt"></i> Descripción:</label>
                        <p>${ficha.descripcion_otros || 'Sin descripción adicional'}</p>
                    </div>
                </div>
            </div>
            
            <!-- Imágenes -->
            <div class="ficha-seccion">
                <h4><i class="fas fa-images"></i> Imágenes de la Cotización</h4>
                <div class="row">
                    ${htmlImagenes}
                </div>
            </div>
            
            <!-- Comentarios -->
            <div class="ficha-seccion">
                <h4><i class="fas fa-comments"></i> Comentarios (${ficha.comentarios ? ficha.comentarios.length : 0})</h4>
                <div class="comentarios-lista">
                    ${htmlComentarios}
                </div>
            </div>
            
            <!-- Botones de Acción -->
            <div class="ficha-acciones">
                <button class="btn btn-secondary" onclick="volverListaFichas()">
                    <i class="fas fa-arrow-left"></i> Volver
                </button>
                <button class="btn btn-primary" onclick="descargarFicha(${ficha.id_cotizacion})">
                    <i class="fas fa-download"></i> Descargar PDF
                </button>
            </div>
        </div>
    `;
    
    contenedor.innerHTML = html;
    contenedor.style.display = 'block';
    document.getElementById('listaFichasTecnicas').style.display = 'none';
    
    console.log('=== FIN: Detalles mostrados ===');
}

/**
 * Vuelve a la lista de fichas
 */
function volverListaFichas() {
    console.log('Volviendo a la lista de fichas');
    document.getElementById('listaFichasTecnicas').style.display = 'block';
    document.getElementById('detallesFichaTecnica').style.display = 'none';
    fichaSeleccionada = null;
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

/**
 * Descarga la ficha técnica como PDF
 */
function descargarFicha(idCotizacion) {
    console.log(`Descargando ficha técnica ID: ${idCotizacion}`);
    
    Swal.fire({
        title: 'Descargar PDF',
        text: 'Esta funcionalidad estará disponible pronto',
        icon: 'info',
        confirmButtonText: 'Aceptar'
    });
}

console.log('=== FichasTecnicas.js inicializado ===');

