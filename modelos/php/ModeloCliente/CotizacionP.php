<?php
class Cotizacion {
    private $conn;
    public $id;
    public $id_usuario;
    public $nombre_cliente;
    public $direccion;
    public $telefono;
    public $email;
    public $marca_bicicleta;
    public $modelo_bicicleta;
    public $tipo_trabajo;
    public $zona_afectada;
    public $tipo_reparacion;
    public $descripcion_otros;
    public $estado;
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    public function create() {
        $query = "INSERT INTO cotizaciones_bicicletas (id_usuario, nombre_cliente, direccion, telefono, email, marca_bicicleta, modelo_bicicleta, tipo_trabajo, zona_afectada, tipo_reparacion, descripcion_otros) VALUES (:id_usuario, :nombre_cliente, :direccion, :telefono, :email, :marca_bicicleta, :modelo_bicicleta, :tipo_trabajo, :zona_afectada, :tipo_reparacion, :descripcion_otros)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id_usuario', $this->id_usuario);
        $stmt->bindParam(':nombre_cliente', $this->nombre_cliente);
        $stmt->bindParam(':direccion', $this->direccion);
        $stmt->bindParam(':telefono', $this->telefono);
        $stmt->bindParam(':email', $this->email);
        $stmt->bindParam(':marca_bicicleta', $this->marca_bicicleta);
        $stmt->bindParam(':modelo_bicicleta', $this->modelo_bicicleta);
        $stmt->bindParam(':tipo_trabajo', $this->tipo_trabajo);
        $stmt->bindParam(':zona_afectada', $this->zona_afectada);
        $stmt->bindParam(':tipo_reparacion', $this->tipo_reparacion);
        $stmt->bindParam(':descripcion_otros', $this->descripcion_otros);
        
        if ($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return $this->id;
        }
        
        return false;
    }
    
    public function addImage($id_cotizacion, $nombre_archivo, $ruta_archivo) {
        $query = "INSERT INTO cotizacion_imagenes (id_cotizacion, nombre_archivo, ruta_archivo) VALUES (:id_cotizacion, :nombre_archivo, :ruta_archivo)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id_cotizacion', $id_cotizacion);
        $stmt->bindParam(':nombre_archivo', $nombre_archivo);
        $stmt->bindParam(':ruta_archivo', $ruta_archivo);
        return $stmt->execute();
    }
    
    public function getByUserId($id_usuario) {
        $query = "SELECT * FROM cotizaciones_bicicletas WHERE id_usuario = :id_usuario ORDER BY fecha_creacion DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id_usuario', $id_usuario);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function getProcesoImages($id_cotizacion) {
        $query = "SELECT * FROM cotizacion_imagenes WHERE id_cotizacion = :id_cotizacion AND tipo_imagen = 'PROCESO' ORDER BY fecha_subida ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id_cotizacion', $id_cotizacion);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function getProcesoComments($id_cotizacion) {
        $query = "SELECT ca.*, u.nombres, u.apellidos FROM cotizacion_actualizaciones ca JOIN usuarios u ON ca.id_administrador = u.id_usuario WHERE ca.id_cotizacion = :id_cotizacion ORDER BY ca.fecha_actualizacion DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id_cotizacion', $id_cotizacion);
        $stmt->execute();
        
        $comentarios = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $row['nombre_administrador'] = $row['nombres'] . ' ' . $row['apellidos'];
            $comentarios[] = $row;
        }
        
        return $comentarios;
    }
    
    public function getFichaTecnica($id_cotizacion) {
        // Obtener datos básicos de la cotización
        $query = "SELECT * FROM cotizaciones_bicicletas WHERE id = :id_cotizacion";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id_cotizacion', $id_cotizacion);
        $stmt->execute();
        $cotizacion = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Obtener inspección estética
        $query = "SELECT * FROM inspeccion_estetica WHERE id_cotizacion = :id_cotizacion";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id_cotizacion', $id_cotizacion);
        $stmt->execute();
        $inspeccion = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($inspeccion) {
            // Obtener imágenes de inspección
            $query = "SELECT * FROM inspeccion_imagenes WHERE id_inspeccion = :id_inspeccion";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id_inspeccion', $inspeccion['id']);
            $stmt->execute();
            $inspeccion['imagenes'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
        
        // Obtener piezas enviadas
        $query = "SELECT * FROM piezas_enviadas WHERE id_cotizacion = :id_cotizacion";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id_cotizacion', $id_cotizacion);
        $stmt->execute();
        $piezasEnviadas = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Obtener piezas recibidas
        $query = "SELECT * FROM piezas_recibidas WHERE id_cotizacion = :id_cotizacion";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id_cotizacion', $id_cotizacion);
        $stmt->execute();
        $piezasRecibidas = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        return [
            'cotizacion' => $cotizacion,
            'inspeccion' => $inspeccion,
            'piezasEnviadas' => $piezasEnviadas,
            'piezasRecibidas' => $piezasRecibidas
        ];
    }
}
?>