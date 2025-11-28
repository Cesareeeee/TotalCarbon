
        // Variables globales
        let arregloUsuarios = [];
        let arregloProveedores = [];
        let arregloProductos = [];
        let arregloGarantias = [];
        let arregloCotizaciones = [];
        let arregloServiciosCompletados = [];
        let seccionActual = 'clientes';
        let elementoEditando = null;
        let idEditandoActual = null;

        // Funciones de inicialización
        async function initializeData() {
            await loadProveedores();
            await loadProductos();
            // Cargar otros datos si es necesario
        }

        function confirmLogout() {
            Swal.fire({
                title: '¿Está seguro?',
                text: "¿Desea cerrar la sesión?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#1a1a1a',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Sí, cerrar sesión',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = '../../controlador/logout.php';
                }
            });
        }

        // Funciones de navegación
        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            const hamburger = document.getElementById('hamburger');
            const overlay = document.getElementById('sidebarOverlay');
            
            sidebar.classList.toggle('visible');
            hamburger.classList.toggle('active');
            overlay.classList.toggle('active');
        }

        function showSection(section) {
            // Ocultar todas las secciones
            document.querySelectorAll('.content-section').forEach(sec => {
                sec.classList.remove('active');
            });

            // Mostrar la sección seleccionada
            const targetSection = document.getElementById(section + '-section');
            if (targetSection) {
                targetSection.classList.add('active');
            }

            // Actualizar menú lateral
            document.querySelectorAll('.sidebar-menu a').forEach(link => {
                link.classList.remove('active');
            });
            if (event && event.target) {
                event.target.classList.add('active');
            }

            seccionActual = section;

            // Mostrar/ocultar botón flotante del chat
            const chatFloatingBtn = document.getElementById('chatFloatingBtn');
            if (chatFloatingBtn) {
                if (section === 'chat') {
                    chatFloatingBtn.style.display = 'none';
                } else {
                    chatFloatingBtn.style.display = 'flex';
                }
            }

            // Cerrar sidebar en móvil
            if (window.innerWidth <= 992) {
                toggleSidebar();
            }

            // Cargar datos específicos de la sección
            if (section === 'garantias') {
                loadGarantias();
            }
        }

        // Funciones de carga de datos
        async function loadProveedores() {
            try {
                const response = await fetch('../../controlador/Administrador/proveedores_controller.php?action=getProveedores');
                arregloProveedores = await response.json();

                const tbody = document.getElementById('proveedoresTableBody');
                tbody.innerHTML = '';

                arregloProveedores.forEach(proveedor => {
                    const row = createProveedorRow(proveedor);
                    tbody.appendChild(row);
                });
            } catch (error) {
                // Error silencioso
            }
        }

        function createProveedorRow(proveedor) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="client-info">
                        <div class="client-avatar">
                            <i class="fas fa-building"></i>
                        </div>
                        <div class="client-details">
                            <h4>${proveedor.nombre_proveedor}</h4>
                        </div>
                    </div>
                </td>
                <td>${proveedor.contacto || 'N/A'}</td>
                <td>
                    <div class="contact-info">
                        <i class="fas fa-phone"></i>
                        <span>${proveedor.telefono || 'N/A'}</span>
                    </div>
                </td>
                <td>
                    <div class="contact-info">
                        <i class="fas fa-envelope"></i>
                        <span>${proveedor.correo || 'N/A'}</span>
                    </div>
                </td>
                <td>
                    <div class="contact-info">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${proveedor.direccion || 'N/A'}</span>
                    </div>
                </td>
                <td>
                    <div class="table-actions">
                        <button class="action-btn" onclick="viewProveedor(${proveedor.id_proveedor})" title="Ver más información">
                            <i class="fas fa-info-circle"></i>
                        </button>
                        <button class="action-btn" onclick="editProveedor(${proveedor.id_proveedor})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="deleteProveedor(${proveedor.id_proveedor})" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            return row;
        }

        // Funciones de carga de datos para productos
        async function loadProductos() {
            try {
                const response = await fetch('../../controlador/Administrador/compras_proveedores_controller.php?action=getComprasProveedores');
                arregloProductos = await response.json();

                const tbody = document.getElementById('productosTableBody');
                tbody.innerHTML = '';

                arregloProductos.forEach(producto => {
                    const row = createProductoRow(producto);
                    tbody.appendChild(row);
                });
            } catch (error) {
            }
        }

        // Funciones de carga de datos para garantías
        async function loadGarantias() {
            try {
                const response = await fetch('../../controlador/Administrador/garantias_controller.php?action=getGarantias');
                const data = await response.json();

                if (data.success) {
                    arregloGarantias = data.garantias;
                    const tbody = document.getElementById('garantiasTableBody');
                    tbody.innerHTML = '';

                    arregloGarantias.forEach(garantia => {
                        const row = createGarantiaRow(garantia);
                        tbody.appendChild(row);
                    });
                }
            } catch (error) {
            }
        }

        function createProductoRow(producto) {
            const precioUnitario = producto.precio_unitario ? parseFloat(producto.precio_unitario) : 0;
            const cantidad = producto.cantidad || 1;
            const total = precioUnitario * cantidad;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="client-info">
                        <div class="client-avatar">
                            <i class="fas fa-cog"></i>
                        </div>
                        <div class="client-details">
                            <h4>${producto.nombre_producto}</h4>
                            ${producto.descripcion ? `<p>${producto.descripcion}</p>` : ''}
                        </div>
                    </div>
                </td>
                <td>${producto.nombre_proveedor || 'N/A'}</td>
                <td>${producto.cantidad || 1}</td>
                <td>$${precioUnitario.toFixed(2)}</td>
                <td>$${total.toFixed(2)}</td>
                <td>${new Date(producto.fecha_adquirido).toLocaleDateString('es-MX')}</td>
                <td>${producto.numero_factura || 'N/A'}</td>
                <td>
                    <div class="notas-cell" title="${producto.notas || ''}">
                        ${producto.notas ? producto.notas.substring(0, 20) + (producto.notas.length > 20 ? '...' : '') : 'N/A'}
                    </div>
                </td>
                <td>
                    <div class="table-actions">
                        <button class="action-btn" onclick="viewProducto(${producto.id_compra})" title="Ver detalles">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn" onclick="editProducto(${producto.id_compra})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="deleteProducto(${producto.id_compra})" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            return row;
        }

        function createGarantiaRow(garantia) {
            const nombreBicicleta = `${garantia.marca_bicicleta || 'N/A'} ${garantia.modelo_bicicleta || ''}`.trim();
            const dueno = `${garantia.nombres || ''} ${garantia.apellidos || ''}`.trim();
            const fechaVencimiento = new Date(garantia.fecha_fin).toLocaleDateString('es-MX');

            // Determinar clase CSS para el estado
            let estadoClass = '';
            if (garantia.estado === 'Activa') estadoClass = 'status-active';
            else if (garantia.estado === 'Vencida') estadoClass = 'status-expired';
            else if (garantia.estado === 'Cancelada') estadoClass = 'status-cancelled';
            else estadoClass = 'status-other';

            // Truncar cobertura para mostrar en tabla
            const coberturaTruncada = garantia.cobertura ?
                (garantia.cobertura.length > 50 ? garantia.cobertura.substring(0, 50) + '...' : garantia.cobertura) :
                'Sin descripción';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${garantia.id_garantia}</td>
                <td>
                    <div class="client-info">
                        <i class="fas fa-bicycle"></i>
                        <div class="client-details">
                            <h4>${nombreBicicleta}</h4>
                            <p>${garantia.zona_afectada || 'N/A'}</p>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="client-info">
                        <i class="fas fa-user"></i>
                        <div class="client-details">
                            <h4>${dueno}</h4>
                            <p>${garantia.correo_electronico || 'N/A'}</p>
                        </div>
                    </div>
                </td>
                <td>${garantia.tipo_garantia}</td>
                <td>
                    <div class="cobertura-cell" title="${garantia.cobertura || ''}">
                        ${coberturaTruncada}
                    </div>
                </td>
                <td>${fechaVencimiento}</td>
                <td>
                    <span class="status-badge ${estadoClass}">${garantia.estado}</span>
                </td>
                <td>
                    <div class="table-actions">
                        <button class="action-btn" onclick="viewGarantia(${garantia.id_garantia})" title="Ver detalles">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn" onclick="editGarantia(${garantia.id_garantia})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="deleteGarantia(${garantia.id_garantia})" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            return row;
        }

        // Funciones de modales
        function openModal(modalId) {
            const modal = document.getElementById(modalId);
            modal.classList.add('active');
        }

        function closeModal(modalId) {
            const modal = document.getElementById(modalId);
            modal.classList.remove('active');
            clearForm(modalId);
            elementoEditando = null;
            idEditandoActual = null;
        }

        function clearForm(modalId) {
            const form = document.querySelector(`#${modalId} form`);
            if (form) {
                form.reset();
                // Limpiar errores
                form.querySelectorAll('.form-control').forEach(input => {
                    input.classList.remove('error');
                });
                form.querySelectorAll('.error-message').forEach(error => {
                    error.classList.remove('show');
                });
            }
        }

        // Funciones de garantías
        function openGarantiaModal() {
            document.getElementById('garantiaModalTitle').textContent = 'Nueva Garantía';
            document.getElementById('garantiaSaveBtn').textContent = 'Guardar Garantía';
            loadServiciosCompletados();
            // Resetear campos
            document.getElementById('tipo_garantia').value = '';
            document.getElementById('tipo_garantia_personalizado').value = '';
            document.getElementById('fecha_inicio').value = '';
            document.getElementById('periodo_garantia').value = '';
            document.getElementById('fecha_fin').value = '';
            toggleTipoGarantiaPersonalizado();
            openModal('garantiaModal');
        }

        function toggleTipoGarantiaPersonalizado() {
            const tipoGarantia = document.getElementById('tipo_garantia').value;
            const personalizadoGroup = document.getElementById('tipo_personalizado_group');
            const personalizadoInput = document.getElementById('tipo_garantia_personalizado');

            if (tipoGarantia === 'Otros') {
                personalizadoGroup.style.display = 'block';
                personalizadoInput.required = true;
            } else {
                personalizadoGroup.style.display = 'none';
                personalizadoInput.required = false;
                personalizadoInput.value = '';
            }
        }

        async function loadServiciosCompletados() {
            try {
                const response = await fetch('../../controlador/Administrador/garantias_controller.php?action=getServiciosCompletados');
                const data = await response.json();

                if (data.success) {
                    arregloServiciosCompletados = data.servicios;
                    const select = document.getElementById('servicio_completado');
                    select.innerHTML = '<option value="">Seleccionar servicio completado</option>';

                    arregloServiciosCompletados.forEach(servicio => {
                        const nombreBicicleta = `${servicio.marca_bicicleta || 'N/A'} ${servicio.modelo_bicicleta || ''}`.trim();
                        const dueno = `${servicio.nombres || ''} ${servicio.apellidos || ''}`.trim();
                        const option = document.createElement('option');
                        option.value = servicio.id_cotizacion;
                        option.textContent = `ID ${servicio.id_cotizacion} - ${nombreBicicleta} (${dueno})`;
                        select.appendChild(option);
                    });
                }
            } catch (error) {
            }
        }

        function calcularFechaFin() {
            const fechaInicio = document.getElementById('fecha_inicio').value;
            const periodo = document.getElementById('periodo_garantia').value;
            const fechaFinInput = document.getElementById('fecha_fin');

            if (fechaInicio && periodo) {
                const fechaInicioDate = new Date(fechaInicio);
                let fechaFinDate = new Date(fechaInicioDate);

                if (periodo === '1') {
                    fechaFinDate.setMonth(fechaFinDate.getMonth() + 1);
                } else if (periodo === '3') {
                    fechaFinDate.setMonth(fechaFinDate.getMonth() + 3);
                } else if (periodo === '12') {
                    fechaFinDate.setFullYear(fechaFinDate.getFullYear() + 1);
                }

                const year = fechaFinDate.getFullYear();
                const month = String(fechaFinDate.getMonth() + 1).padStart(2, '0');
                const day = String(fechaFinDate.getDate()).padStart(2, '0');
                fechaFinInput.value = `${year}-${month}-${day}`;
            }
        }

        async function saveGarantia() {
            if (!validateGarantiaForm()) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error de Validación',
                    text: 'Por favor, complete todos los campos requeridos correctamente.',
                    confirmButtonColor: '#1a1a1a'
                });
                return;
            }

            let tipoGarantia = document.getElementById('tipo_garantia').value;
            if (tipoGarantia === 'Otros') {
                tipoGarantia = document.getElementById('tipo_garantia_personalizado').value;
            }

            const garantiaData = {
                id_cotizacion: document.getElementById('servicio_completado').value,
                tipo_garantia: tipoGarantia,
                cobertura: document.getElementById('cobertura').value,
                fecha_inicio: document.getElementById('fecha_inicio').value,
                fecha_fin: document.getElementById('fecha_fin').value
            };

            let url = '../../controlador/Administrador/garantias_controller.php?action=createGarantia';
            let method = 'POST';

            if (elementoEditando) {
                url = `../../controlador/Administrador/garantias_controller.php?action=updateGarantia&id=${idEditandoActual}`;
                method = 'PUT'; // Though the controller uses POST for update, but actually it's PUT in the code? Wait, the controller uses json_decode from input, so POST is fine.
                // Actually, the updateGarantia in controller uses json_decode(file_get_contents('php://input')), so it's POST.
            }

            try {
                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(garantiaData)
                });

                const result = await response.json();

                if (result.success) {
                    Swal.fire({
                        icon: 'success',
                        title: elementoEditando ? 'Garantía Actualizada' : 'Garantía Creada',
                        text: `La garantía ha sido ${elementoEditando ? 'actualizada' : 'creada'} exitosamente.`,
                        confirmButtonColor: '#1a1a1a'
                    });

                    loadGarantias();
                    closeModal('garantiaModal');
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: result.message || 'Ocurrió un error al guardar la garantía.',
                        confirmButtonColor: '#1a1a1a'
                    });
                }
            } catch (error) {
                console.error('Error guardando garantía:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de conexión',
                    text: 'No se pudo conectar con el servidor.',
                    confirmButtonColor: '#1a1a1a'
                });
            }
        }

        function validateGarantiaForm() {
            const servicio_completado = document.getElementById('servicio_completado');
            const tipo_garantia = document.getElementById('tipo_garantia');
            const tipo_garantia_personalizado = document.getElementById('tipo_garantia_personalizado');
            const fecha_inicio = document.getElementById('fecha_inicio');
            const periodo_garantia = document.getElementById('periodo_garantia');
            const fecha_fin = document.getElementById('fecha_fin');

            let isValid = true;

            // Limpiar errores anteriores
            document.querySelectorAll('#garantiaForm .form-control').forEach(input => {
                input.classList.remove('error');
            });
            document.querySelectorAll('#garantiaForm .error-message').forEach(error => {
                error.classList.remove('show');
            });

            // Validar servicio completado
            if (!servicio_completado.value) {
                servicio_completado.classList.add('error');
                servicio_completado.nextElementSibling.classList.add('show');
                servicio_completado.nextElementSibling.textContent = 'Debe seleccionar un servicio completado';
                isValid = false;
            }

            // Validar tipo de garantía
            if (!tipo_garantia.value) {
                tipo_garantia.classList.add('error');
                tipo_garantia.nextElementSibling.classList.add('show');
                tipo_garantia.nextElementSibling.textContent = 'El tipo de garantía es requerido';
                isValid = false;
            }

            // Validar tipo personalizado si está seleccionado
            if (tipo_garantia.value === 'Otros' && !tipo_garantia_personalizado.value.trim()) {
                tipo_garantia_personalizado.classList.add('error');
                tipo_garantia_personalizado.nextElementSibling.classList.add('show');
                tipo_garantia_personalizado.nextElementSibling.textContent = 'Debe especificar el tipo de garantía personalizado';
                isValid = false;
            }

            // Validar fecha de inicio
            if (!fecha_inicio.value) {
                fecha_inicio.classList.add('error');
                fecha_inicio.nextElementSibling.classList.add('show');
                fecha_inicio.nextElementSibling.textContent = 'La fecha de inicio es requerida';
                isValid = false;
            }

            // Validar período de garantía
            if (!periodo_garantia.value) {
                periodo_garantia.classList.add('error');
                periodo_garantia.nextElementSibling.classList.add('show');
                periodo_garantia.nextElementSibling.textContent = 'El período de garantía es requerido';
                isValid = false;
            }

            // Validar fecha de fin
            if (!fecha_fin.value) {
                fecha_fin.classList.add('error');
                fecha_fin.nextElementSibling.classList.add('show');
                fecha_fin.nextElementSibling.textContent = 'La fecha de vencimiento es requerida';
                isValid = false;
            }

            return isValid;
        }

        async function viewGarantia(id) {
            try {
                const response = await fetch(`../../controlador/Administrador/garantias_controller.php?action=getGarantia&id=${id}`);
                const data = await response.json();

                if (data.success) {
                    const garantia = data.garantia;
                    // Obtener información completa de la garantía con JOIN
                    const responseCompleta = await fetch('../../controlador/Administrador/garantias_controller.php?action=getGarantias');
                    const dataCompleta = await responseCompleta.json();

                    if (dataCompleta.success) {
                        const garantiaCompleta = dataCompleta.garantias.find(g => g.id_garantia == id);

                        if (garantiaCompleta) {
                            const nombreBicicleta = `${garantiaCompleta.marca_bicicleta || 'N/A'} ${garantiaCompleta.modelo_bicicleta || ''}`.trim();
                            const dueno = `${garantiaCompleta.nombres || ''} ${garantiaCompleta.apellidos || ''}`.trim();

                            // Crear modal personalizado
                            const modalHtml = `
                                <div class="garantia-detalles-modal">
                                    <div class="garantia-header">
                                        <div class="garantia-title">
                                            <h2><i class="fas fa-shield-alt"></i> Detalles de Garantía #${garantia.id_garantia}</h2>
                                            <span class="garantia-status status-${garantia.estado.toLowerCase()}">${garantia.estado}</span>
                                        </div>
                                    </div>

                                    <div class="garantia-content">
                                        <div class="info-section">
                                            <h3><i class="fas fa-info-circle"></i> Información de la Garantía</h3>
                                            <div class="info-grid">
                                                <div class="info-item">
                                                    <label>ID Garantía:</label>
                                                    <span>${garantia.id_garantia}</span>
                                                </div>
                                                <div class="info-item">
                                                    <label>Tipo de Garantía:</label>
                                                    <span>${garantia.tipo_garantia}</span>
                                                </div>
                                                <div class="info-item">
                                                    <label>Fecha de Inicio:</label>
                                                    <span>${new Date(garantia.fecha_inicio).toLocaleDateString('es-MX')}</span>
                                                </div>
                                                <div class="info-item">
                                                    <label>Fecha de Vencimiento:</label>
                                                    <span>${new Date(garantia.fecha_fin).toLocaleDateString('es-MX')}</span>
                                                </div>
                                                <div class="info-item">
                                                    <label>Creada el:</label>
                                                    <span>${new Date(garantia.creado_en).toLocaleDateString('es-MX')} ${new Date(garantia.creado_en).toLocaleTimeString('es-MX')}</span>
                                                </div>
                                                <div class="info-item">
                                                    <label>Actualizada el:</label>
                                                    <span>${new Date(garantia.actualizado_en).toLocaleDateString('es-MX')} ${new Date(garantia.actualizado_en).toLocaleTimeString('es-MX')}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="info-section">
                                            <h3><i class="fas fa-bicycle"></i> Información de la Bicicleta</h3>
                                            <div class="info-grid">
                                                <div class="info-item">
                                                    <label>Marca:</label>
                                                    <span>${garantiaCompleta.marca_bicicleta || 'N/A'}</span>
                                                </div>
                                                <div class="info-item">
                                                    <label>Modelo:</label>
                                                    <span>${garantiaCompleta.modelo_bicicleta || 'N/A'}</span>
                                                </div>
                                                <div class="info-item">
                                                    <label>Zona Afectada:</label>
                                                    <span>${garantiaCompleta.zona_afectada || 'N/A'}</span>
                                                </div>
                                                <div class="info-item">
                                                    <label>Tipo de Trabajo:</label>
                                                    <span>${garantiaCompleta.tipo_trabajo || 'N/A'}</span>
                                                </div>
                                                <div class="info-item">
                                                    <label>Tipo de Reparación:</label>
                                                    <span>${garantiaCompleta.tipo_reparacion || 'N/A'}</span>
                                                </div>
                                                <div class="info-item">
                                                    <label>Descripción Otros:</label>
                                                    <span>${garantiaCompleta.descripcion_otros || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="info-section">
                                            <h3><i class="fas fa-user"></i> Información del Dueño</h3>
                                            <div class="info-grid">
                                                <div class="info-item">
                                                    <label>Nombre Completo:</label>
                                                    <span>${dueno}</span>
                                                </div>
                                                <div class="info-item">
                                                    <label>Correo Electrónico:</label>
                                                    <span>${garantiaCompleta.correo_electronico || 'N/A'}</span>
                                                </div>
                                                <div class="info-item">
                                                    <label>ID Cotización:</label>
                                                    <span>${garantia.id_cotizacion}</span>
                                                </div>
                                                <div class="info-item">
                                                    <label>ID Usuario:</label>
                                                    <span>${garantia.id_usuario}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="info-section">
                                            <h3><i class="fas fa-file-alt"></i> Cobertura de la Garantía</h3>
                                            <div class="cobertura-content">
                                                ${garantia.cobertura ? garantia.cobertura.replace(/\n/g, '<br>') : '<em>Sin descripción específica</em>'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `;

                            // Crear y mostrar modal personalizado
                            const modal = document.createElement('div');
                            modal.className = 'custom-modal active';
                            modal.innerHTML = `
                                <div class="custom-modal-overlay" onclick="this.parentElement.remove()"></div>
                                <div class="custom-modal-content garantia-modal">
                                    <div class="custom-modal-header">
                                        <button class="custom-modal-close" onclick="this.closest('.custom-modal').remove()">&times;</button>
                                    </div>
                                    <div class="custom-modal-body">
                                        ${modalHtml}
                                    </div>
                                </div>
                            `;

                            document.body.appendChild(modal);
                        }
                    }
                }
            } catch (error) {
                console.error('Error obteniendo detalles de garantía:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudieron cargar los detalles de la garantía.',
                    confirmButtonColor: '#1a1a1a'
                });
            }
        }

        async function editGarantia(id) {
            try {
                const response = await fetch(`../../controlador/Administrador/garantias_controller.php?action=getGarantia&id=${id}`);
                const data = await response.json();

                if (data.success) {
                    const garantia = data.garantia;
                    elementoEditando = garantia;
                    idEditandoActual = id;

                    document.getElementById('garantiaModalTitle').textContent = 'Editar Garantía';
                    document.getElementById('garantiaSaveBtn').textContent = 'Actualizar Garantía';

                    // Llenar formulario
                    await loadServiciosCompletados();
                    document.getElementById('servicio_completado').value = garantia.id_cotizacion;

                    // Determinar tipo de garantía
                    let tipoGarantia = garantia.tipo_garantia;
                    if (['Básica', 'Estándar', 'Premium Carbon', 'Extendida'].includes(tipoGarantia)) {
                        document.getElementById('tipo_garantia').value = tipoGarantia;
                        document.getElementById('tipo_garantia_personalizado').value = '';
                    } else {
                        document.getElementById('tipo_garantia').value = 'Otros';
                        document.getElementById('tipo_garantia_personalizado').value = tipoGarantia;
                    }
                    toggleTipoGarantiaPersonalizado();

                    document.getElementById('fecha_inicio').value = garantia.fecha_inicio;
                    // Calcular período basado en fechas
                    const fechaInicio = new Date(garantia.fecha_inicio);
                    const fechaFin = new Date(garantia.fecha_fin);
                    const diffTime = Math.abs(fechaFin - fechaInicio);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    let periodo = '';
                    if (diffDays <= 35) { // Aproximadamente 1 mes
                        periodo = '1';
                    } else if (diffDays <= 100) { // Aproximadamente 3 meses
                        periodo = '3';
                    } else if (diffDays <= 400) { // Aproximadamente 1 año
                        periodo = '12';
                    } else {
                        periodo = '12'; // Default to 1 year
                    }
                    document.getElementById('periodo_garantia').value = periodo;
                    document.getElementById('fecha_fin').value = garantia.fecha_fin;
                    document.getElementById('cobertura').value = garantia.cobertura || '';

                    openModal('garantiaModal');
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se pudo cargar la garantía.',
                        confirmButtonColor: '#1a1a1a'
                    });
                }
            } catch (error) {
                console.error('Error cargando garantía para editar:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de conexión',
                    text: 'No se pudo conectar con el servidor.',
                    confirmButtonColor: '#1a1a1a'
                });
            }
        }

        async function deleteGarantia(id) {
            const result = await Swal.fire({
                title: '¿Está seguro?',
                text: '¿Desea eliminar esta garantía?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc3545',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                try {
                    const response = await fetch(`../../controlador/Administrador/garantias_controller.php?action=deleteGarantia&id=${id}`);

                    const res = await response.json();

                    if (res.success) {
                        await Swal.fire({
                            icon: 'success',
                            title: 'Eliminada',
                            text: 'La garantía ha sido eliminada exitosamente.',
                            confirmButtonColor: '#1a1a1a',
                            timer: 2000,
                            showConfirmButton: false
                        });
                        loadGarantias();
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: res.message || 'Ocurrió un error al eliminar la garantía.',
                            confirmButtonColor: '#1a1a1a'
                        });
                    }
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de conexión',
                        text: 'No se pudo conectar con el servidor.',
                        confirmButtonColor: '#1a1a1a'
                    });
                }
            }
        }

        // Funciones de productos
        function openProductoModal() {
            document.getElementById('productoModalTitle').textContent = 'Nuevo Producto';
            document.getElementById('productoSaveBtn').textContent = 'Guardar Producto';
            loadProveedoresForSelect();
            openModal('productoModal');
        }

        async function loadProveedoresForSelect() {
            try {
                const response = await fetch('../../controlador/Administrador/compras_proveedores_controller.php?action=getProveedoresForSelect');
                const proveedores = await response.json();

                const select = document.getElementById('proveedor_id');
                select.innerHTML = '<option value="">Seleccionar proveedor</option>';

                proveedores.forEach(proveedor => {
                    const option = document.createElement('option');
                    option.value = proveedor.id_proveedor;
                    option.textContent = proveedor.nombre_proveedor;
                    select.appendChild(option);
                });
            } catch (error) {
            }
        }

        async function editProducto(id) {
            try {
                const response = await fetch(`../../controlador/Administrador/compras_proveedores_controller.php?action=getCompraProveedor&id=${id}`);
                const producto = await response.json();

                if (!producto) return;

                elementoEditando = producto;
                idEditandoActual = id;

                document.getElementById('productoModalTitle').textContent = 'Editar Producto';
                document.getElementById('productoSaveBtn').textContent = 'Actualizar Producto';

                // Llenar formulario
                await loadProveedoresForSelect();
                document.getElementById('proveedor_id').value = producto.proveedor_id;
                document.getElementById('nombre_producto').value = producto.nombre_producto;
                document.getElementById('descripcion').value = producto.descripcion || '';
                document.getElementById('cantidad').value = producto.cantidad || 1;
                document.getElementById('precio_unitario').value = producto.precio_unitario || '';
                document.getElementById('fecha_adquirido').value = producto.fecha_adquirido;
                document.getElementById('numero_factura').value = producto.numero_factura || '';
                document.getElementById('notas').value = producto.notas || '';

                openModal('productoModal');
            } catch (error) {
            }
        }

        async function saveProducto() {
            if (!validateProductoForm()) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error de Validación',
                    text: 'Por favor, complete todos los campos requeridos correctamente.',
                    confirmButtonColor: '#1a1a1a'
                });
                return;
            }

            const productoData = {
                proveedor_id: document.getElementById('proveedor_id').value,
                nombre_producto: document.getElementById('nombre_producto').value,
                descripcion: document.getElementById('descripcion').value,
                cantidad: parseInt(document.getElementById('cantidad').value) || 1,
                precio_unitario: parseFloat(document.getElementById('precio_unitario').value) || 0,
                fecha_adquirido: document.getElementById('fecha_adquirido').value,
                numero_factura: document.getElementById('numero_factura').value,
                notas: document.getElementById('notas').value
            };

            let url = '../../controlador/Administrador/compras_proveedores_controller.php?action=createCompraProveedor';
            let method = 'POST';

            if (elementoEditando) {
                url = `../../controlador/Administrador/compras_proveedores_controller.php?action=updateCompraProveedor&id=${idEditandoActual}`;
            }

            try {
                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(productoData)
                });

                const result = await response.json();

                if (result.success) {
                    Swal.fire({
                        icon: 'success',
                        title: `Producto ${elementoEditando ? 'Actualizado' : 'Creado'}`,
                        text: `El producto ha sido ${elementoEditando ? 'actualizado' : 'creado'} exitosamente.`,
                        confirmButtonColor: '#1a1a1a'
                    });

                    loadProductos();
                    closeModal('productoModal');
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: result.error || 'Ocurrió un error al guardar el producto.',
                        confirmButtonColor: '#1a1a1a'
                    });
                }
            } catch (error) {
            }
        }

        function validateProductoForm() {
            const proveedor_id = document.getElementById('proveedor_id');
            const nombre_producto = document.getElementById('nombre_producto');
            const descripcion = document.getElementById('descripcion');
            const cantidad = document.getElementById('cantidad');
            const precio_unitario = document.getElementById('precio_unitario');
            const fecha_adquirido = document.getElementById('fecha_adquirido');
            const numero_factura = document.getElementById('numero_factura');
            const notas = document.getElementById('notas');

            let isValid = true;

            // Limpiar errores anteriores
            document.querySelectorAll('#productoForm .form-control').forEach(input => {
                input.classList.remove('error');
            });
            document.querySelectorAll('#productoForm .error-message').forEach(error => {
                error.classList.remove('show');
            });

            // Validar proveedor
            if (!proveedor_id.value) {
                proveedor_id.classList.add('error');
                proveedor_id.nextElementSibling.classList.add('show');
                proveedor_id.nextElementSibling.textContent = 'El proveedor es requerido';
                isValid = false;
            }

            // Validar nombre del producto
            if (!nombre_producto.value.trim()) {
                nombre_producto.classList.add('error');
                nombre_producto.nextElementSibling.classList.add('show');
                nombre_producto.nextElementSibling.textContent = 'El nombre del producto es requerido';
                isValid = false;
            }

            // Validar descripción (opcional)
            // No se requiere validación para este campo

            // Validar cantidad
            if (!cantidad.value || cantidad.value < 1) {
                cantidad.classList.add('error');
                cantidad.nextElementSibling.classList.add('show');
                cantidad.nextElementSibling.textContent = 'La cantidad debe ser mayor a 0';
                isValid = false;
            }

            // Validar precio unitario (opcional, pero si se ingresa debe ser válido)
            if (precio_unitario.value && parseFloat(precio_unitario.value) < 0) {
                precio_unitario.classList.add('error');
                precio_unitario.nextElementSibling.classList.add('show');
                precio_unitario.nextElementSibling.textContent = 'El precio no puede ser negativo';
                isValid = false;
            }

            // Validar fecha
            if (!fecha_adquirido.value) {
                fecha_adquirido.classList.add('error');
                fecha_adquirido.nextElementSibling.classList.add('show');
                fecha_adquirido.nextElementSibling.textContent = 'La fecha de adquisición es requerida';
                isValid = false;
            }

            // Validar número de factura (opcional)
            // No se requiere validación para este campo

            // Validar notas (opcional)
            // No se requiere validación para este campo

            return isValid;
        }

        async function viewProducto(id) {
            try {
                const response = await fetch(`../../controlador/Administrador/compras_proveedores_controller.php?action=getCompraProveedor&id=${id}`);
                const producto = await response.json();

                if (!producto) return;

                const precioUnitario = producto.precio_unitario ? parseFloat(producto.precio_unitario) : 0;
                const cantidad = producto.cantidad || 1;
                const total = precioUnitario * cantidad;

                Swal.fire({
                    title: 'Detalles del Producto',
                    html: `
                        <div style="text-align: left; max-height: 400px; overflow-y: auto;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                                <div style="background: #f0f8ff; padding: 12px; border-radius: 8px; border-left: 4px solid #1a1a1a;">
                                    <h4 style="margin: 0 0 10px 0; color: #1a1a1a; font-size: 14px;">Información del Producto</h4>
                                    <p style="margin: 5px 0; font-size: 13px;"><strong>Nombre:</strong> ${producto.nombre_producto}</p>
                                    <p style="margin: 5px 0; font-size: 13px;"><strong>Descripción:</strong> ${producto.descripcion || 'N/A'}</p>
                                    <p style="margin: 5px 0; font-size: 13px;"><strong>Proveedor:</strong> ${producto.nombre_proveedor || 'N/A'}</p>
                                    <p style="margin: 5px 0; font-size: 13px;"><strong>Cantidad:</strong> ${producto.cantidad || 1}</p>
                                </div>
                                <div style="background: #fff0f5; padding: 12px; border-radius: 8px; border-left: 4px solid #dc3545;">
                                    <h4 style="margin: 0 0 10px 0; color: #dc3545; font-size: 14px;">Información Financiera</h4>
                                    <p style="margin: 5px 0; font-size: 13px;"><strong>Precio Unitario:</strong> $${precioUnitario.toFixed(2)}</p>
                                    <p style="margin: 5px 0; font-size: 13px;"><strong>Total:</strong> $${total.toFixed(2)}</p>
                                    <p style="margin: 5px 0; font-size: 13px;"><strong>Factura:</strong> ${producto.numero_factura || 'N/A'}</p>
                                    <p style="margin: 5px 0; font-size: 13px;"><strong>Fecha Adquirido:</strong> ${new Date(producto.fecha_adquirido).toLocaleDateString('es-MX')}</p>
                                </div>
                            </div>
                            <div style="background: #f5f5f5; padding: 12px; border-radius: 8px; border-left: 4px solid #17a2b8; margin-top: 15px;">
                                <h4 style="margin: 0 0 10px 0; color: #17a2b8; font-size: 14px;">Información Adicional</h4>
                                <p style="margin: 5px 0; font-size: 13px;"><strong>Notas:</strong> ${producto.notas || 'Sin notas adicionales'}</p>
                                <p style="margin: 5px 0; font-size: 13px;"><strong>Creado:</strong> ${new Date(producto.creado_en).toLocaleDateString('es-MX')}</p>
                            </div>
                        </div>
                    `,
                    confirmButtonColor: '#1a1a1a',
                    confirmButtonText: 'Cerrar',
                    width: '700px'
                });
            } catch (error) {
            }
        }

        async function deleteProducto(id) {
            // Convertir id a número para comparación correcta
            const idNum = parseInt(id);

            const producto = arregloProductos.find(p => parseInt(p.id_compra) === idNum);

            if (!producto) {
                // Recargar productos si no se encuentra
                await loadProductos();
                const productoReloaded = arregloProductos.find(p => parseInt(p.id_compra) === idNum);

                if (!productoReloaded) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Producto no encontrado. Intente recargar la página.',
                        confirmButtonColor: '#1a1a1a'
                    });
                    return;
                }
                // Usar el producto recargado
                Object.assign(producto, productoReloaded);
            }

            const result = await Swal.fire({
                title: '¿Está seguro?',
                text: `¿Desea eliminar el producto "${producto.nombre_producto}"?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc3545',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                try {
                    const response = await fetch(`../../controlador/Administrador/compras_proveedores_controller.php?action=deleteCompraProveedor&id=${id}`);

                    const res = await response.json();

                    if (res.success) {
                        await Swal.fire({
                            icon: 'success',
                            title: 'Eliminado',
                            text: 'El producto ha sido eliminado exitosamente.',
                            confirmButtonColor: '#1a1a1a',
                            timer: 2000,
                            showConfirmButton: false
                        });
                        loadProductos();
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: res.error || 'Ocurrió un error al eliminar el producto.',
                            confirmButtonColor: '#1a1a1a'
                        });
                    }
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de conexión',
                        text: 'No se pudo conectar con el servidor.',
                        confirmButtonColor: '#1a1a1a'
                    });
                }
            }
        }

        function actualizarTablas() {
            // Mostrar indicador de carga
            const btnActualizar = document.querySelector('button[onclick="actualizarTablas()"]');
            const originalText = btnActualizar.innerHTML;
            btnActualizar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Actualizando...';
            btnActualizar.disabled = true;

            // Actualizar datos según la sección actual
            if (seccionActual === 'proveedores') {
                loadProveedores();
            } else if (seccionActual === 'productos') {
                loadProductos();
            } else if (seccionActual === 'clientes') {
                // Si hay función para cargar clientes, llamarla aquí
                if (typeof loadClientes === 'function') {
                    loadClientes();
                }
            } else if (seccionActual === 'garantias') {
                // Si hay función para cargar garantías, llamarla aquí
                if (typeof loadGarantias === 'function') {
                    loadGarantias();
                }
            }

            // Restaurar botón después de un breve delay
            setTimeout(() => {
                btnActualizar.innerHTML = originalText;
                btnActualizar.disabled = false;

                // Mostrar mensaje de éxito
                Swal.fire({
                    icon: 'success',
                    title: 'Tablas Actualizadas',
                    text: 'Los datos han sido actualizados correctamente.',
                    timer: 1500,
                    showConfirmButton: false,
                    confirmButtonColor: '#1a1a1a'
                });
            }, 1000);
        }

        // Funciones de proveedores
        function openProveedorModal() {
            document.getElementById('proveedorModalTitle').textContent = 'Nuevo Proveedor';
            document.getElementById('proveedorSaveBtn').textContent = 'Guardar Proveedor';
            openModal('proveedorModal');
        }

        function filtrarProveedores() {
            const filtro = document.getElementById('buscadorProveedores').value.toLowerCase();
            const filas = document.querySelectorAll('#proveedoresTableBody tr');

            filas.forEach(fila => {
                const textoFila = fila.textContent.toLowerCase();
                if (textoFila.includes(filtro)) {
                    fila.style.display = '';
                } else {
                    fila.style.display = 'none';
                }
            });
        }

        function filtrarProductos() {
            const filtro = document.getElementById('buscadorProductos').value.toLowerCase();
            const filas = document.querySelectorAll('#productosTableBody tr');

            filas.forEach(fila => {
                const textoFila = fila.textContent.toLowerCase();
                if (textoFila.includes(filtro)) {
                    fila.style.display = '';
                } else {
                    fila.style.display = 'none';
                }
            });
        }

        async function editProveedor(id) {
            try {
                const response = await fetch(`../../controlador/Administrador/proveedores_controller.php?action=getProveedor&id=${id}`);
                const proveedor = await response.json();
                
                if (!proveedor) return;
                
                elementoEditando = proveedor;
                idEditandoActual = id;
                
                document.getElementById('proveedorModalTitle').textContent = 'Editar Proveedor';
                document.getElementById('proveedorSaveBtn').textContent = 'Actualizar Proveedor';
                
                // Llenar formulario
                const nombreProveedor = document.getElementById('nombre_proveedor');
                const contactoProveedor = document.getElementById('contacto_proveedor');
                const telefonoProveedor = document.getElementById('telefono_proveedor');
                const correoProveedor = document.getElementById('correo_proveedor');
                const direccionProveedor = document.getElementById('direccion_proveedor');

                if (nombreProveedor) nombreProveedor.value = proveedor.nombre_proveedor;
                if (contactoProveedor) contactoProveedor.value = proveedor.contacto || '';
                if (telefonoProveedor) telefonoProveedor.value = proveedor.telefono || '';
                if (correoProveedor) correoProveedor.value = proveedor.correo || '';
                if (direccionProveedor) direccionProveedor.value = proveedor.direccion || '';
                
                openModal('proveedorModal');
            } catch (error) {
            }
        }

        async function saveProveedor() {
            if (!validateProveedorForm()) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error de Validación',
                    text: 'Por favor, complete todos los campos requeridos correctamente.',
                    confirmButtonColor: '#1a1a1a'
                });
                return;
            }
            
            const nombreProveedor = document.getElementById('nombre_proveedor');
            const contactoProveedor = document.getElementById('contacto_proveedor');
            const telefonoProveedor = document.getElementById('telefono_proveedor');
            const correoProveedor = document.getElementById('correo_proveedor');
            const direccionProveedor = document.getElementById('direccion_proveedor');

            if (!nombreProveedor || !contactoProveedor || !telefonoProveedor || !correoProveedor || !direccionProveedor) {
                return;
            }

            const proveedorData = {
                nombre_proveedor: nombreProveedor.value,
                contacto: contactoProveedor.value,
                telefono: telefonoProveedor.value,
                correo: correoProveedor.value,
                direccion: direccionProveedor.value
            };
            
            let url = '../../controlador/Administrador/proveedores_controller.php?action=createProveedor';
            let method = 'POST';
            
            if (elementoEditando) {
                url = `../../controlador/Administrador/proveedores_controller.php?action=updateProveedor&id=${idEditandoActual}`;
            }

            try {
                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(proveedorData)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    Swal.fire({
                        icon: 'success',
                        title: `Proveedor ${elementoEditando ? 'Actualizado' : 'Creado'}`,
                        text: `El proveedor ha sido ${elementoEditando ? 'actualizado' : 'creado'} exitosamente.`,
                        confirmButtonColor: '#1a1a1a'
                    });
                    
                    loadProveedores();
                    closeModal('proveedorModal');
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: result.error || 'Ocurrió un error al guardar el proveedor.',
                        confirmButtonColor: '#1a1a1a'
                    });
                }
            } catch (error) {
            }
        }

        function validateProveedorForm() {
            const nombre_proveedor = document.getElementById('nombre_proveedor');
            const contacto_proveedor = document.getElementById('contacto_proveedor');
            const telefono_proveedor = document.getElementById('telefono_proveedor');
            const correo_proveedor = document.getElementById('correo_proveedor');
            const direccion_proveedor = document.getElementById('direccion_proveedor');

            let isValid = true;

            // Limpiar errores anteriores
            document.querySelectorAll('#proveedorForm .form-control').forEach(input => {
                input.classList.remove('error');
            });
            document.querySelectorAll('#proveedorForm .error-message').forEach(error => {
                error.classList.remove('show');
            });

            // Validar nombre
            if (!nombre_proveedor.value.trim()) {
                nombre_proveedor.classList.add('error');
                nombre_proveedor.nextElementSibling.classList.add('show');
                nombre_proveedor.nextElementSibling.textContent = 'El nombre del proveedor es requerido';
                isValid = false;
            }

            // Validar contacto
            if (!contacto_proveedor.value.trim()) {
                contacto_proveedor.classList.add('error');
                contacto_proveedor.nextElementSibling.classList.add('show');
                contacto_proveedor.nextElementSibling.textContent = 'El contacto es requerido';
                isValid = false;
            }

            // Validar teléfono
            if (!telefono_proveedor.value.trim()) {
                telefono_proveedor.classList.add('error');
                telefono_proveedor.nextElementSibling.classList.add('show');
                telefono_proveedor.nextElementSibling.textContent = 'El teléfono es requerido';
                isValid = false;
            }

            // Validar correo
            if (!correo_proveedor.value.trim()) {
                correo_proveedor.classList.add('error');
                correo_proveedor.nextElementSibling.classList.add('show');
                correo_proveedor.nextElementSibling.textContent = 'El correo es requerido';
                isValid = false;
            } else if (!/\S+@\S+\.\S+/.test(correo_proveedor.value)) {
                correo_proveedor.classList.add('error');
                correo_proveedor.nextElementSibling.classList.add('show');
                correo_proveedor.nextElementSibling.textContent = 'El correo no es válido';
                isValid = false;
            }

            // Validar dirección
            if (!direccion_proveedor.value.trim()) {
                direccion_proveedor.classList.add('error');
                direccion_proveedor.nextElementSibling.classList.add('show');
                direccion_proveedor.nextElementSibling.textContent = 'La dirección es requerida';
                isValid = false;
            }

            return isValid;
        }

        async function viewProveedor(id) {
            try {
                const response = await fetch(`../../controlador/Administrador/proveedores_controller.php?action=getProveedor&id=${id}`);
                const proveedor = await response.json();

                if (!proveedor) return;

                // Obtener productos del proveedor
                let productosHtml = '<p><strong>Productos Comprados:</strong></p>';
                if (proveedor.productos_comprados && proveedor.productos_comprados !== 'N/A') {
                    const productos = proveedor.productos_comprados.split(', ');
                    productosHtml += '<div style="background: #f8f9fa; padding: 10px; border-radius: 5px; margin: 10px 0;">';
                    productosHtml += '<ul style="margin: 0; padding-left: 20px;">';
                    productos.forEach(producto => {
                        productosHtml += `<li style="margin: 5px 0; color: #333;">${producto}</li>`;
                    });
                    productosHtml += '</ul></div>';
                } else {
                    productosHtml += '<div style="background: #f8f9fa; padding: 10px; border-radius: 5px; margin: 10px 0; color: #666;">No hay productos registrados</div>';
                }

                Swal.fire({
                    title: 'Detalles del Proveedor',
                    html: `
                        <div style="text-align: left; max-height: 400px; overflow-y: auto;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                                <div style="background: #f0f8ff; padding: 12px; border-radius: 8px; border-left: 4px solid #1a1a1a;">
                                    <h4 style="margin: 0 0 10px 0; color: #1a1a1a; font-size: 14px;">Información General</h4>
                                    <p style="margin: 5px 0; font-size: 13px;"><strong>Nombre:</strong> ${proveedor.nombre_proveedor}</p>
                                    <p style="margin: 5px 0; font-size: 13px;"><strong>Contacto:</strong> ${proveedor.contacto || 'N/A'}</p>
                                    <p style="margin: 5px 0; font-size: 13px;"><strong>Cantidad Total:</strong> ${proveedor.cantidad || 1}</p>
                                    <p style="margin: 5px 0; font-size: 13px;"><strong>Creado:</strong> ${new Date(proveedor.creado_en).toLocaleDateString('es-MX')}</p>
                                </div>
                                <div style="background: #fff0f5; padding: 12px; border-radius: 8px; border-left: 4px solid #dc3545;">
                                    <h4 style="margin: 0 0 10px 0; color: #dc3545; font-size: 14px;">Información de Contacto</h4>
                                    <p style="margin: 5px 0; font-size: 13px;"><strong>Teléfono:</strong> ${proveedor.telefono || 'N/A'}</p>
                                    <p style="margin: 5px 0; font-size: 13px;"><strong>Correo:</strong> ${proveedor.correo || 'N/A'}</p>
                                    <p style="margin: 5px 0; font-size: 13px;"><strong>Dirección:</strong> ${proveedor.direccion || 'N/A'}</p>
                                </div>
                            </div>
                            ${productosHtml}
                            <div style="background: #f5f5f5; padding: 12px; border-radius: 8px; border-left: 4px solid #17a2b8; margin-top: 15px;">
                                <h4 style="margin: 0 0 10px 0; color: #17a2b8; font-size: 14px;">Notas Adicionales</h4>
                                <p style="margin: 0; font-size: 13px; color: #333;">${proveedor.notas_proveedor || 'Sin notas adicionales'}</p>
                            </div>
                        </div>
                    `,
                    confirmButtonColor: '#1a1a1a',
                    confirmButtonText: 'Cerrar',
                    width: '700px'
                });
            } catch (error) {
            }
        }

        async function deleteProveedor(id) {

            // Convertir id a número para comparación correcta
            const idNum = parseInt(id);

            const proveedor = arregloProveedores.find(p => parseInt(p.id_proveedor) === idNum);

            if (!proveedor) {
                // Recargar proveedores si no se encuentra
                await loadProveedores();
                const proveedorReloaded = arregloProveedores.find(p => parseInt(p.id_proveedor) === idNum);

                if (!proveedorReloaded) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Proveedor no encontrado. Intente recargar la página.',
                        confirmButtonColor: '#1a1a1a'
                    });
                    return;
                }
                // Usar el proveedor recargado
                Object.assign(proveedor, proveedorReloaded);
            }

            const result = await Swal.fire({
                title: '¿Está seguro?',
                text: `¿Desea eliminar al proveedor "${proveedor.nombre_proveedor}"?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc3545',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                try {
                    const response = await fetch(`../../controlador/Administrador/proveedores_controller.php?action=deleteProveedor&id=${id}`);

                    const res = await response.json();

                    if (res.success) {
                        await Swal.fire({
                            icon: 'success',
                            title: 'Eliminado',
                            text: 'El proveedor ha sido eliminado exitosamente.',
                            confirmButtonColor: '#1a1a1a',
                            timer: 2000,
                            showConfirmButton: false
                        });
                        loadProveedores();
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: res.error || 'Ocurrió un error al eliminar el proveedor.',
                            confirmButtonColor: '#1a1a1a'
                        });
                    }
                } catch (error) {
                    console.error('Error deleting proveedor:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de conexión',
                        text: 'No se pudo conectar con el servidor.',
                        confirmButtonColor: '#1a1a1a'
                    });
                }
            } else {
            }
        }

        // Funciones de exportación
        function exportToPDF(type) {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            let data = [];
            let filename = '';

            if (type === 'garantias') {
                data = arregloGarantias.map(garantia => ({
                    'ID': garantia.id_garantia,
                    'Bicicleta': `${garantia.marca_bicicleta || 'N/A'} ${garantia.modelo_bicicleta || ''}`.trim(),
                    'Dueño': `${garantia.nombres || ''} ${garantia.apellidos || ''}`.trim(),
                    'Tipo': garantia.tipo_garantia,
                    'Cobertura': garantia.cobertura || 'Sin descripción',
                    'Fecha Inicio': new Date(garantia.fecha_inicio).toLocaleDateString('es-MX'),
                    'Fecha Vencimiento': new Date(garantia.fecha_fin).toLocaleDateString('es-MX'),
                    'Estado': garantia.estado,
                    'Zona Afectada': garantia.zona_afectada || 'N/A',
                    'Tipo Trabajo': garantia.tipo_trabajo || 'N/A',
                    'Tipo Reparación': garantia.tipo_reparacion || 'N/A'
                }));
                filename = 'garantias';

                // Configurar página
                doc.setProperties({
                    title: 'Reporte de Garantías - TotalCarbon',
                    subject: 'Lista completa de garantías activas',
                    author: 'TotalCarbon',
                    keywords: 'garantías, reparaciones, bicicletas',
                    creator: 'Sistema TotalCarbon'
                });

                // Agregar logo/encabezado profesional
                doc.setFontSize(24);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(26, 26, 26);
                doc.text('TOTALCARBON', 14, 25);

                doc.setFontSize(14);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(100, 100, 100);
                doc.text('Especialistas en Fibra de Carbono', 14, 35);

                // Información del reporte
                doc.setFontSize(16);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(26, 26, 26);
                doc.text('REPORTE DE GARANTÍAS', 14, 50);

                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(100, 100, 100);
                doc.text(`Generado el: ${new Date().toLocaleDateString('es-MX')} ${new Date().toLocaleTimeString('es-MX')}`, 14, 60);
                doc.text(`Total de garantías: ${arregloGarantias.length}`, 14, 68);

                // Estadísticas
                const activas = arregloGarantias.filter(g => g.estado === 'Activa').length;
                const vencidas = arregloGarantias.filter(g => g.estado === 'Vencida').length;
                const canceladas = arregloGarantias.filter(g => g.estado === 'Cancelada').length;

                doc.text(`Garantías Activas: ${activas}`, 14, 76);
                doc.text(`Garantías Vencidas: ${vencidas}`, 80, 76);
                doc.text(`Garantías Canceladas: ${canceladas}`, 140, 76);

                // Línea separadora
                doc.setDrawColor(26, 26, 26);
                doc.setLineWidth(0.5);
                doc.line(14, 85, 196, 85);

                // Tabla principal con mejor formato
                const tableData = arregloGarantias.map(garantia => ({
                    'ID': garantia.id_garantia,
                    'Bicicleta': `${garantia.marca_bicicleta || 'N/A'} ${garantia.modelo_bicicleta || ''}`.trim(),
                    'Dueño': `${garantia.nombres || ''} ${garantia.apellidos || ''}`.trim(),
                    'Tipo': garantia.tipo_garantia,
                    'Inicio': new Date(garantia.fecha_inicio).toLocaleDateString('es-MX'),
                    'Vencimiento': new Date(garantia.fecha_fin).toLocaleDateString('es-MX'),
                    'Estado': garantia.estado,
                    'Zona': garantia.zona_afectada || 'N/A',
                    'Trabajo': garantia.tipo_trabajo || 'N/A'
                }));

                doc.autoTable({
                    head: [Object.keys(tableData[0])],
                    body: tableData.map(Object.values),
                    startY: 95,
                    styles: {
                        fontSize: 7,
                        cellPadding: 2,
                        overflow: 'linebreak',
                        cellWidth: 'wrap'
                    },
                    headStyles: {
                        fillColor: [26, 26, 26],
                        textColor: 255,
                        fontStyle: 'bold',
                        fontSize: 8,
                        halign: 'center'
                    },
                    alternateRowStyles: {
                        fillColor: [248, 249, 250],
                    },
                    columnStyles: {
                        0: { cellWidth: 15 }, // ID
                        1: { cellWidth: 25 }, // Bicicleta
                        2: { cellWidth: 30 }, // Dueño
                        3: { cellWidth: 20 }, // Tipo
                        4: { cellWidth: 20 }, // Inicio
                        5: { cellWidth: 20 }, // Vencimiento
                        6: { cellWidth: 15 }, // Estado
                        7: { cellWidth: 25 }, // Zona
                        8: { cellWidth: 25 }  // Trabajo
                    },
                    margin: { top: 95, left: 14, right: 14 },
                    didDrawPage: function(data) {
                        // Pie de página
                        const pageCount = doc.internal.getNumberOfPages();
                        doc.setFontSize(8);
                        doc.setTextColor(150, 150, 150);
                        doc.text('Página ' + doc.internal.getCurrentPageInfo().pageNumber + ' de ' + pageCount, 14, doc.internal.pageSize.height - 10);
                        doc.text('TotalCarbon - Especialistas en Fibra de Carbono', doc.internal.pageSize.width - 100, doc.internal.pageSize.height - 10);
                    }
                });

                // Agregar sección de cobertura detallada si hay espacio
                const finalY = doc.lastAutoTable.finalY;
                if (finalY < doc.internal.pageSize.height - 60) {
                    doc.setFontSize(12);
                    doc.setFont('helvetica', 'bold');
                    doc.setTextColor(26, 26, 26);
                    doc.text('DETALLE DE COBERTURAS', 14, finalY + 15);

                    arregloGarantias.forEach((garantia, index) => {
                        if (garantia.cobertura && garantia.cobertura.trim()) {
                            const yPos = finalY + 25 + (index * 8);
                            if (yPos > doc.internal.pageSize.height - 20) return;

                            doc.setFontSize(8);
                            doc.setFont('helvetica', 'normal');
                            doc.setTextColor(50, 50, 50);
                            doc.text(`ID ${garantia.id_garantia}: ${garantia.cobertura.substring(0, 80)}${garantia.cobertura.length > 80 ? '...' : ''}`, 14, yPos);
                        }
                    });
                }
            } else if (type === 'proveedores') {
                data = arregloProveedores.map(proveedor => ({
                    'Proveedor': proveedor.nombre_proveedor,
                    'Contacto': proveedor.contacto || 'N/A',
                    'Teléfono': proveedor.telefono || 'N/A',
                    'Correo': proveedor.correo || 'N/A',
                    'Dirección': proveedor.direccion || 'N/A',
                    'Productos Comprados': proveedor.productos_comprados || 'N/A',
                    'Notas': proveedor.notas_proveedor || 'N/A',
                    'Cantidad': proveedor.cantidad || 1
                }));
                filename = 'proveedores';

                // Agregar título al PDF
                doc.setFontSize(18);
                doc.text('Lista de Proveedores - TotalCarbon', 14, 20);
                doc.setFontSize(12);
                doc.text(`Generado el: ${new Date().toLocaleDateString('es-MX')} ${new Date().toLocaleTimeString('es-MX')}`, 14, 30);

                doc.autoTable({
                    head: [Object.keys(data[0])],
                    body: data.map(Object.values),
                    startY: 40,
                });
            } else if (type === 'productos') {
                data = arregloProductos.map(producto => ({
                    'Producto': producto.nombre_producto,
                    'Descripción': producto.descripcion || 'N/A',
                    'Proveedor': producto.nombre_proveedor || 'N/A',
                    'Cantidad': producto.cantidad || 1,
                    'Precio Unitario': producto.precio_unitario ? `$${parseFloat(producto.precio_unitario).toFixed(2)}` : '$0.00',
                    'Total': producto.total ? `$${parseFloat(producto.total).toFixed(2)}` : '$0.00',
                    'Fecha Adquirido': new Date(producto.fecha_adquirido).toLocaleDateString('es-MX'),
                    'Factura': producto.numero_factura || 'N/A'
                }));
                filename = 'productos';

                // Agregar título al PDF
                doc.setFontSize(18);
                doc.text('Lista de Productos/Piezas - TotalCarbon', 14, 20);
                doc.setFontSize(12);
                doc.text(`Generado el: ${new Date().toLocaleDateString('es-MX')} ${new Date().toLocaleTimeString('es-MX')}`, 14, 30);

                doc.autoTable({
                    head: [Object.keys(data[0])],
                    body: data.map(Object.values),
                    startY: 40,
                });
            }

            doc.save(`${filename}.pdf`);
            
            Swal.fire({
                icon: 'success',
                title: 'Exportación Exitosa',
                text: `El archivo ${filename}.pdf ha sido descargado exitosamente.`,
                confirmButtonColor: '#1a1a1a'
            });
        }

        function exportToExcel(type) {
            let data = [];
            let filename = '';

            if (type === 'garantias') {
                // Crear workbook profesional con múltiples hojas
                const wb = XLSX.utils.book_new();

                // Estadísticas
                const activas = arregloGarantias.filter(g => g.estado === 'Activa').length;
                const vencidas = arregloGarantias.filter(g => g.estado === 'Vencida').length;
                const canceladas = arregloGarantias.filter(g => g.estado === 'Cancelada').length;
                const reclamadas = arregloGarantias.filter(g => g.estado === 'Reclamada').length;

                // Hoja principal de garantías
                const tituloData = [
                    { 'A': 'TOTALCARBON - ESPECIALISTAS EN FIBRA DE CARBONO', 'B': '', 'C': '', 'D': '', 'E': '', 'F': '', 'G': '', 'H': '', 'I': '', 'J': '', 'K': '', 'L': '', 'M': '', 'N': '' },
                    { 'A': '', 'B': '', 'C': '', 'D': '', 'E': '', 'F': '', 'G': '', 'H': '', 'I': '', 'J': '', 'K': '', 'L': '', 'M': '', 'N': '' },
                    { 'A': 'REPORTE DETALLADO DE GARANTÍAS', 'B': '', 'C': '', 'D': '', 'E': '', 'F': '', 'G': '', 'H': '', 'I': '', 'J': '', 'K': '', 'L': '', 'M': '', 'N': '' },
                    { 'A': `Generado el: ${new Date().toLocaleDateString('es-MX')} ${new Date().toLocaleTimeString('es-MX')}`, 'B': '', 'C': '', 'D': '', 'E': '', 'F': '', 'G': '', 'H': '', 'I': '', 'J': '', 'K': '', 'L': '', 'M': '', 'N': '' },
                    { 'A': `Total de garantías registradas: ${arregloGarantias.length}`, 'B': '', 'C': '', 'D': '', 'E': '', 'F': '', 'G': '', 'H': '', 'I': '', 'J': '', 'K': '', 'L': '', 'M': '', 'N': '' },
                    { 'A': '', 'B': '', 'C': '', 'D': '', 'E': '', 'F': '', 'G': '', 'H': '', 'I': '', 'J': '', 'K': '', 'L': '', 'M': '', 'N': '' },
                ];

                // Encabezados de tabla
                const headersData = [
                    { 'A': 'ID Garantía', 'B': 'Marca Bicicleta', 'C': 'Modelo Bicicleta', 'D': 'Nombre Dueño', 'E': 'Apellidos Dueño', 'F': 'Tipo Garantía', 'G': 'Cobertura', 'H': 'Fecha Inicio', 'I': 'Fecha Vencimiento', 'J': 'Estado', 'K': 'Zona Afectada', 'L': 'Tipo Trabajo', 'M': 'Tipo Reparación', 'N': 'Correo Electrónico' }
                ];

                // Datos de garantías
                const garantiasData = arregloGarantias.map(garantia => ({
                    'A': garantia.id_garantia,
                    'B': garantia.marca_bicicleta || 'N/A',
                    'C': garantia.modelo_bicicleta || 'N/A',
                    'D': garantia.nombres || 'N/A',
                    'E': garantia.apellidos || 'N/A',
                    'F': garantia.tipo_garantia,
                    'G': garantia.cobertura || 'Sin descripción específica',
                    'H': new Date(garantia.fecha_inicio).toLocaleDateString('es-MX'),
                    'I': new Date(garantia.fecha_fin).toLocaleDateString('es-MX'),
                    'J': garantia.estado,
                    'K': garantia.zona_afectada || 'N/A',
                    'L': garantia.tipo_trabajo || 'N/A',
                    'M': garantia.tipo_reparacion || 'N/A',
                    'N': garantia.correo_electronico || 'N/A'
                }));

                // Combinar todos los datos
                const allData = [
                    ...tituloData,
                    ...headersData,
                    ...garantiasData
                ];

                // Crear hoja principal
                const ws = XLSX.utils.json_to_sheet(allData, { header: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'], skipHeader: true });

                // Establecer anchos de columna
                ws['!cols'] = [
                    { wch: 12 },  // ID Garantía
                    { wch: 18 },  // Marca Bicicleta
                    { wch: 18 },  // Modelo Bicicleta
                    { wch: 20 },  // Nombre Dueño
                    { wch: 20 },  // Apellidos Dueño
                    { wch: 15 },  // Tipo Garantía
                    { wch: 50 },  // Cobertura
                    { wch: 15 },  // Fecha Inicio
                    { wch: 18 },  // Fecha Vencimiento
                    { wch: 12 },  // Estado
                    { wch: 20 },  // Zona Afectada
                    { wch: 15 },  // Tipo Trabajo
                    { wch: 18 },  // Tipo Reparación
                    { wch: 30 }   // Correo Electrónico
                ];

                // Agregar hoja al workbook
                XLSX.utils.book_append_sheet(wb, ws, 'Garantías Detalladas');

                // Crear hoja de resumen estadístico
                const resumenData = [
                    { 'A': 'TOTALCARBON - RESUMEN DE GARANTÍAS', 'B': '', 'C': '', 'D': '', 'E': '' },
                    { 'A': `Fecha de generación: ${new Date().toLocaleDateString('es-MX')}`, 'B': '', 'C': '', 'D': '', 'E': '' },
                    { 'A': '', 'B': '', 'C': '', 'D': '', 'E': '' },
                    { 'A': 'ESTADO DE GARANTÍAS', 'B': 'CANTIDAD', 'C': 'PORCENTAJE', 'D': 'DESCRIPCIÓN', 'E': 'OBSERVACIONES' },
                    { 'A': 'Activas', 'B': activas, 'C': arregloGarantias.length > 0 ? `${((activas / arregloGarantias.length) * 100).toFixed(1)}%` : '0%', 'D': 'Garantías vigentes y válidas', 'E': 'Pueden ser reclamadas por el cliente' },
                    { 'A': 'Vencidas', 'B': vencidas, 'C': arregloGarantias.length > 0 ? `${((vencidas / arregloGarantias.length) * 100).toFixed(1)}%` : '0%', 'D': 'Garantías expiradas', 'E': 'No pueden ser reclamadas' },
                    { 'A': 'Canceladas', 'B': canceladas, 'C': arregloGarantias.length > 0 ? `${((canceladas / arregloGarantias.length) * 100).toFixed(1)}%` : '0%', 'D': 'Garantías canceladas', 'E': 'Anuladas por diversos motivos' },
                    { 'A': 'Reclamadas', 'B': reclamadas, 'C': arregloGarantias.length > 0 ? `${((reclamadas / arregloGarantias.length) * 100).toFixed(1)}%` : '0%', 'D': 'Garantías ya utilizadas', 'E': 'Servicio de garantía completado' },
                    { 'A': '', 'B': '', 'C': '', 'D': '', 'E': '' },
                    { 'A': 'TOTAL DE GARANTÍAS', 'B': arregloGarantias.length, 'C': '100%', 'D': 'Total registrado en el sistema', 'E': '' }
                ];

                const wsResumen = XLSX.utils.json_to_sheet(resumenData, { header: ['A', 'B', 'C', 'D', 'E'], skipHeader: true });
                wsResumen['!cols'] = [
                    { wch: 25 },  // Estado
                    { wch: 12 },  // Cantidad
                    { wch: 12 },  // Porcentaje
                    { wch: 30 },  // Descripción
                    { wch: 35 }   // Observaciones
                ];

                XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen Estadístico');

                // Crear hoja de coberturas detalladas
                const coberturasData = [
                    { 'A': 'TOTALCARBON - DETALLE DE COBERTURAS', 'B': '', 'C': '', 'D': '' },
                    { 'A': `Fecha: ${new Date().toLocaleDateString('es-MX')}`, 'B': '', 'C': '', 'D': '' },
                    { 'A': '', 'B': '', 'C': '', 'D': '' },
                    { 'A': 'ID GARANTÍA', 'B': 'TIPO DE GARANTÍA', 'C': 'DESCRIPCIÓN DE COBERTURA', 'D': 'ESTADO' }
                ];

                arregloGarantias.forEach(garantia => {
                    if (garantia.cobertura && garantia.cobertura.trim()) {
                        coberturasData.push({
                            'A': garantia.id_garantia,
                            'B': garantia.tipo_garantia,
                            'C': garantia.cobertura,
                            'D': garantia.estado
                        });
                    }
                });

                const wsCoberturas = XLSX.utils.json_to_sheet(coberturasData, { header: ['A', 'B', 'C', 'D'], skipHeader: true });
                wsCoberturas['!cols'] = [
                    { wch: 15 },  // ID
                    { wch: 20 },  // Tipo
                    { wch: 80 },  // Cobertura
                    { wch: 12 }   // Estado
                ];

                XLSX.utils.book_append_sheet(wb, wsCoberturas, 'Coberturas');

                // Guardar el archivo
                XLSX.writeFile(wb, 'garantias_totalcarbon.xlsx');

                filename = 'garantias_totalcarbon';
            } else if (type === 'proveedores') {
                // Agregar fila de título al Excel
                const tituloData = [
                    { 'Nombre Proveedor': 'Lista de Proveedores - TotalCarbon' },
                    { 'Nombre Proveedor': `Generado el: ${new Date().toLocaleDateString('es-MX')} ${new Date().toLocaleTimeString('es-MX')}` },
                    {}, // Fila vacía
                ];

                data = [
                    ...tituloData,
                    ...arregloProveedores.map(proveedor => ({
                        'Nombre Proveedor': proveedor.nombre_proveedor,
                        'Contacto': proveedor.contacto || '',
                        'Teléfono': proveedor.telefono || '',
                        'Correo': proveedor.correo || '',
                        'Dirección': proveedor.direccion || '',
                        'Productos Comprados': proveedor.productos_comprados || '',
                        'Notas': proveedor.notas_proveedor || '',
                        'Cantidad': proveedor.cantidad || 1,
                        'Creado': new Date(proveedor.creado_en).toLocaleDateString('es-MX')
                    }))
                ];
                filename = 'proveedores';
            } else if (type === 'productos') {
                // Agregar fila de título al Excel
                const tituloData = [
                    { 'Producto': 'Lista de Productos/Piezas - TotalCarbon' },
                    { 'Producto': `Generado el: ${new Date().toLocaleDateString('es-MX')} ${new Date().toLocaleTimeString('es-MX')}` },
                    {}, // Fila vacía
                ];

                data = [
                    ...tituloData,
                    ...arregloProductos.map(producto => ({
                        'Producto': producto.nombre_producto,
                        'Descripción': producto.descripcion || '',
                        'Proveedor': producto.nombre_proveedor || '',
                        'Cantidad': producto.cantidad || 1,
                        'Precio Unitario': producto.precio_unitario ? parseFloat(producto.precio_unitario) : 0,
                        'Total': producto.total ? parseFloat(producto.total) : 0,
                        'Fecha Adquirido': new Date(producto.fecha_adquirido).toLocaleDateString('es-MX'),
                        'Factura': producto.numero_factura || '',
                        'Creado': new Date(producto.creado_en).toLocaleDateString('es-MX')
                    }))
                ];
                filename = 'productos';
            }

            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, filename);
            XLSX.writeFile(wb, `${filename}.xlsx`);
            
            Swal.fire({
                icon: 'success',
                title: 'Exportación Exitosa',
                text: `El archivo ${filename}.xlsx ha sido descargado exitosamente.`,
                confirmButtonColor: '#1a1a1a'
            });
        }


        // Inicializar la aplicación
        document.addEventListener('DOMContentLoaded', function() {
            initializeData();

            // Responsive sidebar
            function handleResize() {
                const sidebar = document.getElementById('sidebar');
                const mainContent = document.querySelector('.main-content');

                if (window.innerWidth <= 992) {
                    sidebar.classList.add('hidden');
                    mainContent.classList.add('expanded');
                } else {
                    sidebar.classList.remove('hidden');
                    mainContent.classList.remove('expanded');
                }
            }

            window.addEventListener('resize', handleResize);
            handleResize();
        });
