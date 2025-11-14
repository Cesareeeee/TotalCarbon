<?php
// Desactivar mostrar errores para evitar HTML en JSON
ini_set('display_errors', 1);
error_reporting(E_ALL);

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
    error_log("Intentando eliminar proveedor ID: $id");

    $conexion = new mysqli('localhost', 'root', '', 'totalcarbon');
    if ($conexion->connect_error) {
        error_log("Error de conexión: " . $conexion->connect_error);
        return [
            'success' => false,
            'error' => 'Error de conexión a la base de datos'
        ];
    }

    // Verificar si el proveedor tiene productos asociados
    $checkQuery = "SELECT COUNT(*) as count FROM compras_proveedores WHERE proveedor_id = ?";
    $checkStmt = $conexion->prepare($checkQuery);
    $checkStmt->bind_param('i', $id);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();
    $count = $checkResult->fetch_assoc()['count'];
    error_log("Productos asociados encontrados: $count");

    if ($count > 0) {
        $conexion->close();
        error_log("No se puede eliminar: tiene productos asociados");
        return [
            'success' => false,
            'error' => 'No se puede eliminar el proveedor porque tiene productos asociados.'
        ];
    }

    // No necesitamos hacer nada con las cotizaciones, MySQL las maneja automáticamente con ON DELETE SET NULL
    error_log("Eliminando proveedor ID: $id (MySQL manejará las claves foráneas automáticamente)");

    // Ahora eliminar el proveedor
    error_log("Eliminando proveedor ID: $id");
    $query = "DELETE FROM proveedores WHERE id_proveedor = ?";
    $stmt = $conexion->prepare($query);
    if ($stmt) {
        $stmt->bind_param('i', $id);

        $response = [];
        if ($stmt->execute()) {
            error_log("Proveedor eliminado exitosamente");
            $response['success'] = true;
        } else {
            error_log("Error al eliminar proveedor: " . $stmt->error);
            $response['success'] = false;
            $response['error'] = 'Error eliminando proveedor: ' . $stmt->error;
        }
    } else {
        error_log("Error preparando consulta de eliminación de proveedor: " . $conexion->error);
        $response = [
            'success' => false,
            'error' => 'Error preparando consulta de proveedor: ' . $conexion->error
        ];
    }

    $conexion->close();
    return $response;
}

// Establecer headers JSON
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-cache, must-revalidate');

$action = $_GET['action'] ?? '';

try {
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
            error_log("ID recibido para eliminar: " . $id);
            echo json_encode(deleteProveedor($id));
            break;
        default:
            echo json_encode(['error' => 'Invalid action']);
            break;
    }
} catch (Exception $e) {
    error_log("Error en proveedores_controller.php: " . $e->getMessage());
    error_log("Stack trace: " . $e->getTraceAsString());
    echo json_encode(['success' => false, 'error' => 'Error interno del servidor: ' . $e->getMessage()]);
}
