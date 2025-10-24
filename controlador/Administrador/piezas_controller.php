<?php
require_once '../modelos/php/conexion.php';

header('Content-Type: application/json');

 $accion = isset($_GET['accion']) ? $_GET['accion'] : 
          (isset($_POST['accion']) ? $_POST['accion'] : '');

switch ($accion) {
    case 'listar':
        listarPiezas();
        break;
    case 'obtener':
        obtenerPieza();
        break;
    case 'crear':
        crearPieza();
        break;
    case 'actualizar':
        actualizarPieza();
        break;
    case 'eliminar':
        eliminarPieza();
        break;
    case 'ajustar_stock':
        ajustarStock();
        break;
    default:
        echo json_encode(['exito' => false, 'mensaje' => 'Acción no válida']);
        break;
}

function listarPiezas() {
    global $conexion;
    
    $query = "SELECT p.*, pr.nombre_empresa as nombre_proveedor, u.nombres as nombre_creador 
              FROM piezas p 
              LEFT JOIN proveedores pr ON p.id_proveedor_principal = pr.id_proveedor 
              LEFT JOIN usuarios u ON p.creado_por = u.id_usuario 
              WHERE p.estado_pieza = 1 
              ORDER BY p.nombre_pieza";
    
    $result = $conexion->query($query);
    $piezas = [];
    
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $piezas[] = $row;
        }
    }
    
    echo json_encode(['exito' => true, 'piezas' => $piezas]);
}

function obtenerPieza() {
    global $conexion;
    
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    
    if ($id <= 0) {
        echo json_encode(['exito' => false, 'mensaje' => 'ID de pieza no válido']);
        return;
    }
    
    $query = "SELECT p.*, pr.nombre_empresa as nombre_proveedor, u.nombres as nombre_creador 
              FROM piezas p 
              LEFT JOIN proveedores pr ON p.id_proveedor_principal = pr.id_proveedor 
              LEFT JOIN usuarios u ON p.creado_por = u.id_usuario 
              WHERE p.id_pieza = $id";
    
    $result = $conexion->query($query);
    
    if ($result && $result->num_rows > 0) {
        $pieza = $result->fetch_assoc();
        echo json_encode(['exito' => true, 'pieza' => $pieza]);
    } else {
        echo json_encode(['exito' => false, 'mensaje' => 'Pieza no encontrada']);
    }
}

function crearPieza() {
    global $conexion;
    
    $codigo_pieza = isset($_POST['codigo_pieza']) ? trim($_POST['codigo_pieza']) : '';
    $nombre_pieza = isset($_POST['nombre_pieza']) ? trim($_POST['nombre_pieza']) : '';
    $descripcion = isset($_POST['descripcion']) ? trim($_POST['descripcion']) : '';
    $categoria = isset($_POST['categoria']) ? trim($_POST['categoria']) : '';
    $material = isset($_POST['material']) ? trim($_POST['material']) : '';
    $color = isset($_POST['color']) ? trim($_POST['color']) : '';
    $peso_gramos = isset($_POST['peso_gramos']) ? (float)$_POST['peso_gramos'] : null;
    $precio_compra = isset($_POST['precio_compra']) ? (float)$_POST['precio_compra'] : null;
    $precio_venta = isset($_POST['precio_venta']) ? (float)$_POST['precio_venta'] : 0;
    $stock_actual = isset($_POST['stock_actual']) ? (int)$_POST['stock_actual'] : 0;
    $stock_minimo = isset($_POST['stock_minimo']) ? (int)$_POST['stock_minimo'] : 5;
    $id_proveedor_principal = isset($_POST['id_proveedor_principal']) ? (int)$_POST['id_proveedor_principal'] : null;
    
    // Validaciones básicas
    if (empty($codigo_pieza) || empty($nombre_pieza) || empty($categoria) || $precio_venta <= 0) {
        echo json_encode(['exito' => false, 'mensaje' => 'Todos los campos obligatorios deben ser completados']);
        return;
    }
    
    // Verificar si el código ya existe
    $query = "SELECT id_pieza FROM piezas WHERE codigo_pieza = '$codigo_pieza'";
    $result = $conexion->query($query);
    
    if ($result && $result->num_rows > 0) {
        echo json_encode(['exito' => false, 'mensaje' => 'El código de pieza ya está registrado']);
        return;
    }
    
    // Procesar imagen si se subió
    $imagen = '';
    if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
        $imagen = procesarImagen($_FILES['imagen']);
        if (!$imagen) {
            echo json_encode(['exito' => false, 'mensaje' => 'Error al procesar la imagen']);
            return;
        }
    }
    
    // Insertar pieza
    $query = "INSERT INTO piezas (
                codigo_pieza, nombre_pieza, descripcion, categoria, material, 
                color, peso_gramos, precio_compra, precio_venta, stock_actual, 
                stock_minimo, id_proveedor_principal, imagen, creado_por
              ) VALUES (
                '$codigo_pieza', '$nombre_pieza', '$descripcion', '$categoria', '$material',
                '$color', $peso_gramos, $precio_compra, $precio_venta, $stock_actual,
                $stock_minimo, $id_proveedor_principal, '$imagen', {$_SESSION['id_usuario']}
              )";
    
    if ($conexion->query($query)) {
        // Registrar movimiento inicial en el historial
        $id_pieza = $conexion->insert_id;
        registrarMovimiento($id_pieza, 'ENTRADA', $stock_actual, 'Stock inicial');
        
        echo json_encode(['exito' => true, 'mensaje' => 'Pieza creada exitosamente']);
    } else {
        echo json_encode(['exito' => false, 'mensaje' => 'Error al crear la pieza: ' . $conexion->error]);
    }
}

function actualizarPieza() {
    global $conexion;
    
    $id_pieza = isset($_POST['id_pieza']) ? (int)$_POST['id_pieza'] : 0;
    
    if ($id_pieza <= 0) {
        echo json_encode(['exito' => false, 'mensaje' => 'ID de pieza no válido']);
        return;
    }
    
    $codigo_pieza = isset($_POST['codigo_pieza']) ? trim($_POST['codigo_pieza']) : '';
    $nombre_pieza = isset($_POST['nombre_pieza']) ? trim($_POST['nombre_pieza']) : '';
    $descripcion = isset($_POST['descripcion']) ? trim($_POST['descripcion']) : '';
    $categoria = isset($_POST['categoria']) ? trim($_POST['categoria']) : '';
    $material = isset($_POST['material']) ? trim($_POST['material']) : '';
    $color = isset($_POST['color']) ? trim($_POST['color']) : '';
    $peso_gramos = isset($_POST['peso_gramos']) ? (float)$_POST['peso_gramos'] : null;
    $precio_compra = isset($_POST['precio_compra']) ? (float)$_POST['precio_compra'] : null;
    $precio_venta = isset($_POST['precio_venta']) ? (float)$_POST['precio_venta'] : 0;
    $stock_actual = isset($_POST['stock_actual']) ? (int)$_POST['stock_actual'] : 0;
    $stock_minimo = isset($_POST['stock_minimo']) ? (int)$_POST['stock_minimo'] : 5;
    $id_proveedor_principal = isset($_POST['id_proveedor_principal']) ? (int)$_POST['id_proveedor_principal'] : null;
    
    // Validaciones básicas
    if (empty($codigo_pieza) || empty($nombre_pieza) || empty($categoria) || $precio_venta <= 0) {
        echo json_encode(['exito' => false, 'mensaje' => 'Todos los campos obligatorios deben ser completados']);
        return;
    }
    
    // Verificar si el código ya existe en otra pieza
    $query = "SELECT id_pieza FROM piezas WHERE codigo_pieza = '$codigo_pieza' AND id_pieza != $id_pieza";
    $result = $conexion->query($query);
    
    if ($result && $result->num_rows > 0) {
        echo json_encode(['exito' => false, 'mensaje' => 'El código de pieza ya está registrado en otra pieza']);
        return;
    }
    
    // Obtener stock actual para registrar ajuste si cambia
    $query = "SELECT stock_actual FROM piezas WHERE id_pieza = $id_pieza";
    $result = $conexion->query($query);
    $stock_anterior = 0;
    
    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $stock_anterior = $row['stock_actual'];
    }
    
    // Procesar imagen si se subió
    $imagen_actual = '';
    if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
        $imagen_actual = procesarImagen($_FILES['imagen']);
        if (!$imagen_actual) {
            echo json_encode(['exito' => false, 'mensaje' => 'Error al procesar la imagen']);
            return;
        }
    }
    
    // Construir consulta de actualización
    $query = "UPDATE piezas SET 
                codigo_pieza = '$codigo_pieza',
                nombre_pieza = '$nombre_pieza',
                descripcion = '$descripcion',
                categoria = '$categoria',
                material = '$material',
                color = '$color',
                peso_gramos = $peso_gramos,
                precio_compra = $precio_compra,
                precio_venta = $precio_venta,
                stock_actual = $stock_actual,
                stock_minimo = $stock_minimo,
                id_proveedor_principal = $id_proveedor_principal";
    
    // Agregar imagen a la consulta si se actualizó
    if (!empty($imagen_actual)) {
        $query .= ", imagen = '$imagen_actual'";
    }
    
    $query .= " WHERE id_pieza = $id_pieza";
    
    if ($conexion->query($query)) {
        // Registrar ajuste de stock si cambió
        if ($stock_actual != $stock_anterior) {
            $diferencia = $stock_actual - $stock_anterior;
            $tipo = $diferencia > 0 ? 'ENTRADA' : 'SALIDA';
            registrarMovimiento($id_pieza, 'AJUSTE', abs($diferencia), 'Ajuste manual de stock');
        }
        
        echo json_encode(['exito' => true, 'mensaje' => 'Pieza actualizada exitosamente']);
    } else {
        echo json_encode(['exito' => false, 'mensaje' => 'Error al actualizar la pieza: ' . $conexion->error]);
    }
}

function eliminarPieza() {
    global $conexion;
    
    $id = isset($_POST['id']) ? (int)$_POST['id'] : 0;
    
    if ($id <= 0) {
        echo json_encode(['exito' => false, 'mensaje' => 'ID de pieza no válido']);
        return;
    }
    
    // Cambiar estado a inactivo en lugar de eliminar
    $query = "UPDATE piezas SET estado_pieza = 0 WHERE id_pieza = $id";
    
    if ($conexion->query($query)) {
        echo json_encode(['exito' => true, 'mensaje' => 'Pieza eliminada exitosamente']);
    } else {
        echo json_encode(['exito' => false, 'mensaje' => 'Error al eliminar la pieza: ' . $conexion->error]);
    }
}

function ajustarStock() {
    global $conexion;
    
    $id_pieza = isset($_POST['id_pieza']) ? (int)$_POST['id_pieza'] : 0;
    $tipo_movimiento = isset($_POST['tipo_movimiento']) ? trim($_POST['tipo_movimiento']) : '';
    $cantidad = isset($_POST['cantidad']) ? (int)$_POST['cantidad'] : 0;
    $motivo = isset($_POST['motivo']) ? trim($_POST['motivo']) : '';
    
    if ($id_pieza <= 0 || empty($tipo_movimiento) || $cantidad <= 0 || empty($motivo)) {
        echo json_encode(['exito' => false, 'mensaje' => 'Todos los campos son obligatorios']);
        return;
    }
    
    // Obtener stock actual
    $query = "SELECT stock_actual FROM piezas WHERE id_pieza = $id_pieza";
    $result = $conexion->query($query);
    
    if (!$result || $result->num_rows === 0) {
        echo json_encode(['exito' => false, 'mensaje' => 'Pieza no encontrada']);
        return;
    }
    
    $row = $result->fetch_assoc();
    $stock_actual = $row['stock_actual'];
    
    // Calcular nuevo stock
    if ($tipo_movimiento === 'SALIDA') {
        $nuevo_stock = $stock_actual - $cantidad;
        if ($nuevo_stock < 0) {
            echo json_encode(['exito' => false, 'mensaje' => 'No hay suficiente stock para esta salida']);
            return;
        }
    } else {
        $nuevo_stock = $stock_actual + $cantidad;
    }
    
    // Actualizar stock
    $query = "UPDATE piezas SET stock_actual = $nuevo_stock WHERE id_pieza = $id_pieza";
    
    if ($conexion->query($query)) {
        // Registrar movimiento
        registrarMovimiento($id_pieza, $tipo_movimiento, $cantidad, $motivo);
        
        echo json_encode(['exito' => true, 'mensaje' => 'Stock ajustado exitosamente']);
    } else {
        echo json_encode(['exito' => false, 'mensaje' => 'Error al ajustar el stock: ' . $conexion->error]);
    }
}

function procesarImagen($archivo) {
    // Validar tipo de archivo
    $tipos_permitidos = ['image/jpeg', 'image/png', 'image/gif'];
    if (!in_array($archivo['type'], $tipos_permitidos)) {
        return false;
    }
    
    // Validar tamaño (máximo 2MB)
    if ($archivo['size'] > 2 * 1024 * 1024) {
        return false;
    }
    
    // Generar nombre único
    $extension = pathinfo($archivo['name'], PATHINFO_EXTENSION);
    $nombre_archivo = uniqid('pieza_') . '.' . $extension;
    
    // Crear directorio si no existe
    $directorio = '../recursos/img/piezas/';
    if (!file_exists($directorio)) {
        mkdir($directorio, 0755, true);
    }
    
    // Mover archivo
    if (move_uploaded_file($archivo['tmp_name'], $directorio . $nombre_archivo)) {
        return $nombre_archivo;
    }
    
    return false;
}

function registrarMovimiento($id_pieza, $tipo_movimiento, $cantidad, $motivo) {
    global $conexion;
    
    $query = "INSERT INTO historial_piezas (
                id_pieza, tipo_movimiento, cantidad, motivo, id_usuario
              ) VALUES (
                $id_pieza, '$tipo_movimiento', $cantidad, '$motivo', {$_SESSION['id_usuario']}
              )";
    
    $conexion->query($query);
}
?>