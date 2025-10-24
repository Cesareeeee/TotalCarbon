<?php
require_once __DIR__ . '/../../modelos/php/conexion.php';

session_start();
if (!isset($_SESSION['id_usuario'])) {
    echo json_encode([]);
    exit;
}

$id_usuario = $_SESSION['id_usuario'];

$query = "SELECT * FROM garantias WHERE id_usuario = $id_usuario ORDER BY fecha_inicio DESC";
$result = mysqli_query($conexion, $query);
$garantias = [];
while ($row = mysqli_fetch_assoc($result)) {
    $garantias[] = $row;
}
echo json_encode($garantias);