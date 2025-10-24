<?php
require_once __DIR__ . '/../../modelos/php/conexion.php';

session_start();
if (!isset($_SESSION['id_usuario'])) {
    echo json_encode(['exito' => false, 'mensaje' => 'Sesión no iniciada']);
    exit;
}

$id_usuario = $_SESSION['id_usuario'];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $mensaje = mysqli_real_escape_string($conexion, $_POST['mensaje']);
    $tipo = 'ENVIADO';

    $query = "INSERT INTO chats (id_usuario, mensaje, tipo) VALUES ($id_usuario, '$mensaje', '$tipo')";
    if (mysqli_query($conexion, $query)) {
        // Simular respuesta de soporte (opcional, o maneja manual)
        $respuesta = "Gracias por tu mensaje. Te responderemos pronto.";
        $query_res = "INSERT INTO chats (id_usuario, mensaje, tipo) VALUES ($id_usuario, '$respuesta', 'RECIBIDO')";
        mysqli_query($conexion, $query_res);

        echo json_encode(['exito' => true]);
    } else {
        echo json_encode(['exito' => false]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $tab = $_GET['tab'] ?? 'current';

    if ($tab == 'history') {
        $query = "SELECT * FROM chats WHERE id_usuario = $id_usuario ORDER BY fecha DESC LIMIT 50";
    } else {
        $query = "SELECT * FROM chats WHERE id_usuario = $id_usuario AND fecha > DATE_SUB(NOW(), INTERVAL 1 DAY) ORDER BY fecha ASC";
    }

    $result = mysqli_query($conexion, $query);
    $mensajes = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $mensajes[] = $row;
    }
    echo json_encode($mensajes);
}