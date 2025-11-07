<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TotalCarbon - Gestión de Clientes</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
    <link rel="stylesheet" href="../../recursos/css/Administrador/administrador.css?v=245333">
</head>
<body>
    <!-- Top Bar -->
    <div class="top-bar">
        <div class="top-bar-left">
            <button class="sidebar-toggle" onclick="toggleSidebar()">
                <div class="hamburger" id="hamburger">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </button>
        </div>
        <div class="top-bar-right">
            <div class="notification-bell">
                <i class="fas fa-bell"></i>
                <span class="notification-badge">3</span>
            </div>
            <div class="profile-icon">
                <i class="fas fa-user"></i>
            </div>
        </div>
    </div>

    <!-- Sidebar -->
    <div class="sidebar" id="sidebar">
          <div class="sidebar-header">
            <img src="../../recursos/img/logo2.png" alt="Total Carbon Logo" class="sidebar-logo">
        </div>
        <ul class="sidebar-menu">
            <li>
                <a href="#" onclick="showSection('chat')">
                    <i class="fas fa-comments"></i>
                    <span>Chat de Soporte</span>
                </a>
            </li>
            <li>
                <a href="#" class="active" onclick="showSection('clientes')">
                    <i class="fas fa-users"></i>
                    <span>Clientes</span>
                </a>
            </li>
            <li>
                <a href="#" onclick="showSection('proveedores')">
                    <i class="fas fa-building"></i>
                    <span>Proveedores</span>
                </a>
            </li>
            <li>
                <a href="#" onclick="showSection('productos')">
                    <i class="fas fa-cogs"></i>
                    <span>Productos/Piezas</span>
                </a>
            </li>
            <li>
                <a href="#" onclick="showSection('garantias')">
                    <i class="fas fa-shield-alt"></i>
                    <span>Garantías</span>
                </a>
            </li>
            <li>
                <a href="#" onclick="confirmLogout()">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>Cerrar Sesión</span>
                </a>
            </li>
        </ul>
    </div>

    <!-- Sidebar Overlay -->
    <div class="sidebar-overlay" id="sidebarOverlay" onclick="toggleSidebar()"></div>

    <!-- Main Content -->
    <div class="main-content">
        <!-- Clientes Section -->
        <div class="content-section active" id="clientes-section">
            <div class="section-header">
                <h2 class="section-title">Gestión de Clientes</h2>
                <div class="section-actions">
                    <button class="btn btn-primary" onclick="openClienteModal()">
                        <i class="fas fa-plus"></i>
                        Nuevo Cliente
                    </button>
                    <div class="btn-group">
                        <button class="btn btn-outline" onclick="exportToPDFClientes()">
                            <i class="fas fa-file-pdf"></i>
                            PDF
                        </button>
                        <button class="btn btn-outline" onclick="exportToExcelClientes()">
                            <i class="fas fa-file-excel"></i>
                            Excel
                        </button>
                    </div>
                </div>
            </div>

            <!-- Filters -->
            <div class="filters">
                <div class="search-box">
                    <i class="fas fa-search"></i>
                    <input type="text" id="buscadorClientes" placeholder="Buscar clientes por nombre, código, email, teléfono..." onkeyup="filtrarClientes()">
                </div>
                <select id="estadoFiltroClientes" class="filter-select" onchange="filtrarClientesPorEstado()">
                    <option value="todos">Todos</option>
                    <option value="activos">Activos</option>
                    <option value="inactivos">Inactivos</option>
                </select>
                <select id="ordenClientes" class="filter-select" onchange="cambiarOrdenClientes()">
                    <option value="desc">Más nuevos primero</option>
                    <option value="asc">Más viejos primero</option>
                </select>
            </div>

            <!-- Table -->
            <div class="table-container">
                <table class="data-table" id="clientesTable">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Cliente</th>
                            <th>Contacto</th>
                            <th>Ubicación</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="clientesTableBody">
                        <!-- Los datos se cargarán dinámicamente -->
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Proveedores Section -->
        <div class="content-section" id="proveedores-section">
            <div class="section-header">
                <h2 class="section-title">Gestión de Proveedores</h2>
                <div class="section-actions">
                    <button class="btn btn-primary" onclick="openProveedorModal()">
                        <i class="fas fa-plus"></i>
                        Nuevo Proveedor
                    </button>
                    <div class="btn-group">
                        <button class="btn btn-outline" onclick="exportToPDF('proveedores')">
                            <i class="fas fa-file-pdf"></i>
                            PDF
                        </button>
                        <button class="btn btn-outline" onclick="exportToExcel('proveedores')">
                            <i class="fas fa-file-excel"></i>
                            Excel
                        </button>
                    </div>
                </div>
            </div>

            <!-- Search -->
            <div class="filters">
                <div class="search-box">
                    <i class="fas fa-search"></i>
                    <input type="text" id="buscadorProveedores" placeholder="Buscar proveedores por nombre, correo, teléfono, etc..." onkeyup="filtrarProveedores()">
                </div>
            </div>

            <!-- Table -->
            <div class="table-container">
                <table class="data-table" id="proveedoresTable">
                    <thead>
                        <tr>
                            <th>Proveedor</th>
                            <th>Contacto</th>
                            <th>Teléfono</th>
                            <th>Correo</th>
                            <th>Dirección</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="proveedoresTableBody">
                        <!-- Los datos se cargarán dinámicamente -->
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Productos Section -->
        <div class="content-section" id="productos-section">
            <div class="section-header">
                <h2 class="section-title">Gestión de Productos/Piezas</h2>
                <div class="section-actions">
                    <button class="btn btn-outline" onclick="actualizarTablas()">
                        <i class="fas fa-sync-alt"></i>
                        Actualizar
                    </button>
                    <button class="btn btn-primary" onclick="openProductoModal()">
                        <i class="fas fa-plus"></i>
                        Nuevo Producto
                    </button>
                    <div class="btn-group">
                        <button class="btn btn-outline" onclick="exportToPDF('productos')">
                            <i class="fas fa-file-pdf"></i>
                            PDF
                        </button>
                        <button class="btn btn-outline" onclick="exportToExcel('productos')">
                            <i class="fas fa-file-excel"></i>
                            Excel
                        </button>
                    </div>
                </div>
            </div>

            <!-- Search -->
            <div class="filters">
                <div class="search-box">
                    <i class="fas fa-search"></i>
                    <input type="text" id="buscadorProductos" placeholder="Buscar productos por nombre, descripción, proveedor..." onkeyup="filtrarProductos()">
                </div>
            </div>

            <!-- Table -->
            <div class="table-container">
                <table class="data-table productos-table" id="productosTable">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Proveedor</th>
                            <th>Cantidad</th>
                            <th>Precio Unitario</th>
                            <th>Total</th>
                            <th>Fecha Adquirido</th>
                            <th>Factura</th>
                            <th>Notas</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="productosTableBody">
                        <!-- Los datos se cargarán dinámicamente -->
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Garantías Section -->
        <div class="content-section" id="garantias-section">
            <div class="section-header">
                <h2 class="section-title">Gestión de Garantías</h2>
                <div class="section-actions">
                    <button class="btn btn-primary" onclick="openGarantiaModal()">
                        <i class="fas fa-plus"></i>
                        Nueva Garantía
                    </button>
                    <div class="btn-group">
                        <button class="btn btn-outline" onclick="exportToPDF('garantias')">
                            <i class="fas fa-file-pdf"></i>
                            PDF
                        </button>
                        <button class="btn btn-outline" onclick="exportToExcel('garantias')">
                            <i class="fas fa-file-excel"></i>
                            Excel
                        </button>
                    </div>
                </div>
            </div>

            <!-- Filters -->
            <div class="filters">
                <div class="search-box">
                    <i class="fas fa-search"></i>
                    <input type="text" placeholder="Buscar garantías..." onkeyup="filterData()">
                </div>
                <select class="filter-select" onchange="filterData()">
                    <option value="todos">Todos</option>
                    <option value="activas">Activas</option>
                    <option value="vencidas">Vencidas</option>
                    <option value="canceladas">Canceladas</option>
                </select>
            </div>

            <!-- Table -->
            <div class="table-container">
                <table class="data-table" id="garantiasTable">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Cotización</th>
                            <th>Cliente</th>
                            <th>Tipo</th>
                            <th>Vencimiento</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="garantiasTableBody">
                        <!-- Los datos se cargarán dinámicamente -->
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Cliente Modal -->
    <div class="modal" id="clienteModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="clienteModalTitle">Nuevo Cliente</h3>
                <button class="modal-close" onclick="closeClienteModal()">&times;</button>
            </div>
            <div class="modal-body">
                <form id="clienteForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="nombres">Nombres *</label>
                            <input type="text" id="nombres" class="form-control" required>
                            <span class="error-message"></span>
                        </div>
                        <div class="form-group">
                            <label for="apellidos">Apellidos *</label>
                            <input type="text" id="apellidos" class="form-control" required>
                            <span class="error-message"></span>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="correo">Correo Electrónico *</label>
                            <input type="email" id="correo" class="form-control" required>
                            <span class="error-message"></span>
                        </div>
                        <div class="form-group">
                            <label for="telefono">Teléfono</label>
                            <input type="tel" id="telefono" class="form-control">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="direccion">Dirección</label>
                            <input type="text" id="direccion" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="ciudad">Ciudad</label>
                            <input type="text" id="ciudad" class="form-control">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="estado">Estado</label>
                            <input type="text" id="estado" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="estado_usuario">Estado del Usuario *</label>
                            <select id="estado_usuario" class="form-control" required>
                                <option value="1">Activo</option>
                                <option value="0">Inactivo</option>
                            </select>
                            <span class="error-message"></span>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="contrasena">Contraseña *</label>
                            <input type="password" id="contrasena" class="form-control" required>
                            <span class="error-message"></span>
                        </div>
                        <div class="form-group">
                            <label for="confirmar_contrasena">Confirmar Contraseña *</label>
                            <input type="password" id="confirmar_contrasena" class="form-control" required>
                            <span class="error-message"></span>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline" onclick="closeClienteModal()">Cancelar</button>
                <button type="button" class="btn btn-primary" onclick="saveCliente()">
                    <i class="fas fa-save"></i>
                    <span id="clienteSaveBtn">Actualizar Cliente</span>
                </button>
            </div>
        </div>
    </div>

    <!-- Producto Modal -->
    <div class="modal" id="productoModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="productoModalTitle">Nuevo Producto</h3>
                <button class="modal-close" onclick="closeModal('productoModal')">&times;</button>
            </div>
            <div class="modal-body">
                <form id="productoForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="proveedor_id">Proveedor *</label>
                            <select id="proveedor_id" class="form-control" required>
                                <option value="">Seleccionar proveedor</option>
                            </select>
                            <span class="error-message"></span>
                        </div>
                        <div class="form-group">
                            <label for="nombre_producto">Nombre del Producto *</label>
                            <input type="text" id="nombre_producto" class="form-control" required>
                            <span class="error-message"></span>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="descripcion">Descripción</label>
                            <textarea id="descripcion" class="form-control" rows="2"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="cantidad">Cantidad *</label>
                            <input type="number" id="cantidad" class="form-control" min="1" value="1" required>
                            <span class="error-message"></span>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="precio_unitario">Precio Unitario</label>
                            <input type="number" id="precio_unitario" class="form-control" step="0.01" min="0">
                        </div>
                        <div class="form-group">
                            <label for="fecha_adquirido">Fecha Adquirido *</label>
                            <input type="date" id="fecha_adquirido" class="form-control" required>
                            <span class="error-message"></span>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="numero_factura">Número de Factura</label>
                            <input type="text" id="numero_factura" class="form-control">
                        </div>
                        <div class="form-group full-width">
                            <label for="notas">Notas</label>
                            <textarea id="notas" class="form-control" rows="2"></textarea>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline" onclick="closeModal('productoModal')">Cancelar</button>
                <button type="button" class="btn btn-primary" onclick="saveProducto()">
                    <i class="fas fa-save"></i>
                    <span id="productoSaveBtn">Guardar Producto</span>
                </button>
            </div>
        </div>
    </div>

    <!-- Proveedor Modal -->
    <div class="modal" id="proveedorModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="proveedorModalTitle">Nuevo Proveedor</h3>
                <button class="modal-close" onclick="closeModal('proveedorModal')">&times;</button>
            </div>
            <div class="modal-body">
                <form id="proveedorForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="nombre_proveedor">Nombre del Proveedor *</label>
                            <input type="text" id="nombre_proveedor" class="form-control" required>
                            <span class="error-message"></span>
                        </div>
                        <div class="form-group">
                            <label for="contacto_proveedor">Contacto *</label>
                            <input type="text" id="contacto_proveedor" class="form-control" required>
                            <span class="error-message"></span>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="telefono_proveedor">Teléfono *</label>
                            <input type="tel" id="telefono_proveedor" class="form-control" required>
                            <span class="error-message"></span>
                        </div>
                        <div class="form-group">
                            <label for="correo_proveedor">Correo *</label>
                            <input type="email" id="correo_proveedor" class="form-control" required>
                            <span class="error-message"></span>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group full-width">
                            <label for="direccion_proveedor">Dirección *</label>
                            <input type="text" id="direccion_proveedor" class="form-control" required>
                            <span class="error-message"></span>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline" onclick="closeModal('proveedorModal')">Cancelar</button>
                <button type="button" class="btn btn-primary" onclick="saveProveedor()">
                    <i class="fas fa-save"></i>
                    <span id="proveedorSaveBtn">Guardar Proveedor</span>
                </button>
            </div>
        </div>
    </div>

    <!-- Garantía Modal -->
    <div class="modal" id="garantiaModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="garantiaModalTitle">Nueva Garantía</h3>
                <button class="modal-close" onclick="closeModal('garantiaModal')">&times;</button>
            </div>
            <div class="modal-body">
                <form id="garantiaForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="id_cotizacion">ID Cotización *</label>
                            <input type="number" id="id_cotizacion" class="form-control" required>
                            <span class="error-message"></span>
                        </div>
                        <div class="form-group">
                            <label for="cliente_garantia">Cliente *</label>
                            <select id="cliente_garantia" class="form-control" required>
                                <option value="">Seleccionar cliente</option>
                            </select>
                            <span class="error-message"></span>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="tipo_garantia">Tipo de Garantía *</label>
                            <select id="tipo_garantia" class="form-control" required>
                                <option value="">Seleccionar tipo</option>
                                <option value="Básica">Básica</option>
                                <option value="Estándar">Estándar</option>
                                <option value="Premium Carbon">Premium Carbon</option>
                                <option value="Extendida">Extendida</option>
                            </select>
                            <span class="error-message"></span>
                        </div>
                        <div class="form-group">
                            <label for="fecha_fin">Fecha de Vencimiento *</label>
                            <input type="date" id="fecha_fin" class="form-control" required>
                            <span class="error-message"></span>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group full-width">
                            <label for="cobertura">Cobertura</label>
                            <textarea id="cobertura" class="form-control" rows="3"></textarea>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline" onclick="closeModal('garantiaModal')">Cancelar</button>
                <button type="button" class="btn btn-primary" onclick="saveGarantia()">
                    <i class="fas fa-save"></i>
                    <span id="garantiaSaveBtn">Guardar Garantía</span>
                </button>
            </div>
        </div>
    </div>

    <!-- Detalles Cliente Modal -->
    <div class="modal" id="detallesClienteModal">
        <div class="modal-content modal-large">
            <div class="modal-header">
                <h3>Detalles del Cliente</h3>
                <button class="modal-close" onclick="closeModal('detallesClienteModal')">&times;</button>
            </div>
            <div class="modal-body">
                <div id="detallesClienteContent">
                    <!-- El contenido se cargará dinámicamente -->
                </div>
            </div>
        </div>

        <!-- Chat Section -->
        <div class="content-section" id="chat-section">
            <div class="section-header">
                <h2 class="section-title">Chat de Soporte</h2>
                <div class="section-actions">
                    <button class="btn btn-outline" onclick="actualizarConversaciones()">
                        <i class="fas fa-sync-alt"></i>
                        Actualizar
                    </button>
                </div>
            </div>

            <div class="chat-container">
                <div class="chat-sidebar">
                    <div class="chat-search">
                        <input type="text" id="buscadorConversaciones" placeholder="Buscar conversaciones..." onkeyup="filtrarConversaciones()">
                    </div>
                    <div class="conversaciones-list" id="conversacionesList">
                        <!-- Las conversaciones se cargarán dinámicamente -->
                    </div>
                </div>

                <div class="chat-main">
                    <div class="chat-header" id="chatHeader">
                        <div class="chat-user-info">
                            <i class="fas fa-user-circle"></i>
                            <span>Selecciona una conversación</span>
                        </div>
                    </div>

                    <div class="chat-messages" id="chatMessages">
                        <div class="no-conversation">
                            <i class="fas fa-comments"></i>
                            <p>Selecciona una conversación para ver los mensajes</p>
                        </div>
                    </div>

                    <div class="chat-input" id="chatInput" style="display: none;">
                        <div class="input-container">
                            <input type="text" id="mensajeInput" placeholder="Escribe un mensaje..." onkeypress="enviarMensajeEnter(event)" maxlength="1000">
                            <button class="btn-send" id="btnSend" onclick="enviarMensaje()">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                        <div class="typing-indicator" id="typingIndicator" style="display: none;">
                            <span>El cliente está escribiendo...</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.23/jspdf.plugin.autotable.min.js"></script>
    <script src="../../recursos/js/Administrador/administrador.js?V=3456"></script>
    <script src="../../recursos/js/Administrador/clientes.js?v=555"></script>
    <script src="../../recursos/js/Administrador/chat.js?v=999999"></script>

    <!-- Chat Floating Button -->
    <div class="chat-floating-btn" id="chatFloatingBtn" onclick="abrirChatFlotante()">
        <i class="fas fa-comments"></i>
        <span class="chat-notification-badge" id="chatNotificationBadge" style="display: none;">0</span>
    </div>

</body>
</html>