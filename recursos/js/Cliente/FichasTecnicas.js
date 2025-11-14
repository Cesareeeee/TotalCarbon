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
 * Filtra las fichas técnicas por estado
 */
function filtrarFichasTecnicas(estadoFiltro) {
    console.log(`Filtrando fichas técnicas por estado: ${estadoFiltro}`);

    if (!fichasActuales || fichasActuales.length === 0) {
        console.log('No hay fichas para filtrar');
        return;
    }

    let fichasFiltradas;

    if (estadoFiltro === 'todos') {
        fichasFiltradas = fichasActuales;
    } else {
        fichasFiltradas = fichasActuales.filter(ficha => ficha.estado === estadoFiltro);
    }

    console.log(`Fichas encontradas después del filtro: ${fichasFiltradas.length}`);

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
    console.log(`Mostrando mensaje de sin fichas técnicas para filtro: ${estadoFiltro}`);

    const contenedor = document.getElementById('listaFichasTecnicas');
    if (!contenedor) {
        console.error('ERROR: Contenedor de fichas técnicas no encontrado');
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
        console.log(`Procesando ${ficha.piezas.length} piezas`);
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
 * Descarga la ficha técnica como PDF profesional
 */
function descargarFicha(idCotizacion) {
    console.log(`Descargando ficha técnica ID: ${idCotizacion}`);

    // Buscar la ficha en las fichas actuales
    const ficha = fichasActuales.find(f => f.id_cotizacion == idCotizacion);
    if (!ficha) {
        Swal.fire('Error', 'Ficha técnica no encontrada', 'error');
        return;
    }

    // Crear PDF con jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Configuración de colores y fuentes
    const primaryColor = [102, 126, 234]; // Azul primario
    const secondaryColor = [108, 117, 125]; // Gris
    const successColor = [40, 167, 69]; // Verde
    const dangerColor = [220, 53, 69]; // Rojo

    let yPosition = 20;

    // Encabezado con logo y título
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 30, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL CARBON', 20, 20);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('Ficha Técnica de Reparación', 20, 28);

    // Información del cliente - Tabla
    yPosition = 45;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Información del Cliente', 20, yPosition);

    yPosition += 10;
    const telefonoFinal = ficha.telefono_usuario || ficha.telefono || 'No especificado';
    const correoFinal = ficha.correo_usuario || ficha.correo_electronico || 'No especificado';

    const clienteData = [
        ['Nombre Completo', ficha.nombre_completo],
        ['Dirección', ficha.direccion || 'No especificada'],
        ['Teléfono', telefonoFinal],
        ['Correo Electrónico', correoFinal]
    ];

    doc.autoTable({
        startY: yPosition,
        head: [['Campo', 'Valor']],
        body: clienteData,
        theme: 'grid',
        headStyles: { fillColor: [0, 0, 0], textColor: 255 },
        styles: { fontSize: 10 },
        columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 50 },
            1: { cellWidth: 120 }
        },
        margin: { left: 20, right: 20 }
    });

    // Información de la bicicleta - Tabla
    yPosition = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Información de la Bicicleta', 20, yPosition);

    yPosition += 10;
    const biciData = [
        ['Marca', ficha.marca_bicicleta],
        ['Modelo', ficha.modelo_bicicleta],
        ['Zona Afectada', ficha.zona_afectada],
        ['Tipo de Trabajo', ficha.tipo_trabajo],
        ['Tipo de Reparación', ficha.tipo_reparacion],
        ['Estado Actual', ficha.estado],
        ['Fecha de Solicitud', new Date(ficha.creado_en).toLocaleDateString('es-ES')]
    ];

    doc.autoTable({
        startY: yPosition,
        head: [['Especificación', 'Detalle']],
        body: biciData,
        theme: 'grid',
        headStyles: { fillColor: [0, 0, 0], textColor: 255 },
        styles: { fontSize: 10 },
        columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 50 },
            1: { cellWidth: 120 }
        },
        margin: { left: 20, right: 20 }
    });

    // Estado de aceptación - Checklist en PDF
    yPosition = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Estado de Aceptación de Reparaciones', 20, yPosition);

    yPosition += 10;
    const estadoAceptacion = ficha.reparacion_aceptada_cliente === 'ACEPTADA' ? 'ACEPTADAS' :
                            ficha.reparacion_aceptada_cliente === 'NO_ACEPTADA' ? 'RECHAZADAS' : 'PENDIENTE';

    // Dibujar checklist
    const checklistY = yPosition;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');

    // Opción Aceptar
    doc.circle(25, checklistY + 3, 2, ficha.reparacion_aceptada_cliente === 'ACEPTADA' ? 'FD' : 'S');
    if (ficha.reparacion_aceptada_cliente === 'ACEPTADA') {
        doc.setTextColor(...successColor);
        doc.text('✓', 23.5, checklistY + 5);
    }
    doc.setTextColor(0, 0, 0);
    doc.text('Reparaciones Aceptadas', 35, checklistY + 5);

    // Opción Rechazar
    doc.circle(25, checklistY + 13, 2, ficha.reparacion_aceptada_cliente === 'NO_ACEPTADA' ? 'FD' : 'S');
    if (ficha.reparacion_aceptada_cliente === 'NO_ACEPTADA') {
        doc.setTextColor(...dangerColor);
        doc.text('✗', 23.5, checklistY + 15);
    }
    doc.setTextColor(0, 0, 0);
    doc.text('Reparaciones Rechazadas', 35, checklistY + 15);

    yPosition += 25;

    // Comentarios - Tabla
    if (ficha.comentarios && ficha.comentarios.length > 0) {
        if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
        }

        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Comentarios del Proceso', 20, yPosition);

        yPosition += 10;
        const comentariosData = ficha.comentarios.map(com => [
            com.autor,
            new Date(com.creado_en).toLocaleDateString('es-ES'),
            com.mensaje
        ]);

        doc.autoTable({
            startY: yPosition,
            head: [['Autor', 'Fecha', 'Comentario']],
            body: comentariosData,
            theme: 'grid',
            headStyles: { fillColor: [0, 0, 0], textColor: 255 },
            styles: { fontSize: 9 },
            columnStyles: {
                0: { cellWidth: 40 },
                1: { cellWidth: 35 },
                2: { cellWidth: 95 }
            },
            margin: { left: 20, right: 20 }
        });

        yPosition = doc.lastAutoTable.finalY + 15;
    }

    // Imágenes de la ficha técnica
    if (ficha.imagenes && ficha.imagenes.length > 0) {
        if (yPosition > 220) {
            doc.addPage();
            yPosition = 20;
        }

        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Imágenes de la Ficha Técnica', 20, yPosition);
        yPosition += 10;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Total de imágenes: ${ficha.imagenes.length}`, 20, yPosition);
        yPosition += 15;

        // Mostrar información de las imágenes (no podemos mostrar las imágenes reales en PDF desde JS)
        const imagenesData = ficha.imagenes.map((img, index) => [
            (index + 1).toString(),
            img.nombre_archivo,
            new Date().toLocaleDateString('es-ES'), // No tenemos fecha de subida en los datos actuales
            'Disponible en sistema'
        ]);

        doc.autoTable({
            startY: yPosition,
            head: [['#', 'Nombre del Archivo', 'Fecha', 'Estado']],
            body: imagenesData,
            theme: 'grid',
            headStyles: { fillColor: [0, 0, 0], textColor: 255 },
            styles: { fontSize: 8 },
            columnStyles: {
                0: { cellWidth: 15, halign: 'center' },
                1: { cellWidth: 80 },
                2: { cellWidth: 30 },
                3: { cellWidth: 45 }
            },
            margin: { left: 20, right: 20 }
        });

        yPosition = doc.lastAutoTable.finalY + 15;
    }

    // Piezas Recibidas - Siempre mostrar título
    if (yPosition > 200) {
        doc.addPage();
        yPosition = 20;
    }

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Piezas Recibidas', 20, yPosition);
    yPosition += 10;

    const piezasRecibidas = ficha.piezas ? ficha.piezas.filter(p => p.tipo === 'RECIBIDO') : [];

    if (piezasRecibidas.length > 0) {
        const piezasRecibidasData = piezasRecibidas.map(pieza => [
            pieza.nombre_pieza || 'N/A',
            pieza.codigo_pieza || 'N/A',
            pieza.cantidad.toString(),
            new Date(pieza.creado_en).toLocaleDateString('es-ES'),
            pieza.nota || ''
        ]);

        doc.autoTable({
            startY: yPosition,
            head: [['Nombre', 'Código', 'Cantidad', 'Fecha', 'Nota']],
            body: piezasRecibidasData,
            theme: 'grid',
            headStyles: { fillColor: [0, 0, 0], textColor: 255 },
            styles: { fontSize: 8 },
            columnStyles: {
                0: { cellWidth: 35 },
                1: { cellWidth: 25 },
                2: { cellWidth: 20, halign: 'center' },
                3: { cellWidth: 30 },
                4: { cellWidth: 60 }
            },
            margin: { left: 20, right: 20 }
        });

        yPosition = doc.lastAutoTable.finalY + 15;
    } else {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.text('No hay piezas recibidas registradas', 20, yPosition);
        yPosition += 15;
    }

    // Piezas Entregadas - Siempre mostrar título
    if (yPosition > 200) {
        doc.addPage();
        yPosition = 20;
    }

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Piezas Entregadas', 20, yPosition);
    yPosition += 10;

    const piezasEntregadas = ficha.piezas ? ficha.piezas.filter(p => p.tipo === 'ENTREGADO') : [];

    if (piezasEntregadas.length > 0) {
        const piezasEntregadasData = piezasEntregadas.map(pieza => [
            pieza.nombre_pieza || 'N/A',
            pieza.codigo_pieza || 'N/A',
            pieza.cantidad.toString(),
            new Date(pieza.creado_en).toLocaleDateString('es-ES'),
            pieza.nota || ''
        ]);

        doc.autoTable({
            startY: yPosition,
            head: [['Nombre', 'Código', 'Cantidad', 'Fecha', 'Nota']],
            body: piezasEntregadasData,
            theme: 'grid',
            headStyles: { fillColor: [0, 0, 0], textColor: 255 },
            styles: { fontSize: 8 },
            columnStyles: {
                0: { cellWidth: 35 },
                1: { cellWidth: 25 },
                2: { cellWidth: 20, halign: 'center' },
                3: { cellWidth: 30 },
                4: { cellWidth: 60 }
            },
            margin: { left: 20, right: 20 }
        });
    } else {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.text('No hay piezas entregadas registradas', 20, yPosition);
    }

    // Pie de página en todas las páginas
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(...secondaryColor);

        // Línea separadora
        doc.setDrawColor(...secondaryColor);
        doc.line(20, 280, 190, 280);

        // Información del pie
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

console.log('=== FichasTecnicas.js inicializado ===');

