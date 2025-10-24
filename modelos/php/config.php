<?php
// Configuración de la base de datos
define('DB_HOST', 'localhost');
define('DB_NAME', 'totalcarbon');
define('DB_USER', 'root');
define('DB_PASS', '');

// Crear conexión
 $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// Verificar conexión
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

// Establecer charset
 $conn->set_charset("utf8mb4");

// Iniciar sesión
session_start();

// Función para verificar si el usuario ha iniciado sesión
function isLoggedIn() {
    return isset($_SESSION['id_usuario']);
}

// Función para obtener el rol del usuario actual
function getUserRole() {
    if (isLoggedIn()) {
        return $_SESSION['rol'];
    }
    return null;
}

// Función para redirigir si no está logueado
function requireLogin() {
    if (!isLoggedIn()) {
        header("Location: login.php");
        exit();
    }
}

// Función para redirigir si no es administrador
function requireAdmin() {
    requireLogin();
    if (getUserRole() != 'ADMINISTRADOR') {
        header("Location: dashboard.php");
        exit();
    }
}

// Función para escapar datos para prevenir inyección SQL
function escape($data) {
    global $conn;
    return $conn->real_escape_string($data);
}

// Función para generar un código único
function generateUniqueCode($prefix = '') {
    return $prefix . uniqid();
}

// Función para hashear contraseñas
function hashPassword($password) {
    return password_hash($password, PASSWORD_DEFAULT);
}

// Función para verificar contraseñas
function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

// Función para enviar notificación
function sendNotification($id_usuario, $titulo, $mensaje, $tipo = 'INFO', $id_cotizacion = null) {
    global $conn;
    
    $titulo = escape($titulo);
    $mensaje = escape($mensaje);
    $tipo = escape($tipo);
    
    $sql = "INSERT INTO notificaciones (id_usuario, id_cotizacion, titulo, mensaje, tipo) 
            VALUES ($id_usuario, " . ($id_cotizacion ? $id_cotizacion : "NULL") . ", '$titulo', '$mensaje', '$tipo')";
    
    return $conn->query($sql);
}

// Función para obtener notificaciones no leídas
function getUnreadNotifications($id_usuario) {
    global $conn;
    
    $sql = "SELECT * FROM notificaciones WHERE id_usuario = $id_usuario AND leida = 0 ORDER BY fecha_creacion DESC";
    $result = $conn->query($sql);
    
    $notifications = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $notifications[] = $row;
        }
    }
    
    return $notifications;
}

// Función para marcar notificaciones como leídas
function markNotificationsAsRead($id_usuario) {
    global $conn;
    
    $sql = "UPDATE notificaciones SET leida = 1 WHERE id_usuario = $id_usuario AND leida = 0";
    return $conn->query($sql);
}
?>