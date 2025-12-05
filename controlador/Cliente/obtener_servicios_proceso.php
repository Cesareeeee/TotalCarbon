<?php
/**
 * API para obtener servicios en proceso del usuario
 * Archivo: controlador/Cliente/obtener_servicios_proceso.php
 * Método: GET
 * Propósito: Retornar todos los servicios en proceso del usuario autenticado
 */

require_once '../../modelos/php/database.php';

header('Content-Type: application/json; charset=utf-8');
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Archivo de log
$archivoLog = __DIR__ . '/../../logs/servicios_proceso.log';

// Función para escribir logs
function escribirLog($mensaje, $datos = null) {
    global $archivoLog;
    $marca_tiempo = date('Y-m-d H:i:s');
    $mensajeLog = "[$marca_tiempo] $mensaje";
    
    if ($datos !== null) {
        $mensajeLog .= " | Datos: " . json_encode($datos);
    }
    
    $mensajeLog .= "\n";
    
    // Crear directorio de logs si no existe
    if (!file_exists(dirname($archivoLog))) {
        mkdir(dirname($archivoLog), 0777, true);
    }
    
    file_put_contents($archivoLog, $mensajeLog, FILE_APPEND);
}

function responder($datos, $estado = 200) {
    http_response_code($estado);
    echo json_encode($datos, JSON_UNESCAPED_UNICODE);
    exit;
}

escribirLog("=== INICIO: Solicitud de obtener servicios en proceso ===");

// Verificar sesión
if (!isset($_SESSION['id_usuario'])) {
    escribirLog("ERROR: Sesión no iniciada");
    responder(['exito' => false, 'mensaje' => 'No autenticado', 'servicios' => []], 401);
}

$idUsuario = (int)$_SESSION['id_usuario'];
escribirLog("ID Usuario: $idUsuario");

try {
    escribirLog("Conectando a la base de datos...");
    
    // Usando conexión PDO centralizada
    $conexion = getPDO();
    
    escribirLog("Conexión exitosa. Preparando consulta...");
    
    // Consulta para obtener servicios en proceso
    $consulta = "SELECT
                    c.id_cotizacion,
                    c.nombre_completo,
                    c.marca_bicicleta,
                    c.modelo_bicicleta,
                    c.zona_afectada,
                    c.tipo_trabajo,
                    c.tipo_reparacion,
                    c.descripcion_otros,
                    c.estado,
                    c.reparacion_aceptada_cliente,
                    c.creado_en,
                    c.actualizado_en,
                    c.inspeccion_estetica,
                    COUNT(DISTINCT ipr.id_imagen_proceso) as total_imagenes,
                    COUNT(DISTINCT cc.id_comentario) as total_comentarios,
                    COALESCE(MAX(cpp.paso), 0) as paso_maximo
              FROM cotizaciones_cliente c
              LEFT JOIN imagenes_proceso_reparacion ipr ON c.id_cotizacion = ipr.id_cotizacion
              LEFT JOIN cotizacion_comentarios_cliente cc ON c.id_cotizacion = cc.id_cotizacion
              LEFT JOIN cotizacion_progreso_cliente cpp ON c.id_cotizacion = cpp.id_cotizacion
              WHERE c.id_usuario = :id
              GROUP BY c.id_cotizacion
              ORDER BY c.actualizado_en DESC";
    
    escribirLog("Consulta: $consulta");
    
    $sentencia = $conexion->prepare($consulta);
    escribirLog("Consulta preparada");
    
    $sentencia->execute([':id' => $idUsuario]);
    escribirLog("Consulta ejecutada");
    
    $servicios = $sentencia->fetchAll(PDO::FETCH_ASSOC);
    escribirLog("Servicios obtenidos: " . count($servicios));

    if (count($servicios) === 0) {
        escribirLog("El usuario no tiene servicios en proceso");
        escribirLog("=== FIN: Sin servicios en proceso ===");
        responder([
            'exito' => true,
            'mensaje' => 'No tienes servicios en proceso',
            'servicios' => []
        ]);
    }

    // Calcular el paso actual basado SOLO en el estado (sin tabla de progreso)
    foreach ($servicios as &$servicio) {
        $estado = $servicio['estado'];

        // Mapeo directo de estado a paso - SIMPLE Y DIRECTO
        switch ($estado) {
            case 'PENDIENTE':
                $pasoActual = 1; // Cotización Enviada
                break;
            case 'APROBADA':
                $pasoActual = 2; // Aceptada
                break;
            case 'EN_PROCESO':
                $pasoActual = 3; // Reparación Iniciada
                break;
            case 'PINTURA':
                $pasoActual = 4; // Pintura
                break;
            case 'EMPACADO':
                $pasoActual = 5; // Empacado
                break;
            case 'ENVIADO':
                $pasoActual = 6; // Enviado
                break;
            case 'COMPLETADO':
                $pasoActual = 7; // Completado
                break;
            case 'RECHAZADA':
                $pasoActual = 2; // Se queda en Aceptada
                break;
            default:
                $pasoActual = 1;
        }

        $servicio['paso_actual'] = $pasoActual;
        unset($servicio['paso_maximo']); // Remover el campo auxiliar
    }
    
    // Obtener imágenes, comentarios y progreso para cada servicio
    $serviciosConDetalles = [];
    foreach ($servicios as $servicio) {
        $idCotizacion = $servicio['id_cotizacion'];

        // Obtener imágenes del proceso (subidas por el administrador)
        $consultaImagenes = "SELECT id_imagen_proceso as id_imagen, ruta_imagen, nombre_archivo, descripcion FROM imagenes_proceso_reparacion WHERE id_cotizacion = :id ORDER BY fecha_subida DESC";
        $sentenciaImagenes = $conexion->prepare($consultaImagenes);
        $sentenciaImagenes->execute([':id' => $idCotizacion]);
        $imagenes = $sentenciaImagenes->fetchAll(PDO::FETCH_ASSOC);

        // Convertir rutas relativas a absolutas
        foreach ($imagenes as &$imagen) {
            if (strpos($imagen['ruta_imagen'], 'http') !== 0) {
                $imagen['ruta_imagen'] = '../../' . $imagen['ruta_imagen'];
            }
        }
        
        // Obtener comentarios del administrador
        $consultaComentarios = "SELECT id_comentario, autor, mensaje, creado_en FROM cotizacion_comentarios_cliente WHERE id_cotizacion = :id ORDER BY creado_en DESC";
        $sentenciaComentarios = $conexion->prepare($consultaComentarios);
        $sentenciaComentarios->execute([':id' => $idCotizacion]);
        $comentarios = $sentenciaComentarios->fetchAll(PDO::FETCH_ASSOC);
        
        // Obtener progreso
        $consultaProgreso = "SELECT paso, descripcion FROM cotizacion_progreso_cliente WHERE id_cotizacion = :id ORDER BY paso ASC";
        $sentenciaProgreso = $conexion->prepare($consultaProgreso);
        $sentenciaProgreso->execute([':id' => $idCotizacion]);
        $progreso = $sentenciaProgreso->fetchAll(PDO::FETCH_ASSOC);
        
        $servicio['imagenes'] = $imagenes;
        $servicio['comentarios'] = $comentarios;
        $servicio['progreso'] = $progreso;
        $serviciosConDetalles[] = $servicio;
    }
    
    escribirLog("Servicios obtenidos con detalles", $serviciosConDetalles);
    escribirLog("=== FIN: Servicios en proceso obtenidos correctamente ===");
    
    responder([
        'exito' => true,
        'mensaje' => 'Servicios en proceso obtenidos correctamente',
        'servicios' => $serviciosConDetalles
    ]);
    
} catch (PDOException $e) {
    escribirLog("ERROR: Excepción PDO: " . $e->getMessage());
    responder(['exito' => false, 'mensaje' => 'Error de BD: ' . $e->getMessage(), 'servicios' => []], 500);
} catch (Throwable $e) {
    escribirLog("ERROR: Excepción capturada: " . $e->getMessage());
    responder(['exito' => false, 'mensaje' => $e->getMessage(), 'servicios' => []], 500);
}
?>

