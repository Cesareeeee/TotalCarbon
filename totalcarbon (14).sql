-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 06-11-2025 a las 20:55:06
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `totalcarbon`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `chat_historial`
--

CREATE TABLE `chat_historial` (
  `id_historial` int(11) NOT NULL,
  `id_mensaje` int(11) NOT NULL,
  `id_emisor` int(11) NOT NULL,
  `id_receptor` int(11) NOT NULL,
  `mensaje` text NOT NULL,
  `fecha_original` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `accion` enum('Eliminado','Editado','Archivado','Recuperado') NOT NULL,
  `fecha_accion` timestamp NOT NULL DEFAULT current_timestamp(),
  `descripcion_accion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `chat_mensajes`
--

CREATE TABLE `chat_mensajes` (
  `id_mensaje` int(11) NOT NULL,
  `id_emisor` int(11) NOT NULL,
  `id_receptor` int(11) NOT NULL,
  `id_cotizacion` int(11) DEFAULT NULL,
  `mensaje` text NOT NULL,
  `leido` tinyint(1) NOT NULL DEFAULT 0,
  `eliminado_emisor` tinyint(1) NOT NULL DEFAULT 0,
  `eliminado_receptor` tinyint(1) NOT NULL DEFAULT 0,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `codigos_recuperacion`
--

CREATE TABLE `codigos_recuperacion` (
  `id_recuperacion` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `codigo_recuperacion` varchar(6) NOT NULL,
  `fecha_expiracion` datetime NOT NULL,
  `utilizado` tinyint(1) DEFAULT 0,
  `creado_en` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `codigos_recuperacion`
--

INSERT INTO `codigos_recuperacion` (`id_recuperacion`, `id_usuario`, `codigo_recuperacion`, `fecha_expiracion`, `utilizado`, `creado_en`) VALUES
(1, 13, '350466', '2025-10-21 07:34:57', 1, '2025-10-21 00:19:57'),
(2, 10, '247464', '2025-10-21 07:36:05', 1, '2025-10-21 00:21:05'),
(3, 13, '868054', '2025-10-21 07:36:49', 1, '2025-10-21 00:21:49'),
(4, 13, '109369', '2025-10-21 07:37:10', 1, '2025-10-21 00:22:10'),
(5, 13, '006314', '2025-10-21 07:39:53', 1, '2025-10-21 00:24:53'),
(6, 13, '942796', '2025-10-21 08:09:59', 1, '2025-10-21 00:54:59'),
(7, 13, '426315', '2025-10-21 08:15:11', 1, '2025-10-21 01:00:11'),
(8, 13, '671041', '2025-10-21 08:18:03', 1, '2025-10-21 01:03:03'),
(9, 13, '137729', '2025-10-21 08:19:14', 1, '2025-10-21 01:04:14'),
(10, 13, '284186', '2025-10-31 05:23:11', 1, '2025-10-30 22:08:11'),
(11, 13, '156701', '2025-10-31 05:23:19', 1, '2025-10-30 22:08:19'),
(12, 13, '628015', '2025-10-31 05:24:28', 1, '2025-10-30 22:09:28'),
(13, 13, '286404', '2025-10-31 05:24:41', 1, '2025-10-30 22:09:41'),
(14, 13, '911269', '2025-10-31 05:26:54', 1, '2025-10-30 22:11:54'),
(15, 24, '088912', '2025-10-31 05:44:11', 1, '2025-10-30 22:29:11'),
(16, 13, '286693', '2025-10-31 05:52:46', 1, '2025-10-30 22:37:46'),
(17, 13, '883703', '2025-10-31 05:52:51', 1, '2025-10-30 22:37:51'),
(18, 13, '064892', '2025-10-31 06:06:49', 1, '2025-10-30 22:51:49'),
(19, 13, '687227', '2025-10-31 06:06:55', 1, '2025-10-30 22:51:55'),
(20, 13, '082764', '2025-10-31 06:11:53', 1, '2025-10-30 22:56:53'),
(21, 13, '274604', '2025-10-31 06:19:29', 1, '2025-10-30 23:04:29'),
(22, 13, '301860', '2025-10-31 06:19:34', 1, '2025-10-30 23:04:34'),
(23, 13, '485192', '2025-10-31 06:25:23', 1, '2025-10-30 23:10:23'),
(24, 13, '387137', '2025-10-31 06:25:30', 1, '2025-10-30 23:10:30'),
(25, 13, '457956', '2025-10-31 06:27:17', 1, '2025-10-30 23:12:17'),
(26, 13, '205143', '2025-11-01 23:59:32', 1, '2025-11-01 16:44:32'),
(27, 13, '606577', '2025-11-05 03:24:25', 1, '2025-11-04 20:09:25'),
(28, 13, '945895', '2025-11-05 03:31:06', 1, '2025-11-04 20:16:06'),
(29, 13, '654686', '2025-11-05 03:36:49', 1, '2025-11-04 20:21:49'),
(30, 10, '132818', '2025-11-05 03:37:03', 1, '2025-11-04 20:22:03'),
(31, 13, '337753', '2025-11-05 03:38:03', 1, '2025-11-04 20:23:03'),
(32, 10, '933662', '2025-11-05 03:38:33', 1, '2025-11-04 20:23:33'),
(33, 13, '438235', '2025-11-05 03:39:03', 1, '2025-11-04 20:24:03'),
(34, 13, '503960', '2025-11-05 03:40:04', 1, '2025-11-04 20:25:05'),
(35, 24, '871308', '2025-11-05 03:40:16', 0, '2025-11-04 20:25:16'),
(36, 26, '609940', '2025-11-05 03:40:54', 1, '2025-11-04 20:25:54'),
(37, 10, '406486', '2025-11-05 03:41:00', 1, '2025-11-04 20:26:00'),
(38, 26, '819322', '2025-11-05 03:41:17', 1, '2025-11-04 20:26:17'),
(39, 26, '740397', '2025-11-05 03:41:20', 0, '2025-11-04 20:26:20'),
(40, 10, '213704', '2025-11-05 03:41:29', 0, '2025-11-04 20:26:29'),
(41, 13, '625225', '2025-11-05 03:41:55', 1, '2025-11-04 20:26:55'),
(42, 13, '185460', '2025-11-05 03:43:35', 1, '2025-11-04 20:28:35'),
(43, 13, '118354', '2025-11-05 03:43:37', 1, '2025-11-04 20:28:37'),
(44, 13, '761283', '2025-11-05 03:43:50', 1, '2025-11-04 20:28:50'),
(45, 13, '752301', '2025-11-05 03:46:46', 1, '2025-11-04 20:31:46'),
(46, 13, '987692', '2025-11-05 03:46:47', 1, '2025-11-04 20:31:47'),
(47, 13, '226682', '2025-11-05 03:46:49', 1, '2025-11-04 20:31:49'),
(48, 13, '069933', '2025-11-05 03:48:15', 1, '2025-11-04 20:33:15'),
(49, 13, '300482', '2025-11-05 03:48:21', 1, '2025-11-04 20:33:21'),
(50, 13, '250583', '2025-11-05 03:53:37', 1, '2025-11-04 20:38:37'),
(51, 13, '138375', '2025-11-05 03:53:39', 1, '2025-11-04 20:38:39'),
(52, 13, '872229', '2025-11-05 03:53:45', 1, '2025-11-04 20:38:45'),
(53, 13, '454560', '2025-11-05 03:57:42', 1, '2025-11-04 20:42:42'),
(54, 13, '586649', '2025-11-05 03:57:43', 1, '2025-11-04 20:42:43'),
(55, 13, '410414', '2025-11-05 04:03:31', 1, '2025-11-04 20:48:31'),
(56, 13, '757382', '2025-11-05 04:04:46', 1, '2025-11-04 20:49:46'),
(57, 13, '976672', '2025-11-05 04:10:47', 1, '2025-11-04 20:55:47'),
(58, 13, '101099', '2025-11-05 04:11:56', 1, '2025-11-04 20:56:56'),
(59, 13, '103676', '2025-11-05 04:13:28', 1, '2025-11-04 20:58:28'),
(60, 13, '521666', '2025-11-05 04:13:31', 1, '2025-11-04 20:58:31'),
(61, 13, '922131', '2025-11-05 04:13:34', 1, '2025-11-04 20:58:34'),
(62, 13, '455017', '2025-11-05 04:14:38', 1, '2025-11-04 20:59:38'),
(63, 13, '672683', '2025-11-05 04:14:40', 1, '2025-11-04 20:59:40'),
(64, 13, '938428', '2025-11-05 04:14:44', 1, '2025-11-04 20:59:44'),
(65, 13, '939922', '2025-11-05 04:15:40', 1, '2025-11-04 21:00:40'),
(66, 13, '776305', '2025-11-05 04:15:41', 1, '2025-11-04 21:00:41'),
(67, 13, '381765', '2025-11-05 04:15:44', 1, '2025-11-04 21:00:44'),
(68, 13, '078984', '2025-11-05 04:16:20', 1, '2025-11-04 21:01:20'),
(69, 13, '512654', '2025-11-05 04:16:23', 1, '2025-11-04 21:01:23'),
(70, 13, '215420', '2025-11-05 04:18:50', 1, '2025-11-04 21:03:50'),
(71, 13, '904394', '2025-11-05 04:19:44', 1, '2025-11-04 21:04:44'),
(72, 13, '224390', '2025-11-05 04:20:31', 1, '2025-11-04 21:05:31'),
(73, 13, '404903', '2025-11-05 04:20:34', 1, '2025-11-04 21:05:34'),
(74, 13, '040635', '2025-11-05 04:20:35', 1, '2025-11-04 21:05:35'),
(75, 13, '646570', '2025-11-05 04:22:33', 1, '2025-11-04 21:07:33'),
(76, 13, '808796', '2025-11-05 04:23:30', 1, '2025-11-04 21:08:30'),
(77, 13, '848353', '2025-11-05 04:24:43', 1, '2025-11-04 21:09:43'),
(78, 13, '742346', '2025-11-05 04:28:17', 1, '2025-11-04 21:13:17'),
(79, 13, '532584', '2025-11-05 04:28:24', 1, '2025-11-04 21:13:24'),
(80, 13, '274097', '2025-11-05 04:31:06', 1, '2025-11-04 21:16:06'),
(81, 13, '154329', '2025-11-05 04:32:21', 1, '2025-11-04 21:17:21'),
(82, 13, '463570', '2025-11-05 04:36:32', 1, '2025-11-04 21:21:32'),
(83, 13, '884494', '2025-11-05 04:36:38', 1, '2025-11-04 21:21:38'),
(84, 13, '225071', '2025-11-05 04:36:52', 1, '2025-11-04 21:21:53'),
(85, 13, '619531', '2025-11-05 04:37:47', 1, '2025-11-04 21:22:47'),
(86, 13, '393583', '2025-11-05 04:38:20', 1, '2025-11-04 21:23:20'),
(87, 13, '100255', '2025-11-05 04:40:26', 1, '2025-11-04 21:25:26'),
(88, 13, '355787', '2025-11-05 04:41:41', 1, '2025-11-04 21:26:41'),
(89, 13, '174758', '2025-11-05 04:48:09', 1, '2025-11-04 21:33:09'),
(90, 13, '216843', '2025-11-05 04:48:11', 1, '2025-11-04 21:33:11'),
(91, 13, '368630', '2025-11-05 04:49:56', 1, '2025-11-04 21:34:56'),
(92, 13, '461390', '2025-11-05 04:51:25', 1, '2025-11-04 21:36:25'),
(93, 13, '608619', '2025-11-05 04:52:35', 1, '2025-11-04 21:37:35'),
(94, 13, '360383', '2025-11-05 04:53:56', 1, '2025-11-04 21:38:56'),
(95, 13, '648096', '2025-11-05 05:02:17', 1, '2025-11-04 21:47:17'),
(96, 13, '779136', '2025-11-05 05:07:59', 1, '2025-11-04 21:52:59'),
(97, 13, '684229', '2025-11-05 05:09:33', 1, '2025-11-04 21:54:33'),
(98, 13, '662442', '2025-11-05 05:09:35', 1, '2025-11-04 21:54:35'),
(99, 13, '941181', '2025-11-05 05:12:00', 1, '2025-11-04 21:57:00'),
(100, 13, '196750', '2025-11-05 05:16:18', 1, '2025-11-04 22:01:18'),
(101, 13, '426246', '2025-11-05 05:25:08', 1, '2025-11-04 22:10:08'),
(102, 13, '797911', '2025-11-05 05:26:44', 1, '2025-11-04 22:11:44'),
(103, 13, '165911', '2025-11-05 05:32:37', 1, '2025-11-04 22:17:37'),
(104, 13, '471989', '2025-11-05 05:34:36', 1, '2025-11-04 22:19:36'),
(105, 13, '155948', '2025-11-05 05:36:16', 1, '2025-11-04 22:21:16'),
(106, 13, '880544', '2025-11-05 05:41:23', 1, '2025-11-04 22:26:23'),
(107, 13, '165785', '2025-11-06 05:34:58', 1, '2025-11-05 22:19:58'),
(108, 13, '278246', '2025-11-06 05:35:00', 0, '2025-11-05 22:20:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `compras_proveedores`
--

CREATE TABLE `compras_proveedores` (
  `id_compra` int(11) NOT NULL,
  `proveedor_id` int(11) NOT NULL,
  `nombre_producto` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `cantidad` int(11) NOT NULL DEFAULT 1,
  `precio_unitario` decimal(12,2) DEFAULT NULL,
  `total` decimal(14,2) GENERATED ALWAYS AS (coalesce(`cantidad`,0) * coalesce(`precio_unitario`,0)) VIRTUAL,
  `fecha_adquirido` date NOT NULL,
  `numero_factura` varchar(100) DEFAULT NULL,
  `notas` text DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `compras_proveedores`
--

INSERT INTO `compras_proveedores` (`id_compra`, `proveedor_id`, `nombre_producto`, `descripcion`, `cantidad`, `precio_unitario`, `fecha_adquirido`, `numero_factura`, `notas`, `creado_en`, `actualizado_en`) VALUES
(1, 2, 'TYUIOP', NULL, 16, NULL, '2025-11-06', NULL, NULL, '2025-11-06 19:39:09', '2025-11-06 19:54:01');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cotizaciones`
--

CREATE TABLE `cotizaciones` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `servicio` varchar(50) NOT NULL,
  `mensaje` text NOT NULL,
  `estado` enum('PENDIENTE','APROBADA','RECHAZADA','EN_PROCESO') DEFAULT 'PENDIENTE',
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cotizaciones`
--

INSERT INTO `cotizaciones` (`id`, `nombre`, `email`, `telefono`, `servicio`, `mensaje`, `estado`, `fecha`) VALUES
(1, 'fghjm,', '7u7thin@gmail.com', '2345674567', 'reparacion', 'vfghjk,.ghjk', 'PENDIENTE', '2025-10-17 02:59:06'),
(2, 'fghjm,', 'crkendo@gmail.com', '2345674567', 'reparacion', 'setdryfgiyuip9+iyturdy', 'PENDIENTE', '2025-10-17 04:32:11'),
(3, 'fghjm,', '7u7thin@gmail.com', '2345674567', 'reparacion', 'dfghjkhgfghjm,lkjhg', 'PENDIENTE', '2025-10-17 04:53:02'),
(4, 'fghjm,', '7u7thin@gmail.com', '2345674567', 'reparacion', 'vbnm,bhjkghj', 'PENDIENTE', '2025-10-17 04:59:35'),
(5, 'edrfgthyjk', '7u7thin@gmail.com', '2345674563', 'reparacion', 'DERHJKERTHJKLTRGHJ,M.', 'PENDIENTE', '2025-10-27 21:36:04');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cotizaciones_cliente`
--

CREATE TABLE `cotizaciones_cliente` (
  `id_cotizacion` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `piezas_enviadas` int(11) NOT NULL DEFAULT 0,
  `id_proveedor` int(11) DEFAULT NULL,
  `nombre_completo` varchar(255) NOT NULL,
  `direccion` varchar(255) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `correo_electronico` varchar(255) NOT NULL,
  `marca_bicicleta` varchar(100) NOT NULL,
  `modelo_bicicleta` varchar(100) NOT NULL,
  `zona_afectada` varchar(255) NOT NULL,
  `tipo_trabajo` enum('EXPRESS','NORMAL','PINTURA_TOTAL') NOT NULL,
  `tipo_reparacion` enum('CHEQUEO_ESTRUCTURAL','FISURA','FRACTURA','RECONSTRUCCION','ADAPTACION','OTROS') NOT NULL,
  `descripcion_otros` text DEFAULT NULL,
  `estado` enum('PENDIENTE','APROBADA','RECHAZADA','EN_PROCESO','COMPLETADO') DEFAULT 'PENDIENTE',
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cotizaciones_cliente`
--

INSERT INTO `cotizaciones_cliente` (`id_cotizacion`, `id_usuario`, `piezas_enviadas`, `id_proveedor`, `nombre_completo`, `direccion`, `telefono`, `correo_electronico`, `marca_bicicleta`, `modelo_bicicleta`, `zona_afectada`, `tipo_trabajo`, `tipo_reparacion`, `descripcion_otros`, `estado`, `creado_en`, `actualizado_en`) VALUES
(1, 21, 0, NULL, 'Julio Cesar Ruiz Pérez', 'Fray Pedro de Gante #298', '2481955951', '1211111@gmail.com', 'fghjk', 'fghjkl', '45t6yui', 'NORMAL', 'FISURA', NULL, 'PENDIENTE', '2025-10-28 04:16:28', '2025-10-28 04:16:28'),
(2, 24, 0, NULL, 'Julio Cesar Ruiz Pérez', 'Fray Pedro de Gante #298', '2481955951', '12@gmail.com', 'BENOTOO', 'M500', 'CUADRO', 'NORMAL', 'FISURA', NULL, 'PENDIENTE', '2025-10-31 04:41:00', '2025-10-31 04:41:00'),
(3, 26, 0, NULL, 'Julio Cesar Ruiz Pérez', 'Fray Pedro de Gante #298', '2481955951', 'eecesaree@gmail.com', 'rtyuikl', 'fgthjkl', 'ghjklñ', 'NORMAL', 'FISURA', NULL, 'PENDIENTE', '2025-11-05 02:34:54', '2025-11-05 02:34:54'),
(4, 29, 0, NULL, 'Julio Cesar Ruiz Pérez', 'Fray Pedro de Gante #298', '2481955951', '1234567@gmail.com', 'drfgthyjukl', 'rtyuiop', 'dfghjui', 'NORMAL', 'FISURA', NULL, 'PENDIENTE', '2025-11-06 04:21:18', '2025-11-06 04:21:18');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cotizacion_comentarios_cliente`
--

CREATE TABLE `cotizacion_comentarios_cliente` (
  `id_comentario` int(11) NOT NULL,
  `id_cotizacion` int(11) NOT NULL,
  `autor` varchar(100) NOT NULL,
  `mensaje` text NOT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cotizacion_imagenes_cliente`
--

CREATE TABLE `cotizacion_imagenes_cliente` (
  `id_imagen` int(11) NOT NULL,
  `id_cotizacion` int(11) NOT NULL,
  `ruta_imagen` varchar(255) NOT NULL,
  `nombre_archivo` varchar(255) NOT NULL,
  `tamano_bytes` int(11) NOT NULL,
  `tipo_mime` varchar(100) NOT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cotizacion_imagenes_cliente`
--

INSERT INTO `cotizacion_imagenes_cliente` (`id_imagen`, `id_cotizacion`, `ruta_imagen`, `nombre_archivo`, `tamano_bytes`, `tipo_mime`, `creado_en`) VALUES
(1, 1, 'Img_Servicios/1/img_6900439cb8d3e1.22982390.png', 'DFGHJ.drawio.png', 196927, 'image/png', '2025-10-28 04:16:28'),
(2, 2, 'Img_Servicios/2/img_69043ddc359917.29878507.png', 'ChatGPT Image 30 oct 2025, 22_32_29.png', 1291176, 'image/png', '2025-10-31 04:41:00'),
(3, 3, 'Img_Servicios/3/img_690ab7ce9628e0.15577324.png', 'Gemini_Generated_Image_g80xjyg80xjyg80x.png', 1013216, 'image/png', '2025-11-05 02:34:54'),
(4, 4, 'Img_Servicios/4/img_690c223e95a3b9.61707823.png', 'LogoI.png', 110934, 'image/png', '2025-11-06 04:21:18');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cotizacion_progreso_cliente`
--

CREATE TABLE `cotizacion_progreso_cliente` (
  `id_progreso` int(11) NOT NULL,
  `id_cotizacion` int(11) NOT NULL,
  `paso` int(11) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `activo` tinyint(1) DEFAULT 0,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cotizacion_progreso_cliente`
--

INSERT INTO `cotizacion_progreso_cliente` (`id_progreso`, `id_cotizacion`, `paso`, `descripcion`, `activo`, `creado_en`) VALUES
(1, 1, 1, 'Cotización Enviada', 1, '2025-10-28 04:16:28'),
(2, 2, 1, 'Cotización Enviada', 1, '2025-10-31 04:41:00'),
(3, 3, 1, 'Cotización Enviada', 1, '2025-11-05 02:34:54'),
(4, 4, 1, 'Cotización Enviada', 1, '2025-11-06 04:21:18');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `garantias_bicicletas`
--

CREATE TABLE `garantias_bicicletas` (
  `id_garantia` int(11) NOT NULL,
  `id_cotizacion` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `tipo_garantia` varchar(100) DEFAULT 'Estandar',
  `cobertura` text DEFAULT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `estado` enum('Activa','Vencida','Cancelada','Reclamada') DEFAULT 'Activa',
  `documento_ruta` varchar(255) DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `piezas_movimientos`
--

CREATE TABLE `piezas_movimientos` (
  `id_movimiento` int(11) NOT NULL,
  `id_cotizacion` int(11) NOT NULL,
  `tipo` enum('RECIBIDO','ENTREGADO') NOT NULL,
  `nombre_pieza` varchar(255) DEFAULT NULL,
  `codigo_pieza` varchar(100) DEFAULT NULL,
  `cantidad` int(11) DEFAULT 1,
  `proveedor_id` int(11) DEFAULT NULL,
  `nota` text DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedores`
--

CREATE TABLE `proveedores` (
  `id_proveedor` int(11) NOT NULL,
  `nombre_proveedor` varchar(255) NOT NULL,
  `contacto` varchar(255) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `notas_proveedor` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `proveedores`
--

INSERT INTO `proveedores` (`id_proveedor`, `nombre_proveedor`, `contacto`, `telefono`, `correo`, `direccion`, `creado_en`, `actualizado_en`, `notas_proveedor`) VALUES
(1, 'NM,', 'GHNJM ', 'GHJM', 'crkendok@gmail.com', 'fghjk', '2025-11-06 05:40:32', '2025-11-06 05:41:36', NULL),
(2, 'CDVBNM,', 'FGHJK', 'GHJK', 'crkendok@gmail.com', 'RTYUIKO', '2025-11-06 19:39:09', '2025-11-06 19:39:09', 'TY7UIUIO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id_rol` int(11) NOT NULL,
  `nombre_rol` varchar(50) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id_rol`, `nombre_rol`, `descripcion`, `creado_en`, `actualizado_en`) VALUES
(1, 'ADMINISTRADOR', 'Administrador del sistema', '2025-10-14 04:37:50', '2025-10-14 04:37:50'),
(2, 'CLIENTE', 'Usuario cliente de Total Carbon', '2025-10-14 04:37:50', '2025-10-14 04:37:50'),
(3, 'EMPLEADO', 'Empleado de Total Carbon', '2025-10-14 04:37:50', '2025-10-14 04:37:50');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `codigo_usuario` varchar(20) NOT NULL,
  `nombres` varchar(100) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `correo_electronico` varchar(100) NOT NULL,
  `numero_telefono` varchar(20) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `ciudad` varchar(100) DEFAULT NULL,
  `estado` varchar(100) DEFAULT NULL,
  `codigo_postal` varchar(20) DEFAULT NULL,
  `pais` varchar(100) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `contrasena` varchar(255) NOT NULL,
  `id_rol` int(11) NOT NULL,
  `estado_usuario` tinyint(1) DEFAULT 1,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `codigo_usuario`, `nombres`, `apellidos`, `correo_electronico`, `numero_telefono`, `direccion`, `ciudad`, `estado`, `codigo_postal`, `pais`, `fecha_nacimiento`, `contrasena`, `id_rol`, `estado_usuario`, `creado_en`, `actualizado_en`) VALUES
(10, 'TC00001', 'Julio Cesar', 'Ruiz Pérez', 'crkendo@gmail.com', '2481955951', 'Calle Principal #123', 'Ciudad de México', 'CDMX', '06000', 'México', '1985-05-15', '$2y$10$9vb..goLFWiCcehbyVYlNOhG228Q0z8CZ3vrD8lE1OoqhGoyT6Jn2', 2, 1, '2025-10-15 05:17:17', '2025-10-27 22:12:46'),
(11, 'TC00002', 'Julio Cesar', 'Ruiz Pérez', '2481955951@gmail.com', '2481955951', NULL, NULL, NULL, NULL, NULL, NULL, '$2y$10$jM1gmuABEIyNjiV5hg.sYuSbY.5mBfy.ECB5qfk4wcw737s6fREy2', 3, 1, '2025-10-15 05:31:04', '2025-10-15 05:35:25'),
(12, 'TC00003', 'Julio Cesar', 'Ruiz Pérez', '1111@gmail.com', '2481955951', NULL, NULL, NULL, NULL, NULL, NULL, '$2y$10$G6AyyDWsUAA0N7sB1qS0NOMrGEisFTYfVxPg.B/imYhmc3N36Bon2', 2, 1, '2025-10-21 03:04:15', '2025-10-21 03:04:15'),
(13, 'TC00004', 'Julio Cesar', 'Ruiz Pérez', '7u7thin@gmail.com', '2481955951', NULL, NULL, NULL, NULL, NULL, NULL, '$2y$10$8nVMPeCnkdSpyvXfcKeSHOrE/o7fAnYSytPzLn5vDfpS0LFs/KaIO', 1, 1, '2025-10-21 03:30:41', '2025-10-21 06:02:03'),
(14, 'TC00005', 'Julio Cesar', 'Ruiz Pérez', 'AS@gmail.com', '2481955951', NULL, NULL, NULL, NULL, NULL, NULL, '$2y$10$hbLISW20jW3rZ//7fXtu2egDzOPB5RQCx5BF3oqx2suBK8QMZ1ZZO', 2, 1, '2025-10-21 04:27:28', '2025-10-21 04:27:28'),
(15, 'TC00006', 'Julio Cesar', 'Ruiz Pérez', 'w@gmail.com', '2481955951', NULL, NULL, NULL, NULL, NULL, NULL, '$2y$10$p9TgrSDxKJjvNjXXZZORruOK95NPr4ouc.mgR3SRHJ0Zc6zCaUuLK', 2, 1, '2025-10-21 04:34:34', '2025-10-21 04:34:34'),
(16, 'TC00007', 'Julio Cesar', 'Ruiz Pérez', 'h@gmail.com', '2481955951', NULL, NULL, NULL, NULL, NULL, NULL, '$2y$10$tlwNyMb3gkOAyM5zrYzOk.C7hp0xAvYAxtx.VjxvzgcVlEc70G/qa', 2, 1, '2025-10-21 04:36:28', '2025-10-21 04:36:28'),
(17, 'TC00008', 'IKER CAR DE COLA', 'Ruiz Pérez', '1221@gmail.com', '2481955951', 'Av. Reforma 123', 'CDMX', 'CDMX', '01000', 'México', '1990-12-01', '$2y$10$qppV5gYX8sPZIT6NckmWI.C7SaJb6TxquAgSwcPaTDBoWwK3fgLQ2', 2, 1, '2025-10-27 21:55:37', '2025-10-27 22:12:46'),
(18, 'TC00009', 'Julio Cesar', 'Ruiz Pérez', '678@gmail.com', '2481955951', NULL, NULL, NULL, NULL, NULL, NULL, '$2y$10$v0xTI/p/bajtKytv0RTyN.UKx0a/G0nmcYkFdGVKt/glaTs4NH1Tu', 2, 1, '2025-10-27 22:18:22', '2025-10-27 22:18:22'),
(19, 'TC00010', 'Julio Cesar', 'Ruiz Pérez', 'QW@gmail.com', '2481955951', NULL, NULL, NULL, NULL, NULL, NULL, '$2y$10$XVoC14gqhkVDnjuPvb2Vr.0dCy6VL3jpq151Hcl/.oDloGkBrR5r2', 2, 1, '2025-10-27 22:26:17', '2025-10-27 22:26:17'),
(20, 'TC00011', 'AAAAAAA', 'Ruiz Pérez', '123123@gmail.com', '2481955951', NULL, NULL, NULL, NULL, NULL, NULL, '$2y$10$B3IbyJMMBx36bG1vde7GQu4KDlFxoT2J.oPXMH.pM.aaMGChNf3Q6', 2, 1, '2025-10-27 22:52:10', '2025-10-27 22:52:10'),
(21, 'TC00012', 'Julio Cesar', 'Ruiz Pérez', '1211111@gmail.com', '2481955951', 'Fray Pedro de Gante #298', 'Puebla', 'Pue.', '74155', 'México', '2025-10-28', '$2y$10$DnCQAsNu3Q3qIBb1WOvnguWS2ooYfRmZM4fBcwAFYmLLFaOYrKvKe', 2, 1, '2025-10-28 04:15:59', '2025-10-28 04:16:56'),
(22, 'TC00013', 'Julio Cesar', 'Ruiz Pérez', '2345@gmail.com', '2481955951', NULL, NULL, NULL, NULL, NULL, NULL, '$2y$10$1qR47K/ufieqY.cW3L0T0O85bzc7VrUo5wTcZDmb/mR5J/P6QFIg.', 2, 1, '2025-10-30 02:53:32', '2025-10-30 02:53:32'),
(23, 'TC00014', 'Julio Cesar', 'Ruiz Pérez', '1@gmail.com', '2481955951', NULL, NULL, NULL, NULL, NULL, NULL, '$2y$10$kpZjszAvATHMoq2.u0zA1ewprWkn8bNKfL9OSjsmuorxrLT44UTfG', 2, 1, '2025-10-31 04:08:47', '2025-10-31 04:08:47'),
(24, 'TC00015', 'Julio Cesar', 'Ruiz Pérez', '12@gmail.com', '2481955951', NULL, NULL, NULL, NULL, NULL, NULL, '$2y$10$y2OilZKWQ1UXaHrHeSMun.DYayW2cDLUIopNNS.uSW9..4VZSBbPu', 2, 1, '2025-10-31 04:29:05', '2025-10-31 04:29:05'),
(25, 'TC00016', 'Julio Cesar', 'Ruiz Pérez', '111@gmail.com', '2481955951', NULL, NULL, NULL, NULL, NULL, NULL, '$2y$10$at/UnQNZcZ8tbm5Hc57.UeRtmD8wV.Jzkjt5DM8uW6hGEajH0T5US', 2, 1, '2025-11-05 02:17:48', '2025-11-05 02:17:48'),
(26, 'TC00017', 'Julio Cesar', 'Ruiz Pérez', 'eecesaree@gmail.com', '2481955951', NULL, NULL, NULL, NULL, NULL, NULL, '$2y$10$I7LxJLWRjM9BQJ4/zTw9GeMrdYW4UGB2o3FAitSdUjn6s65zXdzHW', 2, 1, '2025-11-05 02:25:50', '2025-11-05 02:25:50'),
(27, 'TC00018', 'Julio Cesar', 'Ruiz Pérez', '123@gmail.com', '2481955951', NULL, NULL, NULL, NULL, NULL, NULL, '$2y$10$vNORO3RUIqoJQFgO6LyFn.bMpSy32bik0nmxH7u9tYQQRlPW.gu.u', 2, 1, '2025-11-05 03:36:44', '2025-11-05 03:36:44'),
(28, 'TC00019', 'GHJKL', 'GHJKL', 'GHJ@DFGHJ.COM', '2345678899', NULL, NULL, NULL, NULL, NULL, NULL, '$2y$10$ITZkS3I26hqrReIArRY/HehA7xf5P9S1PYt//al9fgQaPNNw1Ehcu', 1, 1, '2025-11-05 04:20:54', '2025-11-05 04:28:03'),
(29, 'TC00020', 'Julio Cesar', 'Ruiz Pérez', '1234567@gmail.com', '2481955951', NULL, NULL, NULL, NULL, NULL, NULL, '$2y$10$aF4fmuPIUsAaJLaRoQyTcu/lG6SOvBKDNOhHslNkj67TwuPEKmSuq', 1, 1, '2025-11-06 04:20:12', '2025-11-06 04:26:31');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `chat_historial`
--
ALTER TABLE `chat_historial`
  ADD PRIMARY KEY (`id_historial`),
  ADD KEY `fk_hist_mensaje` (`id_mensaje`),
  ADD KEY `fk_hist_emisor` (`id_emisor`),
  ADD KEY `fk_hist_receptor` (`id_receptor`);

--
-- Indices de la tabla `chat_mensajes`
--
ALTER TABLE `chat_mensajes`
  ADD PRIMARY KEY (`id_mensaje`),
  ADD KEY `idx_chat_emisor` (`id_emisor`),
  ADD KEY `idx_chat_receptor` (`id_receptor`),
  ADD KEY `idx_chat_cot` (`id_cotizacion`);

--
-- Indices de la tabla `codigos_recuperacion`
--
ALTER TABLE `codigos_recuperacion`
  ADD PRIMARY KEY (`id_recuperacion`),
  ADD KEY `idx_codigo` (`codigo_recuperacion`),
  ADD KEY `idx_usuario` (`id_usuario`),
  ADD KEY `idx_expiracion` (`fecha_expiracion`);

--
-- Indices de la tabla `compras_proveedores`
--
ALTER TABLE `compras_proveedores`
  ADD PRIMARY KEY (`id_compra`),
  ADD KEY `idx_compra_proveedor` (`proveedor_id`);

--
-- Indices de la tabla `cotizaciones`
--
ALTER TABLE `cotizaciones`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `cotizaciones_cliente`
--
ALTER TABLE `cotizaciones_cliente`
  ADD PRIMARY KEY (`id_cotizacion`),
  ADD KEY `idx_cotcli_usuario` (`id_usuario`),
  ADD KEY `idx_cotcli_estado` (`estado`),
  ADD KEY `idx_cotcli_creado_en` (`creado_en`);

--
-- Indices de la tabla `cotizacion_comentarios_cliente`
--
ALTER TABLE `cotizacion_comentarios_cliente`
  ADD PRIMARY KEY (`id_comentario`),
  ADD KEY `idx_com_cot` (`id_cotizacion`),
  ADD KEY `idx_com_fecha` (`creado_en`);

--
-- Indices de la tabla `cotizacion_imagenes_cliente`
--
ALTER TABLE `cotizacion_imagenes_cliente`
  ADD PRIMARY KEY (`id_imagen`),
  ADD KEY `idx_img_cot` (`id_cotizacion`),
  ADD KEY `idx_img_fecha` (`creado_en`);

--
-- Indices de la tabla `cotizacion_progreso_cliente`
--
ALTER TABLE `cotizacion_progreso_cliente`
  ADD PRIMARY KEY (`id_progreso`),
  ADD KEY `idx_prog_cot` (`id_cotizacion`),
  ADD KEY `idx_prog_paso` (`paso`),
  ADD KEY `idx_prog_activo` (`activo`);

--
-- Indices de la tabla `garantias_bicicletas`
--
ALTER TABLE `garantias_bicicletas`
  ADD PRIMARY KEY (`id_garantia`),
  ADD KEY `idx_garantia_cot` (`id_cotizacion`),
  ADD KEY `idx_garantia_usuario` (`id_usuario`);

--
-- Indices de la tabla `piezas_movimientos`
--
ALTER TABLE `piezas_movimientos`
  ADD PRIMARY KEY (`id_movimiento`),
  ADD KEY `idx_piezas_cot` (`id_cotizacion`),
  ADD KEY `idx_piezas_prov` (`proveedor_id`);

--
-- Indices de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  ADD PRIMARY KEY (`id_proveedor`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_rol`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `codigo_usuario` (`codigo_usuario`),
  ADD UNIQUE KEY `correo_electronico` (`correo_electronico`),
  ADD KEY `id_rol` (`id_rol`),
  ADD KEY `idx_correo` (`correo_electronico`),
  ADD KEY `idx_codigo` (`codigo_usuario`),
  ADD KEY `idx_usuarios_telefono` (`numero_telefono`),
  ADD KEY `idx_usuarios_ciudad` (`ciudad`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `chat_historial`
--
ALTER TABLE `chat_historial`
  MODIFY `id_historial` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `chat_mensajes`
--
ALTER TABLE `chat_mensajes`
  MODIFY `id_mensaje` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `codigos_recuperacion`
--
ALTER TABLE `codigos_recuperacion`
  MODIFY `id_recuperacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=109;

--
-- AUTO_INCREMENT de la tabla `compras_proveedores`
--
ALTER TABLE `compras_proveedores`
  MODIFY `id_compra` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `cotizaciones`
--
ALTER TABLE `cotizaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `cotizaciones_cliente`
--
ALTER TABLE `cotizaciones_cliente`
  MODIFY `id_cotizacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `cotizacion_comentarios_cliente`
--
ALTER TABLE `cotizacion_comentarios_cliente`
  MODIFY `id_comentario` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `cotizacion_imagenes_cliente`
--
ALTER TABLE `cotizacion_imagenes_cliente`
  MODIFY `id_imagen` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `cotizacion_progreso_cliente`
--
ALTER TABLE `cotizacion_progreso_cliente`
  MODIFY `id_progreso` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `garantias_bicicletas`
--
ALTER TABLE `garantias_bicicletas`
  MODIFY `id_garantia` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `piezas_movimientos`
--
ALTER TABLE `piezas_movimientos`
  MODIFY `id_movimiento` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  MODIFY `id_proveedor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id_rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `chat_historial`
--
ALTER TABLE `chat_historial`
  ADD CONSTRAINT `fk_hist_emisor` FOREIGN KEY (`id_emisor`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_hist_mensaje` FOREIGN KEY (`id_mensaje`) REFERENCES `chat_mensajes` (`id_mensaje`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_hist_receptor` FOREIGN KEY (`id_receptor`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `chat_mensajes`
--
ALTER TABLE `chat_mensajes`
  ADD CONSTRAINT `fk_chat_cot` FOREIGN KEY (`id_cotizacion`) REFERENCES `cotizaciones_cliente` (`id_cotizacion`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_chat_emisor` FOREIGN KEY (`id_emisor`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_chat_receptor` FOREIGN KEY (`id_receptor`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `codigos_recuperacion`
--
ALTER TABLE `codigos_recuperacion`
  ADD CONSTRAINT `codigos_recuperacion_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `compras_proveedores`
--
ALTER TABLE `compras_proveedores`
  ADD CONSTRAINT `fk_compra_proveedor` FOREIGN KEY (`proveedor_id`) REFERENCES `proveedores` (`id_proveedor`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `cotizaciones_cliente`
--
ALTER TABLE `cotizaciones_cliente`
  ADD CONSTRAINT `fk_cotcli_proveedor` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedores` (`id_proveedor`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_cotcli_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL;

--
-- Filtros para la tabla `cotizacion_comentarios_cliente`
--
ALTER TABLE `cotizacion_comentarios_cliente`
  ADD CONSTRAINT `fk_com_cot` FOREIGN KEY (`id_cotizacion`) REFERENCES `cotizaciones_cliente` (`id_cotizacion`) ON DELETE CASCADE;

--
-- Filtros para la tabla `cotizacion_imagenes_cliente`
--
ALTER TABLE `cotizacion_imagenes_cliente`
  ADD CONSTRAINT `fk_imgcot_cot` FOREIGN KEY (`id_cotizacion`) REFERENCES `cotizaciones_cliente` (`id_cotizacion`) ON DELETE CASCADE;

--
-- Filtros para la tabla `cotizacion_progreso_cliente`
--
ALTER TABLE `cotizacion_progreso_cliente`
  ADD CONSTRAINT `fk_prog_cot` FOREIGN KEY (`id_cotizacion`) REFERENCES `cotizaciones_cliente` (`id_cotizacion`) ON DELETE CASCADE;

--
-- Filtros para la tabla `garantias_bicicletas`
--
ALTER TABLE `garantias_bicicletas`
  ADD CONSTRAINT `fk_garantia_cot` FOREIGN KEY (`id_cotizacion`) REFERENCES `cotizaciones_cliente` (`id_cotizacion`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_garantia_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `piezas_movimientos`
--
ALTER TABLE `piezas_movimientos`
  ADD CONSTRAINT `fk_piezas_cot` FOREIGN KEY (`id_cotizacion`) REFERENCES `cotizaciones_cliente` (`id_cotizacion`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_piezas_proveedor` FOREIGN KEY (`proveedor_id`) REFERENCES `proveedores` (`id_proveedor`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
