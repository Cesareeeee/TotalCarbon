<?php
header('Content-Type: application/json; charset=utf-8');
session_start();

require_once __DIR__ . '/../../modelos/php/conexion.php';

// Conexión a la base de datos
$db = new PDO(
    'mysql:host=localhost;dbname=totalcarbon;charset=utf8',
    'root',
    '',
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
);

// Verificar sesión de admin
if (!isset($_SESSION['id_usuario']) || !isset($_SESSION['id_rol'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit;
}

$logFile = __DIR__ . '/../../logs/nuevo_servicio.log';

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
// Handle obtener_usuarios action before the main switch
if ($metodo === 'GET' && $accion === 'obtener_usuarios') {
    // Consulta simplificada sin JOIN con roles
    $sql = "SELECT id_usuario, nombres, apellidos, correo_electronico, numero_telefono, direccion
            FROM usuarios
            WHERE estado_usuario = 1
            ORDER BY nombres, apellidos";
    $stmt = $db->prepare($sql);
    $stmt->execute();
    $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
    escribirLog("Usuarios obtenidos: " . count($usuarios));
    responder(['success' => true, 'usuarios' => $usuarios]);
}

switch ($metodo) {

    case 'GET':
        if ($accion === 'obtener_usuario') {
                $idUsuario = (int)($_GET['id'] ?? 0);
                if ($idUsuario <= 0) {
                    responder(['success' => false, 'message' => 'ID de usuario inválido'], 400);
                }

                $sql = "SELECT nombres, apellidos, correo_electronico, numero_telefono, direccion, ciudad, estado, codigo_postal, pais
                        FROM usuarios WHERE id_usuario = :id_usuario";
                $stmt = $db->prepare($sql);
                $stmt->execute([':id_usuario' => $idUsuario]);
                $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

                if (!$usuario) {
                    responder(['success' => false, 'message' => 'Usuario no encontrado'], 404);
                }

                escribirLog("Usuario obtenido: $idUsuario");
                responder(['success' => true, 'usuario' => $usuario]);
            } elseif ($accion === 'buscar_clientes') {
                $termino = $_GET['termino'] ?? '';
                escribirLog("Parámetro termino crudo: '" . $termino . "'");

                $termino = trim($termino);
                escribirLog("Parámetro termino después de trim: '" . $termino . "' (longitud: " . strlen($termino) . ")");

                if ($termino === '' || $termino === null) {
                    escribirLog("Término de búsqueda vacío o null");
                    responder(['success' => false, 'message' => 'Término de búsqueda requerido'], 400);
                }

                if (strlen($termino) < 2) {
                    escribirLog("Término de búsqueda demasiado corto: '$termino'");
                    responder(['success' => false, 'message' => 'Término de búsqueda debe tener al menos 2 caracteres'], 400);
                }

                // Buscar clientes por nombre o email (simplificado sin JOIN a roles)
                $sql = "SELECT id_usuario, nombres, apellidos, correo_electronico, numero_telefono, direccion
                        FROM usuarios
                        WHERE estado_usuario = 1
                        AND (CONCAT(nombres, ' ', apellidos) LIKE ? OR correo_electronico LIKE ?)
                        ORDER BY nombres, apellidos
                        LIMIT 10";
                $stmt = $db->prepare($sql);
                $searchTerm = '%' . $termino . '%';
                $stmt->execute([$searchTerm, $searchTerm]);
                $clientes = $stmt->fetchAll(PDO::FETCH_ASSOC);

                escribirLog("Búsqueda de clientes: '$termino' - " . count($clientes) . " resultados");
                responder(['success' => true, 'clientes' => $clientes]);
            }
            break;

        case 'POST':
            if ($accion === 'crear_servicio' || empty($accion)) {
                // Handle form submission for creating service
                // Validación de campos requeridos
                $campos = ['marca', 'modelo', 'zonaAfectada', 'tipoTrabajo', 'tipoReparacion'];
                foreach ($campos as $c) {
                    if (!isset($_POST[$c]) || trim((string)$_POST[$c]) === '') {
                        responder(['success' => false, 'message' => "Falta el campo requerido: $c"], 400);
                    }
                }

                // Validar que se haya especificado un cliente (ya sea registrado o manual)
                $idUsuario = isset($_POST['id_usuario']) && !empty($_POST['id_usuario']) ? (int)$_POST['id_usuario'] : null;
                $nombreCompleto = trim($_POST['nombre'] ?? '');

                if (empty($nombreCompleto)) {
                    responder(['success' => false, 'message' => 'Debe especificar el nombre del cliente'], 400);
                }

                $direccion = trim($_POST['direccion'] ?? '');
                $telefono = trim($_POST['telefono'] ?? '');
                $correoElectronico = trim($_POST['email'] ?? '');
                $marcaBicicleta = trim($_POST['marca']);
                $modeloBicicleta = trim($_POST['modelo']);
                $zonaAfectada = trim($_POST['zonaAfectada']);
                $tipoTrabajo = trim($_POST['tipoTrabajo']);
                $tipoReparacion = trim($_POST['tipoReparacion']);
                $descripcionOtros = trim($_POST['descripcionOtros'] ?? '');
                $estado = $_POST['estado'] ?? 'PENDIENTE';

                // Validación de imágenes (al menos una)
                $tieneImagen = false;
                foreach ($_FILES as $k => $f) {
                    if (strpos($k, 'imagen_') === 0 && isset($f['tmp_name']) && $f['error'] === UPLOAD_ERR_OK) {
                        $tieneImagen = true;
                        break;
                    }
                }

                if (!$tieneImagen) {
                    responder(['success' => false, 'message' => 'Debe subir al menos una imagen'], 400);
                }

                // Si se especificó un id_usuario, verificar que existe
                if ($idUsuario !== null) {
                    $sql = "SELECT id_usuario FROM usuarios WHERE id_usuario = :id_usuario AND estado_usuario = 1";
                    $stmt = $db->prepare($sql);
                    $stmt->execute([':id_usuario' => $idUsuario]);
                    if (!$stmt->fetch()) {
                        responder(['success' => false, 'message' => 'Usuario no encontrado o inactivo'], 404);
                    }
                }

                // Crear la cotización/servicio
                $sql = "INSERT INTO cotizaciones_cliente (
                            id_usuario, nombre_completo, direccion, telefono, correo_electronico,
                            marca_bicicleta, modelo_bicicleta, zona_afectada, tipo_trabajo,
                            tipo_reparacion, descripcion_otros, estado
                        ) VALUES (
                            :id_usuario, :nombre_completo, :direccion, :telefono, :correo_electronico,
                            :marca_bicicleta, :modelo_bicicleta, :zona_afectada, :tipo_trabajo,
                            :tipo_reparacion, :descripcion_otros, :estado
                        )";

                $stmt = $db->prepare($sql);
                $resultado = $stmt->execute([
                    ':id_usuario' => $idUsuario,
                    ':nombre_completo' => $nombreCompleto,
                    ':direccion' => $direccion,
                    ':telefono' => $telefono,
                    ':correo_electronico' => $correoElectronico,
                    ':marca_bicicleta' => $marcaBicicleta,
                    ':modelo_bicicleta' => $modeloBicicleta,
                    ':zona_afectada' => $zonaAfectada,
                    ':tipo_trabajo' => $tipoTrabajo,
                    ':tipo_reparacion' => $tipoReparacion,
                    ':descripcion_otros' => $descripcionOtros,
                    ':estado' => $estado
                ]);

                $idCotizacion = $db->lastInsertId();

                // Procesar imágenes
                $baseProjectDir = realpath(__DIR__ . '/../../..');
                $imgBaseDir = $baseProjectDir . DIRECTORY_SEPARATOR . 'Img_Servicios';
                $uploadDir = $imgBaseDir . DIRECTORY_SEPARATOR . $idCotizacion;

                if (!is_dir($imgBaseDir)) {
                    mkdir($imgBaseDir, 0777, true);
                }
                if (!is_dir($uploadDir)) {
                    mkdir($uploadDir, 0777, true);
                }

                foreach ($_FILES as $clave => $archivo) {
                    if (strpos($clave, 'imagen_') === 0 && $archivo['error'] === UPLOAD_ERR_OK) {
                        $tipoMime = $archivo['type'];
                        $tamano = (int)$archivo['size'];

                        if (!preg_match('/^image\//', (string)$tipoMime)) {
                            continue; // Skip non-images
                        }

                        if ($tamano > 5 * 1024 * 1024) {
                            continue; // Skip large files
                        }

                        $extension = pathinfo($archivo['name'], PATHINFO_EXTENSION) ?: 'jpg';
                        $nombreDestino = uniqid('img_admin_', true) . '.' . $extension;
                        $rutaRelativa = 'Img_Servicios/' . $idCotizacion . '/' . $nombreDestino;
                        $rutaAbsoluta = $uploadDir . DIRECTORY_SEPARATOR . $nombreDestino;

                        if (move_uploaded_file($archivo['tmp_name'], $rutaAbsoluta)) {
                            $sql = "INSERT INTO cotizacion_imagenes_cliente (id_cotizacion, ruta_imagen, nombre_archivo, tamano_bytes, tipo_mime)
                                    VALUES (:id_cotizacion, :ruta_imagen, :nombre_archivo, :tamano_bytes, :tipo_mime)";
                            $stmt = $db->prepare($sql);
                            $stmt->execute([
                                ':id_cotizacion' => $idCotizacion,
                                ':ruta_imagen' => $rutaRelativa,
                                ':nombre_archivo' => $archivo['name'],
                                ':tamano_bytes' => $tamano,
                                ':tipo_mime' => $tipoMime,
                            ]);
                        }
                    }
                }

                // Procesar piezas del cliente
                if (isset($_POST['piezas_cliente']) && !empty($_POST['piezas_cliente'])) {
                    $piezasJson = $_POST['piezas_cliente'];
                    $piezas = json_decode($piezasJson, true);

                    if (is_array($piezas)) {
                        foreach ($piezas as $pieza) {
                            if (isset($pieza['nombre']) && !empty($pieza['nombre'])) {
                                $sql = "INSERT INTO piezas_movimientos (id_cotizacion, tipo, nombre_pieza, cantidad, nota)
                                        VALUES (:id_cotizacion, 'RECIBIDO', :nombre_pieza, :cantidad, :nota)";
                                $stmt = $db->prepare($sql);
                                $stmt->execute([
                                    ':id_cotizacion' => $idCotizacion,
                                    ':nombre_pieza' => $pieza['nombre'],
                                    ':cantidad' => (int)($pieza['cantidad'] ?? 1),
                                    ':nota' => $pieza['nota'] ?? null
                                ]);
                            }
                        }
                    }
                }

                // Crear paso inicial de progreso
                $sql = "INSERT INTO cotizacion_progreso_cliente (id_cotizacion, paso, descripcion, activo)
                        VALUES (:id_cotizacion, 1, 'Servicio creado por administrador', 1)";
                $stmt = $db->prepare($sql);
                $stmt->execute([':id_cotizacion' => $idCotizacion]);

                $tipoCliente = $idUsuario ? "registrado (ID: $idUsuario)" : "no registrado";
                escribirLog("Servicio creado: $idCotizacion para cliente $tipoCliente - $nombreCompleto");
                responder(['success' => true, 'message' => 'Servicio creado correctamente', 'id_cotizacion' => $idCotizacion]);

            } elseif ($accion === 'subir_imagenes') {
                $idCotizacion = (int)($_POST['id_cotizacion'] ?? 0);
                if ($idCotizacion <= 0) {
                    responder(['success' => false, 'message' => 'ID de cotización inválido'], 400);
                }

                $baseProjectDir = realpath(__DIR__ . '/../../..');
                $imgBaseDir = $baseProjectDir . DIRECTORY_SEPARATOR . 'Img_Servicios';
                $uploadDir = $imgBaseDir . DIRECTORY_SEPARATOR . $idCotizacion;

                if (!is_dir($imgBaseDir)) {
                    mkdir($imgBaseDir, 0777, true);
                }
                if (!is_dir($uploadDir)) {
                    mkdir($uploadDir, 0777, true);
                }

                $imagenesSubidas = [];
                $errores = [];

                if (isset($_FILES['imagenes'])) {
                    $archivos = $_FILES['imagenes'];

                    // Si es un solo archivo, convertir a array
                    if (!is_array($archivos['name'])) {
                        $archivos = [
                            'name' => [$archivos['name']],
                            'type' => [$archivos['type']],
                            'tmp_name' => [$archivos['tmp_name']],
                            'error' => [$archivos['error']],
                            'size' => [$archivos['size']]
                        ];
                    }

                    foreach ($archivos['name'] as $key => $nombreArchivo) {
                        if ($archivos['error'][$key] !== UPLOAD_ERR_OK) {
                            $errores[] = "Error al subir $nombreArchivo";
                            continue;
                        }

                        $tipoMime = $archivos['type'][$key];
                        $tamano = (int)$archivos['size'][$key];

                        if (!preg_match('/^image\//', (string)$tipoMime)) {
                            $errores[] = "$nombreArchivo no es una imagen válida";
                            continue;
                        }

                        if ($tamano > 5 * 1024 * 1024) {
                            $errores[] = "$nombreArchivo es demasiado grande (máx. 5MB)";
                            continue;
                        }

                        $extension = pathinfo($nombreArchivo, PATHINFO_EXTENSION) ?: 'jpg';
                        $nombreDestino = uniqid('img_admin_', true) . '.' . $extension;
                        $rutaRelativa = 'Img_Servicios/' . $idCotizacion . '/' . $nombreDestino;
                        $rutaAbsoluta = $uploadDir . DIRECTORY_SEPARATOR . $nombreDestino;

                        if (!move_uploaded_file($archivos['tmp_name'][$key], $rutaAbsoluta)) {
                            $errores[] = "Error al guardar $nombreArchivo";
                            continue;
                        }

                        $sql = "INSERT INTO cotizacion_imagenes_cliente (id_cotizacion, ruta_imagen, nombre_archivo, tamano_bytes, tipo_mime)
                                VALUES (:id_cotizacion, :ruta_imagen, :nombre_archivo, :tamano_bytes, :tipo_mime)";
                        $stmt = $db->prepare($sql);
                        $stmt->execute([
                            ':id_cotizacion' => $idCotizacion,
                            ':ruta_imagen' => $rutaRelativa,
                            ':nombre_archivo' => $nombreArchivo,
                            ':tamano_bytes' => $tamano,
                            ':tipo_mime' => $tipoMime,
                        ]);

                        $imagenesSubidas[] = [
                            'id' => $db->lastInsertId(),
                            'nombre' => $nombreArchivo,
                            'ruta' => $rutaRelativa
                        ];
                    }
                }

                escribirLog("Imágenes subidas para cotización $idCotizacion: " . count($imagenesSubidas) . " exitosas, " . count($errores) . " errores");

                responder([
                    'success' => count($imagenesSubidas) > 0,
                    'message' => count($imagenesSubidas) > 0 ? 'Imágenes subidas correctamente' : 'No se pudieron subir las imágenes',
                    'imagenes' => $imagenesSubidas,
                    'errores' => $errores
                ]);
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