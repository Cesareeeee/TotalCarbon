<?php
session_start();
header('Content-Type: application/json');

require_once __DIR__ . '/../../modelos/php/conexion.php';

if (!isset($_SESSION['id_usuario'])) {
    http_response_code(401);
    echo json_encode(['ok' => false, 'error' => 'No autenticado']);
    exit;
}

$id_usuario = (int)$_SESSION['id_usuario'];
$accion = $_GET['accion'] ?? ($_POST['accion'] ?? '');

function responder($data) {
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    $db = Conexion::getConexion();
} catch (Throwable $e) {
    http_response_code(500);
    responder(['ok' => false, 'error' => 'Error de conexión']);
}

switch ($accion) {
    case 'notificaciones_listar': {
        try {
            $stmt = $db->prepare("SELECT id_notificacion, titulo, mensaje, tipo, leida, creada_en
                                   FROM notificaciones
                                   WHERE id_usuario_destino = ?
                                   ORDER BY leida ASC, creada_en DESC
                                   LIMIT 30");
            $stmt->execute([$id_usuario]);
            $notificaciones = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $stmt2 = $db->prepare("SELECT COUNT(*) AS pendientes FROM notificaciones WHERE id_usuario_destino = ? AND leida = 0");
            $stmt2->execute([$id_usuario]);
            $pendientes = (int)$stmt2->fetch(PDO::FETCH_ASSOC)['pendientes'];

            responder(['ok' => true, 'pendientes' => $pendientes, 'notificaciones' => $notificaciones]);
        } catch (Throwable $e) {
            http_response_code(500);
            responder(['ok' => false, 'error' => 'Error al obtener notificaciones']);
        }
        break;
    }

    case 'notificaciones_marcar_leidas': {
        try {
            $stmt = $db->prepare("UPDATE notificaciones SET leida = 1 WHERE id_usuario_destino = ? AND leida = 0");
            $stmt->execute([$id_usuario]);
            responder(['ok' => true]);
        } catch (Throwable $e) {
            http_response_code(500);
            responder(['ok' => false, 'error' => 'Error al marcar como leídas']);
        }
        break;
    }

    case 'chat_listar': {
        // Obtiene o crea conversación cliente-admin y devuelve historial
        try {
            // Buscar un admin (primer admin activo)
            $stmtAdmin = $db->prepare("SELECT id_usuario FROM usuarios WHERE id_rol = 1 AND estado_usuario = 1 ORDER BY id_usuario ASC LIMIT 1");
            $stmtAdmin->execute();
            $rowAdmin = $stmtAdmin->fetch(PDO::FETCH_ASSOC);
            $id_admin = $rowAdmin ? (int)$rowAdmin['id_usuario'] : null;

            // Buscar conversación abierta del cliente
            $stmtC = $db->prepare("SELECT id_conversacion FROM conversaciones WHERE id_cliente = ? AND estado = 'abierta' ORDER BY actualizada_en DESC LIMIT 1");
            $stmtC->execute([$id_usuario]);
            $rowC = $stmtC->fetch(PDO::FETCH_ASSOC);

            if (!$rowC) {
                // Crear conversación
                $stmtIns = $db->prepare("INSERT INTO conversaciones (id_cliente, id_administrador, asunto) VALUES (?, ?, ?)");
                $asunto = 'Soporte con mi servicio';
                $stmtIns->execute([$id_usuario, $id_admin, $asunto]);
                $id_conversacion = (int)$db->lastInsertId();
            } else {
                $id_conversacion = (int)$rowC['id_conversacion'];
            }

            $stmtM = $db->prepare("SELECT id_mensaje, id_remitente, rol_remitente, contenido, leido_por_destinatario, creado_en
                                   FROM mensajes_chat
                                   WHERE id_conversacion = ?
                                   ORDER BY creado_en ASC");
            $stmtM->execute([$id_conversacion]);
            $mensajes = $stmtM->fetchAll(PDO::FETCH_ASSOC);

            responder(['ok' => true, 'id_conversacion' => $id_conversacion, 'mensajes' => $mensajes]);
        } catch (Throwable $e) {
            http_response_code(500);
            responder(['ok' => false, 'error' => 'Error al obtener el chat']);
        }
        break;
    }

    case 'chat_enviar': {
        $id_conversacion = isset($_POST['id_conversacion']) ? (int)$_POST['id_conversacion'] : 0;
        $contenido = trim($_POST['contenido'] ?? '');
        if ($id_conversacion <= 0 || $contenido === '') {
            http_response_code(400);
            responder(['ok' => false, 'error' => 'Datos incompletos']);
        }
        try {
            // Verificar que la conversación pertenece al usuario
            $stmtV = $db->prepare("SELECT id_conversacion FROM conversaciones WHERE id_conversacion = ? AND id_cliente = ?");
            $stmtV->execute([$id_conversacion, $id_usuario]);
            if (!$stmtV->fetch()) {
                http_response_code(403);
                responder(['ok' => false, 'error' => 'No autorizado']);
            }

            $stmt = $db->prepare("INSERT INTO mensajes_chat (id_conversacion, id_remitente, rol_remitente, contenido) VALUES (?, ?, 'cliente', ?)");
            $stmt->execute([$id_conversacion, $id_usuario, $contenido]);

            // Actualizar timestamp de conversación
            $db->prepare("UPDATE conversaciones SET actualizada_en = CURRENT_TIMESTAMP WHERE id_conversacion = ?")
               ->execute([$id_conversacion]);

            responder(['ok' => true]);
        } catch (Throwable $e) {
            http_response_code(500);
            responder(['ok' => false, 'error' => 'Error al enviar mensaje']);
        }
        break;
    }

    default:
        http_response_code(400);
        responder(['ok' => false, 'error' => 'Acción no válida']);
}
