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

// Función para iniciar sesión
function iniciarSesion($correo, $contrasena) {
    global $conexion;
    
    // Limpiar datos
    $correo = limpiarDatos($correo);
    
    // Buscar usuario
    $consulta = "SELECT * FROM usuarios WHERE correo_electronico = '$correo' AND estado_usuario = 1";
    $resultado = $conexion->query($consulta);
    
    if ($resultado->num_rows > 0) {
        $usuario = $resultado->fetch_assoc();
        
        // Verificar contraseña
        if (password_verify($contrasena, $usuario['contrasena'])) {
            // Iniciar sesión
            session_start();
            $_SESSION['id_usuario'] = $usuario['id_usuario'];
            $_SESSION['codigo_usuario'] = $usuario['codigo_usuario'];
            $_SESSION['nombres'] = $usuario['nombres'];
            $_SESSION['apellidos'] = $usuario['apellidos'];
            $_SESSION['correo_electronico'] = $usuario['correo_electronico'];
            $_SESSION['id_rol'] = $usuario['id_rol'];
            
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
?>