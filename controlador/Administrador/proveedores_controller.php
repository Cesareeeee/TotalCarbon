<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once '../../modelos/php/database.php';

function getProveedores() {
    try {
        $conexion = getConexion();

        $query = "SELECT * FROM proveedores ORDER BY creado_en DESC";
        $result = $conexion->query($query);

        if (!$result) {
            $conexion->close();
            return ['success' => false, 'error' => 'Query failed: ' . $conexion->error];
        }

        $proveedores = [];
        while ($row = $result->fetch_assoc()) {
            $proveedores[] = $row;
        }

        $conexion->close();
        return $proveedores;
    } catch (Exception $e) {
        return ['success' => false, 'error' => 'Database error: ' . $e->getMessage()];
    }
}

function getProveedor($id) {
    try {
        $conexion = getConexion();

        $query = "SELECT * FROM proveedores WHERE id_proveedor = ?";
        $stmt = $conexion->prepare($query);
        if (!$stmt) {
            $conexion->close();
            return ['success' => false, 'error' => 'Prepare failed: ' . $conexion->error];
        }

        $stmt->bind_param('i', $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $proveedor = $result->fetch_assoc();

        $conexion->close();
        return $proveedor;
    } catch (Exception $e) {
        return ['success' => false, 'error' => 'Database error: ' . $e->getMessage()];
    }
}

function createProveedor($data) {
    try {
        $conexion = getConexion();

        $query = "INSERT INTO proveedores (nombre_proveedor, contacto, telefono, correo, direccion, notas_proveedor) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $conexion->prepare($query);
        if (!$stmt) {
            $conexion->close();
            return ['success' => false, 'error' => 'Prepare failed: ' . $conexion->error];
        }

        $stmt->bind_param('ssssss', $data['nombre_proveedor'], $data['contacto'], $data['telefono'], $data['correo'], $data['direccion'], $data['notas_proveedor']);

        $response = [];
        if ($stmt->execute()) {
            $response['success'] = true;
            $response['id'] = $stmt->insert_id;
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

function updateProveedor($id, $data) {
    try {
        $conexion = getConexion();

        $query = "UPDATE proveedores SET nombre_proveedor = ?, contacto = ?, telefono = ?, correo = ?, direccion = ?, notas_proveedor = ? WHERE id_proveedor = ?";
        $stmt = $conexion->prepare($query);
        if (!$stmt) {
            $conexion->close();
            return ['success' => false, 'error' => 'Prepare failed: ' . $conexion->error];
        }

        $stmt->bind_param('ssssssi', $data['nombre_proveedor'], $data['contacto'], $data['telefono'], $data['correo'], $data['direccion'], $data['notas_proveedor'], $id);

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

function deleteProveedor($id) {
    try {
        $conexion = getConexion();

        // Verificar si el proveedor tiene piezas asociadas
        $checkQuery = "SELECT COUNT(*) as count FROM piezas_movimientos WHERE proveedor_id = ?";
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
                'error' => 'No se puede eliminar el proveedor porque tiene piezas asociadas.'
            ];
        }

        $query = "DELETE FROM proveedores WHERE id_proveedor = ?";
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
        case 'getProveedores':
            $result = getProveedores();
            echo json_encode($result);
            break;
        case 'getProveedor':
            $id = $_GET['id'] ?? 0;
            $result = getProveedor($id);
            echo json_encode($result);
            break;
        case 'createProveedor':
            $data = json_decode(file_get_contents('php://input'), true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                echo json_encode(['success' => false, 'error' => 'Invalid JSON data']);
                break;
            }
            $result = createProveedor($data);
            echo json_encode($result);
            break;
        case 'updateProveedor':
            $id = $_GET['id'] ?? 0;
            $data = json_decode(file_get_contents('php://input'), true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                echo json_encode(['success' => false, 'error' => 'Invalid JSON data']);
                break;
            }
            $result = updateProveedor($id, $data);
            echo json_encode($result);
            break;
        case 'deleteProveedor':
            $id = $_GET['id'] ?? 0;
            $result = deleteProveedor($id);
            echo json_encode($result);
            break;
        default:
            echo json_encode(['success' => false, 'error' => 'Invalid action']);
            break;
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => 'Server error: ' . $e->getMessage()]);
}