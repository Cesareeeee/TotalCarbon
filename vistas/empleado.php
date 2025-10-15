<?php
// Iniciar sesión y verificar autenticación
session_start();
if (!isset($_SESSION['id_usuario'])) {
    header('Location: ../index.html');
    exit();
}

// Verificar si es empleado
if ($_SESSION['id_rol'] != 3) { // Asumiendo que 3 es el ID de empleado
    header('Location: ../vistas/cliente.php');
    exit();
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Página Empleado - Total Carbon</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Montserrat', sans-serif;
            background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
            color: #ffffff;
            min-height: 100vh;
        }
        .navbar {
            background: rgba(44, 62, 80, 0.9);
            backdrop-filter: blur(10px);
        }
        .main-content {
            padding: 60px 0;
        }
        .welcome-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
            text-align: center;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .role-badge {
            background: linear-gradient(135deg, #3498db, #2980b9);
            color: white;
            padding: 10px 20px;
            border-radius: 50px;
            font-weight: 600;
            display: inline-block;
            margin-top: 20px;
        }
        .user-info {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 15px;
            padding: 20px;
            margin-top: 30px;
        }
    </style>
</head>
<body>
    <!-- Barra de navegación -->
    <nav class="navbar navbar-expand-lg navbar-dark">
        <div class="container">
            <a class="navbar-brand" href="#">
                <i class="fas fa-users me-2"></i>Total Carbon Empleados
            </a>
            <div class="navbar-nav ms-auto">
                <span class="navbar-text me-3">
                    <i class="fas fa-user me-2"></i><?php echo $_SESSION['nombres'] . ' ' . $_SESSION['apellidos']; ?>
                </span>
                <a href="../controlador/logout.php" class="btn btn-outline-light btn-sm">
                    <i class="fas fa-sign-out-alt me-1"></i>Cerrar Sesión
                </a>
            </div>
        </div>
    </nav>

    <!-- Contenido principal -->
    <div class="container main-content">
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <div class="welcome-card">
                    <i class="fas fa-users fa-4x mb-4" style="color: #3498db;"></i>
                    <h1 class="display-4 fw-bold mb-3">PÁGINA EMPLEADO</h1>
                    <p class="lead">Portal de empleados de Total Carbon</p>
                    <div class="role-badge">
                        <i class="fas fa-id-badge me-2"></i>EMPLEADO
                    </div>
                    
                    <div class="user-info">
                        <h5 class="mb-3">Información de Usuario</h5>
                        <div class="row">
                            <div class="col-md-6">
                                <p><strong>Código:</strong> <?php echo $_SESSION['codigo_usuario']; ?></p>
                                <p><strong>Correo:</strong> <?php echo $_SESSION['correo_electronico']; ?></p>
                            </div>
                            <div class="col-md-6">
                                <p><strong>Nombre:</strong> <?php echo $_SESSION['nombres']; ?></p>
                                <p><strong>Apellidos:</strong> <?php echo $_SESSION['apellidos']; ?></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>