<?php
// Incluir archivo de conexión - RUTA CORREGIDA
require_once __DIR__ . '/../modelos/php/conexion.php';

// Iniciar sesión
session_start();

// Encabezado para respuesta JSON
header('Content-Type: application/json');

// Evitar salida de errores antes del JSON
error_reporting(0);
ini_set('display_errors', 0);

// Verificar si se ha enviado el formulario
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Determinar si es login o registro
    $accion = isset($_POST['accion']) ? $_POST['accion'] : '';
    
    if ($accion == 'login') {
        // Procesar inicio de sesión
        $correo = $_POST['correo'];
        $contrasena = $_POST['contrasena'];
        
        if (iniciarSesion($correo, $contrasena)) {
            // Obtener información del rol para redirección
            $rolUsuario = obtenerRolUsuario($_SESSION['id_usuario']);
            $paginaRedireccion = obtenerPaginaPorRol($rolUsuario);
            
            // Inicio de sesión exitoso
            $respuesta = array(
                'exito' => true,
                'mensaje' => 'Inicio de sesión exitoso',
                'redireccion' => $paginaRedireccion,
                'rol' => $rolUsuario
            );
        } else {
            // Error en el inicio de sesión
            $respuesta = array(
                'exito' => false,
                'mensaje' => 'Correo o contraseña incorrectos'
            );
        }
    } else if ($accion == 'registro') {
        // Procesar registro
        $nombres = $_POST['nombres'];
        $apellidos = $_POST['apellidos'];
        $correo = $_POST['correo'];
        $telefono = $_POST['telefono'];
        $contrasena = $_POST['contrasena'];
        
        // Validar que las contraseñas coincidan
        if ($contrasena != $_POST['confirmar_contrasena']) {
            $respuesta = array(
                'exito' => false,
                'mensaje' => 'Las contraseñas no coinciden'
            );
        } else if (correoExiste($correo)) {
            $respuesta = array(
                'exito' => false,
                'mensaje' => 'El correo electrónico ya está registrado'
            );
        } else {
            // Registrar usuario
            if (registrarUsuario($nombres, $apellidos, $correo, $telefono, $contrasena)) {
                // Obtener información del rol para redirección
                $rolUsuario = obtenerRolUsuario($_SESSION['id_usuario']);
                $paginaRedireccion = obtenerPaginaPorRol($rolUsuario);
                
                $respuesta = array(
                    'exito' => true,
                    'mensaje' => 'Usuario registrado exitosamente',
                    'redireccion' => $paginaRedireccion,
                    'rol' => $rolUsuario
                );
            } else {
                $respuesta = array(
                    'exito' => false,
                    'mensaje' => 'Error al registrar el usuario'
                );
            }
        }
    } else {
        $respuesta = array(
            'exito' => false,
            'mensaje' => 'Acción no válida'
        );
    }
    
    // Limpiar cualquier salida anterior
    ob_clean();
    
    // Devolver respuesta en formato JSON
    echo json_encode($respuesta);
    exit;
} else {
    // Si no es POST, devolver error
    $respuesta = array(
        'exito' => false,
        'mensaje' => 'Método no permitido'
    );
    
    // Limpiar cualquier salida anterior
    ob_clean();
    
    echo json_encode($respuesta);
    exit;
}

// Función para obtener el rol del usuario
function obtenerRolUsuario($idUsuario) {
    global $conexion;
    
    $consulta = "SELECT r.nombre_rol 
                FROM usuarios u 
                INNER JOIN roles r ON u.id_rol = r.id_rol 
                WHERE u.id_usuario = $idUsuario";
    
    $resultado = $conexion->query($consulta);
    
    if ($resultado->num_rows > 0) {
        $fila = $resultado->fetch_assoc();
        return $fila['nombre_rol'];
    }
    
    return 'CLIENTE'; // Rol por defecto
}

// Función para obtener la página de redirección según el rol
function obtenerPaginaPorRol($rol) {
    switch ($rol) {
        case 'ADMINISTRADOR':
            return '../vistas/administrador.php';
        case 'EMPLEADO':
            return '../vistas/empleado.php';
        case 'CLIENTE':
        default:
            return '../vistas/cliente.php';
    }
}
?>