<?php
require_once __DIR__ . '/../../modelos/php/conexion.php';

session_start();
if (!isset($_SESSION['id_usuario'])) {
    echo json_encode(['exito' => false, 'mensaje' => 'Sesión no iniciada']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $id_usuario = $_SESSION['id_usuario'];
    $password_actual = $_POST['password_actual'];
    $password_nueva = $_POST['password_nueva'];
    $password_confirmar = $_POST['password_confirmar'];

    if ($password_nueva !== $password_confirmar) {
        echo json_encode(['exito' => false, 'mensaje' => 'Contraseñas no coinciden']);
        exit;
    }

    // Verificar password actual
    $query = "SELECT contrasena FROM usuarios WHERE id_usuario = $id_usuario";
    $result = mysqli_query($conexion, $query);
    $row = mysqli_fetch_assoc($result);

    if (!password_verify($password_actual, $row['contrasena'])) {
        echo json_encode(['exito' => false, 'mensaje' => 'Contraseña actual incorrecta']);
        exit;
    }

    // Hash nueva password
    $hash_nueva = password_hash($password_nueva, PASSWORD_DEFAULT);

    $update_query = "UPDATE usuarios SET contrasena = '$hash_nueva' WHERE id_usuario = $id_usuario";
    if (mysqli_query($conexion, $update_query)) {
        echo json_encode(['exito' => true, 'mensaje' => 'Contraseña cambiada']);
    } else {
        echo json_encode(['exito' => false, 'mensaje' => 'Error: ' . mysqli_error($conexion)]);
    }
}