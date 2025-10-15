<?php
// Iniciar sesión y verificar autenticación
session_start();
if (!isset($_SESSION['id_usuario'])) {
    header('Location: ../index.html');
    exit();
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Página Cliente - Total Carbon</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Montserrat', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            min-height: 100vh;
        }
        .navbar {
            background: rgba(102, 126, 234, 0.9);
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
            background: linear-gradient(135deg, #667eea, #764ba2);
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
        .services-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 40px;
        }
        .service-card {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            padding: 25px;
            text-align: center;
            transition: transform 0.3s ease;
        }
        .service-card:hover {
            transform: translateY(-5px);
        }
        .service-card i {
            font-size: 2.5rem;
            margin-bottom: 15px;
            color: #667eea;
        }
    </style>
</head>
<body>
    <!-- Barra de navegación -->
    <nav class="navbar navbar-expand-lg navbar-dark">
        <div class="container">
            <a class="navbar-brand" href="#">
                <i class="fas fa-bicycle me-2"></i>Total Carbon Clientes
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
            <div class="col-lg-10">
                <div class="welcome-card">
                    <i class="fas fa-bicycle fa-4x mb-4" style="color: #667eea;"></i>
                    <h1 class="display-4 fw-bold mb-3">PÁGINA CLIENTE</h1>
                    <p class="lead">Bienvenido al portal de clientes de Total Carbon</p>
                    <div class="role-badge">
                        <i class="fas fa-user me-2"></i>CLIENTE
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

                    <!-- Servicios disponibles -->
                    <div class="services-grid">
                        <div class="service-card">
                            <i class="fas fa-wrench"></i>
                            <h5>Reparaciones</h5>
                            <p>Servicio especializado de reparación</p>
                        </div>
                        <div class="service-card">
                            <i class="fas fa-paint-brush"></i>
                            <h5>Pintura</h5>
                            <p>Pintura premium automotriz</p>
                        </div>
                        <div class="service-card">
                            <i class="fas fa-search"></i>
                            <h5>Inspección NDT</h5>
                            <p>Chequeos no destructivos</p>
                        </div>
                        <div class="service-card">
                            <i class="fas fa-cog"></i>
                            <h5>Fabricación</h5>
                            <p>Fabricación a medida</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>