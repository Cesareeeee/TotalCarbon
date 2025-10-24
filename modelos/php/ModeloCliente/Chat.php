<?php
class Chat {
    private $conn;
    public $id;
    public $id_cotizacion;
    public $id_remitente;
    public $id_destinatario;
    public $mensaje;
    public $leido;
    public $fecha_envio;
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    public function send() {
        // Obtener ID del administrador
        $query = "SELECT id_usuario FROM usuarios WHERE id_rol = 1 LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $admin = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$admin) {
            return false;
        }
        
        $this->id_destinatario = $admin['id_usuario'];
        
        $query = "INSERT INTO chat_historial (id_cotizacion, id_remitente, id_destinatario, mensaje) VALUES (:id_cotizacion, :id_remitente, :id_destinatario, :mensaje)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id_cotizacion', $this->id_cotizacion);
        $stmt->bindParam(':id_remitente', $this->id_remitente);
        $stmt->bindParam(':id_destinatario', $this->id_destinatario);
        $stmt->bindParam(':mensaje', $this->mensaje);
        
        if ($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }
        
        return false;
    }
    
    public function getHistory($id_usuario, $id_cotizacion = null) {
        $query = "SELECT ch.id, ch.mensaje, ch.fecha_envio, ch.leido, 
                         u.nombres, u.apellidos, ch.id_remitente
                  FROM chat_historial ch
                  JOIN usuarios u ON ch.id_remitente = u.id_usuario
                  WHERE (ch.id_remitente = :id_usuario OR ch.id_destinatario = :id_usuario)";
        
        if ($id_cotizacion) {
            $query .= " AND (ch.id_cotizacion = :id_cotizacion OR ch.id_cotizacion IS NULL)";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id_usuario', $id_usuario);
            $stmt->bindParam(':id_cotizacion', $id_cotizacion);
        } else {
            $query .= " AND ch.id_cotizacion IS NULL";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id_usuario', $id_usuario);
        }
        
        $query .= " ORDER BY ch.fecha_envio ASC";
        $stmt->execute();
        
        $mensajes = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $mensajes[] = [
                'id' => $row['id'],
                'mensaje' => $row['mensaje'],
                'remitente' => $row['nombres'] . ' ' . $row['apellidos'],
                'fecha' => $row['fecha_envio'],
                'propio' => $row['id_remitente'] == $id_usuario,
                'leido' => $row['leido']
            ];
        }
        
        // Marcar mensajes como leídos
        $query = "UPDATE chat_historial SET leido = 1 WHERE id_destinatario = :id_usuario AND leido = 0";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id_usuario', $id_usuario);
        $stmt->execute();
        
        return $mensajes;
    }
}
?>