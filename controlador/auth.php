<?php
// Incluir archivo de conexión - RUTA CORREGIDA
require_once __DIR__ . '/../modelos/php/conexion.php';

// Iniciar sesión
session_start();

// Encabezado para respuesta JSON
header('Content-Type: application/json');

// Evitar salida de errores antes del JSON
ini_set('display_errors', 0); // Desactiva la salida de errores al cliente
error_reporting(E_ALL); // Registra errores internamente

// Verificar si se ha enviado el formulario
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Determinar si es login o registro
    $accion = isset($_POST['accion']) ? $_POST['accion'] : '';
    
    if ($accion == 'login') {
        // Procesar inicio de sesión
        $usuario = $_POST['usuario']; // Puede ser correo o código de usuario
        $contrasena = $_POST['contrasena'];
        $csrf_token = $_POST['csrf_token'];
        
        // Verificar token CSRF
        if (!verificarTokenCSRF($csrf_token)) {
            $respuesta = array(
                'exito' => false,
                'mensaje' => 'Error de seguridad. Por favor, recargue la página e intente nuevamente.'
            );
            echo json_encode($respuesta);
            exit;
        }
        
        // Verificar límite de intentos
        $ip = $_SERVER['REMOTE_ADDR'];
        if (verificarBloqueoPorIP($ip)) {
            $respuesta = array(
                'exito' => false,
                'mensaje' => 'Demasiados intentos fallidos. Tu IP ha sido bloqueada temporalmente. Por favor, inténtalo más tarde.'
            );
            echo json_encode($respuesta);
            exit;
        }
        
        if (iniciarSesion($usuario, $contrasena)) {
            // Reiniciar contador de intentos fallidos
            reiniciarIntentosFallidos($ip);
            
            // Obtener información del rol para redirección
            $rolUsuario = obtenerNombreRol($_SESSION['id_rol']);
            $paginaRedireccion = obtenerPaginaPorRol($rolUsuario);
            
            // Registrar actividad exitosa
            registrarActividad("Inicio de sesión exitoso", $_SESSION['id_usuario'], $ip);
            
            // Inicio de sesión exitoso
            $respuesta = array(
                'exito' => true,
                'mensaje' => 'Inicio de sesión exitoso',
                'redireccion' => $paginaRedireccion,
                'rol' => $rolUsuario
            );
        } else {
            // Incrementar contador de intentos fallidos
            incrementarIntentosFallidos($ip);
            
            // Registrar actividad fallida
            registrarActividad("Intento de inicio de sesión fallido: $usuario", null, $ip);
            
            // Error en el inicio de sesión
            $respuesta = array(
                'exito' => false,
                'mensaje' => 'Usuario o contraseña incorrectos'
            );
        }
    } else if ($accion == 'registro') {
        // Procesar registro
        $nombres = $_POST['nombres'];
        $apellidos = $_POST['apellidos'];
        $correo = $_POST['correo'];
        $telefono = $_POST['telefono'];
        $contrasena = $_POST['contrasena'];
        $csrf_token = $_POST['csrf_token'];
        
        // Verificar token CSRF
        if (!verificarTokenCSRF($csrf_token)) {
            $respuesta = array(
                'exito' => false,
                'mensaje' => 'Error de seguridad. Por favor, recargue la página e intente nuevamente.'
            );
            echo json_encode($respuesta);
            exit;
        }
        
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
                // Iniciar sesión y establecer variables de sesión
                $consulta = "SELECT id_usuario, id_rol FROM usuarios WHERE correo_electronico = '$correo'";
                $resultado = $conexion->query($consulta);
                if ($resultado->num_rows > 0) {
                    $usuario = $resultado->fetch_assoc();
                    $_SESSION['id_usuario'] = $usuario['id_usuario'];
                    $_SESSION['correo_electronico'] = $correo;
                    $_SESSION['id_rol'] = $usuario['id_rol'];
                    $_SESSION['nombres'] = $nombres;
                    $_SESSION['apellidos'] = $apellidos;
                }
                $rolUsuario = obtenerNombreRol($_SESSION['id_rol']);
                $paginaRedireccion = obtenerPaginaPorRol($rolUsuario);
                
                // Registrar actividad de registro
                $ip = $_SERVER['REMOTE_ADDR'];
                registrarActividad("Registro de nuevo usuario: $correo", $_SESSION['id_usuario'], $ip);
                
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
    } else if ($accion == 'generar_token') {
        // Generar y devolver un token CSRF
        $token = generarTokenCSRF();
        $respuesta = array(
            'exito' => true,
            'token' => $token
        );
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