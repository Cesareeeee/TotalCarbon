<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once '../../modelos/php/conexion.php';

function getConversaciones() {
    try {
        $conexion = new mysqli('localhost', 'root', '', 'totalcarbon');
        if ($conexion->connect_error) {
            return ['success' => false, 'error' => 'Connection failed: ' . $conexion->connect_error];
        }

        // Obtener todos los clientes con el último mensaje si existe
        $query = "SELECT
                    u.id_usuario,
                    u.nombres,
                    u.apellidos,
                    u.correo_electronico,
                    u.numero_telefono,
                    u.estado_usuario,
                    (SELECT mensaje FROM chat_mensajes WHERE (id_emisor = u.id_usuario AND id_receptor = 13) OR (id_emisor = 13 AND id_receptor = u.id_usuario) ORDER BY creado_en DESC LIMIT 1) as ultimo_mensaje,
                    (SELECT creado_en FROM chat_mensajes WHERE (id_emisor = u.id_usuario AND id_receptor = 13) OR (id_emisor = 13 AND id_receptor = u.id_usuario) ORDER BY creado_en DESC LIMIT 1) as ultimo_mensaje_fecha,
                    (SELECT leido FROM chat_mensajes WHERE (id_emisor = u.id_usuario AND id_receptor = 13) OR (id_emisor = 13 AND id_receptor = u.id_usuario) ORDER BY creado_en DESC LIMIT 1) as leido,
                    (SELECT COUNT(*) FROM chat_mensajes WHERE id_emisor = u.id_usuario AND id_receptor = 13 AND leido = 0) as mensajes_no_leidos
                  FROM usuarios u
                  WHERE u.id_rol = 2 AND u.estado_usuario = 1
                  ORDER BY COALESCE((SELECT creado_en FROM chat_mensajes WHERE (id_emisor = u.id_usuario AND id_receptor = 13) OR (id_emisor = 13 AND id_receptor = u.id_usuario) ORDER BY creado_en DESC LIMIT 1), '1970-01-01') DESC";

        $result = $conexion->query($query);
        if (!$result) {
            $conexion->close();
            return ['success' => false, 'error' => 'Query failed: ' . $conexion->error];
        }

        $conversaciones = [];
        while ($row = $result->fetch_assoc()) {
            $conversaciones[] = $row;
        }

        $conexion->close();
        return $conversaciones;
    } catch (Exception $e) {
        return ['success' => false, 'error' => 'Database error: ' . $e->getMessage()];
    }
}

function getMensajesConversacion($id_cliente) {
    try {
        $conexion = new mysqli('localhost', 'root', '', 'totalcarbon');
        if ($conexion->connect_error) {
            return ['success' => false, 'error' => 'Connection failed: ' . $conexion->connect_error];
        }

        // Marcar mensajes como leídos
        $updateQuery = "UPDATE chat_mensajes SET leido = 1 WHERE id_emisor = ? AND id_receptor = 13 AND leido = 0";
        $updateStmt = $conexion->prepare($updateQuery);
        $updateStmt->bind_param('i', $id_cliente);
        $updateStmt->execute();

        // Obtener mensajes de la conversación
        $query = "SELECT
                    m.id_mensaje,
                    m.mensaje,
                    m.creado_en,
                    m.leido,
                    u.nombres,
                    u.apellidos,
                    CASE WHEN m.id_emisor = 13 THEN 'admin' ELSE 'cliente' END as tipo_remitente
                  FROM chat_mensajes m
                  JOIN usuarios u ON u.id_usuario = m.id_emisor
                  WHERE (m.id_emisor = ? AND m.id_receptor = 13) OR (m.id_emisor = 13 AND m.id_receptor = ?)
                  ORDER BY m.creado_en ASC";

        $stmt = $conexion->prepare($query);
        $stmt->bind_param('ii', $id_cliente, $id_cliente);
        $stmt->execute();
        $result = $stmt->get_result();

        $mensajes = [];
        while ($row = $result->fetch_assoc()) {
            $mensajes[] = $row;
        }

        $conexion->close();
        return $mensajes;
    } catch (Exception $e) {
        return ['success' => false, 'error' => 'Database error: ' . $e->getMessage()];
    }
}

function enviarMensaje($id_cliente, $mensaje) {
    try {
        $conexion = new mysqli('localhost', 'root', '', 'totalcarbon');
        if ($conexion->connect_error) {
            return ['success' => false, 'error' => 'Connection failed: ' . $conexion->connect_error];
        }

        $query = "INSERT INTO chat_mensajes (id_emisor, id_receptor, mensaje, leido) VALUES (13, ?, ?, 0)";
        $stmt = $conexion->prepare($query);
        $stmt->bind_param('is', $id_cliente, $mensaje);

        $response = [];
        if ($stmt->execute()) {
            $response['success'] = true;
            $response['id_mensaje'] = $stmt->insert_id;
        } else {
            $response['success'] = false;
            $response['error'] = $stmt->error;
        }

        $conexion->close();
        return $response;
    } catch (Exception $e) {
        return ['success' => false, 'error' => 'Database error: ' . $e->getMessage()];
    }
}

function getClientes() {
    try {
        $conexion = new mysqli('localhost', 'root', '', 'totalcarbon');
        if ($conexion->connect_error) {
            return ['success' => false, 'error' => 'Connection failed: ' . $conexion->connect_error];
        }

        // Obtener todos los clientes registrados
        $query = "SELECT id_usuario, nombres, apellidos, correo_electronico, estado_usuario
                  FROM usuarios
                  WHERE id_rol = 2
                  ORDER BY nombres ASC";

        $result = $conexion->query($query);
        if (!$result) {
            $conexion->close();
            return ['success' => false, 'error' => 'Query failed: ' . $conexion->error];
        }

        $clientes = [];
        while ($row = $result->fetch_assoc()) {
            $clientes[] = $row;
        }

        $conexion->close();
        return $clientes;
    } catch (Exception $e) {
        return ['success' => false, 'error' => 'Database error: ' . $e->getMessage()];
    }
}

function getNotificaciones() {
    try {
        $conexion = new mysqli('localhost', 'root', '', 'totalcarbon');
        if ($conexion->connect_error) {
            return ['success' => false, 'error' => 'Connection failed: ' . $conexion->connect_error];
        }

        // Mensajes no leídos
        $mensajesQuery = "SELECT COUNT(*) as total FROM chat_mensajes WHERE id_receptor = 13 AND leido = 0";
        $mensajesResult = $conexion->query($mensajesQuery);
        $mensajesNoLeidos = $mensajesResult->fetch_assoc()['total'];

        // Nuevas cotizaciones
        $cotizacionesQuery = "SELECT COUNT(*) as total FROM cotizaciones WHERE estado = 'PENDIENTE'";
        $cotizacionesResult = $conexion->query($cotizacionesQuery);
        $cotizacionesPendientes = $cotizacionesResult->fetch_assoc()['total'];

        $conexion->close();

        return [
            'mensajes_no_leidos' => $mensajesNoLeidos,
            'cotizaciones_pendientes' => $cotizacionesPendientes,
            'total_notificaciones' => $mensajesNoLeidos + $cotizacionesPendientes
        ];
    } catch (Exception $e) {
        return ['success' => false, 'error' => 'Database error: ' . $e->getMessage()];
    }
}

function borrarConversacion($id_cliente) {
    try {
        $conexion = new mysqli('localhost', 'root', '', 'totalcarbon');
        if ($conexion->connect_error) {
            return ['success' => false, 'error' => 'Connection failed: ' . $conexion->connect_error];
        }

        $query = "DELETE FROM chat_mensajes WHERE (id_emisor = ? AND id_receptor = 13) OR (id_emisor = 13 AND id_receptor = ?)";
        $stmt = $conexion->prepare($query);
        $stmt->bind_param('ii', $id_cliente, $id_cliente);

        $response = [];
        if ($stmt->execute()) {
            $response['success'] = true;
        } else {
            $response['success'] = false;
            $response['error'] = $stmt->error;
        }

        $conexion->close();
        return $response;
    } catch (Exception $e) {
        return ['success' => false, 'error' => 'Database error: ' . $e->getMessage()];
    }
}

$action = $_GET['action'] ?? '';

try {
    switch ($action) {
        case 'getConversaciones':
            $result = getConversaciones();
            echo json_encode($result);
            break;
        case 'getMensajesConversacion':
            $id_cliente = $_GET['id_cliente'] ?? 0;
            $result = getMensajesConversacion($id_cliente);
            echo json_encode($result);
            break;
        case 'enviarMensaje':
            $data = json_decode(file_get_contents('php://input'), true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                echo json_encode(['success' => false, 'error' => 'Invalid JSON data']);
                break;
            }
            $result = enviarMensaje($data['id_cliente'], $data['mensaje']);
            echo json_encode($result);
            break;
        case 'getClientes':
            $result = getClientes();
            echo json_encode($result);
            break;
        case 'getNotificaciones':
            $result = getNotificaciones();
            echo json_encode($result);
            break;
        case 'borrarConversacion':
            $id_cliente = $_GET['id_cliente'] ?? 0;
            $result = borrarConversacion($id_cliente);
            echo json_encode($result);
            break;
        default:
            echo json_encode(['success' => false, 'error' => 'Invalid action']);
            break;
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => 'Server error: ' . $e->getMessage()]);
}