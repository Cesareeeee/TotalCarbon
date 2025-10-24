POR FAVOR SI NO HA ENVIADO COTIZACIONES AUN, QUE MUESTRE EL MENSAJE QUE NO TIENE COTIZACIONES. Y POR FAVOR DAME LOS CODIGOS YA PARA HACERLO FUNCIONAL, TODOS COMPLETOS, PERO POR SEPARADO CSS, JS Y HTML Y PHP  POR FAVOR, ESTAS SERAN LAS RUTAS POR FAVOR
 ../js/Cliente/PaginaCliente.js
 ../controlador/Cliente/ClienteController.php
 ../vistas/Cliente/PaginaCliente.php
Y TAMBIEN DAME DE NUEVO TODAS LAS INSERCCIONES Y MODIFICACIONES PATRA LS BASE DE DATOS POR FAVOR, DAMELOS QUE VALIDE QUE LA SESION ESTE INICIADA PARA QUE MUESTRE EL NOKMBRE CORRECTO POR FAVOR 
ESTE ES MI ARCHIVO DE AUTENTICACION PARA QUE LOS USES SI LOS NECEITAS Y SI HACES ALGUN CAMBIO QUE NO AFECTE ESE FUNCIONAMIENTO QUE YA TIENE MEDICES 
 auth.php
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
            return '../vistas/Administrador/administrador.php';
        case 'EMPLEADO':
            return '../vistas/empleado.php';
        case 'CLIENTE':
        default:
            return '../vistas/cliente.php';
    }
}
?>


Y ESTE ES EL DE MI CONEXION A LA BD
conexion.php
<?php
// Configuración de la base de datos
 $servidor = "localhost";
 $usuario = "root";
 $password = "";
 $basededatos = "totalcarbon";

// Crear conexión
 $conexion = new mysqli($servidor, $usuario, $password, $basededatos);

// Verificar conexión
if ($conexion->connect_error) {
    die("Error de conexión: " . $conexion->connect_error);
}

// Establecer charset
 $conexion->set_charset("utf8");

// Función para limpiar datos de entrada
function limpiarDatos($dato) {
    global $conexion;
    $dato = trim($dato);
    $dato = stripslashes($dato);
    $dato = htmlspecialchars($dato);
    return $conexion->real_escape_string($dato);
}

// Función para generar código de usuario secuencial (TC00001, TC00002, etc.)
function generarCodigoUsuario() {
    global $conexion;
    
    // Consultar el último código de usuario
    $consulta = "SELECT codigo_usuario FROM usuarios ORDER BY id_usuario DESC LIMIT 1";
    $resultado = $conexion->query($consulta);
    
    if ($resultado->num_rows > 0) {
        $fila = $resultado->fetch_assoc();
        $ultimoCodigo = $fila['codigo_usuario'];
        
        // Extraer el número del código (TC00001 -> 00001)
        $numero = intval(substr($ultimoCodigo, 2));
        
        // Incrementar el número
        $numero++;
        
        // Formatear con ceros a la izquierda (5 dígitos)
        $numeroFormateado = str_pad($numero, 5, '0', STR_PAD_LEFT);
        
        // Generar nuevo código
        $nuevoCodigo = 'TC' . $numeroFormateado;
    } else {
        // Si no hay usuarios, empezar con TC00001
        $nuevoCodigo = 'TC00001';
    }
    
    return $nuevoCodigo;
}

// Función para verificar si el correo ya existe
function correoExiste($correo) {
    global $conexion;
    $correo = limpiarDatos($correo);
    $consulta = "SELECT id_usuario FROM usuarios WHERE correo_electronico = '$correo'";
    $resultado = $conexion->query($consulta);
    return $resultado->num_rows > 0;
}

// Función para registrar un nuevo usuario
function registrarUsuario($nombres, $apellidos, $correo, $telefono, $contrasena) {
    global $conexion;
    
    // Limpiar datos
    $nombres = limpiarDatos($nombres);
    $apellidos = limpiarDatos($apellidos);
    $correo = limpiarDatos($correo);
    $telefono = limpiarDatos($telefono);
    
    // Encriptar contraseña
    $contrasena_hash = password_hash($contrasena, PASSWORD_DEFAULT);
    
    // Generar código de usuario secuencial
    $codigo_usuario = generarCodigoUsuario();
    
    // Obtener ID del rol CLIENTE
    $consulta_rol = "SELECT id_rol FROM roles WHERE nombre_rol = 'CLIENTE'";
    $resultado_rol = $conexion->query($consulta_rol);
    
    if ($resultado_rol->num_rows > 0) {
        $fila_rol = $resultado_rol->fetch_assoc();
        $id_rol = $fila_rol['id_rol'];
    } else {
        // Si no existe el rol CLIENTE, lo creamos
        $consulta_crear_rol = "INSERT INTO roles (nombre_rol, descripcion) VALUES ('CLIENTE', 'Usuario cliente de Total Carbon')";
        $conexion->query($consulta_crear_rol);
        $id_rol = $conexion->insert_id;
    }
    
    // Insertar usuario
    $consulta = "INSERT INTO usuarios (codigo_usuario, nombres, apellidos, correo_electronico, numero_telefono, contrasena, id_rol, estado_usuario, creado_en) 
              VALUES ('$codigo_usuario', '$nombres', '$apellidos', '$correo', '$telefono', '$contrasena_hash', $id_rol, 1, NOW())";
    
    if ($conexion->query($consulta) === TRUE) {
        return true;
    } else {
        return false;
    }
}

// Función para iniciar sesión (ahora acepta correo o código de usuario)
function iniciarSesion($usuario, $contrasena) {
    global $conexion;
    
    // Limpiar datos
    $usuario = limpiarDatos($usuario);
    
    // Determinar si es correo o código de usuario
    $esCorreo = filter_var($usuario, FILTER_VALIDATE_EMAIL);
    
    // Construir consulta según el tipo de usuario
    if ($esCorreo) {
        $consulta = "SELECT * FROM usuarios WHERE correo_electronico = '$usuario' AND estado_usuario = 1";
    } else {
        // Es código de usuario
        $consulta = "SELECT * FROM usuarios WHERE codigo_usuario = '$usuario' AND estado_usuario = 1";
    }
    
    $resultado = $conexion->query($consulta);
    
    if ($resultado->num_rows > 0) {
        $usuario_data = $resultado->fetch_assoc();
        
        // Verificar contraseña
        if (password_verify($contrasena, $usuario_data['contrasena'])) {
            // Iniciar sesión
            session_start();
            $_SESSION['id_usuario'] = $usuario_data['id_usuario'];
            $_SESSION['codigo_usuario'] = $usuario_data['codigo_usuario'];
            $_SESSION['nombres'] = $usuario_data['nombres'];
            $_SESSION['apellidos'] = $usuario_data['apellidos'];
            $_SESSION['correo_electronico'] = $usuario_data['correo_electronico'];
            $_SESSION['id_rol'] = $usuario_data['id_rol'];
            
            return true;
        }
    }
    
    return false;
}

// Función para obtener el nombre del rol
function obtenerNombreRol($id_rol) {
    global $conexion;
    
    $consulta = "SELECT nombre_rol FROM roles WHERE id_rol = $id_rol";
    $resultado = $conexion->query($consulta);
    
    if ($resultado->num_rows > 0) {
        $fila = $resultado->fetch_assoc();
        return $fila['nombre_rol'];
    }
    
    return "Desconocido";
}

// Función para generar un token CSRF
function generarTokenCSRF() {
    if (!isset($_SESSION)) {
        session_start();
    }
    
    // Generar token aleatorio
    $token = bin2hex(random_bytes(32));
    
    // Almacenar token en sesión
    $_SESSION['csrf_token'] = $token;
    
    return $token;
}

// Función para verificar un token CSRF
function verificarTokenCSRF($token) {
    if (!isset($_SESSION)) {
        session_start();
    }
    
    // Verificar si el token existe en la sesión
    if (isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token)) {
        return true;
    }
    
    return false;
}

// Función para registrar actividad en un archivo de logs
function registrarActividad($actividad, $id_usuario = null, $ip = null) {
    // Ruta del archivo de logs (asegúrate de que exista y tenga permisos de escritura)
    $ruta_logs = __DIR__ . '/../../logs/actividad.log';
    
    // Crear directorio si no existe
    $directorio_logs = dirname($ruta_logs);
    if (!file_exists($directorio_logs)) {
        mkdir($directorio_logs, 0755, true);
    }
    
    // Obtener fecha y hora actual
    $fecha_hora = date('Y-m-d H:i:s');
    
    // Obtener información del usuario si está disponible
    $info_usuario = $id_usuario ? "ID: $id_usuario" : "No identificado";
    
    // Obtener IP si no se proporcionó
    if (!$ip) {
        $ip = $_SERVER['REMOTE_ADDR'];
    }
    
    // Formatear línea de log
    $linea_log = "[$fecha_hora] IP: $ip | Usuario: $info_usuario | Actividad: $actividad\n";
    
    // Escribir en el archivo de logs
    file_put_contents($ruta_logs, $linea_log, FILE_APPEND | LOCK_EX);
}

// Función para incrementar el contador de intentos fallidos
function incrementarIntentosFallidos($ip) {
    // Ruta del archivo de logs de intentos fallidos
    $ruta_logs = __DIR__ . '/../../logs/intentos_fallidos.log';
    
    // Crear directorio si no existe
    $directorio_logs = dirname($ruta_logs);
    if (!file_exists($directorio_logs)) {
        mkdir($directorio_logs, 0755, true);
    }
    
    // Obtener fecha y hora actual
    $fecha_hora = date('Y-m-d H:i:s');
    
    // Verificar si ya hay intentos registrados para esta IP
    $intentos = 0;
    $bloqueado_hasta = null;
    
    if (file_exists($ruta_logs)) {
        $contenido = file_get_contents($ruta_logs);
        $lineas = explode("\n", $contenido);
        
        foreach ($lineas as $linea) {
            if (empty($linea)) continue;
            
            $datos = json_decode($linea, true);
            if ($datos && $datos['ip'] === $ip) {
                $intentos = $datos['intentos'];
                $bloqueado_hasta = $datos['bloqueado_hasta'];
                break;
            }
        }
    }
    
    // Incrementar intentos
    $intentos++;
    
    // Si hay 5 o más intentos, bloquear por 30 minutos
    if ($intentos >= 5) {
        $bloqueado_hasta = date('Y-m-d H:i:s', strtotime('+30 minutes'));
    }
    
    // Preparar datos para guardar
    $datos_ip = [
        'ip' => $ip,
        'intentos' => $intentos,
        'ultimo_intento' => $fecha_hora,
        'bloqueado_hasta' => $bloqueado_hasta
    ];
    
    // Leer archivo completo
    $lineas_actualizadas = [];
    $ip_encontrada = false;
    
    if (file_exists($ruta_logs)) {
        $contenido = file_get_contents($ruta_logs);
        $lineas = explode("\n", $contenido);
        
        foreach ($lineas as $linea) {
            if (empty($linea)) continue;
            
            $datos = json_decode($linea, true);
            if ($datos && $datos['ip'] === $ip) {
                // Actualizar línea existente
                $lineas_actualizadas[] = json_encode($datos_ip);
                $ip_encontrada = true;
            } else {
                // Mantener línea existente
                $lineas_actualizadas[] = $linea;
            }
        }
    }
    
    // Si no se encontró la IP, agregar nueva línea
    if (!$ip_encontrada) {
        $lineas_actualizadas[] = json_encode($datos_ip);
    }
    
    // Escribir archivo actualizado
    file_put_contents($ruta_logs, implode("\n", $lineas_actualizadas) . "\n", LOCK_EX);
}

// Función para verificar si una IP está bloqueada
function verificarBloqueoPorIP($ip) {
    // Ruta del archivo de logs de intentos fallidos
    $ruta_logs = __DIR__ . '/../../logs/intentos_fallidos.log';
    
    // Si el archivo no existe, no hay bloqueos
    if (!file_exists($ruta_logs)) {
        return false;
    }
    
    // Leer archivo
    $contenido = file_get_contents($ruta_logs);
    $lineas = explode("\n", $contenido);
    
    foreach ($lineas as $linea) {
        if (empty($linea)) continue;
        
        $datos = json_decode($linea, true);
        if ($datos && $datos['ip'] === $ip) {
            // Verificar si está bloqueado y si el bloqueo aún es válido
            if ($datos['bloqueado_hasta'] && strtotime($datos['bloqueado_hasta']) > time()) {
                return true;
            }
            break;
        }
    }
    
    return false;
}

// Función para reiniciar el contador de intentos fallidos
function reiniciarIntentosFallidos($ip) {
    // Ruta del archivo de logs de intentos fallidos
    $ruta_logs = __DIR__ . '/../../logs/intentos_fallidos.log';
    
    // Si el archivo no existe, no hay nada que hacer
    if (!file_exists($ruta_logs)) {
        return;
    }
    
    // Leer archivo
    $contenido = file_get_contents($ruta_logs);
    $lineas = explode("\n", $contenido);
    $lineas_actualizadas = [];
    
    foreach ($lineas as $linea) {
        if (empty($linea)) continue;
        
        $datos = json_decode($linea, true);
        if ($datos && $datos['ip'] === $ip) {
            // Reiniciar contador para esta IP
            $datos['intentos'] = 0;
            $datos['bloqueado_hasta'] = null;
            $lineas_actualizadas[] = json_encode($datos);
        } else {
            // Mantener línea existente
            $lineas_actualizadas[] = $linea;
        }
    }
    
    // Escribir archivo actualizado
    file_put_contents($ruta_logs, implode("\n", $lineas_actualizadas) . "\n", LOCK_EX);
}
?>