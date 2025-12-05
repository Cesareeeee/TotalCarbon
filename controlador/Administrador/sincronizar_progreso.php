<?php
/**
 * Función auxiliar para sincronizar el progreso cuando cambia el estado
 * Archivo: controlador/Administrador/sincronizar_progreso.php
 */

function sincronizarProgresoConEstado($db, $idCotizacion, $estado) {
    // Mapear estado a paso
    $mapeoEstadoPaso = [
        'PENDIENTE' => 1,
        'APROBADA' => 2,
        'EN_PROCESO' => 3,
        'PINTURA' => 4,
        'EMPACADO' => 5,
        'ENVIADO' => 6,
        'COMPLETADO' => 7,
        'RECHAZADA' => 2
    ];
    
    $pasoActual = $mapeoEstadoPaso[$estado] ?? 1;
    
    // Nombres descriptivos de cada paso
    $nombresPasos = [
        1 => 'Cotización Enviada',
        2 => 'Aceptada',
        3 => 'Reparación Iniciada',
        4 => 'Pintura',
        5 => 'Empacado',
        6 => 'Enviado',
        7 => 'Completado'
    ];
    
    try {
        // Verificar si ya existe un registro para este paso
        $sqlCheck = "SELECT COUNT(*) as count FROM cotizacion_progreso_cliente WHERE id_cotizacion = :id AND paso = :paso";
        $stmtCheck = $db->prepare($sqlCheck);
        $stmtCheck->execute([':id' => $idCotizacion, ':paso' => $pasoActual]);
        $existe = $stmtCheck->fetch(PDO::FETCH_ASSOC)['count'] > 0;
        
        if (!$existe) {
            // Insertar el nuevo paso
            $sqlPaso = "INSERT INTO cotizacion_progreso_cliente (id_cotizacion, paso, descripcion, activo) VALUES (:id_cotizacion, :paso, :descripcion, 1)";
            $stmtPaso = $db->prepare($sqlPaso);
            $stmtPaso->execute([
                ':id_cotizacion' => $idCotizacion,
                ':paso' => $pasoActual,
                ':descripcion' => $nombresPasos[$pasoActual]
            ]);
            return true;
        }
        return false;
    } catch (Exception $e) {
        error_log("Error sincronizando progreso: " . $e->getMessage());
        return false;
    }
}
?>
