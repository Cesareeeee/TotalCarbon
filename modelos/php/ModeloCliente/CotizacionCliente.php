<?php
namespace ModeloCliente;

use PDO;
use PDOException;

require_once __DIR__ . '/../database.php';

class CotizacionCliente
{
    private PDO $db;

    public function __construct()
    {
        // Usar conexión PDO centralizada
        $this->db = getPDO();
    }

    public function crearCotizacion(array $datos, array $archivos, ?int $idUsuario = null): array
    {
        $this->db->beginTransaction();
        try {
            $sql = "INSERT INTO cotizaciones_cliente (id_usuario, nombre_completo, direccion, telefono, correo_electronico, marca_bicicleta, modelo_bicicleta, zona_afectada, tipo_trabajo, tipo_reparacion, descripcion_otros)
                    VALUES (:id_usuario, :nombre_completo, :direccion, :telefono, :correo_electronico, :marca_bicicleta, :modelo_bicicleta, :zona_afectada, :tipo_trabajo, :tipo_reparacion, :descripcion_otros)";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([
                ':id_usuario' => $idUsuario,
                ':nombre_completo' => $datos['nombre'],
                ':direccion' => $datos['direccion'],
                ':telefono' => $datos['telefono'],
                ':correo_electronico' => $datos['email'],
                ':marca_bicicleta' => $datos['marca'],
                ':modelo_bicicleta' => $datos['modelo'],
                ':zona_afectada' => $datos['zonaAfectada'],
                ':tipo_trabajo' => $datos['tipoTrabajo'],
                ':tipo_reparacion' => $datos['tipoReparacion'],
                ':descripcion_otros' => $datos['descripcionOtros'] ?? null,
            ]); 

            $idCotizacion = (int)$this->db->lastInsertId();

            // Crear carpeta de imágenes en Img_Servicios (en la raíz del proyecto)
            $baseProjectDir = realpath(__DIR__ . '/../../..'); // c:\xampp\htdocs\TotalCarbon
            $imgBaseDir = $baseProjectDir . DIRECTORY_SEPARATOR . 'Img_Servicios'; // Ruta a Img_Servicios en la raíz
            $uploadDir = $imgBaseDir . DIRECTORY_SEPARATOR . $idCotizacion; // Carpeta específica para esta cotización

            // Crear carpeta Img_Servicios si no existe
            if (!is_dir($imgBaseDir)) {
                if (!mkdir($imgBaseDir, 0777, true) && !is_dir($imgBaseDir)) {
                    throw new \RuntimeException('No se pudo crear el directorio Img_Servicios en la raíz del proyecto.');
                }
            }

            // Crear carpeta de la cotización
            if (!is_dir($uploadDir)) {
                if (!mkdir($uploadDir, 0777, true) && !is_dir($uploadDir)) {
                    throw new \RuntimeException('No se pudo crear el directorio de subida para la cotización.');
                }
            }

            // Guardar imágenes (aceptamos claves imagen_0..imagen_9)
            $imagenesGuardadas = 0;
            foreach ($archivos as $clave => $archivo) {
                if (strpos($clave, 'imagen_') !== 0) {
                    continue;
                }
                if (!isset($archivo['tmp_name']) || $archivo['error'] !== UPLOAD_ERR_OK) {
                    continue;
                }

                $nombreOriginal = basename($archivo['name']);
                $tipoMime = mime_content_type($archivo['tmp_name']);
                $tamano = (int)$archivo['size'];

                // Validaciones básicas
                if (!preg_match('/^image\//', (string)$tipoMime)) {
                    continue;
                }
                if ($tamano > 5 * 1024 * 1024) { // 5MB
                    continue;
                }

                $extension = pathinfo($nombreOriginal, PATHINFO_EXTENSION) ?: 'jpg';
                $nombreDestino = uniqid('img_', true) . '.' . $extension;
                // La ruta relativa ahora es desde la raíz del proyecto
                $rutaRelativa = 'Img_Servicios/' . $idCotizacion . '/' . $nombreDestino;
                $rutaAbsoluta = $uploadDir . DIRECTORY_SEPARATOR . $nombreDestino;

                if (!move_uploaded_file($archivo['tmp_name'], $rutaAbsoluta)) {
                    throw new \RuntimeException('No se pudo mover el archivo subido: ' . $rutaAbsoluta);
                }

                $stmtImg = $this->db->prepare("INSERT INTO cotizacion_imagenes_cliente (id_cotizacion, ruta_imagen, nombre_archivo, tamano_bytes, tipo_mime) VALUES (:id_cotizacion, :ruta_imagen, :nombre_archivo, :tamano_bytes, :tipo_mime)");
                $stmtImg->execute([
                    ':id_cotizacion' => $idCotizacion,
                    ':ruta_imagen' => $rutaRelativa, // Guardar la nueva ruta relativa
                    ':nombre_archivo' => $nombreOriginal,
                    ':tamano_bytes' => $tamano,
                    ':tipo_mime' => $tipoMime,
                ]);

                $imagenesGuardadas++;
            }

            // Sembrar progreso inicial (paso 1 enviado)
            $stmtProg = $this->db->prepare("INSERT INTO cotizacion_progreso_cliente (id_cotizacion, paso, descripcion, activo) VALUES (:id_cotizacion, :paso, :descripcion, :activo)");
            $stmtProg->execute([
                ':id_cotizacion' => $idCotizacion,
                ':paso' => 1,
                ':descripcion' => 'Cotización Enviada',
                ':activo' => 1,
            ]);

            // Guardar piezas enviadas por el cliente
            if (isset($datos['piezas_cliente']) && !empty($datos['piezas_cliente'])) {
                $piezasCliente = json_decode($datos['piezas_cliente'], true);
                if (is_array($piezasCliente)) {
                    $stmtPieza = $this->db->prepare("INSERT INTO piezas_movimientos (id_cotizacion, tipo, nombre_pieza, cantidad, nota) VALUES (:id_cotizacion, 'RECIBIDO', :nombre_pieza, :cantidad, :nota)");
                    foreach ($piezasCliente as $pieza) {
                        if (!empty($pieza['nombre'])) {
                            $stmtPieza->execute([
                                ':id_cotizacion' => $idCotizacion,
                                ':nombre_pieza' => $pieza['nombre'],
                                ':cantidad' => $pieza['cantidad'] ?? 1,
                                ':nota' => $pieza['nota'] ?? null,
                            ]);
                        }
                    }
                }
            }

            $this->db->commit();
            return ['success' => true, 'id_cotizacion' => $idCotizacion];
        } catch (PDOException $e) {
            $this->db->rollBack();
            return ['success' => false, 'message' => 'Error BD: ' . $e->getMessage()];
        } catch (\Throwable $t) {
            $this->db->rollBack();
            return ['success' => false, 'message' => $t->getMessage()];
        }
    }

    public function obtenerProgreso(int $idCotizacion): array
    {
        $sql = "SELECT paso, descripcion, activo, creado_en FROM cotizacion_progreso_cliente WHERE id_cotizacion = :id ORDER BY paso";
        $st = $this->db->prepare($sql);
        $st->execute([':id' => $idCotizacion]);
        return $st->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtenerImagenesProceso(int $idCotizacion): array
    {
        $sql = "SELECT ruta_imagen, nombre_archivo, creado_en FROM cotizacion_imagenes_cliente WHERE id_cotizacion = :id ORDER BY id_imagen";
        $st = $this->db->prepare($sql);
        $st->execute([':id' => $idCotizacion]);
        return $st->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtenerComentarios(int $idCotizacion): array
    {
        $sql = "SELECT autor, mensaje, creado_en FROM cotizacion_comentarios_cliente WHERE id_cotizacion = :id ORDER BY id_comentario DESC";
        $st = $this->db->prepare($sql);
        $st->execute([':id' => $idCotizacion]);
        return $st->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtenerAceptacion(int $idCotizacion): string
    {
        $sql = "SELECT reparacion_aceptada_cliente FROM cotizaciones_cliente WHERE id_cotizacion = :id";
        $st = $this->db->prepare($sql);
        $st->execute([':id' => $idCotizacion]);
        $result = $st->fetch(PDO::FETCH_ASSOC);
        return $result ? $result['reparacion_aceptada_cliente'] : 'NO_ACEPTADA';
    }

    public function actualizarAceptacion(int $idCotizacion, string $aceptacion): bool
    {
        $sql = "UPDATE cotizaciones_cliente SET reparacion_aceptada_cliente = :aceptacion WHERE id_cotizacion = :id";
        $st = $this->db->prepare($sql);
        return $st->execute([':aceptacion' => $aceptacion, ':id' => $idCotizacion]);
    }
}
