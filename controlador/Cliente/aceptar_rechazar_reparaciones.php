<?php
/**
 * API para aceptar o rechazar reparaciones
 * Archivo: controlador/Cliente/aceptar_rechazar_reparaciones.php
 * Método: POST
 * Propósito: Actualizar el estado de aceptación de reparaciones del cliente
 */

header('Content-Type: application/json; charset=utf-8');
session_start();

// Archivo de log
$logFile = __DIR__ . '/../../logs/aceptar_rechazar_reparaciones.log';

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

escribirLog("=== INICIO: Solicitud de aceptar/rechazar reparaciones ===");

// Verificar sesión
if (!isset($_SESSION['id_usuario'])) {
    escribirLog("ERROR: Sesión no iniciada");
    responder(['success' => false, 'message' => 'No autenticado'], 401);
}

$idUsuario = (int)$_SESSION['id_usuario'];
escribirLog("Usuario ID: $idUsuario");

// Verificar método POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    escribirLog("ERROR: Método no permitido");
    responder(['success' => false, 'message' => 'Método no permitido'], 405);
}

// Obtener datos JSON
$input = json_decode(file_get_contents('php://input'), true);
$idCotizacion = isset($input['id_cotizacion']) ? (int)$input['id_cotizacion'] : 0;
$aceptado = isset($input['aceptado']) ? $input['aceptado'] : null;

escribirLog("Datos recibidos", ['id_cotizacion' => $idCotizacion, 'aceptado' => $aceptado]);

if (!$idCotizacion || !in_array($aceptado, ['ACEPTADA', 'NO_ACEPTADA'])) {
    escribirLog("ERROR: Datos inválidos");
    responder(['success' => false, 'message' => 'Datos inválidos'], 400);
}

try {
    escribirLog("Conectando a la base de datos...");

    // Conexión directa con PDO
    $pdo = new PDO(
        'mysql:host=localhost;dbname=totalcarbon;charset=utf8',
        'root',
        '',
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    escribirLog("Conexión exitosa. Verificando propiedad de la cotización...");

    // Verificar que la cotización pertenece al usuario
    $queryVerificar = "SELECT id_cotizacion FROM cotizaciones_cliente WHERE id_cotizacion = :id AND id_usuario = :usuario";
    $stmtVerificar = $pdo->prepare($queryVerificar);
    $stmtVerificar->execute([':id' => $idCotizacion, ':usuario' => $idUsuario]);
    $cotizacion = $stmtVerificar->fetch(PDO::FETCH_ASSOC);

    if (!$cotizacion) {
        escribirLog("ERROR: Cotización no encontrada o no pertenece al usuario");
        responder(['success' => false, 'message' => 'Cotización no encontrada'], 404);
    }

    escribirLog("Cotización verificada. Actualizando estado...");

    // Actualizar el estado
    $queryUpdate = "UPDATE cotizaciones_cliente SET reparacion_aceptada_cliente = :aceptado WHERE id_cotizacion = :id";
    $stmtUpdate = $pdo->prepare($queryUpdate);
    $stmtUpdate->execute([':aceptado' => $aceptado, ':id' => $idCotizacion]);

    escribirLog("Estado actualizado correctamente", ['id_cotizacion' => $idCotizacion, 'aceptado' => $aceptado]);
    escribirLog("=== FIN: Aceptar/rechazar reparaciones completado ===");

    responder([
        'success' => true,
        'message' => 'Estado actualizado correctamente',
        'aceptado' => $aceptado
    ]);

} catch (PDOException $e) {
    escribirLog("ERROR: Excepción PDO: " . $e->getMessage());
    responder(['success' => false, 'message' => 'Error de BD: ' . $e->getMessage()], 500);
} catch (Throwable $e) {
    escribirLog("ERROR: Excepción capturada: " . $e->getMessage());
    responder(['success' => false, 'message' => $e->getMessage()], 500);
}
?>