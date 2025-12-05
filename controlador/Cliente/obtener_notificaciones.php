<?php
/**
 * API para obtener notificaciones del usuario
 * Archivo: controlador/Cliente/obtener_notificaciones.php
 * Método: GET
 * Propósito: Retornar notificaciones no vistas del usuario
 */

require_once '../../modelos/php/database.php';

header('Content-Type: application/json; charset=utf-8');
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Archivo de log
$logFile = __DIR__ . '/../../logs/notificaciones.log';

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

escribirLog("=== INICIO: Solicitud de notificaciones ===");

// Verificar sesión
if (!isset($_SESSION['id_usuario'])) {
    escribirLog("ERROR: Sesión no iniciada");
    responder(['success' => false, 'message' => 'No autenticado', 'notificaciones' => []], 401);
}

$idUsuario = (int)$_SESSION['id_usuario'];
escribirLog("Usuario ID: $idUsuario");

// Obtener timestamp de última verificación (opcional, por ahora usamos 1 año atrás para pruebas)
$ultimaVerificacion = isset($_GET['ultima_verificacion']) ? $_GET['ultima_verificacion'] : date('Y-m-d H:i:s', strtotime('-1 year'));

try {
    escribirLog("Conectando a la base de datos...");

    // Usando conexión PDO centralizada
    $pdo = getPDO();

    escribirLog("Conexión exitosa. Buscando notificaciones desde: $ultimaVerificacion");

    $notificaciones = [];

    // 1. Comentarios nuevos en cotizaciones del usuario
    try {
        $queryComentarios = "
            SELECT
                cc.id_comentario,
                cc.id_cotizacion,
                cc.autor,
                cc.mensaje,
                cc.creado_en,
                c.marca_bicicleta,
                c.modelo_bicicleta
            FROM cotizacion_comentarios_cliente cc
            JOIN cotizaciones_cliente c ON cc.id_cotizacion = c.id_cotizacion
            WHERE c.id_usuario = :id_usuario
            AND cc.creado_en > :ultima_verificacion
            ORDER BY cc.creado_en DESC
        ";

        $stmtComentarios = $pdo->prepare($queryComentarios);
        $stmtComentarios->execute([
            ':id_usuario' => $idUsuario,
            ':ultima_verificacion' => $ultimaVerificacion
        ]);

        $comentarios = $stmtComentarios->fetchAll(PDO::FETCH_ASSOC);
        escribirLog("Comentarios encontrados: " . count($comentarios));
        foreach ($comentarios as $comentario) {
            escribirLog("Procesando comentario ID: " . $comentario['id_comentario']);
            $notificaciones[] = [
                'id' => 'comentario_' . $comentario['id_comentario'],
                'tipo' => 'comentario',
                'titulo' => 'Nuevo comentario',
                'mensaje' => $comentario['autor'] . ' comentó en tu cotización ' . $comentario['marca_bicicleta'] . ' ' . $comentario['modelo_bicicleta'],
                'fecha' => $comentario['creado_en'],
                'id_cotizacion' => $comentario['id_cotizacion']
            ];
        }
    } catch (PDOException $e) {
        escribirLog("Error en consulta de comentarios: " . $e->getMessage());
    }

    // 2. Nuevas imágenes en cotizaciones del usuario
    try {
        $queryImagenes = "
            SELECT
                ci.id_imagen,
                ci.id_cotizacion,
                ci.nombre_archivo,
                ci.creado_en,
                c.marca_bicicleta,
                c.modelo_bicicleta
            FROM cotizacion_imagenes_cliente ci
            JOIN cotizaciones_cliente c ON ci.id_cotizacion = c.id_cotizacion
            WHERE c.id_usuario = :id_usuario
            AND ci.creado_en > :ultima_verificacion
            ORDER BY ci.creado_en DESC
        ";

        $stmtImagenes = $pdo->prepare($queryImagenes);
        $stmtImagenes->execute([
            ':id_usuario' => $idUsuario,
            ':ultima_verificacion' => $ultimaVerificacion
        ]);

        $imagenes = $stmtImagenes->fetchAll(PDO::FETCH_ASSOC);
        foreach ($imagenes as $imagen) {
            $notificaciones[] = [
                'id' => 'imagen_' . $imagen['id_imagen'],
                'tipo' => 'imagen',
                'titulo' => 'Nueva imagen',
                'mensaje' => 'Se agregó una nueva imagen a tu cotización ' . $imagen['marca_bicicleta'] . ' ' . $imagen['modelo_bicicleta'],
                'fecha' => $imagen['creado_en'],
                'id_cotizacion' => $imagen['id_cotizacion']
            ];
        }
    } catch (PDOException $e) {
        escribirLog("Error en consulta de imágenes: " . $e->getMessage());
    }

    // 3. Cambios de estado en cotizaciones
    try {
        $queryEstados = "
            SELECT
                c.id_cotizacion,
                c.estado,
                c.actualizado_en,
                c.marca_bicicleta,
                c.modelo_bicicleta
            FROM cotizaciones_cliente c
            WHERE c.id_usuario = :id_usuario
            AND c.actualizado_en > :ultima_verificacion
            AND c.actualizado_en != c.creado_en
            ORDER BY c.actualizado_en DESC
        ";

        $stmtEstados = $pdo->prepare($queryEstados);
        $stmtEstados->execute([
            ':id_usuario' => $idUsuario,
            ':ultima_verificacion' => $ultimaVerificacion
        ]);

        $estados = $stmtEstados->fetchAll(PDO::FETCH_ASSOC);
        foreach ($estados as $estado) {
            $estadoTexto = match($estado['estado']) {
                'EN_REVISION' => 'en revisión',
                'APROBADA' => 'aprobada',
                'RECHAZADA' => 'rechazada',
                'COMPLETADA' => 'completada',
                default => 'actualizada'
            };

            $notificaciones[] = [
                'id' => 'estado_' . $estado['id_cotizacion'] . '_' . strtotime($estado['actualizado_en']),
                'tipo' => 'estado',
                'titulo' => 'Cambio de estado',
                'mensaje' => 'Tu cotización ' . $estado['marca_bicicleta'] . ' ' . $estado['modelo_bicicleta'] . ' fue ' . $estadoTexto,
                'fecha' => $estado['actualizado_en'],
                'id_cotizacion' => $estado['id_cotizacion']
            ];
        }
    } catch (PDOException $e) {
        escribirLog("Error en consulta de estados: " . $e->getMessage());
    }

    // 4. Nuevos mensajes de chat del administrador
    try {
        $queryChat = "
            SELECT
                ch.id_mensaje,
                ch.mensaje,
                ch.creado_en,
                u.nombres,
                u.apellidos
            FROM chat_mensajes ch
            LEFT JOIN usuarios u ON ch.id_emisor = u.id_usuario
            WHERE ch.id_receptor = ?
            AND ch.id_emisor = 1
            AND ch.creado_en > ?
            AND ch.leido = 0
            ORDER BY ch.creado_en DESC
        ";

        $stmtChat = $pdo->prepare($queryChat);
        $stmtChat->execute([
            $idUsuario,
            $ultimaVerificacion
        ]);

        $mensajesChat = $stmtChat->fetchAll(PDO::FETCH_ASSOC);
        escribirLog("Mensajes de chat encontrados: " . count($mensajesChat));
        foreach ($mensajesChat as $mensaje) {
            escribirLog("Procesando mensaje de chat ID: " . $mensaje['id_mensaje']);
            $nombreAdmin = trim(($mensaje['nombres'] ?? '') . ' ' . ($mensaje['apellidos'] ?? ''));
            $nombreAdmin = $nombreAdmin ?: 'Administrador';

            $notificaciones[] = [
                'id' => 'chat_' . $mensaje['id_mensaje'],
                'tipo' => 'chat',
                'titulo' => 'Nuevo mensaje de ' . $nombreAdmin,
                'mensaje' => $mensaje['mensaje'],
                'fecha' => $mensaje['creado_en'],
                'id_cotizacion' => null
            ];
        }
    } catch (PDOException $e) {
        escribirLog("Error en consulta de chat: " . $e->getMessage());
    }

    // 5. Movimientos en garantías del usuario
    try {
        $queryGarantias = "
            SELECT
                g.id_garantia,
                g.tipo_garantia,
                g.estado,
                g.fecha_inicio,
                g.fecha_fin,
                g.creado_en,
                g.actualizado_en,
                c.marca_bicicleta,
                c.modelo_bicicleta,
                c.zona_afectada
            FROM garantias_bicicletas g
            JOIN cotizaciones_cliente c ON g.id_cotizacion = c.id_cotizacion
            WHERE g.id_usuario = :id_usuario
            AND (
                g.creado_en > :ultima_verificacion
                OR g.actualizado_en > :ultima_verificacion
            )
            ORDER BY COALESCE(g.actualizado_en, g.creado_en) DESC
        ";

        $stmtGarantias = $pdo->prepare($queryGarantias);
        $stmtGarantias->execute([
            ':id_usuario' => $idUsuario,
            ':ultima_verificacion' => $ultimaVerificacion
        ]);

        $garantias = $stmtGarantias->fetchAll(PDO::FETCH_ASSOC);
        escribirLog("Garantías con movimientos encontrados: " . count($garantias));

        foreach ($garantias as $garantia) {
            escribirLog("Procesando garantía ID: " . $garantia['id_garantia']);

            // Determinar el tipo de movimiento
            $esNueva = $garantia['creado_en'] > $ultimaVerificacion;
            $esActualizada = $garantia['actualizado_en'] > $ultimaVerificacion && $garantia['actualizado_en'] != $garantia['creado_en'];

            if ($esNueva) {
                // Nueva garantía creada
                $titulo = 'Nueva garantía activada';
                $mensaje = 'Se ha activado una nueva garantía para tu bicicleta ' . $garantia['marca_bicicleta'] . ' ' . $garantia['modelo_bicicleta'] . ' (' . $garantia['zona_afectada'] . ')';
                $fecha = $garantia['creado_en'];
            } elseif ($esActualizada) {
                // Garantía actualizada (cambio de estado)
                $estadoTexto = match($garantia['estado']) {
                    'Activa' => 'activada',
                    'Vencida' => 'ha vencido',
                    'Cancelada' => 'ha sido cancelada',
                    'Reclamada' => 'ha sido reclamada',
                    default => 'actualizada'
                };

                $titulo = 'Actualización de garantía';
                $mensaje = 'La garantía de tu bicicleta ' . $garantia['marca_bicicleta'] . ' ' . $garantia['modelo_bicicleta'] . ' (' . $garantia['zona_afectada'] . ') ' . $estadoTexto;
                $fecha = $garantia['actualizado_en'];
            } else {
                continue; // No debería llegar aquí, pero por seguridad
            }

            $notificaciones[] = [
                'id' => 'garantia_' . $garantia['id_garantia'] . '_' . strtotime($fecha),
                'tipo' => 'garantia',
                'titulo' => $titulo,
                'mensaje' => $mensaje,
                'fecha' => $fecha,
                'id_cotizacion' => $garantia['id_garantia'], // Usamos id_garantia como referencia
                'estado_garantia' => $garantia['estado'],
                'fecha_fin' => $garantia['fecha_fin']
            ];
        }
    } catch (PDOException $e) {
        escribirLog("Error en consulta de garantías: " . $e->getMessage());
    }

    // 6. Alertas de garantías próximas a vencer (dentro de 30 días)
    try {
        $fechaLimite = date('Y-m-d', strtotime('+30 days'));

        $queryGarantiasVencimiento = "
            SELECT
                g.id_garantia,
                g.tipo_garantia,
                g.fecha_fin,
                g.estado,
                c.marca_bicicleta,
                c.modelo_bicicleta,
                c.zona_afectada
            FROM garantias_bicicletas g
            JOIN cotizaciones_cliente c ON g.id_cotizacion = c.id_cotizacion
            WHERE g.id_usuario = :id_usuario
            AND g.estado = 'Activa'
            AND g.fecha_fin <= :fecha_limite
            AND g.fecha_fin > CURDATE()
        ";

        $stmtGarantiasVencimiento = $pdo->prepare($queryGarantiasVencimiento);
        $stmtGarantiasVencimiento->execute([
            ':id_usuario' => $idUsuario,
            ':fecha_limite' => $fechaLimite
        ]);

        $garantiasVencimiento = $stmtGarantiasVencimiento->fetchAll(PDO::FETCH_ASSOC);
        escribirLog("Garantías próximas a vencer: " . count($garantiasVencimiento));

        foreach ($garantiasVencimiento as $garantia) {
            $diasRestantes = floor((strtotime($garantia['fecha_fin']) - time()) / (60 * 60 * 24));

            // Solo notificar si no se ha notificado recientemente (evitar spam)
            $idNotificacion = 'vencimiento_' . $garantia['id_garantia'] . '_' . date('Y-m-d');

            $notificaciones[] = [
                'id' => $idNotificacion,
                'tipo' => 'vencimiento_garantia',
                'titulo' => 'Garantía próxima a vencer',
                'mensaje' => 'La garantía de tu bicicleta ' . $garantia['marca_bicicleta'] . ' ' . $garantia['modelo_bicicleta'] . ' (' . $garantia['zona_afectada'] . ') vencerá en ' . $diasRestantes . ' días (' . date('d/m/Y', strtotime($garantia['fecha_fin'])) . ')',
                'fecha' => date('Y-m-d H:i:s'), // Fecha actual para la notificación
                'id_cotizacion' => $garantia['id_garantia'],
                'estado_garantia' => $garantia['estado'],
                'fecha_fin' => $garantia['fecha_fin'],
                'dias_restantes' => $diasRestantes
            ];
        }
    } catch (PDOException $e) {
        escribirLog("Error en consulta de vencimientos de garantías: " . $e->getMessage());
    }


    // Ordenar notificaciones por fecha (más recientes primero)
    usort($notificaciones, function($a, $b) {
        return strtotime($b['fecha']) - strtotime($a['fecha']);
    });

    escribirLog("Notificaciones encontradas: " . count($notificaciones));
    escribirLog("=== FIN: Notificaciones obtenidas correctamente ===");

    responder([
        'success' => true,
        'message' => 'Notificaciones obtenidas correctamente',
        'notificaciones' => $notificaciones,
        'total' => count($notificaciones)
    ]);

} catch (PDOException $e) {
    escribirLog("ERROR: Excepción PDO: " . $e->getMessage());
    responder(['success' => false, 'message' => 'Error de BD: ' . $e->getMessage(), 'notificaciones' => []], 500);
} catch (Throwable $e) {
    escribirLog("ERROR: Excepción capturada: " . $e->getMessage());
    responder(['success' => false, 'message' => $e->getMessage(), 'notificaciones' => []], 500);
}
?>