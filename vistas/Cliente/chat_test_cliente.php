<?php
session_start();
// Proteger ruta: requerir sesión iniciada
if (!isset($_SESSION['id_usuario'])) {
    header('Location: ../login.php');
    exit;
}

// Cargar datos del usuario desde sesión
$usuarioNombre = $_SESSION['nombres'] ?? '';
$usuarioApellidos = $_SESSION['apellidos'] ?? '';
$usuarioCorreo = $_SESSION['correo_electronico'] ?? '';
$usuarioId = $_SESSION['id_usuario'] ?? 0;
$nombreCompleto = trim($usuarioNombre . ' ' . $usuarioApellidos);
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat con Soporte - TotalCarbon</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
    <link rel="stylesheet" href="../../recursos/css/Cliente/chat_test_cliente.css?v=34567">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <div class="status-indicator online" id="connectionStatus">
        <i class="fas fa-circle"></i>
        <span>Conectado - Usuario: <?php echo htmlspecialchars($nombreCompleto); ?> (ID: <?php echo $usuarioId; ?>)</span>
    </div>

    <div class="chat-test-container">
        <div class="chat-test-header">
            <h1>💬 Chat con Soporte</h1>
            <p>Comunícate con nuestro equipo técnico</p>
        </div>

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
                <div class="input-container">
                    <input type="text" id="mensajeChat" placeholder="Escribe un mensaje..." maxlength="1000">
                    <button class="btn-send" id="enviarMensajeBtn" title="Enviar mensaje">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="../../recursos/js/Cliente/chat_test_cliente.js?v=34567"></script>
</body>
</html>