/**
 * Fichas Técnicas del Cliente
 * Archivo: recursos/js/Cliente/FichasTecnicas.js
 * Propósito: Manejar la visualización de fichas técnicas
 * Version: 1000
 */
console.log('FichasTecnicas.js Version 1000 loaded');

// Variables globales
let fichasActuales = [];
let fichaSeleccionada = null;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
    cargarFichasTecnicas();

    // Inicializar filtro de fichas técnicas
    const filtroEstado = document.getElementById('filtroEstadoFichas');
    if (filtroEstado) {
        filtroEstado.addEventListener('change', function () {
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
async function descargarFicha(idCotizacion) {
    console.log('Generando PDF con cambios finales Version 1000');

    // Buscar la ficha en las fichas actuales
    const ficha = fichasActuales.find(f => f.id_cotizacion == idCotizacion);
    if (!ficha) {
        Swal.fire('Error', 'Ficha técnica no encontrada', 'error');
        return;
    }

    // Mostrar loading
    Swal.fire({
        title: 'Generando PDF...',
        text: 'Por favor espere',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    try {
        // Crear PDF con jsPDF en formato A4 horizontal (landscape) - compacto
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });

        // Configuración de colores para diseño tipo formulario
        const blackColor = [0, 0, 0]; // Negro para texto y líneas
        const whiteColor = [255, 255, 255]; // Blanco para fondos

        let yPosition = 0;

        // Función para agregar encabezado de página
        const addPageHeader = async () => {
            // Logo real de TotalCarbon - subir 1.5cm más (de 15 a 0)
            try {
                const logoPath = '../../presentacion/assets/logo.png';
                // Cargar imagen como base64
                const logoBase64 = await getBase64ImageFromUrl(logoPath);
                doc.addImage(logoBase64, 'PNG', 20, 0, 25, 15);
            } catch (e) {
                console.error('Error cargando logo:', e);
                // Si no se puede cargar el logo, usar placeholder
                doc.setFillColor(...blackColor);
                doc.rect(20, 0, 25, 15, 'F');
                doc.setTextColor(...whiteColor);
                doc.setFontSize(6);
                doc.setFont('helvetica', 'bold');
                doc.text('LOGO', 22, 7);
            }

            // Campo MEDIDAS DE CAJA - también subir 1.5cm (de 22 a 7)
            doc.setTextColor(...blackColor);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text('MEDIDAS DE CAJA:', 50, 7); // Subido a 7

            // Tres recuadros juntos: Largo, Alto, Ancho - también subir
            doc.setDrawColor(0);
            doc.setFillColor(255, 255, 255);
            doc.rect(90, 4, 18, 8); // Subidos a 4
            doc.rect(110, 4, 18, 8);
            doc.rect(130, 4, 18, 8);


            // Título más pequeño, 1cm desde borde superior, 3cm a la izquierda
            doc.setFontSize(16); // Más pequeño de 18 a 16
            doc.setFont('helvetica', 'bold');
            doc.text('FICHA TÉCNICA', 168, 10); // 168mm (198 - 30)
        };

        // Agregar encabezado inicial
        await addPageHeader();

        // Fecha de generación en esquina superior derecha pegada en pequeño
        doc.setFontSize(6);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...blackColor);
        const fechaHora = new Date().toLocaleString('es-ES').replace(',', '');
        doc.text(fechaHora, 280, 5);

        // SECCIÓN: DATOS - 1cm debajo del logo (25mm), 1cm desde borde izquierdo (10mm)
        yPosition = 25; // 1cm debajo del logo (15mm logo + 10mm = 25mm)

        doc.setTextColor(...blackColor);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('DATOS', 10, yPosition); // 1cm desde borde izquierdo
        doc.rect(5, yPosition - 5, 120, 85); // Recuadro agrandado 2cm más a la derecha

        yPosition += 10;

        // Dibujar recuadros para datos más compactos
        const telefonoFinal = ficha.telefono_usuario || ficha.telefono || '';

        // Fecha
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text('Fecha:', 10, yPosition);
        doc.rect(25, yPosition - 3, 50, 5);
        doc.text(new Date(ficha.creado_en).toLocaleDateString('es-ES'), 27, yPosition);

        yPosition += 8;

        // Nombre
        doc.text('Nombre:', 10, yPosition);
        doc.rect(25, yPosition - 3, 50, 5);
        doc.text(ficha.nombre_completo || '', 27, yPosition);

        yPosition += 8;

        // Dirección
        doc.text('Dirección:', 10, yPosition);
        doc.rect(25, yPosition - 3, 50, 5);
        doc.text(ficha.direccion || '', 27, yPosition);

        yPosition += 8;

        // Marca
        doc.text('Marca:', 10, yPosition);
        doc.rect(25, yPosition - 3, 50, 5);
        doc.text(ficha.marca_bicicleta || '', 27, yPosition);

        yPosition += 8;

        // Modelo
        doc.text('Modelo:', 10, yPosition);
        doc.rect(25, yPosition - 3, 50, 5);
        doc.text(ficha.modelo_bicicleta || '', 27, yPosition);

        yPosition += 8;

        // Número de Tel
        doc.text('Tel:', 10, yPosition);
        doc.rect(25, yPosition - 3, 50, 5);
        doc.text(telefonoFinal, 27, yPosition);

        yPosition += 10;

        // Trabajo (3 opciones en fila)
        doc.setFontSize(7);
        doc.text('Trabajo:', 10, yPosition + 1.5);

        yPosition += 6;

        // EXPRESS
        if (ficha.tipo_trabajo === 'EXPRESS') {
            doc.setFillColor(0, 255, 0);
            doc.rect(10, yPosition - 2, 20, 5, 'F');
            doc.setTextColor(...blackColor);
        } else {
            doc.setFillColor(255, 255, 255);
            doc.rect(10, yPosition - 2, 20, 5, 'F');
            doc.setTextColor(...blackColor);
        }
        doc.rect(10, yPosition - 2, 20, 5);
        doc.text('EXPRESS', 11, yPosition);

        // NORMAL - Al lado
        if (ficha.tipo_trabajo === 'NORMAL') {
            doc.setFillColor(0, 255, 0);
            doc.rect(35, yPosition - 2, 20, 5, 'F');
            doc.setTextColor(...blackColor);
        } else {
            doc.setFillColor(255, 255, 255);
            doc.rect(35, yPosition - 2, 20, 5, 'F');
            doc.setTextColor(...blackColor);
        }
        doc.rect(35, yPosition - 2, 20, 5);
        doc.text('NORMAL', 36, yPosition);

        // PINTURA TOTAL - A la par de los otros dos, más pequeño .3mm
        if (ficha.tipo_trabajo === 'PINTURA_TOTAL') {
            doc.setFillColor(0, 255, 0);
            doc.rect(60, yPosition - 2, 24, 5, 'F');
            doc.setTextColor(...blackColor);
        } else {
            doc.setFillColor(255, 255, 255);
            doc.rect(60, yPosition - 2, 24, 5, 'F');
            doc.setTextColor(...blackColor);
        }
        doc.rect(60, yPosition - 2, 24, 5);
        doc.text('PINTURA TOTAL', 61, yPosition);

        // Días debajo de los botones
        doc.setFontSize(6);
        doc.text('8 días', 11, yPosition + 6);
        doc.text('15 días', 36, yPosition + 6);
        doc.text('30 días', 61, yPosition + 6);
        doc.setFontSize(8);

        // ZONA AFECTADA - 2mm debajo del bloque DATOS
        yPosition = 112; // 2mm debajo del bloque DATOS

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('ZONA AFECTADA', 10, yPosition);

        yPosition += 2; // 2mm debajo del texto

        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.text('TIPO DE REPARACIÓN', 10, yPosition);
        doc.rect(5, yPosition - 5, 120, 35); // Recuadro con botones 2mm debajo del texto

        yPosition += 6; // Menos espacio para inmediatamente debajo

        // TIPO DE REPARACIÓN - reorganizados
        // Primera fila: Fisura, Fractura, Reconstrucción, Adaptación
        if (ficha.tipo_reparacion.toLowerCase().includes('fisura')) {
            doc.setFillColor(0, 255, 0);
            doc.rect(10, yPosition - 2, 20, 5, 'F');
            doc.setTextColor(...blackColor);
        } else {
            doc.setFillColor(255, 255, 255);
            doc.rect(10, yPosition - 2, 20, 5, 'F');
            doc.setTextColor(...blackColor);
        }
        doc.rect(10, yPosition - 2, 20, 5);
        doc.text('Fisura', 11, yPosition + 1.5);

        if (ficha.tipo_reparacion.toLowerCase().includes('fractura')) {
            doc.setFillColor(0, 255, 0);
            doc.rect(35, yPosition - 2, 20, 5, 'F');
            doc.setTextColor(...blackColor);
        } else {
            doc.setFillColor(255, 255, 255);
            doc.rect(35, yPosition - 2, 20, 5, 'F');
            doc.setTextColor(...blackColor);
        }
        doc.rect(35, yPosition - 2, 20, 5);
        doc.text('Fractura', 36, yPosition + 1.5);

        if (ficha.tipo_reparacion.toLowerCase().includes('reconstruccion')) {
            doc.setFillColor(0, 255, 0);
            doc.rect(60, yPosition - 2, 25, 5, 'F');
            doc.setTextColor(...blackColor);
        } else {
            doc.setFillColor(255, 255, 255);
            doc.rect(60, yPosition - 2, 25, 5, 'F');
            doc.setTextColor(...blackColor);
        }
        doc.rect(60, yPosition - 2, 25, 5);
        doc.text('Reconstrucción', 61, yPosition + 1.5);

        if (ficha.tipo_reparacion.toLowerCase().includes('adaptacion')) {
            doc.setFillColor(0, 255, 0);
            doc.rect(90, yPosition - 2, 20, 5, 'F');
            doc.setTextColor(...blackColor);
        } else {
            doc.setFillColor(255, 255, 255);
            doc.rect(90, yPosition - 2, 20, 5, 'F');
            doc.setTextColor(...blackColor);
        }
        doc.rect(90, yPosition - 2, 20, 5);
        doc.text('Adaptación', 91, yPosition + 1.5);

        yPosition += 8;

        // Segunda fila: Otros
        if (ficha.descripcion_otros) {
            doc.setFillColor(0, 255, 0);
            doc.rect(10, yPosition - 2, 15, 5, 'F');
            doc.setTextColor(...blackColor);
        } else {
            doc.setFillColor(255, 255, 255);
            doc.rect(10, yPosition - 2, 15, 5, 'F');
            doc.setTextColor(...blackColor);
        }
        doc.rect(10, yPosition - 2, 15, 5);
        doc.text('Otros:', 11, yPosition + 1.5);
        doc.line(30, yPosition + 1.5, 80, yPosition + 1.5);

        // Casilla de check para aceptación de cambios, subir .9cm
        yPosition += 8; // .9cm menos
        doc.text('Cambios aceptados:', 10, yPosition);

        // Lógica de Checkbox SI/NO basada en BD
        const aceptada = ficha.reparacion_aceptada_cliente === 'ACEPTADA';
        const rechazada = ficha.reparacion_aceptada_cliente === 'NO_ACEPTADA';

        // Check Sí
        doc.setFillColor(aceptada ? 0 : 255);
        doc.rect(50, yPosition - 3, 5, 5, 'FD'); // Checkbox cuadradito
        doc.setTextColor(0);
        doc.text('Sí', 57, yPosition + 1);

        // Check No
        doc.setFillColor(rechazada ? 0 : 255);
        doc.rect(70, yPosition - 3, 5, 5, 'FD');
        doc.setTextColor(0);
        doc.text('No', 77, yPosition + 1);


        // NO AGREGAR IMAGEN EN LA PRIMERA PÁGINA - Removido por solicitud del usuario
        // (La imagen principal se quitó para tener solo datos en la primera página)


        // SECCIÓN DERECHA: CIRCUITO DE CAMARAS - a la altura de DATOS, agrandado otro cm
        const circuitoX = 134; // Inicio
        const circuitoY = 25; // A la altura del bloque DATOS
        const circuitoWidth = 163; // Agrandado otro cm
        const circuitoHeight = 15; // 1.5cm

        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('REVISIÓN CIRCUITO DE CÁMARAS', circuitoX, circuitoY);
        doc.rect(circuitoX - 5, circuitoY - 5, circuitoWidth, circuitoHeight);

        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        // CAMPOS DE LA BASE DE DATOS
        doc.text('Revisión:', circuitoX, circuitoY + 5);
        doc.rect(circuitoX + 20, circuitoY + 2, 50, 5);
        doc.text(ficha.revision_camaras || '', circuitoX + 21, circuitoY + 5);

        // INSPECCIÓN ESTÉTICA - 0.4cm debajo del bloque anterior, 3cm alto
        const inspeccionY = circuitoY + circuitoHeight + 4; // 0.4cm (4mm) debajo

        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('INSPECCIÓN ESTÉTICA', circuitoX, inspeccionY);
        doc.rect(circuitoX - 5, inspeccionY - 5, circuitoWidth, 30); // 3cm alto

        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.text('Daños estéticos:', circuitoX, inspeccionY + 5);
        doc.rect(circuitoX, inspeccionY + 7, circuitoWidth - 10, 15);
        doc.text(ficha.inspeccion_estetica || '', circuitoX + 2, inspeccionY + 12);

        // OBSERVACIONES DEL TÉCNICO - 0.4cm debajo, 4cm alto
        const observacionesY = inspeccionY + 30 + 4; // 0.4cm debajo

        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('OBSERVACIONES DEL TÉCNICO', circuitoX, observacionesY);
        doc.rect(circuitoX - 5, observacionesY - 5, circuitoWidth, 40); // 4cm alto

        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.text('Observaciones:', circuitoX, observacionesY + 5);
        doc.rect(circuitoX, observacionesY + 7, circuitoWidth - 10, 25);

        if (ficha.comentarios && ficha.comentarios.length > 0) {
            const ultimaObservacion = ficha.comentarios[ficha.comentarios.length - 1].mensaje;
            doc.text(ultimaObservacion.substring(0, 100).toUpperCase(), circuitoX + 2, observacionesY + 12);
        }


        // PIEZAS - 0.4cm debajo, 4cm alto
        const piezasY = observacionesY + 40 + 4; // 0.4cm debajo

        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('PIEZAS (Recibidas/enviadas)', circuitoX, piezasY);
        doc.rect(circuitoX + 80, piezasY - 2, 10, 5); // Recuadro pequeño para check
        doc.setFontSize(6);
        doc.text('Se marca al anexar al paquete', circuitoX + 95, piezasY);
        doc.setFontSize(8);
        doc.rect(circuitoX - 5, piezasY - 5, circuitoWidth, 40); // 4cm alto

        // Lógica de Grid para Piezas (3 columnas x 3 filas = 9 items)
        const piezasRecibidas = ficha.piezas ? ficha.piezas.filter(p => p.tipo === 'RECIBIDO') : [];

        const startX = circuitoX;
        const startY = piezasY + 5;
        const colWidth = (circuitoWidth - 10) / 3; // Dividir ancho disponible en 3 columnas
        const rowHeight = 10; // Altura de cada fila
        const boxHeight = 6;

        doc.setFontSize(6);
        doc.setFont('helvetica', 'normal');

        for (let i = 0; i < 9; i++) {
            // Calcular fila y columna
            const row = Math.floor(i / 3);
            const col = i % 3;

            const itemX = startX + (col * colWidth);
            const itemY = startY + (row * rowHeight);

            // Ancho relativo dentro de la celda
            const nameWidth = colWidth - 12; // Dejar espacio para cantidad
            const qtyWidth = 10;

            // Dibujar recuadros
            doc.rect(itemX, itemY, nameWidth, boxHeight); // Nombre
            doc.rect(itemX + nameWidth, itemY, qtyWidth, boxHeight); // Cantidad

            // Llenar datos si existen
            if (i < piezasRecibidas.length) {
                const pieza = piezasRecibidas[i];
                // Truncar nombre si es muy largo
                const nombre = pieza.nombre_pieza || 'N/A';
                doc.text(nombre.substring(0, 20), itemX + 1, itemY + 4);
                doc.text(String(pieza.cantidad), itemX + nameWidth + 2, itemY + 4);
            }
        }

        // EMPACADO/SALIDA - 0.4cm debajo, 1.5cm alto
        const empacadoY = piezasY + 40 + 4; // 0.4cm debajo

        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('EMPACADO / SALIDA', circuitoX, empacadoY);
        doc.rect(circuitoX - 5, empacadoY - 5, circuitoWidth, 15); // 1.5cm alto

        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.text('Empacado/Salida:', circuitoX, empacadoY + 5);
        doc.rect(circuitoX + 40, empacadoY + 2, 50, 5);
        doc.text(ficha.empacado_salida || '', circuitoX + 41, empacadoY + 5);


        // Agregar segunda página para imágenes - 4 imágenes por página (2x2)
        if (ficha.imagenes && ficha.imagenes.length > 0) {
            doc.addPage();
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('IMAGENES DE LA ZONA AFECTADA', 148, 20, { align: 'center' });

            const imgWidth = 130; // Más grandes para que se aprecien mejor
            const imgHeight = 80;
            const marginX = 10;
            const marginY = 30;
            const gapX = 10; // Espacio horizontal entre imágenes
            const gapY = 15; // Espacio vertical entre imágenes

            const imagesPerPage = 4; // 2x2 grid

            for (let pageImages = 0; pageImages < ficha.imagenes.length; pageImages += imagesPerPage) {
                if (pageImages > 0) {
                    doc.addPage();
                    doc.setFontSize(14);
                    doc.setFont('helvetica', 'bold');
                    doc.text('IMAGENES DE LA ZONA AFECTADA (continuación)', 148, 20, { align: 'center' });
                }

                // Dibujar hasta 4 imágenes en grid 2x2
                for (let gridPos = 0; gridPos < imagesPerPage && (pageImages + gridPos) < ficha.imagenes.length; gridPos++) {
                    const img = ficha.imagenes[pageImages + gridPos];

                    // Calcular posición en el grid (2 columnas x 2 filas)
                    const row = Math.floor(gridPos / 2);
                    const col = gridPos % 2;

                    const imgX = marginX + col * (imgWidth + gapX);
                    const imgY = marginY + row * (imgHeight + gapY);

                    // Dibujar recuadro alrededor
                    doc.rect(imgX - 2, imgY - 2, imgWidth + 4, imgHeight + 4);

                    try {
                        let imageUrl = img.ruta_imagen;
                        console.log('Cargando imagen para PDF:', imageUrl);
                        const imgBase64 = await getBase64ImageFromUrl(imageUrl);
                        doc.addImage(imgBase64, 'JPEG', imgX, imgY, imgWidth, imgHeight);
                        doc.setFontSize(7);
                        doc.setFont('helvetica', 'normal');
                        doc.text(img.nombre_archivo, imgX, imgY + imgHeight + 5);
                    } catch (e) {
                        console.error('Error cargando imagen:', e);
                        doc.rect(imgX, imgY, imgWidth, imgHeight);
                        doc.setFontSize(8);
                        doc.text('SIN IMAGEN', imgX + 40, imgY + 40);
                    }
                }
            }
        }


        // Descargar con nombre descriptivo
        const nombreArchivo = `Ficha_Tecnica_${ficha.marca_bicicleta}_${ficha.modelo_bicicleta}_${ficha.id_cotizacion}.pdf`;
        doc.save(nombreArchivo);

        Swal.close();
        Swal.fire({
            title: '¡PDF Generado!',
            text: 'La ficha técnica se ha descargado correctamente.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
        });
    } catch (error) {
        console.error('Error generando PDF:', error);
        Swal.close();
        Swal.fire('Error', 'No se pudo generar el PDF: ' + error.message, 'error');
    }
}

/**
 * Función auxiliar para convertir imagen URL a Base64
 */
function getBase64ImageFromUrl(url) {
    return new Promise((resolve, reject) => {
        var img = new Image();
        img.setAttribute('crossOrigin', 'anonymous');

        img.onload = function () {
            var canvas = document.createElement("canvas");
            canvas.width = this.width;
            canvas.height = this.height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(this, 0, 0);
            var dataURL = canvas.toDataURL("image/png"); // o jpeg
            resolve(dataURL);
        };

        img.onerror = function () {
            reject(new Error("No se pudo cargar la imagen: " + url));
        };

        img.src = url;
    });
}
