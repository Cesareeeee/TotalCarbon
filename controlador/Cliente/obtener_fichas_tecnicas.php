<?php
/**
 * API para obtener fichas técnicas del usuario
 * Archivo: controlador/Cliente/obtener_fichas_tecnicas.php
 * Método: GET
 * Propósito: Retornar todas las fichas técnicas (cotizaciones completadas) del usuario
 */

header('Content-Type: application/json; charset=utf-8');
session_start();

// Archivo de log
$logFile = __DIR__ . '/../../logs/fichas_tecnicas.log';

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

escribirLog("=== INICIO: Solicitud de obtener fichas técnicas ===");

// Verificar sesión
if (!isset($_SESSION['id_usuario'])) {
    escribirLog("ERROR: Sesión no iniciada");
    responder(['success' => false, 'message' => 'No autenticado', 'fichas' => []], 401);
}

$idUsuario = (int)$_SESSION['id_usuario'];
escribirLog("Usuario ID: $idUsuario");

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
    
    // Query para obtener cotizaciones completadas (fichas técnicas)
    $query = "SELECT
                c.id_cotizacion,
                c.nombre_completo,
                c.direccion,
                c.telefono,
                c.correo_electronico,
                u.numero_telefono as telefono_usuario,
                u.correo_electronico as correo_usuario,
                c.marca_bicicleta,
                c.modelo_bicicleta,
                c.zona_afectada,
                c.tipo_trabajo,
                c.tipo_reparacion,
                c.descripcion_otros,
                c.estado,
                c.creado_en,
                c.actualizado_en,
                c.reparacion_aceptada_cliente,
                COUNT(DISTINCT ci.id_imagen) as total_imagenes,
                COUNT(DISTINCT cc.id_comentario) as total_comentarios
              FROM cotizaciones_cliente c
              LEFT JOIN usuarios u ON c.id_usuario = u.id_usuario
              LEFT JOIN cotizacion_imagenes_cliente ci ON c.id_cotizacion = ci.id_cotizacion
              LEFT JOIN cotizacion_comentarios_cliente cc ON c.id_cotizacion = cc.id_cotizacion
              WHERE c.id_usuario = :id
              GROUP BY c.id_cotizacion
              ORDER BY c.creado_en DESC";
    
    escribirLog("Query: $query");
    
    $stmt = $pdo->prepare($query);
    escribirLog("Query preparada");
    
    $stmt->execute([':id' => $idUsuario]);
    escribirLog("Query ejecutada");
    
    $fichas = $stmt->fetchAll(PDO::FETCH_ASSOC);
    escribirLog("Fichas técnicas obtenidas: " . count($fichas));
    
    if (count($fichas) === 0) {
        escribirLog("El usuario no tiene fichas técnicas");
        escribirLog("=== FIN: Sin fichas técnicas ===");
        responder([
            'success' => true,
            'message' => 'No tienes fichas técnicas',
            'fichas' => []
        ]);
    }
    
    // Obtener imágenes y comentarios para cada ficha
    $fichasConDetalles = [];
    foreach ($fichas as $ficha) {
        $idCotizacion = $ficha['id_cotizacion'];

        // Obtener imágenes
        $queryImagenes = "SELECT id_imagen, ruta_imagen, nombre_archivo FROM cotizacion_imagenes_cliente WHERE id_cotizacion = :id";
        $stmtImagenes = $pdo->prepare($queryImagenes);
        $stmtImagenes->execute([':id' => $idCotizacion]);
        $imagenes = $stmtImagenes->fetchAll(PDO::FETCH_ASSOC);

        // Convertir rutas relativas a absolutas
        foreach ($imagenes as &$imagen) {
            if (strpos($imagen['ruta_imagen'], 'http') !== 0) {
                $imagen['ruta_imagen'] = '../../' . $imagen['ruta_imagen'];
            }
        }
        
        // Obtener comentarios
        $queryComentarios = "SELECT id_comentario, autor, mensaje, creado_en FROM cotizacion_comentarios_cliente WHERE id_cotizacion = :id ORDER BY creado_en DESC";
        $stmtComentarios = $pdo->prepare($queryComentarios);
        $stmtComentarios->execute([':id' => $idCotizacion]);
        $comentarios = $stmtComentarios->fetchAll(PDO::FETCH_ASSOC);

        // Obtener piezas
        $queryPiezas = "SELECT tipo, nombre_pieza, codigo_pieza, cantidad, proveedor_id, nota, creado_en FROM piezas_movimientos WHERE id_cotizacion = :id ORDER BY creado_en DESC";
        $stmtPiezas = $pdo->prepare($queryPiezas);
        $stmtPiezas->execute([':id' => $idCotizacion]);
        $piezas = $stmtPiezas->fetchAll(PDO::FETCH_ASSOC);

        $ficha['imagenes'] = $imagenes;
        $ficha['comentarios'] = $comentarios;
        $ficha['piezas'] = $piezas;
        $fichasConDetalles[] = $ficha;
    }
    
    escribirLog("Fichas técnicas obtenidas con detalles", $fichasConDetalles);
    escribirLog("=== FIN: Fichas técnicas obtenidas correctamente ===");
    
    responder([
        'success' => true,
        'message' => 'Fichas técnicas obtenidas correctamente',
        'fichas' => $fichasConDetalles
    ]);
    
} catch (PDOException $e) {
    escribirLog("ERROR: Excepción PDO: " . $e->getMessage());
    responder(['success' => false, 'message' => 'Error de BD: ' . $e->getMessage(), 'fichas' => []], 500);
} catch (Throwable $e) {
    escribirLog("ERROR: Excepción capturada: " . $e->getMessage());
    responder(['success' => false, 'message' => $e->getMessage(), 'fichas' => []], 500);
}
?>

