document.addEventListener('DOMContentLoaded', function () {
    // Variables globales en español
    let uploadedImages = [];
    let idCotizacion = null;
    let contadorNotificaciones = 0;
    let contadorMensajesChat = 0;
    let notificacionesVistas = [];
    let intervaloNotificaciones = null;
    let piezasCliente = []; // Array para almacenar las piezas

    // Elementos del DOM
    const nuevoServicioForm = document.getElementById('nuevoServicioForm');
    const imagenInput = document.getElementById('imagenInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const imagePreview = document.getElementById('imagePreview');
    const resetBtn = document.getElementById('resetBtn');
    const submitBtn = document.getElementById('submitBtn');
    const tipoTrabajoButtons = document.querySelectorAll('#tipoTrabajoButtons .option-button');
    const tipoReparacionButtons = document.querySelectorAll('#tipoReparacionButtons .option-button');
    const otrosContainer = document.getElementById('otrosContainer');
    const repairTypeDescription = document.getElementById('repairTypeDescription');

    // Establecer fecha actual
    const today = new Date();
    const formattedDate = today.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
    document.getElementById('fechaServicio').value = formattedDate;
    document.getElementById('fichaFecha').textContent = formattedDate;

    // Inicializar gestión de piezas al final
    setTimeout(inicializarPiezas, 100);

    // Cargar lista de usuarios en el select
    cargarUsuarios();

    document.getElementById('marca').addEventListener('input', function () {
        document.getElementById('fichaMarca').textContent = this.value || '--';
    });

    document.getElementById('modelo').addEventListener('input', function () {
        document.getElementById('fichaModelo').textContent = this.value || '--';
    });

    document.getElementById('telefonoServicio').addEventListener('input', function () {
        document.getElementById('fichaTelefono').textContent = this.value || '--';
    });

    document.getElementById('zonaAfectada').addEventListener('input', function () {
        document.getElementById('fichaObservaciones').textContent = this.value || '--';
    });

    // Actualizar piezas en ficha técnica
    function actualizarFichaPiezas() {
        const piezas = obtenerPiezasCliente();
        const fichaPiezas = document.getElementById('fichaPiezas');

        if (piezas.length === 0) {
            fichaPiezas.textContent = '--';
            return;
        }

        let piezasText = '';
        piezas.forEach(pieza => {
            piezasText += `${pieza.cantidad}x ${pieza.nombre}`;
            if (pieza.nota) {
                piezasText += ` (${pieza.nota})`;
            }
            piezasText += ', ';
        });

        // Remover la última coma y espacio
        piezasText = piezasText.slice(0, -2);

        fichaPiezas.textContent = piezasText;
    }

    // Event listener para cambios en piezas
    document.addEventListener('input', function (e) {
        if (e.target.classList.contains('pieza-nombre') || e.target.classList.contains('pieza-cantidad') || e.target.classList.contains('pieza-nota')) {
            actualizarFichaPiezas();
        }
    });

    // Event listener para remover piezas
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('remover-pieza') || e.target.closest('.remover-pieza')) {
            // Esperar un poco para que se remueva la fila
            setTimeout(actualizarFichaPiezas, 10);
        }
    });

    // Event listener para agregar piezas
    document.getElementById('agregarPiezaBtn').addEventListener('click', function () {
        // Esperar un poco para que se agregue la fila
        setTimeout(actualizarFichaPiezas, 10);
    });

    // Tipo de Trabajo Buttons
    tipoTrabajoButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Remove selected class from all buttons
            tipoTrabajoButtons.forEach(btn => btn.classList.remove('selected'));

            // Add selected class to clicked button
            this.classList.add('selected');

            // Update hidden input
            document.getElementById('tipoTrabajo').value = this.getAttribute('data-value');

            // Update ficha técnica
            document.getElementById('fichaTipoReparacion').textContent = this.querySelector('span').textContent;
        });
    });

    // Tipo de Reparación Buttons
    tipoReparacionButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Remove selected class from all buttons
            tipoReparacionButtons.forEach(btn => btn.classList.remove('selected'));

            // Add selected class to clicked button
            this.classList.add('selected');

            // Update hidden input
            document.getElementById('tipoReparacion').value = this.getAttribute('data-value');

            // Show/hide field for "Otros"
            if (this.getAttribute('data-value') === 'OTROS') {
                otrosContainer.style.display = 'block';
            } else {
                otrosContainer.style.display = 'none';
            }

            // Show repair type description
            showRepairTypeDescription(this.getAttribute('data-value'));
        });
    });

    // Function to show repair type description
    function showRepairTypeDescription(type) {
        const descriptions = {
            'CHEQUEO_ESTRUCTURAL': {
                title: 'Chequeo Estructural',
                description: 'Inspección completa del cuadro para detectar posibles daños estructurales, fisuras internas o debilidades que puedan comprometer la seguridad de la bicicleta.'
            },
            'FISURA': {
                title: 'Reparación de Fisura',
                description: 'Reparación especializada para fisuras superficiales y profundas mediante técnicas de inyección de resina y refuerzo con fibra de carbono.'
            },
            'FRACTURA': {
                title: 'Reparación de Fractura',
                description: 'Reconstrucción completa de áreas fracturadas, restaurando la integridad estructural del cuadro con materiales de alta resistencia.'
            },
            'RECONSTRUCCION': {
                title: 'Reconstrucción',
                description: 'Reconstrucción de secciones dañadas o modificadas del cuadro, asegurando resistencia y durabilidad equivalentes al original.'
            },
            'ADAPTACION': {
                title: 'Adaptación',
                description: 'Modificaciones y adaptaciones personalizadas para mejorar el rendimiento o comodidad, manteniendo la seguridad estructural.'
            },
            'OTROS': {
                title: 'Otros Servicios',
                description: 'Servicios personalizados según las necesidades específicas de tu bicicleta. Contáctanos para más detalles.'
            }
        };

        const desc = descriptions[type];
        if (desc) {
            repairTypeDescription.style.display = 'block';
            repairTypeDescription.innerHTML = `
                <h6><i class="fas fa-info-circle"></i> ${desc.title}</h6>
                <p>${desc.description}</p>
            `;
        } else {
            repairTypeDescription.style.display = 'none';
        }
    }

    // Manejo de carga de imágenes
    uploadBtn.addEventListener('click', function () {
        imagenInput.click();
    });

    imagenInput.addEventListener('change', function () {
        handleImageUpload(this.files);
    });

    // Drag and drop
    const uploadContainer = document.querySelector('.image-upload-container');

    uploadContainer.addEventListener('dragover', function (e) {
        e.preventDefault();
        this.style.backgroundColor = '#f0f0f0';
    });

    uploadContainer.addEventListener('dragleave', function (e) {
        e.preventDefault();
        this.style.backgroundColor = '';
    });

    uploadContainer.addEventListener('drop', function (e) {
        e.preventDefault();
        this.style.backgroundColor = '';
        handleImageUpload(e.dataTransfer.files);
    });

    function handleImageUpload(files) {
        if (files.length === 0) return;

        // Verificar límite de imágenes
        if (uploadedImages.length + files.length > 10) {
            Swal.fire({
                icon: 'error',
                title: 'Límite excedido',
                text: 'Solo puedes subir un máximo de 10 imágenes',
                confirmButtonColor: '#1a1a1a'
            });
            return;
        }

        // Procesar cada archivo
        Array.from(files).forEach(file => {
            // Verificar que sea una imagen
            if (!file.type.match('image.*')) {
                Swal.fire({
                    icon: 'error',
                    title: 'Archivo no válido',
                    text: `${file.name} no es una imagen válida`,
                    confirmButtonColor: '#1a1a1a'
                });
                return;
            }

            // Verificar tamaño (máximo 5MB)
            if (file.size > 5 * 1024 * 1024) {
                Swal.fire({
                    icon: 'error',
                    title: 'Archivo demasiado grande',
                    text: `${file.name} excede el tamaño máximo de 5MB`,
                    confirmButtonColor: '#1a1a1a'
                });
                return;
            }

            // Crear objeto de imagen
            const reader = new FileReader();
            reader.onload = function (e) {
                const imageObj = {
                    id: Date.now() + Math.random(),
                    name: file.name,
                    url: e.target.result,
                    file: file
                };

                uploadedImages.push(imageObj);
                renderImagePreview();
            };
            reader.readAsDataURL(file);
        });
    }

    function renderImagePreview() {
        imagePreview.innerHTML = '';

        uploadedImages.forEach(image => {
            const previewItem = document.createElement('div');
            previewItem.className = 'image-preview-item';
            previewItem.innerHTML = `
                <img src="${image.url}" alt="${image.name}">
                <button type="button" class="remove-image" data-id="${image.id}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            imagePreview.appendChild(previewItem);
        });

        // Agregar evento para eliminar imágenes
        document.querySelectorAll('.remove-image').forEach(btn => {
            btn.addEventListener('click', function () {
                const imageId = this.getAttribute('data-id');
                uploadedImages = uploadedImages.filter(img => img.id != imageId);
                renderImagePreview();
            });
        });
    }

    // Validación del formulario de cotización
    nuevoServicioForm.addEventListener('submit', function (e) {
        e.preventDefault();

        let isValid = true;

        // Validar campos requeridos
        const requiredFields = nuevoServicioForm.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('is-invalid');
                isValid = false;
            } else {
                field.classList.remove('is-invalid');
            }
        });

        // Validar email
        const emailField = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
            emailField.classList.add('is-invalid');
            isValid = false;
        }

        // Validar teléfono (formato simple)
        const phoneField = document.getElementById('telefonoServicio');
        const phoneRegex = /^[0-9+\-\s()]+$/;
        if (!phoneRegex.test(phoneField.value)) {
            phoneField.classList.add('is-invalid');
            isValid = false;
        }

        // Validar cliente
        const usuarioServicio = document.getElementById('usuarioServicio');
        if (!usuarioServicio.value) {
            usuarioServicio.classList.add('is-invalid');
            isValid = false;
        } else {
            usuarioServicio.classList.remove('is-invalid');
        }

        // Validar tipo de trabajo
        const tipoTrabajo = document.getElementById('tipoTrabajo');
        if (!tipoTrabajo.value) {
            tipoTrabajoButtons.forEach(btn => btn.classList.add('is-invalid'));
            isValid = false;
        } else {
            tipoTrabajoButtons.forEach(btn => btn.classList.remove('is-invalid'));
        }

        // Validar tipo de reparación
        const tipoReparacion = document.getElementById('tipoReparacion');
        if (!tipoReparacion.value) {
            tipoReparacionButtons.forEach(btn => btn.classList.add('is-invalid'));
            isValid = false;
        } else {
            tipoReparacionButtons.forEach(btn => btn.classList.remove('is-invalid'));
        }

        // Validar imágenes
        if (uploadedImages.length === 0) {
            imagePreview.parentElement.classList.add('is-invalid');
            isValid = false;
        } else {
            imagePreview.parentElement.classList.remove('is-invalid');
        }

        if (isValid) {
            submitForm();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error de validación',
                text: 'Por favor, completa todos los campos requeridos',
                confirmButtonColor: '#1a1a1a'
            });
        }
    });

    // Enviar formulario
    function submitForm() {
        // Crear FormData para enviar archivos
        const formData = new FormData();

        // Agregar datos del formulario
        const selectUsuario = document.getElementById('usuarioServicio');
        const idUsuario = selectUsuario.value;
        const nombreCliente = selectUsuario.options[selectUsuario.selectedIndex].text;

        if (idUsuario) {
            // Cliente registrado seleccionado
            formData.append('id_usuario', idUsuario);
            formData.append('nombre', nombreCliente);
        } else {
            // No se seleccionó cliente
            formData.append('nombre', 'Cliente no especificado');
        }

        formData.append('direccion', document.getElementById('direccionServicio').value);
        formData.append('telefono', document.getElementById('telefonoServicio').value);
        formData.append('email', document.getElementById('email').value);
        formData.append('marca', document.getElementById('marca').value);
        formData.append('modelo', document.getElementById('modelo').value);
        formData.append('tipoTrabajo', document.getElementById('tipoTrabajo').value);
        formData.append('zonaAfectada', document.getElementById('zonaAfectada').value);
        formData.append('tipoReparacion', document.getElementById('tipoReparacion').value);

        if (document.getElementById('tipoReparacion').value === 'OTROS') {
            formData.append('descripcionOtros', document.getElementById('descripcionOtros').value);
        }

        // Agregar imágenes
        uploadedImages.forEach((image, index) => {
            formData.append(`imagen_${index}`, image.file);
        });

        // Agregar piezas del cliente
        const piezasCliente = obtenerPiezasCliente();
        if (piezasCliente.length > 0) {
            formData.append('piezas_cliente', JSON.stringify(piezasCliente));
        }

        // Envío real al backend PHP
        fetch('../../controlador/Administrador/nuevo_servicio.php', {
            method: 'POST',
            body: formData
        })
            .then(r => r.json())
            .then(data => {
                if (data && data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Servicio creado',
                        text: 'El nuevo servicio ha sido creado exitosamente.',
                        confirmButtonColor: '#1a1a1a'
                    }).then(() => {
                        // Resetear formulario
                        nuevoServicioForm.reset();
                        uploadedImages = [];
                        renderImagePreview();

                        // Resetear botones de selección
                        tipoTrabajoButtons.forEach(btn => btn.classList.remove('selected'));
                        tipoReparacionButtons.forEach(btn => btn.classList.remove('selected'));

                        // Ocultar campo de otros y descripción
                        otrosContainer.style.display = 'none';
                        repairTypeDescription.style.display = 'none';

                        // Resetear ficha técnica
                        document.getElementById('fichaNombre').textContent = '--';
                        document.getElementById('fichaMarca').textContent = '--';
                        document.getElementById('fichaModelo').textContent = '--';
                        document.getElementById('fichaTelefono').textContent = '--';
                        document.getElementById('fichaTipoReparacion').textContent = '--';
                        document.getElementById('fichaObservaciones').textContent = '--';
                        document.getElementById('fichaPiezas').textContent = '--';
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: (data && data.message) ? data.message : 'Error al crear el servicio',
                        confirmButtonColor: '#1a1a1a'
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de conexión',
                    text: 'Error al conectar con el servidor.',
                    confirmButtonColor: '#1a1a1a'
                });
            });
    }

    // Resetear formulario
    resetBtn.addEventListener('click', function () {
        nuevoServicioForm.reset();
        uploadedImages = [];
        renderImagePreview();

        // Resetear botones de selección
        tipoTrabajoButtons.forEach(btn => btn.classList.remove('selected'));
        tipoReparacionButtons.forEach(btn => btn.classList.remove('selected'));

        // Ocultar campo de otros y descripción
        otrosContainer.style.display = 'none';
        repairTypeDescription.style.display = 'none';

        // Resetear ficha técnica
        document.getElementById('fichaNombre').textContent = '--';
        document.getElementById('fichaMarca').textContent = '--';
        document.getElementById('fichaModelo').textContent = '--';
        document.getElementById('fichaTelefono').textContent = '--';
        document.getElementById('fichaTipoReparacion').textContent = '--';
        document.getElementById('fichaObservaciones').textContent = '--';
        document.getElementById('fichaPiezas').textContent = '--';

        // Limpiar select de cliente
        document.getElementById('usuarioServicio').value = '';

        // Quitar clases de validación
        nuevoServicioForm.querySelectorAll('.is-invalid').forEach(field => {
            field.classList.remove('is-invalid');
        });
    });


    // Funciones para gestión de piezas dinámicas
    function inicializarPiezas() {
        const agregarBtn = document.getElementById('agregarPiezaBtn');
        if (agregarBtn) {
            agregarBtn.addEventListener('click', agregarFilaPieza);
        }
        // Agregar una fila inicial vacía
        agregarFilaPieza();
    }

    function agregarFilaPieza() {
        const container = document.getElementById('piezasContainer');
        if (!container) return;

        const filaId = Date.now(); // ID único para la fila
        const filaHTML = `
            <div class="pieza-row d-flex gap-2 mb-2 align-items-end" data-id="${filaId}">
                <div class="flex-shrink-0" style="width: 100px;">
                    <label class="form-label small">Cantidad</label>
                    <input type="number" class="form-control form-control-sm pieza-cantidad" placeholder="1" min="1" value="1">
                </div>
                <div class="flex-grow-1">
                    <label class="form-label small">Nombre de la Pieza</label>
                    <input type="text" class="form-control form-control-sm pieza-nombre" placeholder="Ej: tornillo, valero, etc.">
                </div>
                <div class="flex-grow-1">
                    <label class="form-label small">Nota/Observación</label>
                    <input type="text" class="form-control form-control-sm pieza-nota" placeholder="Opcional: estado, color, etc.">
                </div>
                <div class="flex-shrink-0">
                    <button type="button" class="btn btn-outline-danger btn-sm remover-pieza" title="Remover pieza">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', filaHTML);

        // Agregar evento al botón de remover
        const nuevaFila = container.lastElementChild;
        const btnRemover = nuevaFila.querySelector('.remover-pieza');
        btnRemover.addEventListener('click', function () {
            nuevaFila.remove();
        });
    }

    function obtenerPiezasCliente() {
        const piezas = [];
        const filas = document.querySelectorAll('.pieza-row');

        filas.forEach(fila => {
            const nombre = fila.querySelector('.pieza-nombre').value.trim();
            const cantidad = parseInt(fila.querySelector('.pieza-cantidad').value) || 1;
            const nota = fila.querySelector('.pieza-nota').value.trim();

            if (nombre) { // Solo agregar si tiene nombre
                piezas.push({
                    nombre: nombre,
                    cantidad: cantidad,
                    nota: nota
                });
            }
        });

        return piezas;
    }

    // Función para cargar usuarios en el select
    function cargarUsuarios() {
        fetch('../../controlador/Administrador/nuevo_servicio.php?accion=obtener_usuarios')
            .then(response => response.json())
            .then(data => {
                if (data.success && data.usuarios) {
                    const select = document.getElementById('usuarioServicio');
                    // Limpiar opciones existentes excepto la primera
                    select.innerHTML = '<option value="">Seleccionar cliente...</option>';

                    // Agregar usuarios
                    data.usuarios.forEach(usuario => {
                        const option = document.createElement('option');
                        option.value = usuario.id_usuario;
                        option.textContent = `${usuario.nombres} ${usuario.apellidos}`;
                        option.dataset.telefono = usuario.numero_telefono || '';
                        option.dataset.email = usuario.correo_electronico || '';
                        option.dataset.direccion = usuario.direccion || '';
                        select.appendChild(option);
                    });
                } else {
                    console.error('Error en la respuesta:', data);
                }
            })
            .catch(error => {
                console.error('Error cargando usuarios:', error);
            });
    }

    // Actualizar ficha técnica cuando se selecciona un usuario
    document.getElementById('usuarioServicio').addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex];
        const nombreCompleto = selectedOption ? selectedOption.textContent : '';
        document.getElementById('fichaNombre').textContent = nombreCompleto || '--';

        // Llenar campos del formulario con datos del cliente seleccionado
        if (selectedOption && selectedOption.value) {
            document.getElementById('direccionServicio').value = selectedOption.dataset.direccion || '';
            document.getElementById('telefonoServicio').value = selectedOption.dataset.telefono || '';
            document.getElementById('email').value = selectedOption.dataset.email || '';
            document.getElementById('fichaTelefono').textContent = selectedOption.dataset.telefono || '--';
        } else {
            // Limpiar campos si no hay selección
            document.getElementById('direccionServicio').value = '';
            document.getElementById('telefonoServicio').value = '';
            document.getElementById('email').value = '';
            document.getElementById('fichaTelefono').textContent = '--';
        }
    });
});

// Función para inicializar el módulo de nuevo servicio
function initializeNuevoServicio() {
    // La inicialización ya se hace en DOMContentLoaded
}