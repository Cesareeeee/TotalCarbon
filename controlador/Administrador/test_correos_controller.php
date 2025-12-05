<?php
// Controlador independiente para TEST_CORREOS

// Eliminar cualquier salida anterior
if (ob_get_level()) {
    ob_end_clean();
}

// Cargar autoloader de Composer
require __DIR__ . '/../../vendor/autoload.php';

// Incluir archivo de conexión
require_once '../../modelos/php/database.php';

// Establecer encabezado JSON ANTES de cualquier salida
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-cache, must-revalidate');

// Desactivar mostrar errores
ini_set('display_errors', 0);
error_reporting(0);

// Función para enviar correo con credenciales del nuevo usuario
function enviarCorreoCredenciales($correo, $codigo_usuario, $contrasena) {
    error_log("Intentando enviar credenciales a: $correo");
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
        $mail->Subject = 'Bienvenido a Total Carbon - Tus Credenciales de Acceso';

        $mail->Body = '
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <img src="https://i.ibb.co/3ySCGvxS/logo2.png" alt="Total Carbon Logo" style="max-width: 200px;">
            </div>

            <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h2 style="color: #000000; text-align: center; margin-bottom: 20px;">¡Bienvenido a Total Carbon!</h2>

                <p style="color: #333333; font-size: 16px; line-height: 1.6;">
                    Tu cuenta ha sido creada exitosamente. A continuación encontrarás tus credenciales de acceso:
                </p>

                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #000000;">
                    <p style="margin: 10px 0; font-size: 16px;"><strong>Código de Usuario:</strong> <span style="color: #000000; font-weight: bold;">' . $codigo_usuario . '</span></p>
                    <p style="margin: 10px 0; font-size: 16px;"><strong>Contraseña:</strong> <span style="color: #000000; font-weight: bold;">' . $contrasena . '</span></p>
                    <p style="margin: 10px 0; font-size: 16px;"><strong>Correo:</strong> <span style="color: #000000;">' . $correo . '</span></p>
                </div>

                <div style="background-color: #000000; color: #ffffff; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
                    <p style="margin: 0; font-size: 14px;">
                        <strong>IMPORTANTE:</strong> Te recomendamos cambiar tu contraseña después del primer inicio de sesión por seguridad.
                    </p>
                </div>

                <p style="color: #333333; font-size: 16px; line-height: 1.6;">
                    Puedes iniciar sesión en nuestro sistema usando tu código de usuario o correo electrónico junto con la contraseña proporcionada.
                </p>

                <div style="text-align: center; margin-top: 30px;">
                    <p style="color: #666666; font-size: 14px;">
                        Si tienes problemas para iniciar sesión, contacta a hola@totalcarbon.com.mx
                    </p>
                </div>
            </div>

            <div style="text-align: center; margin-top: 20px; color: #999999; font-size: 12px;">
                <p>&copy; 2025 Total Carbon. Todos los derechos reservados.</p>
            </div>
        </div>';

        $mail->AltBody = "Bienvenido a Total Carbon!\n\nTus credenciales de acceso son:\n\nCódigo de Usuario: $codigo_usuario\nContraseña: $contrasena\nCorreo: $correo\n\nPuedes iniciar sesión en nuestro sistema usando estas credenciales.\n\nIMPORTANTE: Te recomendamos cambiar tu contraseña después del primer inicio de sesión.";

        $mail->send();
        error_log("Correo de credenciales enviado exitosamente a: $correo");
        return true;

    } catch (Exception $e) {
        error_log("Error al enviar correo de credenciales: " . $mail->ErrorInfo);
        error_log("Excepción completa: " . $e->getMessage());
        return false;
    }
}

function registrarUsuarioTest($email) {
    try {
        $conexion = getConexion();

        // Verificar si el email ya existe usando la función existente
        if (correoExiste($email)) {
            return ['success' => false, 'error' => 'El correo electrónico ya está registrado.'];
        }

        // Generar código de usuario usando la función existente
        $codigo_usuario = generarCodigoUsuario();

        // Generar contraseña aleatoria de 8 caracteres
        $contrasena = generarContrasenaAleatoria(8);
        $contrasena_encriptada = password_hash($contrasena, PASSWORD_DEFAULT);

        // Insertar usuario
        $query = "INSERT INTO usuarios (codigo_usuario, nombres, apellidos, correo_electronico, contrasena, id_rol, estado_usuario) VALUES (?, '', '', ?, ?, 2, 1)";
        $stmt = $conexion->prepare($query);
        if (!$stmt) {
            return ['success' => false, 'error' => 'Prepare failed: ' . $conexion->error];
        }

        $stmt->bind_param('sss', $codigo_usuario, $email, $contrasena_encriptada);

        if ($stmt->execute()) {
            // Enviar correo con credenciales
            if (enviarCorreoCredenciales($email, $codigo_usuario, $contrasena)) {
                return [
                    'success' => true,
                    'codigo_usuario' => $codigo_usuario,
                    'contrasena' => $contrasena,
                    'email' => $email,
                    'message' => 'Usuario registrado y credenciales enviadas por correo electrónico.'
                ];
            } else {
                // Usuario creado pero error al enviar correo
                return [
                    'success' => true,
                    'codigo_usuario' => $codigo_usuario,
                    'contrasena' => $contrasena,
                    'email' => $email,
                    'warning' => 'Usuario registrado pero hubo un error al enviar el correo electrónico.',
                    'message' => 'Usuario registrado exitosamente. Credenciales: Código: ' . $codigo_usuario . ', Contraseña: ' . $contrasena
                ];
            }
        } else {
            return ['success' => false, 'error' => $stmt->error];
        }
    } catch (Exception $e) {
        return ['success' => false, 'error' => 'Database error: ' . $e->getMessage()];
    }
}

function generarContrasenaAleatoria($longitud = 8) {
    $caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*';
    $contrasena = '';
    for ($i = 0; $i < $longitud; $i++) {
        $contrasena .= $caracteres[rand(0, strlen($caracteres) - 1)];
    }
    return $contrasena;
}

// Verificar método de solicitud
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(['success' => false, 'error' => 'Método no permitido']);
    exit;
}

$action = isset($_POST['action']) ? trim($_POST['action']) : '';

if (empty($action)) {
    echo json_encode(['success' => false, 'error' => 'Acción no especificada']);
    exit;
}

try {
    switch ($action) {
        case 'registrarUsuario':
            $email = isset($_POST['email']) ? trim($_POST['email']) : '';
            if (empty($email)) {
                echo json_encode(['success' => false, 'error' => 'Email requerido']);
                break;
            }
            $result = registrarUsuarioTest($email);
            echo json_encode($result);
            break;
        default:
            echo json_encode(['success' => false, 'error' => 'Invalid action']);
            break;
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => 'Server error: ' . $e->getMessage()]);
}