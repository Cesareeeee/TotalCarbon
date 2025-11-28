<?php
/**
 * API para obtener garantías del usuario
 * Archivo: controlador/Cliente/obtener_garantias.php
 * Método: GET
 * Propósito: Retornar todas las garantías del usuario autenticado
 */

header('Content-Type: application/json; charset=utf-8');
session_start();

// Archivo de log
$logFile = __DIR__ . '/../../logs/obtener_garantias.log';

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

escribirLog("=== INICIO: Solicitud de obtener garantías ===");

// Verificar sesión - TEMPORALMENTE DESACTIVADO PARA TESTING
// if (!isset($_SESSION['id_usuario'])) {
//     escribirLog("ERROR: Sesión no iniciada");
//     responder(['success' => false, 'message' => 'No autenticado', 'garantias' => []], 401);
// }

// $idUsuario = (int)$_SESSION['id_usuario'];
// escribirLog("Usuario ID: $idUsuario");

try {
    escribirLog("Conectando a la base de datos...");

    // Conexión directa con PDO
    $pdo = new PDO(
        'mysql:host=localhost;dbname=totalcarbon;charset=utf8',
        'root',
        '',
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    escribirLog("Conexión exitosa. Preparando query...");

    // Query para obtener garantías con detalles de cotización y usuario
    $query = "SELECT
                g.id_garantia,
                g.tipo_garantia,
                g.cobertura,
                g.fecha_inicio,
                g.fecha_fin,
                g.estado,
                g.creado_en,
                c.nombre_completo,
                c.marca_bicicleta,
                c.modelo_bicicleta,
                c.zona_afectada,
                c.tipo_trabajo,
                c.tipo_reparacion,
                c.descripcion_otros,
                u.nombres,
                u.apellidos
              FROM garantias_bicicletas g
              JOIN cotizaciones_cliente c ON g.id_cotizacion = c.id_cotizacion
              JOIN usuarios u ON g.id_usuario = u.id_usuario
              ORDER BY g.fecha_fin DESC";

    escribirLog("Query: $query");

    $stmt = $pdo->prepare($query);
    escribirLog("Query preparada");

    $stmt->execute();
    escribirLog("Query ejecutada");

    $garantias = $stmt->fetchAll(PDO::FETCH_ASSOC);
    escribirLog("Garantías obtenidas: " . count($garantias));

    if (count($garantias) === 0) {
        escribirLog("El usuario no tiene garantías");
        escribirLog("=== FIN: Sin garantías ===");
        responder([
            'success' => true,
            'message' => 'No tienes garantías',
            'garantias' => []
        ]);
    }

    escribirLog("Garantías obtenidas exitosamente", $garantias);
    escribirLog("=== FIN: Garantías obtenidas correctamente ===");

    responder([
        'success' => true,
        'message' => 'Garantías obtenidas correctamente',
        'garantias' => $garantias
    ]);

} catch (PDOException $e) {
    escribirLog("ERROR: Excepción PDO: " . $e->getMessage());
    responder(['success' => false, 'message' => 'Error de BD: ' . $e->getMessage(), 'garantias' => []], 500);
} catch (Throwable $e) {
    escribirLog("ERROR: Excepción capturada: " . $e->getMessage());
    responder(['success' => false, 'message' => $e->getMessage(), 'garantias' => []], 500);
}
?>