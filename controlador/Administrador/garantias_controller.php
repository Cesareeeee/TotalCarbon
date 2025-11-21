<?php
/**
 * Controlador para gestionar garantías desde el panel de administrador
 * Archivo: controlador/Administrador/garantias_controller.php
 */

header('Content-Type: application/json; charset=utf-8');

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'getGarantias':
        echo json_encode(getGarantias());
        break;
    case 'createGarantia':
        echo json_encode(createGarantia());
        break;
    case 'getGarantia':
        $id = $_GET['id'] ?? 0;
        echo json_encode(getGarantia($id));
        break;
    case 'updateGarantia':
        $id = $_GET['id'] ?? 0;
        $data = json_decode(file_get_contents('php://input'), true);
        echo json_encode(updateGarantia($id, $data));
        break;
    case 'deleteGarantia':
        $id = $_GET['id'] ?? 0;
        echo json_encode(deleteGarantia($id));
        break;
    case 'getServiciosCompletados':
        echo json_encode(getServiciosCompletados());
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Acción no válida']);
        break;
}

function getGarantias() {
    $conexion = new mysqli('localhost', 'root', '', 'totalcarbon');
    if ($conexion->connect_error) {
        return ['success' => false, 'message' => 'Error de conexión: ' . $conexion->connect_error];
    }

    $conexion->set_charset("utf8");

    $query = "SELECT
                g.id_garantia,
                g.tipo_garantia,
                g.cobertura,
                g.fecha_inicio,
                g.fecha_fin,
                g.estado,
                g.creado_en,
                c.nombre_completo,
                c.marca_bicicleta,
                c.modelo_bicicleta,
                c.zona_afectada,
                c.tipo_trabajo,
                c.tipo_reparacion,
                c.descripcion_otros,
                u.nombres,
                u.apellidos,
                u.correo_electronico
              FROM garantias_bicicletas g
              JOIN cotizaciones_cliente c ON g.id_cotizacion = c.id_cotizacion
              JOIN usuarios u ON g.id_usuario = u.id_usuario
              ORDER BY g.fecha_fin DESC";

    $result = $conexion->query($query);

    if ($result) {
        $garantias = [];
        while ($row = $result->fetch_assoc()) {
            $garantias[] = $row;
        }
        $conexion->close();
        return ['success' => true, 'garantias' => $garantias];
    } else {
        $conexion->close();
        return ['success' => false, 'message' => 'Error al obtener garantías: ' . $conexion->error];
    }
}

function getServiciosCompletados() {
    $conexion = new mysqli('localhost', 'root', '', 'totalcarbon');
    if ($conexion->connect_error) {
        return ['success' => false, 'message' => 'Error de conexión: ' . $conexion->connect_error];
    }

    $conexion->set_charset("utf8");

    $query = "SELECT
                c.id_cotizacion,
                c.nombre_completo,
                c.marca_bicicleta,
                c.modelo_bicicleta,
                c.zona_afectada,
                c.tipo_trabajo,
                c.tipo_reparacion,
                c.descripcion_otros,
                c.estado,
                c.creado_en,
                u.nombres,
                u.apellidos,
                u.correo_electronico
              FROM cotizaciones_cliente c
              JOIN usuarios u ON c.id_usuario = u.id_usuario
              WHERE c.estado = 'COMPLETADO'
              ORDER BY c.creado_en DESC";

    $result = $conexion->query($query);

    if ($result) {
        $servicios = [];
        while ($row = $result->fetch_assoc()) {
            $servicios[] = $row;
        }
        $conexion->close();
        return ['success' => true, 'servicios' => $servicios];
    } else {
        $conexion->close();
        return ['success' => false, 'message' => 'Error al obtener servicios completados: ' . $conexion->error];
    }
}

function createGarantia() {
    $conexion = new mysqli('localhost', 'root', '', 'totalcarbon');
    if ($conexion->connect_error) {
        return ['success' => false, 'message' => 'Error de conexión: ' . $conexion->connect_error];
    }

    $conexion->set_charset("utf8");

    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data) {
        $conexion->close();
        return ['success' => false, 'message' => 'Datos no válidos'];
    }

    // Verificar que la cotización existe y está completada
    $stmt = $conexion->prepare("SELECT id_cotizacion, id_usuario FROM cotizaciones_cliente WHERE id_cotizacion = ? AND estado = 'COMPLETADO'");
    $stmt->bind_param('i', $data['id_cotizacion']);
    $stmt->execute();
    $result = $stmt->get_result();
    $cotizacion = $result->fetch_assoc();

    if (!$cotizacion) {
        $conexion->close();
        return ['success' => false, 'message' => 'Cotización no encontrada o no completada'];
    }

    // Calcular fecha de fin (1 año por defecto)
    $fechaInicio = date('Y-m-d');
    $fechaFin = date('Y-m-d', strtotime('+1 year'));

    $tipoGarantia = $data['tipo_garantia'] ?? 'Estandar';
    $cobertura = $data['cobertura'] ?? '';

    $query = "INSERT INTO garantias_bicicletas (
                id_cotizacion,
                id_usuario,
                tipo_garantia,
                cobertura,
                fecha_inicio,
                fecha_fin,
                estado
              ) VALUES (?, ?, ?, ?, ?, ?, 'Activa')";

    $stmt = $conexion->prepare($query);
    $stmt->bind_param('iissss', $cotizacion['id_cotizacion'], $cotizacion['id_usuario'], $tipoGarantia, $cobertura, $fechaInicio, $fechaFin);

    $response = [];
    if ($stmt->execute()) {
        $response['success'] = true;
        $response['message'] = 'Garantía creada exitosamente';
    } else {
        $response['success'] = false;
        $response['message'] = 'Error al crear garantía: ' . $stmt->error;
    }

    $conexion->close();
    return $response;
}

function getGarantia($id) {
    $conexion = new mysqli('localhost', 'root', '', 'totalcarbon');
    if ($conexion->connect_error) {
        return ['success' => false, 'message' => 'Error de conexión: ' . $conexion->connect_error];
    }

    $conexion->set_charset("utf8");

    $stmt = $conexion->prepare("SELECT * FROM garantias_bicicletas WHERE id_garantia = ?");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $garantia = $result->fetch_assoc();

    $conexion->close();

    if ($garantia) {
        return ['success' => true, 'garantia' => $garantia];
    } else {
        return ['success' => false, 'message' => 'Garantía no encontrada'];
    }
}

function updateGarantia($id, $data) {
    $conexion = new mysqli('localhost', 'root', '', 'totalcarbon');
    if ($conexion->connect_error) {
        return ['success' => false, 'message' => 'Error de conexión: ' . $conexion->connect_error];
    }

    $conexion->set_charset("utf8");

    $query = "UPDATE garantias_bicicletas SET
                tipo_garantia = ?,
                cobertura = ?,
                fecha_fin = ?,
                estado = ?
              WHERE id_garantia = ?";

    $stmt = $conexion->prepare($query);
    $stmt->bind_param('ssssi', $data['tipo_garantia'], $data['cobertura'], $data['fecha_fin'], $data['estado'], $id);

    $response = [];
    if ($stmt->execute()) {
        $response['success'] = true;
        $response['message'] = 'Garantía actualizada exitosamente';
    } else {
        $response['success'] = false;
        $response['message'] = 'Error al actualizar garantía: ' . $stmt->error;
    }

    $conexion->close();
    return $response;
}

function deleteGarantia($id) {
    $conexion = new mysqli('localhost', 'root', '', 'totalcarbon');
    if ($conexion->connect_error) {
        return ['success' => false, 'message' => 'Error de conexión: ' . $conexion->connect_error];
    }

    $conexion->set_charset("utf8");

    $stmt = $conexion->prepare("DELETE FROM garantias_bicicletas WHERE id_garantia = ?");
    $stmt->bind_param('i', $id);

    $response = [];
    if ($stmt->execute()) {
        $response['success'] = true;
        $response['message'] = 'Garantía eliminada exitosamente';
    } else {
        $response['success'] = false;
        $response['message'] = 'Error al eliminar garantía: ' . $stmt->error;
    }

    $conexion->close();
    return $response;
}
?>