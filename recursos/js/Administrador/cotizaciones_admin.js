// Módulo de Seguimiento de Proyectos - Administrador
let cotizacionesData = [];
let cotizacionActual = null;

function cargarCotizaciones() {
    fetch('../../controlador/Administrador/cotizaciones_admin_controller.php?accion=obtener_todas')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                cotizacionesData = data.cotizaciones;
                mostrarListaCotizaciones();
            } else {
                Swal.fire('Error', data.message || 'Error al cargar cotizaciones', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire('Error', 'Error de conexión', 'error');
        });
}

function mostrarListaCotizaciones() {
    const container = document.getElementById('cotizacionesList');
    if (!container) return;

    const html = cotizacionesData.map(cot => `
        <div class="cotizacion-card">
            <div class="card-header">
                <div class="card-id">#${cot.id_cotizacion}</div>
                <div class="card-status">
                    <span class="estado-badge estado-${cot.estado.toLowerCase().replace(/\s+/g, '_')}">${cot.estado}</span>
                </div>
            </div>
            <div class="card-body">
                <div class="card-info">
                    <div class="info-item">
                        <i class="fas fa-user"></i>
                        <span>${cot.nombre_completo}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-bicycle"></i>
                        <span>${cot.marca_bicicleta} ${cot.modelo_bicicleta}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-calendar"></i>
                        <span>${new Date(cot.creado_en).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
            <div class="card-actions">
                <button class="btn btn-primary" onclick="verCotizacion(${cot.id_cotizacion})">
                    <i class="fas fa-eye"></i> Ver Detalles
                </button>
            </div>
        </div>
    `).join('');
    container.innerHTML = html;
}

function verCotizacion(idCotizacion) {
    fetch(`../../controlador/Administrador/cotizaciones_admin_controller.php?accion=obtener_cotizacion&id_cotizacion=${idCotizacion}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                cotizacionActual = data.cotizacion;
                mostrarDetalleCotizacionEnPagina(data);
            } else {
                Swal.fire('Error', data.message || 'Error al cargar cotización', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire('Error', 'Error de conexión', 'error');
        });
}

function mostrarDetalleCotizacionEnPagina(data) {
    // Ocultar lista y mostrar detalle
    document.getElementById('cotizacionesList').style.display = 'none';
    document.getElementById('cotizacionDetail').style.display = 'block';

    // Definir el flujo de estados
    const flujoEstados = [
        'COTIZACIÓN ENVIADA',
        'ACEPTADA',
        'REPARACIÓN INICIADA',
        'PINTURA',
        'EMPACADO',
        'ENVIADO',
        'COMPLETADO'
    ];

    // Normalizar estado actual
    let estadoActual = data.cotizacion.estado;
    // Mapeo de estados antiguos a nuevos si es necesario
    if (estadoActual === 'COTIZACION_ENVIADA') estadoActual = 'COTIZACIÓN ENVIADA';
    if (estadoActual === 'REPARACION_INICIADA') estadoActual = 'REPARACIÓN INICIADA';
    if (estadoActual === 'COMPLETADA') estadoActual = 'COMPLETADO';

    // Determinar índice actual
    let indiceActual = flujoEstados.indexOf(estadoActual);

    // Generar opciones de estado
    let opcionesEstado = '';

    if (indiceActual === -1) {
        opcionesEstado += `<option value="${estadoActual}" selected>${estadoActual}</option>`;
        flujoEstados.forEach(estado => {
            opcionesEstado += `<option value="${estado}">${estado}</option>`;
        });
    } else {
        // Mostrar solo estados futuros (y el actual)
        for (let i = indiceActual; i < flujoEstados.length; i++) {
            const estado = flujoEstados[i];
            const selected = (estado === estadoActual) ? 'selected' : '';
            opcionesEstado += `<option value="${estado}" ${selected}>${estado}</option>`;
        }
    }

    const detailContainer = document.getElementById('cotizacionDetail');
    detailContainer.innerHTML = `
        <div class="detail-header">
            <button class="btn btn-outline" onclick="volverALista()">
                <i class="fas fa-arrow-left"></i> Volver a la Lista
            </button>
            <h2>Servicio #${data.cotizacion.id_cotizacion}</h2>
        </div>

        <div class="detail-content">
            <div class="detail-info">
                <div class="info-grid">
                    <div class="info-item">
                        <label>Cliente:</label>
                        <span>${data.cotizacion.nombre_completo}</span>
                    </div>
                    <div class="info-item">
                        <label>Email:</label>
                        <span>${data.cotizacion.correo_electronico}</span>
                    </div>
                    <div class="info-item">
                        <label>Teléfono:</label>
                        <span>${data.cotizacion.telefono}</span>
                    </div>
                    <div class="info-item">
                        <label>Dirección:</label>
                        <span>${data.cotizacion.direccion}</span>
                    </div>
                    <div class="info-item">
                        <label>Bicicleta:</label>
                        <span>${data.cotizacion.marca_bicicleta} ${data.cotizacion.modelo_bicicleta}</span>
                    </div>
                    <div class="info-item">
                        <label>Zona Afectada:</label>
                        <span>${data.cotizacion.zona_afectada}</span>
                    </div>
                    <div class="info-item">
                        <label>Tipo de Trabajo:</label>
                        <span class="work-type ${data.cotizacion.tipo_trabajo.toLowerCase().replace(/\s+/g, '_')}">${data.cotizacion.tipo_trabajo}</span>
                    </div>
                    <div class="info-item">
                        <label>Tipo de Reparación:</label>
                        <span>${data.cotizacion.tipo_reparacion}</span>
                    </div>
                    <div class="info-item">
                        <label>Descripción:</label>
                        <span>${data.cotizacion.descripcion_otros || 'N/A'}</span>
                    </div>
                    <div class="info-item">
                        <label>Reparación Aceptada por Cliente:</label>
                        <span class="client-acceptance ${data.cotizacion.reparacion_aceptada_cliente === 'ACEPTADA' ? 'accepted' : data.cotizacion.reparacion_aceptada_cliente === 'NO_ACEPTADA' ? 'rejected' : 'pending'}">${data.cotizacion.reparacion_aceptada_cliente || 'PENDIENTE'}</span>
                    </div>
                </div>

                <div class="damage-images-section">
                    <h4>Imágenes del Cliente (Daño Reportado)</h4>
                    <div id="imagenesClienteContainer" class="damage-images-grid"></div>
                </div>

                <hr style="margin: 30px 0; border-top: 1px solid #dee2e6;">

                <div class="damage-images-section">
                    <h4>Imágenes del Administrador (Progreso)</h4>
                    <div id="imagenesProgresoContainer" class="damage-images-grid"></div>
                    <div style="margin-top: 10px;">
                        <input type="file" id="nuevaImagenProgreso" accept="image/*" style="display: none;" onchange="subirImagenProgreso()">
                        <button class="btn btn-outline btn-sm" onclick="document.getElementById('nuevaImagenProgreso').click()">
                            <i class="fas fa-camera"></i> Agregar Imagen Admin
                        </button>
                    </div>
                </div>
            </div>

            <div class="detail-sections">
                <div class="section estado-section">
                    <h4>Actualizar Estado del Proyecto</h4>
                    <div class="estado-update">
                        <label>Seleccionar nuevo estado:</label>
                        <select id="estadoSelect" onchange="cambiarEstado(${data.cotizacion.id_cotizacion})">
                            ${opcionesEstado}
                        </select>
                    </div>
                </div>

                <div class="section">
                    <h4>Campos Administrativos</h4>
                    <div class="admin-fields">
                        <div class="field-group">
                            <label>Revisión de Cámaras:</label>
                            <input type="datetime-local" id="revisionCamaras" value="${data.cotizacion.revision_camaras || ''}" onchange="actualizarCampo(${data.cotizacion.id_cotizacion}, 'revision_camaras', this.value)">
                        </div>
                        <div class="field-group">
                            <label>Inspección Estética:</label>
                            <div id="inspeccionContainer">
                                <p id="inspeccionText">${data.cotizacion.inspeccion_estetica || 'No especificado'}</p>
                                <button class="btn btn-outline" onclick="editarInspeccion()">Editar Inspección</button>
                            </div>
                            <div id="inspeccionEdit" style="display: none;">
                                <textarea id="inspeccionTextarea" rows="4">${data.cotizacion.inspeccion_estetica || ''}</textarea>
                                <button class="btn btn-primary" onclick="guardarInspeccion(${data.cotizacion.id_cotizacion})">Guardar</button>
                                <button class="btn btn-outline" onclick="cancelarEdicionInspeccion()">Cancelar</button>
                            </div>
                        </div>
                        <div class="field-group">
                            <label>Empacado Salida:</label>
                            <input type="datetime-local" id="empacadoSalida" value="${data.cotizacion.empacado_salida || ''}" onchange="actualizarCampo(${data.cotizacion.id_cotizacion}, 'empacado_salida', this.value)">
                        </div>
                    </div>
                </div>

                <div class="section">
                    <h4>Observaciones por el Técnico</h4>
                    <div id="comentariosContainer"></div>
                    <div class="comentario-form">
                        <textarea id="nuevoComentario" placeholder="Escribe una observación..." rows="3"></textarea>
                        <button class="btn btn-primary" onclick="agregarComentario()">Agregar Observación</button>
                    </div>
                </div>

                <div class="section">
                    <div class="section-header">
                        <h4>Piezas del Servicio</h4>
                        <button class="btn btn-primary btn-sm" onclick="abrirModalAgregarPieza()">
                            <i class="fas fa-plus"></i> Agregar Pieza
                        </button>
                    </div>
                    <div id="piezasContainer"></div>
                </div>
            </div>
        </div>
    `;

    mostrarImagenesCliente(data.imagenes);
    mostrarImagenesProgreso(data.imagenes_progreso || []);
    mostrarPiezas(data.piezas);
    mostrarComentarios(data.comentarios);
}

function volverALista() {
    document.getElementById('cotizacionesList').style.display = 'grid';
    document.getElementById('cotizacionDetail').style.display = 'none';
}

function actualizarCampo(idCotizacion, campo, valor) {
    fetch('../../controlador/Administrador/cotizaciones_admin_controller.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
            accion: 'actualizar_campo',
            id_cotizacion: idCotizacion,
            campo: campo,
            valor: valor
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Opcional: mostrar mensaje de éxito
            } else {
                Swal.fire('Error', data.message || 'Error al actualizar campo', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire('Error', 'Error de conexión', 'error');
        });
}

function mostrarImagenesCliente(imagenes) {
    const container = document.getElementById('imagenesClienteContainer');
    if (!container) return;

    const html = imagenes.map(img => `
        <div class="damage-image-item" onclick="verImagenGrande('${img.ruta_imagen}')">
            <img src="../../${img.ruta_imagen}" alt="${img.nombre_archivo}">
            <div class="image-overlay">
                <i class="fas fa-search-plus"></i>
            </div>
            <div class="image-info">
                <small>${img.nombre_archivo}</small>
            </div>
        </div>
    `).join('');
    container.innerHTML = html;
}

function mostrarImagenesProgreso(imagenes) {
    const container = document.getElementById('imagenesProgresoContainer');
    if (!container) return;

    const html = imagenes.map(img => `
        <div class="imagen-item" style="position: relative;">
            <img src="../../${img.ruta_imagen}" alt="${img.nombre_archivo}" onclick="verImagenGrande('${img.ruta_imagen}')" onerror="this.onerror=null; this.src='../../recursos/img/no-image.png'">
            <small>${img.nombre_archivo}</small>
            <button onclick="eliminarImagenProgreso(${img.id_imagen}, '${img.ruta_imagen}')" style="position: absolute; top: 5px; right: 5px; background: rgba(220, 53, 69, 0.8); color: white; border: none; border-radius: 50%; width: 24px; height: 24px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                <i class="fas fa-times" style="font-size: 12px;"></i>
            </button>
        </div>
    `).join('');
    container.innerHTML = html;
}

function eliminarImagenProgreso(idImagen, rutaImagen) {
    Swal.fire({
        title: '¿Eliminar imagen?',
        text: "No podrás revertir esto",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch('../../controlador/Administrador/cotizaciones_admin_controller.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json; charset=utf-8' },
                body: JSON.stringify({
                    accion: 'eliminar_imagen',
                    id_imagen: idImagen,
                    ruta_imagen: rutaImagen
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        Swal.fire('Eliminado', 'La imagen ha sido eliminada.', 'success');
                        verCotizacion(cotizacionActual.id_cotizacion);
                    } else {
                        Swal.fire('Error', data.message || 'Error al eliminar imagen', 'error');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    Swal.fire('Error', 'Error de conexión', 'error');
                });
        }
    });
}

function subirImagenProgreso() {
    const fileInput = document.getElementById('nuevaImagenProgreso');
    const file = fileInput.files[0];
    if (!file) return;

    Swal.fire({
        title: 'Nombre de la imagen',
        input: 'text',
        inputLabel: 'Nombre para identificar la imagen',
        inputValue: file.name.split('.')[0],
        showCancelButton: true,
        confirmButtonText: 'Subir',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
            if (!value) {
                return '¡Debes escribir un nombre!';
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const nombrePersonalizado = result.value;
            const formData = new FormData();
            formData.append('accion', 'agregar_imagen');
            formData.append('id_cotizacion', cotizacionActual.id_cotizacion);
            formData.append('imagen', file);
            formData.append('nombre_personalizado', nombrePersonalizado);

            fetch('../../controlador/Administrador/cotizaciones_admin_controller.php', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        verCotizacion(cotizacionActual.id_cotizacion);
                        fileInput.value = '';
                        Swal.fire({
                            icon: 'success',
                            title: 'Imagen subida',
                            timer: 1500,
                            showConfirmButton: false
                        });
                    } else {
                        Swal.fire('Error', data.message || 'Error al subir imagen', 'error');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    Swal.fire('Error', 'Error de conexión', 'error');
                });
        } else {
            fileInput.value = '';
        }
    });
}

function editarInspeccion() {
    document.getElementById('inspeccionContainer').style.display = 'none';
    document.getElementById('inspeccionEdit').style.display = 'block';
}

function guardarInspeccion(idCotizacion) {
    const valor = document.getElementById('inspeccionTextarea').value;
    actualizarCampo(idCotizacion, 'inspeccion_estetica', valor);
    document.getElementById('inspeccionText').textContent = valor || 'No especificado';
    cancelarEdicionInspeccion();
}

function cancelarEdicionInspeccion() {
    document.getElementById('inspeccionContainer').style.display = 'block';
    document.getElementById('inspeccionEdit').style.display = 'none';
}

function mostrarPiezas(piezas) {
    const container = document.getElementById('piezasContainer');
    if (!container) return;

    const html = piezas.map(pieza => `
        <div class="pieza-item">
            <div class="pieza-header">
                <strong>${pieza.nombre_pieza}</strong>
                <span class="pieza-tipo ${pieza.tipo.toLowerCase()}">${pieza.tipo}</span>
                ${pieza.codigo_pieza ? `<small>Código: ${pieza.codigo_pieza}</small>` : ''}
            </div>
            <div class="pieza-body">
                <div class="pieza-info">
                    <span><strong>Cantidad:</strong> ${pieza.cantidad}</span>
                    <span><strong>Fecha:</strong> ${new Date(pieza.creado_en).toLocaleString()}</span>
                </div>
                ${pieza.nota ? `<p><strong>Nota:</strong> ${pieza.nota}</p>` : ''}
            </div>
            <div class="pieza-actions" style="margin-top: 10px; text-align: right;">
                <button class="btn btn-danger btn-sm" onclick="eliminarPieza(${pieza.id_movimiento}, '${pieza.nombre_pieza}')">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        </div>
    `).join('');
    container.innerHTML = html;
}

function abrirModalAgregarPieza() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content small-modal">
            <div class="modal-header">
                <h3><i class="fas fa-plus-circle"></i> Agregar Pieza Entregada</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <form class="pieza-form" onsubmit="event.preventDefault(); agregarPiezaDesdeModal();">
                    <div class="form-group">
                        <label for="modalNombrePieza">Nombre de la Pieza *</label>
                        <input type="text" id="modalNombrePieza" placeholder="Ej: Cadena, Manubrio, etc." required>
                    </div>
                    <div class="form-group">
                        <label for="modalCodigoPieza">Código (Opcional)</label>
                        <input type="text" id="modalCodigoPieza" placeholder="Código del fabricante">
                    </div>
                    <div class="form-group">
                        <label for="modalCantidadPieza">Cantidad *</label>
                        <input type="number" id="modalCantidadPieza" placeholder="1" min="1" value="1" required>
                    </div>
                    <div class="form-group">
                        <label for="modalNotaPieza">Nota Adicional</label>
                        <textarea id="modalNotaPieza" placeholder="Información adicional sobre la pieza..." rows="3"></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline" onclick="this.closest('.modal').remove()">
                    <i class="fas fa-times"></i> Cancelar
                </button>
                <button class="btn btn-primary" onclick="agregarPiezaDesdeModal()">
                    <i class="fas fa-save"></i> Agregar Pieza
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function agregarPiezaDesdeModal() {
    const nombre = document.getElementById('modalNombrePieza').value.trim();
    const codigo = document.getElementById('modalCodigoPieza').value.trim();
    const cantidad = parseInt(document.getElementById('modalCantidadPieza').value);
    const nota = document.getElementById('modalNotaPieza').value.trim();

    if (!nombre || cantidad <= 0) {
        Swal.fire('Error', 'Nombre y cantidad son obligatorios', 'error');
        return;
    }

    fetch('../../controlador/Administrador/cotizaciones_admin_controller.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
            accion: 'agregar_pieza',
            id_cotizacion: cotizacionActual.id_cotizacion,
            nombre: nombre,
            codigo: codigo,
            cantidad: cantidad,
            nota: nota
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.querySelector('.modal').remove();
                verCotizacion(cotizacionActual.id_cotizacion);
                Swal.fire('Éxito', 'Pieza entregada agregada correctamente', 'success');
            } else {
                Swal.fire('Error', data.message || 'Error al agregar pieza', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire('Error', 'Error de conexión', 'error');
        });
}

function eliminarPieza(idPieza, nombrePieza) {
    Swal.fire({
        title: '¿Eliminar pieza?',
        text: `¿Estás seguro de eliminar "${nombrePieza}"? Esta acción no se puede deshacer.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch('../../controlador/Administrador/cotizaciones_admin_controller.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json; charset=utf-8' },
                body: JSON.stringify({
                    accion: 'eliminar_pieza',
                    id_pieza: idPieza
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        Swal.fire('Eliminada', 'La pieza ha sido eliminada correctamente.', 'success');
                        verCotizacion(cotizacionActual.id_cotizacion);
                    } else {
                        Swal.fire('Error', data.message || 'Error al eliminar pieza', 'error');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    Swal.fire('Error', 'Error de conexión', 'error');
                });
        }
    });
}

function cambiarEstado(idCotizacion) {
    const estado = document.getElementById('estadoSelect').value;
    fetch('../../controlador/Administrador/cotizaciones_admin_controller.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
            accion: 'actualizar_estado',
            id_cotizacion: idCotizacion,
            estado: estado
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Swal.fire('Éxito', 'Estado actualizado correctamente', 'success');
                // Recargar detalle
                verCotizacion(idCotizacion);
            } else {
                Swal.fire('Error', data.message || 'Error al actualizar estado', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire('Error', 'Error de conexión', 'error');
        });
}


function mostrarImagenes(imagenes) {
    const container = document.getElementById('imagenesContainer');
    if (!container) return;

    const html = imagenes.map(img => `
        <div class="imagen-item">
            <img src="../${img.ruta_imagen}" alt="${img.nombre_archivo}" onclick="verImagenGrande('../${img.ruta_imagen}')">
            <small>${img.nombre_archivo}</small>
        </div>
    `).join('');
    container.innerHTML = html;
}

function verImagenGrande(ruta) {
    const modal = document.createElement('div');
    modal.className = 'modal active image-modal';
    modal.innerHTML = `
        <div class="modal-content image-modal-content">
            <div class="modal-header">
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <img src="../../${ruta}" alt="Imagen ampliada">
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function subirImagen() {
    const fileInput = document.getElementById('nuevaImagen');
    const file = fileInput.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('accion', 'agregar_imagen');
    formData.append('id_cotizacion', cotizacionActual.id_cotizacion);
    formData.append('imagen', file);

    fetch('../../controlador/Administrador/cotizaciones_admin_controller.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                verCotizacion(cotizacionActual.id_cotizacion);
                fileInput.value = '';
            } else {
                Swal.fire('Error', data.message || 'Error al subir imagen', 'error');
            }
        });
}

function mostrarComentarios(comentarios) {
    const container = document.getElementById('comentariosContainer');
    if (!container) return;

    const html = comentarios.map(c => `
        <div class="comentario-item">
            <div class="comentario-header">
                <strong>${c.autor}</strong>
                <small>${new Date(c.creado_en).toLocaleString()}</small>
            </div>
            <div class="comentario-body">${c.mensaje}</div>
        </div>
    `).join('');
    container.innerHTML = html;
}

function agregarComentario() {
    const textarea = document.getElementById('nuevoComentario');
    const mensaje = textarea.value.trim();
    if (!mensaje) return;

    fetch('../../controlador/Administrador/cotizaciones_admin_controller.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
            accion: 'agregar_comentario',
            id_cotizacion: cotizacionActual.id_cotizacion,
            mensaje: mensaje
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                textarea.value = '';
                verCotizacion(cotizacionActual.id_cotizacion);
            } else {
                Swal.fire('Error', data.message || 'Error al agregar comentario', 'error');
            }
        });
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function () {
    // Se llamará desde administrador.js cuando se active la sección
});

// Función para inicializar el módulo de cotizaciones
function initializeCotizaciones() {
    cargarCotizaciones();
}

// Función para inicializar el módulo de cotizaciones pendientes
function initializeCotizacionesPendientes() {
    cargarCotizacionesPendientes();
}

// Función para cargar cotizaciones pendientes
function cargarCotizacionesPendientes() {
    fetch('../../controlador/Administrador/cotizaciones_admin_controller.php?accion=obtener_todas')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Filtrar solo las cotizaciones pendientes
                const cotizacionesPendientes = data.cotizaciones.filter(cot => cot.estado === 'PENDIENTE');
                mostrarCotizacionesPendientes(cotizacionesPendientes);
            } else {
                Swal.fire('Error', data.message || 'Error al cargar cotizaciones pendientes', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire('Error', 'Error de conexión', 'error');
        });
}

// Función para mostrar cotizaciones pendientes en tabla
function mostrarCotizacionesPendientes(cotizaciones) {
    const container = document.getElementById('cotizacionesPendientesTable');
    if (!container) return;

    if (cotizaciones.length === 0) {
        container.innerHTML = `
            <div class="no-data">
                <i class="fas fa-clock fa-3x text-muted"></i>
                <h4>No hay cotizaciones pendientes</h4>
                <p>Todas las cotizaciones han sido procesadas.</p>
            </div>
        `;
        return;
    }

    // Crear tabla con Grid.js
    const gridData = cotizaciones.map(cot => ({
        id: cot.id_cotizacion,
        cliente: cot.nombre_completo,
        email: cot.correo_electronico,
        telefono: cot.telefono,
        bicicleta: `${cot.marca_bicicleta} ${cot.modelo_bicicleta}`,
        zona_afectada: cot.zona_afectada,
        tipo_trabajo: cot.tipo_trabajo,
        tipo_reparacion: cot.tipo_reparacion,
        fecha: new Date(cot.creado_en).toLocaleDateString('es-ES'),
        estado: `<select class="form-select form-select-sm estado-select" data-id="${cot.id_cotizacion}" onchange="cambiarEstadoCotizacionPendiente(this)">
                    <option value="PENDIENTE" selected>Pendiente</option>
                    <option value="EN_REVISION">En Revisión</option>
                    <option value="APROBADA">Aprobada</option>
                    <option value="RECHAZADA">Rechazada</option>
                    <option value="EN_PROCESO">En Proceso</option>
                    <option value="COMPLETADA">Completada</option>
                </select>`,
        acciones: `<button class="btn btn-sm btn-primary" onclick="verCotizacion(${cot.id_cotizacion})">
                    <i class="fas fa-eye"></i> Ver
                   </button>`
    }));

    new gridjs.Grid({
        columns: [
            { name: 'ID', id: 'id', width: '60px' },
            { name: 'Cliente', id: 'cliente' },
            { name: 'Email', id: 'email' },
            { name: 'Teléfono', id: 'telefono', width: '120px' },
            { name: 'Bicicleta', id: 'bicicleta' },
            { name: 'Zona Afectada', id: 'zona_afectada' },
            { name: 'Tipo Trabajo', id: 'tipo_trabajo' },
            { name: 'Tipo Reparación', id: 'tipo_reparacion' },
            { name: 'Fecha', id: 'fecha', width: '100px' },
            {
                name: 'Estado',
                formatter: (cell) => gridjs.html(cell),
                width: '140px'
            },
            {
                name: 'Acciones',
                formatter: (cell) => gridjs.html(cell),
                width: '80px'
            }
        ],
        data: gridData,
        search: {
            placeholder: '🔍 Buscar cotizaciones...'
        },
        pagination: {
            limit: 15,
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
                'background': 'linear-gradient(135deg, #1a1a1a 0%, #343a40 100%)',
                'color': '#ffffff',
                'border': '1px solid #495057',
                'padding': '12px 8px',
                'text-align': 'left',
                'font-weight': '700',
                'font-size': '13px',
                'text-transform': 'uppercase',
                'letter-spacing': '0.5px'
            },
            td: {
                'padding': '10px 8px',
                'border': '1px solid #dee2e6',
                'background-color': '#ffffff',
                'vertical-align': 'middle'
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
                'transition': 'border-color 0.2s ease'
            },
            pagination: {
                'margin-top': '20px',
                'padding': '10px 0'
            }
        }
    }).render(container);
}

// Función para cambiar estado de cotización pendiente
function cambiarEstadoCotizacionPendiente(selectElement) {
    const idCotizacion = selectElement.getAttribute('data-id');
    const nuevoEstado = selectElement.value;

    fetch('../../controlador/Administrador/cotizaciones_admin_controller.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
            accion: 'actualizar_estado',
            id_cotizacion: idCotizacion,
            estado: nuevoEstado
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Estado actualizado',
                    text: `La cotización #${idCotizacion} ha sido actualizada a "${nuevoEstado}".`,
                    timer: 2000,
                    showConfirmButton: false
                });

                // Recargar la tabla después de un breve delay
                setTimeout(() => {
                    cargarCotizacionesPendientes();
                }, 500);
            } else {
                Swal.fire('Error', data.message || 'Error al actualizar estado', 'error');
                // Revertir el select al estado anterior
                selectElement.value = 'PENDIENTE';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire('Error', 'Error de conexión', 'error');
            // Revertir el select al estado anterior
            selectElement.value = 'PENDIENTE';
        });
}

// Función para actualizar cotizaciones pendientes
function actualizarCotizacionesPendientes() {
    cargarCotizacionesPendientes();
}

// Función para filtrar cotizaciones pendientes
function filtrarCotizacionesPendientes() {
    const query = document.getElementById('buscadorCotizacionesPendientes').value.toLowerCase();

    // Obtener todas las filas de la tabla
    const rows = document.querySelectorAll('#cotizacionesPendientesTable .gridjs-tr');

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(query)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Función para filtrar por estado
function filtrarCotizacionesPendientesPorEstado() {
    const estadoFiltro = document.getElementById('estadoFiltroCotizacionesPendientes').value;

    if (estadoFiltro === 'todos') {
        cargarCotizacionesPendientes();
        return;
    }

    fetch('../../controlador/Administrador/cotizaciones_admin_controller.php?accion=obtener_todas')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                let cotizacionesFiltradas = data.cotizaciones;

                if (estadoFiltro === 'PENDIENTE') {
                    cotizacionesFiltradas = data.cotizaciones.filter(cot => cot.estado === 'PENDIENTE');
                } else if (estadoFiltro === 'RESPONDIDA') {
                    cotizacionesFiltradas = data.cotizaciones.filter(cot => cot.estado !== 'PENDIENTE');
                }

                mostrarCotizacionesPendientes(cotizacionesFiltradas);
            } else {
                Swal.fire('Error', data.message || 'Error al filtrar cotizaciones', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire('Error', 'Error de conexión', 'error');
        });
}

// Función para filtrar cotizaciones
function filtrarCotizaciones() {
    const query = document.getElementById('buscadorCotizaciones').value.toLowerCase();
    const filtered = cotizacionesData.filter(cot =>
        cot.nombre_completo.toLowerCase().includes(query) ||
        cot.marca_bicicleta.toLowerCase().includes(query) ||
        cot.modelo_bicicleta.toLowerCase().includes(query) ||
        cot.id_cotizacion.toString().includes(query)
    );
    mostrarListaCotizacionesFiltrada(filtered);
}

// Función para filtrar por estado
function filtrarCotizacionesPorEstado() {
    const estado = document.getElementById('estadoFiltroCotizaciones').value;
    let filtered = cotizacionesData;
    if (estado !== 'todos') {
        filtered = cotizacionesData.filter(cot => cot.estado === estado);
    }
    mostrarListaCotizacionesFiltrada(filtered);
}

// Función auxiliar para mostrar lista filtrada
function mostrarListaCotizacionesFiltrada(data) {
    const container = document.getElementById('cotizacionesList');
    if (!container) return;

    const html = data.map(cot => `
        <div class="cotizacion-card">
            <div class="card-header">
                <div class="card-id">#${cot.id_cotizacion}</div>
                <div class="card-status">
                    <span class="estado-badge estado-${cot.estado.toLowerCase().replace(/\s+/g, '_')}">${cot.estado}</span>
                </div>
            </div>
            <div class="card-body">
                <div class="card-info">
                    <div class="info-item">
                        <i class="fas fa-user"></i>
                        <span>${cot.nombre_completo}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-bicycle"></i>
                        <span>${cot.marca_bicicleta} ${cot.modelo_bicicleta}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-calendar"></i>
                        <span>${new Date(cot.creado_en).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
            <div class="card-actions">
                <button class="btn btn-primary" onclick="verCotizacion(${cot.id_cotizacion})">
                    <i class="fas fa-eye"></i> Ver Detalles
                </button>
            </div>
        </div>
    `).join('');
    container.innerHTML = html;
}