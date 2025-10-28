/**
 * Formulario de Cotizaciones del Cliente
 * Archivo: recursos/js/Cliente/FormularioCotizaciones.js
 * Propósito: Manejar el envío de cotizaciones con imágenes
 */

console.log('=== FormularioCotizaciones.js cargado ===');

// Variables globales
let imagenesSeleccionadas = [];
const MAX_IMAGENES = 5;
const MAX_TAMAÑO = 5 * 1024 * 1024; // 5MB

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== INICIO: Inicializando formulario de cotizaciones ===');
    
    const formulario = document.getElementById('formularioCotizacion');
    const inputImagenes = document.getElementById('imagenesCotizacion');
    const previewImagenes = document.getElementById('previewImagenes');
    const inputNombre = document.getElementById('nombre');
    const inputEmail = document.getElementById('email');
    const inputTelefono = document.getElementById('telefono');
    const botonesReparacion = document.querySelectorAll('.opcion-reparacion');
    const inputTipoReparacion = document.getElementById('tipoReparacion');
    
    if (!formulario) {
        console.error('ERROR: Formulario de cotización no encontrado');
        return;
    }
    
    console.log('Formulario encontrado. Agregando listeners...');

    // 1) Auto-rellenar datos del cliente (nombre, correo, teléfono) manteniendo edición
    try {
        console.log('Enviando GET a: ../../controlador/Cliente/perfil_obtener.php');
        fetch('../../controlador/Cliente/perfil_obtener.php')
            .then(r => r.json())
            .then(datos => {
                console.log('Perfil recibido:', datos);
                if (datos && datos.success && datos.perfil) {
                    const p = datos.perfil;
                    if (inputNombre && !inputNombre.value) inputNombre.value = p.nombre_completo || '';
                    if (inputEmail && !inputEmail.value) inputEmail.value = p.correo_electronico || '';
                    if (inputTelefono && !inputTelefono.value) inputTelefono.value = p.telefono || '';
                }
            })
            .catch(err => console.warn('No se pudo auto-rellenar perfil:', err));
    } catch (e) {
        console.warn('Excepción al cargar perfil:', e);
    }

    // 2) Manejar selección de tipo de reparación con estado visual
    if (botonesReparacion && botonesReparacion.length) {
        botonesReparacion.forEach(b => {
            b.addEventListener('click', () => {
                botonesReparacion.forEach(x => x.classList.remove('seleccionado'));
                b.classList.add('seleccionado');
                const valor = b.getAttribute('data-valor');
                if (inputTipoReparacion) inputTipoReparacion.value = valor;
                console.log('Tipo de reparación seleccionado:', valor);
            });
        });
    }
    
    // Listener para cambio de imágenes
    if (inputImagenes) {
        inputImagenes.addEventListener('change', function(e) {
            console.log('=== Cambio de imágenes detectado ===');
            manejarSeleccionImagenes(e, previewImagenes);
        });
    }
    
    // Listener para envío del formulario
    formulario.addEventListener('submit', function(e) {
        console.log('=== INICIO: Envío de formulario de cotización ===');
        e.preventDefault();
        enviarCotizacion(formulario);
    });
    
    console.log('=== FIN: Inicialización completada ===');
});

/**
 * Maneja la selección de imágenes
 */
function manejarSeleccionImagenes(evento, previewContainer) {
    console.log('=== INICIO: Manejo de selección de imágenes ===');
    
    const archivos = evento.target.files;
    console.log('Archivos seleccionados:', archivos.length);
    
    imagenesSeleccionadas = [];
    previewContainer.innerHTML = '';
    
    for (let i = 0; i < archivos.length && i < MAX_IMAGENES; i++) {
        const archivo = archivos[i];
        console.log(`Procesando archivo ${i + 1}:`, archivo.name, `Tamaño: ${archivo.size} bytes`);
        
        // Validar tipo
        if (!archivo.type.startsWith('image/')) {
            console.warn(`ADVERTENCIA: ${archivo.name} no es una imagen`);
            continue;
        }
        
        // Validar tamaño
        if (archivo.size > MAX_TAMAÑO) {
            console.warn(`ADVERTENCIA: ${archivo.name} excede el tamaño máximo`);
            continue;
        }
        
        imagenesSeleccionadas.push(archivo);
        
        // Crear preview
        const reader = new FileReader();
        reader.onload = function(e) {
            const div = document.createElement('div');
            div.className = 'preview-imagen';
            div.innerHTML = `
                <img src="${e.target.result}" alt="Preview">
                <button type="button" class="btn-eliminar" onclick="eliminarImagen(${imagenesSeleccionadas.indexOf(archivo)})">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            previewContainer.appendChild(div);
            console.log(`Preview creado para: ${archivo.name}`);
        };
        reader.readAsDataURL(archivo);
    }
    
    console.log(`Total de imágenes válidas: ${imagenesSeleccionadas.length}`);
    console.log('=== FIN: Selección de imágenes completada ===');
}

/**
 * Elimina una imagen del preview
 */
function eliminarImagen(indice) {
    console.log(`Eliminando imagen en índice: ${indice}`);
    imagenesSeleccionadas.splice(indice, 1);
    
    // Recrear preview
    const previewContainer = document.getElementById('previewImagenes');
    previewContainer.innerHTML = '';
    
    imagenesSeleccionadas.forEach((archivo, i) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const div = document.createElement('div');
            div.className = 'preview-imagen';
            div.innerHTML = `
                <img src="${e.target.result}" alt="Preview">
                <button type="button" class="btn-eliminar" onclick="eliminarImagen(${i})">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            previewContainer.appendChild(div);
        };
        reader.readAsDataURL(archivo);
    });
}

/**
 * Envía la cotización al servidor
 */
function enviarCotizacion(formulario) {
    console.log('=== INICIO: Envío de cotización ===');
    
    // Validar que haya imágenes
    if (imagenesSeleccionadas.length === 0) {
        console.error('ERROR: No hay imágenes seleccionadas');
        Swal.fire('Error', 'Debes seleccionar al menos una imagen', 'error');
        return;
    }
    // Validar tipo de reparación seleccionado
    const tipoReparacionHidden = document.getElementById('tipoReparacion');
    if (!tipoReparacionHidden || !tipoReparacionHidden.value) {
        Swal.fire('Error', 'Selecciona el tipo de reparación', 'error');
        return;
    }
    
    console.log(`Imágenes a enviar: ${imagenesSeleccionadas.length}`);
    
    // Obtener datos del formulario
    const formData = new FormData(formulario);
    
    // Agregar imágenes al FormData
    imagenesSeleccionadas.forEach((archivo, indice) => {
        formData.append(`imagen_${indice}`, archivo);
        console.log(`Imagen ${indice} agregada: ${archivo.name}`);
    });
    
    // Mostrar cargando
    const btnEnviar = formulario.querySelector('button[type="submit"]');
    const textoOriginal = btnEnviar.textContent;
    btnEnviar.disabled = true;
    btnEnviar.textContent = 'Enviando...';
    
    console.log('Enviando POST a: ../../controlador/Cliente/cotizacion_cliente.php');
    
    // Enviar al servidor
    fetch('../../controlador/Cliente/cotizacion_cliente.php', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        console.log('Respuesta recibida. Status:', response.status);
        return response.json();
    })
    .then(data => {
        console.log('Datos JSON parseados:', data);
        
        if (data.success) {
            console.log('Cotización enviada exitosamente. ID:', data.id_cotizacion);
            
            Swal.fire({
                title: '¡Éxito!',
                text: 'Tu cotización ha sido enviada correctamente',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                console.log('Recargando página...');
                location.reload();
            });
        } else {
            console.error('ERROR:', data.message);
            Swal.fire('Error', data.message || 'Error al enviar la cotización', 'error');
        }
    })
    .catch(error => {
        console.error('ERROR de conexión:', error);
        Swal.fire('Error', 'Error de conexión: ' + error.message, 'error');
    })
    .finally(() => {
        btnEnviar.disabled = false;
        btnEnviar.textContent = textoOriginal;
        console.log('=== FIN: Envío de cotización completado ===');
    });
}

/**
 * Carga y muestra las cotizaciones del usuario
 */
function cargarCotizaciones() {
    console.log('=== INICIO: Cargando cotizaciones del usuario ===');
    
    fetch('../../controlador/Cliente/obtener_cotizaciones.php')
    .then(response => {
        console.log('Respuesta recibida. Status:', response.status);
        return response.json();
    })
    .then(data => {
        console.log('Datos JSON parseados:', data);
        
        if (data.success && data.cotizaciones) {
            console.log(`Cotizaciones encontradas: ${data.cotizaciones.length}`);
            mostrarCotizaciones(data.cotizaciones);
        } else if (data.cotizaciones && data.cotizaciones.length === 0) {
            console.log('El usuario no tiene cotizaciones');
            mostrarMensajeVacio();
        } else {
            console.error('ERROR:', data.message);
            Swal.fire('Error', data.message || 'Error al cargar cotizaciones', 'error');
        }
    })
    .catch(error => {
        console.error('ERROR de conexión:', error);
        Swal.fire('Error', 'Error de conexión: ' + error.message, 'error');
    })
    .finally(() => {
        console.log('=== FIN: Carga de cotizaciones completada ===');
    });
}

/**
 * Muestra las cotizaciones en la interfaz
 */
function mostrarCotizaciones(cotizaciones) {
    console.log('=== Mostrando cotizaciones ===');
    
    const contenedor = document.getElementById('listaCotizaciones');
    if (!contenedor) {
        console.error('ERROR: Contenedor de cotizaciones no encontrado');
        return;
    }
    
    contenedor.innerHTML = '';
    
    cotizaciones.forEach(cotizacion => {
        console.log(`Procesando cotización ID: ${cotizacion.id_cotizacion}`);
        
        const div = document.createElement('div');
        div.className = 'cotizacion-item';
        div.innerHTML = `
            <div class="cotizacion-header">
                <h4>${cotizacion.marca_bicicleta} ${cotizacion.modelo_bicicleta}</h4>
                <span class="estado-badge estado-${cotizacion.estado.toLowerCase()}">
                    ${cotizacion.estado}
                </span>
            </div>
            <div class="cotizacion-body">
                <p><strong>Tipo de trabajo:</strong> ${cotizacion.tipo_trabajo}</p>
                <p><strong>Zona afectada:</strong> ${cotizacion.zona_afectada}</p>
                <p><strong>Fecha:</strong> ${new Date(cotizacion.creado_en).toLocaleDateString()}</p>
            </div>
            <div class="cotizacion-footer">
                <button class="btn btn-primary" onclick="verDetalles(${cotizacion.id_cotizacion})">
                    Ver Detalles
                </button>
            </div>
        `;
        contenedor.appendChild(div);
    });
}

/**
 * Muestra mensaje cuando no hay cotizaciones
 */
function mostrarMensajeVacio() {
    console.log('Mostrando mensaje de sin cotizaciones');
    
    const contenedor = document.getElementById('listaCotizaciones');
    if (!contenedor) {
        console.error('ERROR: Contenedor de cotizaciones no encontrado');
        return;
    }
    
    contenedor.innerHTML = `
        <div class="mensaje-vacio">
            <i class="fas fa-inbox fa-3x"></i>
            <h3>No tienes cotizaciones</h3>
            <p>Aún no has enviado ninguna cotización. ¡Crea una nueva!</p>
        </div>
    `;
}

/**
 * Ver detalles de una cotización
 */
function verDetalles(idCotizacion) {
    console.log(`Viendo detalles de cotización ID: ${idCotizacion}`);
    // Implementar según necesidad
}

console.log('=== FormularioCotizaciones.js inicializado ===');

