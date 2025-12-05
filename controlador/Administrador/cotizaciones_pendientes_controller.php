<?php
header('Content-Type: application/json; charset=utf-8');
session_start();

require_once '../../modelos/php/database.php';
require_once '../../vendor/autoload.php'; // Para PHPMailer

// Usando conexión PDO centralizada
$db = getPDO();

// Verificar sesión de admin
if (!isset($_SESSION['id_usuario']) || !isset($_SESSION['id_rol'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit;
}

$logFile = __DIR__ . '/../../logs/cotizaciones_pendientes.log';

function escribirLog($mensaje, $datos = null) {
    global $logFile;
    $timestamp = date('Y-m-d H:i:s');
    $logMessage = "[$timestamp] $mensaje";

    if ($datos !== null) {
        $logMessage .= " | Datos: " . json_encode($datos);
    }

    $logMessage .= "\n";

    if (!file_exists(dirname($logFile))) {
        mkdir(dirname($logFile), 0777, true);
    }

    file_put_contents($logFile, $logMessage, FILE_APPEND);
}

function responder($data, int $status = 200) {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

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
                    Tu mensaje ha sido recibido. Hemos creado una cuenta para ti. Por favor, ingresa sesión a nuestra página para seguir con el proceso de tu servicio.
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

        $mail->AltBody = "Bienvenido a Total Carbon!\n\nTu mensaje ha sido recibido. Hemos creado una cuenta para ti. Por favor, ingresa sesión a nuestra página para seguir con el proceso de tu servicio.\n\nTus credenciales de acceso son:\n\nCódigo de Usuario: $codigo_usuario\nContraseña: $contrasena\nCorreo: $correo\n\nPuedes iniciar sesión en nuestro sistema usando estas credenciales.\n\nIMPORTANTE: Te recomendamos cambiar tu contraseña después del primer inicio de sesión.";

        $mail->send();
        error_log("Correo de credenciales enviado exitosamente a: $correo");
        return true;

    } catch (Exception $e) {
        error_log("Error al enviar correo de credenciales: " . $mail->ErrorInfo);
        error_log("Excepción completa: " . $e->getMessage());
        return false;
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

$metodo = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// Obtener acción desde GET o POST
$accion = $_GET['accion'] ?? '';

if ($metodo === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if ($input === null) {
        $input = $_POST;
    }
    $accion = $input['accion'] ?? $accion;
}

escribirLog("=== Solicitud: $metodo $accion ===");

try {

    switch ($metodo) {
        case 'GET':
            if ($accion === 'obtener_todas') {
                $sql = "SELECT * FROM cotizaciones ORDER BY fecha DESC";
                $stmt = $db->prepare($sql);
                $stmt->execute();
                $cotizaciones = $stmt->fetchAll(PDO::FETCH_ASSOC);
                escribirLog("Cotizaciones obtenidas: " . count($cotizaciones));
                responder(['success' => true, 'cotizaciones' => $cotizaciones]);
            } elseif ($accion === 'obtener_pendientes') {
                $sql = "SELECT * FROM cotizaciones WHERE estado = 'PENDIENTE' ORDER BY fecha DESC";
                $stmt = $db->prepare($sql);
                $stmt->execute();
                $cotizaciones = $stmt->fetchAll(PDO::FETCH_ASSOC);
                escribirLog("Cotizaciones pendientes obtenidas: " . count($cotizaciones));
                responder(['success' => true, 'cotizaciones' => $cotizaciones]);
            } elseif ($accion === 'obtener_cotizacion') {
                $id = (int)($_GET['id'] ?? 0);
                if ($id <= 0) {
                    responder(['success' => false, 'message' => 'ID inválido'], 400);
                }
                $sql = "SELECT * FROM cotizaciones WHERE id = :id";
                $stmt = $db->prepare($sql);
                $stmt->execute([':id' => $id]);
                $cotizacion = $stmt->fetch(PDO::FETCH_ASSOC);
                if (!$cotizacion) {
                    responder(['success' => false, 'message' => 'Cotización no encontrada'], 404);
                }
                responder([
                    'success' => true,
                    'cotizacion' => $cotizacion
                ]);
            }
            break;

        case 'POST':
            $input = json_decode(file_get_contents('php://input'), true);
            if ($input === null) {
                $input = $_POST;
                if (empty($input)) {
                    responder(['success' => false, 'message' => 'Datos inválidos'], 400);
                }
            }

            if ($accion === 'actualizar_estado') {
                $id = (int)($input['id'] ?? 0);
                $estado = $input['estado'] ?? '';
                $estadosPermitidos = ['PENDIENTE', 'APROBADA', 'RECHAZADA', 'EN_PROCESO'];
                if ($id <= 0 || !in_array($estado, $estadosPermitidos)) {
                    responder(['success' => false, 'message' => 'Datos inválidos'], 400);
                }

                // Actualizar estado
                $sql = "UPDATE cotizaciones SET estado = :estado WHERE id = :id";
                $stmt = $db->prepare($sql);
                $resultado = $stmt->execute([':estado' => $estado, ':id' => $id]);
                escribirLog("Estado actualizado: $id -> $estado");
                responder(['success' => $resultado, 'message' => $resultado ? 'Estado actualizado' : 'Error al actualizar']);
            } elseif ($accion === 'aprobar_y_crear_usuario') {
                $id = (int)($input['id'] ?? 0);
                if ($id <= 0) {
                    responder(['success' => false, 'message' => 'ID inválido'], 400);
                }

                // Obtener datos de la cotización
                $sqlCotizacion = "SELECT nombre, email FROM cotizaciones WHERE id = :id";
                $stmtCotizacion = $db->prepare($sqlCotizacion);
                $stmtCotizacion->execute([':id' => $id]);
                $cotizacion = $stmtCotizacion->fetch(PDO::FETCH_ASSOC);

                if (!$cotizacion) {
                    responder(['success' => false, 'message' => 'Cotización no encontrada'], 404);
                }

                $email = $cotizacion['email'];
                $nombre = $cotizacion['nombre'];

                // Verificar si el email ya existe
                if (correoExiste($email)) {
                    responder(['success' => false, 'message' => 'Ya existe un usuario con este correo electrónico'], 400);
                }

                // Actualizar estado a APROBADA
                $sql = "UPDATE cotizaciones SET estado = 'APROBADA' WHERE id = :id";
                $stmt = $db->prepare($sql);
                $stmt->execute([':id' => $id]);

                // Generar código de usuario
                $codigo_usuario = generarCodigoUsuario();

                // Generar contraseña aleatoria
                $contrasena = generarContrasenaAleatoria(8);
                $contrasena_encriptada = password_hash($contrasena, PASSWORD_DEFAULT);

                // Insertar usuario
                $query = "INSERT INTO usuarios (codigo_usuario, nombres, apellidos, correo_electronico, contrasena, id_rol, estado_usuario) VALUES (?, '', '', ?, ?, 2, 1)";
                $stmtUsuario = $db->prepare($query);
                $stmtUsuario->bindParam(1, $codigo_usuario);
                $stmtUsuario->bindParam(2, $email);
                $stmtUsuario->bindParam(3, $contrasena_encriptada);

                if ($stmtUsuario->execute()) {
                    // Enviar correo con credenciales
                    if (enviarCorreoCredenciales($email, $codigo_usuario, $contrasena)) {
                        escribirLog("Cotización aprobada, usuario creado y credenciales enviadas para cotización $id: $codigo_usuario");
                        responder([
                            'success' => true,
                            'message' => 'Cotización aprobada, usuario creado y credenciales enviadas exitosamente',
                            'codigo_usuario' => $codigo_usuario,
                            'email' => $email
                        ]);
                    } else {
                        escribirLog("Cotización aprobada, usuario creado pero error al enviar correo para cotización $id: $codigo_usuario");
                        responder([
                            'success' => true,
                            'message' => 'Cotización aprobada y usuario creado exitosamente, pero hubo un error al enviar el correo',
                            'codigo_usuario' => $codigo_usuario,
                            'email' => $email,
                            'warning' => 'Correo no enviado'
                        ]);
                    }
                } else {
                    responder(['success' => false, 'message' => 'Error al crear usuario'], 500);
                }
            } elseif ($accion === 'enviar_credenciales') {
                $codigo_usuario = $input['codigo_usuario'] ?? '';
                $contrasena = $input['contrasena'] ?? '';
                $email = $input['email'] ?? '';

                if (empty($codigo_usuario) || empty($contrasena) || empty($email)) {
                    responder(['success' => false, 'message' => 'Datos de usuario incompletos'], 400);
                }

                if (enviarCorreoCredenciales($email, $codigo_usuario, $contrasena)) {
                    escribirLog("Credenciales enviadas a: $email");
                    responder(['success' => true, 'message' => 'Credenciales enviadas exitosamente']);
                } else {
                    responder(['success' => false, 'message' => 'Error al enviar credenciales por correo'], 500);
                }
            } elseif ($accion === 'eliminar_cotizacion') {
                $id = (int)($input['id'] ?? 0);
                if ($id <= 0) {
                    responder(['success' => false, 'message' => 'ID inválido'], 400);
                }

                $sql = "DELETE FROM cotizaciones WHERE id = :id";
                $stmt = $db->prepare($sql);
                $resultado = $stmt->execute([':id' => $id]);
                escribirLog("Cotización eliminada: $id");
                responder(['success' => $resultado, 'message' => $resultado ? 'Cotización eliminada exitosamente' : 'Error al eliminar cotización']);
            }
            break;

        default:
            responder(['success' => false, 'message' => 'Método no permitido'], 405);
    }

    responder(['success' => false, 'message' => 'Acción no válida'], 400);

} catch (Throwable $e) {
    escribirLog("ERROR: " . $e->getMessage());
    responder(['success' => false, 'message' => $e->getMessage()], 500);
}
?>