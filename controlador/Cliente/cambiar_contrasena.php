<?php
/**
 * API para cambiar contraseña del usuario
 * Archivo: controlador/Cliente/cambiar_contrasena.php
 * Método: POST
 * Propósito: Cambiar la contraseña del usuario autenticado
 */

header('Content-Type: application/json; charset=utf-8');
session_start();

require_once __DIR__ . '/../../modelos/php/database.php';

// Archivo de log
$logFile = __DIR__ . '/../../logs/cambiar_contrasena.log';

// Función para escribir logs
function escribirLog($mensaje, $datos = null) {
    global $logFile;
    $timestamp = date('Y-m-d H:i:s');
    $logMessage = "[$timestamp] $mensaje";

    if ($datos !== null) {
        $logMessage .= " | Datos: " . json_encode($datos);
    }

    $logMessage .= "\n";

    // Crear directorio de logs si no existe
    if (!file_exists(dirname($logFile))) {
        mkdir(dirname($logFile), 0777, true);
    }

    file_put_contents($logFile, $logMessage, FILE_APPEND);
}

function responder($data, int $status = 200) {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

escribirLog("=== INICIO: Solicitud de cambiar contraseña ===");

if (!isset($_SESSION['id_usuario'])) {
    escribirLog("ERROR: Sesión no iniciada");
    responder(['success' => false, 'message' => 'No autenticado'], 401);
}

$idUsuario = (int)$_SESSION['id_usuario'];
escribirLog("Usuario ID: $idUsuario");

$passActual = $_POST['password_actual'] ?? '';
$passNueva = $_POST['password_nueva'] ?? '';
$passConf = $_POST['password_confirmar'] ?? '';

escribirLog("Validando campos de contraseña...");

if ($passNueva === '' || $passConf === '' || $passActual === '') {
    escribirLog("ERROR: Campos de contraseña vacíos");
    responder(['success' => false, 'message' => 'Todos los campos son obligatorios'], 400);
}

if ($passNueva !== $passConf) {
    escribirLog("ERROR: Las contraseñas nuevas no coinciden");
    responder(['success' => false, 'message' => 'Las contraseñas no coinciden'], 400);
}

escribirLog("Validación de campos exitosa");

try {
    escribirLog("Conectando a la base de datos...");

    // Conexión directa con PDO
    escribirLog("Usando conexión PDO centralizada");
    $pdo = getPDO();

    escribirLog("Conexión exitosa. Obteniendo contraseña actual...");

    $st = $pdo->prepare('SELECT contrasena FROM usuarios WHERE id_usuario = :id LIMIT 1');
    $st->execute([':id' => $idUsuario]);
    $row = $st->fetch(PDO::FETCH_ASSOC);

    if (!$row) {
        escribirLog("ERROR: Usuario no encontrado con ID: $idUsuario");
        responder(['success' => false, 'message' => 'Usuario no encontrado'], 404);
    }

    escribirLog("Usuario encontrado. Verificando contraseña actual...");

    $hash = $row['contrasena'];
    if (!password_verify($passActual, $hash)) {
        escribirLog("ERROR: Contraseña actual incorrecta para usuario: $idUsuario");
        responder(['success' => false, 'message' => 'La contraseña actual es incorrecta'], 403);
    }

    escribirLog("Contraseña actual verificada. Hasheando nueva contraseña...");

    $nuevoHash = password_hash($passNueva, PASSWORD_BCRYPT);
    escribirLog("Nueva contraseña hasheada");

    escribirLog("Actualizando contraseña en la base de datos...");

    $upd = $pdo->prepare('UPDATE usuarios SET contrasena = :c WHERE id_usuario = :id');
    $upd->execute([':c' => $nuevoHash, ':id' => $idUsuario]);

    escribirLog("Contraseña actualizada exitosamente para usuario: $idUsuario");
    escribirLog("=== FIN: Contraseña cambiada correctamente ===");

    responder(['success' => true, 'message' => 'Contraseña actualizada correctamente']);
} catch (Throwable $e) {
    escribirLog("ERROR: Excepción capturada: " . $e->getMessage());
    responder(['success' => false, 'message' => $e->getMessage()], 500);
}
