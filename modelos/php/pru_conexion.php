<?php
// Configuración de la base de datos
 $servidor = "localhost";
 $usuario = "root";
 $password = "";
 $basededatos = "totalcarbon";

// Encabezado para respuesta JSON
header('Content-Type: application/json');

try {
    // Crear conexión
    $conexion = new mysqli($servidor, $usuario, $password, $basededatos);
    
    // Verificar conexión
    if ($conexion->connect_error) {
        throw new Exception("Error de conexión: " . $conexion->connect_error);
    }
    
    // Establecer charset
    $conexion->set_charset("utf8");
    
    // Probar una consulta simple
    $resultado = $conexion->query("SELECT 1");
    
    if ($resultado) {
        echo json_encode([
            'conexion' => true,
            'mensaje' => 'Conexión establecida correctamente'
        ]);
    } else {
        throw new Exception("Error en la consulta de prueba");
    }
    
    // Cerrar conexión
    $conexion->close();
    
} catch (Exception $e) {
    echo json_encode([
        'conexion' => false,
        'error' => $e->getMessage()
    ]);
}
?>