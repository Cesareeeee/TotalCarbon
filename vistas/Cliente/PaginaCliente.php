<?php
session_start();
// Proteger ruta: requerir sesión iniciada
if (!isset($_SESSION['id_usuario'])) {
    header('Location: ../login.php');
    exit;
}

// Cargar datos del usuario desde sesión o BD
$usuarioNombre = $_SESSION['nombres'] ?? '';
$usuarioApellidos = $_SESSION['apellidos'] ?? '';
$usuarioCorreo = $_SESSION['correo_electronico'] ?? '';
$usuarioTelefono = $_SESSION['numero_telefono'] ?? '';
$usuarioDireccion = $_SESSION['direccion'] ?? '';
$usuarioCiudad = $_SESSION['ciudad'] ?? '';
$usuarioEstado = $_SESSION['estado'] ?? '';
$usuarioCP = $_SESSION['codigo_postal'] ?? '';
$usuarioPais = $_SESSION['pais'] ?? '';
$usuarioFechaNac = $_SESSION['fecha_nacimiento'] ?? '';
$usuarioId = $_SESSION['id_usuario'] ?? 0;
$nombreCompleto = trim($usuarioNombre . ' ' . $usuarioApellidos);
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Total Carbon - Portal de Cliente</title>
    <link rel="icon" href="../../recursos/img/image.png">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
    <link rel="stylesheet" href="../../recursos/css/Cliente/PaginaCliente.css?v=999999999996">
    <link rel="stylesheet" href="../../recursos/css/Cliente/chat_test_cliente.css?v=34333586">

    
    <!-- Estilos adicionales para el botón Actualizar (se integran con el proyecto) -->
    <style>
        /* Botón actualizar: gradiente, sombra y animación para el icono */
        #btnActualizar {
            background: linear-gradient(90deg, #0d6efd 0%, #4dabf7 100%);
            color: #ffffff;
            border: none;
            padding: 6px 12px;
            border-radius: 6px;
            box-shadow: 0 6px 18px rgba(13,110,253,0.18);
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: transform .12s ease, filter .12s ease;
        }
        #btnActualizar:hover { transform: translateY(-2px); filter: brightness(1.03); }
        #btnActualizar:active { transform: translateY(0); }
        #btnActualizar:disabled { opacity: .7; cursor: default; transform: none; }

        /* Icono giratorio mientras refresca */
        #btnActualizar .fa-rotate-right { transition: transform .6s linear; }
        #btnActualizar.refreshing .fa-rotate-right { transform: rotate(360deg); }

        /* Asegura que el overlay de carga se muestre centrado en flex */
        #loadingOverlay { display: none; align-items: center; justify-content: center; }

        /* Botones de decisión para reparaciones */
        .botones-decision-reparaciones {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-top: 20px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
            border: 1px solid #dee2e6;
        }

        .botones-decision-reparaciones .btn {
            padding: 12px 24px;
            font-weight: 600;
            border-radius: 8px;
            transition: all 0.3s ease;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .botones-decision-reparaciones .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }

        .botones-decision-reparaciones .btn-success:hover {
            background-color: #218838;
            border-color: #1e7e34;
        }

        .botones-decision-reparaciones .btn-danger:hover {
            background-color: #c82333;
            border-color: #bd2130;
        }

        /* Notificación de actualización automática */
        .notification.success {
            background-color: #d4edda;
            border-color: #c3e6cb;
            color: #155724;
        }

        .notification.success i {
            color: #28a745;
        }

        /* Estilos para filtros */
        .filter-controls {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .filter-controls .btn-ver-detalles {
            font-size: 0.875rem;
            padding: 6px 12px;
        }

        .filter-controls .form-select {
            min-width: 150px;
            border-radius: 6px;
            border: 1px solid #ced4da;
            font-size: 0.875rem;
        }

        .filter-controls .form-select:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }

        /* Estilos específicos para el botón "Ver Detalles" */
        .btn-ver-detalles {
            background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 0.875rem;
            transition: all 0.3s ease;
            box-shadow: 0 3px 8px rgba(0, 123, 255, 0.3);
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }

        .btn-ver-detalles:hover {
            background: linear-gradient(135deg, #0056b3 0%, #004085 100%);
            transform: translateY(-2px);
            box-shadow: 0 5px 12px rgba(0, 123, 255, 0.4);
            color: white;
        }

        .btn-ver-detalles:active {
            transform: translateY(0);
            box-shadow: 0 2px 6px rgba(0, 123, 255, 0.3);
        }

        .btn-ver-detalles i {
            font-size: 0.8rem;
        }

        .btn-ver-detalles:focus {
            box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
            outline: none;
        }

    </style>
</head>
<body>
    <!-- FAVICON -->
        <link rel="apple-touch-icon" sizes="180x180" href="../../recursos/img/favicon/apple-touch-icon.png">
            
    <!-- Top Bar -->
    <div class="top-bar">
        <div class="top-bar-left">
            <h4 class="mb-0 fw-bold"></h4>
        </div>
        <div class="top-bar-right">
            <button type="button" class="btn btn-outline-primary btn-sm me-3" id="btnActualizar" title="Actualizar" aria-label="Actualizar página">
                <i class="fas fa-rotate-right me-1"></i>
                Actualizar
            </button>
            <div class="notification-bell" id="notificationBell" title="Notificaciones">
                <i class="fas fa-bell fa-lg"></i>
                <span class="notification-badge" id="notificationBadge" style="display:none">0</span>
            </div>
            <div class="profile-icon" id="profileIcon" title="Mi Perfil">
                <img src="../../recursos/img/iconoReg.png" alt="Profile">
            </div>
        </div>
    </div>

    <!-- Sidebar Toggle Button -->
    <button class="sidebar-toggle" id="sidebarToggle">
        <div class="hamburger">
            <span></span>
            <span></span>
            <span></span>
        </div>
    </button>
    <!-- Sidebar Overlay -->
    <div class="sidebar-overlay" id="sidebarOverlay"></div>
    <!-- Sidebar -->
    <aside class="sidebar mobile-hidden" id="sidebar">
        <div class="sidebar-header">
            <img src="../../recursos/img/logo2.png" alt="Total Carbon Logo" class="sidebar-logo">
        </div>
        <ul class="sidebar-menu">
            <li>
                <a href="#" class="menu-item active" data-section="welcome">
                    <i class="fas fa-home"></i>
                    <span>Inicio</span>
                </a>
            </li>
            <li>
                <a href="#" class="menu-item" data-section="cotizacion">
                    <i class="fas fa-plus-circle"></i>
                    <span>Nueva Cotización</span>
                </a>
            </li>
            <li>
                <a href="#" class="menu-item" data-section="proceso">
                    <i class="fas fa-wrench"></i>
                    <span>Servicio en Proceso</span>
                </a>
            </li>
            <li>
                <a href="#" class="menu-item" data-section="ficha-tecnica">
                    <i class="fas fa-file-alt"></i>
                    <span>Fichas Técnicas</span>
                </a>
            </li>
            <li>
                <a href="#" class="menu-item" data-section="garantias">
                    <i class="fas fa-shield-alt"></i>
                    <span>Garantías</span>
                </a>
            </li>
            <li>
                <a href="#" class="menu-item" data-section="chat-soporte">
                    <i class="fas fa-comments"></i>
                    <span>Chat con Soporte</span>
                </a>
            </li>
            <li>
                <a href="#" class="menu-item" data-section="perfil">
                    <i class="fas fa-user"></i>
                    <span>Mi Perfil</span>
                </a>
            </li>
        </ul>
        <div class="sidebar-footer">
            <a href="../../controlador/Cliente/logout.php" id="logoutBtn" style="color: rgba(255, 255, 255, 0.7); text-decoration: none; display: flex; align-items: center; padding: 15px 25px;">
                <i class="fas fa-sign-out-alt" style="width: 24px; margin-right: 15px;"></i>
                <span>Cerrar Sesión</span>
            </a>
        </div>
    </aside>
    <!-- Main Content -->
    <main class="main-content" id="mainContent">
        <!-- Welcome Section -->
        <section class="content-section active" id="welcome">
            <div class="welcome-section">
                <div class="welcome-content">
                    <h1 class="welcome-title">¡Bienvenido, <?php echo htmlspecialchars($nombreCompleto ?: 'Cliente'); ?>!</h1>
                    <p class="welcome-subtitle">Estamos encantados de tenerte de vuelta en Total Carbon</p>
                </div>
            </div>
            <div class="dashboard-cards">
                <a href="#" class="dashboard-card primary" data-section="cotizacion">
                    <i class="fas fa-plus-circle"></i>
                    <h3>Nueva Cotización</h3>
                    <p>Solicita una reparación para tu bicicleta</p>
                </a>
                <a href="#" class="dashboard-card info" data-section="proceso">
                    <i class="fas fa-wrench"></i>
                    <h3>Servicio en Proceso</h3>
                    <p>Revisa el estado de tu reparación actual</p>
                </a>
                <a href="#" class="dashboard-card success" data-section="ficha-tecnica">
                    <i class="fas fa-file-alt"></i>
                    <h3>Fichas Técnicas</h3>
                    <p>Consulta los detalles técnicos de tu bicicleta</p>
                </a>
                <a href="#" class="dashboard-card info" data-section="garantias">
                    <i class="fas fa-shield-alt"></i>
                    <h3>Mis Garantías</h3>
                    <p>Consulta tus garantías activas</p>
                </a>
                <a href="#" class="dashboard-card warning" data-section="chat-soporte">
                    <i class="fas fa-comments"></i>
                    <h3>Chat con Soporte</h3>
                    <p>Contacta a nuestro equipo técnico</p>
                </a>
            </div>
        </section>
        <!-- Cotización Section -->
        <section class="content-section" id="cotizacion">
            <div class="page-header">
                <h1>Nueva Cotización</h1>
                <p>Completa el formulario para solicitar una reparación</p>
            </div>
            <div class="card">
                <div class="card-header">
                    <i class="fas fa-clipboard-list me-2"></i>Solicitud de Cotización - Reparación de Bicicleta
                </div>
                <div class="card-body">
                    <form id="cotizacionForm" novalidate>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <div class="form-group">
                                    <label for="fecha" class="form-label">
                                        <i class="fas fa-calendar"></i>
                                        Fecha
                                    </label>
                                    <input type="text" class="form-control" id="fecha" readonly>
                                </div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <div class="form-group">
                                    <label for="nombre" class="form-label">
                                        <i class="fas fa-user"></i>
                                        Nombre Completo *
                                    </label>
                                    <input type="text" class="form-control" id="nombre" value="<?php echo htmlspecialchars($nombreCompleto); ?>" required>
                                    <div class="invalid-feedback">Por favor, ingresa tu nombre completo.</div>
                                </div>
                            </div>
                        </div>
                       
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <div class="form-group">
                                    <label for="direccion" class="form-label">
                                        <i class="fas fa-map-marker-alt"></i>
                                        Dirección *
                                    </label>
                                    <input type="text" class="form-control" id="direccion" value="<?php echo htmlspecialchars($usuarioDireccion); ?>" required>
                                    <div class="invalid-feedback">Por favor, ingresa tu dirección.</div>
                                </div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <div class="form-group">
                                    <label for="telefono" class="form-label">
                                        <i class="fas fa-phone"></i>
                                        Teléfono *
                                    </label>
                                    <input type="tel" class="form-control" id="telefono" value="<?php echo htmlspecialchars($usuarioTelefono); ?>" required>
                                    <div class="invalid-feedback">Por favor, ingresa tu número de teléfono.</div>
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
                                    <input type="email" class="form-control" id="email" value="<?php echo htmlspecialchars($usuarioCorreo); ?>" required>
                                    <div class="invalid-feedback">Por favor, ingresa un correo electrónico válido.</div>
                                </div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <div class="form-group">
                                    <label for="marca" class="form-label">
                                        <i class="fas fa-tag"></i>
                                        Marca de la Bicicleta *
                                    </label>
                                    <input type="text" class="form-control" id="marca" required>
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
                            <label class="form-label">
                                <i class="fas fa-images"></i>
                                Imágenes de la Bicicleta (Máximo 10) *
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
                       
                        <!-- Enhanced Ficha Técnica -->
                        <div class="ficha-tecnica">
                            <h5><i class="fas fa-file-alt"></i> Ficha Técnica</h5>
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
                            </div>
                        </div>

                        <div class="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                            <button type="button" class="btn btn-outline-primary me-md-2" id="resetBtn">
                                <i class="fas fa-redo me-2"></i>Limpiar Formulario
                            </button>
                            <button type="submit" class="btn btn-primary" id="submitBtn">
                                <i class="fas fa-paper-plane me-2"></i>Enviar Cotización
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
        <!-- Garantías Section -->
        <section class="content-section" id="garantias">
            <div class="page-header">
                <h1>Mis Garantías</h1>
                <p>Consulta tus garantías activas y fechas de vencimiento</p>
            </div>
            <div class="warranty-section">
                <h5><i class="fas fa-shield-alt"></i> Garantías Activas</h5>
               
                <div class="warranty-item">
                    <h6>Reparación de Cuadro - Tracer LILA</h6>
                    <p>Reparación estructural completa con garantía de 6 meses</p>
                    <div class="warranty-dates">
                        <span class="warranty-date">Inicio: 15/01/2025</span>
                        <span class="warranty-date">Fin: 15/07/2025</span>
                    </div>
                    <span class="warranty-status active">Activa</span>
                </div>
               
                <div class="warranty-item">
                    <h6>Pintura Personalizada - INTENSE</h6>
                    <p>Servicio de pintura con garantía de 3 meses</p>
                    <div class="warranty-dates">
                        <span class="warranty-date">Inicio: 01/02/2025</span>
                        <span class="warranty-date">Fin: 01/05/2025</span>
                    </div>
                    <span class="warranty-status expiring">Por vencer</span>
                </div>
               
                <div class="warranty-item">
                    <h6>Reparación de Horquilla - ROCKSHOX</h6>
                    <p>Reparación y mantenimiento con garantía de 12 meses</p>
                    <div class="warranty-dates">
                        <span class="warranty-date">Inicio: 10/12/2025</span>
                        <span class="warranty-date">Fin: 10/12/2025</span>
                    </div>
                    <span class="warranty-status active">Activa</span>
                </div>
            </div>
           
            <div class="card mt-4">
                <div class="card-header">
                    <i class="fas fa-bell me-2"></i>Notificaciones de Mantenimiento
                </div>
                <div class="card-body">
                    <div class="alert alert-danger" role="alert">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        <strong>Recordatorio:</strong> Tu garantía para "Pintura Personalizada - INTENSE" vence en 15 días.
                        <a href="#" class="alert-link">Programa mantenimiento</a>
                    </div>
    
                    <div class="alert alert-warning" role="alert">
                        <i class="fas fa-info-circle me-2"></i>
                        <strong>Información:</strong> Te enviaremos notificaciones 30 días antes del vencimiento de cada garantía.
                    </div>
                </div>
            </div>

            <!-- Modal para detalles de garantía -->
            <div class="modal fade" id="garantiaModal" tabindex="-1" aria-labelledby="garantiaModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="garantiaModalLabel">Detalles de la Garantía</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="card h-100 border-primary">
                                        <div class="card-header bg-primary text-white">
                                            <h6 class="mb-0"><i class="fas fa-user"></i> Usuario</h6>
                                        </div>
                                        <div class="card-body">
                                            <p class="mb-0"><i class="fas fa-user-circle text-primary"></i> <strong>Nombre Completo:</strong> <span id="modalNombreCompleto"></span></p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="card h-100 border-success">
                                        <div class="card-header bg-success text-white">
                                            <h6 class="mb-0"><i class="fas fa-shield-alt"></i> Garantía</h6>
                                        </div>
                                        <div class="card-body">
                                            <p class="mb-2"><i class="fas fa-tag text-success"></i> <strong>Tipo:</strong> <span id="modalTipoGarantia"></span></p>
                                            <p class="mb-2"><i class="fas fa-info-circle text-success"></i> <strong>Cobertura:</strong> <span id="modalCobertura"></span></p>
                                            <p class="mb-2"><i class="fas fa-check-circle text-success"></i> <strong>Estado:</strong> <span id="modalEstado"></span></p>
                                            <p class="mb-2"><i class="fas fa-calendar-plus text-success"></i> <strong>Inicio:</strong> <span id="modalFechaInicio"></span></p>
                                            <p class="mb-0"><i class="fas fa-calendar-times text-success"></i> <strong>Fin:</strong> <span id="modalFechaFin"></span></p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="card h-100 border-info">
                                        <div class="card-header bg-info text-white">
                                            <h6 class="mb-0"><i class="fas fa-bicycle"></i> Bicicleta</h6>
                                        </div>
                                        <div class="card-body">
                                            <p class="mb-2"><i class="fas fa-industry text-info"></i> <strong>Marca:</strong> <span id="modalMarca"></span></p>
                                            <p class="mb-2"><i class="fas fa-cogs text-info"></i> <strong>Modelo:</strong> <span id="modalModelo"></span></p>
                                            <p class="mb-2"><i class="fas fa-map-marker-alt text-info"></i> <strong>Zona Afectada:</strong> <span id="modalZonaAfectada"></span></p>
                                            <p class="mb-2"><i class="fas fa-tools text-info"></i> <strong>Tipo Trabajo:</strong> <span id="modalTipoTrabajo"></span></p>
                                            <p class="mb-0"><i class="fas fa-wrench text-info"></i> <strong>Reparación:</strong> <span id="modalTipoReparacion"></span></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row mt-3">
                                <div class="col-12">
                                    <div class="card border-warning">
                                        <div class="card-header bg-warning text-dark">
                                            <h6 class="mb-0"><i class="fas fa-comment"></i> Descripción Adicional</h6>
                                        </div>
                                        <div class="card-body">
                                            <p class="mb-0"><span id="modalDescripcionOtros">N/A</span></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- Proceso Section -->
        <section class="content-section" id="proceso">
            <div class="page-header">
                <h1>Servicio en Proceso</h1>
                <p>Revisa el estado actual de tus reparaciones</p>
            </div>
            <div class="card">
                <div class="card-header">
                    <div class="d-flex justify-content-between align-items-center">
                        <span><i class="fas fa-wrench me-2"></i>Estado de tus Reparaciones</span>
                        <div class="filter-controls">
                            <select id="filtroEstadoServicios" class="form-select form-select-sm" style="width: auto;">
                                <option value="todos">Todos los Estados</option>
                                <option value="PENDIENTE">Pendiente</option>
                                <option value="APROBADA">Aprobada</option>
                                <option value="RECHAZADA">Rechazada</option>
                                <option value="EN_PROCESO">En Proceso</option>
                                <option value="COMPLETADO">Completado</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <!-- Lista de Servicios en Proceso -->
                    <div id="listaServiciosProceso">
                        <div class="text-center py-5">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">Cargando...</span>
                            </div>
                            <p class="mt-3">Cargando servicios en proceso...</p>
                        </div>
                    </div>

                    <!-- Detalles del Servicio en Proceso -->
                    <div id="detallesServicioProceso">
                        <!-- Contenedor para imágenes del proceso -->
                        <div class="row mt-4" id="statusImagesContainer">
                            <!-- Las imágenes se cargarán aquí dinámicamente -->
                        </div>
                        <!-- Contenedor para comentarios del proceso -->
                        <div class="mt-4" id="statusCommentsContainer">
                            <!-- Los comentarios se cargarán aquí dinámicamente -->
                        </div>
                    </div>

                </div>
            </div>
        </section>
        <!-- Ficha Técnica Section -->
        <section class="content-section" id="ficha-tecnica">
            <div class="page-header">
                <h1>Fichas Técnicas</h1>
                <p>Consulta todos tus trabajos y cotizaciones completadas</p>
            </div>
            <div class="card">
                <div class="card-header">
                    <div class="d-flex justify-content-between align-items-center">
                        <span><i class="fas fa-file-alt me-2"></i>Fichas Técnicas - Historial de Trabajos</span>
                        <div class="filter-controls">
                            <select id="filtroEstadoFichas" class="form-select form-select-sm" style="width: auto;">
                                <option value="todos">Todos los Estados</option>
                                <option value="PENDIENTE">Pendiente</option>
                                <option value="APROBADA">Aprobada</option>
                                <option value="RECHAZADA">Rechazada</option>
                                <option value="EN_PROCESO">En Proceso</option>
                                <option value="COMPLETADO">Completado</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <!-- Lista de Fichas Técnicas -->
                    <div id="listaFichasTecnicas">
                        <div class="text-center py-5">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">Cargando...</span>
                            </div>
                            <p class="mt-3">Cargando fichas técnicas...</p>
                        </div>
                    </div>

                    <!-- Detalles de Ficha Técnica -->
                    <div id="detallesFichaTecnica"></div>
                </div>
            </div>
        </section>
        <!-- Perfil Section -->
        <section class="content-section" id="perfil">
            <div class="page-header">
                <h1>Mi Perfil</h1>
                <p>Consulta y edita tu información personal</p>
            </div>
            <!-- Profile Display -->
            <div class="profile-display" id="profileDisplay">
                <div class="profile-avatar">
                    <img src="../../recursos/img/iconoReg.png" alt="Avatar">
                </div>
               
                <div class="profile-info">
                    <h3>Información Personal</h3>
                    <div class="profile-info-row">
                        <div class="profile-info-label">Nombres:</div>
                        <div class="profile-info-value" id="displayNombres"><?php echo htmlspecialchars($usuarioNombre ?: '--'); ?></div>
                    </div>
                    <div class="profile-info-row">
                        <div class="profile-info-label">Apellidos:</div>
                        <div class="profile-info-value" id="displayApellidos"><?php echo htmlspecialchars($usuarioApellidos ?: '--'); ?></div>
                    </div>
                    <div class="profile-info-row">
                        <div class="profile-info-label">Correo Electrónico:</div>
                        <div class="profile-info-value" id="displayEmail"><?php echo htmlspecialchars($usuarioCorreo ?: '--'); ?></div>
                    </div>
                    <div class="profile-info-row">
                        <div class="profile-info-label">Teléfono:</div>
                        <div class="profile-info-value" id="displayTelefono"><?php echo htmlspecialchars($usuarioTelefono ?: '--'); ?></div>
                    </div>
                    <div class="profile-info-row">
                        <div class="profile-info-label">Dirección:</div>
                        <div class="profile-info-value" id="displayDireccion"><?php echo htmlspecialchars($usuarioDireccion ?: '--'); ?></div>
                    </div>
                    <div class="profile-info-row">
                        <div class="profile-info-label">Ciudad:</div>
                        <div class="profile-info-value" id="displayCiudad"><?php echo htmlspecialchars($usuarioCiudad ?: '--'); ?></div>
                    </div>
                    <div class="profile-info-row">
                        <div class="profile-info-label">Estado:</div>
                        <div class="profile-info-value" id="displayEstado"><?php echo htmlspecialchars($usuarioEstado ?: '--'); ?></div>
                    </div>
                    <div class="profile-info-row">
                        <div class="profile-info-label">Código Postal:</div>
                        <div class="profile-info-value" id="displayCodigoPostal"><?php echo htmlspecialchars($usuarioCP ?: '--'); ?></div>
                    </div>
                    <div class="profile-info-row">
                        <div class="profile-info-label">País:</div>
                        <div class="profile-info-value" id="displayPais"><?php echo htmlspecialchars($usuarioPais ?: '--'); ?></div>
                    </div>
                    <div class="profile-info-row">
                        <div class="profile-info-label">Fecha de Nacimiento:</div>
                        <div class="profile-info-value" id="displayFechaNacimiento"><?php echo $usuarioFechaNac ? date('d/m/Y', strtotime($usuarioFechaNac)) : '--'; ?></div>
                    </div>
                </div>
               
                <div class="profile-actions">
                    <button type="button" class="btn btn-primary" id="editProfileBtn">
                        <i class="fas fa-edit me-2"></i>Editar Perfil
                    </button>
                    <button type="button" class="btn btn-outline-primary" id="changePasswordBtn">
                        <i class="fas fa-lock me-2"></i>Cambiar Contraseña
                    </button>
                </div>
            </div>
            <!-- Edit Profile Form (Hidden by default) -->
            <div class="card" id="editProfileForm" style="display: none;">
                <div class="card-header">
                    <i class="fas fa-user-edit me-2"></i>Editar Información Personal
                </div>
                <div class="card-body">
                    <form id="perfilForm">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <div class="form-group">
                                    <label for="nombres" class="form-label">
                                        <i class="fas fa-user"></i>
                                        Nombres *
                                    </label>
                                    <input type="text" class="form-control" id="nombres" value="<?php echo htmlspecialchars($usuarioNombre); ?>" required>
                                    <div class="invalid-feedback">Por favor, ingresa tus nombres.</div>
                                </div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <div class="form-group">
                                    <label for="apellidos" class="form-label">
                                        <i class="fas fa-user"></i>
                                        Apellidos *
                                    </label>
                                    <input type="text" class="form-control" id="apellidos" value="<?php echo htmlspecialchars($usuarioApellidos); ?>" required>
                                    <div class="invalid-feedback">Por favor, ingresa tus apellidos.</div>
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
                                    <input type="email" class="form-control" id="perfil_email" value="<?php echo htmlspecialchars($usuarioCorreo); ?>" required>
                                    <div class="invalid-feedback">Por favor, ingresa un correo electrónico válido.</div>
                                </div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <div class="form-group">
                                    <label for="telefono" class="form-label">
                                        <i class="fas fa-phone"></i>
                                        Teléfono
                                    </label>
                                    <input type="tel" class="form-control" id="perfil_telefono" value="<?php echo htmlspecialchars($usuarioTelefono); ?>">
                                </div>
                            </div>
                        </div>
                       
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <div class="form-group">
                                    <label for="direccion" class="form-label">
                                        <i class="fas fa-map-marker-alt"></i>
                                        Dirección
                                    </label>
                                    <input type="text" class="form-control" id="perfil_direccion" value="<?php echo htmlspecialchars($usuarioDireccion); ?>">
                                </div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <div class="form-group">
                                    <label for="ciudad" class="form-label">
                                        <i class="fas fa-city"></i>
                                        Ciudad
                                    </label>
                                    <input type="text" class="form-control" id="perfil_ciudad" value="<?php echo htmlspecialchars($usuarioCiudad); ?>">
                                </div>
                            </div>
                        </div>
                       
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <div class="form-group">
                                    <label for="estado" class="form-label">
                                        <i class="fas fa-map"></i>
                                        Estado
                                    </label>
                                    <input type="text" class="form-control" id="perfil_estado" value="<?php echo htmlspecialchars($usuarioEstado); ?>">
                                </div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <div class="form-group">
                                    <label for="codigo_postal" class="form-label">
                                        <i class="fas fa-mail-bulk"></i>
                                        Código Postal
                                    </label>
                                    <input type="text" class="form-control" id="perfil_codigo_postal" value="<?php echo htmlspecialchars($usuarioCP); ?>">
                                </div>
                            </div>
                        </div>
                       
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <div class="form-group">
                                    <label for="pais" class="form-label">
                                        <i class="fas fa-globe"></i>
                                        País
                                    </label>
                                    <input type="text" class="form-control" id="perfil_pais" value="<?php echo htmlspecialchars($usuarioPais); ?>">
                                </div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <div class="form-group">
                                    <label for="fecha_nacimiento" class="form-label">
                                        <i class="fas fa-birthday-cake"></i>
                                        Fecha de Nacimiento
                                    </label>
                                    <input type="date" class="form-control" id="perfil_fecha_nacimiento" value="<?php echo $usuarioFechaNac ? htmlspecialchars(date('Y-m-d', strtotime($usuarioFechaNac))) : ''; ?>">
                                </div>
                            </div>
                        </div>
                       
                        <div class="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                            <button type="button" class="btn btn-outline-primary me-md-2" id="cancelEditBtn">
                                <i class="fas fa-times me-2"></i>Cancelar
                            </button>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save me-2"></i>Guardar Cambios
                            </button>
                        </div>
                    </form>
                </div>
            </div>
           
            <!-- Change Password Form (Hidden by default) -->
            <div class="card" id="changePasswordForm" style="display: none;">
                <div class="card-header">
                    <i class="fas fa-lock me-2"></i>Cambiar Contraseña
                </div>
                <div class="card-body">
                    <form id="passwordForm">
                        <div class="form-group">
                            <label for="password_actual" class="form-label">
                                <i class="fas fa-lock"></i>
                                Contraseña Actual *
                            </label>
                            <div class="password-toggle">
                                <input type="password" class="form-control" id="password_actual" required>
                                <button type="button" class="password-toggle-btn" data-target="password_actual">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                            <div class="invalid-feedback">Por favor, ingresa tu contraseña actual.</div>
                        </div>
                       
                        <div class="form-group">
                            <label for="password_nueva" class="form-label">
                                <i class="fas fa-key"></i>
                                Nueva Contraseña *
                            </label>
                            <div class="password-toggle">
                                <input type="password" class="form-control" id="password_nueva" required>
                                <button type="button" class="password-toggle-btn" data-target="password_nueva">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                            <div class="invalid-feedback">Por favor, ingresa una nueva contraseña.</div>
                        </div>
                       
                        <div class="form-group">
                            <label for="password_confirmar" class="form-label">
                                <i class="fas fa-check"></i>
                                Confirmar Nueva Contraseña *
                            </label>
                            <div class="password-toggle">
                                <input type="password" class="form-control" id="password_confirmar" required>
                                <button type="button" class="password-toggle-btn" data-target="password_confirmar">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                            <div class="invalid-feedback">Las contraseñas no coinciden.</div>
                        </div>
                       
                        <div class="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                            <button type="button" class="btn btn-outline-primary me-md-2" id="cancelPasswordBtn">
                                <i class="fas fa-times me-2"></i>Cancelar
                            </button>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-lock me-2"></i>Cambiar Contraseña
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
        <!-- Chat con Soporte Section -->
        <section class="content-section" id="chat-soporte">
            <div class="card">
                <div class="card-body p-0">
                    <div class="status-indicator online" id="connectionStatus">
                        <i class="fas fa-circle"></i>
                        <span>Conectado - Usuario: <?php echo htmlspecialchars($nombreCompleto); ?> (ID: <?php echo $usuarioId; ?>)</span>
                    </div>

                    <div class="chat-test-container">
                        <div class="chat-test-main">
                            <div class="chat-info-bar">
                                <i class="fas fa-headset"></i>
                                <div class="user-info">
                                    <h3>Soporte TotalCarbon</h3>
                                </div>
                            </div>

                            <div class="chat-messages-area" id="chatMessages">
                                <div class="no-messages">
                                    <i class="fas fa-comments"></i>
                                    <p>¡Hola! ¿En qué podemos ayudarte hoy?</p>
                                    <small>Envía un mensaje para iniciar la conversación</small>
                                </div>
                            </div>

                            <div class="chat-input-area">
                                <button class="btn-hide-keyboard" id="hideKeyboardBtn" title="Ocultar/Mostrar teclado">
                                    <i class="fas fa-keyboard"></i>
                                </button>
                                <div class="input-container">
                                    <input type="text" id="mensajeChat" placeholder="Escribe un mensaje..." maxlength="1000">
                                    <button class="btn-send" id="enviarMensajeBtn" title="Enviar mensaje">
                                        <i class="fas fa-paper-plane"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <!-- Notification -->
    <div class="notification" id="notification"></div>
    <!-- Chat FAB -->
    <button class="chat-fab" id="chatFab" style="display: none;">
        <i class="fas fa-comments"></i>
    </button>
    <!-- Notification -->
    <div class="notification" id="notification"></div>
    <!-- Loading Overlay -->
    <div class="loading-overlay" id="loadingOverlay">
        <div class="spinner"></div>
    </div>

    <!-- Script para que el botón "Actualizar" muestre overlay y recargue -->
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            var btn = document.getElementById('btnActualizar');
            var overlay = document.getElementById('loadingOverlay');
            if (!btn) return;

            btn.addEventListener('click', function () {
                try {
                    btn.disabled = true;
                    btn.classList.add('refreshing');
                    if (overlay) {
                        overlay.style.display = 'flex';
                    }
                    // Pequeña espera para que se vea la animación/overlay antes de recargar
                    setTimeout(function () {
                        // Fuerza recarga desde servidor
                        location.reload(true);
                    }, 150);
                } catch (e) {
                    // En caso de error, intentar recargar de todos modos
                    location.reload();
                }
            });
        });
    </script>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.23/jspdf.plugin.autotable.min.js"></script>
    <!-- Estilos para Fichas Técnicas -->
    <link rel="stylesheet" href="../../recursos/css/Cliente/FichasTecnicas.css?v=100000000001">
    <!-- Estilos para Servicios en Proceso -->
    <link rel="stylesheet" href="../../recursos/css/Cliente/ServiciosProceso.css">
    <!-- Scripts -->

    <script src="../../recursos/js/Cliente/PaginaCliente.js?v=993499999999995"></script>
    <script src="../../recursos/js/Cliente/FichasTecnicas.js?V=99999235000009"></script>
    <script src="../../recursos/js/Cliente/ServiciosProceso.js?V=66666666666671"></script>
    <script src="../../recursos/js/Cliente/chat_test_cliente.js?v=3454444444444444444485"></script>
</body>

</html>
