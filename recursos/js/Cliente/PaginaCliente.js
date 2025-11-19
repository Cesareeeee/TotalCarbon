document.addEventListener('DOMContentLoaded', function() {
    // Variables globales en español
    let uploadedImages = [];
    let idCotizacion = null;
    let contadorNotificaciones = 3;
   
    // Elementos del DOM
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const mainContent = document.getElementById('mainContent');
    const menuItems = document.querySelectorAll('.menu-item');
    const contentSections = document.querySelectorAll('.content-section');
    const dashboardCards = document.querySelectorAll('.dashboard-card');
    const logoutBtn = document.getElementById('logoutBtn');
    const profileIcon = document.getElementById('profileIcon');
    const notificationBell = document.getElementById('notificationBell');
    const notificationBadge = document.getElementById('notificationBadge');
    const chatFab = document.getElementById('chatFab');
   
    // Elementos del formulario de cotización
    const cotizacionForm = document.getElementById('cotizacionForm');
    const imagenInput = document.getElementById('imagenInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const imagePreview = document.getElementById('imagePreview');
    const resetBtn = document.getElementById('resetBtn');
    const submitBtn = document.getElementById('submitBtn');
    const tipoTrabajoButtons = document.querySelectorAll('#tipoTrabajoButtons .option-button');
    const tipoReparacionButtons = document.querySelectorAll('#tipoReparacionButtons .option-button');
    const otrosContainer = document.getElementById('otrosContainer');
    const repairTypeDescription = document.getElementById('repairTypeDescription');

   
    // Elementos del perfil
    const profileDisplay = document.getElementById('profileDisplay');
    const editProfileForm = document.getElementById('editProfileForm');
    const changePasswordForm = document.getElementById('changePasswordForm');
    const editProfileBtn = document.getElementById('editProfileBtn');
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const cancelPasswordBtn = document.getElementById('cancelPasswordBtn');
    const perfilForm = document.getElementById('perfilForm');
    const passwordForm = document.getElementById('passwordForm');

    // Elementos auxiliares
    const notification = document.getElementById('notification');
    const loadingOverlay = document.getElementById('loadingOverlay');
   
    // Responsive sidebar handling
    function handleResponsiveSidebar() {
        if (window.innerWidth > 992) {
            sidebar.classList.remove('mobile-hidden');
            sidebar.classList.remove('mobile-visible');
            sidebarToggle.style.display = 'none';
            sidebarOverlay.classList.remove('active');
            mainContent.classList.remove('mobile-expanded');
        } else {
            sidebar.classList.add('mobile-hidden');
            sidebarToggle.style.display = 'flex';
        }
    }
   
    // Initial check
    handleResponsiveSidebar();
   
    // Handle window resize
    window.addEventListener('resize', handleResponsiveSidebar);
   
    // Toggle Sidebar
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('mobile-visible');
        sidebarToggle.classList.toggle('active');
        sidebarOverlay.classList.toggle('active');
        mainContent.classList.toggle('mobile-expanded');
    });
   
    // Close sidebar when clicking overlay
    sidebarOverlay.addEventListener('click', function() {
        sidebar.classList.remove('mobile-visible');
        sidebarToggle.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        mainContent.classList.remove('mobile-expanded');
    });
   
    // Profile icon click
    profileIcon.addEventListener('click', function() {
        // Remove active class from all menu items and sections
        menuItems.forEach(i => i.classList.remove('active'));
        contentSections.forEach(section => section.classList.remove('active'));
       
        // Add active class to profile menu item
        const profileMenuItem = document.querySelector('.menu-item[data-section="perfil"]');
        if (profileMenuItem) {
            profileMenuItem.classList.add('active');
        }
       
        // Show profile section
        document.getElementById('perfil').classList.add('active');
       
        // Close sidebar on mobile
        if (window.innerWidth <= 992) {
            sidebar.classList.remove('mobile-visible');
            sidebarToggle.classList.remove('active');
            sidebarOverlay.classList.remove('active');
            mainContent.classList.remove('mobile-expanded');
        }
    });
   
    // Notification bell click
    notificationBell.addEventListener('click', function() {
        // Reset notification count
        contadorNotificaciones = 0;
        notificationBadge.style.display = 'none';
       
        // Show notification panel (simulated)
        Swal.fire({
            title: 'Notificaciones',
            html: `
                <div style="text-align: left;">
                    <div class="mb-3">
                        <strong><i class="fas fa-comment text-primary"></i> Nuevo mensaje de soporte</strong>
                        <p class="mb-0">Hemos recibido una respuesta sobre tu cotización #1234</p>
                        <small>Hace 5 minutos</small>
                    </div>
                    <div class="mb-3">
                        <strong><i class="fas fa-wrench text-info"></i> Actualización de reparación</strong>
                        <p class="mb-0">Tu bicicleta ha pasado a la fase de pintura</p>
                        <small>Hace 2 horas</small>
                    </div>
                    <div class="mb-3">
                        <strong><i class="fas fa-shield-alt text-warning"></i> Garantía por vencer</strong>
                        <p class="mb-0">Tu garantía de pintura vence en 15 días</p>
                        <small>Ayer</small>
                    </div>
                </div>
            `,
            confirmButtonColor: '#1a1a1a',
            width: '500px'
        });
    });

    // Chat FAB click - navigate to chat section
    if (chatFab) {
        chatFab.addEventListener('click', function() {
            // Remove active class from all menu items and sections
            menuItems.forEach(i => i.classList.remove('active'));
            contentSections.forEach(section => section.classList.remove('active'));

            // Add active class to chat menu item
            const chatMenuItem = document.querySelector('.menu-item[data-section="chat-soporte"]');
            if (chatMenuItem) {
                chatMenuItem.classList.add('active');
            }

            // Show chat section
            document.getElementById('chat-soporte').classList.add('active');

            // Close sidebar on mobile
            if (window.innerWidth <= 992) {
                sidebar.classList.remove('mobile-visible');
                sidebarToggle.classList.remove('active');
                sidebarOverlay.classList.remove('active');
                mainContent.classList.remove('mobile-expanded');
            }
        });
    }

    // Function to update chat FAB visibility based on current section
    function updateChatFabVisibility() {
        if (!chatFab) return;

        const activeSection = document.querySelector('.content-section.active');
        if (activeSection && activeSection.id === 'chat-soporte') {
            // Hide FAB when in chat section
            chatFab.style.display = 'none';
        } else {
            // Show FAB when in other sections
            chatFab.style.display = 'flex';
        }
    }

    // Menu Navigation
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();

            // Remove active class from all menu items and sections
            menuItems.forEach(i => i.classList.remove('active'));
            contentSections.forEach(section => section.classList.remove('active'));

            // Add active class to clicked menu item
            this.classList.add('active');

            // Show corresponding section
            const sectionId = this.getAttribute('data-section');
            if (sectionId) {
                document.getElementById(sectionId).classList.add('active');

                // Cargar datos específicos de la sección
                if (sectionId === 'garantias') {
                    cargarGarantias();
                }
            }

            // Update chat FAB visibility
            updateChatFabVisibility();

            // Close sidebar on mobile
            if (window.innerWidth <= 992) {
                sidebar.classList.remove('mobile-visible');
                sidebarToggle.classList.remove('active');
                sidebarOverlay.classList.remove('active');
                mainContent.classList.remove('mobile-expanded');
            }
        });
    });
   
    // Dashboard Cards Navigation
    dashboardCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
           
            // Remove active class from all menu items and sections
            menuItems.forEach(i => i.classList.remove('active'));
            contentSections.forEach(section => section.classList.remove('active'));
           
            // Add active class to corresponding menu item
            const sectionId = this.getAttribute('data-section');
            const menuItem = document.querySelector(`.menu-item[data-section="${sectionId}"]`);
            if (menuItem) {
                menuItem.classList.add('active');
            }
           
            // Show corresponding section
            if (sectionId) {
                document.getElementById(sectionId).classList.add('active');
            }

            // Update chat FAB visibility
            updateChatFabVisibility();
        });
    });
   
    // Logout with SweetAlert
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
       
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¿Deseas cerrar tu sesión?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#1a1a1a',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, cerrar sesión',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // En una implementación real, aquí se haría una llamada al servidor para cerrar sesión
                Swal.fire({
                    title: 'Sesión cerrada',
                    text: 'Tu sesión ha sido cerrada correctamente',
                    icon: 'success',
                    confirmButtonColor: '#1a1a1a',
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    window.location.href = '../../controlador/logout.php';
                });
            }
        });
    });
   
    // Profile Edit Button
    editProfileBtn.addEventListener('click', function() {
        profileDisplay.style.display = 'none';
        editProfileForm.style.display = 'block';
        changePasswordForm.style.display = 'none';
        
        cargarPerfil();
    });
   
    // Change Password Button
    changePasswordBtn.addEventListener('click', function() {
        profileDisplay.style.display = 'none';
        editProfileForm.style.display = 'none';
        changePasswordForm.style.display = 'block';
    });
   
    // Cancel Edit Button
    cancelEditBtn.addEventListener('click', function() {
        profileDisplay.style.display = 'block';
        editProfileForm.style.display = 'none';
        changePasswordForm.style.display = 'none';
    });
   
    // Cancel Password Button
    cancelPasswordBtn.addEventListener('click', function() {
        profileDisplay.style.display = 'block';
        editProfileForm.style.display = 'none';
        changePasswordForm.style.display = 'none';
    });
   
    // Password Toggle Buttons
    document.querySelectorAll('.password-toggle-btn').forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetInput = document.getElementById(targetId);
           
            if (targetInput.type === 'password') {
                targetInput.type = 'text';
                this.innerHTML = '<i class="fas fa-eye-slash"></i>';
            } else {
                targetInput.type = 'password';
                this.innerHTML = '<i class="fas fa-eye"></i>';
            }
        });
    });
   
    // Establecer fecha actual
    const today = new Date();
    const formattedDate = today.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
    document.getElementById('fecha').value = formattedDate;
    document.getElementById('fichaFecha').textContent = formattedDate;
   
    // Actualizar ficha técnica en tiempo real
    document.getElementById('nombre').addEventListener('input', function() {
        document.getElementById('fichaNombre').textContent = this.value || '--';
    });
   
    document.getElementById('marca').addEventListener('input', function() {
        document.getElementById('fichaMarca').textContent = this.value || '--';
    });
   
    document.getElementById('modelo').addEventListener('input', function() {
        document.getElementById('fichaModelo').textContent = this.value || '--';
    });
   
    document.getElementById('telefono').addEventListener('input', function() {
        document.getElementById('fichaTelefono').textContent = this.value || '--';
    });
   
    document.getElementById('zonaAfectada').addEventListener('input', function() {
        document.getElementById('fichaObservaciones').textContent = this.value || '--';
    });
   
    // Tipo de Trabajo Buttons
    tipoTrabajoButtons.forEach(button => {
        button.addEventListener('click', function() {
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
        button.addEventListener('click', function() {
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
    uploadBtn.addEventListener('click', function() {
        imagenInput.click();
    });
   
    imagenInput.addEventListener('change', function() {
        handleImageUpload(this.files);
    });
   
    // Drag and drop
    const uploadContainer = document.querySelector('.image-upload-container');
   
    uploadContainer.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.style.backgroundColor = '#f0f0f0';
    });
   
    uploadContainer.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.style.backgroundColor = '';
    });
   
    uploadContainer.addEventListener('drop', function(e) {
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
            reader.onload = function(e) {
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
            btn.addEventListener('click', function() {
                const imageId = this.getAttribute('data-id');
                uploadedImages = uploadedImages.filter(img => img.id != imageId);
                renderImagePreview();
            });
        });
    }
   
    // Validación del formulario de cotización
    cotizacionForm.addEventListener('submit', function(e) {
        e.preventDefault();
       
        let isValid = true;
       
        // Validar campos requeridos
        const requiredFields = cotizacionForm.querySelectorAll('[required]');
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
        const phoneField = document.getElementById('telefono');
        const phoneRegex = /^[0-9+\-\s()]+$/;
        if (!phoneRegex.test(phoneField.value)) {
            phoneField.classList.add('is-invalid');
            isValid = false;
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
        showLoading(true);
       
        // Crear FormData para enviar archivos
        const formData = new FormData();
       
        // Agregar datos del formulario
        formData.append('nombre', document.getElementById('nombre').value);
        formData.append('direccion', document.getElementById('direccion').value);
        formData.append('telefono', document.getElementById('telefono').value);
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
       
        // Envío real al backend PHP
        fetch('../../controlador/Cliente/cotizacion_cliente.php', {
            method: 'POST',
            body: formData
        })
        .then(r => r.json())
        .then(data => {
            showLoading(false);
            if (data && data.success) {
                showNotification('Cotización enviada correctamente', 'success');
                idCotizacion = data.id_cotizacion;

                // Resetear formulario
                cotizacionForm.reset();
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

                // Actualizar automáticamente todas las secciones
                if (typeof cargarServiciosProceso === 'function') {
                    console.log('Actualizando servicios en proceso después del envío...');
                    cargarServiciosProceso();
                }

                // Actualizar fichas técnicas si existe la función
                if (typeof cargarFichasTecnicas === 'function') {
                    console.log('Actualizando fichas técnicas...');
                    cargarFichasTecnicas();
                }

                // Actualizar garantías si existe la función
                if (typeof cargarGarantias === 'function') {
                    console.log('Actualizando garantías...');
                    cargarGarantias();
                }

                // Navegar a la sección de proceso
                menuItems.forEach(i => i.classList.remove('active'));
                contentSections.forEach(section => section.classList.remove('active'));

                const procesoMenuItem = document.querySelector('.menu-item[data-section="proceso"]');
                if (procesoMenuItem) {
                    procesoMenuItem.classList.add('active');
                    document.getElementById('proceso').classList.add('active');
                }

                // Cargar datos reales del tracker
                loadProgressData(idCotizacion);
            } else {
                showNotification((data && data.message) ? data.message : 'Error al enviar la cotización', 'error');
            }
        })
        .catch(error => {
            showLoading(false);
            showNotification('Error de conexión: ' + error.message, 'error');
        });
    }
   
    // Resetear formulario
    resetBtn.addEventListener('click', function() {
        cotizacionForm.reset();
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
       
        // Quitar clases de validación
        cotizacionForm.querySelectorAll('.is-invalid').forEach(field => {
            field.classList.remove('is-invalid');
        });
    });
   
    // Validación del formulario de perfil
    perfilForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('=== INICIO: Envío de formulario de perfil ===');

        let isValid = true;

        // Validar campos requeridos
        const requiredFields = perfilForm.querySelectorAll('[required]');
        console.log('Campos requeridos encontrados:', requiredFields.length);

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('is-invalid');
                isValid = false;
                console.warn('Campo vacío:', field.id, field.value);
            } else {
                field.classList.remove('is-invalid');
                console.log('Campo válido:', field.id, '=', field.value);
            }
        });

        // Validar email
        const emailField = document.getElementById('perfil_email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
            emailField.classList.add('is-invalid');
            isValid = false;
            console.error('Email inválido:', emailField.value);
        } else {
            console.log('Email válido:', emailField.value);
        }

        if (!isValid) {
            console.error('Validación fallida');
            Swal.fire({
                icon: 'error',
                title: 'Error de validación',
                text: 'Por favor, completa todos los campos requeridos',
                confirmButtonColor: '#1a1a1a'
            });
            return;
        }

        showLoading(true);
        console.log('Cargando...');

        const payload = new URLSearchParams();
        payload.append('nombres', document.getElementById('nombres').value);
        payload.append('apellidos', document.getElementById('apellidos').value);
        payload.append('correo_electronico', document.getElementById('perfil_email').value);
        payload.append('numero_telefono', document.getElementById('perfil_telefono').value);
        payload.append('direccion', document.getElementById('perfil_direccion').value);
        payload.append('ciudad', document.getElementById('perfil_ciudad').value);
        payload.append('estado', document.getElementById('perfil_estado').value);
        payload.append('codigo_postal', document.getElementById('perfil_codigo_postal').value);
        payload.append('pais', document.getElementById('perfil_pais').value);
        payload.append('fecha_nacimiento', document.getElementById('perfil_fecha_nacimiento').value);

        console.log('Datos a enviar:', {
            nombres: document.getElementById('nombres').value,
            apellidos: document.getElementById('apellidos').value,
            correo: document.getElementById('perfil_email').value,
            telefono: document.getElementById('perfil_telefono').value
        });

        console.log('Enviando POST a: ../../controlador/Cliente/perfil_actualizar.php');

        fetch('../../controlador/Cliente/perfil_actualizar.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: payload.toString()
        })
        .then(r => {
            console.log('Respuesta recibida. Status:', r.status);
            return r.json();
        })
        .then(data => {
            console.log('Datos JSON parseados:', data);
            showLoading(false);

            if (!data || !data.success) {
                console.error('Error en respuesta:', data);
                Swal.fire({ icon: 'error', title: 'Error', text: (data && data.message) ? data.message : 'No se pudo actualizar el perfil', confirmButtonColor: '#1a1a1a' });
                return;
            }

            console.log('Actualización exitosa. Actualizando UI...');

            // Actualizar datos mostrados desde inputs
            document.getElementById('displayNombres').textContent = document.getElementById('nombres').value;
            document.getElementById('displayApellidos').textContent = document.getElementById('apellidos').value;
            document.getElementById('displayEmail').textContent = document.getElementById('perfil_email').value;
            document.getElementById('displayTelefono').textContent = document.getElementById('perfil_telefono').value;
            document.getElementById('displayDireccion').textContent = document.getElementById('perfil_direccion').value;
            document.getElementById('displayCiudad').textContent = document.getElementById('perfil_ciudad').value;
            document.getElementById('displayEstado').textContent = document.getElementById('perfil_estado').value;
            document.getElementById('displayCodigoPostal').textContent = document.getElementById('perfil_codigo_postal').value;
            document.getElementById('displayPais').textContent = document.getElementById('perfil_pais').value;
            const fechaNacimiento = document.getElementById('perfil_fecha_nacimiento').value;
            document.getElementById('displayFechaNacimiento').textContent = fechaNacimiento ? new Date(fechaNacimiento).toLocaleDateString('es-ES') : '--';

            profileDisplay.style.display = 'block';
            editProfileForm.style.display = 'none';

            console.log('=== FIN: Perfil actualizado exitosamente ===');
            Swal.fire({ icon: 'success', title: 'Perfil actualizado', text: data.message || 'Actualización exitosa', confirmButtonColor: '#1a1a1a' });
        })
        .catch(err => {
            console.error('Error de conexión:', err);
            showLoading(false);
            Swal.fire({ icon: 'error', title: 'Error de conexión', text: err.message, confirmButtonColor: '#1a1a1a' });
        });
    });
   
    // Validación del formulario de contraseña
    passwordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('=== INICIO: Envío de formulario de cambio de contraseña ===');

        let isValid = true;

        // Validar campos requeridos
        const requiredFields = passwordForm.querySelectorAll('[required]');
        console.log('Campos requeridos encontrados:', requiredFields.length);

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('is-invalid');
                isValid = false;
                console.warn('Campo vacío:', field.id);
            } else {
                field.classList.remove('is-invalid');
                console.log('Campo válido:', field.id);
            }
        });

        // Validar que las contraseñas coincidan
        const passwordNueva = document.getElementById('password_nueva').value;
        const passwordConfirmar = document.getElementById('password_confirmar').value;

        console.log('Longitud contraseña nueva:', passwordNueva.length);
        console.log('Longitud contraseña confirmar:', passwordConfirmar.length);

        if (passwordNueva !== passwordConfirmar) {
            document.getElementById('password_confirmar').classList.add('is-invalid');
            isValid = false;
            console.error('Las contraseñas no coinciden');
        } else {
            console.log('Las contraseñas coinciden');
        }

        if (!isValid) {
            console.error('Validación fallida');
            Swal.fire({
                icon: 'error',
                title: 'Error de validación',
                text: 'Por favor, verifica los campos de contraseña',
                confirmButtonColor: '#1a1a1a'
            });
            return;
        }

        showLoading(true);
        console.log('Cargando...');

        const payload = new URLSearchParams();
        payload.append('password_actual', document.getElementById('password_actual').value);
        payload.append('password_nueva', passwordNueva);
        payload.append('password_confirmar', passwordConfirmar);

        console.log('Datos a enviar (sin mostrar contraseñas por seguridad)');
        console.log('Enviando POST a: ../../controlador/Cliente/cambiar_contrasena.php');

        fetch('../../controlador/Cliente/cambiar_contrasena.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: payload.toString()
        })
        .then(r => {
            console.log('Respuesta recibida. Status:', r.status);
            return r.json();
        })
        .then(data => {
            console.log('Datos JSON parseados:', data);
            showLoading(false);

            if (!data || !data.success) {
                console.error('Error en respuesta:', data);
                Swal.fire({ icon: 'error', title: 'Error', text: (data && data.message) ? data.message : 'No se pudo cambiar la contraseña', confirmButtonColor: '#1a1a1a' });
                return;
            }

            console.log('Cambio de contraseña exitoso. Actualizando UI...');

            profileDisplay.style.display = 'block';
            changePasswordForm.style.display = 'none';
            passwordForm.reset();

            console.log('=== FIN: Contraseña cambiada exitosamente ===');
            Swal.fire({ icon: 'success', title: 'Contraseña cambiada', text: data.message || 'Actualización exitosa', confirmButtonColor: '#1a1a1a' });
        })
        .catch(err => {
            console.error('Error de conexión:', err);
            showLoading(false);
            Swal.fire({ icon: 'error', title: 'Error de conexión', text: err.message, confirmButtonColor: '#1a1a1a' });
        });
    });
   
    // Cargar perfil al entrar a la sección perfil o al cargar
    function cargarPerfil() {
        console.log('=== INICIO: Cargando perfil del usuario ===');
        console.log('Enviando GET a: ../../controlador/Cliente/perfil_obtener.php');

        fetch('../../controlador/Cliente/perfil_obtener.php')
            .then(r => {
                console.log('Respuesta recibida. Status:', r.status);
                return r.json();
            })
            .then(data => {
                console.log('Datos JSON parseados:', data);

                if (!data || !data.success) {
                    console.error('Error al obtener perfil:', data);
                    return;
                }

                const p = data.perfil || {};
                console.log('Perfil obtenido:', p);

                // Inputs de edición
                console.log('Llenando inputs de edición...');
                document.getElementById('nombres').value = p.nombres || '';
                document.getElementById('apellidos').value = p.apellidos || '';
                document.getElementById('perfil_email').value = p.correo_electronico || '';
                document.getElementById('perfil_telefono').value = p.numero_telefono || '';
                document.getElementById('perfil_direccion').value = p.direccion || '';
                document.getElementById('perfil_ciudad').value = p.ciudad || '';
                document.getElementById('perfil_estado').value = p.estado || '';
                document.getElementById('perfil_codigo_postal').value = p.codigo_postal || '';
                document.getElementById('perfil_pais').value = p.pais || '';
                document.getElementById('perfil_fecha_nacimiento').value = p.fecha_nacimiento || '';

                // Displays de lectura
                console.log('Llenando displays de lectura...');
                document.getElementById('displayNombres').textContent = p.nombres || '--';
                document.getElementById('displayApellidos').textContent = p.apellidos || '--';
                document.getElementById('displayEmail').textContent = p.correo_electronico || '--';
                document.getElementById('displayTelefono').textContent = p.numero_telefono || '--';
                document.getElementById('displayDireccion').textContent = p.direccion || '--';
                document.getElementById('displayCiudad').textContent = p.ciudad || '--';
                document.getElementById('displayEstado').textContent = p.estado || '--';
                document.getElementById('displayCodigoPostal').textContent = p.codigo_postal || '--';
                document.getElementById('displayPais').textContent = p.pais || '--';
                document.getElementById('displayFechaNacimiento').textContent = p.fecha_nacimiento ? new Date(p.fecha_nacimiento).toLocaleDateString('es-ES') : '--';

                console.log('=== FIN: Perfil cargado exitosamente ===');
            })
            .catch(err => {
                console.error('Error de conexión al cargar perfil:', err);
            });
    }
    // Carga inicial al abrir la página
    cargarPerfil();
    updateFichaTecnicaInitial(); // Llamar para inicializar la ficha técnica con los datos del usuario

    // Función para actualizar la ficha técnica con los valores iniciales del formulario de cotización
    function updateFichaTecnicaInitial() {
        document.getElementById('fichaNombre').textContent = document.getElementById('nombre').value || '--';
        document.getElementById('fichaTelefono').textContent = document.getElementById('telefono').value || '--';
        // No hay un campo directo para email en la ficha técnica, pero se puede añadir si es necesario
        document.getElementById('fichaObservaciones').textContent = document.getElementById('zonaAfectada').value || '--';
    }

   
    // Cargar datos del tracker (simulado)
    function loadProgressData(idCot) {
        if (!idCot) return;
        fetch(`../../controlador/Cliente/progreso_cotizacion.php?id_cotizacion=${idCot}`)
        .then(r => r.json())
        .then(data => {
            if (!data || !data.success) return;

                // Determinar paso actual
                let pasoActual = 1;
                if (Array.isArray(data.progreso) && data.progreso.length > 0) {
                    const activos = data.progreso.filter(p => parseInt(p.activo) === 1);
                    if (activos.length > 0) {
                        pasoActual = Math.max(...activos.map(p => parseInt(p.paso)));
                    } else {
                        pasoActual = Math.max(...data.progreso.map(p => parseInt(p.paso)));
                    }
                }

                // Actualizar pasos del progreso
                document.querySelectorAll('.progress-step').forEach(step => {
                    const stepNumber = parseInt(step.getAttribute('data-step'));
                    if (stepNumber < pasoActual) {
                        step.classList.add('completed');
                        step.classList.remove('active');
                    } else if (stepNumber === pasoActual) {
                        step.classList.add('active');
                        step.classList.remove('completed');
                    } else {
                        step.classList.remove('active', 'completed');
                    }
                });

                // Cargar imágenes del proceso
                renderStatusImages(Array.isArray(data.imagenes) ? data.imagenes : []);

                // Cargar comentarios
                renderStatusComments(Array.isArray(data.comentarios) ? data.comentarios : []);

            })
            .catch(() => { /* silenciar errores */ });
    }

   
    // Cargar imágenes del estado (simulado)
    function renderStatusImages(imagenes) {
        const container = document.getElementById('statusImagesContainer');
        container.innerHTML = '';
        imagenes.forEach((img, i) => {
            const imageElement = document.createElement('div');
            imageElement.className = 'col-md-4 mb-3';
            const src = img.ruta_imagen || '';
            const nombre = img.nombre_archivo || `Imagen ${i+1}`;
            imageElement.innerHTML = `
                <img src="../../${src}" alt="${nombre}" class="status-image">
                <p class="text-center">${nombre}</p>
            `;
            container.appendChild(imageElement);
        });
    }
   
    // Cargar comentarios del estado (simulado)
    function renderStatusComments(comentarios) {
        const container = document.getElementById('statusCommentsContainer');
        container.innerHTML = '';
        comentarios.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.className = 'status-comment';
            const autor = comment.autor || 'Administrador';
            const fecha = (comment.creado_en ? new Date(comment.creado_en) : new Date()).toLocaleDateString('es-ES');
            const mensaje = comment.mensaje || '';
            commentElement.innerHTML = `
                <div class="d-flex justify-content-between">
                    <strong>${autor}</strong>
                    <small>${fecha}</small>
                </div>
                <p class="mb-0 mt-1">${mensaje}</p>
            `;
            container.appendChild(commentElement);
        });
    }
   
    // Funciones auxiliares
    function showNotification(message, type = 'info') {
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.classList.add('show');
       
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }
   
    function showLoading(show) {
        if (show) {
            loadingOverlay.classList.add('active');
        } else {
            loadingOverlay.classList.remove('active');
        }
    }

    // Función para cargar garantías
    function cargarGarantias() {
        console.log('Cargando garantías...');
        const warrantySection = document.querySelector('#garantias .warranty-section');
        const notificationsCard = document.querySelector('#garantias .card-body');

        // Mostrar loading
        if (warrantySection) {
            warrantySection.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div><p class="mt-3">Cargando garantías...</p></div>';
        }

        fetch('../../controlador/Cliente/obtener_garantias.php')
            .then(r => r.json())
            .then(data => {
                if (!data || !data.success) {
                    console.error('Error al cargar garantías:', data);
                    if (warrantySection) {
                        warrantySection.innerHTML = '<h5><i class="fas fa-shield-alt"></i> Garantías Activas</h5><p>No se pudieron cargar las garantías.</p>';
                    }
                    return;
                }

                const garantias = data.garantias || [];
                console.log('Garantías cargadas:', garantias);

                // Renderizar garantías
                let html = '<h5><i class="fas fa-shield-alt"></i> Garantías Activas</h5>';
                if (garantias.length === 0) {
                    html += '<p>No tienes garantías activas.</p>';
                } else {
                    garantias.forEach(g => {
                        const fechaInicio = new Date(g.fecha_inicio).toLocaleDateString('es-ES');
                        const fechaFin = new Date(g.fecha_fin).toLocaleDateString('es-ES');
                        const estadoClass = g.estado === 'Activa' ? 'active' : g.estado === 'Vencida' ? 'expired' : 'cancelled';
                        const estadoText = g.estado;

                        html += `
                            <div class="warranty-item">
                                <h6>${g.tipo_garantia}</h6>
                                <p>${g.cobertura || 'Sin descripción'}</p>
                                <div class="warranty-dates">
                                    <span class="warranty-date">Inicio: ${fechaInicio}</span>
                                    <span class="warranty-date">Fin: ${fechaFin}</span>
                                </div>
                                <span class="warranty-status ${estadoClass}">${estadoText}</span>
                                <button class="btn-ver-detalles mt-2 ver-detalles-btn" data-garantia='${JSON.stringify(g)}'>
                                    <i class="fas fa-eye"></i> Ver Detalles
                                </button>
                            </div>
                        `;
                    });
                }

                if (warrantySection) {
                    warrantySection.innerHTML = html;
                }

                // Generar recordatorios
                generarRecordatorios(garantias, notificationsCard);

                // Agregar event listeners para botones de detalles
                document.querySelectorAll('.ver-detalles-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const garantia = JSON.parse(this.getAttribute('data-garantia'));

                        // Llenar el modal
                        document.getElementById('modalNombreCompleto').textContent = garantia.nombre_completo;
                        document.getElementById('modalTipoGarantia').textContent = garantia.tipo_garantia;
                        document.getElementById('modalCobertura').textContent = garantia.cobertura;
                        document.getElementById('modalEstado').textContent = garantia.estado;
                        document.getElementById('modalFechaInicio').textContent = new Date(garantia.fecha_inicio).toLocaleDateString('es-ES');
                        document.getElementById('modalFechaFin').textContent = new Date(garantia.fecha_fin).toLocaleDateString('es-ES');
                        document.getElementById('modalMarca').textContent = garantia.marca_bicicleta;
                        document.getElementById('modalModelo').textContent = garantia.modelo_bicicleta;
                        document.getElementById('modalZonaAfectada').textContent = garantia.zona_afectada;
                        document.getElementById('modalTipoTrabajo').textContent = garantia.tipo_trabajo;
                        document.getElementById('modalTipoReparacion').textContent = garantia.tipo_reparacion;
                        document.getElementById('modalDescripcionOtros').textContent = garantia.descripcion_otros || 'N/A';

                        // Mostrar modal
                        const modal = new bootstrap.Modal(document.getElementById('garantiaModal'));
                        modal.show();
                    });
                });
            })
            .catch(err => {
                console.error('Error de conexión al cargar garantías:', err);
                if (warrantySection) {
                    warrantySection.innerHTML = '<h5><i class="fas fa-shield-alt"></i> Garantías Activas</h5><p>Error al cargar garantías.</p>';
                }
            });
    }

    // Función para generar recordatorios basados en fechas de vencimiento
    function generarRecordatorios(garantias, container) {
        if (!container) return;

        let html = '';

        const hoy = new Date();
        const treintaDias = new Date();
        treintaDias.setDate(hoy.getDate() + 30);

        // Recordatorios para garantías por vencer en 30 días
        const porVencer = garantias.filter(g => {
            const fechaFin = new Date(g.fecha_fin);
            return fechaFin >= hoy && fechaFin <= treintaDias;
        });

        if (porVencer.length > 0) {
            porVencer.forEach(g => {
                const diasRestantes = Math.ceil((new Date(g.fecha_fin) - hoy) / (1000 * 60 * 60 * 24));
                html += `
                    <div class="alert alert-danger" role="alert">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        <strong>Recordatorio:</strong> Tu garantía para "${g.tipo_garantia}" vence en ${diasRestantes} días.
                        <a href="#" class="alert-link">Programa mantenimiento</a>
                    </div>
                `;
            });
        }

        // Información general
        html += `
            <div class="alert alert-warning" role="alert">
                <i class="fas fa-info-circle me-2"></i>
                <strong>Información:</strong> Te enviaremos notificaciones 30 días antes del vencimiento de cada garantía.
            </div>
        `;

        container.innerHTML = html;
    }

    // Hacer cargarGarantias global para que pueda ser llamada desde otros lugares
    window.cargarGarantias = cargarGarantias;

    // Initialize chat FAB visibility
    updateChatFabVisibility();

    // Handle photo guide image modal
    const imageModal = document.getElementById('imageModal');
    if (imageModal) {
        imageModal.addEventListener('show.bs.modal', function(event) {
            const button = event.relatedTarget;
            const src = button.getAttribute('data-src');
            const title = button.getAttribute('data-title');

            const modalImage = document.getElementById('modalImage');
            const modalTitle = document.getElementById('imageModalLabel');

            if (modalImage && src) {
                modalImage.src = src;
                modalImage.alt = title || 'Imagen ampliada';
            }

            if (modalTitle && title) {
                modalTitle.textContent = title;
            }
        });
    }
});
