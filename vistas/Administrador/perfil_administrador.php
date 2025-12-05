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
    <title>Perfil - TotalCarbon</title>
    <link rel="icon" href="../../recursos/img/image.png">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
    <link rel="stylesheet" href="../../recursos/css/Administrador/administrador.css?v=3453333334">
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
                <span class="notification-badge"></span>
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
            <li>
                <a href="#" onclick="window.location.href='perfil_administrador.php'" class="active">
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
        <!-- Perfil Section -->
        <div class="content-section active" id="perfil-section">
            <div class="section-header">
                <h2 class="section-title">Mi Perfil</h2>
            </div>

            <!-- Profile Icon -->
            <div style="text-align: center; margin-bottom: 30px;">
                <i class="fas fa-user-circle" style="font-size: 150px; color: #000000;"></i>
            </div>

            <div class="table-container" style="max-width: 800px; margin: 0 auto;">
                <table class="data-table" id="perfilTable">
                    <tbody id="perfilTableBody">
                        <!-- Los datos se cargarán dinámicamente -->
                    </tbody>
                </table>
            </div>

            <div class="filters" style="justify-content: center; margin-top: 30px;">
                <button class="btn btn-primary" onclick="editarPerfil()">
                    <i class="fas fa-edit"></i>
                    Editar Información
                </button>
                <button class="btn btn-outline" onclick="cambiarContrasena()">
                    <i class="fas fa-key"></i>
                    Cambiar Contraseña
                </button>
            </div>
        </div>
    </div>

    <div class="modal" id="editarPerfilModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Editar Perfil</h3>
                <button class="modal-close" onclick="closeModal('editarPerfilModal')">&times;</button>
            </div>
            <div class="modal-body">
                <form id="editarPerfilForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="edit_nombres">Nombres *</label>
                            <input type="text" id="edit_nombres" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="edit_apellidos">Apellidos *</label>
                            <input type="text" id="edit_apellidos" class="form-control" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="edit_correo">Correo Electrónico *</label>
                            <input type="email" id="edit_correo" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="edit_telefono">Teléfono</label>
                            <input type="tel" id="edit_telefono" class="form-control">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="edit_direccion">Dirección</label>
                            <input type="text" id="edit_direccion" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="edit_ciudad">Ciudad</label>
                            <input type="text" id="edit_ciudad" class="form-control">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="edit_estado">Estado</label>
                            <input type="text" id="edit_estado" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="edit_codigo_postal">Código Postal</label>
                            <input type="text" id="edit_codigo_postal" class="form-control">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="edit_pais">País</label>
                            <input type="text" id="edit_pais" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="edit_fecha_nacimiento">Fecha de Nacimiento</label>
                            <input type="date" id="edit_fecha_nacimiento" class="form-control">
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline" onclick="closeModal('editarPerfilModal')">Cancelar</button>
                <button type="button" class="btn btn-primary" onclick="guardarPerfil()">
                    <i class="fas fa-save"></i>
                    <span>Guardar Cambios</span>
                </button>
            </div>
        </div>
    </div>

    <div class="modal" id="cambiarContrasenaModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Cambiar Contraseña</h3>
                <button class="modal-close" onclick="closeModal('cambiarContrasenaModal')">&times;</button>
            </div>
            <div class="modal-body">
                <form id="cambiarContrasenaForm">
                    <div class="form-row">
                        <div class="form-group full-width">
                            <label for="password_actual">Contraseña Actual *</label>
                            <input type="password" id="password_actual" class="form-control" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="password_nueva">Nueva Contraseña *</label>
                            <input type="password" id="password_nueva" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="password_confirmar">Confirmar Nueva Contraseña *</label>
                            <input type="password" id="password_confirmar" class="form-control" required>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline" onclick="closeModal('cambiarContrasenaModal')">Cancelar</button>
                <button type="button" class="btn btn-primary" onclick="guardarContrasena()">
                    <i class="fas fa-save"></i>
                    <span>Cambiar Contraseña</span>
                </button>
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="../../recursos/js/Administrador/perfil_admin.js?v=1"></script>
</body>
</html>