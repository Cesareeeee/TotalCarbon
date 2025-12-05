<?php
require_once '../../modelos/php/conexion.php';

function getMensajesCliente($id_cliente) {
    $conexion = new mysqli('localhost', 'root', '', 'totalcarbon');
    if ($conexion->connect_error) {
        die("Connection failed: " . $conexion->connect_error);
    }

    $query = "SELECT m.*, u.nombres, u.apellidos,
                      CASE
                          WHEN m.id_emisor = ? THEN 'cliente'
                          ELSE 'admin'
                      END as tipo_remitente
               FROM chat_mensajes m
               LEFT JOIN usuarios u ON m.id_emisor = u.id_usuario
               WHERE (m.id_emisor = ? AND m.id_receptor = 1) OR (m.id_emisor = 1 AND m.id_receptor = ?)
               ORDER BY m.creado_en ASC";

    $stmt = $conexion->prepare($query);
    $stmt->bind_param('iii', $id_cliente, $id_cliente, $id_cliente);
    $stmt->execute();
    $result = $stmt->get_result();

    $mensajes = [];
    while ($row = $result->fetch_assoc()) {
        $mensajes[] = $row;
    }

    $conexion->close();
    return $mensajes;
}

function enviarMensajeCliente($id_cliente, $mensaje) {
    $conexion = new mysqli('localhost', 'root', '', 'totalcarbon');
    if ($conexion->connect_error) {
        die("Connection failed: " . $conexion->connect_error);
    }

    $query = "INSERT INTO chat_mensajes (id_emisor, id_receptor, mensaje, leido) VALUES (?, 1, ?, 0)";
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
}

function getMensajesNoLeidosCliente($id_cliente) {
    $conexion = new mysqli('localhost', 'root', '', 'totalcarbon');
    if ($conexion->connect_error) {
        die("Connection failed: " . $conexion->connect_error);
    }

    $query = "SELECT COUNT(*) as no_leidos FROM chat_mensajes WHERE id_receptor = ? AND leido = 0";
    $stmt = $conexion->prepare($query);
    $stmt->bind_param('i', $id_cliente);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();

    $conexion->close();
    return $row['no_leidos'];
}

function marcarMensajesLeidosCliente($id_cliente) {
    $conexion = new mysqli('localhost', 'root', '', 'totalcarbon');
    if ($conexion->connect_error) {
        die("Connection failed: " . $conexion->connect_error);
    }

    $query = "UPDATE chat_mensajes SET leido = 1 WHERE id_receptor = ? AND leido = 0";
    $stmt = $conexion->prepare($query);
    $stmt->bind_param('i', $id_cliente);

    $response = [];
    if ($stmt->execute()) {
        $response['success'] = true;
    } else {
        $response['success'] = false;
        $response['error'] = $stmt->error;
    }

    $conexion->close();
    return $response;
}

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'getMensajes':
        session_start();
        $id_cliente = $_SESSION['id_usuario'] ?? 0;
        echo json_encode(getMensajesCliente($id_cliente));
        break;

    case 'enviarMensaje':
        session_start();
        $id_cliente = $_SESSION['id_usuario'] ?? 0;
        $data = json_decode(file_get_contents('php://input'), true);
        echo json_encode(enviarMensajeCliente($id_cliente, $data['mensaje']));
        break;

    case 'getMensajesNoLeidos':
        session_start();
        $id_cliente = $_SESSION['id_usuario'] ?? 0;
        echo json_encode(['no_leidos' => getMensajesNoLeidosCliente($id_cliente)]);
        break;

    case 'marcarLeidos':
        session_start();
        $id_cliente = $_SESSION['id_usuario'] ?? 0;
        echo json_encode(marcarMensajesLeidosCliente($id_cliente));
        break;

    default:
        echo json_encode(['error' => 'Invalid action']);
        break;
}
?>