<?php
// Eliminar cualquier salida anterior
if (ob_get_level()) {
    ob_end_clean();
}

// Cargar autoloader de Composer
require __DIR__ . '/../vendor/autoload.php';

// Incluir archivo de conexión
require_once __DIR__ . '/../modelos/php/conexion.php';

// Iniciar sesión
session_start();

// Establecer encabezado JSON ANTES de cualquier salida
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-cache, must-revalidate');

// Desactivar mostrar errores
ini_set('display_errors', 0);
error_reporting(0);

// Función para enviar respuesta JSON y salir
function enviarRespuesta($exito, $mensaje, $datos = []) {
    $respuesta = array_merge([
        'exito' => $exito,
        'mensaje' => $mensaje
    ], $datos);
    
    echo json_encode($respuesta, JSON_UNESCAPED_UNICODE);
    exit;
}

// Función para enviar correo real
function enviarCorreoRecuperacion($correo, $codigo) {
    error_log("Intentando enviar correo a: $correo con código: $codigo");
    $mail = new PHPMailer\PHPMailer\PHPMailer(true);

    try {
        // Configuración del servidor
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';      // Servidor SMTP
        $mail->SMTPAuth   = true;
        $mail->Username   = 'crkendok@gmail.com';  // Tu correo Gmail
        $mail->Password   = 'hykw efou csao hhfs';     // Tu contraseña de aplicación
        $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port       = 465;
        $mail->CharSet    = 'UTF-8';  // Configurar charset UTF-8
        error_log("Configuración SMTP completada");
        
        // Remitente y destinatario
        $mail->setFrom('tu_email@gmail.com', 'Total Carbon');
        $mail->addAddress($correo);
        
        // Contenido del correo
        $mail->isHTML(true);
        $mail->Subject = 'Recuperación de Contraseña - Total Carbon';
        
        $mail->Body = '
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <img src="https://i.ibb.co/3ySCGvxS/logo2.png" alt="Total Carbon Logo" style="max-width: 200px;">
            </div>
            
            <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h2 style="color: #000000; text-align: center; margin-bottom: 20px;">Recuperación de Contraseña</h2>
                
                <p style="color: #333333; font-size: 16px; line-height: 1.6;">
                    Hemos recibido una solicitud para restablecer tu contraseña. Utiliza el siguiente código de verificación:
                </p>
                
                <div style="background-color: #000000; color: #ffffff; font-size: 32px; font-weight: bold; text-align: center; padding: 20px; border-radius: 8px; margin: 30px 0; letter-spacing: 5px;">
                    ' . $codigo . '
                </div>
                
                <p style="color: #333333; font-size: 16px; line-height: 1.6;">
                    Este código expirará en <strong>15 minutos</strong>. Si no solicitaste este cambio, puedes ignorar este correo.
                </p>
                
                <div style="text-align: center; margin-top: 30px;">
                    <p style="color: #666666; font-size: 14px;">
                        Si tienes problemas, contacta a hola@totalcarbon.com.mx
                    </p>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 20px; color: #999999; font-size: 12px;">
                <p>&copy; 2025 Total Carbon. Todos los derechos reservados.</p>
            </div>
        </div>';
        
        $mail->AltBody = "Tu código de recuperación es: $codigo\n\nEste código expirará en 15 minutos.";
        
        $mail->send();
        error_log("Correo enviado exitosamente");
        return true;

    } catch (Exception $e) {
        error_log("Error al enviar correo: " . $mail->ErrorInfo);
        error_log("Excepción completa: " . $e->getMessage());
        return false;
    }
}

// Verificar método de solicitud
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    enviarRespuesta(false, "Método no permitido");
}

$accion = isset($_POST['accion']) ? trim($_POST['accion']) : '';

error_log("Acción recibida: " . $accion);
error_log("POST data: " . print_r($_POST, true));

if (empty($accion)) {
    enviarRespuesta(false, "Acción no especificada");
}

try {
    switch ($accion) {
        case 'solicitar_recuperacion':
            error_log("Procesando solicitud de recuperación");
            $correo = isset($_POST['correo']) ? trim($_POST['correo']) : '';
            error_log("Correo recibido: " . $correo);

            if (empty($correo)) {
                enviarRespuesta(false, "El correo electrónico es necesario");
            }

            // Validar formato de correo
            if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
                enviarRespuesta(false, "Formato de correo electrónico inválido");
            }
            
            // Buscar usuario por correo
            $correo = $conexion->real_escape_string($correo);
            $consulta = "SELECT id_usuario, nombres, correo_electronico FROM usuarios WHERE correo_electronico = '$correo' AND estado_usuario = 1";
            error_log("Consulta SQL: " . $consulta);

            $resultado = $conexion->query($consulta);
            error_log("Resultado de consulta: " . ($resultado ? "éxito" : "fallo"));
            if ($resultado) {
                error_log("Número de filas: " . $resultado->num_rows);
            }

            if ($resultado && $resultado->num_rows > 0) {
                $usuario = $resultado->fetch_assoc();
                $id_usuario = $usuario['id_usuario'];
                
                // Generar código de recuperación
                $codigo_recuperacion = sprintf('%06d', mt_rand(0, 999999));
                
                // Guardar código en la base de datos
                $fecha_expiracion = date('Y-m-d H:i:s', strtotime('+15 minutes'));
                
                // Invalidar códigos anteriores
                $conexion->query("UPDATE codigos_recuperacion SET utilizado = 1 WHERE id_usuario = $id_usuario AND utilizado = 0");
                
                // Insertar nuevo código
                $consulta_insert = "INSERT INTO codigos_recuperacion (id_usuario, codigo_recuperacion, fecha_expiracion, utilizado, creado_en) 
                                  VALUES ($id_usuario, '$codigo_recuperacion', '$fecha_expiracion', 0, NOW())";
                
                if ($conexion->query($consulta_insert)) {
                    error_log("Código insertado correctamente");
                    // Enviar correo real
                    if (enviarCorreoRecuperacion($usuario['correo_electronico'], $codigo_recuperacion)) {
                        error_log("Código de recuperación enviado a: {$usuario['correo_electronico']}, Código: $codigo_recuperacion");

                        enviarRespuesta(true, "Hemos enviado un código de recuperación a tu correo electrónico", [
                            'id_usuario' => $id_usuario,
                            'correo' => $correo
                        ]);
                    } else {
                        error_log("Error al enviar correo");
                        enviarRespuesta(false, "Error al enviar el correo de recuperación");
                    }
                } else {
                    error_log("Error al insertar código: " . $conexion->error);
                    enviarRespuesta(false, "Error al generar el código de recuperación");
                }
            } else {
                // Por seguridad, no revelar si el usuario existe
                enviarRespuesta(false, "Si el correo está registrado, recibirás un código de recuperación");
            }
            break;
            
        case 'verificar_codigo':
            $codigo = isset($_POST['codigo']) ? trim($_POST['codigo']) : '';
            $id_usuario = isset($_POST['id_usuario']) ? (int)$_POST['id_usuario'] : 0;
            
            if (empty($codigo) || $id_usuario <= 0) {
                enviarRespuesta(false, "Datos incompletos");
            }
            
            if (strlen($codigo) !== 6 || !ctype_digit($codigo)) {
                enviarRespuesta(false, "El código debe tener 6 dígitos");
            }
            
            // Verificar código
            $consulta = "SELECT * FROM codigos_recuperacion 
                        WHERE id_usuario = $id_usuario AND codigo_recuperacion = '$codigo' 
                        AND utilizado = 0 AND fecha_expiracion > NOW()";
            
            $resultado = $conexion->query($consulta);
            
            if ($resultado && $resultado->num_rows > 0) {
                // Marcar código como utilizado
                $conexion->query("UPDATE codigos_recuperacion SET utilizado = 1 
                                 WHERE id_usuario = $id_usuario AND codigo_recuperacion = '$codigo'");
                
                error_log("Código verificado para usuario ID: $id_usuario");
                
                enviarRespuesta(true, "Código verificado correctamente");
            } else {
                enviarRespuesta(false, "El código es inválido o ha expirado");
            }
            break;
            
        case 'reenviar_codigo':
            $id_usuario = isset($_POST['id_usuario']) ? (int)$_POST['id_usuario'] : 0;
            $correo = isset($_POST['correo']) ? trim($_POST['correo']) : '';
            
            if ($id_usuario <= 0 || empty($correo)) {
                enviarRespuesta(false, "Datos incompletos");
            }
            
            // Generar nuevo código
            $codigo_recuperacion = sprintf('%06d', mt_rand(0, 999999));
            $fecha_expiracion = date('Y-m-d H:i:s', strtotime('+15 minutes'));
            
            // Invalidar códigos anteriores
            $conexion->query("UPDATE codigos_recuperacion SET utilizado = 1 WHERE id_usuario = $id_usuario AND utilizado = 0");
            
            // Insertar nuevo código
            $consulta_insert = "INSERT INTO codigos_recuperacion (id_usuario, codigo_recuperacion, fecha_expiracion, utilizado, creado_en) 
                              VALUES ($id_usuario, '$codigo_recuperacion', '$fecha_expiracion', 0, NOW())";
            
            if ($conexion->query($consulta_insert)) {
                // Enviar correo real
                if (enviarCorreoRecuperacion($correo, $codigo_recuperacion)) {
                    error_log("Código reenviado a: $correo, Nuevo código: $codigo_recuperacion");
                    
                    enviarRespuesta(true, "Hemos enviado un nuevo código a tu correo electrónico");
                } else {
                    enviarRespuesta(false, "Error al reenviar el correo");
                }
            } else {
                enviarRespuesta(false, "Error al generar el nuevo código");
            }
            break;
            
        case 'actualizar_contrasena':
            $id_usuario = isset($_POST['id_usuario']) ? (int)$_POST['id_usuario'] : 0;
            $nueva_contrasena = isset($_POST['nueva_contrasena']) ? trim($_POST['nueva_contrasena']) : '';
            
            if ($id_usuario <= 0 || empty($nueva_contrasena)) {
                enviarRespuesta(false, "Datos incompletos");
            }
            
            // Validar contraseña
            if (strlen($nueva_contrasena) < 8) {
                enviarRespuesta(false, "La contraseña debe tener al menos 8 caracteres");
            }
            
            if (!preg_match('/[A-Z]/', $nueva_contrasena)) {
                enviarRespuesta(false, "La contraseña debe tener al menos una letra mayúscula");
            }
            
            if (!preg_match('/[a-z]/', $nueva_contrasena)) {
                enviarRespuesta(false, "La contraseña debe tener al menos una letra minúscula");
            }
            
            if (!preg_match('/[0-9]/', $nueva_contrasena)) {
                enviarRespuesta(false, "La contraseña debe tener al menos un número");
            }
            
            // Encriptar nueva contraseña
            $contrasena_hash = password_hash($nueva_contrasena, PASSWORD_DEFAULT);
            
            // Actualizar contraseña
            $consulta = "UPDATE usuarios SET contrasena = '$contrasena_hash', actualizado_en = NOW() WHERE id_usuario = $id_usuario";
            
            if ($conexion->query($consulta)) {
                error_log("Contraseña actualizada para usuario ID: $id_usuario");
                
                enviarRespuesta(true, "Contraseña actualizada exitosamente");
            } else {
                enviarRespuesta(false, "Error al actualizar la contraseña");
            }
            break;
            
                            default:
                           enviarRespuesta(false, "Acción no válida");
    }
} catch (Exception $e) {
    error_log("Error en recuperar_contrasena.php: " . $e->getMessage());
    error_log("Stack trace: " . $e->getTraceAsString());
    enviarRespuesta(false, "Error del sistema. Por favor, intenta más tarde.");
}
?>