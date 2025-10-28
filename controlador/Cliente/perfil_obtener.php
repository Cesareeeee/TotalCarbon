<?php
/**
 * API para obtener datos del perfil del usuario
 * Archivo: controlador/Cliente/perfil_obtener.php
 * Método: GET
 * Propósito: Retornar datos del perfil del usuario autenticado
 */

header('Content-Type: application/json; charset=utf-8');
session_start();

// Archivo de log
$logFile = __DIR__ . '/../../logs/perfil_obtener.log';

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

escribirLog("=== INICIO: Solicitud de obtener perfil ===");

// Verificar sesión
if (!isset($_SESSION['id_usuario'])) {
    escribirLog("ERROR: Sesión no iniciada");
    responder(['success' => false, 'message' => 'No autenticado'], 401);
}

$idUsuario = (int)$_SESSION['id_usuario'];
escribirLog("Usuario ID: $idUsuario");

try {
    escribirLog("Intentando conectar a la base de datos...");

    // Conexión directa con PDO
    escribirLog("Usando conexión PDO directa");
    $pdo = new PDO(
        'mysql:host=localhost;dbname=totalcarbon;charset=utf8',
        'root',
        '',
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );


    escribirLog("Conexión exitosa. Preparando query...");

    $query = 'SELECT id_usuario, nombres, apellidos, correo_electronico, numero_telefono, direccion, ciudad, estado, codigo_postal, pais, fecha_nacimiento FROM usuarios WHERE id_usuario = :id LIMIT 1';
    escribirLog("Query: $query");

    $st = $pdo->prepare($query);
    escribirLog("Query preparada");

    $st->execute([':id' => $idUsuario]);
    escribirLog("Query ejecutada");

    $row = $st->fetch(PDO::FETCH_ASSOC);

    if (!$row) {
        escribirLog("ERROR: Usuario no encontrado con ID: $idUsuario");
        responder(['success' => false, 'message' => 'Usuario no encontrado'], 404);
    }

    escribirLog("Perfil obtenido exitosamente", [
        'id_usuario' => $row['id_usuario'],
        'nombres' => $row['nombres'],
        'apellidos' => $row['apellidos'],
        'correo_electronico' => $row['correo_electronico']
    ]);

    escribirLog("=== FIN: Perfil obtenido correctamente ===");
    responder(['success' => true, 'perfil' => $row]);

} catch (Throwable $e) {
    escribirLog("ERROR: Excepción capturada: " . $e->getMessage());
    responder(['success' => false, 'message' => $e->getMessage()], 500);
}
