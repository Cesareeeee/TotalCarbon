/**
 * Fichas Técnicas del Cliente
 * Archivo: recursos/js/Cliente/FichasTecnicas.js
 * Propósito: Manejar la visualización de fichas técnicas
 */

 // Variables globales
let fichasActuales = [];
let fichaSeleccionada = null;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    cargarFichasTecnicas();

    // Inicializar filtro de fichas técnicas
    const filtroEstado = document.getElementById('filtroEstadoFichas');
    if (filtroEstado) {
        filtroEstado.addEventListener('change', function() {
            filtrarFichasTecnicas(this.value);
        });
    }
});

/**
 * Carga todas las fichas técnicas del usuario
 */
function cargarFichasTecnicas() {
    
    fetch('../../controlador/Cliente/obtener_fichas_tecnicas.php')
    .then(response => {
        return response.json();
    })
    .then(data => {
        
        if (data.success && data.fichas) {
            fichasActuales = data.fichas;
            mostrarListaFichas(data.fichas);
        } else if (data.fichas && data.fichas.length === 0) {
            mostrarMensajeVacio();
        } else {
            Swal.fire('Error', data.message || 'Error al cargar fichas técnicas', 'error');
        }
    })
    .catch(error => {
        Swal.fire('Error', 'Error de conexión: ' + error.message, 'error');
    })
    .finally(() => {
    });
}

/**
 * Muestra la lista de fichas técnicas
 */
function mostrarListaFichas(fichas) {
    
    const contenedor = document.getElementById('listaFichasTecnicas');
    if (!contenedor) {
        return;
    }
    
    contenedor.innerHTML = '';
    
    fichas.forEach((ficha, indice) => {
        
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
 * Filtra las fichas técnicas por estado
 */
function filtrarFichasTecnicas(estadoFiltro) {

    if (!fichasActuales || fichasActuales.length === 0) {
        return;
    }

    let fichasFiltradas;

    if (estadoFiltro === 'todos') {
        fichasFiltradas = fichasActuales;
    } else {
        fichasFiltradas = fichasActuales.filter(ficha => ficha.estado === estadoFiltro);
    }

    if (fichasFiltradas.length === 0) {
        mostrarMensajeVacioFiltro(estadoFiltro);
    } else {
        mostrarListaFichas(fichasFiltradas);
    }
}

/**
 * Muestra el mensaje cuando no hay fichas técnicas para el filtro seleccionado
 */
function mostrarMensajeVacioFiltro(estadoFiltro) {

    const contenedor = document.getElementById('listaFichasTecnicas');
    if (!contenedor) {
        return;
    }

    const estadoTexto = estadoFiltro === 'todos' ? 'ningún estado' : `estado "${estadoFiltro}"`;

    contenedor.innerHTML = `
        <div class="mensaje-vacio">
            <i class="fas fa-filter fa-3x"></i>
            <h3>No hay fichas técnicas</h3>
            <p>No tienes trabajos completados con ${estadoTexto}.</p>
            <button class="btn btn-outline-primary mt-3" onclick="document.getElementById('filtroEstadoFichas').value='todos'; filtrarFichasTecnicas('todos');">
                <i class="fas fa-list me-2"></i>Ver todas las fichas
            </button>
        </div>
    `;
}

/**
 * Muestra el mensaje cuando no hay fichas técnicas
 */
function mostrarMensajeVacio() {

    const contenedor = document.getElementById('listaFichasTecnicas');
    if (!contenedor) {
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
    
    if (indice < 0 || indice >= fichasActuales.length) {
        return;
    }
    
    fichaSeleccionada = fichasActuales[indice];
    
    mostrarDetallesFicha(fichaSeleccionada);
}

/**
 * Muestra los detalles completos de una ficha técnica
 */
function mostrarDetallesFicha(ficha) {
    
    const contenedor = document.getElementById('detallesFichaTecnica');
    if (!contenedor) {
        return;
    }
    
    const estadoClase = `estado-${ficha.estado.toLowerCase().replace('_', '-')}`;
    
    let htmlImagenes = '';
    if (ficha.imagenes && ficha.imagenes.length > 0) {
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

    // Estado de aceptación (solo informativo)
    const estadoAceptacion = ficha.reparacion_aceptada_cliente === 'ACEPTADA' ? 'Aceptadas' :
                            ficha.reparacion_aceptada_cliente === 'NO_ACEPTADA' ? 'Rechazadas' : 'Pendiente';

    let htmlEstadoAceptacion = `
        <div class="ficha-seccion">
            <h4><i class="fas fa-check-circle"></i> Estado de Aceptación de Reparaciones</h4>
            <div class="estado-aceptacion">
                <span class="badge ${ficha.reparacion_aceptada_cliente === 'ACEPTADA' ? 'badge-success' :
                                   ficha.reparacion_aceptada_cliente === 'NO_ACEPTADA' ? 'badge-danger' : 'badge-warning'}">
                    ${estadoAceptacion}
                </span>
            </div>
        </div>
    `;

    // Piezas
    let htmlPiezas = '';
    if (ficha.piezas && ficha.piezas.length > 0) {
        const piezasRecibidas = ficha.piezas.filter(p => p.tipo === 'RECIBIDO');
        const piezasEntregadas = ficha.piezas.filter(p => p.tipo === 'ENTREGADO');

        htmlPiezas = `
            <div class="ficha-seccion">
                <h4><i class="fas fa-cogs"></i> Relación de Piezas</h4>
                <div class="row">
                    <div class="col-md-6">
                        <h5 class="text-success"><i class="fas fa-arrow-down"></i> Piezas Recibidas</h5>
                        ${piezasRecibidas.length > 0 ? `
                            <ul class="list-group">
                                ${piezasRecibidas.map(pieza => `
                                    <li class="list-group-item">
                                        <strong>${pieza.nombre_pieza || 'N/A'}</strong>
                                        ${pieza.codigo_pieza ? `<br><small class="text-muted">Código: ${pieza.codigo_pieza}</small>` : ''}
                                        <br><small class="text-muted">Cantidad: ${pieza.cantidad} - ${new Date(pieza.creado_en).toLocaleDateString()}</small>
                                        ${pieza.nota ? `<br><small class="text-muted">Nota: ${pieza.nota}</small>` : ''}
                                    </li>
                                `).join('')}
                            </ul>
                        ` : '<p class="text-muted">No hay piezas recibidas registradas</p>'}
                    </div>
                    <div class="col-md-6">
                        <h5 class="text-primary"><i class="fas fa-arrow-up"></i> Piezas Entregadas</h5>
                        ${piezasEntregadas.length > 0 ? `
                            <ul class="list-group">
                                ${piezasEntregadas.map(pieza => `
                                    <li class="list-group-item">
                                        <strong>${pieza.nombre_pieza || 'N/A'}</strong>
                                        ${pieza.codigo_pieza ? `<br><small class="text-muted">Código: ${pieza.codigo_pieza}</small>` : ''}
                                        <br><small class="text-muted">Cantidad: ${pieza.cantidad} - ${new Date(pieza.creado_en).toLocaleDateString()}</small>
                                        ${pieza.nota ? `<br><small class="text-muted">Nota: ${pieza.nota}</small>` : ''}
                                    </li>
                                `).join('')}
                            </ul>
                        ` : '<p class="text-muted">No hay piezas entregadas registradas</p>'}
                    </div>
                </div>
            </div>
        `;
    } else {
        htmlPiezas = `
            <div class="ficha-seccion">
                <h4><i class="fas fa-cogs"></i> Relación de Piezas</h4>
                <p class="text-muted">No hay información de piezas disponible</p>
            </div>
        `;
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

            <!-- Estado de Aceptación -->
            ${htmlEstadoAceptacion}

            <!-- Piezas -->
            ${htmlPiezas}

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
    
}

/**
 * Vuelve a la lista de fichas
 */
function volverListaFichas() {
    document.getElementById('listaFichasTecnicas').style.display = 'block';
    document.getElementById('detallesFichaTecnica').style.display = 'none';
    fichaSeleccionada = null;
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
 * Descarga la ficha técnica como PDF profesional
 */
function descargarFicha(idCotizacion) {
    
    // Buscar la ficha en las fichas actuales
    const ficha = fichasActuales.find(f => f.id_cotizacion == idCotizacion);
    if (!ficha) {
        Swal.fire('Error', 'Ficha técnica no encontrada', 'error');
        return;
    }

    // Crear PDF con jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Configuración de colores para diseño tipo formulario
    const blackColor = [0, 0, 0]; // Negro para texto y líneas
    const whiteColor = [255, 255, 255]; // Blanco para fondos
    const orangeColor = [255, 165, 0]; // Naranja para etiquetas de tipos de trabajo
    const grayColor = [200, 200, 200]; // Gris claro para fondos suaves

    let yPosition = 20;

    // Encabezado tipo formulario
    // Logo en esquina superior izquierda
    try {
        // Intentar agregar logo
        const logoWidth = 30;
        const logoHeight = 20;
        const logoX = 20;
        const logoY = 15;

        // Placeholder para logo - en producción cargar imagen real
        doc.setFillColor(...blackColor);
        doc.rect(logoX, logoY, logoWidth, logoHeight, 'F');
        doc.setTextColor(...whiteColor);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('TOTAL', logoX + 2, logoY + 7);
        doc.text('CARBON', logoX + 2, logoY + 15);
    } catch (e) {
        // Si no se puede cargar el logo, continuar
    }

    // Título centrado
    doc.setTextColor(...blackColor);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('FICHA TÉCNICA', 105, 25, { align: 'center' });

    // Espacio para códigos escritos a mano (derecha)
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Código:', 160, 15);
    doc.rect(160, 18, 30, 8);

    doc.text('Fecha:', 160, 30);
    doc.rect(160, 33, 30, 8);

    // Sección DATOS - Formulario tipo ficha
    yPosition = 50;
    doc.setTextColor(...blackColor);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('DATOS', 20, yPosition);

    yPosition += 10;

    // Dibujar recuadros para datos
    const telefonoFinal = ficha.telefono_usuario || ficha.telefono || '';
    const correoFinal = ficha.correo_usuario || ficha.correo_electronico || '';

    // Fecha
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Fecha:', 20, yPosition);
    doc.rect(40, yPosition - 4, 50, 8);
    doc.text(new Date(ficha.creado_en).toLocaleDateString('es-ES'), 42, yPosition);

    // Nombre
    doc.text('Nombre:', 110, yPosition);
    doc.rect(130, yPosition - 4, 60, 8);
    doc.text(ficha.nombre_completo, 132, yPosition);

    yPosition += 15;

    // Dirección
    doc.text('Dirección:', 20, yPosition);
    doc.rect(40, yPosition - 4, 80, 8);
    doc.text(ficha.direccion || '', 42, yPosition);

    // Marca
    doc.text('Marca:', 130, yPosition);
    doc.rect(145, yPosition - 4, 45, 8);
    doc.text(ficha.marca_bicicleta, 147, yPosition);

    yPosition += 15;

    // Teléfono
    doc.text('Teléfono:', 20, yPosition);
    doc.rect(40, yPosition - 4, 50, 8);
    doc.text(telefonoFinal, 42, yPosition);

    // Modelo
    doc.text('Modelo:', 110, yPosition);
    doc.rect(125, yPosition - 4, 65, 8);
    doc.text(ficha.modelo_bicicleta, 127, yPosition);

    yPosition += 15;

    // Correo
    doc.text('Correo:', 20, yPosition);
    doc.rect(35, yPosition - 4, 75, 8);
    doc.text(correoFinal, 37, yPosition);

    // Tipo de trabajo con etiqueta naranja
    doc.setFillColor(...orangeColor);
    doc.rect(120, yPosition - 6, 25, 10, 'F');
    doc.setTextColor(...whiteColor);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(ficha.tipo_trabajo, 122, yPosition);
    doc.setTextColor(...blackColor);

    // Revisión circuito de cámaras
    yPosition += 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('REVISIÓN CIRCUITO DE CÁMARAS', 20, yPosition);

    yPosition += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Fecha:', 20, yPosition);
    doc.rect(35, yPosition - 4, 40, 8);

    doc.text('Hora:', 85, yPosition);
    doc.rect(95, yPosition - 4, 30, 8);

    // Inspección estética
    yPosition += 20;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('INSPECCIÓN ESTÉTICA', 20, yPosition);

    yPosition += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Daños estéticos encontrados:', 20, yPosition);

    yPosition += 5;
    // Recuadro grande para observaciones
    doc.rect(20, yPosition, 170, 25);
    // Líneas para escritura a mano
    for (let i = 0; i < 4; i++) {
        doc.line(20, yPosition + 6 + (i * 6), 190, yPosition + 6 + (i * 6));
    }

    // Observaciones del técnico
    yPosition += 35;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('OBSERVACIONES DEL TÉCNICO', 20, yPosition);

    yPosition += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Notas técnicas:', 20, yPosition);

    yPosition += 5;
    // Recuadro grande para observaciones técnicas
    doc.rect(20, yPosition, 170, 30);
    // Líneas para escritura a mano
    for (let i = 0; i < 6; i++) {
        doc.line(20, yPosition + 5 + (i * 5), 190, yPosition + 5 + (i * 5));
    }

    // Zona afectada / Tipo de reparación
    yPosition += 45;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('ZONA AFECTADA / TIPO DE REPARACIÓN', 20, yPosition);

    yPosition += 10;

    // Dibujar diagrama simple de bicicleta
    doc.setDrawColor(...blackColor);
    doc.setLineWidth(1);

    // Marco de la bici (simplificado)
    const bikeCenterX = 140;
    const bikeCenterY = yPosition + 20;

    // Triángulo principal (cuadro)
    doc.line(bikeCenterX - 15, bikeCenterY - 10, bikeCenterX + 15, bikeCenterY - 10); // tubo superior
    doc.line(bikeCenterX - 15, bikeCenterY - 10, bikeCenterX - 5, bikeCenterY + 10); // tubo de sillín
    doc.line(bikeCenterX + 15, bikeCenterY - 10, bikeCenterX + 5, bikeCenterY + 10); // tubo diagonal
    doc.line(bikeCenterX - 5, bikeCenterY + 10, bikeCenterX + 5, bikeCenterY + 10); // puente

    // Ruedas
    doc.circle(bikeCenterX - 12, bikeCenterY + 10, 8); // rueda trasera
    doc.circle(bikeCenterX + 12, bikeCenterY + 10, 8); // rueda delantera

    // Centro de las ruedas
    doc.circle(bikeCenterX - 12, bikeCenterY + 10, 2, 'F');
    doc.circle(bikeCenterX + 12, bikeCenterY + 10, 2, 'F');

    // Manillar y horquilla
    doc.line(bikeCenterX + 15, bikeCenterY - 10, bikeCenterX + 20, bikeCenterY - 15); // horquilla
    doc.line(bikeCenterX + 20, bikeCenterY - 15, bikeCenterX + 25, bikeCenterY - 10); // manillar

    // Pedalier
    doc.circle(bikeCenterX, bikeCenterY + 10, 3, 'F');

    // Texto explicativo
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Marque las zonas afectadas', bikeCenterX - 25, bikeCenterY + 35);

    // Checkboxes para tipos de reparación
    yPosition += 50;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    const repairTypes = [
        'Fisura', 'Fractura', 'Reconstrucción', 'Adaptación', 'Otros'
    ];

    repairTypes.forEach((type, index) => {
        const checkboxX = 20 + (index * 35);
        const checkboxY = yPosition;

        // Dibujar checkbox
        doc.rect(checkboxX, checkboxY - 3, 5, 5);

        // Marcar si corresponde al tipo de reparación actual
        if (ficha.tipo_reparacion.toLowerCase().includes(type.toLowerCase()) ||
            (type === 'Otros' && ficha.descripcion_otros)) {
            doc.text('✓', checkboxX + 1.5, checkboxY + 1);
        }

        // Texto del tipo
        doc.text(type, checkboxX + 8, checkboxY + 1);
    });

    // Zona afectada
    yPosition += 15;
    doc.text('Zona afectada específica:', 20, yPosition);
    doc.rect(60, yPosition - 4, 80, 8);
    doc.text(ficha.zona_afectada, 62, yPosition);


    // Piezas recibidas/enviadas - Tabla tipo formulario
    yPosition += 20;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('PIEZAS RECIBIDAS/ENVIADAS', 20, yPosition);

    yPosition += 10;

    // Lista de piezas comunes para formulario
    const piezasComunes = [
        'Cuadro completo',
        'Horquilla',
        'Rueda delantera',
        'Rueda trasera',
        'Manillar',
        'Tija de sillín',
        'Sillín',
        'Pedales',
        'Cadena',
        'Piñón',
        'Platos',
        'Frenos',
        'Cambio',
        'Cableado',
        'Otros'
    ];

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');

    piezasComunes.forEach((pieza, index) => {
        if (index > 0 && index % 10 === 0) {
            yPosition += 15;
        }

        const rowY = yPosition + (index % 10) * 8;

        // Checkbox
        doc.rect(20, rowY - 2, 4, 4);

        // Marcar checkboxes basadas en piezas reales si existen
        const piezasRecibidas = ficha.piezas ? ficha.piezas.filter(p => p.tipo === 'RECIBIDO') : [];
        const piezaEncontrada = piezasRecibidas.find(p => p.nombre_pieza && p.nombre_pieza.toLowerCase().includes(pieza.toLowerCase().split(' ')[0]));
        if (piezaEncontrada) {
            doc.text('✓', 21.5, rowY + 1);
        }

        // Nombre de pieza
        doc.text(pieza, 30, rowY);

        // Línea para cantidad/notas
        doc.line(90, rowY, 150, rowY);
    });

    // Empacado / Salida
    yPosition += 90;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('EMPACADO / SALIDA', 20, yPosition);

    yPosition += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Fecha:', 20, yPosition);
    doc.rect(35, yPosition - 4, 40, 8);

    doc.text('Firma de autorización:', 90, yPosition);
    doc.line(130, yPosition, 180, yPosition);

    // Pie de página simple tipo formulario
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);

        // Línea separadora
        doc.setDrawColor(...blackColor);
        doc.line(20, 280, 190, 280);

        // Información del documento
        doc.setFontSize(8);
        doc.setTextColor(...blackColor);
        doc.setFont('helvetica', 'normal');
        doc.text(`Ficha Técnica - Total Carbon - ID: ${ficha.id_cotizacion}`, 20, 288);
        doc.text(`Página ${i} de ${pageCount}`, 160, 288);
        doc.text(`Generado el ${new Date().toLocaleDateString('es-ES')} a las ${new Date().toLocaleTimeString('es-ES')}`, 20, 295);
    }

    // Descargar con nombre descriptivo
    const nombreArchivo = `Ficha_Tecnica_${ficha.marca_bicicleta}_${ficha.modelo_bicicleta}_${ficha.id_cotizacion}.pdf`;
    doc.save(nombreArchivo);

    Swal.fire({
        title: '¡PDF Generado!',
        text: 'La ficha técnica se ha descargado correctamente.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
    });
}


