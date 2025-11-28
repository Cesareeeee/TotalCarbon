<?php
// session_start();
// require_once '../../modelos/php/conexion.php';

// if (!isset($_SESSION['id_usuario']) || obtenerNombreRol($_SESSION['id_rol']) !== 'ADMINISTRADOR') {
//     header('Location: ../login.php');
//     exit;
// }
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TotalCarbon - Test Correos</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
    <link rel="stylesheet" href="../../recursos/css/Administrador/test_correos.css?v=2">
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
                <a href="administrador.php">
                    <i class="fas fa-arrow-left"></i>
                    <span>Volver</span>
                </a>
            </li>
        </ul>
    </div>

    <!-- Sidebar Overlay -->
    <div class="sidebar-overlay" id="sidebarOverlay" onclick="toggleSidebar()"></div>

    <!-- Main Content -->
    <div class="main-content">
        <div class="content-section active">
            <div class="section-header">
                <h2 class="section-title">Test Correos - Registro de Usuario</h2>
            </div>

            <div class="form-container">
                <form id="testCorreosForm">
                    <div class="form-group">
                        <label for="email">Correo Electrónico *</label>
                        <input type="email" id="email" class="form-control" placeholder="Ingrese un correo electrónico válido" required>
                        <span class="error-message" id="emailError"></span>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-primary" onclick="enviarCorreo()">
                            <i class="fas fa-paper-plane"></i>
                            Enviar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="../../recursos/js/Administrador/test_correos.js?v=2"></script>

</body>
</html>