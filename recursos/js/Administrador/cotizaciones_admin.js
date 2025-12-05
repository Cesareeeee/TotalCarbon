// Módulo de Seguimiento de Proyectos - Administrador
let cotizacionesData = [];
let cotizacionActual = null;
let cotizacionDataActual = null;

function cargarCotizaciones() {
  return fetch(
    "../../controlador/Administrador/cotizaciones_admin_controller.php?accion=obtener_todas"
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        cotizacionesData = data.cotizaciones;
        mostrarListaCotizaciones();
      } else {
        Swal.fire(
          "Error",
          data.message || "Error al cargar cotizaciones",
          "error"
        );
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      Swal.fire("Error", "Error de conexión", "error");
    });
}

function mostrarListaCotizaciones() {
  const container = document.getElementById("cotizacionesList");
  if (!container) return;

  const html = cotizacionesData
    .map(
      (cot) => `
        <div class="cotizacion-card">
            <div class="card-header">
                <div class="card-id">#${cot.id_cotizacion}</div>
                <div class="card-status">
                    <span class="estado-badge estado-${cot.estado
                      .toLowerCase()
                      .replace(/\s+/g, "_")}">${cot.estado}</span>
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
                        <span>${cot.marca_bicicleta} ${
        cot.modelo_bicicleta
      }</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-calendar"></i>
                        <span>${new Date(
                          cot.creado_en
                        ).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
            <div class="card-actions">
                <button class="btn btn-primary" onclick="verCotizacion(${
                  cot.id_cotizacion
                })">
                    <i class="fas fa-eye"></i> Ver Detalles
                </button>
            </div>
        </div>
    `
    )
    .join("");
  container.innerHTML = html;
}

function verCotizacion(idCotizacion) {
  return fetch(
    `../../controlador/Administrador/cotizaciones_admin_controller.php?accion=obtener_cotizacion&id_cotizacion=${idCotizacion}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        cotizacionActual = data.cotizacion;
        mostrarDetalleCotizacionEnPagina(data);
      } else {
        Swal.fire(
          "Error",
          data.message || "Error al cargar cotización",
          "error"
        );
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      Swal.fire("Error", "Error de conexión", "error");
    });
}

function mostrarDetalleCotizacionEnPagina(data) {
  // Guardar datos actuales para descarga
  cotizacionDataActual = data;

  // Ocultar lista y mostrar detalle
  document.getElementById("cotizacionesList").style.display = "none";
  document.getElementById("cotizacionDetail").style.display = "block";

  // Definir el flujo de estados
  const flujoEstados = [
    "COTIZACIÓN ENVIADA",
    "APROBADA",
    "EN_PROCESO",
    "PINTURA",
    "EMPACADO",
    "ENVIADO",
    "COMPLETADO",
  ];

  // Normalizar estado actual
  let estadoActual = data.cotizacion.estado;
  // Mapeo de estados antiguos a nuevos si es necesario
  if (estadoActual === "COTIZACION_ENVIADA")
    estadoActual = "COTIZACIÓN ENVIADA";
  if (estadoActual === "REPARACION_INICIADA")
    estadoActual = "REPARACIÓN INICIADA";
  if (estadoActual === "COMPLETADA") estadoActual = "COMPLETADO";

  // Determinar índice actual
  let indiceActual = flujoEstados.indexOf(estadoActual);

  // Generar opciones de estado
  let opcionesEstado = "";

  const getEstadoText = (estado) => {
    if (estado === "EN_PROCESO") return "Reparación Iniciada";
    return estado;
  };

  if (indiceActual === -1) {
    opcionesEstado += `<option value="${estadoActual}" selected>${getEstadoText(estadoActual)}</option>`;
    flujoEstados.forEach((estado) => {
      opcionesEstado += `<option value="${estado}">${getEstadoText(estado)}</option>`;
    });
  } else {
    // Mostrar solo estados futuros (y el actual)
    for (let i = indiceActual; i < flujoEstados.length; i++) {
      const estado = flujoEstados[i];
      const selected = estado === estadoActual ? "selected" : "";
      opcionesEstado += `<option value="${estado}" ${selected}>${getEstadoText(estado)}</option>`;
    }
  }

  const detailContainer = document.getElementById("cotizacionDetail");
  detailContainer.innerHTML = `
        <div class="detail-header">
            <button class="btn btn-outline" onclick="volverALista()">
                <i class="fas fa-arrow-left"></i> Volver a la Lista
            </button>
            <h2>Servicio #${data.cotizacion.id_cotizacion}</h2>
            <button class="btn btn-primary" onclick="descargarFichaAdmin(${data.cotizacion.id_cotizacion})">
                <i class="fas fa-download"></i> Descargar Ficha Técnica
            </button>
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
                        <span>${data.cotizacion.marca_bicicleta} ${
    data.cotizacion.modelo_bicicleta
  }</span>
                    </div>
                    <div class="info-item">
                        <label>Zona Afectada:</label>
                        <span>${data.cotizacion.zona_afectada}</span>
                    </div>
                    <div class="info-item">
                        <label>Tipo de Trabajo:</label>
                        <span class="work-type ${data.cotizacion.tipo_trabajo
                          .toLowerCase()
                          .replace(/\s+/g, "_")}">${
    data.cotizacion.tipo_trabajo
  }</span>
                    </div>
                    <div class="info-item">
                        <label>Tipo de Reparación:</label>
                        <span>${data.cotizacion.tipo_reparacion}</span>
                    </div>
                    <div class="info-item">
                        <label>Descripción:</label>
                        <span>${
                          data.cotizacion.descripcion_otros || "N/A"
                        }</span>
                    </div>
                    <div class="info-item">
                        <label>Reparación Aceptada por Cliente:</label>
                        <span class="client-acceptance ${
                          data.cotizacion.reparacion_aceptada_cliente ===
                          "ACEPTADA"
                            ? "accepted"
                            : data.cotizacion.reparacion_aceptada_cliente ===
                              "NO_ACEPTADA"
                            ? "rejected"
                            : "pending"
                        }">${
    data.cotizacion.reparacion_aceptada_cliente || "PENDIENTE"
  }</span>
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
                        <select id="estadoSelect" onchange="cambiarEstado(${
                          data.cotizacion.id_cotizacion
                        }, this)">
                            ${opcionesEstado}
                        </select>
                        <button class="btn btn-regresar" onclick="mostrarSelectRegresarEstado()">REGRESAR ESTADO</button>
                        <div id="regresarEstadoContainer" style="display: none; margin-top: 10px;">
                            <label>Seleccionar estado anterior:</label>
                            <select id="regresarEstadoSelect" onchange="cambiarEstado(${
                              data.cotizacion.id_cotizacion
                            }, this)">
                                <option value="PENDIENTE">Pendiente</option>
                                <option value="APROBADA">Aprobada</option>
                                <option value="EN_PROCESO">Reparación Iniciada</option>
                                <option value="PINTURA">Pintura</option>
                                <option value="EMPACADO">Empacado</option>
                                <option value="ENVIADO">Enviado</option>
                                <option value="RECHAZADA">Rechazada</option>
                                <option value="COMPLETADO">Completado</option>
                               
                            </select>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <h4>Decisión del Cliente sobre Cambios</h4>
                    <div class="estado-update">
                        <label>¿El cliente aceptó los cambios propuestos?</label>
                        <div class="decision-buttons">
                            <button class="btn ${data.cotizacion.reparacion_aceptada_cliente === 'ACEPTADA' ? 'btn-success' : 'btn-outline-success'}" onclick="cambiarDecisionCliente('${data.cotizacion.id_cotizacion}', 'ACEPTADA')">
                                <i class="fas fa-check"></i> Aceptada
                            </button>
                            <button class="btn ${data.cotizacion.reparacion_aceptada_cliente === 'NO_ACEPTADA' ? 'btn-danger' : 'btn-outline-danger'}" onclick="cambiarDecisionCliente('${data.cotizacion.id_cotizacion}', 'NO_ACEPTADA')">
                                <i class="fas fa-times"></i> No Aceptada
                            </button>
                            <button class="btn ${data.cotizacion.reparacion_aceptada_cliente === 'PENDIENTE' || !data.cotizacion.reparacion_aceptada_cliente ? 'btn-warning' : 'btn-outline-warning'}" onclick="cambiarDecisionCliente('${data.cotizacion.id_cotizacion}', 'PENDIENTE')">
                                <i class="fas fa-clock"></i> Pendiente
                            </button>
                        </div>
                        <p class="text-muted small mt-2">Estado actual: <strong>${data.cotizacion.reparacion_aceptada_cliente || 'PENDIENTE'}</strong></p>
                    </div>
                </div>

                <div class="section">
                    <h4>Campos Administrativos</h4>
                    <div class="admin-fields">
                        <div class="field-group">
                            <label>Revisión de Cámaras:</label>
                            <input type="datetime-local" id="revisionCamaras" value="${
                              data.cotizacion.revision_camaras || ""
                            }" onchange="actualizarCampo(${
    data.cotizacion.id_cotizacion
  }, 'revision_camaras', this.value)">
                        </div>
                        <div class="field-group">
                            <label>Inspección Estética:</label>
                            <div id="inspeccionContainer">
                                <p id="inspeccionText">${
                                  data.cotizacion.inspeccion_estetica ||
                                  "No especificado"
                                }</p>
                                <button class="btn btn-outline" onclick="editarInspeccion()">Editar Inspección</button>
                            </div>
                            <div id="inspeccionEdit" style="display: none;">
                                <textarea id="inspeccionTextarea" rows="4">${
                                  data.cotizacion.inspeccion_estetica || ""
                                }</textarea>
                                <button class="btn btn-primary" onclick="guardarInspeccion(${
                                  data.cotizacion.id_cotizacion
                                })">Guardar</button>
                                <button class="btn btn-outline" onclick="cancelarEdicionInspeccion()">Cancelar</button>
                            </div>
                        </div>
                        <div class="field-group">
                            <label>Empacado Salida:</label>
                            <input type="datetime-local" id="empacadoSalida" value="${
                              data.cotizacion.empacado_salida || ""
                            }" onchange="actualizarCampo(${
    data.cotizacion.id_cotizacion
  }, 'empacado_salida', this.value)">
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

                ${
                  data.cotizacion.estado === "COMPLETADO"
                    ? `
                <div class="section">
                    <h4>Garantía</h4>
                    <div class="estado-update">
                        <button class="btn btn-success" onclick="openNuevaGarantiaModalCotizacion(${data.cotizacion.id_cotizacion})">
                            <i class="fas fa-shield-alt"></i> Agregar Garantía
                        </button>
                    </div>
                </div>
                `
                    : ""
                }

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
  document.getElementById("cotizacionesList").style.display = "grid";
  document.getElementById("cotizacionDetail").style.display = "none";
}

function actualizarCampo(idCotizacion, campo, valor) {
  fetch("../../controlador/Administrador/cotizaciones_admin_controller.php", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      accion: "actualizar_campo",
      id_cotizacion: idCotizacion,
      campo: campo,
      valor: valor,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // Opcional: mostrar mensaje de éxito
      } else {
        Swal.fire(
          "Error",
          data.message || "Error al actualizar campo",
          "error"
        );
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      Swal.fire("Error", "Error de conexión", "error");
    });
}

function mostrarImagenesCliente(imagenes) {
  const container = document.getElementById("imagenesClienteContainer");
  if (!container) return;

  const html = imagenes
    .map(
      (img) => `
        <div class="damage-image-item" onclick="verImagenGrande('${img.ruta_imagen}')">
            <img src="../../${img.ruta_imagen}" alt="${img.nombre_archivo}">
            <div class="image-overlay">
                <i class="fas fa-search-plus"></i>
            </div>
            <div class="image-info">
                <small>${img.nombre_archivo}</small>
            </div>
        </div>
    `
    )
    .join("");
  container.innerHTML = html;
}

function mostrarImagenesProgreso(imagenes) {
  const container = document.getElementById("imagenesProgresoContainer");
  if (!container) return;

  const html = imagenes
    .map(
      (img) => `
        <div class="imagen-item" style="position: relative;">
            <img src="../../${img.ruta_imagen}" alt="${img.nombre_archivo}" onclick="verImagenGrande('${img.ruta_imagen}')" onerror="this.onerror=null; this.src='../../recursos/img/no-image.png'">
            <small>${img.nombre_archivo}</small>
            <button onclick="eliminarImagenProgreso(${img.id_imagen}, '${img.ruta_imagen}')" style="position: absolute; top: 5px; right: 5px; background: rgba(220, 53, 69, 0.8); color: white; border: none; border-radius: 50%; width: 24px; height: 24px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                <i class="fas fa-times" style="font-size: 12px;"></i>
            </button>
        </div>
    `
    )
    .join("");
  container.innerHTML = html;
}

function eliminarImagenProgreso(idImagen, rutaImagen) {
  Swal.fire({
    title: "¿Eliminar imagen?",
    text: "No podrás revertir esto",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(
        "../../controlador/Administrador/cotizaciones_admin_controller.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json; charset=utf-8" },
          body: JSON.stringify({
            accion: "eliminar_imagen",
            id_imagen: idImagen,
            ruta_imagen: rutaImagen,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            Swal.fire("Eliminado", "La imagen ha sido eliminada.", "success");
            verCotizacion(cotizacionActual.id_cotizacion);
          } else {
            Swal.fire(
              "Error",
              data.message || "Error al eliminar imagen",
              "error"
            );
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          Swal.fire("Error", "Error de conexión", "error");
        });
    }
  });
}

function subirImagenProgreso() {
  const fileInput = document.getElementById("nuevaImagenProgreso");
  const file = fileInput.files[0];
  if (!file) return;

  Swal.fire({
    title: "Nombre de la imagen",
    input: "text",
    inputLabel: "Nombre para identificar la imagen",
    inputValue: file.name.split(".")[0],
    showCancelButton: true,
    confirmButtonText: "Subir",
    cancelButtonText: "Cancelar",
    inputValidator: (value) => {
      if (!value) {
        return "¡Debes escribir un nombre!";
      }
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const nombrePersonalizado = result.value;
      const formData = new FormData();
      formData.append("accion", "agregar_imagen");
      formData.append("id_cotizacion", cotizacionActual.id_cotizacion);
      formData.append("imagen", file);
      formData.append("nombre_personalizado", nombrePersonalizado);

      fetch(
        "../../controlador/Administrador/cotizaciones_admin_controller.php",
        {
          method: "POST",
          body: formData,
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            verCotizacion(cotizacionActual.id_cotizacion);
            fileInput.value = "";
            Swal.fire({
              icon: "success",
              title: "Imagen subida",
              timer: 1500,
              showConfirmButton: false,
            });
          } else {
            Swal.fire(
              "Error",
              data.message || "Error al subir imagen",
              "error"
            );
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          Swal.fire("Error", "Error de conexión", "error");
        });
    } else {
      fileInput.value = "";
    }
  });
}

function editarInspeccion() {
  document.getElementById("inspeccionContainer").style.display = "none";
  document.getElementById("inspeccionEdit").style.display = "block";
}

function guardarInspeccion(idCotizacion) {
  const valor = document.getElementById("inspeccionTextarea").value;
  actualizarCampo(idCotizacion, "inspeccion_estetica", valor);
  document.getElementById("inspeccionText").textContent =
    valor || "No especificado";
  cancelarEdicionInspeccion();
}

function cancelarEdicionInspeccion() {
  document.getElementById("inspeccionContainer").style.display = "block";
  document.getElementById("inspeccionEdit").style.display = "none";
}

function mostrarPiezas(piezas) {
  const container = document.getElementById("piezasContainer");
  if (!container) return;

  const html = piezas
    .map(
      (pieza) => `
        <div class="pieza-item">
            <div class="pieza-header">
                <strong>${pieza.nombre_pieza}</strong>
                <span class="pieza-tipo ${pieza.tipo.toLowerCase()}">${
        pieza.tipo
      }</span>
                ${
                  pieza.codigo_pieza
                    ? `<small>Código: ${pieza.codigo_pieza}</small>`
                    : ""
                }
            </div>
            <div class="pieza-body">
                <div class="pieza-info">
                    <span><strong>Cantidad:</strong> ${pieza.cantidad}</span>
                    <span><strong>Fecha:</strong> ${new Date(
                      pieza.creado_en
                    ).toLocaleString()}</span>
                </div>
                ${
                  pieza.nota
                    ? `<p><strong>Nota:</strong> ${pieza.nota}</p>`
                    : ""
                }
            </div>
            <div class="pieza-actions" style="margin-top: 10px; text-align: right;">
                <button class="btn btn-danger btn-sm" onclick="eliminarPieza(${
                  pieza.id_movimiento
                }, '${pieza.nombre_pieza}')">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        </div>
    `
    )
    .join("");
  container.innerHTML = html;
}

// Función para descargar ficha técnica desde admin
async function descargarFichaAdmin(idCotizacion) {
  console.log('Generando PDF para admin con id:', idCotizacion);

  // Usar cotizacionActual y cotizacionDataActual como ficha
  const ficha = {
    id_cotizacion: cotizacionActual.id_cotizacion,
    nombre_completo: cotizacionActual.nombre_completo,
    marca_bicicleta: cotizacionActual.marca_bicicleta,
    modelo_bicicleta: cotizacionActual.modelo_bicicleta,
    zona_afectada: cotizacionActual.zona_afectada,
    tipo_trabajo: cotizacionActual.tipo_trabajo,
    tipo_reparacion: cotizacionActual.tipo_reparacion,
    descripcion_otros: cotizacionActual.descripcion_otros,
    reparacion_aceptada_cliente: cotizacionActual.reparacion_aceptada_cliente,
    telefono_usuario: cotizacionActual.telefono,
    correo_electronico: cotizacionActual.correo_electronico,
    direccion: cotizacionActual.direccion,
    creado_en: cotizacionActual.creado_en,
    inspeccion_estetica: cotizacionActual.inspeccion_estetica,
    revision_camaras: cotizacionActual.revision_camaras,
    empacado_salida: cotizacionActual.empacado_salida,
    imagenes: cotizacionDataActual ? cotizacionDataActual.imagenes || [] : [],
    comentarios: cotizacionDataActual ? cotizacionDataActual.comentarios || [] : [],
    piezas: cotizacionDataActual ? cotizacionDataActual.piezas || [] : []
  };

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
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    let yPosition = 0;

    const addPageHeader = async () => {
      try {
        const logoPath = '../../presentacion/assets/logo.png';
        const logoBase64 = await getBase64ImageFromUrl(logoPath);
        doc.addImage(logoBase64, 'PNG', 20, 0, 25, 15);
      } catch (e) {
        doc.setFillColor(0);
        doc.rect(20, 0, 25, 15, 'F');
        doc.setTextColor(255);
        doc.setFontSize(6);
        doc.setFont('helvetica', 'bold');
        doc.text('LOGO', 22, 7);
      }

      doc.setTextColor(0);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('MEDIDAS DE CAJA:', 50, 7);

      doc.setFillColor(255);
      doc.rect(90, 4, 18, 8);
      doc.rect(110, 4, 18, 8);
      doc.rect(130, 4, 18, 8);

      doc.setFontSize(16);
      doc.text('FICHA TÉCNICA', 168, 10, { align: 'center' });
    };

    await addPageHeader();

    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    const fechaHora = new Date().toLocaleString('es-ES').replace(',', '');
    doc.text(fechaHora, 280, 5);

    yPosition = 25;

    doc.setFontSize(10);
    doc.text('DATOS', 10, yPosition);
    doc.rect(5, yPosition - 5, 120, 85);

    yPosition += 10;

    const telefonoFinal = ficha.telefono_usuario || ficha.telefono || '';

    doc.setFontSize(8);
    doc.text('Fecha:', 10, yPosition);
    doc.rect(25, yPosition - 3, 50, 5);
    doc.text(new Date(ficha.creado_en).toLocaleDateString('es-ES'), 27, yPosition);

    yPosition += 8;

    doc.text('Nombre:', 10, yPosition);
    doc.rect(25, yPosition - 3, 50, 5);
    doc.text(ficha.nombre_completo || '', 27, yPosition);

    yPosition += 8;

    doc.text('Dirección:', 10, yPosition);
    doc.rect(25, yPosition - 3, 50, 5);
    doc.text(ficha.direccion || '', 27, yPosition);

    yPosition += 8;

    doc.text('Marca:', 10, yPosition);
    doc.rect(25, yPosition - 3, 50, 5);
    doc.text(ficha.marca_bicicleta || '', 27, yPosition);

    yPosition += 8;

    doc.text('Modelo:', 10, yPosition);
    doc.rect(25, yPosition - 3, 50, 5);
    doc.text(ficha.modelo_bicicleta || '', 27, yPosition);

    yPosition += 8;

    doc.text('Tel:', 10, yPosition);
    doc.rect(25, yPosition - 3, 50, 5);
    doc.text(telefonoFinal, 27, yPosition);

    yPosition += 10;

    doc.setFontSize(7);
    doc.text('Trabajo:', 10, yPosition + 1.5);

    yPosition += 6;

    if (ficha.tipo_trabajo === 'EXPRESS') {
      doc.setFillColor(0, 255, 0);
      doc.rect(10, yPosition - 2, 20, 5, 'F');
      doc.setTextColor(0);
    } else {
      doc.setFillColor(255);
      doc.rect(10, yPosition - 2, 20, 5, 'F');
      doc.setTextColor(0);
    }
    doc.rect(10, yPosition - 2, 20, 5);
    doc.text('EXPRESS', 11, yPosition);

    if (ficha.tipo_trabajo === 'NORMAL') {
      doc.setFillColor(0, 255, 0);
      doc.rect(35, yPosition - 2, 20, 5, 'F');
      doc.setTextColor(0);
    } else {
      doc.setFillColor(255);
      doc.rect(35, yPosition - 2, 20, 5, 'F');
      doc.setTextColor(0);
    }
    doc.rect(35, yPosition - 2, 20, 5);
    doc.text('NORMAL', 36, yPosition);

    if (ficha.tipo_trabajo === 'PINTURA_TOTAL') {
      doc.setFillColor(0, 255, 0);
      doc.rect(60, yPosition - 2, 24, 5, 'F');
      doc.setTextColor(0);
    } else {
      doc.setFillColor(255);
      doc.rect(60, yPosition - 2, 24, 5, 'F');
      doc.setTextColor(0);
    }
    doc.rect(60, yPosition - 2, 24, 5);
    doc.text('PINTURA TOTAL', 61, yPosition);

    doc.setFontSize(6);
    doc.text('8 días', 11, yPosition + 6);
    doc.text('15 días', 36, yPosition + 6);
    doc.text('30 días', 61, yPosition + 6);
    doc.setFontSize(8);

    yPosition = 112;

    doc.setFontSize(10);
    doc.text('ZONA AFECTADA', 10, yPosition);
    doc.rect(5, yPosition - 5, 120, 35);

    yPosition += 6;

    doc.setFontSize(7);
    doc.text('TIPO DE REPARACIÓN', 10, yPosition);

    yPosition += 6;

    if (ficha.tipo_reparacion.toLowerCase().includes('fisura')) {
      doc.setFillColor(0, 255, 0);
      doc.rect(10, yPosition - 2, 20, 5, 'F');
      doc.setTextColor(0);
    } else {
      doc.setFillColor(255);
      doc.rect(10, yPosition - 2, 20, 5, 'F');
      doc.setTextColor(0);
    }
    doc.rect(10, yPosition - 2, 20, 5);
    doc.text('Fisura', 11, yPosition + 1.5);

    if (ficha.tipo_reparacion.toLowerCase().includes('fractura')) {
      doc.setFillColor(0, 255, 0);
      doc.rect(35, yPosition - 2, 20, 5, 'F');
      doc.setTextColor(0);
    } else {
      doc.setFillColor(255);
      doc.rect(35, yPosition - 2, 20, 5, 'F');
      doc.setTextColor(0);
    }
    doc.rect(35, yPosition - 2, 20, 5);
    doc.text('Fractura', 36, yPosition + 1.5);

    if (ficha.tipo_reparacion.toLowerCase().includes('reconstruccion')) {
      doc.setFillColor(0, 255, 0);
      doc.rect(60, yPosition - 2, 25, 5, 'F');
      doc.setTextColor(0);
    } else {
      doc.setFillColor(255);
      doc.rect(60, yPosition - 2, 25, 5, 'F');
      doc.setTextColor(0);
    }
    doc.rect(60, yPosition - 2, 25, 5);
    doc.text('Reconstrucción', 61, yPosition + 1.5);

    if (ficha.tipo_reparacion.toLowerCase().includes('adaptacion')) {
      doc.setFillColor(0, 255, 0);
      doc.rect(90, yPosition - 2, 20, 5, 'F');
      doc.setTextColor(0);
    } else {
      doc.setFillColor(255);
      doc.rect(90, yPosition - 2, 20, 5, 'F');
      doc.setTextColor(0);
    }
    doc.rect(90, yPosition - 2, 20, 5);
    doc.text('Adaptación', 91, yPosition + 1.5);

    yPosition += 8;

    if (ficha.descripcion_otros) {
      doc.setFillColor(0, 255, 0);
      doc.rect(10, yPosition - 2, 15, 5, 'F');
      doc.setTextColor(0);
    } else {
      doc.setFillColor(255);
      doc.rect(10, yPosition - 2, 15, 5, 'F');
      doc.setTextColor(0);
    }
    doc.rect(10, yPosition - 2, 15, 5);
    doc.text('Otros:', 11, yPosition + 1.5);
    doc.line(30, yPosition + 1.5, 80, yPosition + 1.5);

    yPosition += 8;
    doc.text('Cambios aceptados:', 10, yPosition);

    const aceptada = ficha.reparacion_aceptada_cliente === 'ACEPTADA';
    const rechazada = ficha.reparacion_aceptada_cliente === 'NO_ACEPTADA';

    doc.setFillColor(aceptada ? 0 : 255);
    doc.rect(50, yPosition - 3, 5, 5, 'FD');
    doc.setTextColor(0);
    doc.text('Sí', 57, yPosition + 1);

    doc.setFillColor(rechazada ? 0 : 255);
    doc.rect(70, yPosition - 3, 5, 5, 'FD');
    doc.setTextColor(0);
    doc.text('No', 77, yPosition + 1);

    const circuitoX = 134;
    const circuitoY = 25;
    const circuitoWidth = 163;
    const circuitoHeight = 15;

    doc.setFontSize(8);
    doc.text('REVISIÓN CIRCUITO DE CÁMARAS', circuitoX, circuitoY);
    doc.rect(circuitoX - 5, circuitoY - 5, circuitoWidth, circuitoHeight);

    doc.setFontSize(7);
    doc.text('Revisión:', circuitoX, circuitoY + 5);
    doc.rect(circuitoX + 20, circuitoY + 2, 50, 5);
    doc.text(ficha.revision_camaras || '', circuitoX + 21, circuitoY + 5);

    const inspeccionY = circuitoY + circuitoHeight + 4;

    doc.setFontSize(8);
    doc.text('INSPECCIÓN ESTÉTICA', circuitoX, inspeccionY);
    doc.rect(circuitoX - 5, inspeccionY - 5, circuitoWidth, 30);

    doc.setFontSize(7);
    doc.text('Daños estéticos:', circuitoX, inspeccionY + 5);
    doc.rect(circuitoX, inspeccionY + 7, circuitoWidth - 10, 15);
    doc.text(ficha.inspeccion_estetica || '', circuitoX + 2, inspeccionY + 12);

    const observacionesY = inspeccionY + 30 + 4;

    doc.setFontSize(8);
    doc.text('OBSERVACIONES DEL TÉCNICO', circuitoX, observacionesY);
    doc.rect(circuitoX - 5, observacionesY - 5, circuitoWidth, 40);

    doc.setFontSize(7);
    doc.text('Observaciones:', circuitoX, observacionesY + 5);
    doc.rect(circuitoX, observacionesY + 7, circuitoWidth - 10, 25);

    if (ficha.comentarios && ficha.comentarios.length > 0) {
      const ultimaObservacion = ficha.comentarios[ficha.comentarios.length - 1].mensaje;
      doc.text(ultimaObservacion.substring(0, 100).toUpperCase(), circuitoX + 2, observacionesY + 12);
    }

    const piezasY = observacionesY + 40 + 4;

    doc.setFontSize(8);
    doc.text('PIEZAS (Recibidas/enviadas)', circuitoX, piezasY);
    doc.rect(circuitoX + 80, piezasY - 2, 10, 5);
    doc.setFontSize(6);
    doc.text('Se marca al anexar al paquete', circuitoX + 95, piezasY);
    doc.setFontSize(8);
    doc.rect(circuitoX - 5, piezasY - 5, circuitoWidth, 40);

    const piezasRecibidas = ficha.piezas ? ficha.piezas.filter(p => p.tipo === 'RECIBIDO') : [];

    const startX = circuitoX;
    const startY = piezasY + 5;
    const colWidth = (circuitoWidth - 10) / 3;
    const rowHeight = 10;
    const boxHeight = 6;

    doc.setFontSize(6);
    for (let i = 0; i < 9; i++) {
      const row = Math.floor(i / 3);
      const col = i % 3;

      const itemX = startX + (col * colWidth);
      const itemY = startY + (row * rowHeight);

      const nameWidth = colWidth - 12;
      const qtyWidth = 10;

      doc.rect(itemX, itemY, nameWidth, boxHeight);
      doc.rect(itemX + nameWidth, itemY, qtyWidth, boxHeight);

      if (i < piezasRecibidas.length) {
        const pieza = piezasRecibidas[i];
        doc.text(pieza.nombre_pieza || 'N/A', itemX + 1, itemY + 4);
        doc.text(String(pieza.cantidad), itemX + nameWidth + 2, itemY + 4);
      }
    }

    const empacadoY = piezasY + 40 + 4;

    doc.setFontSize(8);
    doc.text('EMPACADO / SALIDA', circuitoX, empacadoY);
    doc.rect(circuitoX - 5, empacadoY - 5, circuitoWidth, 15);

    doc.setFontSize(7);
    doc.text('Empacado/Salida:', circuitoX, empacadoY + 5);
    doc.rect(circuitoX + 40, empacadoY + 2, 50, 5);
    doc.text(ficha.empacado_salida || '', circuitoX + 41, empacadoY + 5);

    // Imágenes si hay
    if (ficha.imagenes && ficha.imagenes.length > 0) {
      doc.addPage();
      doc.setFontSize(14);
      doc.text('IMAGENES DE LA ZONA AFECTADA', 148, 20, { align: 'center' });

      const imgWidth = 130;
      const imgHeight = 80;
      const marginX = 10;
      const marginY = 30;
      const gapX = 10;
      const gapY = 15;
      const imagesPerPage = 4;

      for (let pageImages = 0; pageImages < ficha.imagenes.length; pageImages += imagesPerPage) {
        if (pageImages > 0) {
          doc.addPage();
          doc.setFontSize(14);
          doc.text('IMAGENES DE LA ZONA AFECTADA (continuación)', 148, 20, { align: 'center' });
        }

        for (let gridPos = 0; gridPos < imagesPerPage && (pageImages + gridPos) < ficha.imagenes.length; gridPos++) {
          const img = ficha.imagenes[pageImages + gridPos];

          const row = Math.floor(gridPos / 2);
          const col = gridPos % 2;

          const imgX = marginX + col * (imgWidth + gapX);
          const imgY = marginY + row * (imgHeight + gapY);

          doc.rect(imgX - 2, imgY - 2, imgWidth + 4, imgHeight + 4);

          try {
            let imageUrl = "../../" + img.ruta_imagen;
            const imgBase64 = await getBase64ImageFromUrl(imageUrl);
            doc.addImage(imgBase64, 'JPEG', imgX, imgY, imgWidth, imgHeight);
            doc.setFontSize(7);
            doc.text(img.nombre_archivo, imgX, imgY + imgHeight + 5);
          } catch (e) {
            doc.rect(imgX, imgY, imgWidth, imgHeight);
            doc.setFontSize(8);
            doc.text('SIN IMAGEN', imgX + 40, imgY + 40);
          }
        }
      }
    }

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

function abrirModalAgregarPieza() {
  const modal = document.createElement("div");
  modal.className = "modal active";
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
  const nombre = document.getElementById("modalNombrePieza").value.trim();
  const codigo = document.getElementById("modalCodigoPieza").value.trim();
  const cantidad = parseInt(
    document.getElementById("modalCantidadPieza").value
  );
  const nota = document.getElementById("modalNotaPieza").value.trim();

  if (!nombre || cantidad <= 0) {
    Swal.fire("Error", "Nombre y cantidad son obligatorios", "error");
    return;
  }

  fetch("../../controlador/Administrador/cotizaciones_admin_controller.php", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      accion: "agregar_pieza",
      id_cotizacion: cotizacionActual.id_cotizacion,
      nombre: nombre,
      codigo: codigo,
      cantidad: cantidad,
      nota: nota,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        document.querySelector(".modal").remove();
        verCotizacion(cotizacionActual.id_cotizacion);
        Swal.fire("Éxito", "Pieza entregada agregada correctamente", "success");
      } else {
        Swal.fire("Error", data.message || "Error al agregar pieza", "error");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      Swal.fire("Error", "Error de conexión", "error");
    });
}

function eliminarPieza(idPieza, nombrePieza) {
  Swal.fire({
    title: "¿Eliminar pieza?",
    text: `¿Estás seguro de eliminar "${nombrePieza}"? Esta acción no se puede deshacer.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(
        "../../controlador/Administrador/cotizaciones_admin_controller.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json; charset=utf-8" },
          body: JSON.stringify({
            accion: "eliminar_pieza",
            id_pieza: idPieza,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            Swal.fire(
              "Eliminada",
              "La pieza ha sido eliminada correctamente.",
              "success"
            );
            verCotizacion(cotizacionActual.id_cotizacion);
          } else {
            Swal.fire(
              "Error",
              data.message || "Error al eliminar pieza",
              "error"
            );
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          Swal.fire("Error", "Error de conexión", "error");
        });
    }
  });
}

function cambiarEstado(idCotizacion, selectElement) {
  const estado = selectElement.value;

  // Mostrar confirmación
  Swal.fire({
    title: "¿Cambiar estado?",
    text: `¿Estás seguro de cambiar el estado a "${estado}"?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#1a1a1a",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Sí, cambiar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(
        "../../controlador/Administrador/cotizaciones_admin_controller.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json; charset=utf-8" },
          body: JSON.stringify({
            accion: "actualizar_estado",
            id_cotizacion: idCotizacion,
            estado: estado,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            Swal.fire("Éxito", "Estado actualizado correctamente", "success");
            // Recargar detalle
            verCotizacion(idCotizacion).then(() => {
              // Si el nuevo estado es COMPLETADO, abrir modal de garantía
              if (estado === "COMPLETADO") {
                setTimeout(() => {
                  openNuevaGarantiaModalCotizacion(idCotizacion);
                }, 500); // Pequeño delay para asegurar que se recargue
              }
            });
          } else {
            Swal.fire(
              "Error",
              data.message || "Error al actualizar estado",
              "error"
            );
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          Swal.fire("Error", "Error de conexión", "error");
        });
    }
  });
}

function mostrarImagenes(imagenes) {
  const container = document.getElementById("imagenesContainer");
  if (!container) return;

  const html = imagenes
    .map(
      (img) => `
        <div class="imagen-item">
            <img src="../${img.ruta_imagen}" alt="${img.nombre_archivo}" onclick="verImagenGrande('../${img.ruta_imagen}')">
            <small>${img.nombre_archivo}</small>
        </div>
    `
    )
    .join("");
  container.innerHTML = html;
}

function verImagenGrande(ruta) {
  const modal = document.createElement("div");
  modal.className = "modal active image-modal";
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
  const fileInput = document.getElementById("nuevaImagen");
  const file = fileInput.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("accion", "agregar_imagen");
  formData.append("id_cotizacion", cotizacionActual.id_cotizacion);
  formData.append("imagen", file);

  fetch("../../controlador/Administrador/cotizaciones_admin_controller.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        verCotizacion(cotizacionActual.id_cotizacion);
        fileInput.value = "";
      } else {
        Swal.fire("Error", data.message || "Error al subir imagen", "error");
      }
    });
}

function mostrarComentarios(comentarios) {
  const container = document.getElementById("comentariosContainer");
  if (!container) return;

  const html = comentarios
    .map(
      (c) => `
        <div class="comentario-item">
            <div class="comentario-header">
                <strong>${c.autor}</strong>
                <small>${new Date(c.creado_en).toLocaleString()}</small>
                <button class="btn btn-danger btn-sm" onclick="eliminarComentario(${c.id_comentario}, '${c.autor}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="comentario-body">${c.mensaje}</div>
        </div>
    `
    )
    .join("");
  container.innerHTML = html;
}

function agregarComentario() {
  const textarea = document.getElementById("nuevoComentario");
  const mensaje = textarea.value.trim();
  if (!mensaje) return;

  fetch("../../controlador/Administrador/cotizaciones_admin_controller.php", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      accion: "agregar_comentario",
      id_cotizacion: cotizacionActual.id_cotizacion,
      mensaje: mensaje,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        textarea.value = "";
        verCotizacion(cotizacionActual.id_cotizacion);
      } else {
        Swal.fire(
          "Error",
          data.message || "Error al agregar comentario",
          "error"
        );
      }
    });
}

function eliminarComentario(idComentario, autor) {
  Swal.fire({
    title: "¿Eliminar comentario?",
    text: `¿Estás seguro de eliminar el comentario de "${autor}"? Esta acción no se puede deshacer.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch("../../controlador/Administrador/cotizaciones_admin_controller.php", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          accion: "eliminar_comentario",
          id_comentario: idComentario,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            Swal.fire(
              "Eliminado",
              "El comentario ha sido eliminado correctamente.",
              "success"
            );
            verCotizacion(cotizacionActual.id_cotizacion);
          } else {
            Swal.fire(
              "Error",
              data.message || "Error al eliminar comentario",
              "error"
            );
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          Swal.fire("Error", "Error de conexión", "error");
        });
    }
  });
}

function cambiarDecisionCliente(idCotizacion, decision) {
  const decisionesTexto = {
    'ACEPTADA': 'aceptó',
    'NO_ACEPTADA': 'no aceptó',
    'PENDIENTE': 'tiene pendiente'
  };

  Swal.fire({
    title: "¿Cambiar decisión del cliente?",
    text: `¿Confirmas que el cliente ${decisionesTexto[decision]} los cambios propuestos?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#1a1a1a",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Sí, cambiar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      actualizarCampo(idCotizacion, 'reparacion_aceptada_cliente', decision);
      // Recargar la cotización para reflejar el cambio
      setTimeout(() => {
        verCotizacion(idCotizacion);
      }, 500);
    }
  });
}

// Inicializar cuando se carga la página
document.addEventListener("DOMContentLoaded", function () {
  // Se llamará desde administrador.js cuando se active la sección
});

// Función para inicializar el módulo de cotizaciones
function initializeCotizaciones() {
  cargarCotizaciones().then(() => {
    filtrarCotizacionesPorEstado();
  });
}

// Función para mostrar/ocultar el select de regresar estado
function mostrarSelectRegresarEstado() {
  const container = document.getElementById("regresarEstadoContainer");
  if (container.style.display === "none") {
    container.style.display = "block";
  } else {
    container.style.display = "none";
  }
}

// Función para abrir modal de nueva garantía desde cotización
function openNuevaGarantiaModalCotizacion(idCotizacion) {
  // Obtener información del servicio actual
  fetch(
    `../../controlador/Administrador/cotizaciones_admin_controller.php?accion=obtener_cotizacion&id_cotizacion=${idCotizacion}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        const cotizacion = data.cotizacion;
        // Establecer el ID oculto
        document.getElementById("id_cotizacion_garantia_cot").value =
          idCotizacion;
        // Mostrar información del servicio
        document.getElementById(
          "servicioCompletadoText"
        ).textContent = `${cotizacion.nombre_completo} - ${cotizacion.marca_bicicleta} ${cotizacion.modelo_bicicleta} (${cotizacion.zona_afectada})`;
        document
          .getElementById("nuevaGarantiaModalCotizacion")
          .classList.add("active");
      } else {
        Swal.fire("Error", "Error al cargar información del servicio", "error");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      Swal.fire("Error", "Error de conexión", "error");
    });
}

// Función para cerrar modal de nueva garantía desde cotización
function closeNuevaGarantiaModalCotizacion() {
  document
    .getElementById("nuevaGarantiaModalCotizacion")
    .classList.remove("active");
  document.getElementById("nuevaGarantiaFormCotizacion").reset();
}

// Función para guardar nueva garantía desde cotización
function saveNuevaGarantiaCotizacion() {
  const formData = {
    id_cotizacion: document.getElementById("id_cotizacion_garantia_cot").value,
    tipo_garantia: document.getElementById("tipo_garantia_cot").value,
    cobertura: document.getElementById("cobertura_cot").value,
    fecha_inicio: document.getElementById("fecha_inicio_cot").value,
    fecha_fin: document.getElementById("fecha_fin_cot").value,
  };

  if (
    !formData.id_cotizacion ||
    !formData.tipo_garantia ||
    !formData.cobertura ||
    !formData.fecha_inicio ||
    !formData.fecha_fin
  ) {
    Swal.fire("Error", "Todos los campos son obligatorios", "error");
    return;
  }

  fetch(
    "../../controlador/Administrador/garantias_controller.php?action=createGarantia",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    }
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        Swal.fire("Éxito", "Garantía creada correctamente", "success");
        closeNuevaGarantiaModalCotizacion();
        // Recargar la cotización para ocultar el botón si es necesario
        // Pero como el estado ya es COMPLETADO, el botón seguirá ahí, pero está bien
      } else {
        Swal.fire("Error", data.error || "Error al crear garantía", "error");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      Swal.fire("Error", "Error de conexión", "error");
    });
}

// Función para calcular fecha fin en nueva garantía desde cotización
function calcularFechaFinCotizacion() {
  const fechaInicio = document.getElementById("fecha_inicio_cot").value;
  const duracion = document.getElementById("duracion_garantia_cot").value;
  if (fechaInicio && duracion) {
    const fecha = new Date(fechaInicio);
    switch (duracion) {
      case "1_mes":
        fecha.setMonth(fecha.getMonth() + 1);
        break;
      case "3_meses":
        fecha.setMonth(fecha.getMonth() + 3);
        break;
      case "6_meses":
        fecha.setMonth(fecha.getMonth() + 6);
        break;
      case "1_año":
        fecha.setFullYear(fecha.getFullYear() + 1);
        break;
      case "2_años":
        fecha.setFullYear(fecha.getFullYear() + 2);
        break;
      case "3_años":
        fecha.setFullYear(fecha.getFullYear() + 3);
        break;
    }
    document.getElementById("fecha_fin_cot").value = fecha
      .toISOString()
      .split("T")[0];
  }
}

// Función para inicializar el módulo de cotizaciones pendientes
function initializeCotizacionesPendientes() {
  cargarCotizacionesPendientes();
}

// Función para cargar cotizaciones pendientes
function cargarCotizacionesPendientes() {
  fetch(
    "../../controlador/Administrador/cotizaciones_admin_controller.php?accion=obtener_todas"
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // Filtrar solo las cotizaciones pendientes
        const cotizacionesPendientes = data.cotizaciones.filter(
          (cot) => cot.estado === "PENDIENTE"
        );
        mostrarCotizacionesPendientes(cotizacionesPendientes);
      } else {
        Swal.fire(
          "Error",
          data.message || "Error al cargar cotizaciones pendientes",
          "error"
        );
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      Swal.fire("Error", "Error de conexión", "error");
    });
}

// Función para mostrar cotizaciones pendientes en tabla
function mostrarCotizacionesPendientes(cotizaciones) {
  const container = document.getElementById("cotizacionesPendientesTable");
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
  const gridData = cotizaciones.map((cot) => ({
    id: cot.id_cotizacion,
    cliente: cot.nombre_completo,
    email: cot.correo_electronico,
    telefono: cot.telefono,
    bicicleta: `${cot.marca_bicicleta} ${cot.modelo_bicicleta}`,
    zona_afectada: cot.zona_afectada,
    tipo_trabajo: cot.tipo_trabajo,
    tipo_reparacion: cot.tipo_reparacion,
    fecha: new Date(cot.creado_en).toLocaleDateString("es-ES"),
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
                   </button>`,
  }));

  new gridjs.Grid({
    columns: [
      { name: "ID", id: "id", width: "60px" },
      { name: "Cliente", id: "cliente" },
      { name: "Email", id: "email" },
      { name: "Teléfono", id: "telefono", width: "120px" },
      { name: "Bicicleta", id: "bicicleta" },
      { name: "Zona Afectada", id: "zona_afectada" },
      { name: "Tipo Trabajo", id: "tipo_trabajo" },
      { name: "Tipo Reparación", id: "tipo_reparacion" },
      { name: "Fecha", id: "fecha", width: "100px" },
      {
        name: "Estado",
        formatter: (cell) => gridjs.html(cell),
        width: "140px",
      },
      {
        name: "Acciones",
        formatter: (cell) => gridjs.html(cell),
        width: "80px",
      },
    ],
    data: gridData,
    search: {
      placeholder: "🔍 Buscar cotizaciones...",
    },
    pagination: {
      limit: 15,
      summary: true,
      prevButton: "⬅️ Anterior",
      nextButton: "Siguiente ➡️",
      buttonsCount: 3,
    },
    sort: true,
    language: {
      search: {
        placeholder: "🔍 Buscar...",
      },
      pagination: {
        showing: "Mostrando",
        of: "de",
        to: "a",
        results: "resultados",
      },
    },
    style: {
      table: {
        "font-size": "14px",
        "border-collapse": "collapse",
        width: "100%",
      },
      th: {
        background: "linear-gradient(135deg, #1a1a1a 0%, #343a40 100%)",
        color: "#ffffff",
        border: "1px solid #495057",
        padding: "12px 8px",
        "text-align": "left",
        "font-weight": "700",
        "font-size": "13px",
        "text-transform": "uppercase",
        "letter-spacing": "0.5px",
      },
      td: {
        padding: "10px 8px",
        border: "1px solid #dee2e6",
        "background-color": "#ffffff",
        "vertical-align": "middle",
      },
      container: {
        "box-shadow": "0 4px 20px rgba(0,0,0,0.15)",
        "border-radius": "12px",
        overflow: "hidden",
        border: "1px solid #e9ecef",
      },
      search: {
        border: "2px solid #ced4da",
        "border-radius": "8px",
        padding: "10px 14px",
        "margin-bottom": "20px",
        "font-size": "14px",
        transition: "border-color 0.2s ease",
      },
      pagination: {
        "margin-top": "20px",
        padding: "10px 0",
      },
    },
  }).render(container);
}

// Función para cambiar estado de cotización pendiente
function cambiarEstadoCotizacionPendiente(selectElement) {
  const idCotizacion = selectElement.getAttribute("data-id");
  const nuevoEstado = selectElement.value;

  fetch("../../controlador/Administrador/cotizaciones_admin_controller.php", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      accion: "actualizar_estado",
      id_cotizacion: idCotizacion,
      estado: nuevoEstado,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Estado actualizado",
          text: `La cotización #${idCotizacion} ha sido actualizada a "${nuevoEstado}".`,
          timer: 2000,
          showConfirmButton: false,
        });

        // Recargar la tabla después de un breve delay
        setTimeout(() => {
          cargarCotizacionesPendientes();
        }, 500);
      } else {
        Swal.fire(
          "Error",
          data.message || "Error al actualizar estado",
          "error"
        );
        // Revertir el select al estado anterior
        selectElement.value = "PENDIENTE";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      Swal.fire("Error", "Error de conexión", "error");
      // Revertir el select al estado anterior
      selectElement.value = "PENDIENTE";
    });
}

// Función para actualizar cotizaciones pendientes
function actualizarCotizacionesPendientes() {
  cargarCotizacionesPendientes();
}

// Función para filtrar cotizaciones pendientes
function filtrarCotizacionesPendientes() {
  const query = document
    .getElementById("buscadorCotizacionesPendientes")
    .value.toLowerCase();

  // Obtener todas las filas de la tabla
  const rows = document.querySelectorAll(
    "#cotizacionesPendientesTable .gridjs-tr"
  );

  rows.forEach((row) => {
    const text = row.textContent.toLowerCase();
    if (text.includes(query)) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}

// Función para filtrar por estado
function filtrarCotizacionesPendientesPorEstado() {
  const estadoFiltro = document.getElementById(
    "estadoFiltroCotizacionesPendientes"
  ).value;

  if (estadoFiltro === "todos") {
    cargarCotizacionesPendientes();
    return;
  }

  fetch(
    "../../controlador/Administrador/cotizaciones_admin_controller.php?accion=obtener_todas"
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        let cotizacionesFiltradas = data.cotizaciones;

        if (estadoFiltro === "PENDIENTE") {
          cotizacionesFiltradas = data.cotizaciones.filter(
            (cot) => cot.estado === "PENDIENTE"
          );
        } else if (estadoFiltro === "RESPONDIDA") {
          cotizacionesFiltradas = data.cotizaciones.filter(
            (cot) => cot.estado !== "PENDIENTE"
          );
        }

        mostrarCotizacionesPendientes(cotizacionesFiltradas);
      } else {
        Swal.fire(
          "Error",
          data.message || "Error al filtrar cotizaciones",
          "error"
        );
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      Swal.fire("Error", "Error de conexión", "error");
    });
}

// Función para filtrar cotizaciones
function filtrarCotizaciones() {
  const query = document
    .getElementById("buscadorCotizaciones")
    .value.toLowerCase();
  const filtered = cotizacionesData.filter(
    (cot) =>
      cot.nombre_completo.toLowerCase().includes(query) ||
      cot.marca_bicicleta.toLowerCase().includes(query) ||
      cot.modelo_bicicleta.toLowerCase().includes(query) ||
      cot.id_cotizacion.toString().includes(query)
  );
  mostrarListaCotizacionesFiltrada(filtered);
}

// Función para filtrar por estado
function filtrarCotizacionesPorEstado() {
  const estado = document.getElementById("estadoFiltroCotizaciones").value;
  let filtered = cotizacionesData;
  if (estado !== "todos") {
    filtered = cotizacionesData.filter((cot) => cot.estado === estado);
  }
  mostrarListaCotizacionesFiltrada(filtered);
}

// Función auxiliar para mostrar lista filtrada
function mostrarListaCotizacionesFiltrada(data) {
  const container = document.getElementById("cotizacionesList");
  if (!container) return;

  const html = data
    .map(
      (cot) => `
        <div class="cotizacion-card">
            <div class="card-header">
                <div class="card-id">#${cot.id_cotizacion}</div>
                <div class="card-status">
                    <span class="estado-badge estado-${cot.estado
                      .toLowerCase()
                      .replace(/\s+/g, "_")}">${cot.estado}</span>
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
                        <span>${cot.marca_bicicleta} ${
        cot.modelo_bicicleta
      }</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-calendar"></i>
                        <span>${new Date(
                          cot.creado_en
                        ).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
            <div class="card-actions">
                <button class="btn btn-primary" onclick="verCotizacion(${
                  cot.id_cotizacion
                })">
                    <i class="fas fa-eye"></i> Ver Detalles
                </button>
            </div>
        </div>
    `
    )
    .join("");
  container.innerHTML = html;
}
