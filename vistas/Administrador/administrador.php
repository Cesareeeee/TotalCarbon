<?php
session_start();
require_once '../../modelos/php/conexion.php';

if (!isset($_SESSION['id_usuario']) || obtenerNombreRol($_SESSION['id_rol']) !== 'ADMINISTRADOR') {
    header('Location: ../login.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TotalCarbon - Gestión de Clientes</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
    <link rel="stylesheet" href="../../recursos/css/Administrador/administrador.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" href="../../recursos/css/Administrador/cotizaciones_admin.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" href="../../recursos/css/Administrador/nuevo_servicio.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" href="../../recursos/css/Administrador/piezas_custom.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" href="../../recursos/css/Administrador/proveedores_custom.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" href="../../recursos/css/Administrador/garantias_custom.css?v=<?php echo time(); ?>"
    <link rel="icon" href="../../presentacion/assets/image.png">
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
            <div class="admin-title">
                PANEL DE ADMINISTRACIÓN
            </div>
        </div>
        <div class="top-bar-right">
            <div class="notification-bell">
                <i class="fas fa-bell"></i>
                <span class="notification-badge">3</span>
            </div>
            <div class="profile-icon" onclick="window.location.href='perfil_administrador.php'">
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
                <a href="#" class="active" onclick="showSection('dashboard')">
                    <i class="fas fa-tachometer-alt"></i>
                    <span>Dashboard</span>
                </a>
            </li>
            <li>
                <a href="#" onclick="showSection('cotizaciones-pendientes')">
                    <i class="fas fa-clock"></i>
                    <span>Cotizaciones Pendientes</span>
                </a>
            </li>
            <li>
                <a href="#" onclick="showSection('nuevo-servicio')">
                    <i class="fas fa-plus-circle"></i>
                    <span>Nuevo Servicio</span>
                </a>
            </li>
            <li>
                <a href="#" onclick="showSection('cotizaciones')">
                    <i class="fas fa-project-diagram"></i>
                    <span>Seguimiento de Proyectos</span>
                </a>
            </li>
            <li>
                <a href="#" onclick="showSection('clientes')">
                    <i class="fas fa-users"></i>
                    <span>Clientes</span>
                </a>
            </li>
            <li>
                <a href="#" onclick="showSection('chat')">
                    <i class="fas fa-comments"></i>
                    <span>Chat</span>
                </a>
            </li>
            <li>
                <a href="#" onclick="showSection('garantias')">
                    <i class="fas fa-shield-alt"></i>
                    <span>Garantías</span>
                </a>
            </li>
            <li>
                <a href="#" onclick="showSection('piezas')">
                    <i class="fas fa-cogs"></i>
                    <span>Piezas</span>
                </a>
            </li>
            <li>
                <a href="#" onclick="showSection('proveedores')">
                    <i class="fas fa-truck"></i>
                    <span>Proveedores</span>
                </a>
            </li>
            <li>
                <a href="#" onclick="window.location.href='perfil_administrador.php'">
                    <i class="fas fa-user-edit"></i>
                    <span>Perfil</span>
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
    <div class="main-content" style="overflow-y: scroll;">
        <!-- Dashboard Section -->
        <div class="content-section active" id="dashboard-section">
            <div class="section-header">
                <h2 class="section-title">Dashboard</h2>
                <div class="section-actions">
                    <button class="btn btn-outline" onclick="exportarDashboardPDF()">
                        <i class="fas fa-file-pdf"></i>
                        Exportar PDF
                    </button>
                    <button class="btn btn-outline" onclick="exportarDashboardExcel()">
                        <i class="fas fa-file-excel"></i>
                        Exportar Excel
                    </button>
                    <button class="btn btn-primary" onclick="actualizarDashboard()">
                        <i class="fas fa-sync-alt"></i>
                        Actualizar
                    </button>
                </div>
            </div>

            <!-- Dashboard Cards -->
            <div class="dashboard-cards">
                <div class="dashboard-card">
                    <div class="card-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="card-content">
                        <h3 id="totalClientes">0</h3>
                        <p>Total de Clientes</p>
                    </div>
                </div>
                <div class="dashboard-card">
                    <div class="card-icon">
                        <i class="fas fa-file-alt"></i>
                    </div>
                    <div class="card-content">
                        <h3 id="totalCotizaciones">0</h3>
                        <p>Total de Cotizaciones</p>
                    </div>
                </div>
                <div class="dashboard-card">
                    <div class="card-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="card-content">
                        <h3 id="cotizacionesCompletadas">0</h3>
                        <p>Cotizaciones Completadas</p>
                    </div>
                </div>
                <div class="dashboard-card">
                    <div class="card-icon">
                        <i class="fas fa-shield-alt"></i>
                    </div>
                    <div class="card-content">
                        <h3 id="garantiasActivas">0</h3>
                        <p>Garantías Activas</p>
                    </div>
                </div>
                <div class="dashboard-card">
                    <div class="card-icon">
                        <i class="fas fa-building"></i>
                    </div>
                    <div class="card-content">
                        <h3 id="totalProveedores">0</h3>
                        <p>Total de Proveedores</p>
                    </div>
                </div>
                <div class="dashboard-card">
                    <div class="card-icon">
                        <i class="fas fa-envelope"></i>
                    </div>
                    <div class="card-content">
                        <h3 id="mensajesSinLeer">0</h3>
                        <p>Mensajes Sin Leer</p>
                    </div>
                </div>
            </div>

            <!-- Income/Expenses Section -->
            <div class="income-expenses-section">
                <div class="section-header">
                    <h2 class="section-title">Control de Ingresos y Salidas</h2>
                    <div class="section-actions">
                        <button class="btn btn-primary" onclick="openIncomeExpenseModal()">
                            <i class="fas fa-plus"></i>
                            Nuevo Registro
                        </button>
                    </div>
                </div>

                <!-- Income/Expense Cards -->
                <div class="income-expense-cards">
                    <div class="income-card">
                        <div class="card-icon">
                            <i class="fas fa-arrow-up"></i>
                        </div>
                        <div class="card-content">
                            <h3 id="totalIngresos">$0.00</h3>
                            <p>Total Ingresos</p>
                        </div>
                    </div>
                    <div class="expense-card">
                        <div class="card-icon">
                            <i class="fas fa-arrow-down"></i>
                        </div>
                        <div class="card-content">
                            <h3 id="totalGastos">$0.00</h3>
                            <p>Total Salidas</p>
                        </div>
                    </div>
                    <div class="balance-card">
                        <div class="card-icon">
                            <i class="fas fa-balance-scale"></i>
                        </div>
                        <div class="card-content">
                            <h3 id="balanceTotal">$0.00</h3>
                            <p>Balance Total</p>
                        </div>
                    </div>
                </div>

            </div>

            <!-- Income/Expenses Chart Section -->
            <div class="income-expenses-chart-section">
                <div class="chart-container large">
                    <div class="chart-header">
                        <h4>Evolución de Ingresos y Salidas</h4>
                        <div class="chart-controls">
                            <div class="filter-group">
                                <label>Período:</label>
                                <select id="periodoIngresosGastosChart" class="filter-select" onchange="cambiarPeriodoIngresosGastosChart()">
                                    <option value="hoy">Hoy</option>
                                    <option value="semana">Esta Semana</option>
                                    <option value="mes">Este Mes</option>
                                    <option value="anio">Este Año</option>
                                    <option value="personalizado">Personalizado</option>
                                </select>
                            </div>
                            <div class="filter-group" id="fechaPersonalizadaIngresosGastosChart" style="display: none;">
                                <label>Desde:</label>
                                <input type="date" id="fechaInicioIngresosGastosChart" class="filter-input" onchange="aplicarFiltrosIngresosGastosChart()">
                                <label>Hasta:</label>
                                <input type="date" id="fechaFinIngresosGastosChart" class="filter-input" onchange="aplicarFiltrosIngresosGastosChart()">
                            </div>
                            <div class="filter-group">
                                <label>Mostrar:</label>
                                <select id="tipoGraficoIngresosGastos" class="filter-select" onchange="cambiarTipoGraficoIngresosGastos()">
                                    <option value="todos">Todos</option>
                                    <option value="ingresos">Ingresos</option>
                                    <option value="salidas">Salidas</option>
                                    <option value="balance">Balance</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <canvas id="ingresosGastosMensualesChart"></canvas>
                </div>
            </div>

            <!-- Dashboard Filters -->
            <div class="dashboard-filters">
                <div class="filter-group">
                    <label>Período:</label>
                    <select id="periodoFiltro" class="filter-select" onchange="cambiarPeriodo()">
                        <option value="hoy">Hoy</option>
                        <option value="semana">Esta Semana</option>
                        <option value="mes">Este Mes</option>
                        <option value="anio">Este Año</option>
                        <option value="personalizado">Personalizado</option>
                    </select>
                </div>
                <div class="filter-group" id="fechaPersonalizada" style="display: none;">
                    <label>Desde:</label>
                    <input type="date" id="fechaInicio" class="filter-input" onchange="aplicarFiltros()">
                    <label>Hasta:</label>
                    <input type="date" id="fechaFin" class="filter-input" onchange="aplicarFiltros()">
                </div>
                <div class="filter-group">
                    <label>Estado:</label>
                    <select id="estadoFiltro" class="filter-select" onchange="aplicarFiltros()">
                        <option value="todos">Todos</option>
                        <option value="APROBADA">Aprobadas</option>
                        <option value="RECHAZADA">Rechazadas</option>
                        <option value="EN_PROCESO">En Proceso</option>
                        <option value="COMPLETADO">Completadas</option>
                    </select>
                </div>
            </div>

            <!-- Charts Section -->
            <div class="charts-grid">

                <div class="chart-container">
                    <div class="chart-header">
                        <h4>Tipos de Trabajo Más Solicitados</h4>
                    </div>
                    <canvas id="trabajosChart"></canvas>
                </div>

                <div class="chart-container">
                    <div class="chart-header">
                        <h4>Tipos de Reparación Más Comunes</h4>
                    </div>
                    <canvas id="reparacionesChart"></canvas>
                </div>

            </div>

            <!-- Tables Section -->
            <div class="tables-section" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div class="table-container" style="grid-column: span 2;">
                    <div class="table-header">
                        <h3>Clientes Más Frecuentes</h3>
                    </div>
                    <div id="clientesFrecuentesTable"></div>
                </div>

                <div class="table-container" style="grid-column: span 2;">
                    <div class="table-header">
                        <h3>Distribución Geográfica</h3>
                    </div>
                    <div id="ubicacionesTable"></div>
                </div>
            </div>




            <!-- Additional Charts Section -->
            <div class="charts-section">
                <div class="chart-container">
                    <h4>Usuarios por Rol</h4>
                    <canvas id="usuariosRolChart"></canvas>
                </div>

            </div>

            <!-- Income/Expense Table at Bottom -->
            <div class="table-container">
                <div class="table-header">
                    <h3>Historial de Ingresos y Salidas</h3>
                </div>
                <div id="ingresosGastosTable"></div>
            </div>
        </div>

        <!-- Cotizaciones Section -->
        <div class="content-section cotizaciones-section" id="cotizaciones-section">
            <div class="section-header">
                <h2 class="section-title">Seguimiento de Proyectos</h2>
                <div class="section-actions">
                    <button class="btn btn-outline" onclick="cargarCotizaciones()">
                        <i class="fas fa-sync-alt"></i>
                        Actualizar
                    </button>
                </div>
            </div>

            <!-- Filters -->
            <div class="filters">
                <div class="search-box">
                    <i class="fas fa-search"></i>
                    <input type="text" id="buscadorCotizaciones" placeholder="&#128269; Buscar cotizaciones..." onkeyup="filtrarCotizaciones()">
                </div>
                <select id="estadoFiltroCotizaciones" class="filter-select" onchange="filtrarCotizacionesPorEstado()">
                    <option value="todos">Todos los Estados</option>
                    <option value="PENDIENTE">Pendientes</option>
                    <option value="APROBADA">Aprobadas</option>
                    <option value="RECHAZADA">Rechazadas</option>
                    <option value="EN_PROCESO">En Proceso</option>
                    <option value="COMPLETADO">Completadas</option>
                    <option value="COTIZACIÓN ENVIADA">Cotización Enviada</option>
                    <option value="ACEPTADA">Aceptada</option>
                    <option value="REPARACIÓN INICIADA">Reparación Iniciada</option>
                    <option value="PINTURA">Pintura</option>
                    <option value="EMPACADO">Empacado</option>
                    <option value="ENVIADO">Enviado</option>
                </select>
            </div>

            <!-- Cards -->
            <div class="cotizaciones-cards-container">
                <div id="cotizacionesList" class="cotizaciones-cards"></div>
                <div id="cotizacionDetail" class="cotizacion-detail-view" style="display: none;"></div>
            </div>
        </div>

        <!-- Cotizaciones Pendientes Section -->
        <div class="content-section" id="cotizaciones-pendientes-section">
            <div class="section-header">
                <h2 class="section-title">Cotizaciones Pendientes</h2>
                <div class="section-actions">
                    <button class="btn btn-outline" onclick="actualizarCotizacionesPendientes()">
                        <i class="fas fa-sync-alt"></i>
                        Actualizar
                    </button>
                </div>
            </div>

            <!-- Filters -->
            <div class="filters">
                <div class="search-box">
                    <i class="fas fa-search"></i>
                    <input type="text" id="buscadorCotizacionesPendientes" placeholder="Buscar por nombre, email o servicio..." onkeyup="filtrarBusqueda()">
                </div>
                <select id="estadoFiltroCotizacionesPendientes" class="filter-select" onchange="filtrarPorEstado()">
                    <option value="todos">Mostrar Todas</option>
                    <option value="PENDIENTE">Pendientes</option>
                    <option value="APROBADA">Aprobadas</option>
                    <option value="RECHAZADA">Rechazadas</option>
                </select>
            </div>

            <!-- Table -->
            <div class="table-container">
                <div id="cotizacionesPendientesTable"></div>
            </div>
        </div>

        <!-- Nuevo Servicio Section -->
        <div class="content-section nuevo-servicio-section" id="nuevo-servicio-section">
            <div class="section-header">
                <h2 class="section-title">Nuevo Servicio</h2>
                <div class="section-actions">
                    <button class="btn btn-outline" onclick="location.reload()">
                        <i class="fas fa-sync-alt"></i>
                        Actualizar
                    </button>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <i class="fas fa-clipboard-list me-2"></i>Solicitud de Cotización - Reparación de Bicicleta
                </div>
                <div class="card-body">
                    <form id="nuevoServicioForm" novalidate>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <div class="form-group">
                                    <label for="fechaServicio" class="form-label">
                                        <i class="fas fa-calendar"></i>
                                        Fecha
                                    </label>
                                    <input type="text" class="form-control" id="fechaServicio" readonly>
                                </div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <div class="form-group">
                                    <label for="usuarioServicio" class="form-label">
                                        <i class="fas fa-user"></i>
                                        Cliente *
                                    </label>
                                    <select id="usuarioServicio" name="id_usuario" class="form-control" required>
                                        <option value="">Seleccionar cliente...</option>
                                    </select>
                                    <div class="invalid-feedback">Por favor, selecciona un cliente.</div>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <div class="form-group">
                                    <label for="direccionServicio" class="form-label">
                                        <i class="fas fa-map-marker-alt"></i>
                                        Dirección *
                                    </label>
                                    <input type="text" class="form-control" id="direccionServicio" required>
                                    <div class="invalid-feedback">Por favor, ingresa la dirección.</div>
                                </div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <div class="form-group">
                                    <label for="telefonoServicio" class="form-label">
                                        <i class="fas fa-phone"></i>
                                        Teléfono *
                                    </label>
                                    <input type="tel" class="form-control" id="telefonoServicio" required>
                                    <div class="invalid-feedback">Por favor, ingresa el número de teléfono.</div>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <div class="form-group">
                                    <label for="email" class="form-label">
                                        <i class="fas fa-envelope"></i>
                                        Correo Electrónico *
                                    </label>
                                    <input type="email" class="form-control" id="email" required>
                                    <div class="invalid-feedback">Por favor, ingresa un correo electrónico válido.</div>
                                </div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <div class="form-group">
                                    <label for="marca" class="form-label">
                                        <i class="fas fa-tag"></i>
                                        Marca de la Bicicleta *
                                    </label>
                                    <input type="text" class="form-control" id="marca" list="marcasBicicleta" required>
                                    <datalist id="marcasBicicleta">
                                        <option value="SPECIALIZED">
                                        <option value="TREK">
                                        <option value="CANNONDALE">
                                        <option value="GIANT">
                                        <option value="BIANCHI">
                                        <option value="CERVÉLO">
                                    </datalist>
                                    <div class="invalid-feedback">Por favor, ingresa la marca de tu bicicleta.</div>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <div class="form-group">
                                    <label for="modelo" class="form-label">
                                        <i class="fas fa-bicycle"></i>
                                        Modelo de la Bicicleta *
                                    </label>
                                    <input type="text" class="form-control" id="modelo" required>
                                    <div class="invalid-feedback">Por favor, ingresa el modelo de tu bicicleta.</div>
                                </div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <div class="form-group">
                                    <label for="zonaAfectada" class="form-label">
                                        <i class="fas fa-exclamation-triangle"></i>
                                        Zona Afectada *
                                    </label>
                                    <input type="text" class="form-control" id="zonaAfectada" required>
                                    <div class="invalid-feedback">Por favor, describe la zona afectada.</div>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">
                                <i class="fas fa-clock"></i>
                                Tipo de Trabajo *
                            </label>
                            <div class="option-buttons" id="tipoTrabajoButtons">
                                <div class="option-button express" data-value="EXPRESS">
                                    <i class="fas fa-bolt"></i>
                                    <span>Express (8 días)</span>
                                </div>
                                <div class="option-button normal" data-value="NORMAL">
                                    <i class="fas fa-clock"></i>
                                    <span>Normal (15 días)</span>
                                </div>
                                <div class="option-button pintura" data-value="PINTURA_TOTAL">
                                    <i class="fas fa-paint-brush"></i>
                                    <span>Pintura Total (30 días)</span>
                                </div>
                            </div>
                            <input type="hidden" id="tipoTrabajo" name="tipoTrabajo" required>
                            <div class="invalid-feedback">Por favor, selecciona un tipo de trabajo.</div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">
                                <i class="fas fa-tools"></i>
                                Tipo de Reparación *
                            </label>
                            <div class="option-buttons" id="tipoReparacionButtons">
                                <div class="option-button" data-value="CHEQUEO_ESTRUCTURAL">
                                    <i class="fas fa-search"></i>
                                    <span>Chequeo Estructural</span>
                                </div>
                                <div class="option-button" data-value="FISURA">
                                    <i class="fas fa-exclamation-triangle"></i>
                                    <span>Fisura</span>
                                </div>
                                <div class="option-button" data-value="FRACTURA">
                                    <i class="fas fa-times-circle"></i>
                                    <span>Fractura</span>
                                </div>
                                <div class="option-button" data-value="RECONSTRUCCION">
                                    <i class="fas fa-tools"></i>
                                    <span>Reconstrucción</span>
                                </div>
                                <div class="option-button" data-value="ADAPTACION">
                                    <i class="fas fa-cogs"></i>
                                    <span>Adaptación</span>
                                </div>
                                <div class="option-button" data-value="OTROS">
                                    <i class="fas fa-ellipsis-h"></i>
                                    <span>Otros</span>
                                </div>
                            </div>
                            <input type="hidden" id="tipoReparacion" name="tipoReparacion" required>
                            <div class="invalid-feedback">Por favor, selecciona un tipo de reparación.</div>
                        </div>

                        <!-- Repair Type Description -->
                        <div class="repair-type-description" id="repairTypeDescription" style="display: none;">
                            <h6><i class="fas fa-info-circle"></i> Chequeo Estructural</h6>
                            <p>Inspección completa del cuadro para detectar posibles daños estructurales, fisuras internas o debilidades que puedan comprometer la seguridad de la bicicleta.</p>
                        </div>

                        <div class="row mb-3" id="otrosContainer" style="display: none;">
                            <div class="col-12">
                                <div class="form-group">
                                    <label for="descripcionOtros" class="form-label">
                                        <i class="fas fa-comment"></i>
                                        Descripción de Otros
                                    </label>
                                    <textarea class="form-control" id="descripcionOtros" rows="3"></textarea>
                                </div>
                            </div>
                        </div>

                        <!-- Photo Guide -->
                        <div class="photo-guide">
                            <h5><i class="fas fa-camera"></i> Guía para subir fotos correctamente</h5>
                            <p>Para una evaluación precisa, por favor sube fotos claras de las siguientes áreas del cuadro:</p>
                            <small class="text-muted">Haz clic en las imágenes para verlas en tamaño completo</small>

                            <div class="photo-guide-grid">
                                <div class="photo-guide-item">
                                    <img src="../../recursos/img/Frontal.jpg" alt="Vista Frontal" class="photo-guide-image" data-bs-toggle="modal" data-bs-target="#imageModal" data-src="../../recursos/img/Frontal.jpg" data-title="Vista Frontal">
                                    <h6>Vista Frontal</h6>
                                    <p>Toma una foto de frente al cuadro, mostrando el tubo principal y el tubo del sillín</p>
                                </div>
                                <div class="photo-guide-item">
                                    <img src="../../recursos/img/Lateral.jpg" alt="Vista Lateral" class="photo-guide-image" data-bs-toggle="modal" data-bs-target="#imageModal" data-src="../../recursos/img/Lateral.jpg" data-title="Vista Lateral">
                                    <h6>Vista Lateral</h6>
                                    <p>Fotografía del lado derecho e izquierdo del cuadro para ver daños laterales</p>
                                </div>
                                <div class="photo-guide-item">
                                    <img src="../../recursos/img/Superior.jpg" alt="Vista Superior" class="photo-guide-image" data-bs-toggle="modal" data-bs-target="#imageModal" data-src="../../recursos/img/Superior.jpg" data-title="Vista Superior">
                                    <h6>Vista Superior</h6>
                                    <p>Desde arriba para apreciar la forma y posibles deformaciones</p>
                                </div>
                                <div class="photo-guide-item">
                                    <img src="../../recursos/img/Infeior.jpg" alt="Vista Inferior" class="photo-guide-image" data-bs-toggle="modal" data-bs-target="#imageModal" data-src="../../recursos/img/Infeior.jpg" data-title="Vista Inferior">
                                    <h6>Vista Inferior</h6>
                                    <p>Parte inferior del cuadro, especialmente la zona del pedalier</p>
                                </div>
                                <div class="photo-guide-item">
                                    <img src="../../recursos/img/Primer plano.jpg" alt="Primer Plano" class="photo-guide-image" data-bs-toggle="modal" data-bs-target="#imageModal" data-src="../../recursos/img/Primer plano.jpg" data-title="Primer Plano">
                                    <h6>Primer Plano</h6>
                                    <p>Fotos cercanas del área dañada para ver detalles de la fisura o fractura</p>
                                </div>
                            </div>
                        </div>

                        <!-- Image Modal -->
                        <div class="modal fade" id="imageModal" tabindex="-1" aria-labelledby="imageModalLabel" aria-hidden="true">
                            <div class="modal-dialog modal-lg modal-dialog-centered">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="imageModalLabel">Vista de Imagen</h5>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body text-center">
                                        <img id="modalImage" src="" alt="" class="img-fluid rounded">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label" style="font-size: 1.1rem; font-weight: 600; color: var(--primary-color);">
                                <i class="fas fa-images"></i>
                                📸 Imágenes de la Bicicleta (Máximo 10) *
                            </label>
                            <div class="image-upload-container">
                                <i class="fas fa-cloud-upload-alt fa-3x mb-3 text-muted"></i>
                                <p class="mb-2">Haz clic para subir imágenes o arrastra y suelta aquí</p>
                                <p class="text-muted small">Se deben ver claramente la fractura y el cuadro de la bicicleta</p>
                                <input type="file" id="imagenInput" multiple accept="image/*" style="display: none;">
                                <button type="button" class="btn btn-outline-primary" id="uploadBtn">Seleccionar Imágenes</button>
                            </div>
                            <div class="image-preview" id="imagePreview"></div>
                            <div class="invalid-feedback">Por favor, sube al menos una imagen.</div>
                        </div>

                        <!-- Piezas que el cliente enviará -->
                        <div class="form-group">
                            <label class="form-label" style="font-size: 1.1rem; font-weight: 600; color: var(--primary-color);">
                                <i class="fas fa-tools"></i>
                                🛠️ Piezas que enviarás con la bicicleta
                            </label>
                            <small class="text-muted" style="font-size: 0.9rem;">Opcional: Especifica las piezas adicionales que enviarás para facilitar la reparación.</small>

                            <div id="piezasContainer" style="margin-top: 15px;">
                                <!-- Las filas de piezas se agregarán aquí dinámicamente -->
                            </div>

                            <button type="button" class="btn btn-success mt-3" id="agregarPiezaBtn" style="font-size: 1rem; padding: 10px 20px;">
                                <i class="fas fa-plus-circle"></i> <strong>Agregar Pieza</strong>
                            </button>
                        </div>

                        <!-- Requisitos de Envío -->
                        <div class="requisitos-envio-section mt-4">
                            <div class="alert alert-dark border-0 shadow-sm" style="background: linear-gradient(135deg, #000000 0%, #333333 100%); color: white; border-radius: 15px;">
                                <div class="d-flex align-items-center justify-content-center flex-wrap gap-3">
                                    <i class="fas fa-exclamation-triangle fa-2x" style="color: #ffcc00;"></i>
                                    <div class="text-center">
                                        <h5 class="mb-2 fw-bold">IMPORTANTE PARA ENVIO</h5>
                                        <p class="mb-0 small">Selecciona el tipo de servicio para ver los requisitos</p>
                                    </div>
                                </div>
                                <div class="requisitos-buttons mt-3">
                                    <button type="button" class="requisito-btn btn-piezas" data-bs-toggle="modal" data-bs-target="#modalPiezas">
                                        <i class="fas fa-tools"></i>
                                        <span>Piezas</span>
                                    </button>
                                    <button type="button" class="requisito-btn btn-rines" data-bs-toggle="modal" data-bs-target="#modalRin">
                                        <i class="fas fa-circle"></i>
                                        <span>Rines</span>
                                    </button>
                                    <button type="button" class="requisito-btn btn-pintura" data-bs-toggle="modal" data-bs-target="#modalPintura">
                                        <i class="fas fa-paint-brush"></i>
                                        <span>Pintura</span>
                                    </button>
                                    <button type="button" class="requisito-btn btn-fabrica" data-bs-toggle="modal" data-bs-target="#modalFabrica">
                                        <i class="fas fa-industry"></i>
                                        <span>Fábrica</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Enhanced Ficha Técnica -->
                        <div class="ficha-tecnica">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <h5><i class="fas fa-file-alt"></i> Confirmar Ficha Técnica</h5>
                                <button type="button" class="btn btn-outline-primary btn-sm ver-todas-fichas" title="Ver todas las fichas técnicas">
                                    <i class="fas fa-list"></i> Ver Todas
                                </button>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <label><i class="fas fa-calendar"></i> Fecha:</label>
                                    <p id="fichaFecha">--/--/----</p>
                                </div>
                                <div class="col-md-6">
                                    <label><i class="fas fa-user"></i> Nombre:</label>
                                    <p id="fichaNombre">--</p>
                                </div>
                                <div class="col-md-6">
                                    <label><i class="fas fa-tag"></i> Marca:</label>
                                    <p id="fichaMarca">--</p>
                                </div>
                                <div class="col-md-6">
                                    <label><i class="fas fa-bicycle"></i> Modelo:</label>
                                    <p id="fichaModelo">--</p>
                                </div>
                                <div class="col-md-6">
                                    <label><i class="fas fa-phone"></i> Teléfono:</label>
                                    <p id="fichaTelefono">--</p>
                                </div>
                                <div class="col-md-6">
                                    <label><i class="fas fa-tools"></i> Tipo de Reparación:</label>
                                    <p id="fichaTipoReparacion">--</p>
                                </div>
                                <div class="col-12">
                                    <label><i class="fas fa-exclamation-triangle"></i> Observaciones:</label>
                                    <p id="fichaObservaciones">--</p>
                                </div>
                                <div class="col-12">
                                    <label><i class="fas fa-tools"></i> Piezas Enviadas:</label>
                                    <p id="fichaPiezas">--</p>
                                </div>
                            </div>
                        </div>

                        <div class="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                            <button type="button" class="btn btn-outline-primary me-md-2" id="resetBtn">
                                <i class="fas fa-redo me-2"></i>Limpiar Formulario
                            </button>
                            <button type="submit" class="btn btn-primary" id="submitBtn">
                                <i class="fas fa-paper-plane me-2"></i>Crear Servicio
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- Clientes Section -->
        <div class="content-section" id="clientes-section">
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
                    <input type="text" id="buscadorClientes" placeholder="&#128269; Buscar clientes por nombre, código, email, teléfono..." onkeyup="filtrarClientes()">
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
                <table id="clientesTable">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Cliente</th>
                            <th>Teléfono</th>
                            <th>Ubicación</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="clientesTableBody"></tbody>
                </table>
            </div>
        </div>

        <!-- Chat Section -->
        <div class="content-section" id="chat-section">
            <div class="section-header">
                <h3 class="section-title" style="font-size: 1.2rem; font-weight: bold;">CHAT CON CLIENTES - TOTAL CARBON</h3>
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
                        <input type="text" id="buscadorConversaciones" placeholder="Buscar conversaciones o clientes nuevos" onkeyup="filtrarConversaciones()">
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

                    <div class="chat-input" id="chatInput">
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

        <!-- Piezas Section -->
        <?php include 'piezas.php'; ?>

        <!-- Proveedores Section -->
        <?php include 'proveedores.php'; ?>

        <!-- Garantías Section -->
        <?php include 'garantias.php'; ?>

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
                            <label for="cliente_correo">Correo Electrónico *</label>
                            <input type="email" id="cliente_correo" class="form-control" required>
                            <span class="error-message"></span>
                        </div>
                        <div class="form-group">
                            <label for="cliente_telefono">Teléfono</label>
                            <input type="tel" id="cliente_telefono" class="form-control">
                            <span class="error-message"></span>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="cliente_direccion">Dirección</label>
                            <input type="text" id="cliente_direccion" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="cliente_ciudad">Ciudad</label>
                            <input type="text" id="cliente_ciudad" class="form-control">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="cliente_estado">Estado</label>
                            <input type="text" id="cliente_estado" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="cliente_estado_usuario">Estado del Usuario *</label>
                            <select id="cliente_estado_usuario" class="form-control" required>
                                <option value="1">Activo</option>
                                <option value="0">Inactivo</option>
                            </select>
                            <span class="error-message"></span>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="cliente_contrasena">Contraseña *</label>
                            <input type="password" id="cliente_contrasena" class="form-control" required>
                            <span class="error-message"></span>
                        </div>
                        <div class="form-group">
                            <label for="cliente_confirmar_contrasena">Confirmar Contraseña *</label>
                            <input type="password" id="cliente_confirmar_contrasena" class="form-control" required>
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

    <!-- Income/Expense Modal -->
    <div class="modal" id="incomeExpenseModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="incomeExpenseModalTitle">Nuevo Registro de Ingreso/Salida</h3>
                <button class="modal-close" onclick="closeIncomeExpenseModal()">&times;</button>
            </div>
            <div class="modal-body">
                <form id="incomeExpenseForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="concepto">Concepto *</label>
                            <input type="text" id="concepto" class="form-control" placeholder="Ej: Reparación de bicicleta, Venta de accesorios" required>
                            <span class="error-message"></span>
                        </div>
                        <div class="form-group">
                            <label for="ingreso_tipo">Tipo *</label>
                            <select id="ingreso_tipo" class="form-control" required>
                                <option value="">Seleccionar tipo</option>
                                <option value="INGRESO">Ingreso</option>
                                <option value="SALIDA">Salida</option>
                            </select>
                            <span class="error-message"></span>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="monto">Monto *</label>
                            <input type="number" id="monto" class="form-control" placeholder="0.00" step="0.01" min="0" required>
                            <span class="error-message"></span>
                        </div>
                        <div class="form-group">
                            <label for="fecha">Fecha *</label>
                            <input type="date" id="fecha" class="form-control" required>
                            <span class="error-message"></span>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group full-width">
                            <label for="descripcion_ingreso">Descripción</label>
                            <textarea id="descripcion_ingreso" class="form-control" placeholder="Descripción opcional del registro" rows="3"></textarea>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline" onclick="closeIncomeExpenseModal()">Cancelar</button>
                <button type="button" class="btn btn-primary" id="incomeExpenseSaveBtn" onclick="saveIncomeExpense()">
                    <i class="fas fa-save"></i>
                    <span>Guardar Registro</span>
                </button>
            </div>
        </div>
    </div>

    <!-- Chat Floating Button -->
    <button class="chat-floating-btn" id="chatFloatingBtn" onclick="abrirChatFlotante()" style="display: none;">
        <i class="fas fa-comments"></i>
        <span class="chat-notification-badge" id="chatNotificationBadge" style="display: none;"></span>
    </button>

    <!-- Modales para Requisitos de Envío -->
    <!-- Modal para Envío de Piezas -->
    <div class="modal fade" id="modalPiezas" tabindex="-1" aria-labelledby="modalPiezasLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content" style="border: none; border-radius: 15px; box-shadow: 0 15px 40px rgba(0,0,0,0.4);">
                <div class="modal-header" style="background: linear-gradient(135deg, #007bff 0%, #0056b3 100%); color: white; border-radius: 15px 15px 0 0; border-bottom: none;">
                    <h5 class="modal-title fw-bold" id="modalPiezasLabel">
                        <i class="fas fa-tools me-2"></i>Requisitos para enviar piezas a reparación
                    </h5>
                    <button type="button" class="btn-close btn-close-white btn-close-large" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" style="background: #f8f9fa; padding: 30px;">
                    <div class="alert alert-warning border-0 mb-4" style="background: #fff3cd; border-radius: 10px; border-left: 4px solid #ffc107;">
                        <i class="fas fa-exclamation-triangle me-2 text-warning"></i>
                        <strong>Por favor, LEE CON ATENCIÓN</strong>
                    </div>

                    <div class="requisitos-list">
                        <div class="requisito-item mb-3 p-3 bg-white rounded shadow-sm">
                            <div class="d-flex align-items-start">
                                <span class="badge bg-primary me-3 mt-1" style="min-width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; font-weight: bold;">1</span>
                                <div>
                                    <p class="mb-0 fw-semibold">Enviar cuadro/pieza desmontado y limpio.</p>
                                    <small class="text-muted">No enviar ninguna pieza que no se repare y que se puede extraviar. Enviar sin cableado interno.</small>
                                </div>
                            </div>
                        </div>

                        <div class="requisito-item mb-3 p-3 bg-white rounded shadow-sm">
                            <div class="d-flex align-items-start">
                                <span class="badge bg-primary me-3 mt-1" style="min-width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; font-weight: bold;">2</span>
                                <div>
                                    <p class="mb-0 fw-semibold">Indicar la zona dañada con masking tape y plumón.</p>
                                </div>
                            </div>
                        </div>

                        <div class="requisito-item mb-3 p-3 bg-white rounded shadow-sm">
                            <div class="d-flex align-items-start">
                                <span class="badge bg-primary me-3 mt-1" style="min-width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; font-weight: bold;">3</span>
                                <div>
                                    <p class="mb-0 fw-semibold">Escribir nombre de propietario y telefono en cuadro/pieza con masking tape o en una hoja a parte.</p>
                                </div>
                            </div>
                        </div>

                        <div class="requisito-item mb-3 p-3 bg-white rounded shadow-sm">
                            <div class="d-flex align-items-start">
                                <span class="badge bg-primary me-3 mt-1" style="min-width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; font-weight: bold;">4</span>
                                <div>
                                    <p class="mb-0 fw-semibold">Empacar con suficiente protección y muy importante sobre todo en esquinas y que sea en caja de cartón rigido.</p>
                                    <small class="text-muted"><i class="fas fa-box me-1"></i>Eje trasero puesto para que no se cierren las vainas tras estibar en paqueteria.</small>
                                </div>
                            </div>
                        </div>

                        <div class="requisito-item mb-3 p-3 bg-white rounded shadow-sm">
                            <div class="d-flex align-items-start">
                                <span class="badge bg-primary me-3 mt-1" style="min-width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; font-weight: bold;">5</span>
                                <div>
                                    <p class="mb-0 fw-semibold">Para reconstrucción de puntera enviar hanger anterior y nuevo ( o buen estado ).</p>
                                </div>
                            </div>
                        </div>

                        <div class="requisito-item mb-3 p-3 bg-white rounded shadow-sm">
                            <div class="d-flex align-items-start">
                                <span class="badge bg-primary me-3 mt-1" style="min-width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; font-weight: bold;">6</span>
                                <div>
                                    <p class="mb-0 fw-semibold">Daño en BBracket enviar juego completo de baleros anteriores y si se van a cambiar tambien los nuevos, y por último pressfit.</p>
                                    <small class="text-muted">( no aplica en caso bottom bracket BSA )</small>
                                </div>
                            </div>
                        </div>

                        <div class="requisito-item mb-3 p-3 bg-white rounded shadow-sm">
                            <div class="d-flex align-items-start">
                                <span class="badge bg-primary me-3 mt-1" style="min-width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; font-weight: bold;">7</span>
                                <div>
                                    <p class="mb-0 fw-semibold">Daño en básculante enviar con eje trasero puesto.</p>
                                </div>
                            </div>
                        </div>

                        <div class="requisito-item mb-3 p-3 bg-white rounded shadow-sm">
                            <div class="d-flex align-items-start">
                                <span class="badge bg-primary me-3 mt-1" style="min-width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; font-weight: bold;">8</span>
                                <div>
                                    <p class="mb-0 fw-semibold">Daño en tubo de tijera enviar potencia.</p>
                                </div>
                            </div>
                        </div>

                        <div class="requisito-item mb-3 p-3 bg-white rounded shadow-sm">
                            <div class="d-flex align-items-start">
                                <span class="badge bg-primary me-3 mt-1" style="min-width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; font-weight: bold;">9</span>
                                <div>
                                    <p class="mb-0 fw-semibold">El envio de ida NO puede ser por MexPost o Envia ya que no entregan a domicilio.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="alert alert-info border-0 mt-4" style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border-radius: 10px;">
                        <i class="fas fa-clock me-2 text-info"></i>
                        <strong>Reparación Express:</strong> Si necesitas una reparación express pregúntanos por la disponibilidad en la semana que lo envías y anexa con una hojita "Express" (costo adicional)
                    </div>

                    <hr style="border: 1px solid #dee2e6; margin: 30px 0;">

                    <div class="datos-envio">
                        <h6 class="fw-bold mb-3" style="color: #333;"><i class="fas fa-map-marker-alt me-2 text-danger"></i>Datos de recepción de piezas:</h6>
                        <div class="bg-white p-3 rounded shadow-sm">
                            <p class="mb-1"><strong>David Parra Garcia</strong></p>
                            <p class="mb-1">Calle Estado de Chiapas #1</p>
                            <p class="mb-1">Col Centro CP 74000</p>
                            <p class="mb-1">San Martín Texmelucan Puebla</p>
                            <p class="mb-1"><i class="fas fa-envelope me-2 text-primary"></i>email: totalcarbonmx@gmail.com</p>
                            <p class="mb-1"><i class="fas fa-id-card me-2 text-primary"></i>RFC PAGM920420M74</p>
                            <p class="mb-0"><i class="fas fa-store me-2 text-success"></i>Referencias: "tienda bicicletas The Road"</p>
                            <p class="mb-0"><i class="fas fa-phone me-2 text-success"></i>Cel 2482263605</p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer" style="background: #f8f9fa; border-top: 1px solid #dee2e6; border-radius: 0 0 15px 15px;">
                    <button type="button" class="btn btn-primary fw-bold" data-bs-dismiss="modal" style="border-radius: 10px;">
                        <i class="fas fa-times me-2"></i>Cerrar
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal para Envío de Rin -->
    <div class="modal fade" id="modalRin" tabindex="-1" aria-labelledby="modalRinLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content" style="border: none; border-radius: 15px; box-shadow: 0 15px 40px rgba(0,0,0,0.4);">
                <div class="modal-header" style="background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%); color: white; border-radius: 15px 15px 0 0; border-bottom: none;">
                    <h5 class="modal-title fw-bold" id="modalRinLabel">
                        <i class="fas fa-circle me-2"></i>Requisitos para enviar rin a reparación
                    </h5>
                    <button type="button" class="btn-close btn-close-white btn-close-large" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" style="background: #f8f9fa; padding: 30px;">
                    <div class="alert alert-warning border-0 mb-4" style="background: #fff3cd; border-radius: 10px; border-left: 4px solid #ffc107;">
                        <i class="fas fa-exclamation-triangle me-2 text-warning"></i>
                        <strong>Por favor, LEE CON ATENCIÓN</strong>
                    </div>

                    <div class="requisitos-list">
                        <div class="requisito-item mb-3 p-3 bg-white rounded shadow-sm">
                            <div class="d-flex align-items-start">
                                <span class="badge bg-success me-3 mt-1" style="min-width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; font-weight: bold;">1</span>
                                <div>
                                    <p class="mb-0 fw-semibold">Escribir nombre y número de teléfono y pegarlo con cinta azul en el rin.</p>
                                </div>
                            </div>
                        </div>

                        <div class="requisito-item mb-3 p-3 bg-white rounded shadow-sm">
                            <div class="d-flex align-items-start">
                                <span class="badge bg-success me-3 mt-1" style="min-width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; font-weight: bold;">2</span>
                                <div>
                                    <p class="mb-0 fw-semibold">Enviar rin, con RAYOS SIN TENSION, Sin llanta, Sin Eje, Sin cassette, Sin disco.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr style="border: 1px solid #dee2e6; margin: 30px 0;">

                    <div class="datos-envio">
                        <h6 class="fw-bold mb-3" style="color: #333;"><i class="fas fa-map-marker-alt me-2 text-danger"></i>Dirección de envio en caso de paquetería:</h6>
                        <div class="bg-white p-3 rounded shadow-sm">
                            <p class="mb-1"><strong>David Parra Garcia</strong></p>
                            <p class="mb-1">Calle Estado de Chiapas #1</p>
                            <p class="mb-1">Colonia: Centro, CP 74000</p>
                            <p class="mb-1">San Martín Texmelucan</p>
                            <p class="mb-1">Puebla</p>
                            <p class="mb-1"><i class="fas fa-id-card me-2 text-primary"></i>Rfc: PAGM920420M74</p>
                            <p class="mb-0"><i class="fas fa-store me-2 text-success"></i>Referencias: "tienda bicicleta, en frente de Total Training"</p>
                            <p class="mb-0"><i class="fas fa-phone me-2 text-success"></i>Cel 2482263605</p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer" style="background: #f8f9fa; border-top: 1px solid #dee2e6; border-radius: 0 0 15px 15px;">
                    <button type="button" class="btn btn-success fw-bold" data-bs-dismiss="modal" style="border-radius: 10px;">
                        <i class="fas fa-times me-2"></i>Cerrar
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal para Envío de Pintura -->
    <div class="modal fade" id="modalPintura" tabindex="-1" aria-labelledby="modalPinturaLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content" style="border: none; border-radius: 15px; box-shadow: 0 15px 40px rgba(0,0,0,0.4);">
                <div class="modal-header" style="background: linear-gradient(135deg, #fd7e14 0%, #e8680d 100%); color: white; border-radius: 15px 15px 0 0; border-bottom: none;">
                    <h5 class="modal-title fw-bold" id="modalPinturaLabel">
                        <i class="fas fa-paint-brush me-2"></i>Requisitos para enviar pieza a pintura
                    </h5>
                    <button type="button" class="btn-close btn-close-white btn-close-large" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" style="background: #f8f9fa; padding: 30px;">
                    <div class="alert alert-success border-0 mb-4" style="background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%); border-radius: 10px; border-left: 4px solid #28a745;">
                        <i class="fas fa-palette me-2 text-success"></i>
                        <strong>Estamos listos para darle nueva vida a tu bici!!</strong>
                    </div>

                    <div class="requisitos-list">
                        <div class="requisito-item mb-3 p-3 bg-white rounded shadow-sm">
                            <div class="d-flex align-items-start">
                                <span class="badge bg-warning me-3 mt-1" style="min-width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; font-weight: bold;">1</span>
                                <div>
                                    <p class="mb-0 fw-semibold">Enviar cuadro/pieza desmontado COMPLETAMENTE.</p>
                                </div>
                            </div>
                        </div>

                        <div class="requisito-item mb-3 p-3 bg-white rounded shadow-sm">
                            <div class="d-flex align-items-start">
                                <span class="badge bg-warning me-3 mt-1" style="min-width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; font-weight: bold;">2</span>
                                <div>
                                    <p class="mb-0 fw-semibold">No enviar piezas que no se van a pintar (pata de desviador, tapas, tornillos etc.)</p>
                                    <small class="text-muted">eso para evitar extravíos de las piezas por las que no podemos hacernos responsables.</small>
                                </div>
                            </div>
                        </div>

                        <div class="requisito-item mb-3 p-3 bg-white rounded shadow-sm">
                            <div class="d-flex align-items-start">
                                <span class="badge bg-warning me-3 mt-1" style="min-width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; font-weight: bold;">3</span>
                                <div>
                                    <p class="mb-0 fw-semibold">Escribir nombre de propietario y telefono en cuadro/pieza con masking tape.</p>
                                </div>
                            </div>
                        </div>

                        <div class="requisito-item mb-3 p-3 bg-white rounded shadow-sm">
                            <div class="d-flex align-items-start">
                                <span class="badge bg-warning me-3 mt-1" style="min-width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; font-weight: bold;">4</span>
                                <div>
                                    <p class="mb-0 fw-semibold">Empacar con suficiente protección y de preferencia en caja.</p>
                                </div>
                            </div>
                        </div>

                        <div class="requisito-item mb-3 p-3 bg-white rounded shadow-sm">
                            <div class="d-flex align-items-start">
                                <span class="badge bg-warning me-3 mt-1" style="min-width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; font-weight: bold;">5</span>
                                <div>
                                    <p class="mb-0 fw-semibold">Utilizar un separador en la zona de eje trasero para dar soporte y evitar posibles daños en traslado (si es cuadro)</p>
                                </div>
                            </div>
                        </div>

                        <div class="requisito-item mb-3 p-3 bg-white rounded shadow-sm">
                            <div class="d-flex align-items-start">
                                <span class="badge bg-warning me-3 mt-1" style="min-width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; font-weight: bold;">6</span>
                                <div>
                                    <p class="mb-0 fw-semibold">el paquete NO tiene que medir mas de 105 cm de largo, 25 de alto y 70 de ancho.</p>
                                    <small class="text-muted">El paquete tiene que estar en caja. De lo contrario se cobrará costo de caja en el envío de regreso.</small>
                                </div>
                            </div>
                        </div>

                        <div class="requisito-item mb-3 p-3 bg-white rounded shadow-sm">
                            <div class="d-flex align-items-start">
                                <span class="badge bg-warning me-3 mt-1" style="min-width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; font-weight: bold;">7</span>
                                <div>
                                    <p class="mb-0 fw-semibold">Si cuenta con una muestra física del color favor de anexarla a la caja, ya que es la unica forma de igualar 100%.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="alert alert-info border-0 mt-4" style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border-radius: 10px;">
                        <i class="fas fa-info-circle me-2 text-info"></i>
                        <strong>Información adicional:</strong><br>
                        Suspensión: enviar pieza sin baleros y sin botellas<br>
                        Rines: Sin rayos ni piezas adicionales
                    </div>

                    <div class="alert alert-warning border-0 mt-3" style="background: #fff3cd; border-radius: 10px;">
                        <i class="fas fa-search me-2 text-warning"></i>
                        <strong>Te recordamos que haremos un chequeo Estructural a tu cuadro, en caso de encontrar algún daño se le hará saber</strong>
                    </div>

                    <hr style="border: 1px solid #dee2e6; margin: 30px 0;">

                    <div class="datos-envio">
                        <h6 class="fw-bold mb-3" style="color: #333;"><i class="fas fa-map-marker-alt me-2 text-danger"></i>Datos de recepción de piezas:</h6>
                        <div class="bg-white p-3 rounded shadow-sm">
                            <p class="mb-1"><strong>David Parra Garcia</strong></p>
                            <p class="mb-1">Calle Estado de Chiapas #1</p>
                            <p class="mb-1">Col Centro CP 74000</p>
                            <p class="mb-1">San Martín Texmelucan</p>
                            <p class="mb-1">Puebla</p>
                            <p class="mb-0"><i class="fas fa-store me-2 text-success"></i>Referencias: "tienda bicicletas The Road"</p>
                            <p class="mb-0"><i class="fas fa-phone me-2 text-success"></i>Cel 2482263605</p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer" style="background: #f8f9fa; border-top: 1px solid #dee2e6; border-radius: 0 0 15px 15px;">
                    <button type="button" class="btn btn-warning fw-bold" data-bs-dismiss="modal" style="border-radius: 10px;">
                        <i class="fas fa-times me-2"></i>Cerrar
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal para Recoger en Fábrica -->
    <div class="modal fade" id="modalFabrica" tabindex="-1" aria-labelledby="modalFabricaLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content" style="border: none; border-radius: 15px; box-shadow: 0 15px 40px rgba(0,0,0,0.4);">
                <div class="modal-header" style="background: linear-gradient(135deg, #6f42c1 0%, #5a32a3 100%); color: white; border-radius: 15px 15px 0 0; border-bottom: none;">
                    <h5 class="modal-title fw-bold" id="modalFabricaLabel">
                        <i class="fas fa-industry me-2"></i>Requisitos para recoger en fábrica
                    </h5>
                    <button type="button" class="btn-close btn-close-white btn-close-large" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" style="background: #f8f9fa; padding: 30px;">
                    <div class="alert alert-primary border-0 mb-4" style="background: linear-gradient(135deg, #cce5ff 0%, #b3d7ff 100%); border-radius: 10px; border-left: 4px solid #007bff;">
                        <i class="fas fa-industry me-2 text-primary"></i>
                        <strong>Total Carbon Fabrica</strong>
                    </div>

                    <div class="requisitos-list">
                        <div class="requisito-item mb-3 p-3 bg-white rounded shadow-sm">
                            <div class="d-flex align-items-start">
                                <span class="badge bg-primary me-3 mt-1" style="min-width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; font-weight: bold;">1</span>
                                <div>
                                    <p class="mb-0 fw-semibold"><strong>Para Rin:</strong> Traer rin, con RAYOS SIN TENSION, Sin llanta, Sin Eje, Sin cassette, Sin disco</p>
                                </div>
                            </div>
                        </div>

                        <div class="requisito-item mb-3 p-3 bg-white rounded shadow-sm">
                            <div class="d-flex align-items-start">
                                <span class="badge bg-primary me-3 mt-1" style="min-width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; font-weight: bold;">2</span>
                                <div>
                                    <p class="mb-0 fw-semibold"><strong>Para Pintura:</strong> Traer cuadro/pieza desmontado COMPLETAMENTE.</p>
                                    <small class="text-muted">No enviar piezas que no se van a pintar (pata de desviador, tapas, tornillos etc.) para evitar extravíos de las piezas por las que no podemos hacernos responsables.</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="alert alert-info border-0 mt-4" style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border-radius: 10px;">
                        <i class="fas fa-clock me-2 text-info"></i>
                        <strong>Horario de lunes a viernes</strong><br>
                        8 am a 11.15am<br>
                        12.30 a 16.30<br>
                        <small class="text-muted">Nota: 11,30 a 12,30 Estamos en nuestro horario de comida</small><br><br>
                        <strong>Sábado:</strong> de 8am a 9,30 y de 10,30 a 2pm
                    </div>

                    <div class="alert alert-warning border-0 mt-3" style="background: #fff3cd; border-radius: 10px;">
                        <i class="fas fa-exclamation-triangle me-2 text-warning"></i>
                        <strong>Información importante:</strong><br>
                        La fábrica está en una privada sin embargo te pedimos no cerrar la entrada estacionandose, mejor busca un lugar en la calle principal (como referencia un Kinder o un OXXO). No hay letreros<br><br>
                        <strong>Cita necesaria:</strong> avisar un dia antes el posible horario de llegada<br>
                        <strong>Llamar al llegar:</strong> <a href="tel:2482263605" class="text-decoration-none fw-bold">248 226 3605</a>
                    </div>

                    <hr style="border: 1px solid #dee2e6; margin: 30px 0;">

                    <div class="datos-envio">
                        <h6 class="fw-bold mb-3" style="color: #333;"><i class="fas fa-map-marker-alt me-2 text-danger"></i>Ubicación de la Fábrica:</h6>
                        <div class="bg-white p-3 rounded shadow-sm">
                            <p class="mb-1"><strong>David Parra</strong></p>
                            <p class="mb-1">Priv niños heroes 2</p>
                            <p class="mb-1">Col tlanalapan</p>
                            <p class="mb-1">Cp 74122</p>
                            <p class="mb-1">San Martín Texmelucan Puebla</p>
                            <p class="mb-0"><a href="https://maps.app.goo.gl/DjjrEH4NkMkiKhey5" target="_blank" class="text-decoration-none">
                                <i class="fas fa-external-link-alt me-2 text-primary"></i>Ver ubicación en Maps
                            </a></p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer" style="background: #f8f9fa; border-top: 1px solid #dee2e6; border-radius: 0 0 15px 15px;">
                    <button type="button" class="btn btn-primary fw-bold" data-bs-dismiss="modal" style="border-radius: 10px;">
                        <i class="fas fa-times me-2"></i>Cerrar
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.23/jspdf.plugin.autotable.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link href="https://unpkg.com/gridjs/dist/theme/mermaid.min.css" rel="stylesheet" />
    <script src="https://unpkg.com/gridjs/dist/gridjs.umd.js"></script>
    <script src="../../recursos/js/Administrador/administrador.js?v=<?php echo time(); ?>"></script>
    <script src="../../recursos/js/Administrador/proveedores.js?v=<?php echo time(); ?>"></script>
    <script src="../../recursos/js/Administrador/garantias.js?v=<?php echo time(); ?>"></script>
    <script src="../../recursos/js/Administrador/clientes.js?v=<?php echo time(); ?>"></script>
    <script src="../../recursos/js/Administrador/cotizaciones_admin.js?v=<?php echo time(); ?>"></script>
    <script src="../../recursos/js/Administrador/cotizaciones_pendientes.js?v=<?php echo time(); ?>"></script>
    <script src="../../recursos/js/Administrador/nuevo_servicio.js?v=<?php echo time(); ?>"></script>
    <script src="../../recursos/js/Administrador/chat.js?v=<?php echo time(); ?>"></script>
    <script src="../../recursos/js/Administrador/dashboard.js?v=<?php echo time(); ?>"></script>
    <script src="../../recursos/js/Administrador/piezas.js?v=<?php echo time(); ?>"></script>

</body>
</html>
