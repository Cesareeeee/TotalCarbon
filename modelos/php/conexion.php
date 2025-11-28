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

            // Detectar si es usuario nuevo (nombres y apellidos vacíos)
            $_SESSION['usuario_nuevo'] = empty($usuario_data['nombres']) && empty($usuario_data['apellidos']);

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