-- ============================================
-- TABLAS PARA COTIZACIONES DEL CLIENTE
-- ============================================

-- Tabla: cotizaciones_cliente
-- Descripción: Almacena las cotizaciones enviadas por los clientes
CREATE TABLE IF NOT EXISTS `cotizaciones_cliente` (
  `id_cotizacion` INT AUTO_INCREMENT PRIMARY KEY,
  `id_usuario` INT NOT NULL,
  `nombre_completo` VARCHAR(255) NOT NULL,
  `direccion` VARCHAR(255) NOT NULL,
  `telefono` VARCHAR(20) NOT NULL,
  `correo_electronico` VARCHAR(255) NOT NULL,
  `marca_bicicleta` VARCHAR(100) NOT NULL,
  `modelo_bicicleta` VARCHAR(100) NOT NULL,
  `zona_afectada` VARCHAR(255) NOT NULL,
  `tipo_trabajo` VARCHAR(100) NOT NULL,
  `tipo_reparacion` VARCHAR(100) NOT NULL,
  `descripcion_otros` TEXT,
  `estado` ENUM('PENDIENTE', 'EN_REVISION', 'APROBADA', 'RECHAZADA', 'COMPLETADA') DEFAULT 'PENDIENTE',
  `creado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `actualizado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id_usuario`) ON DELETE CASCADE,
  INDEX `idx_usuario` (`id_usuario`),
  INDEX `idx_estado` (`estado`),
  INDEX `idx_fecha` (`creado_en`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: cotizacion_imagenes_cliente
-- Descripción: Almacena las imágenes de las cotizaciones
CREATE TABLE IF NOT EXISTS `cotizacion_imagenes_cliente` (
  `id_imagen` INT AUTO_INCREMENT PRIMARY KEY,
  `id_cotizacion` INT NOT NULL,
  `ruta_imagen` VARCHAR(500) NOT NULL,
  `nombre_archivo` VARCHAR(255) NOT NULL,
  `tamano_bytes` INT NOT NULL,
  `tipo_mime` VARCHAR(50) NOT NULL,
  `creado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`id_cotizacion`) REFERENCES `cotizaciones_cliente`(`id_cotizacion`) ON DELETE CASCADE,
  INDEX `idx_cotizacion` (`id_cotizacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: cotizacion_progreso_cliente
-- Descripción: Almacena el progreso de cada cotización
CREATE TABLE IF NOT EXISTS `cotizacion_progreso_cliente` (
  `id_progreso` INT AUTO_INCREMENT PRIMARY KEY,
  `id_cotizacion` INT NOT NULL,
  `paso` INT NOT NULL,
  `descripcion` VARCHAR(255) NOT NULL,
  `activo` TINYINT(1) DEFAULT 1,
  `creado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`id_cotizacion`) REFERENCES `cotizaciones_cliente`(`id_cotizacion`) ON DELETE CASCADE,
  INDEX `idx_cotizacion` (`id_cotizacion`),
  INDEX `idx_paso` (`paso`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: cotizacion_comentarios_cliente
-- Descripción: Almacena los comentarios sobre las cotizaciones
CREATE TABLE IF NOT EXISTS `cotizacion_comentarios_cliente` (
  `id_comentario` INT AUTO_INCREMENT PRIMARY KEY,
  `id_cotizacion` INT NOT NULL,
  `autor` VARCHAR(255) NOT NULL,
  `mensaje` TEXT NOT NULL,
  `creado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`id_cotizacion`) REFERENCES `cotizaciones_cliente`(`id_cotizacion`) ON DELETE CASCADE,
  INDEX `idx_cotizacion` (`id_cotizacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- INSERCIONES DE PRUEBA
-- ============================================

-- Insertar una cotización de prueba
INSERT INTO `cotizaciones_cliente` (
  `id_usuario`, `nombre_completo`, `direccion`, `telefono`, `correo_electronico`,
  `marca_bicicleta`, `modelo_bicicleta`, `zona_afectada`, `tipo_trabajo`,
  `tipo_reparacion`, `descripcion_otros`, `estado`
) VALUES (
  20, 'Juan Pérez', 'Calle Principal 123', '555-1234', 'juan@example.com',
  'Trek', 'FX 3', 'Cuadro', 'Reparación', 'Soldadura', 'Grieta en el cuadro', 'PENDIENTE'
);

-- Insertar progreso inicial
INSERT INTO `cotizacion_progreso_cliente` (
  `id_cotizacion`, `paso`, `descripcion`, `activo`
) VALUES (
  1, 1, 'Cotización Enviada', 1
);

-- ============================================
-- CONSULTAS ÚTILES
-- ============================================

-- Ver todas las cotizaciones de un usuario
-- SELECT * FROM cotizaciones_cliente WHERE id_usuario = 20;

-- Ver imágenes de una cotización
-- SELECT * FROM cotizacion_imagenes_cliente WHERE id_cotizacion = 1;

-- Ver progreso de una cotización
-- SELECT * FROM cotizacion_progreso_cliente WHERE id_cotizacion = 1 ORDER BY paso;

-- Ver comentarios de una cotización
-- SELECT * FROM cotizacion_comentarios_cliente WHERE id_cotizacion = 1;

-- Tabla: garantias_cliente
-- Descripción: Almacena las garantías de las cotizaciones completadas
CREATE TABLE IF NOT EXISTS `garantias_cliente` (
  `id_garantia` INT AUTO_INCREMENT PRIMARY KEY,
  `id_cotizacion` INT NOT NULL,
  `descripcion` VARCHAR(255) NOT NULL,
  `fecha_inicio` DATE NOT NULL,
  `fecha_fin` DATE NOT NULL,
  `estado` ENUM('ACTIVA', 'VENCIDA', 'POR_VENCER') DEFAULT 'ACTIVA',
  `creado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`id_cotizacion`) REFERENCES `cotizaciones_cliente`(`id_cotizacion`) ON DELETE CASCADE,
  INDEX `idx_cotizacion` (`id_cotizacion`),
  INDEX `idx_estado` (`estado`),
  INDEX `idx_fecha_fin` (`fecha_fin`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar garantías de prueba
INSERT INTO `garantias_cliente` (
  `id_cotizacion`, `descripcion`, `fecha_inicio`, `fecha_fin`, `estado`
) VALUES
(1, 'Reparación de Cuadro - Tracer LILA', '2025-01-15', '2025-07-15', 'ACTIVA'),
(1, 'Pintura Personalizada - INTENSE', '2025-02-01', '2025-05-01', 'POR_VENCER'),
(1, 'Reparación de Horquilla - ROCKSHOX', '2025-12-10', '2026-12-10', 'ACTIVA');

