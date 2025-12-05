<?php
require_once 'database.php';

// Obtener conexión
$conn = getConexion();

// Obtener datos del POST (desde AJAX)
$nombre = $_POST['nombre'] ?? '';
$email = $_POST['email'] ?? '';
$telefono = $_POST['telefono'] ?? '';
$servicio = $_POST['servicio'] ?? '';
$mensaje = $_POST['mensaje'] ?? '';

// Preparar y ejecutar la inserción
$stmt = $conn->prepare("INSERT INTO cotizaciones (nombre, email, telefono, servicio, mensaje) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssss", $nombre, $email, $telefono, $servicio, $mensaje);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Cotización guardada correctamente']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al guardar: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>