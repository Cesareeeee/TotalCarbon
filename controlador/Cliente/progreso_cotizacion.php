<?php
header('Content-Type: application/json; charset=utf-8');
 
use ModeloCliente\CotizacionCliente;
require_once __DIR__ . '/../../modelos/php/ModeloCliente/CotizacionCliente.php';

function responder($data, int $status = 200) {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

$metodo = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($metodo !== 'GET') {
    responder(['success' => false, 'message' => 'Método no permitido'], 405);
}

$id = isset($_GET['id_cotizacion']) ? (int)$_GET['id_cotizacion'] : 0;
if ($id <= 0) {
    responder(['success' => false, 'message' => 'Parámetro id_cotizacion inválido'], 400);
}

try {
    $servicio = new CotizacionCliente();
    $progreso = $servicio->obtenerProgreso($id);
    $imagenes = $servicio->obtenerImagenesProceso($id);
    $comentarios = $servicio->obtenerComentarios($id);
    responder(['success' => true, 'progreso' => $progreso, 'imagenes' => $imagenes, 'comentarios' => $comentarios]);
} catch (Throwable $e) {
    responder(['success' => false, 'message' => $e->getMessage()], 500);
}
