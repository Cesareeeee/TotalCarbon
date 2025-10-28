<?php
header('Content-Type: application/json; charset=utf-8');

use ModeloCliente\CotizacionCliente;

require_once __DIR__ . '/../../modelos/php/ModeloCliente/CotizacionCliente.php';
session_start();

// Archivo de log
$logFile = __DIR__ . '/../../logs/cotizacion_cliente.log';

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

escribirLog("=== INICIO: Solicitud de crear cotización ===");

// Validar sesión
if (!isset($_SESSION['id_usuario'])) {
    escribirLog("ERROR: Sesión no iniciada");
    responder(['success' => false, 'message' => 'No autenticado'], 401);
}

$idUsuario = (int)$_SESSION['id_usuario'];
escribirLog("Usuario ID: $idUsuario");

$metodo = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($metodo !== 'POST') {
    escribirLog("ERROR: Método no permitido: $metodo");
    responder(['success' => false, 'message' => 'Método no permitido'], 405);
}

// Validación de campos requeridos
escribirLog("Validando campos requeridos...");

$campos = ['nombre', 'direccion', 'telefono', 'email', 'marca', 'modelo', 'zonaAfectada', 'tipoTrabajo', 'tipoReparacion'];
foreach ($campos as $c) {
    if (!isset($_POST[$c]) || trim((string)$_POST[$c]) === '') {
        escribirLog("ERROR: Falta el campo requerido: $c");
        responder(['success' => false, 'message' => "Falta el campo requerido: $c"], 400);
    }
}

escribirLog("Todos los campos requeridos están presentes");

// Validación de imágenes (opcional, al menos una)
escribirLog("Validando imágenes...");

$tieneImagen = false;
foreach ($_FILES as $k => $f) {
    if (strpos($k, 'imagen_') === 0 && isset($f['tmp_name']) && $f['error'] === UPLOAD_ERR_OK) {
        $tieneImagen = true;
        escribirLog("Imagen encontrada: $k");
        break;
    }
}

if (!$tieneImagen) {
    escribirLog("ERROR: No se subió ninguna imagen");
    responder(['success' => false, 'message' => 'Debe subir al menos una imagen'], 400);
}

escribirLog("Validación de imágenes exitosa");

try {
    escribirLog("Creando cotización...");
    escribirLog("Archivos recibidos: " . json_encode(array_keys($_FILES)));

    foreach ($_FILES as $clave => $archivo) {
        if (strpos($clave, 'imagen_') === 0) {
            escribirLog("Archivo $clave - Error: " . $archivo['error'] . ", Tamaño: " . $archivo['size'] . ", Tipo: " . $archivo['type']);
        }
    }

    $servicio = new CotizacionCliente();
    $resultado = $servicio->crearCotizacion($_POST, $_FILES, $idUsuario);

    if ($resultado['success'] ?? false) {
        escribirLog("Cotización creada exitosamente. ID: " . $resultado['id_cotizacion']);
        escribirLog("=== FIN: Cotización creada correctamente ===");
        responder(['success' => true, 'id_cotizacion' => $resultado['id_cotizacion']]);
    }

    escribirLog("ERROR: " . ($resultado['message'] ?? 'Error al crear la cotización'));
    responder(['success' => false, 'message' => $resultado['message'] ?? 'Error al crear la cotización'], 500);
} catch (Throwable $e) {
    escribirLog("ERROR: Excepción capturada: " . $e->getMessage());
    escribirLog("Stack trace: " . $e->getTraceAsString());
    responder(['success' => false, 'message' => $e->getMessage()], 500);
}
