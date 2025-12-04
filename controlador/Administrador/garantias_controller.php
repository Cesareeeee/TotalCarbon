<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once '../../modelos/php/conexion.php';

function getGarantias() {
    try {
        $conexion = new mysqli('localhost', 'root', '', 'totalcarbon');
        if ($conexion->connect_error) {
            return ['success' => false, 'error' => 'Connection failed: ' . $conexion->connect_error];
        }

        $query = "SELECT g.*, c.nombre_completo, c.marca_bicicleta, c.modelo_bicicleta, c.zona_afectada, u.nombres, u.apellidos
                  FROM garantias_bicicletas g
                  JOIN cotizaciones_cliente c ON g.id_cotizacion = c.id_cotizacion
                  JOIN usuarios u ON g.id_usuario = u.id_usuario
                  ORDER BY g.fecha_fin DESC";
        $result = $conexion->query($query);

        if (!$result) {
            $conexion->close();
            return ['success' => false, 'error' => 'Query failed: ' . $conexion->error];
        }

        $garantias = [];
        while ($row = $result->fetch_assoc()) {
            $garantias[] = $row;
        }

        $conexion->close();
        return $garantias;
    } catch (Exception $e) {
        return ['success' => false, 'error' => 'Database error: ' . $e->getMessage()];
    }
}

function getGarantia($id) {
    try {
        $conexion = new mysqli('localhost', 'root', '', 'totalcarbon');
        if ($conexion->connect_error) {
            return ['success' => false, 'error' => 'Connection failed: ' . $conexion->connect_error];
        }

        $query = "SELECT g.*, c.nombre_completo, c.marca_bicicleta, c.modelo_bicicleta, c.zona_afectada, u.nombres, u.apellidos
                  FROM garantias_bicicletas g
                  JOIN cotizaciones_cliente c ON g.id_cotizacion = c.id_cotizacion
                  JOIN usuarios u ON g.id_usuario = u.id_usuario
                  WHERE g.id_garantia = ?";
        $stmt = $conexion->prepare($query);
        if (!$stmt) {
            $conexion->close();
            return ['success' => false, 'error' => 'Prepare failed: ' . $conexion->error];
        }

        $stmt->bind_param('i', $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $garantia = $result->fetch_assoc();

        $conexion->close();
        return $garantia;
    } catch (Exception $e) {
        return ['success' => false, 'error' => 'Database error: ' . $e->getMessage()];
    }
}

function getServiciosCompletados() {
    try {
        $conexion = new mysqli('localhost', 'root', '', 'totalcarbon');
        if ($conexion->connect_error) {
            return ['success' => false, 'error' => 'Connection failed: ' . $conexion->connect_error];
        }

        $query = "SELECT c.id_cotizacion, c.nombre_completo, c.marca_bicicleta, c.modelo_bicicleta, c.zona_afectada
                  FROM cotizaciones_cliente c
                  WHERE c.estado = 'COMPLETADO'
                  ORDER BY c.creado_en DESC";
        $result = $conexion->query($query);

        if (!$result) {
            $conexion->close();
            return ['success' => false, 'error' => 'Query failed: ' . $conexion->error];
        }

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

function createGarantia($data) {
    try {
        $conexion = new mysqli('localhost', 'root', '', 'totalcarbon');
        if ($conexion->connect_error) {
            return ['success' => false, 'error' => 'Connection failed: ' . $conexion->connect_error];
        }

        // Get user ID from cotizacion
        $query_user = "SELECT id_usuario FROM cotizaciones_cliente WHERE id_cotizacion = ?";
        $stmt_user = $conexion->prepare($query_user);
        $stmt_user->bind_param('i', $data['id_cotizacion']);
        $stmt_user->execute();
        $result_user = $stmt_user->get_result();
        $cotizacion = $result_user->fetch_assoc();

        if (!$cotizacion) {
            $conexion->close();
            return ['success' => false, 'error' => 'Cotización no encontrada'];
        }

        $query = "INSERT INTO garantias_bicicletas (id_cotizacion, id_usuario, tipo_garantia, cobertura, fecha_inicio, fecha_fin, estado)
                  VALUES (?, ?, ?, ?, ?, ?, 'ACTIVA')";
        $stmt = $conexion->prepare($query);
        if (!$stmt) {
            $conexion->close();
            return ['success' => false, 'error' => 'Prepare failed: ' . $conexion->error];
        }

        $stmt->bind_param('iissss', $data['id_cotizacion'], $cotizacion['id_usuario'], $data['tipo_garantia'], $data['cobertura'], $data['fecha_inicio'], $data['fecha_fin']);

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

function updateGarantia($id, $data) {
    try {
        $conexion = new mysqli('localhost', 'root', '', 'totalcarbon');
        if ($conexion->connect_error) {
            return ['success' => false, 'error' => 'Connection failed: ' . $conexion->connect_error];
        }

        $query = "UPDATE garantias_bicicletas SET tipo_garantia = ?, cobertura = ?, fecha_inicio = ?, fecha_fin = ?, estado = ? WHERE id_garantia = ?";
        $stmt = $conexion->prepare($query);
        if (!$stmt) {
            $conexion->close();
            return ['success' => false, 'error' => 'Prepare failed: ' . $conexion->error];
        }

        $stmt->bind_param('sssssi', $data['tipo_garantia'], $data['cobertura'], $data['fecha_inicio'], $data['fecha_fin'], $data['estado'], $id);

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

function updateGarantiaEstado($id, $estado) {
    try {
        $conexion = new mysqli('localhost', 'root', '', 'totalcarbon');
        if ($conexion->connect_error) {
            return ['success' => false, 'error' => 'Connection failed: ' . $conexion->connect_error];
        }

        $query = "UPDATE garantias_bicicletas SET estado = ? WHERE id_garantia = ?";
        $stmt = $conexion->prepare($query);
        if (!$stmt) {
            $conexion->close();
            return ['success' => false, 'error' => 'Prepare failed: ' . $conexion->error];
        }

        $stmt->bind_param('si', $estado, $id);

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
        case 'getGarantias':
            $result = getGarantias();
            echo json_encode($result);
            break;
        case 'getGarantia':
            $id = $_GET['id'] ?? 0;
            $result = getGarantia($id);
            echo json_encode($result);
            break;
        case 'getServiciosCompletados':
            $result = getServiciosCompletados();
            echo json_encode($result);
            break;
        case 'createGarantia':
            $data = json_decode(file_get_contents('php://input'), true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                echo json_encode(['success' => false, 'error' => 'Invalid JSON data']);
                break;
            }
            $result = createGarantia($data);
            echo json_encode($result);
            break;
        case 'updateGarantia':
            $id = $_GET['id'] ?? 0;
            $data = json_decode(file_get_contents('php://input'), true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                echo json_encode(['success' => false, 'error' => 'Invalid JSON data']);
                break;
            }
            $result = updateGarantia($id, $data);
            echo json_encode($result);
            break;
        case 'updateEstado':
            $id = $_GET['id'] ?? 0;
            $data = json_decode(file_get_contents('php://input'), true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                echo json_encode(['success' => false, 'error' => 'Invalid JSON data']);
                break;
            }
            $result = updateGarantiaEstado($id, $data['estado']);
            echo json_encode($result);
            break;
        default:
            echo json_encode(['success' => false, 'error' => 'Invalid action']);
            break;
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => 'Server error: ' . $e->getMessage()]);
}