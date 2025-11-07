
        // Variables globales
        let arregloUsuarios = [];
        let arregloProveedores = [];
        let arregloProductos = [];
        let arregloGarantias = [];
        let arregloCotizaciones = [];
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
            console.log('🔄 Cambiando a sección:', section);

            // Ocultar todas las secciones
            document.querySelectorAll('.content-section').forEach(sec => {
                console.log('❌ Ocultando sección:', sec.id);
                sec.classList.remove('active');
            });

            // Mostrar la sección seleccionada
            const targetSection = document.getElementById(section + '-section');
            console.log('✅ Mostrando sección:', section + '-section', targetSection);
            if (targetSection) {
                targetSection.classList.add('active');
            } else {
                console.error('❌ Sección no encontrada:', section + '-section');
            }

            // Actualizar menú lateral
            document.querySelectorAll('.sidebar-menu a').forEach(link => {
                link.classList.remove('active');
            });
            if (event && event.target) {
                event.target.classList.add('active');
            }

            seccionActual = section;

            // Cerrar sidebar en móvil
            if (window.innerWidth <= 992) {
                toggleSidebar();
            }

            console.log('🎯 Sección cambiada exitosamente a:', section);
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
                console.error('Error loading productos:', error);
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
                console.error('Error loading proveedores for select:', error);
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
                console.error('Error fetching producto:', error);
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
                console.error('Error saving producto:', error);
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
                console.error('Error fetching producto details:', error);
            }
        }

        async function deleteProducto(id) {
            console.log('deleteProducto called with id:', id);
            console.log('Current productos array:', arregloProductos);

            // Convertir id a número para comparación correcta
            const idNum = parseInt(id);
            console.log('Converted id to number:', idNum);

            const producto = arregloProductos.find(p => parseInt(p.id_compra) === idNum);
            console.log('Producto found:', producto);

            if (!producto) {
                console.error('Producto not found - reloading productos...');
                // Recargar productos si no se encuentra
                await loadProductos();
                const productoReloaded = arregloProductos.find(p => parseInt(p.id_compra) === idNum);
                console.log('Producto after reload:', productoReloaded);

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

            console.log('Swal result:', result);

            if (result.isConfirmed) {
                console.log('User confirmed deletion');
                try {
                    console.log('Making fetch request...');
                    const response = await fetch(`../../controlador/Administrador/compras_proveedores_controller.php?action=deleteCompraProveedor&id=${id}`);
                    console.log('Response received:', response);
                    console.log('Response status:', response.status);

                    const res = await response.json();
                    console.log('Response JSON:', res);

                    if (res.success) {
                        console.log('Deletion successful');
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
                        console.log('Deletion failed:', res.error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: res.error || 'Ocurrió un error al eliminar el producto.',
                            confirmButtonColor: '#1a1a1a'
                        });
                    }
                } catch (error) {
                    console.error('Error deleting producto:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de conexión',
                        text: 'No se pudo conectar con el servidor.',
                        confirmButtonColor: '#1a1a1a'
                    });
                }
            } else {
                console.log('User cancelled deletion');
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
                // Error silencioso
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
                console.error('Algunos elementos del formulario no existen');
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
                // Error silencioso
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
                // Error silencioso
            }
        }

        async function deleteProveedor(id) {
            console.log('deleteProveedor called with id:', id);
            console.log('Current proveedores array:', arregloProveedores);

            // Convertir id a número para comparación correcta
            const idNum = parseInt(id);
            console.log('Converted id to number:', idNum);

            const proveedor = arregloProveedores.find(p => parseInt(p.id_proveedor) === idNum);
            console.log('Proveedor found:', proveedor);

            if (!proveedor) {
                console.error('Proveedor not found - reloading proveedores...');
                // Recargar proveedores si no se encuentra
                await loadProveedores();
                const proveedorReloaded = arregloProveedores.find(p => parseInt(p.id_proveedor) === idNum);
                console.log('Proveedor after reload:', proveedorReloaded);

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

            console.log('Swal result:', result);

            if (result.isConfirmed) {
                console.log('User confirmed deletion');
                try {
                    console.log('Making fetch request...');
                    const response = await fetch(`../../controlador/Administrador/proveedores_controller.php?action=deleteProveedor&id=${id}`);
                    console.log('Response received:', response);
                    console.log('Response status:', response.status);

                    const res = await response.json();
                    console.log('Response JSON:', res);

                    if (res.success) {
                        console.log('Deletion successful');
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
                        console.log('Deletion failed:', res.error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: res.error || 'Ocurrió un error al eliminar el proveedor.',
                            confirmButtonColor: '#1a1a1a'
                        });
                    }
                } catch (error) {
                    // Error silencioso
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de conexión',
                        text: 'No se pudo conectar con el servidor.',
                        confirmButtonColor: '#1a1a1a'
                    });
                }
            } else {
                console.log('User cancelled deletion');
            }
        }

        // Funciones de exportación
        function exportToPDF(type) {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            let data = [];
            let filename = '';
            
            if (type === 'proveedores') {
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
            
            if (type === 'proveedores') {
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
