<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once '../../modelos/php/conexion.php';

function getPiezas() {
    try {
        $conexion = new mysqli('localhost', 'root', '', 'totalcarbon');
        if ($conexion->connect_error) {
            return ['success' => false, 'error' => 'Connection failed: ' . $conexion->connect_error];
        }

        $query = "SELECT pm.*, p.nombre_proveedor, cc.nombre_completo as cliente
                  FROM piezas_movimientos pm
                  LEFT JOIN proveedores p ON pm.proveedor_id = p.id_proveedor
                  LEFT JOIN cotizaciones_cliente cc ON pm.id_cotizacion = cc.id_cotizacion
                  ORDER BY pm.creado_en DESC";
        $result = $conexion->query($query);

        if (!$result) {
            $conexion->close();
            return ['success' => false, 'error' => 'Query failed: ' . $conexion->error];
        }

        $piezas = [];
        while ($row = $result->fetch_assoc()) {
            $piezas[] = $row;
        }

        $conexion->close();
        return $piezas;
    } catch (Exception $e) {
        return ['success' => false, 'error' => 'Database error: ' . $e->getMessage()];
    }
}

function getPieza($id) {
    try {
        $conexion = new mysqli('localhost', 'root', '', 'totalcarbon');
        if ($conexion->connect_error) {
            return ['success' => false, 'error' => 'Connection failed: ' . $conexion->connect_error];
        }

        $query = "SELECT pm.*, p.nombre_proveedor, cc.nombre_completo as cliente
                  FROM piezas_movimientos pm
                  LEFT JOIN proveedores p ON pm.proveedor_id = p.id_proveedor
                  LEFT JOIN cotizaciones_cliente cc ON pm.id_cotizacion = cc.id_cotizacion
                  WHERE pm.id_movimiento = ?";
        $stmt = $conexion->prepare($query);
        if (!$stmt) {
            $conexion->close();
            return ['success' => false, 'error' => 'Prepare failed: ' . $conexion->error];
        }

        $stmt->bind_param('i', $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $pieza = $result->fetch_assoc();

        $conexion->close();
        return $pieza;
    } catch (Exception $e) {
        return ['success' => false, 'error' => 'Database error: ' . $e->getMessage()];
    }
}

function createPieza($data) {
    try {
        // Validación: si tipo es RECIBIDO o ENTREGADO, proveedor_id es requerido
        if (!empty($data['tipo']) && in_array($data['tipo'], ['RECIBIDO', 'ENTREGADO']) && empty($data['proveedor_id'])) {
            return ['success' => false, 'error' => 'Proveedor es requerido cuando el tipo es Recibida o Entregada.'];
        }

        $conexion = new mysqli('localhost', 'root', '', 'totalcarbon');
        if ($conexion->connect_error) {
            return ['success' => false, 'error' => 'Connection failed: ' . $conexion->connect_error];
        }

        $query = "INSERT INTO piezas_movimientos (tipo, nombre_pieza, codigo_pieza, cantidad, proveedor_id, nota) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $conexion->prepare($query);
        if (!$stmt) {
            $conexion->close();
            return ['success' => false, 'error' => 'Prepare failed: ' . $conexion->error];
        }

        $proveedor_id = !empty($data['proveedor_id']) ? $data['proveedor_id'] : null;
        $tipo = !empty($data['tipo']) ? $data['tipo'] : null;
        $stmt->bind_param('sssiss', $tipo, $data['nombre_pieza'], $data['codigo_pieza'], $data['cantidad'], $proveedor_id, $data['nota']);

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

function updatePieza($id, $data) {
    try {
        // Validación: si tipo es RECIBIDO o ENTREGADO, proveedor_id es requerido
        if (!empty($data['tipo']) && in_array($data['tipo'], ['RECIBIDO', 'ENTREGADO']) && empty($data['proveedor_id'])) {
            return ['success' => false, 'error' => 'Proveedor es requerido cuando el tipo es Recibida o Entregada.'];
        }

        $conexion = new mysqli('localhost', 'root', '', 'totalcarbon');
        if ($conexion->connect_error) {
            return ['success' => false, 'error' => 'Connection failed: ' . $conexion->connect_error];
        }

        $query = "UPDATE piezas_movimientos SET tipo = ?, nombre_pieza = ?, codigo_pieza = ?, cantidad = ?, proveedor_id = ?, nota = ? WHERE id_movimiento = ?";
        $stmt = $conexion->prepare($query);
        if (!$stmt) {
            $conexion->close();
            return ['success' => false, 'error' => 'Prepare failed: ' . $conexion->error];
        }

        $proveedor_id = !empty($data['proveedor_id']) ? $data['proveedor_id'] : null;
        $tipo = !empty($data['tipo']) ? $data['tipo'] : null;
        $stmt->bind_param('sssissi', $tipo, $data['nombre_pieza'], $data['codigo_pieza'], $data['cantidad'], $proveedor_id, $data['nota'], $id);

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

function deletePieza($id) {
    try {
        $conexion = new mysqli('localhost', 'root', '', 'totalcarbon');
        if ($conexion->connect_error) {
            return ['success' => false, 'error' => 'Connection failed: ' . $conexion->connect_error];
        }

        $query = "DELETE FROM piezas_movimientos WHERE id_movimiento = ?";
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
        case 'getPiezas':
            $result = getPiezas();
            echo json_encode($result);
            break;
        case 'getPieza':
            $id = $_GET['id'] ?? 0;
            $result = getPieza($id);
            echo json_encode($result);
            break;
        case 'createPieza':
            $data = json_decode(file_get_contents('php://input'), true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                echo json_encode(['success' => false, 'error' => 'Invalid JSON data']);
                break;
            }
            $result = createPieza($data);
            echo json_encode($result);
            break;
        case 'updatePieza':
            $id = $_GET['id'] ?? 0;
            $data = json_decode(file_get_contents('php://input'), true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                echo json_encode(['success' => false, 'error' => 'Invalid JSON data']);
                break;
            }
            $result = updatePieza($id, $data);
            echo json_encode($result);
            break;
        case 'deletePieza':
            $id = $_GET['id'] ?? 0;
            $result = deletePieza($id);
            echo json_encode($result);
            break;
        default:
            echo json_encode(['success' => false, 'error' => 'Invalid action']);
            break;
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => 'Server error: ' . $e->getMessage()]);
}