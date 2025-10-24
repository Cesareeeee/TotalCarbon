document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    let uploadedImages = [];
    let cotizacionId = null;
    let notificationCount = 3;
    
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
    
    // Elementos del chat
    const chatContainer = document.getElementById('chatContainer');
    const chatFab = document.getElementById('chatFab');
    const chatClose = document.getElementById('chatClose');
    const chatInput = document.getElementById('chatInput');
    const chatSendBtn = document.getElementById('chatSendBtn');
    const currentChatMessages = document.getElementById('currentChatMessages');
    const historyChatMessages = document.getElementById('historyChatMessages');
    const chatTabs = document.querySelectorAll('.chat-tab');
    
    // Elementos auxiliares
    const notification = document.getElementById('notification');
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    // Cargar datos del usuario desde la sesión
    function cargarDatosUsuario() {
        // En una implementación real, estos datos vendrían de la sesión PHP
        const usuarioData = {
            id_usuario: 13,
            nombres: 'Juan',
            apellidos: 'Pérez',
            correo_electronico: '7u7thin@gmail.com',
            numero_telefono: '2481955951',
            foto_perfil: 'https://picsum.photos/seed/avatar/300/300.jpg'
        };
        
        // Actualizar elementos de la interfaz con los datos del usuario
        document.querySelector('.welcome-title').textContent = `¡Bienvenido, ${usuarioData.nombres} ${usuarioData.apellidos}!`;
        document.getElementById('displayNombres').textContent = usuarioData.nombres;
        document.getElementById('displayApellidos').textContent = usuarioData.apellidos;
        document.getElementById('displayEmail').textContent = usuarioData.correo_electronico;
        document.getElementById('displayTelefono').textContent = usuarioData.numero_telefono;
        
        // Actualizar avatar
        if (usuarioData.foto_perfil) {
            document.querySelector('.profile-avatar img').src = usuarioData.foto_perfil;
            document.querySelector('.profile-icon img').src = usuarioData.foto_perfil;
        }
        
        return usuarioData;
    }
    
    // Cargar datos del usuario al iniciar
    const usuarioData = cargarDatosUsuario();
    
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
        notificationCount = 0;
        notificationBadge.style.display = 'none';
        
        // Show notification panel (simulado)
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
            }
            
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
                window.location.href = '../../controlador/logout.php';
            }
        });
    });
    
    // Profile Edit Button
    editProfileBtn.addEventListener('click', function() {
        profileDisplay.style.display = 'none';
        editProfileForm.style.display = 'block';
        changePasswordForm.style.display = 'none';
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
                const imageId = parseFloat(this.getAttribute('data-id'));
                uploadedImages = uploadedImages.filter(img => img.id !== imageId);
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
        
        // Enviar formulario mediante AJAX
        fetch('../../controlador/Cliente/procesar_cotizacion.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            showLoading(false);
            
            if (data.success) {
                showNotification('Cotización enviada correctamente', 'success');
                cotizacionId = data.cotizacionId;
                
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
                
                // Navegar a la sección de proceso
                menuItems.forEach(i => i.classList.remove('active'));
                contentSections.forEach(section => section.classList.remove('active'));
                
                const procesoMenuItem = document.querySelector('.menu-item[data-section="proceso"]');
                if (procesoMenuItem) {
                    procesoMenuItem.classList.add('active');
                    document.getElementById('proceso').classList.add('active');
                }
                
                // Cargar datos del tracker
                loadProgressData();
            } else {
                showNotification(data.message || 'Error al enviar la cotización', 'error');
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
        
        let isValid = true;
        
        // Validar campos requeridos
        const requiredFields = perfilForm.querySelectorAll('[required]');
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
        
        if (isValid) {
            showLoading(true);
            
            // Enviar formulario mediante AJAX
            const formData = new FormData(perfilForm);
            
            fetch('../../controlador/Cliente/actualizar_perfil.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                showLoading(false);
                
                if (data.success) {
                    // Actualizar datos mostrados
                    document.getElementById('displayNombres').textContent = document.getElementById('nombres').value;
                    document.getElementById('displayApellidos').textContent = document.getElementById('apellidos').value;
                    document.getElementById('displayEmail').textContent = document.getElementById('email').value;
                    document.getElementById('displayTelefono').textContent = document.getElementById('telefono').value;
                    document.getElementById('displayDireccion').textContent = document.getElementById('direccion').value;
                    document.getElementById('displayCiudad').textContent = document.getElementById('ciudad').value;
                    document.getElementById('displayEstado').textContent = document.getElementById('estado').value;
                    document.getElementById('displayCodigoPostal').textContent = document.getElementById('codigo_postal').value;
                    document.getElementById('displayPais').textContent = document.getElementById('pais').value;
                    
                    // Formatear fecha de nacimiento
                    const fechaNacimiento = new Date(document.getElementById('fecha_nacimiento').value);
                    const formattedDate = fechaNacimiento.toLocaleDateString('es-ES');
                    document.getElementById('displayFechaNacimiento').textContent = formattedDate;
                    
                    // Mostrar display y ocultar formulario
                    profileDisplay.style.display = 'block';
                    editProfileForm.style.display = 'none';
                    
                    Swal.fire({
                        icon: 'success',
                        title: 'Perfil actualizado',
                        text: 'Tu perfil ha sido actualizado correctamente',
                        confirmButtonColor: '#1a1a1a'
                    });
                } else {
                    showNotification(data.message || 'Error al actualizar el perfil', 'error');
                }
            })
            .catch(error => {
                showLoading(false);
                showNotification('Error de conexión: ' + error.message, 'error');
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error de validación',
                text: 'Por favor, completa todos los campos requeridos',
                confirmButtonColor: '#1a1a1a'
            });
        }
    });
    
    // Validación del formulario de contraseña
    passwordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        
        // Validar campos requeridos
        const requiredFields = passwordForm.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('is-invalid');
                isValid = false;
            } else {
                field.classList.remove('is-invalid');
            }
        });
        
        // Validar que las contraseñas coincidan
        const passwordNueva = document.getElementById('password_nueva').value;
        const passwordConfirmar = document.getElementById('password_confirmar').value;
        
        if (passwordNueva !== passwordConfirmar) {
            document.getElementById('password_confirmar').classList.add('is-invalid');
            isValid = false;
        }
        
        if (isValid) {
            showLoading(true);
            
            // Enviar formulario mediante AJAX
            const formData = new FormData(passwordForm);
            
            fetch('../../controlador/Cliente/cambiar_contrasena.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                showLoading(false);
                
                if (data.success) {
                    // Mostrar display y ocultar formulario
                    profileDisplay.style.display = 'block';
                    changePasswordForm.style.display = 'none';
                    
                    // Resetear formulario
                    passwordForm.reset();
                    
                    Swal.fire({
                        icon: 'success',
                        title: 'Contraseña cambiada',
                        text: 'Tu contraseña ha sido cambiada correctamente',
                        confirmButtonColor: '#1a1a1a'
                    });
                } else {
                    showNotification(data.message || 'Error al cambiar la contraseña', 'error');
                }
            })
            .catch(error => {
                showLoading(false);
                showNotification('Error de conexión: ' + error.message, 'error');
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error de validación',
                text: 'Por favor, verifica los campos de contraseña',
                confirmButtonColor: '#1a1a1a'
            });
        }
    });
    
    // Chat functionality
    chatFab.addEventListener('click', function() {
        chatContainer.classList.add('active');
        chatInput.focus();
    });
    
    chatClose.addEventListener('click', function() {
        chatContainer.classList.remove('active');
    });
    
    // Chat tabs
    chatTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs and messages
            chatTabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.chat-messages').forEach(m => m.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show corresponding messages
            const tabType = this.getAttribute('data-tab');
            if (tabType === 'current') {
                currentChatMessages.classList.add('active');
            } else if (tabType === 'history') {
                historyChatMessages.classList.add('active');
                loadChatHistory();
            }
        });
    });
    
    chatSendBtn.addEventListener('click', sendChatMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
    
    function sendChatMessage() {
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Agregar mensaje al chat
        addChatMessage(message, 'sent', currentChatMessages);
        
        // Limpiar input
        chatInput.value = '';
        
        // Enviar mensaje mediante AJAX
        const formData = new FormData();
        formData.append('mensaje', message);
        formData.append('id_cotizacion', cotizacionId);
        
        fetch('../../controlador/Cliente/enviar_mensaje_chat.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Incrementar notificación
                incrementNotificationCount();
            } else {
                showNotification('Error al enviar mensaje', 'error');
            }
        })
        .catch(error => {
            showNotification('Error de conexión: ' + error.message, 'error');
        });
    }
    
    function addChatMessage(message, type, container) {
        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${type}`;
        
        const time = new Date().toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        messageElement.innerHTML = `
            <div class="chat-bubble">${message}</div>
            <div class="chat-time">${time}</div>
        `;
        
        container.appendChild(messageElement);
        container.scrollTop = container.scrollHeight;
    }
    
    function loadChatHistory() {
        // Limpiar historial actual
        historyChatMessages.innerHTML = '';
        
        // Cargar historial de chat mediante AJAX
        fetch(`../../controlador/Cliente/obtener_historial_chat.php?id_usuario=${usuarioData.id_usuario}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                data.mensajes.forEach(msg => {
                    const messageElement = document.createElement('div');
                    messageElement.className = `chat-message ${msg.tipo}`;
                    
                    messageElement.innerHTML = `
                        <div class="chat-bubble">${msg.mensaje}</div>
                        <div class="chat-time">${msg.fecha}</div>
                    `;
                    
                    historyChatMessages.appendChild(messageElement);
                });
            }
        })
        .catch(error => {
            showNotification('Error al cargar historial de chat', 'error');
        });
    }
    
    // Function to increment notification count
    function incrementNotificationCount() {
        notificationCount++;
        notificationBadge.textContent = notificationCount;
        notificationBadge.style.display = 'flex';
    }
    
    // Cargar datos del tracker
    function loadProgressData() {
        // Cargar datos del tracker mediante AJAX
        fetch(`../../controlador/Cliente/obtener_cotizaciones.php?id_usuario=${usuarioData.id_usuario}&accion=proceso`)
        .then(response => response.json())
        .then(data => {
            if (data.success && data.cotizaciones.length > 0) {
                const cotizacion = data.cotizaciones[0];
                
                // Actualizar pasos del progreso
                document.querySelectorAll('.progress-step').forEach((step, index) => {
                    const stepNumber = parseInt(step.getAttribute('data-step'));
                    
                    if (stepNumber < cotizacion.estado_id) {
                        step.classList.add('completed');
                        step.classList.remove('active');
                    } else if (stepNumber === cotizacion.estado_id) {
                        step.classList.add('active');
                        step.classList.remove('completed');
                    } else {
                        step.classList.remove('active', 'completed');
                    }
                });
                
                // Cargar imágenes del proceso
                loadStatusImages(cotizacion.id);
                
                // Cargar comentarios
                loadStatusComments(cotizacion.id);
            }
        })
        .catch(error => {
            showNotification('Error al cargar datos del proceso', 'error');
        });
    }
    
    // Cargar imágenes del estado
    function loadStatusImages(cotizacionId) {
        const container = document.getElementById('statusImagesContainer');
        container.innerHTML = '';
        
        // Cargar imágenes mediante AJAX
        fetch(`../../controlador/Cliente/obtener_imagenes_proceso.php?id_cotizacion=${cotizacionId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                data.imagenes.forEach(imagen => {
                    const imageElement = document.createElement('div');
                    imageElement.className = 'col-md-4 mb-3';
                    imageElement.innerHTML = `
                        <img src="${imagen.ruta}" alt="${imagen.nombre}" class="status-image">
                        <p class="text-center">${imagen.nombre}</p>
                    `;
                    container.appendChild(imageElement);
                });
            }
        })
        .catch(error => {
            showNotification('Error al cargar imágenes del proceso', 'error');
        });
    }
    
    // Cargar comentarios del estado
    function loadStatusComments(cotizacionId) {
        const container = document.getElementById('statusCommentsContainer');
        container.innerHTML = '';
        
        // Cargar comentarios mediante AJAX
        fetch(`../../controlador/Cliente/obtener_comentarios_proceso.php?id_cotizacion=${cotizacionId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                data.comentarios.forEach(comment => {
                    const commentElement = document.createElement('div');
                    commentElement.className = 'status-comment';
                    commentElement.innerHTML = `
                        <div class="d-flex justify-content-between">
                            <strong>${comment.autor}</strong>
                            <small>${comment.fecha}</small>
                        </div>
                        <p class="mb-0 mt-1">${comment.mensaje}</p>
                    `;
                    container.appendChild(commentElement);
                });
            }
        })
        .catch(error => {
            showNotification('Error al cargar comentarios', 'error');
        });
    }
    
    // Cargar garantías
    function loadGarantias() {
        const container = document.querySelector('.warranty-section');
        
        // Cargar garantías mediante AJAX
        fetch(`../../controlador/Cliente/obtener_garantias.php?id_usuario=${usuarioData.id_usuario}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                container.innerHTML = '<h5><i class="fas fa-shield-alt"></i> Garantías Activas</h5>';
                
                data.garantias.forEach(garantia => {
                    const warrantyElement = document.createElement('div');
                    warrantyElement.className = 'warranty-item';
                    
                    // Determinar clase de estado
                    let statusClass = 'active';
                    if (garantia.estado === 'EXPIRADA') {
                        statusClass = 'expired';
                    } else if (garantia.estado === 'POR_VENCER') {
                        statusClass = 'expiring';
                    }
                    
                    warrantyElement.innerHTML = `
                        <h6>${garantia.tipo_servicio}</h6>
                        <p>${garantia.descripcion}</p>
                        <div class="warranty-dates">
                            <span class="warranty-date">Inicio: ${garantia.fecha_inicio}</span>
                            <span class="warranty-date">Fin: ${garantia.fecha_fin}</span>
                        </div>
                        <span class="warranty-status ${statusClass}">${garantia.estado}</span>
                    `;
                    
                    container.appendChild(warrantyElement);
                });
            }
        })
        .catch(error => {
            showNotification('Error al cargar garantías', 'error');
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
    
    // Cargar garantías al iniciar la sección
    document.querySelector('.menu-item[data-section="garantias"]').addEventListener('click', function() {
        loadGarantias();
    });
});