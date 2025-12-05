<?php
header('Content-Type: application/json; charset=utf-8');
session_start();

require_once __DIR__ . '/../../modelos/php/database.php';
require_once __DIR__ . '/sincronizar_progreso.php';

// Usando conexión PDO centralizada
$db = getPDO();

// Verificar sesión de admin
if (!isset($_SESSION['id_usuario']) || !isset($_SESSION['id_rol'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit;
}

$logFile = __DIR__ . '/../../logs/cotizaciones_admin.log';

function escribirLog($mensaje, $datos = null) {
    global $logFile;
    $timestamp = date('Y-m-d H:i:s');
    $logMessage = "[$timestamp] $mensaje";

    if ($datos !== null) {
        $logMessage .= " | Datos: " . json_encode($datos);
    }

    $logMessage .= "\n";

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

$metodo = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$accion = $_GET['accion'] ?? '';

escribirLog("=== Solicitud: $metodo $accion ===");

try {
    if ($metodo === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        if ($input === null) {
            $input = $_POST;
        }
        $accion = $input['accion'] ?? '';
    }

    switch ($metodo) {
        case 'GET':
            if ($accion === 'obtener_todas') {
                $sql = "SELECT c.*, CONCAT(u.nombres, ' ', u.apellidos) as nombre_usuario, u.correo_electronico as usuario_email
                        FROM cotizaciones_cliente c
                        LEFT JOIN usuarios u ON c.id_usuario = u.id_usuario
                        ORDER BY c.creado_en DESC";
                $stmt = $db->prepare($sql);
                $stmt->execute();
                $cotizaciones = $stmt->fetchAll(PDO::FETCH_ASSOC);
                escribirLog("Cotizaciones obtenidas: " . count($cotizaciones));
                responder(['success' => true, 'cotizaciones' => $cotizaciones]);
            } elseif ($accion === 'obtener_cotizacion') {
                $id = (int)($_GET['id_cotizacion'] ?? 0);
                if ($id <= 0) {
                    responder(['success' => false, 'message' => 'ID inválido'], 400);
                }
                $sql = "SELECT c.*, CONCAT(u.nombres, ' ', u.apellidos) as nombre_usuario, u.correo_electronico as usuario_email
                        FROM cotizaciones_cliente c
                        LEFT JOIN usuarios u ON c.id_usuario = u.id_usuario
                        WHERE c.id_cotizacion = :id";
                $stmt = $db->prepare($sql);
                $stmt->execute([':id' => $id]);
                $cotizacion = $stmt->fetch(PDO::FETCH_ASSOC);
                if (!$cotizacion) {
                    responder(['success' => false, 'message' => 'Cotización no encontrada'], 404);
                }
                $sql = "SELECT * FROM cotizacion_progreso_cliente WHERE id_cotizacion = :id ORDER BY paso";
                $stmt = $db->prepare($sql);
                $stmt->execute([':id' => $id]);
                $progreso = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $sql = "SELECT * FROM cotizacion_imagenes_cliente WHERE id_cotizacion = :id ORDER BY creado_en DESC";
                $stmt = $db->prepare($sql);
                $stmt->execute([':id' => $id]);
                $imagenes = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $sql = "SELECT id_imagen_proceso as id_imagen, ruta_imagen, nombre_archivo, fecha_subida as creado_en FROM imagenes_proceso_reparacion WHERE id_cotizacion = :id ORDER BY fecha_subida DESC";
                $stmt = $db->prepare($sql);
                $stmt->execute([':id' => $id]);
                $imagenes_progreso = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $sql = "SELECT * FROM cotizacion_comentarios_cliente WHERE id_cotizacion = :id ORDER BY creado_en DESC";
                $stmt = $db->prepare($sql);
                $stmt->execute([':id' => $id]);
                $comentarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $sql = "SELECT * FROM piezas_movimientos WHERE id_cotizacion = :id ORDER BY creado_en DESC";
                $stmt = $db->prepare($sql);
                $stmt->execute([':id' => $id]);
                $piezas = $stmt->fetchAll(PDO::FETCH_ASSOC);
                responder([
                    'success' => true,
                    'cotizacion' => $cotizacion,
                    'progreso' => $progreso,
                    'imagenes' => $imagenes,
                    'imagenes_progreso' => $imagenes_progreso,
                    'comentarios' => $comentarios,
                    'piezas' => $piezas
                ]);
            }
            break;

        case 'POST':

            if ($accion === 'actualizar_estado') {
                $idCotizacion = (int)($input['id_cotizacion'] ?? 0);
                $estado = $input['estado'] ?? '';
                $estadosPermitidos = ['PENDIENTE', 'APROBADA', 'RECHAZADA', 'EN_PROCESO', 'COMPLETADO', 'COTIZACIÓN ENVIADA', 'ACEPTADA', 'REPARACIÓN INICIADA', 'PINTURA', 'EMPACADO', 'ENVIADO'];
                if ($idCotizacion <= 0 || !in_array($estado, $estadosPermitidos)) {
                    responder(['success' => false, 'message' => 'Datos inválidos'], 400);
                }
                $sql = "UPDATE cotizaciones_cliente SET estado = :estado WHERE id_cotizacion = :id";
                $stmt = $db->prepare($sql);
                $resultado = $stmt->execute([':estado' => $estado, ':id' => $idCotizacion]);
                escribirLog("Estado actualizado: $idCotizacion -> $estado");
                responder(['success' => $resultado, 'message' => $resultado ? 'Estado actualizado' : 'Error al actualizar']);
            } elseif ($accion === 'agregar_comentario') {
                $idCotizacion = (int)($input['id_cotizacion'] ?? 0);
                $mensaje = trim($input['mensaje'] ?? '');
                $autor = 'Administrador'; // O usar $_SESSION['nombre_usuario']
                if ($idCotizacion <= 0 || empty($mensaje)) {
                    responder(['success' => false, 'message' => 'Datos inválidos'], 400);
                }
                $sql = "INSERT INTO cotizacion_comentarios_cliente (id_cotizacion, autor, mensaje) VALUES (:id_cotizacion, :autor, :mensaje)";
                $stmt = $db->prepare($sql);
                $resultado = $stmt->execute([
                    ':id_cotizacion' => $idCotizacion,
                    ':autor' => $autor,
                    ':mensaje' => $mensaje
                ]);
                escribirLog("Comentario agregado: $idCotizacion");
                responder(['success' => $resultado, 'message' => $resultado ? 'Comentario agregado' : 'Error al agregar comentario']);
            } elseif ($accion === 'agregar_imagen') {
                $idCotizacion = (int)($_POST['id_cotizacion'] ?? 0);
                $nombrePersonalizado = trim($_POST['nombre_personalizado'] ?? '');
                
                if ($idCotizacion <= 0 || !isset($_FILES['imagen'])) {
                    responder(['success' => false, 'message' => 'Datos inválidos'], 400);
                }
                // Guardar dentro del proyecto en recursos/imagenes_proceso
                $baseProjectDir = realpath(__DIR__ . '/../..');
                $imgBaseDir = $baseProjectDir . DIRECTORY_SEPARATOR . 'recursos' . DIRECTORY_SEPARATOR . 'imagenes_proceso';
                $uploadDir = $imgBaseDir . DIRECTORY_SEPARATOR . $idCotizacion;

                if (!is_dir($imgBaseDir)) {
                    mkdir($imgBaseDir, 0777, true);
                }
                if (!is_dir($uploadDir)) {
                    mkdir($uploadDir, 0777, true);
                }

                $archivo = $_FILES['imagen'];
                $nombreOriginal = basename($archivo['name']);
                $tipoMime = mime_content_type($archivo['tmp_name']);
                $tamano = (int)$archivo['size'];

                if (!preg_match('/^image\//', (string)$tipoMime)) {
                    responder(['success' => false, 'message' => 'Tipo de archivo no válido']);
                }
                if ($tamano > 5 * 1024 * 1024) {
                    responder(['success' => false, 'message' => 'Archivo demasiado grande']);
                }

                $extension = pathinfo($nombreOriginal, PATHINFO_EXTENSION) ?: 'jpg';
                
                if (!empty($nombrePersonalizado)) {
                    $nombreLimpio = preg_replace('/[^a-zA-Z0-9_-]/', '_', $nombrePersonalizado);
                    $nombreDestino = $nombreLimpio . '_' . uniqid() . '.' . $extension;
                    $nombreMostrar = $nombrePersonalizado;
                } else {
                    $nombreDestino = uniqid('img_admin_', true) . '.' . $extension;
                    $nombreMostrar = $nombreOriginal;
                }

                $rutaRelativa = 'recursos/imagenes_proceso/' . $idCotizacion . '/' . $nombreDestino;
                $rutaAbsoluta = $uploadDir . DIRECTORY_SEPARATOR . $nombreDestino;

                if (!move_uploaded_file($archivo['tmp_name'], $rutaAbsoluta)) {
                    responder(['success' => false, 'message' => 'Error al subir archivo']);
                }

                $sql = "INSERT INTO imagenes_proceso_reparacion (id_cotizacion, ruta_imagen, nombre_archivo, descripcion) VALUES (:id_cotizacion, :ruta_imagen, :nombre_archivo, '')";
                $stmt = $db->prepare($sql);
                $stmt->execute([
                    ':id_cotizacion' => $idCotizacion,
                    ':ruta_imagen' => $rutaRelativa,
                    ':nombre_archivo' => $nombreMostrar,
                ]);

                escribirLog("Imagen agregada: $idCotizacion");
                responder(['success' => true, 'id_imagen' => $db->lastInsertId()]);
            } elseif ($accion === 'eliminar_imagen') {
                $idImagen = (int)($input['id_imagen'] ?? 0);
                $rutaImagen = $input['ruta_imagen'] ?? '';

                if ($idImagen <= 0 || empty($rutaImagen)) {
                    responder(['success' => false, 'message' => 'Datos inválidos'], 400);
                }

                $baseProjectDir = realpath(__DIR__ . '/../..');
                $rutaRelativa = str_replace(['..', '\\'], ['', '/'], $rutaImagen);
                $rutaAbsoluta = $baseProjectDir . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $rutaRelativa);

                if (file_exists($rutaAbsoluta)) {
                    unlink($rutaAbsoluta);
                }

                $sql = "DELETE FROM imagenes_proceso_reparacion WHERE id_imagen_proceso = :id";
                $stmt = $db->prepare($sql);
                $resultado = $stmt->execute([':id' => $idImagen]);

                escribirLog("Imagen eliminada: $idImagen");
                responder(['success' => $resultado, 'message' => $resultado ? 'Imagen eliminada' : 'Error al eliminar imagen']);
            } elseif ($accion === 'agregar_paso') {
                $idCotizacion = (int)($input['id_cotizacion'] ?? 0);
                $paso = (int)($input['paso'] ?? 0);
                $descripcion = trim($input['descripcion'] ?? '');
                if ($idCotizacion <= 0 || $paso <= 0 || empty($descripcion)) {
                    responder(['success' => false, 'message' => 'Datos inválidos'], 400);
                }
                $sql = "INSERT INTO cotizacion_progreso_cliente (id_cotizacion, paso, descripcion, activo) VALUES (:id_cotizacion, :paso, :descripcion, 1)";
                $stmt = $db->prepare($sql);
                $resultado = $stmt->execute([
                    ':id_cotizacion' => $idCotizacion,
                    ':paso' => $paso,
                    ':descripcion' => $descripcion
                ]);
                escribirLog("Paso agregado: $idCotizacion paso $paso");
                responder(['success' => $resultado, 'message' => $resultado ? 'Paso agregado' : 'Error al agregar paso']);
            } elseif ($accion === 'actualizar_paso') {
                $idCotizacion = (int)($input['id_cotizacion'] ?? 0);
                $paso = (int)($input['paso'] ?? 0);
                $activo = (bool)($input['activo'] ?? false);
                if ($idCotizacion <= 0 || $paso <= 0) {
                    responder(['success' => false, 'message' => 'Datos inválidos'], 400);
                }
                $sql = "UPDATE cotizacion_progreso_cliente SET activo = :activo WHERE id_cotizacion = :id_cotizacion AND paso = :paso";
                $stmt = $db->prepare($sql);
                $resultado = $stmt->execute([
                    ':activo' => $activo ? 1 : 0,
                    ':id_cotizacion' => $idCotizacion,
                    ':paso' => $paso
                ]);
                escribirLog("Paso actualizado: $idCotizacion paso $paso -> " . ($activo ? 'activo' : 'inactivo'));
                responder(['success' => $resultado, 'message' => $resultado ? 'Paso actualizado' : 'Error al actualizar paso']);
            } elseif ($accion === 'agregar_pieza') {
                $idCotizacion = (int)($input['id_cotizacion'] ?? 0);
                $nombre = trim($input['nombre'] ?? '');
                $codigo = trim($input['codigo'] ?? '');
                $cantidad = (int)($input['cantidad'] ?? 1);
                $nota = trim($input['nota'] ?? '');
                if ($idCotizacion <= 0 || empty($nombre) || $cantidad <= 0) {
                    responder(['success' => false, 'message' => 'Datos inválidos'], 400);
                }
                $sql = "INSERT INTO piezas_movimientos (id_cotizacion, tipo, nombre_pieza, codigo_pieza, cantidad, nota) VALUES (:id_cotizacion, 'ENTREGADO', :nombre, :codigo, :cantidad, :nota)";
                $stmt = $db->prepare($sql);
                $resultado = $stmt->execute([
                    ':id_cotizacion' => $idCotizacion,
                    ':nombre' => $nombre,
                    ':codigo' => $codigo,
                    ':cantidad' => $cantidad,
                    ':nota' => $nota

                ]);
                escribirLog("Pieza agregada: $idCotizacion - $nombre");
                responder(['success' => $resultado, 'message' => $resultado ? 'Pieza agregada' : 'Error al agregar pieza']);
            } elseif ($accion === 'actualizar_campo') {
                $idCotizacion = (int)($input['id_cotizacion'] ?? 0);
                $campo = $input['campo'] ?? '';
                $valor = $input['valor'] ?? '';
                $camposPermitidos = ['revision_camaras', 'inspeccion_estetica', 'empacado_salida', 'reparacion_aceptada_cliente'];
                if ($idCotizacion <= 0 || !in_array($campo, $camposPermitidos)) {
                    responder(['success' => false, 'message' => 'Datos inválidos'], 400);
                }
                $sql = "UPDATE cotizaciones_cliente SET $campo = :valor WHERE id_cotizacion = :id";
                $stmt = $db->prepare($sql);
                $resultado = $stmt->execute([':valor' => $valor, ':id' => $idCotizacion]);
                escribirLog("Campo actualizado: $idCotizacion $campo = $valor");
                responder(['success' => $resultado, 'message' => $resultado ? 'Campo actualizado' : 'Error al actualizar campo']);
            } elseif ($accion === 'eliminar_pieza') {
                $idPieza = (int)($input['id_pieza'] ?? 0);
                if ($idPieza <= 0) {
                    responder(['success' => false, 'message' => 'ID de pieza inválido'], 400);
                }
                $sql = "DELETE FROM piezas_movimientos WHERE id_movimiento = :id";
                $stmt = $db->prepare($sql);
                $resultado = $stmt->execute([':id' => $idPieza]);
                escribirLog("Pieza eliminada: $idPieza");
                responder(['success' => $resultado, 'message' => $resultado ? 'Pieza eliminada correctamente' : 'Error al eliminar pieza']);
            } elseif ($accion === 'eliminar_comentario') {
                $idComentario = (int)($input['id_comentario'] ?? 0);
                if ($idComentario <= 0) {
                    responder(['success' => false, 'message' => 'ID de comentario inválido'], 400);
                }
                $sql = "DELETE FROM cotizacion_comentarios_cliente WHERE id_comentario = :id";
                $stmt = $db->prepare($sql);
                $resultado = $stmt->execute([':id' => $idComentario]);
                escribirLog("Comentario eliminado: $idComentario");
                responder(['success' => $resultado, 'message' => $resultado ? 'Comentario eliminado correctamente' : 'Error al eliminar comentario']);
            }
            break;

        default:
            responder(['success' => false, 'message' => 'Método no permitido'], 405);
    }

    responder(['success' => false, 'message' => 'Acción no válida'], 400);

} catch (Throwable $e) {
    escribirLog("ERROR: " . $e->getMessage());
    responder(['success' => false, 'message' => $e->getMessage()], 500);
}