<?php
/**
 * API para obtener notificaciones del administrador
 * Archivo: controlador/Administrador/obtener_notificaciones_admin.php
 * Método: GET
 * Propósito: Retornar notificaciones no vistas del administrador
 */

header('Content-Type: application/json; charset=utf-8');
session_start();

// Archivo de log
$logFile = __DIR__ . '/../../logs/notificaciones_admin.log';

// Función para escribir logs
function escribirLog($mensaje, $datos = null) {
    global $logFile;
    $timestamp = date('Y-m-d H:i:s');
    $logMessage = "[$timestamp] $mensaje";

    if ($datos !== null) {
        $logMessage .= " | Datos: " . json_encode($datos);
    }

    $logMessage .= "\n";

    // Crear directorio de logs si no existe
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

escribirLog("=== INICIO: Solicitud de notificaciones admin ===");

// Verificar sesión de admin
if (!isset($_SESSION['id_usuario']) || $_SESSION['id_rol'] != 1) {
    escribirLog("ERROR: Sesión no válida o no es admin");
    responder(['success' => false, 'message' => 'No autorizado', 'notificaciones' => []], 401);
}

$idAdmin = (int)$_SESSION['id_usuario'];
escribirLog("Admin ID: $idAdmin");

// Obtener timestamp de última verificación (opcional, por ahora usamos 1 año atrás para pruebas)
$ultimaVerificacion = isset($_GET['ultima_verificacion']) ? $_GET['ultima_verificacion'] : date('Y-m-d H:i:s', strtotime('-1 year'));

try {
    escribirLog("Conectando a la base de datos...");

    // Conexión directa con PDO
    $pdo = new PDO(
        'mysql:host=localhost;dbname=totalcarbon;charset=utf8',
        'root',
        '',
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    escribirLog("Conexión exitosa. Buscando notificaciones desde: $ultimaVerificacion");

    $notificaciones = [];

    // 1. Nuevas cotizaciones de clientes
    try {
        $queryCotizaciones = "
            SELECT
                c.id_cotizacion,
                c.marca_bicicleta,
                c.modelo_bicicleta,
                c.creado_en,
                u.nombres,
                u.apellidos,
                u.correo_electronico
            FROM cotizaciones_cliente c
            JOIN usuarios u ON c.id_usuario = u.id_usuario
            WHERE c.creado_en > :ultima_verificacion
            ORDER BY c.creado_en DESC
        ";

        $stmtCotizaciones = $pdo->prepare($queryCotizaciones);
        $stmtCotizaciones->execute([
            ':ultima_verificacion' => $ultimaVerificacion
        ]);

        $cotizaciones = $stmtCotizaciones->fetchAll(PDO::FETCH_ASSOC);
        escribirLog("Nuevas cotizaciones encontradas: " . count($cotizaciones));
        foreach ($cotizaciones as $cotizacion) {
            escribirLog("Procesando cotización ID: " . $cotizacion['id_cotizacion']);
            $notificaciones[] = [
                'id' => 'cotizacion_' . $cotizacion['id_cotizacion'],
                'tipo' => 'nueva_cotizacion',
                'titulo' => 'Nueva cotización',
                'mensaje' => 'Nueva cotización de ' . $cotizacion['nombres'] . ' ' . $cotizacion['apellidos'] . ' para ' . $cotizacion['marca_bicicleta'] . ' ' . $cotizacion['modelo_bicicleta'],
                'fecha' => $cotizacion['creado_en'],
                'id_cotizacion' => $cotizacion['id_cotizacion'],
                'cliente' => $cotizacion['nombres'] . ' ' . $cotizacion['apellidos']
            ];
        }
    } catch (PDOException $e) {
        escribirLog("Error en consulta de cotizaciones: " . $e->getMessage());
    }

    // 2. Cambios de estado en cotizaciones
    try {
        $queryEstados = "
            SELECT
                c.id_cotizacion,
                c.estado,
                c.actualizado_en,
                c.marca_bicicleta,
                c.modelo_bicicleta,
                u.nombres,
                u.apellidos
            FROM cotizaciones_cliente c
            JOIN usuarios u ON c.id_usuario = u.id_usuario
            WHERE c.actualizado_en > :ultima_verificacion
            AND c.actualizado_en != c.creado_en
            ORDER BY c.actualizado_en DESC
        ";

        $stmtEstados = $pdo->prepare($queryEstados);
        $stmtEstados->execute([
            ':ultima_verificacion' => $ultimaVerificacion
        ]);

        $estados = $stmtEstados->fetchAll(PDO::FETCH_ASSOC);
        foreach ($estados as $estado) {
            $estadoTexto = match($estado['estado']) {
                'EN_REVISION' => 'en revisión',
                'APROBADA' => 'aprobada',
                'RECHAZADA' => 'rechazada',
                'COMPLETADA' => 'completada',
                default => 'actualizada'
            };

            $notificaciones[] = [
                'id' => 'estado_' . $estado['id_cotizacion'] . '_' . strtotime($estado['actualizado_en']),
                'tipo' => 'cambio_estado',
                'titulo' => 'Cambio de estado',
                'mensaje' => 'Cotización de ' . $estado['nombres'] . ' ' . $estado['apellidos'] . ' para ' . $estado['marca_bicicleta'] . ' ' . $estado['modelo_bicicleta'] . ' fue ' . $estadoTexto,
                'fecha' => $estado['actualizado_en'],
                'id_cotizacion' => $estado['id_cotizacion'],
                'cliente' => $estado['nombres'] . ' ' . $estado['apellidos']
            ];
        }
    } catch (PDOException $e) {
        escribirLog("Error en consulta de estados: " . $e->getMessage());
    }

    // 3. Nuevos mensajes de clientes
    try {
        $queryMensajes = "
            SELECT
                m.id_mensaje,
                m.mensaje,
                m.creado_en,
                u.nombres,
                u.apellidos,
                c.marca_bicicleta,
                c.modelo_bicicleta
            FROM chat_mensajes m
            JOIN usuarios u ON m.id_emisor = u.id_usuario
            LEFT JOIN cotizaciones_cliente c ON c.id_usuario = u.id_usuario
            WHERE m.id_receptor = 1
            AND m.creado_en > :ultima_verificacion
            AND m.leido = 0
            ORDER BY m.creado_en DESC
        ";

        $stmtMensajes = $pdo->prepare($queryMensajes);
        $stmtMensajes->execute([
            ':ultima_verificacion' => $ultimaVerificacion
        ]);

        $mensajes = $stmtMensajes->fetchAll(PDO::FETCH_ASSOC);
        escribirLog("Nuevos mensajes encontrados: " . count($mensajes));
        foreach ($mensajes as $mensaje) {
            escribirLog("Procesando mensaje ID: " . $mensaje['id_mensaje']);
            $clienteNombre = trim(($mensaje['nombres'] ?? '') . ' ' . ($mensaje['apellidos'] ?? ''));
            $clienteNombre = $clienteNombre ?: 'Cliente';

            $notificaciones[] = [
                'id' => 'mensaje_' . $mensaje['id_mensaje'],
                'tipo' => 'nuevo_mensaje',
                'titulo' => 'Nuevo mensaje',
                'mensaje' => 'Mensaje de ' . $clienteNombre . ': ' . substr($mensaje['mensaje'], 0, 50) . (strlen($mensaje['mensaje']) > 50 ? '...' : ''),
                'fecha' => $mensaje['creado_en'],
                'id_mensaje' => $mensaje['id_mensaje'],
                'cliente' => $clienteNombre
            ];
        }
    } catch (PDOException $e) {
        escribirLog("Error en consulta de mensajes: " . $e->getMessage());
    }

    // 4. Nuevos clientes registrados
    try {
        $queryClientes = "
            SELECT
                u.id_usuario,
                u.nombres,
                u.apellidos,
                u.correo_electronico,
                u.creado_en
            FROM usuarios u
            WHERE u.id_rol = 2
            AND u.creado_en > :ultima_verificacion
            ORDER BY u.creado_en DESC
        ";

        $stmtClientes = $pdo->prepare($queryClientes);
        $stmtClientes->execute([
            ':ultima_verificacion' => $ultimaVerificacion
        ]);

        $clientes = $stmtClientes->fetchAll(PDO::FETCH_ASSOC);
        foreach ($clientes as $cliente) {
            $notificaciones[] = [
                'id' => 'cliente_' . $cliente['id_usuario'],
                'tipo' => 'nuevo_cliente',
                'titulo' => 'Nuevo cliente',
                'mensaje' => 'Se registró el cliente ' . $cliente['nombres'] . ' ' . $cliente['apellidos'],
                'fecha' => $cliente['creado_en'],
                'id_usuario' => $cliente['id_usuario'],
                'cliente' => $cliente['nombres'] . ' ' . $cliente['apellidos']
            ];
        }
    } catch (PDOException $e) {
        escribirLog("Error en consulta de clientes: " . $e->getMessage());
    }

    // 5. Nuevas garantías activadas
    try {
        $queryGarantias = "
            SELECT
                g.id_garantia,
                g.tipo_garantia,
                g.creado_en,
                c.marca_bicicleta,
                c.modelo_bicicleta,
                u.nombres,
                u.apellidos
            FROM garantias_bicicletas g
            JOIN cotizaciones_cliente c ON g.id_cotizacion = c.id_cotizacion
            JOIN usuarios u ON g.id_usuario = u.id_usuario
            WHERE g.creado_en > :ultima_verificacion
            ORDER BY g.creado_en DESC
        ";

        $stmtGarantias = $pdo->prepare($queryGarantias);
        $stmtGarantias->execute([
            ':ultima_verificacion' => $ultimaVerificacion
        ]);

        $garantias = $stmtGarantias->fetchAll(PDO::FETCH_ASSOC);
        foreach ($garantias as $garantia) {
            $notificaciones[] = [
                'id' => 'garantia_' . $garantia['id_garantia'],
                'tipo' => 'nueva_garantia',
                'titulo' => 'Nueva garantía',
                'mensaje' => 'Garantía activada para ' . $garantia['nombres'] . ' ' . $garantia['apellidos'] . ' - ' . $garantia['marca_bicicleta'] . ' ' . $garantia['modelo_bicicleta'],
                'fecha' => $garantia['creado_en'],
                'id_garantia' => $garantia['id_garantia'],
                'cliente' => $garantia['nombres'] . ' ' . $garantia['apellidos']
            ];
        }
    } catch (PDOException $e) {
        escribirLog("Error en consulta de garantías: " . $e->getMessage());
    }

    // 6. Nuevos proveedores registrados
    try {
        $queryProveedores = "
            SELECT
                p.id_proveedor,
                p.nombre_proveedor,
                p.creado_en
            FROM proveedores p
            WHERE p.creado_en > :ultima_verificacion
            ORDER BY p.creado_en DESC
        ";

        $stmtProveedores = $pdo->prepare($queryProveedores);
        $stmtProveedores->execute([
            ':ultima_verificacion' => $ultimaVerificacion
        ]);

        $proveedores = $stmtProveedores->fetchAll(PDO::FETCH_ASSOC);
        foreach ($proveedores as $proveedor) {
            $notificaciones[] = [
                'id' => 'proveedor_' . $proveedor['id_proveedor'],
                'tipo' => 'nuevo_proveedor',
                'titulo' => 'Nuevo proveedor',
                'mensaje' => 'Se registró el proveedor ' . $proveedor['nombre_proveedor'],
                'fecha' => $proveedor['creado_en'],
                'id_proveedor' => $proveedor['id_proveedor'],
                'proveedor' => $proveedor['nombre_proveedor']
            ];
        }
    } catch (PDOException $e) {
        escribirLog("Error en consulta de proveedores: " . $e->getMessage());
    }

    // 7. Comentarios nuevos en cotizaciones de clientes
    try {
        $queryComentarios = "
            SELECT
                cc.id_comentario,
                cc.id_cotizacion,
                cc.autor,
                cc.mensaje,
                cc.creado_en,
                c.marca_bicicleta,
                c.modelo_bicicleta,
                c.nombre_completo
            FROM cotizacion_comentarios_cliente cc
            JOIN cotizaciones_cliente c ON cc.id_cotizacion = c.id_cotizacion
            WHERE cc.creado_en > :ultima_verificacion
            ORDER BY cc.creado_en DESC
        ";

        $stmtComentarios = $pdo->prepare($queryComentarios);
        $stmtComentarios->execute([
            ':ultima_verificacion' => $ultimaVerificacion
        ]);

        $comentarios = $stmtComentarios->fetchAll(PDO::FETCH_ASSOC);
        escribirLog("Comentarios nuevos encontrados: " . count($comentarios));
        foreach ($comentarios as $comentario) {
            escribirLog("Procesando comentario ID: " . $comentario['id_comentario']);
            $notificaciones[] = [
                'id' => 'comentario_' . $comentario['id_comentario'],
                'tipo' => 'nuevo_comentario',
                'titulo' => 'Nuevo comentario',
                'mensaje' => $comentario['autor'] . ' comentó en la cotización de ' . $comentario['nombre_completo'] . ' - ' . $comentario['marca_bicicleta'] . ' ' . $comentario['modelo_bicicleta'],
                'fecha' => $comentario['creado_en'],
                'id_cotizacion' => $comentario['id_cotizacion'],
                'cliente' => $comentario['nombre_completo']
            ];
        }
    } catch (PDOException $e) {
        escribirLog("Error en consulta de comentarios: " . $e->getMessage());
    }

    // 8. Nuevas imágenes subidas por clientes
    try {
        $queryImagenes = "
            SELECT
                ci.id_imagen,
                ci.id_cotizacion,
                ci.nombre_archivo,
                ci.creado_en,
                c.marca_bicicleta,
                c.modelo_bicicleta,
                c.nombre_completo
            FROM cotizacion_imagenes_cliente ci
            JOIN cotizaciones_cliente c ON ci.id_cotizacion = c.id_cotizacion
            WHERE ci.creado_en > :ultima_verificacion
            ORDER BY ci.creado_en DESC
        ";

        $stmtImagenes = $pdo->prepare($queryImagenes);
        $stmtImagenes->execute([
            ':ultima_verificacion' => $ultimaVerificacion
        ]);

        $imagenes = $stmtImagenes->fetchAll(PDO::FETCH_ASSOC);
        foreach ($imagenes as $imagen) {
            $notificaciones[] = [
                'id' => 'imagen_' . $imagen['id_imagen'],
                'tipo' => 'nueva_imagen',
                'titulo' => 'Nueva imagen subida',
                'mensaje' => 'Cliente ' . $imagen['nombre_completo'] . ' subió una imagen a su cotización ' . $imagen['marca_bicicleta'] . ' ' . $imagen['modelo_bicicleta'],
                'fecha' => $imagen['creado_en'],
                'id_cotizacion' => $imagen['id_cotizacion'],
                'cliente' => $imagen['nombre_completo']
            ];
        }
    } catch (PDOException $e) {
        escribirLog("Error en consulta de imágenes: " . $e->getMessage());
    }

    // 9. Cambios en perfiles de clientes
    try {
        $queryCambiosClientes = "
            SELECT
                u.id_usuario,
                u.nombres,
                u.apellidos,
                u.correo_electronico,
                u.actualizado_en
            FROM usuarios u
            WHERE u.id_rol = 2
            AND u.actualizado_en > :ultima_verificacion
            AND u.actualizado_en != u.creado_en
            ORDER BY u.actualizado_en DESC
        ";

        $stmtCambiosClientes = $pdo->prepare($queryCambiosClientes);
        $stmtCambiosClientes->execute([
            ':ultima_verificacion' => $ultimaVerificacion
        ]);

        $cambiosClientes = $stmtCambiosClientes->fetchAll(PDO::FETCH_ASSOC);
        foreach ($cambiosClientes as $cambio) {
            $notificaciones[] = [
                'id' => 'cambio_cliente_' . $cambio['id_usuario'] . '_' . strtotime($cambio['actualizado_en']),
                'tipo' => 'cambio_perfil_cliente',
                'titulo' => 'Perfil de cliente actualizado',
                'mensaje' => 'El cliente ' . $cambio['nombres'] . ' ' . $cambio['apellidos'] . ' actualizó su perfil',
                'fecha' => $cambio['actualizado_en'],
                'id_usuario' => $cambio['id_usuario'],
                'cliente' => $cambio['nombres'] . ' ' . $cambio['apellidos']
            ];
        }
    } catch (PDOException $e) {
        escribirLog("Error en consulta de cambios en clientes: " . $e->getMessage());
    }

    // Ordenar notificaciones por fecha (más recientes primero)
    usort($notificaciones, function($a, $b) {
        return strtotime($b['fecha']) - strtotime($a['fecha']);
    });

    escribirLog("Notificaciones encontradas: " . count($notificaciones));
    escribirLog("=== FIN: Notificaciones admin obtenidas correctamente ===");

    responder([
        'success' => true,
        'message' => 'Notificaciones obtenidas correctamente',
        'notificaciones' => $notificaciones,
        'total' => count($notificaciones)
    ]);

} catch (PDOException $e) {
    escribirLog("ERROR: Excepción PDO: " . $e->getMessage());
    responder(['success' => false, 'message' => 'Error de BD: ' . $e->getMessage(), 'notificaciones' => []], 500);
} catch (Throwable $e) {
    escribirLog("ERROR: Excepción capturada: " . $e->getMessage());
    responder(['success' => false, 'message' => $e->getMessage(), 'notificaciones' => []], 500);
}
?>