<?php
require_once '../modelos/php/conexion.php';

header('Content-Type: application/json');

 $accion = isset($_GET['accion']) ? $_GET['accion'] : 
          (isset($_POST['accion']) ? $_POST['accion'] : '');

switch ($accion) {
    case 'listar':
        listarProveedores();
        break;
    case 'obtener':
        obtenerProveedor();
        break;
    case 'crear':
        crearProveedor();
        break;
    case 'actualizar':
        actualizarProveedor();
        break;
    case 'eliminar':
        eliminarProveedor();
        break;
    default:
        echo json_encode(['exito' => false, 'mensaje' => 'Acción no válida']);
        break;
}

function listarProveedores() {
    global $conexion;
    
    $query = "SELECT p.*, u.nombres as nombre_creador 
              FROM proveedores p 
              LEFT JOIN usuarios u ON p.creado_por = u.id_usuario 
              WHERE p.estado_proveedor = 1 
              ORDER BY p.nombre_empresa";
    
    $result = $conexion->query($query);
    $proveedores = [];
    
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $proveedores[] = $row;
        }
    }
    
    echo json_encode(['exito' => true, 'proveedores' => $proveedores]);
}

function obtenerProveedor() {
    global $conexion;
    
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    
    if ($id <= 0) {
        echo json_encode(['exito' => false, 'mensaje' => 'ID de proveedor no válido']);
        return;
    }
    
    $query = "SELECT p.*, u.nombres as nombre_creador 
              FROM proveedores p 
              LEFT JOIN usuarios u ON p.creado_por = u.id_usuario 
              WHERE p.id_proveedor = $id";
    
    $result = $conexion->query($query);
    
    if ($result && $result->num_rows > 0) {
        $proveedor = $result->fetch_assoc();
        echo json_encode(['exito' => true, 'proveedor' => $proveedor]);
    } else {
        echo json_encode(['exito' => false, 'mensaje' => 'Proveedor no encontrado']);
    }
}

function crearProveedor() {
    global $conexion;
    
    $nombre_empresa = isset($_POST['nombre_empresa']) ? trim($_POST['nombre_empresa']) : '';
    $nombre_contacto = isset($_POST['nombre_contacto']) ? trim($_POST['nombre_contacto']) : '';
    $correo_electronico = isset($_POST['correo_electronico']) ? trim($_POST['correo_electronico']) : '';
    $telefono = isset($_POST['telefono']) ? trim($_POST['telefono']) : '';
    $direccion = isset($_POST['direccion']) ? trim($_POST['direccion']) : '';
    $ciudad = isset($_POST['ciudad']) ? trim($_POST['ciudad']) : '';
    $estado = isset($_POST['estado']) ? trim($_POST['estado']) : '';
    $codigo_postal = isset($_POST['codigo_postal']) ? trim($_POST['codigo_postal']) : '';
    $tipo_proveedor = isset($_POST['tipo_proveedor']) ? trim($_POST['tipo_proveedor']) : '';
    $nivel_confianza = isset($_POST['nivel_confianza']) ? trim($_POST['nivel_confianza']) : '';
    $tiempo_entrega_dias = isset($_POST['tiempo_entrega_dias']) ? (int)$_POST['tiempo_entrega_dias'] : null;
    $condiciones_pago = isset($_POST['condiciones_pago']) ? trim($_POST['condiciones_pago']) : '';
    $observaciones = isset($_POST['observaciones']) ? trim($_POST['observaciones']) : '';
    
    // Validaciones básicas
    if (empty($nombre_empresa) || empty($nombre_contacto) || empty($correo_electronico) || 
        empty($telefono) || empty($tipo_proveedor) || empty($nivel_confianza)) {
        echo json_encode(['exito' => false, 'mensaje' => 'Todos los campos obligatorios deben ser completados']);
        return;
    }
    
    // Verificar si el correo ya existe
    $query = "SELECT id_proveedor FROM proveedores WHERE correo_electronico = '$correo_electronico'";
    $result = $conexion->query($query);
    
    if ($result && $result->num_rows > 0) {
        echo json_encode(['exito' => false, 'mensaje' => 'El correo electrónico ya está registrado']);
        return;
    }
    
    // Insertar proveedor
    $query = "INSERT INTO proveedores (
                nombre_empresa, nombre_contacto, correo_electronico, telefono, 
                direccion, ciudad, estado, codigo_postal, tipo_proveedor, 
                nivel_confianza, tiempo_entrega_dias, condiciones_pago, 
                observaciones, creado_por
              ) VALUES (
                '$nombre_empresa', '$nombre_contacto', '$correo_electronico', '$telefono',
                '$direccion', '$ciudad', '$estado', '$codigo_postal', '$tipo_proveedor',
                '$nivel_confianza', $tiempo_entrega_dias, '$condiciones_pago',
                '$observaciones', {$_SESSION['id_usuario']}
              )";
    
    if ($conexion->query($query)) {
        echo json_encode(['exito' => true, 'mensaje' => 'Proveedor creado exitosamente']);
    } else {
        echo json_encode(['exito' => false, 'mensaje' => 'Error al crear el proveedor: ' . $conexion->error]);
    }
}

function actualizarProveedor() {
    global $conexion;
    
    $id_proveedor = isset($_POST['id_proveedor']) ? (int)$_POST['id_proveedor'] : 0;
    
    if ($id_proveedor <= 0) {
        echo json_encode(['exito' => false, 'mensaje' => 'ID de proveedor no válido']);
        return;
    }
    
    $nombre_empresa = isset($_POST['nombre_empresa']) ? trim($_POST['nombre_empresa']) : '';
    $nombre_contacto = isset($_POST['nombre_contacto']) ? trim($_POST['nombre_contacto']) : '';
    $correo_electronico = isset($_POST['correo_electronico']) ? trim($_POST['correo_electronico']) : '';
    $telefono = isset($_POST['telefono']) ? trim($_POST['telefono']) : '';
    $direccion = isset($_POST['direccion']) ? trim($_POST['direccion']) : '';
    $ciudad = isset($_POST['ciudad']) ? trim($_POST['ciudad']) : '';
    $estado = isset($_POST['estado']) ? trim($_POST['estado']) : '';
    $codigo_postal = isset($_POST['codigo_postal']) ? trim($_POST['codigo_postal']) : '';
    $tipo_proveedor = isset($_POST['tipo_proveedor']) ? trim($_POST['tipo_proveedor']) : '';
    $nivel_confianza = isset($_POST['nivel_confianza']) ? trim($_POST['nivel_confianza']) : '';
    $tiempo_entrega_dias = isset($_POST['tiempo_entrega_dias']) ? (int)$_POST['tiempo_entrega_dias'] : null;
    $condiciones_pago = isset($_POST['condiciones_pago']) ? trim($_POST['condiciones_pago']) : '';
    $observaciones = isset($_POST['observaciones']) ? trim($_POST['observaciones']) : '';
    
    // Validaciones básicas
    if (empty($nombre_empresa) || empty($nombre_contacto) || empty($correo_electronico) || 
        empty($telefono) || empty($tipo_proveedor) || empty($nivel_confianza)) {
        echo json_encode(['exito' => false, 'mensaje' => 'Todos los campos obligatorios deben ser completados']);
        return;
    }
    
    // Verificar si el correo ya existe en otro proveedor
    $query = "SELECT id_proveedor FROM proveedores WHERE correo_electronico = '$correo_electronico' AND id_proveedor != $id_proveedor";
    $result = $conexion->query($query);
    
    if ($result && $result->num_rows > 0) {
        echo json_encode(['exito' => false, 'mensaje' => 'El correo electrónico ya está registrado en otro proveedor']);
        return;
    }
    
    // Actualizar proveedor
    $query = "UPDATE proveedores SET 
                nombre_empresa = '$nombre_empresa',
                nombre_contacto = '$nombre_contacto',
                correo_electronico = '$correo_electronico',
                telefono = '$telefono',
                direccion = '$direccion',
                ciudad = '$ciudad',
                estado = '$estado',
                codigo_postal = '$codigo_postal',
                tipo_proveedor = '$tipo_proveedor',
                nivel_confianza = '$nivel_confianza',
                tiempo_entrega_dias = $tiempo_entrega_dias,
                condiciones_pago = '$condiciones_pago',
                observaciones = '$observaciones'
              WHERE id_proveedor = $id_proveedor";
    
    if ($conexion->query($query)) {
        echo json_encode(['exito' => true, 'mensaje' => 'Proveedor actualizado exitosamente']);
    } else {
        echo json_encode(['exito' => false, 'mensaje' => 'Error al actualizar el proveedor: ' . $conexion->error]);
    }
}

function eliminarProveedor() {
    global $conexion;
    
    $id = isset($_POST['id']) ? (int)$_POST['id'] : 0;
    
    if ($id <= 0) {
        echo json_encode(['exito' => false, 'mensaje' => 'ID de proveedor no válido']);
        return;
    }
    
    // Cambiar estado a inactivo en lugar de eliminar
    $query = "UPDATE proveedores SET estado_proveedor = 0 WHERE id_proveedor = $id";
    
    if ($conexion->query($query)) {
        echo json_encode(['exito' => true, 'mensaje' => 'Proveedor eliminado exitosamente']);
    } else {
        echo json_encode(['exito' => false, 'mensaje' => 'Error al eliminar el proveedor: ' . $conexion->error]);
    }
}
?>