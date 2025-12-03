<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once '../../modelos/php/conexion.php';

function obtenerEstadisticasDashboard() {
    global $conexion;

    $estadisticas = [];

    // Total clientes
    $sql = "SELECT COUNT(*) as total FROM usuarios WHERE id_rol = 2";
    $result = $conexion->query($sql);
    $estadisticas['total_clientes'] = $result->fetch_assoc()['total'];

    // Total cotizaciones
    $sql = "SELECT COUNT(*) as total FROM cotizaciones_cliente";
    $result = $conexion->query($sql);
    $estadisticas['total_cotizaciones'] = $result->fetch_assoc()['total'];

    // Cotizaciones pendientes
    $sql = "SELECT COUNT(*) as total FROM cotizaciones_cliente WHERE estado = 'PENDIENTE'";
    $result = $conexion->query($sql);
    $estadisticas['cotizaciones_pendientes'] = $result->fetch_assoc()['total'];

    // Cotizaciones completadas
    $sql = "SELECT COUNT(*) as total FROM cotizaciones_cliente WHERE estado = 'COMPLETADO'";
    $result = $conexion->query($sql);
    $estadisticas['cotizaciones_completadas'] = $result->fetch_assoc()['total'];

    // Ingresos totales (suma de total en compras_proveedores)
    $sql = "SELECT SUM(total) as total FROM compras_proveedores";
    $result = $conexion->query($sql);
    $estadisticas['ingresos_totales'] = $result->fetch_assoc()['total'] ?? 0;

    // Garantías activas
    $sql = "SELECT COUNT(*) as total FROM garantias_bicicletas WHERE estado = 'Activa'";
    $result = $conexion->query($sql);
    $estadisticas['garantias_activas'] = $result->fetch_assoc()['total'];

    // Total proveedores
    $sql = "SELECT COUNT(*) as total FROM proveedores";
    $result = $conexion->query($sql);
    $estadisticas['total_proveedores'] = $result->fetch_assoc()['total'];

    // Mensajes sin leer
    $sql = "SELECT COUNT(*) as total FROM chat_mensajes WHERE leido = 0 AND id_receptor = 13";
    $result = $conexion->query($sql);
    $estadisticas['mensajes_sin_leer'] = $result->fetch_assoc()['total'];
    return $estadisticas;
}

function obtenerCotizacionesPorEstado() {
    global $conexion;

    $sql = "SELECT estado, COUNT(*) as cantidad FROM cotizaciones_cliente GROUP BY estado";
    $result = $conexion->query($sql);

    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    return $data;
}

function obtenerIngresosMensuales() {
    global $conexion;

    $sql = "SELECT DATE_FORMAT(fecha_adquirido, '%Y-%m') as mes, SUM(total) as ingresos
            FROM compras_proveedores
            WHERE fecha_adquirido >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
            GROUP BY DATE_FORMAT(fecha_adquirido, '%Y-%m')
            ORDER BY mes";
    $result = $conexion->query($sql);

    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    return $data;
}

function obtenerCotizacionesPorEstadoFiltrado($fechaInicio = null, $fechaFin = null, $estado = null) {
    global $conexion;

    $where = [];
    $params = [];
    $types = '';

    if ($fechaInicio && $fechaFin) {
        $where[] = "cc.creado_en BETWEEN ? AND ?";
        $params[] = $fechaInicio . ' 00:00:00';
        $params[] = $fechaFin . ' 23:59:59';
        $types .= 'ss';
    }

    if ($estado && $estado !== 'todos') {
        $where[] = "cc.estado = ?";
        $params[] = $estado;
        $types .= 's';
    }

    $whereClause = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';

    $sql = "SELECT estado, COUNT(*) as cantidad FROM cotizaciones_cliente cc $whereClause GROUP BY estado";
    $stmt = $conexion->prepare($sql);

    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }

    $stmt->execute();
    $result = $stmt->get_result();

    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    return $data;
}

function obtenerTiposTrabajo() {
    global $conexion;

    $sql = "SELECT tipo_trabajo, COUNT(*) as cantidad FROM cotizaciones_cliente GROUP BY tipo_trabajo";
    $result = $conexion->query($sql);

    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    return $data;
}

function obtenerTiposReparacion() {
    global $conexion;

    $sql = "SELECT tipo_reparacion, COUNT(*) as cantidad FROM cotizaciones_cliente GROUP BY tipo_reparacion";
    $result = $conexion->query($sql);

    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    return $data;
}

function obtenerMarcasMasAtendidas() {
    global $conexion;

    $sql = "SELECT marca_bicicleta as marca, COUNT(*) as cantidad,
            ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM cotizaciones_cliente)), 1) as porcentaje
            FROM cotizaciones_cliente
            WHERE marca_bicicleta IS NOT NULL AND marca_bicicleta != ''
            GROUP BY marca_bicicleta
            ORDER BY cantidad DESC
            LIMIT 5";
    $result = $conexion->query($sql);

    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    return $data;
}

function obtenerZonasAfectadas() {
    global $conexion;

    $sql = "SELECT zona_afectada, COUNT(*) as cantidad,
            ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM cotizaciones_cliente)), 1) as porcentaje
            FROM cotizaciones_cliente
            WHERE zona_afectada IS NOT NULL AND zona_afectada != ''
            GROUP BY zona_afectada
            ORDER BY cantidad DESC
            LIMIT 5";
    $result = $conexion->query($sql);

    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    return $data;
}

function obtenerClientesMasFrecuentes() {
    global $conexion;

    $sql = "SELECT u.nombres, u.apellidos, u.correo_electronico,
            COUNT(cc.id_cotizacion) as total_cotizaciones,
            MAX(cc.creado_en) as ultima_cotizacion,
            cc.estado
            FROM usuarios u
            LEFT JOIN cotizaciones_cliente cc ON u.id_usuario = cc.id_usuario
            WHERE u.id_rol = 2
            GROUP BY u.id_usuario, u.nombres, u.apellidos, u.correo_electronico
            HAVING total_cotizaciones > 0
            ORDER BY total_cotizaciones DESC
            LIMIT 5";
    $result = $conexion->query($sql);

    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    return $data;
}

function obtenerDistribucionGeografica() {
    global $conexion;

    $sql = "SELECT
            COALESCE(NULLIF(ciudad, ''), 'Sin especificar') as ciudad,
            COALESCE(NULLIF(estado, ''), 'Sin especificar') as estado,
            COUNT(*) as cantidad_clientes,
            ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM usuarios WHERE id_rol = 2)), 1) as porcentaje
            FROM usuarios
            WHERE id_rol = 2
            GROUP BY ciudad, estado
            ORDER BY cantidad_clientes DESC
            LIMIT 5";
    $result = $conexion->query($sql);

    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    return $data;
}

function obtenerMensajesSinLeer() {
    global $conexion;

    $sql = "SELECT COUNT(*) as total FROM chat_mensajes WHERE leido = 0 AND id_receptor = 13"; // ID del admin
    $result = $conexion->query($sql);

    return $result->fetch_assoc()['total'] ?? 0;
}

function obtenerUsuariosPorRol() {
    global $conexion;

    $sql = "SELECT r.nombre_rol, COUNT(u.id_usuario) as cantidad
            FROM roles r
            LEFT JOIN usuarios u ON r.id_rol = u.id_rol
            GROUP BY r.id_rol, r.nombre_rol
            HAVING cantidad > 0
            ORDER BY cantidad DESC";
    $result = $conexion->query($sql);

    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    return $data;
}

function obtenerCotizacionesMensuales() {
    global $conexion;

    $sql = "SELECT DATE_FORMAT(creado_en, '%Y-%m') as mes,
            COUNT(*) as cantidad,
            DATE_FORMAT(creado_en, '%M %Y') as mes_formateado
            FROM cotizaciones_cliente
            WHERE creado_en >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
            GROUP BY DATE_FORMAT(creado_en, '%Y-%m'), DATE_FORMAT(creado_en, '%M %Y')
            ORDER BY mes";
    $result = $conexion->query($sql);

    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    return $data;
}

function obtenerIngresosGastos() {
    global $conexion;

    $sql = "SELECT id_ingreso_gasto, concepto, tipo, monto, fecha, descripcion
            FROM ingresos_gastos
            ORDER BY fecha DESC";
    $result = $conexion->query($sql);

    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    return $data;
}

function obtenerResumenIngresosGastos() {
    global $conexion;

    $sql = "SELECT
            SUM(CASE WHEN tipo = 'INGRESO' THEN monto ELSE 0 END) as total_ingresos,
            SUM(CASE WHEN tipo = 'SALIDA' THEN monto ELSE 0 END) as total_gastos,
            (SUM(CASE WHEN tipo = 'INGRESO' THEN monto ELSE 0 END) - SUM(CASE WHEN tipo = 'SALIDA' THEN monto ELSE 0 END)) as balance
            FROM ingresos_gastos";
    $result = $conexion->query($sql);

    return $result->fetch_assoc();
}

function obtenerIngresosGastosMensuales($fechaInicio = null, $fechaFin = null) {
    global $conexion;

    $where = "";
    if ($fechaInicio && $fechaFin) {
        $where = "WHERE fecha BETWEEN '$fechaInicio' AND '$fechaFin'";
    } else {
        $where = "WHERE fecha >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)";
    }

    $sql = "SELECT
            DATE_FORMAT(fecha, '%Y-%m') as mes,
            DATE_FORMAT(fecha, '%M %Y') as mes_formateado,
            SUM(CASE WHEN tipo = 'INGRESO' THEN monto ELSE 0 END) as ingresos,
            SUM(CASE WHEN tipo = 'SALIDA' THEN monto ELSE 0 END) as gastos,
            (SUM(CASE WHEN tipo = 'INGRESO' THEN monto ELSE 0 END) - SUM(CASE WHEN tipo = 'SALIDA' THEN monto ELSE 0 END)) as balance
            FROM ingresos_gastos
            $where
            GROUP BY DATE_FORMAT(fecha, '%Y-%m'), DATE_FORMAT(fecha, '%M %Y')
            ORDER BY mes";
    $result = $conexion->query($sql);

    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    return $data;
}

function guardarIngresoGasto($concepto, $tipo, $monto, $fecha, $descripcion) {
    global $conexion;

    $sql = "INSERT INTO ingresos_gastos (concepto, tipo, monto, fecha, descripcion, creado_en)
            VALUES (?, ?, ?, ?, ?, NOW())";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("ssdss", $concepto, $tipo, $monto, $fecha, $descripcion);

    return $stmt->execute();
}

function eliminarIngresoGasto($id) {
    global $conexion;

    $sql = "DELETE FROM ingresos_gastos WHERE id_ingreso_gasto = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("i", $id);

    return $stmt->execute();
}

function obtenerIngresoGasto($id) {
    global $conexion;

    $sql = "SELECT id_ingreso_gasto, concepto, tipo, monto, fecha, descripcion
            FROM ingresos_gastos WHERE id_ingreso_gasto = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    return $result->fetch_assoc();
}

function actualizarIngresoGasto($id, $concepto, $tipo, $monto, $fecha, $descripcion) {
    global $conexion;

    $sql = "UPDATE ingresos_gastos SET concepto = ?, tipo = ?, monto = ?, fecha = ?, descripcion = ?
            WHERE id_ingreso_gasto = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("ssdssi", $concepto, $tipo, $monto, $fecha, $descripcion, $id);

    return $stmt->execute();
}

$action = $_GET['action'] ?? '';

try {
    switch ($action) {
        case 'estadisticas':
            $result = obtenerEstadisticasDashboard();
            echo json_encode($result);
            break;
        case 'cotizaciones_estado':
            $fechaInicio = $_GET['fecha_inicio'] ?? null;
            $fechaFin = $_GET['fecha_fin'] ?? null;
            $estado = $_GET['estado'] ?? null;
            $result = obtenerCotizacionesPorEstadoFiltrado($fechaInicio, $fechaFin, $estado);
            echo json_encode($result);
            break;
        case 'ingresos_mensuales':
            $result = obtenerIngresosMensuales();
            echo json_encode($result);
            break;
        case 'tipos_trabajo':
            $result = obtenerTiposTrabajo();
            echo json_encode($result);
            break;
        case 'tipos_reparacion':
            $result = obtenerTiposReparacion();
            echo json_encode($result);
            break;
        case 'marcas_atendidas':
            $result = obtenerMarcasMasAtendidas();
            echo json_encode($result);
            break;
        case 'zonas_afectadas':
            $result = obtenerZonasAfectadas();
            echo json_encode($result);
            break;
        case 'clientes_frecuentes':
            $result = obtenerClientesMasFrecuentes();
            echo json_encode($result);
            break;
        case 'distribucion_geografica':
            $result = obtenerDistribucionGeografica();
            echo json_encode($result);
            break;
        case 'mensajes_sin_leer':
            $result = obtenerMensajesSinLeer();
            echo json_encode(['cantidad' => $result]);
            break;
        case 'usuarios_por_rol':
            $result = obtenerUsuariosPorRol();
            echo json_encode($result);
            break;
        case 'cotizaciones_mensuales':
            $result = obtenerCotizacionesMensuales();
            echo json_encode($result);
            break;
        case 'ingresos_gastos':
            $result = obtenerIngresosGastos();
            echo json_encode($result);
            break;
        case 'resumen_ingresos_gastos':
            $result = obtenerResumenIngresosGastos();
            echo json_encode($result);
            break;
        case 'ingresos_gastos_mensuales':
            $fechaInicio = $_GET['fecha_inicio'] ?? null;
            $fechaFin = $_GET['fecha_fin'] ?? null;
            $result = obtenerIngresosGastosMensuales($fechaInicio, $fechaFin);
            echo json_encode($result);
            break;
        case 'guardar_ingreso_gasto':
            $data = json_decode(file_get_contents('php://input'), true);
            $result = guardarIngresoGasto(
                $data['concepto'],
                $data['tipo'],
                $data['monto'],
                $data['fecha'],
                $data['descripcion']
            );
            echo json_encode(['success' => $result]);
            break;
        case 'eliminar_ingreso_gasto':
            $id = $_POST['id'] ?? 0;
            $result = eliminarIngresoGasto($id);
            echo json_encode(['success' => $result]);
            break;
        case 'obtener_ingreso_gasto':
            $id = $_GET['id'] ?? 0;
            $result = obtenerIngresoGasto($id);
            echo json_encode(['success' => true, 'registro' => $result]);
            break;
        case 'actualizar_ingreso_gasto':
            $data = json_decode(file_get_contents('php://input'), true);
            $result = actualizarIngresoGasto(
                $data['id'],
                $data['concepto'],
                $data['tipo'],
                $data['monto'],
                $data['fecha'],
                $data['descripcion']
            );
            echo json_encode(['success' => $result]);
            break;
        default:
            echo json_encode(['success' => false, 'error' => 'Invalid action']);
            break;
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => 'Server error: ' . $e->getMessage()]);
}

?>