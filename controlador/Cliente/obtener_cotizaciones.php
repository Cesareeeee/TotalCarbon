<?php
/**
 * API para obtener cotizaciones del usuario
 * Archivo: controlador/Cliente/obtener_cotizaciones.php
 * Método: GET
 * Propósito: Retornar todas las cotizaciones del usuario autenticado
 */

require_once '../../modelos/php/database.php';

header('Content-Type: application/json; charset=utf-8');
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Archivo de log
$logFile = __DIR__ . '/../../logs/obtener_cotizaciones.log';

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

escribirLog("=== INICIO: Solicitud de obtener cotizaciones ===");

// Verificar sesión
if (!isset($_SESSION['id_usuario'])) {
    escribirLog("ERROR: Sesión no iniciada");
    responder(['success' => false, 'message' => 'No autenticado', 'cotizaciones' => []], 401);
}

$idUsuario = (int)$_SESSION['id_usuario'];
escribirLog("Usuario ID: $idUsuario");

try {
    escribirLog("Conectando a la base de datos...");
    
    // Usando conexión PDO centralizada
    $pdo = getPDO();
    
    escribirLog("Conexión exitosa. Preparando query...");
    
    // Query para obtener cotizaciones
    $query = "SELECT 
                id_cotizacion,
                nombre_completo,
                marca_bicicleta,
                modelo_bicicleta,
                zona_afectada,
                tipo_trabajo,
                tipo_reparacion,
                estado,
                creado_en
              FROM cotizaciones_cliente
              WHERE id_usuario = :id
              ORDER BY creado_en DESC";
    
    escribirLog("Query: $query");
    
    $stmt = $pdo->prepare($query);
    escribirLog("Query preparada");
    
    $stmt->execute([':id' => $idUsuario]);
    escribirLog("Query ejecutada");
    
    $cotizaciones = $stmt->fetchAll(PDO::FETCH_ASSOC);
    escribirLog("Cotizaciones obtenidas: " . count($cotizaciones));
    
    if (count($cotizaciones) === 0) {
        escribirLog("El usuario no tiene cotizaciones");
        escribirLog("=== FIN: Sin cotizaciones ===");
        responder([
            'success' => true,
            'message' => 'No tienes cotizaciones',
            'cotizaciones' => []
        ]);
    }
    
    escribirLog("Cotizaciones obtenidas exitosamente", $cotizaciones);
    escribirLog("=== FIN: Cotizaciones obtenidas correctamente ===");
    
    responder([
        'success' => true,
        'message' => 'Cotizaciones obtenidas correctamente',
        'cotizaciones' => $cotizaciones
    ]);
    
} catch (PDOException $e) {
    escribirLog("ERROR: Excepción PDO: " . $e->getMessage());
    responder(['success' => false, 'message' => 'Error de BD: ' . $e->getMessage(), 'cotizaciones' => []], 500);
} catch (Throwable $e) {
    escribirLog("ERROR: Excepción capturada: " . $e->getMessage());
    responder(['success' => false, 'message' => $e->getMessage(), 'cotizaciones' => []], 500);
}
?>

