<?php
require_once __DIR__ . '/../../modelos/php/conexion.php';

session_start();
if (!isset($_SESSION['id_usuario'])) {
    echo json_encode([]);
    exit;
}

$id_usuario = $_SESSION['id_usuario'];

// Cargar cotizaciones del usuario para progreso
$query_cot = "SELECT id FROM cotizaciones WHERE id_usuario = $id_usuario ORDER BY fecha DESC LIMIT 1";  // Última cotización
$result_cot = mysqli_query($conexion, $query_cot);
if ($row_cot = mysqli_fetch_assoc($result_cot)) {
    $id_cotizacion = $row_cot['id'];

    // Progreso
    $query_pro = "SELECT * FROM progreso_servicios WHERE id_cotizacion = $id_cotizacion";
    $result_pro = mysqli_query($conexion, $query_pro);
    $progreso = mysqli_fetch_assoc($result_pro) ?? ['paso_actual' => 1, 'comentario' => ''];

    // Imágenes progreso
    $query_img = "SELECT * FROM imagenes_progreso WHERE id_progreso = " . ($progreso['id_progreso'] ?? 0);
    $result_img = mysqli_query($conexion, $query_img);
    $imagenes = [];
    while ($row_img = mysqli_fetch_assoc($result_img)) {
        $imagenes[] = $row_img;
    }

    // Comentarios (usamos comentario de progreso)
    $comentarios = [$progreso['comentario']];

    echo json_encode(['progreso' => $progreso, 'imagenes' => $imagenes, 'comentarios' => $comentarios]);
} else {
    echo json_encode([]);
}