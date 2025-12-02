<?php
try {
    $pdo = new PDO('mysql:host=localhost;dbname=totalcarbon;charset=utf8', 'root', '', [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    $pdo->exec("ALTER TABLE cotizaciones_cliente ADD COLUMN revision_camaras_fecha DATE NULL, ADD COLUMN revision_camaras_hora TIME NULL, ADD COLUMN inspeccion_estetica TEXT NULL, ADD COLUMN fecha_empaque DATE NULL, ADD COLUMN autorizado VARCHAR(255) NULL;");
    echo "Campos agregados exitosamente.";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>