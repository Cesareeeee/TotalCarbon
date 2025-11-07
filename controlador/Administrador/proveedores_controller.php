<?php
require_once '../../modelos/php/conexion.php';

function getProveedores() {
    $conexion = new mysqli('localhost', 'root', '', 'totalcarbon');
    if ($conexion->connect_error) {
        die("Connection failed: " . $conexion->connect_error);
    }

    $query = "SELECT p.*, GROUP_CONCAT(cp.nombre_producto SEPARATOR ', ') as productos_comprados FROM proveedores p LEFT JOIN compras_proveedores cp ON p.id_proveedor = cp.proveedor_id GROUP BY p.id_proveedor";
    $result = $conexion->query($query);

    $proveedores = [];
    while ($row = $result->fetch_assoc()) {
        $proveedores[] = $row;
    }

    $conexion->close();
    return $proveedores;
}

function getProveedor($id) {
    $conexion = new mysqli('localhost', 'root', '', 'totalcarbon');
    if ($conexion->connect_error) {
        die("Connection failed: " . $conexion->connect_error);
    }

    $query = "SELECT p.*, GROUP_CONCAT(cp.nombre_producto SEPARATOR ', ') as productos_comprados FROM proveedores p LEFT JOIN compras_proveedores cp ON p.id_proveedor = cp.proveedor_id WHERE p.id_proveedor = ? GROUP BY p.id_proveedor";
    $stmt = $conexion->prepare($query);
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $proveedor = $result->fetch_assoc();

    $conexion->close();
    return $proveedor;
}

function createProveedor($data) {
    $conexion = new mysqli('localhost', 'root', '', 'totalcarbon');
    if ($conexion->connect_error) {
        die("Connection failed: " . $conexion->connect_error);
    }

    $query = "INSERT INTO proveedores (nombre_proveedor, contacto, telefono, correo, direccion) VALUES (?, ?, ?, ?, ?)";
    $stmt = $conexion->prepare($query);
    $stmt->bind_param('sssss', $data['nombre_proveedor'], $data['contacto'], $data['telefono'], $data['correo'], $data['direccion']);
    
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
}

function updateProveedor($id, $data) {
    $conexion = new mysqli('localhost', 'root', '', 'totalcarbon');
    if ($conexion->connect_error) {
        die("Connection failed: " . $conexion->connect_error);
    }

    $query = "UPDATE proveedores SET nombre_proveedor = ?, contacto = ?, telefono = ?, correo = ?, direccion = ? WHERE id_proveedor = ?";
    $stmt = $conexion->prepare($query);
    $stmt->bind_param('sssssi', $data['nombre_proveedor'], $data['contacto'], $data['telefono'], $data['correo'], $data['direccion'], $id);

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

function deleteProveedor($id) {
    $conexion = new mysqli('localhost', 'root', '', 'totalcarbon');
    if ($conexion->connect_error) {
        die("Connection failed: " . $conexion->connect_error);
    }

    // Verificar si el proveedor tiene productos asociados
    $checkQuery = "SELECT COUNT(*) as count FROM compras_proveedores WHERE proveedor_id = ?";
    $checkStmt = $conexion->prepare($checkQuery);
    $checkStmt->bind_param('i', $id);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();
    $count = $checkResult->fetch_assoc()['count'];

    if ($count > 0) {
        $conexion->close();
        return [
            'success' => false,
            'error' => 'No se puede eliminar el proveedor porque tiene productos asociados.'
        ];
    }

    $query = "DELETE FROM proveedores WHERE id_proveedor = ?";
    $stmt = $conexion->prepare($query);
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
}

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'getProveedores':
        echo json_encode(getProveedores());
        break;
    case 'getProveedor':
        $id = $_GET['id'] ?? 0;
        echo json_encode(getProveedor($id));
        break;
    case 'createProveedor':
        $data = json_decode(file_get_contents('php://input'), true);
        echo json_encode(createProveedor($data));
        break;
    case 'updateProveedor':
        $id = $_GET['id'] ?? 0;
        $data = json_decode(file_get_contents('php://input'), true);
        echo json_encode(updateProveedor($id, $data));
        break;
    case 'deleteProveedor':
        $id = $_GET['id'] ?? 0;
        echo json_encode(deleteProveedor($id));
        break;
    default:
        echo json_encode(['error' => 'Invalid action']);
        break;
}
