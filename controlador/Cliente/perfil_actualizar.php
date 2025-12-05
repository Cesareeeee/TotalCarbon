<?php
/**
 * API para actualizar datos del perfil del usuario
 * Archivo: controlador/Cliente/perfil_actualizar.php
 * Método: POST
 * Propósito: Actualizar datos del perfil del usuario autenticado
 */

header('Content-Type: application/json; charset=utf-8');
session_start();

require_once __DIR__ . '/../../modelos/php/conexion.php';

// Archivo de log
$logFile = __DIR__ . '/../../logs/perfil_actualizar.log';

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

escribirLog("=== INICIO: Solicitud de actualizar perfil ===");

if (!isset($_SESSION['id_usuario'])) {
    escribirLog("ERROR: Sesión no iniciada");
    responder(['success' => false, 'message' => 'No autenticado'], 401);
}

$idUsuario = (int)$_SESSION['id_usuario'];
escribirLog("Usuario ID: $idUsuario");

// Sanitizar entradas
$nombres = trim($_POST['nombres'] ?? '');
$apellidos = trim($_POST['apellidos'] ?? '');
$correo = trim($_POST['correo_electronico'] ?? '');
$telefono = trim($_POST['numero_telefono'] ?? '');
$direccion = trim($_POST['direccion'] ?? '');
$ciudad = trim($_POST['ciudad'] ?? '');
$estado = trim($_POST['estado'] ?? '');
$cp = trim($_POST['codigo_postal'] ?? '');
$pais = trim($_POST['pais'] ?? '');
$fecha_nacimiento = trim($_POST['fecha_nacimiento'] ?? ''); // YYYY-MM-DD

escribirLog("Datos recibidos", [
    'nombres' => $nombres,
    'apellidos' => $apellidos,
    'correo' => $correo,
    'telefono' => $telefono
]);

if ($nombres === '' || $apellidos === '' || $correo === '') {
    escribirLog("ERROR: Campos obligatorios faltantes");
    responder(['success' => false, 'message' => 'Campos obligatorios faltantes'], 400);
}

if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
    escribirLog("ERROR: Correo inválido: $correo");
    responder(['success' => false, 'message' => 'Correo inválido'], 400);
}

try {
    escribirLog("Conectando a la base de datos...");

    // Conexión directa con PDO
    escribirLog("Usando conexión PDO directa");
    $pdo = new PDO(
        'mysql:host=localhost;dbname=totalcarbon;charset=utf8',
        'root',
        '',
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    escribirLog("Conexión exitosa. Verificando correo único...");

    // Verificar correo único si cambió
    $st = $pdo->prepare('SELECT 1 FROM usuarios WHERE correo_electronico = :correo AND id_usuario <> :id LIMIT 1');
    $st->execute([':correo' => $correo, ':id' => $idUsuario]);
    if ($st->fetch()) {
        escribirLog("ERROR: Correo ya registrado: $correo");
        responder(['success' => false, 'message' => 'El correo ya está registrado por otro usuario'], 409);
    }

    escribirLog("Correo único verificado. Normalizando fecha...");

    // Normalizar fecha
    if ($fecha_nacimiento !== '') {
        $d = date_create_from_format('Y-m-d', $fecha_nacimiento);
        if (!$d) {
            escribirLog("ERROR: Fecha de nacimiento inválida: $fecha_nacimiento");
            responder(['success' => false, 'message' => 'Fecha de nacimiento inválida'], 400);
        }
        $fecha_nacimiento = $d->format('Y-m-d');
        escribirLog("Fecha normalizada: $fecha_nacimiento");
    } else {
        $fecha_nacimiento = null;
        escribirLog("Fecha de nacimiento vacía");
    }

    escribirLog("Preparando query de actualización...");

    $sql = 'UPDATE usuarios SET nombres = :nombres, apellidos = :apellidos, correo_electronico = :correo, numero_telefono = :tel, direccion = :dir, ciudad = :ciudad, estado = :estado, codigo_postal = :cp, pais = :pais, fecha_nacimiento = :fn, actualizado_en = NOW() WHERE id_usuario = :id';
    escribirLog("SQL: $sql");

    $upd = $pdo->prepare($sql);
    escribirLog("Query preparada");

    $upd->execute([
        ':nombres' => $nombres,
        ':apellidos' => $apellidos,
        ':correo' => $correo,
        ':tel' => ($telefono !== '' ? $telefono : null),
        ':dir' => ($direccion !== '' ? $direccion : null),
        ':ciudad' => ($ciudad !== '' ? $ciudad : null),
        ':estado' => ($estado !== '' ? $estado : null),
        ':cp' => ($cp !== '' ? $cp : null),
        ':pais' => ($pais !== '' ? $pais : null),
        ':fn' => $fecha_nacimiento,
        ':id' => $idUsuario
    ]);

    escribirLog("Query ejecutada. Actualizando sesión...");

    // Refrescar sesión básica
    $_SESSION['nombres'] = $nombres;
    $_SESSION['apellidos'] = $apellidos;
    $_SESSION['correo_electronico'] = $correo;
    $_SESSION['numero_telefono'] = $telefono;
    $_SESSION['direccion'] = $direccion;
    $_SESSION['ciudad'] = $ciudad;
    $_SESSION['estado'] = $estado;
    $_SESSION['codigo_postal'] = $cp;
    $_SESSION['pais'] = $pais;
    $_SESSION['fecha_nacimiento'] = $fecha_nacimiento;

    // Si era usuario nuevo, quitar la marca de primer inicio de sesión
    if (isset($_SESSION['usuario_nuevo']) && $_SESSION['usuario_nuevo']) {
        $_SESSION['usuario_nuevo'] = false;
        escribirLog("Usuario nuevo completó su perfil por primera vez");
    }

    escribirLog("Sesión actualizada. Perfil actualizado exitosamente");
    escribirLog("=== FIN: Perfil actualizado correctamente ===");

    responder(['success' => true, 'message' => 'Perfil actualizado correctamente']);
} catch (Throwable $e) {
    escribirLog("ERROR: Excepción capturada: " . $e->getMessage());
    responder(['success' => false, 'message' => $e->getMessage()], 500);
}
