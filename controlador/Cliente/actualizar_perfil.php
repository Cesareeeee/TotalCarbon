<?php
require_once __DIR__ . '/../../modelos/php/conexion.php';

session_start();
if (!isset($_SESSION['id_usuario'])) {
    echo json_encode(['exito' => false, 'mensaje' => 'Sesión no iniciada']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $id_usuario = $_SESSION['id_usuario'];
    $nombres = mysqli_real_escape_string($conexion, $_POST['nombres']);
    $apellidos = mysqli_real_escape_string($conexion, $_POST['apellidos']);
    $correo = mysqli_real_escape_string($conexion, $_POST['email']);
    $telefono = mysqli_real_escape_string($conexion, $_POST['telefono']);
    $direccion = mysqli_real_escape_string($conexion, $_POST['direccion']);
    $ciudad = mysqli_real_escape_string($conexion, $_POST['ciudad']);
    $estado = mysqli_real_escape_string($conexion, $_POST['estado']);
    $codigo_postal = mysqli_real_escape_string($conexion, $_POST['codigo_postal']);
    $pais = mysqli_real_escape_string($conexion, $_POST['pais']);
    $fecha_nacimiento = mysqli_real_escape_string($conexion, $_POST['fecha_nacimiento']);

    $query = "UPDATE usuarios SET 
              nombres = '$nombres', 
              apellidos = '$apellidos', 
              correo_electronico = '$correo', 
              numero_telefono = '$telefono' 
              WHERE id_usuario = $id_usuario";

    if (mysqli_query($conexion, $query)) {
        // Actualizar sesión
        $_SESSION['nombres'] = $nombres;
        $_SESSION['apellidos'] = $apellidos;
        $_SESSION['correo_electronico'] = $correo;

        echo json_encode(['exito' => true, 'mensaje' => 'Perfil actualizado']);
    } else {
        echo json_encode(['exito' => false, 'mensaje' => 'Error: ' . mysqli_error($conexion)]);
    }
}