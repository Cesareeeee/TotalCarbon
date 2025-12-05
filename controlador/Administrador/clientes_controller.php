<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once '../../modelos/php/conexion.php';

function getClientes($order = 'desc') {
    try {
        $conexion = new mysqli('localhost', 'root', '', 'totalcarbon');
        if ($conexion->connect_error) {
            return ['success' => false, 'error' => 'Connection failed: ' . $conexion->connect_error];
        }

        $orderBy = $order === 'asc' ? 'creado_en ASC' : 'creado_en DESC';
        $query = "SELECT * FROM usuarios WHERE id_rol = 2 ORDER BY $orderBy";
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

function getCliente($id) {
    try {
        $conexion = new mysqli('localhost', 'root', '', 'totalcarbon');
        if ($conexion->connect_error) {
            return ['success' => false, 'error' => 'Connection failed: ' . $conexion->connect_error];
        }

        $query = "SELECT * FROM usuarios WHERE id_usuario = ? AND id_rol = 2";
        $stmt = $conexion->prepare($query);
        if (!$stmt) {
            $conexion->close();
            return ['success' => false, 'error' => 'Prepare failed: ' . $conexion->error];
        }

        $stmt->bind_param('i', $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $cliente = $result->fetch_assoc();

        $conexion->close();
        return $cliente;
    } catch (Exception $e) {
        return ['success' => false, 'error' => 'Database error: ' . $e->getMessage()];
    }
}

function getServiciosCliente($id_cliente) {
    try {
        $conexion = new mysqli('localhost', 'root', '', 'totalcarbon');
        if ($conexion->connect_error) {
            return ['success' => false, 'error' => 'Connection failed: ' . $conexion->connect_error];
        }

        $query = "SELECT cc.*, GROUP_CONCAT(ci.ruta_imagen) as imagenes FROM cotizaciones_cliente cc LEFT JOIN cotizacion_imagenes_cliente ci ON cc.id_cotizacion = ci.id_cotizacion WHERE cc.id_usuario = ? GROUP BY cc.id_cotizacion ORDER BY cc.creado_en DESC";
        $stmt = $conexion->prepare($query);
        if (!$stmt) {
            $conexion->close();
            return ['success' => false, 'error' => 'Prepare failed: ' . $conexion->error];
        }

        $stmt->bind_param('i', $id_cliente);
        $stmt->execute();
        $result = $stmt->get_result();

        $servicios = [];
        while ($row = $result->fetch_assoc()) {
            $servicios[] = $row;
        }

        $conexion->close();
        return $servicios;
    } catch (Exception $e) {
        return ['success' => false, 'error' => 'Database error: ' . $e->getMessage()];
    }
}

function createCliente($data) {
    try {
        $conexion = new mysqli('localhost', 'root', '', 'totalcarbon');
        if ($conexion->connect_error) {
            return ['success' => false, 'error' => 'Connection failed: ' . $conexion->connect_error];
        }

        // Generar código secuencial para el usuario
        $queryMax = "SELECT MAX(CAST(SUBSTRING(codigo_usuario, 3) AS UNSIGNED)) as max_num FROM usuarios WHERE codigo_usuario LIKE 'TC%'";
        $resultMax = $conexion->query($queryMax);
        $maxNum = $resultMax->fetch_assoc()['max_num'] ?? 0;
        $nextNum = $maxNum + 1;
        $codigo_usuario = 'TC' . str_pad($nextNum, 5, '0', STR_PAD_LEFT);

        // Encriptar contraseña
        $contrasena_encriptada = password_hash($data['contrasena'], PASSWORD_DEFAULT);

        $query = "INSERT INTO usuarios (codigo_usuario, nombres, apellidos, correo_electronico, numero_telefono, direccion, ciudad, estado, contrasena, id_rol, estado_usuario) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 2, ?)";
        $stmt = $conexion->prepare($query);
        if (!$stmt) {
            $conexion->close();
            return ['success' => false, 'error' => 'Prepare failed: ' . $conexion->error];
        }

        $stmt->bind_param('sssssssssi', $codigo_usuario, $data['nombres'], $data['apellidos'], $data['correo_electronico'], $data['numero_telefono'], $data['direccion'], $data['ciudad'], $data['estado'], $contrasena_encriptada, $data['estado_usuario']);

        $response = [];
        if ($stmt->execute()) {
            $response['success'] = true;
            $response['id'] = $stmt->insert_id;
            $response['codigo_usuario'] = $codigo_usuario;
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

function updateCliente($id, $data) {
    try {
        $conexion = new mysqli('localhost', 'root', '', 'totalcarbon');
        if ($conexion->connect_error) {
            return ['success' => false, 'error' => 'Connection failed: ' . $conexion->connect_error];
        }

        // Si se proporciona contraseña, encriptarla
        $updateFields = "nombres = ?, apellidos = ?, correo_electronico = ?, numero_telefono = ?, direccion = ?, ciudad = ?, estado = ?, estado_usuario = ?, actualizado_en = NOW()";
        $bindTypes = 'sssssssis';
        $bindValues = [$data['nombres'], $data['apellidos'], $data['correo_electronico'], $data['numero_telefono'], $data['direccion'], $data['ciudad'], $data['estado'], $data['estado_usuario'], $id];

        if (isset($data['contrasena']) && !empty($data['contrasena'])) {
            $contrasena_encriptada = password_hash($data['contrasena'], PASSWORD_DEFAULT);
            $updateFields .= ", contrasena = ?";
            $bindTypes = 'sssssssis' . substr($bindTypes, -1);
            array_splice($bindValues, -1, 0, $contrasena_encriptada);
        }

        $query = "UPDATE usuarios SET $updateFields WHERE id_usuario = ? AND id_rol = 2";
        $stmt = $conexion->prepare($query);
        if (!$stmt) {
            $conexion->close();
            return ['success' => false, 'error' => 'Prepare failed: ' . $conexion->error];
        }

        $stmt->bind_param($bindTypes, ...$bindValues);

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

function deleteCliente($id) {
    try {
        $conexion = new mysqli('localhost', 'root', '', 'totalcarbon');
        if ($conexion->connect_error) {
            return ['success' => false, 'error' => 'Connection failed: ' . $conexion->connect_error];
        }

        // Verificar si el cliente tiene servicios asociados
        $checkQuery = "SELECT COUNT(*) as count FROM cotizaciones_cliente WHERE id_usuario = ?";
        $checkStmt = $conexion->prepare($checkQuery);
        if (!$checkStmt) {
            $conexion->close();
            return ['success' => false, 'error' => 'Prepare failed: ' . $conexion->error];
        }

        $checkStmt->bind_param('i', $id);
        $checkStmt->execute();
        $checkResult = $checkStmt->get_result();
        $count = $checkResult->fetch_assoc()['count'];

        if ($count > 0) {
            $conexion->close();
            return [
                'success' => false,
                'error' => 'No se puede eliminar el cliente porque tiene servicios asociados.'
            ];
        }

        $query = "DELETE FROM usuarios WHERE id_usuario = ? AND id_rol = 2";
        $stmt = $conexion->prepare($query);
        if (!$stmt) {
            $conexion->close();
            return ['success' => false, 'error' => 'Prepare failed: ' . $conexion->error];
        }

        $stmt->bind_param('i', $id);

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
        case 'getClientes':
            $order = $_GET['order'] ?? 'desc';
            $result = getClientes($order);
            echo json_encode($result);
            break;
        case 'getCliente':
            $id = $_GET['id'] ?? 0;
            $result = getCliente($id);
            echo json_encode($result);
            break;
        case 'getServiciosCliente':
            $id_cliente = $_GET['id_cliente'] ?? 0;
            $result = getServiciosCliente($id_cliente);
            echo json_encode($result);
            break;
        case 'createCliente':
            $data = json_decode(file_get_contents('php://input'), true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                echo json_encode(['success' => false, 'error' => 'Invalid JSON data']);
                break;
            }
            $result = createCliente($data);
            echo json_encode($result);
            break;
        case 'updateCliente':
            $id = $_GET['id'] ?? 0;
            $data = json_decode(file_get_contents('php://input'), true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                echo json_encode(['success' => false, 'error' => 'Invalid JSON data']);
                break;
            }
            $result = updateCliente($id, $data);
            echo json_encode($result);
            break;
        case 'deleteCliente':
            $id = $_GET['id'] ?? 0;
            $result = deleteCliente($id);
            echo json_encode($result);
            break;
        default:
            echo json_encode(['success' => false, 'error' => 'Invalid action']);
            break;
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => 'Server error: ' . $e->getMessage()]);
}