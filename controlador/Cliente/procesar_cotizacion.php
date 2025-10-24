<?php
require_once __DIR__ . '/../../modelos/php/conexion.php';  // Reutilizo tu conexion.php

session_start();
if (!isset($_SESSION['id_usuario'])) {
    echo json_encode(['exito' => false, 'mensaje' => 'Sesión no iniciada']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $id_usuario = $_SESSION['id_usuario'];
    $nombre = mysqli_real_escape_string($conexion, $_POST['nombre']);
    $email = mysqli_real_escape_string($conexion, $_POST['email']);
    $telefono = mysqli_real_escape_string($conexion, $_POST['telefono']);
    $direccion = mysqli_real_escape_string($conexion, $_POST['direccion']);
    $marca = mysqli_real_escape_string($conexion, $_POST['marca']);
    $modelo = mysqli_real_escape_string($conexion, $_POST['modelo']);
    $zona_afectada = mysqli_real_escape_string($conexion, $_POST['zonaAfectada']);
    $tipo_trabajo = mysqli_real_escape_string($conexion, $_POST['tipoTrabajo']);
    $tipo_reparacion = mysqli_real_escape_string($conexion, $_POST['tipoReparacion']);
    $descripcion_otros = isset($_POST['descripcionOtros']) ? mysqli_real_escape_string($conexion, $_POST['descripcionOtros']) : '';
    $servicio = 'reparacion';  // Fijo como en tu BD
    $mensaje = mysqli_real_escape_string($conexion, $_POST['mensaje']);  // Campo general

    // Insertar cotización
    $query = "INSERT INTO cotizaciones (id_usuario, nombre, email, telefono, direccion, marca, modelo, zona_afectada, tipo_trabajo, tipo_reparacion, descripcion_otros, servicio, mensaje, estado) 
              VALUES ($id_usuario, '$nombre', '$email', '$telefono', '$direccion', '$marca', '$modelo', '$zona_afectada', '$tipo_trabajo', '$tipo_reparacion', '$descripcion_otros', '$servicio', '$mensaje', 'PENDIENTE')";
    if (mysqli_query($conexion, $query)) {
        $id_cotizacion = mysqli_insert_id($conexion);

        // Manejar uploads de imágenes (max 10)
        $upload_dir = __DIR__ . '/uploads/imagenes_cotizaciones/';
        if (!file_exists($upload_dir)) mkdir($upload_dir, 0777, true);

        foreach ($_FILES as $file) {
            if ($file['error'] == 0 && strpos($file['type'], 'image/') === 0 && count(glob($upload_dir . '*')) < 10) {
                $file_name = $id_cotizacion . '_' . basename($file['name']);
                $file_path = $upload_dir . $file_name;
                if (move_uploaded_file($file['tmp_name'], $file_path)) {
                    $query_img = "INSERT INTO imagenes_cotizaciones (id_cotizacion, ruta_imagen) VALUES ($id_cotizacion, 'uploads/imagenes_cotizaciones/$file_name')";
                    mysqli_query($conexion, $query_img);
                }
            }
        }

        // Crear progreso inicial
        $query_progreso = "INSERT INTO progreso_servicios (id_cotizacion, paso_actual, comentario) VALUES ($id_cotizacion, 1, 'Cotización enviada')";
        mysqli_query($conexion, $query_progreso);

        echo json_encode(['exito' => true, 'mensaje' => 'Cotización guardada', 'id_cotizacion' => $id_cotizacion]);
    } else {
        echo json_encode(['exito' => false, 'mensaje' => 'Error al guardar: ' . mysqli_error($conexion)]);
    }
}