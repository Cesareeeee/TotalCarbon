<?php
require_once '../../modelos/php/conexion.php';

function getComprasProveedores() {
    $conexion = new mysqli('localhost', 'root', '', 'totalcarbon');
    if ($conexion->connect_error) {
        die("Connection failed: " . $conexion->connect_error);
    }

    $query = "SELECT cp.*, p.nombre_proveedor FROM compras_proveedores cp
              LEFT JOIN proveedores p ON cp.proveedor_id = p.id_proveedor
              ORDER BY cp.creado_en DESC";
    $result = $conexion->query($query);

    $compras = [];
    while ($row = $result->fetch_assoc()) {
        $compras[] = $row;
    }

    $conexion->close();
    return $compras;
}

function getCompraProveedor($id) {
    $conexion = new mysqli('localhost', 'root', '', 'totalcarbon');
    if ($conexion->connect_error) {
        die("Connection failed: " . $conexion->connect_error);
    }

    $query = "SELECT cp.*, p.nombre_proveedor FROM compras_proveedores cp
              LEFT JOIN proveedores p ON cp.proveedor_id = p.id_proveedor
              WHERE cp.id_compra = ?";
    $stmt = $conexion->prepare($query);
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $compra = $result->fetch_assoc();

    $conexion->close();
    return $compra;
}

function createCompraProveedor($data) {
    $conexion = new mysqli('localhost', 'root', '', 'totalcarbon');
    if ($conexion->connect_error) {
        die("Connection failed: " . $conexion->connect_error);
    }

    $query = "INSERT INTO compras_proveedores (proveedor_id, nombre_producto, descripcion, cantidad, precio_unitario, fecha_adquirido, numero_factura, notas) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conexion->prepare($query);
    $stmt->bind_param('issidsss', $data['proveedor_id'], $data['nombre_producto'], $data['descripcion'], $data['cantidad'], $data['precio_unitario'], $data['fecha_adquirido'], $data['numero_factura'], $data['notas']);

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

function updateCompraProveedor($id, $data) {
    $conexion = new mysqli('localhost', 'root', '', 'totalcarbon');
    if ($conexion->connect_error) {
        die("Connection failed: " . $conexion->connect_error);
    }

    $query = "UPDATE compras_proveedores SET proveedor_id = ?, nombre_producto = ?, descripcion = ?, cantidad = ?, precio_unitario = ?, fecha_adquirido = ?, numero_factura = ?, notas = ? WHERE id_compra = ?";
    $stmt = $conexion->prepare($query);
    $stmt->bind_param('issidsssi', $data['proveedor_id'], $data['nombre_producto'], $data['descripcion'], $data['cantidad'], $data['precio_unitario'], $data['fecha_adquirido'], $data['numero_factura'], $data['notas'], $id);

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

function deleteCompraProveedor($id) {
    $conexion = new mysqli('localhost', 'root', '', 'totalcarbon');
    if ($conexion->connect_error) {
        die("Connection failed: " . $conexion->connect_error);
    }

    $query = "DELETE FROM compras_proveedores WHERE id_compra = ?";
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

function getProveedoresForSelect() {
    $conexion = new mysqli('localhost', 'root', '', 'totalcarbon');
    if ($conexion->connect_error) {
        die("Connection failed: " . $conexion->connect_error);
    }

    $query = "SELECT id_proveedor, nombre_proveedor FROM proveedores ORDER BY nombre_proveedor";
    $result = $conexion->query($query);

    $proveedores = [];
    while ($row = $result->fetch_assoc()) {
        $proveedores[] = $row;
    }

    $conexion->close();
    return $proveedores;
}

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'getComprasProveedores':
        echo json_encode(getComprasProveedores());
        break;
    case 'getCompraProveedor':
        $id = $_GET['id'] ?? 0;
        echo json_encode(getCompraProveedor($id));
        break;
    case 'createCompraProveedor':
        $data = json_decode(file_get_contents('php://input'), true);
        echo json_encode(createCompraProveedor($data));
        break;
    case 'updateCompraProveedor':
        $id = $_GET['id'] ?? 0;
        $data = json_decode(file_get_contents('php://input'), true);
        echo json_encode(updateCompraProveedor($id, $data));
        break;
    case 'deleteCompraProveedor':
        $id = $_GET['id'] ?? 0;
        echo json_encode(deleteCompraProveedor($id));
        break;
    case 'getProveedoresForSelect':
        echo json_encode(getProveedoresForSelect());
        break;
    default:
        echo json_encode(['error' => 'Invalid action']);
        break;
}