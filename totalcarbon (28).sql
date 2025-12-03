-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 02-12-2025 a las 23:12:24
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

--
-- Volcado de datos para la tabla `chat_mensajes`
--

INSERT INTO `chat_mensajes` (`id_mensaje`, `id_emisor`, `id_receptor`, `id_cotizacion`, `mensaje`, `leido`, `eliminado_emisor`, `eliminado_receptor`, `creado_en`) VALUES
(1, 51, 13, NULL, '123456789@gmail.com', 1, 0, 0, '2025-11-20 22:03:29'),
(2, 51, 13, NULL, 'RTYUI9O0P\'´¿}78', 1, 0, 0, '2025-11-20 22:03:58'),
(3, 13, 51, NULL, 'QUE PASA', 1, 0, 0, '2025-11-20 22:06:54'),
(4, 51, 13, NULL, 'RTYUJIKOP', 1, 0, 0, '2025-11-20 22:08:29'),
(5, 51, 13, NULL, 'GHJKLÑ{', 1, 0, 0, '2025-11-20 22:09:06'),
(6, 51, 13, NULL, 'DFGHJK', 1, 0, 0, '2025-11-20 22:09:55'),
(7, 51, 13, NULL, 'DFGHJKLÑTGYHJKL', 1, 0, 0, '2025-11-20 22:11:04'),
(8, 51, 13, NULL, 'DFGGGGGGGGGG', 1, 0, 0, '2025-11-20 22:12:15'),
(9, 13, 51, NULL, 'FOCKIU', 1, 0, 0, '2025-11-20 22:59:16'),
(12, 51, 13, NULL, 'DFGTYUIOP', 1, 0, 0, '2025-11-24 04:08:38'),
(13, 13, 51, NULL, 'fghjmk,l', 1, 0, 0, '2025-11-27 20:15:33'),
(14, 13, 51, NULL, 'FOKIUUUU', 1, 0, 0, '2025-11-27 20:22:07'),
(15, 13, 51, NULL, 'FFFFFFFFFFFFFFFFF', 1, 0, 0, '2025-11-27 20:27:47'),
(16, 13, 51, NULL, 'GGGGGGG', 1, 0, 0, '2025-11-27 20:29:12'),
(17, 51, 13, NULL, 'HOLA SOY SCARLETT', 1, 0, 0, '2025-11-27 20:29:46'),
(18, 13, 51, NULL, 'ffffffffffffffffff', 1, 0, 0, '2025-11-27 20:41:58'),
(19, 13, 51, NULL, 'aaaaaaaaaaaaaaaaaa', 1, 0, 0, '2025-11-27 20:45:03'),
(20, 13, 51, NULL, 'dddddddddddddd', 1, 0, 0, '2025-11-27 20:46:17'),
(21, 13, 51, NULL, 'DDDDDDDDDDDDDDDD', 1, 0, 0, '2025-11-27 20:52:18'),
(22, 13, 51, NULL, 'FFFFFFFFFFFFFFFFFFFFFFFF', 1, 0, 0, '2025-11-27 20:55:45'),
(23, 13, 51, NULL, 'aaaaaaaaaaaaaaaaaa', 1, 0, 0, '2025-11-27 20:58:54'),
(24, 13, 51, NULL, 'QQQQQQQQQQQQQQQ', 1, 0, 0, '2025-11-27 21:10:39'),
(25, 13, 51, NULL, 'QQQQQQQQQQQQQQQQQQQQQQQQQQQ', 1, 0, 0, '2025-11-27 21:14:26'),
(26, 13, 51, NULL, 'qqqqqqqqqqqqqqqqqqq', 1, 0, 0, '2025-11-27 21:18:24'),
(27, 13, 51, NULL, 'AAAAAAAAAAAAAAAAAA', 1, 0, 0, '2025-11-27 21:23:46'),
(28, 13, 51, NULL, 'ADDDDD', 1, 0, 0, '2025-11-27 21:24:13'),
(29, 13, 51, NULL, 'AAAAAAAAAAAAAA', 1, 0, 0, '2025-11-27 21:28:05'),
(30, 13, 51, NULL, 'AAAAAAAAAAAAAAAAA', 1, 0, 0, '2025-11-27 21:32:08'),
(31, 13, 51, NULL, 'AAAAAAAAAAAAAAAAAAAA', 1, 0, 0, '2025-11-27 21:36:15'),
(32, 13, 51, NULL, 'AAAAAAAAAAAAAAAAAAAA', 1, 0, 0, '2025-11-27 21:46:46'),
(33, 13, 51, NULL, 'DFGHJKKKKKKKKKKKKKKK', 1, 0, 0, '2025-11-27 21:47:25'),
(34, 13, 51, NULL, 'FOCKIUUUUU', 1, 0, 0, '2025-11-27 21:48:28'),
(35, 13, 51, NULL, 'AAAAAAAAAAAAAAAAAAAAA', 1, 0, 0, '2025-11-27 21:52:29'),
(36, 13, 51, NULL, 'AASSSSSSSSSSSS', 1, 0, 0, '2025-11-27 21:52:49'),
(37, 13, 51, NULL, 'FGHJKLÑH', 1, 0, 0, '2025-11-27 21:53:16'),
(38, 13, 51, NULL, 'EFGHYJUKILK', 1, 0, 0, '2025-11-27 21:53:40'),
(39, 13, 51, NULL, 'SDFGG', 1, 0, 0, '2025-11-27 21:59:57'),
(40, 51, 13, NULL, 'FGHYUJI', 1, 0, 0, '2025-11-27 22:00:44'),
(41, 13, 51, NULL, 'AAAAAAAAAAAAAAAAAAAA', 1, 0, 0, '2025-11-27 22:03:44'),
(42, 13, 51, NULL, 'DFGFFFFFFFFFFFFFFF', 1, 0, 0, '2025-11-27 22:05:19'),
(43, 13, 51, NULL, 'AAAAAAAAAAAAAAAAAAAAA}', 1, 0, 0, '2025-11-27 22:10:09'),
(44, 13, 51, NULL, 'GGGGGGGGGGGGGG', 1, 0, 0, '2025-11-27 22:13:03'),
(45, 51, 13, NULL, 'FFFFFFFFFFFF', 1, 0, 0, '2025-11-27 22:13:28'),
(46, 13, 51, NULL, 'FFFFFFFFFF', 1, 0, 0, '2025-11-27 22:13:33'),
(47, 13, 51, NULL, 'DDDDDDDDDDDDD', 1, 0, 0, '2025-11-27 22:15:51'),
(48, 13, 51, NULL, 'SSSSSSSSSSSSSSS', 1, 0, 0, '2025-11-27 22:16:17'),
(49, 13, 51, NULL, 'SSSSSSSSSSSSSSSSSSS', 1, 0, 0, '2025-11-27 22:16:19'),
(50, 51, 13, NULL, 'Si?', 1, 0, 0, '2025-11-27 22:27:39'),
(51, 51, 13, NULL, 'Pero por qué', 1, 0, 0, '2025-11-27 22:27:51'),
(52, 51, 13, NULL, 'Hola', 1, 0, 0, '2025-11-28 02:36:03'),
(53, 51, 13, NULL, 'Hola', 1, 0, 0, '2025-11-28 02:46:25'),
(54, 51, 13, NULL, 'Soy yo', 1, 0, 0, '2025-11-28 02:46:29'),
(55, 51, 13, NULL, 'Hola', 1, 0, 0, '2025-11-28 02:50:06'),
(56, 13, 51, NULL, 'CCCCCCCCCCCCCC', 1, 0, 0, '2025-11-28 02:50:31'),
(57, 13, 51, NULL, 'XXXXXXXXXXXXXXXXXXX', 1, 0, 0, '2025-11-28 03:19:24'),
(58, 13, 51, NULL, 'AAAAAAAAAAAAAAAAAAAAAA', 1, 0, 0, '2025-11-28 03:45:50'),
(59, 51, 13, NULL, 'HOLA SOY SCARLETT', 1, 0, 0, '2025-12-01 21:07:22'),
(60, 13, 51, NULL, 'Hola buenas tardes que paso', 1, 0, 0, '2025-12-01 21:07:34'),
(61, 51, 13, NULL, 'Necesito una nueva cotizacion por favor', 1, 0, 0, '2025-12-01 21:07:48'),
(62, 51, 13, NULL, 'De una bicicleta', 1, 0, 0, '2025-12-01 21:35:35'),
(63, 13, 51, NULL, 'DFGHJKLÑ', 1, 0, 0, '2025-12-02 05:03:27');

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
(137, 13, '620934', '2025-12-02 06:52:55', 0, '2025-12-01 23:37:55');

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
(2, 1, 'DEFGHJ', 'GHJKL', 14, 23.00, '2025-11-05', '45678789', 'BNHJMK,L.Ñ', '2025-11-06 20:06:04', '2025-11-06 20:07:00'),
(4, 2, 'DEFGHJ', 'SDFGHJKL', 3, 34.00, '2025-11-10', '45678789', 'GHJKLÑ', '2025-11-06 20:56:10', '2025-11-06 21:06:35'),
(6, 1, 'Producto A', 'Descripción A', 5, 10.00, '2025-11-06', 'FACT001', 'Nota A', '2025-11-07 01:34:39', '2025-11-07 01:34:39'),
(7, 1, 'Producto B', 'Descripción B', 10, 20.00, '2025-11-06', 'FACT002', 'Nota B', '2025-11-07 01:34:39', '2025-11-07 01:34:39'),
(8, 1, 'Producto C', 'Descripción C', 15, 30.00, '2025-11-06', 'FACT003', 'Nota C', '2025-11-07 01:34:39', '2025-11-07 01:34:39'),
(10, 1, 'Producto E', 'Descripción E', 25, 50.00, '2025-11-06', 'FACT005', 'Nota E', '2025-11-07 01:34:39', '2025-11-07 01:34:39'),
(11, 1, 'Producto F', 'Descripción F', 30, 60.00, '2025-11-06', 'FACT006', 'Nota F', '2025-11-07 01:34:39', '2025-11-07 01:34:39'),
(13, 1, 'Producto H', 'Descripción H', 40, 80.00, '2025-11-06', 'FACT008', 'Nota H', '2025-11-07 01:34:39', '2025-11-07 01:34:39'),
(15, 1, 'Producto J', 'Descripción J', 50, 100.00, '2025-11-06', 'FACT010', 'Nota J', '2025-11-07 01:34:39', '2025-11-07 01:34:39'),
(16, 2, 'DEFGHJ', 'EDRFGTHJ', 1, 3.00, '2025-11-18', '45678789', 'DFGHJKLÑ{ÑLUYTFRGHNJMK,L.-HYGTFRGNHJMK,L.', '2025-11-08 04:39:25', '2025-11-08 05:30:15');

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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cotizaciones_cliente`
--

CREATE TABLE `cotizaciones_cliente` (
  `id_cotizacion` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `piezas_enviadas` int(11) NOT NULL DEFAULT 0,
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
  `estado` enum('PENDIENTE','APROBADA','RECHAZADA','EN_PROCESO','COMPLETADO','COTIZACIÓN ENVIADA','ACEPTADA','REPARACIÓN INICIADA','PINTURA','EMPACADO','ENVIADO') NOT NULL DEFAULT 'PENDIENTE',
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `revision_camaras` datetime DEFAULT NULL,
  `inspeccion_estetica` text DEFAULT NULL,
  `empacado_salida` datetime DEFAULT NULL,
  `reparacion_aceptada_cliente` enum('ACEPTADA','NO_ACEPTADA','PENDIENTE') DEFAULT 'PENDIENTE'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cotizaciones_cliente`
--

INSERT INTO `cotizaciones_cliente` (`id_cotizacion`, `id_usuario`, `piezas_enviadas`, `nombre_completo`, `direccion`, `telefono`, `correo_electronico`, `marca_bicicleta`, `modelo_bicicleta`, `zona_afectada`, `tipo_trabajo`, `tipo_reparacion`, `descripcion_otros`, `estado`, `creado_en`, `actualizado_en`, `revision_camaras`, `inspeccion_estetica`, `empacado_salida`, `reparacion_aceptada_cliente`) VALUES
(1, 21, 0, 'Julio Cesar Ruiz Pérez', 'Fray Pedro de Gante #298', '2481955951', '1211111@gmail.com', 'fghjk', 'fghjkl', '45t6yui', 'NORMAL', 'FISURA', NULL, 'PENDIENTE', '2025-10-28 04:16:28', '2025-10-28 04:16:28', NULL, NULL, NULL, 'NO_ACEPTADA'),
(2, 24, 0, 'Julio Cesar Ruiz Pérez', 'Fray Pedro de Gante #298', '2481955951', '12@gmail.com', 'BENOTOO', 'M500', 'CUADRO', 'NORMAL', 'FISURA', NULL, 'PENDIENTE', '2025-10-31 04:41:00', '2025-10-31 04:41:00', NULL, NULL, NULL, 'NO_ACEPTADA'),
(4, 29, 0, 'Julio Cesar Ruiz Pérez', 'Fray Pedro de Gante #298', '2481955951', '1234567@gmail.com', 'drfgthyjukl', 'rtyuiop', 'dfghjui', 'NORMAL', 'FISURA', NULL, 'PENDIENTE', '2025-11-06 04:21:18', '2025-11-06 04:21:18', NULL, NULL, NULL, 'NO_ACEPTADA'),
(5, NULL, 1, 'Cliente A', 'Dirección A', '1234567890', 'clienteA@example.com', 'Marca A', 'Modelo A', 'Zona A', 'NORMAL', 'FISURA', NULL, 'PENDIENTE', '2025-11-07 01:34:39', '2025-11-08 05:20:51', NULL, NULL, NULL, 'NO_ACEPTADA'),
(6, NULL, 2, 'Cliente B', 'Dirección B', '1234567891', 'clienteB@example.com', 'Marca B', 'Modelo B', 'Zona B', 'EXPRESS', 'FRACTURA', NULL, 'APROBADA', '2025-11-07 01:34:39', '2025-11-08 05:20:55', NULL, NULL, NULL, 'NO_ACEPTADA'),
(7, NULL, 3, 'Cliente C', 'Dirección C', '1234567892', 'clienteC@example.com', 'Marca C', 'Modelo C', 'Zona C', 'PINTURA_TOTAL', 'RECONSTRUCCION', NULL, 'RECHAZADA', '2025-11-07 01:34:39', '2025-11-08 05:20:58', NULL, NULL, NULL, 'NO_ACEPTADA'),
(8, NULL, 4, 'Cliente D', 'Dirección D', '1234567893', 'clienteD@example.com', 'Marca D', 'Modelo D', 'Zona D', 'NORMAL', 'ADAPTACION', NULL, 'EN_PROCESO', '2025-11-07 01:34:39', '2025-11-08 05:21:02', NULL, NULL, NULL, 'NO_ACEPTADA'),
(9, NULL, 5, 'Cliente E', 'Dirección E', '1234567894', 'clienteE@example.com', 'Marca E', 'Modelo E', 'Zona E', 'EXPRESS', 'OTROS', NULL, 'COMPLETADO', '2025-11-07 01:34:39', '2025-11-08 05:21:05', NULL, NULL, NULL, 'NO_ACEPTADA'),
(10, NULL, 6, 'Cliente F', 'Dirección F', '1234567895', 'clienteF@example.com', 'Marca F', 'Modelo F', 'Zona F', 'PINTURA_TOTAL', 'FISURA', NULL, 'PENDIENTE', '2025-11-07 01:34:39', '2025-11-08 05:21:08', NULL, NULL, NULL, 'NO_ACEPTADA'),
(11, NULL, 7, 'Cliente G', 'Dirección G', '1234567896', 'clienteG@example.com', 'Marca G', 'Modelo G', 'Zona G', 'NORMAL', 'FRACTURA', NULL, 'APROBADA', '2025-11-07 01:34:39', '2025-11-08 05:21:11', NULL, NULL, NULL, 'NO_ACEPTADA'),
(12, NULL, 8, 'Cliente H', 'Dirección H', '1234567897', 'clienteH@example.com', 'Marca H', 'Modelo H', 'Zona H', 'EXPRESS', 'RECONSTRUCCION', NULL, 'RECHAZADA', '2025-11-07 01:34:39', '2025-11-08 05:21:14', NULL, NULL, NULL, 'NO_ACEPTADA'),
(13, NULL, 9, 'Cliente I', 'Dirección I', '1234567898', 'clienteI@example.com', 'Marca I', 'Modelo I', 'Zona I', 'PINTURA_TOTAL', 'ADAPTACION', NULL, 'EN_PROCESO', '2025-11-07 01:34:39', '2025-11-08 05:21:17', NULL, NULL, NULL, 'NO_ACEPTADA'),
(14, NULL, 10, 'Cliente J', 'Dirección J', '1234567899', 'clienteJ@example.com', 'Marca J', 'Modelo J', 'Zona J', 'NORMAL', 'OTROS', NULL, 'COMPLETADO', '2025-11-07 01:34:39', '2025-11-08 05:21:21', NULL, NULL, NULL, 'NO_ACEPTADA'),
(37, 13, 0, 'Julio Cesar Ruiz Pérez', 'Fray Pedro de Gante #298', '2481955951', '7u7thin@gmail.com', 'BENOTOO', 'rtyuiop', 'FOCKIN', 'NORMAL', 'FISURA', NULL, 'EN_PROCESO', '2025-11-14 04:36:48', '2025-11-14 05:24:30', NULL, NULL, NULL, 'ACEPTADA'),
(38, 13, 0, 'Julio Cesar Ruiz Pérez', 'Fray Pedro de Gante #298', '2481955951', '7u7thin@gmail.com', 'BENOTOO', 'FGHYJUI', 'ghjklñ', 'NORMAL', 'FISURA', NULL, 'COMPLETADO', '2025-11-14 04:40:33', '2025-11-14 05:24:36', NULL, NULL, NULL, 'ACEPTADA'),
(39, 13, 0, 'Julio Cesar Ruiz Pérez', 'Fray Pedro de Gante #298', '2481955951', '7u7thin@gmail.com', 'BENOTOO', 'FGHYJUI', '45t6yui', 'NORMAL', 'FISURA', NULL, 'APROBADA', '2025-11-14 04:45:24', '2025-11-14 04:45:51', NULL, NULL, NULL, 'ACEPTADA'),
(40, 20, 0, 'Juan P├®rez', 'Calle Principal 123', '555-1234', 'juan@example.com', 'Trek', 'FX 3', 'Cuadro', '', '', 'Grieta en el cuadro', 'PENDIENTE', '2025-11-14 05:56:35', '2025-11-14 05:56:35', NULL, NULL, NULL, 'NO_ACEPTADA'),
(41, 13, 0, 'Julio Cesar Ruiz Pérez', 'Fray Pedro de Gante #298', '2481955951', '7u7thin@gmail.com', 'BENOTOO', 'FGHYJUI', 'FOCKIN', 'NORMAL', 'FISURA', NULL, 'PENDIENTE', '2025-11-14 06:12:41', '2025-11-14 06:12:41', NULL, NULL, NULL, 'NO_ACEPTADA'),
(42, 51, 0, 'Julio Cesar Ruiz Pérez', 'Fray Pedro de Gante #298', '2481955951', '123456789@gmail.com', 'rtyuikl', 'FGHYJUI', 'dfghjui', 'NORMAL', 'FISURA', NULL, 'PENDIENTE', '2025-11-18 21:03:08', '2025-11-18 21:03:08', NULL, NULL, NULL, 'NO_ACEPTADA'),
(43, 51, 0, 'Julio Cesar Ruiz Pérez', 'Fray Pedro de Gante #298', '2481955951', '123456789@gmail.com', 'BENOTOO', 'FGHYJUI', 'CUADRO', 'PINTURA_TOTAL', 'FRACTURA', NULL, 'PENDIENTE', '2025-11-19 03:12:52', '2025-11-19 03:12:52', NULL, NULL, NULL, 'NO_ACEPTADA'),
(44, 51, 0, 'Julio Cesar Ruiz Pérez', 'Fray Pedro de Gante #298', '2481955951', '123456789@gmail.com', 'BENOTOO', 'FGHYJUI', 'CUADRO', 'PINTURA_TOTAL', 'FRACTURA', NULL, 'PENDIENTE', '2025-11-19 03:49:15', '2025-11-19 03:49:15', NULL, NULL, NULL, 'NO_ACEPTADA'),
(45, NULL, 0, 'Julio Cesar Ruiz Pérez', 'Fray Pedro de Gante #298', '2481955951', '234567890@gmail.com', 'BENOTOO', 'FGHYJUI', 'CUADRO', 'NORMAL', 'FISURA', NULL, 'PENDIENTE', '2025-11-24 03:33:47', '2025-11-24 03:33:47', NULL, NULL, NULL, 'NO_ACEPTADA'),
(46, 51, 0, 'Julio Cesar Ruiz Pérez', 'Fray Pedro de Gante #298', '2481955951', '123456789@gmail.com', 'BENOTOO', 'FGHYJUI', 'CUADRO', 'PINTURA_TOTAL', 'FRACTURA', NULL, 'PENDIENTE', '2025-11-27 04:08:40', '2025-11-27 04:08:40', NULL, NULL, NULL, 'NO_ACEPTADA'),
(47, 51, 0, 'Julio Cesar Ruiz Pérez', 'Fray Pedro de Gante #298', '2481955951', '123456789@gmail.com', 'BENOTOO', 'M500', 'CUADRO', 'PINTURA_TOTAL', 'FRACTURA', NULL, 'PENDIENTE', '2025-11-27 05:16:41', '2025-11-27 05:16:41', NULL, NULL, NULL, 'NO_ACEPTADA'),
(48, 51, 0, 'Julio Cesar Ruiz Pérez', 'Fray Pedro de Gante #298', '2481955951', '123456789@gmail.com', 'Specialized', 'FGHYJUI', 'CUADRO', 'NORMAL', 'FISURA', NULL, 'PENDIENTE', '2025-11-27 05:23:14', '2025-11-27 05:23:14', NULL, NULL, NULL, 'NO_ACEPTADA'),
(49, 51, 0, 'Julio Cesar Ruiz Pérez', 'Fray Pedro de Gante #298', '2481955951', '123456789@gmail.com', 'Otra', 'FGHYJUI', 'CUADRO', 'PINTURA_TOTAL', 'FRACTURA', NULL, 'PENDIENTE', '2025-11-27 05:26:21', '2025-11-27 05:26:21', NULL, NULL, NULL, 'NO_ACEPTADA'),
(50, 51, 0, 'Julio Cesar Ruiz Pérez', 'Fray Pedro de Gante #298', '2481955951', '123456789@gmail.com', 'BENOTOO', 'FGHYJUI', 'FOCKIN', 'NORMAL', 'FISURA', NULL, 'PENDIENTE', '2025-11-27 05:30:57', '2025-11-27 05:30:57', NULL, NULL, NULL, 'NO_ACEPTADA'),
(51, 51, 0, 'Julio Cesar Ruiz Pérez', 'Fray Pedro de Gante #298', '2481955951', '123456789@gmail.com', 'KAKORO', 'rtyuiop', 'CUADRO', 'PINTURA_TOTAL', 'FRACTURA', NULL, 'PENDIENTE', '2025-11-27 05:39:40', '2025-11-27 05:39:40', NULL, NULL, NULL, 'NO_ACEPTADA'),
(52, 51, 0, 'Julio Cesar Ruiz Pérez', 'Fray Pedro de Gante #298', '2481955951', '123456789@gmail.com', 'SPECIALIZED', 'FGHYJUI', 'CUADRO', 'NORMAL', 'FISURA', NULL, 'PENDIENTE', '2025-11-27 20:01:35', '2025-11-27 22:13:59', NULL, NULL, NULL, 'NO_ACEPTADA'),
(53, 51, 0, 'Julio Cesar Ruiz Pérez', 'Fray Pedro de Gante #298', '2481955951', '123456789@gmail.com', 'CANNONDALE', 'FGHYJUI', 'CUADRO', 'NORMAL', 'FISURA', NULL, 'COMPLETADO', '2025-11-27 22:24:58', '2025-11-28 02:52:59', NULL, NULL, NULL, 'NO_ACEPTADA'),
(54, 51, 0, 'Julio Cesar Ruiz Pérez', 'Fjdjjfjf', '2481955951', '123456789@gmail.com', 'SPECIALIZED', 'Jajsjsjs', 'Dhhdjdjdjd', 'EXPRESS', 'FISURA', NULL, 'PENDIENTE', '2025-11-28 03:08:23', '2025-11-28 03:08:23', NULL, NULL, NULL, 'NO_ACEPTADA'),
(55, 51, 0, 'Julio Cesar Ruiz Pérez', 'Fray Pedro de Gante #298', '2481955951', '123456789@gmail.com', 'BIANCHI', 'FGHYJUI', 'CUADRO', 'NORMAL', 'FISURA', NULL, 'PENDIENTE', '2025-11-28 03:47:55', '2025-11-28 03:47:55', NULL, NULL, NULL, 'NO_ACEPTADA'),
(56, 51, 0, 'Julio Cesar Ruiz Pérez FOCKIU', 'Fray Pedro de Gante #298', '2481955951', '123456789@gmail.com', 'SPECIALIZED', 'FGHYJUI', 'FOCKIN', 'NORMAL', 'FISURA', NULL, 'COMPLETADO', '2025-12-01 23:35:19', '2025-12-01 23:52:15', NULL, NULL, NULL, 'NO_ACEPTADA'),
(57, 51, 8, 'Julio Cesar Ruiz Pérez', 'Fray Pedro de Gante #298', '2481955951', '123456789@gmail.com', 'SPECIALIZED', 'Epic EVO', 'Cuadro y horquilla', 'NORMAL', 'FISURA', 'Reparación de fisuras en múltiples zonas con pintura parcial', 'APROBADA', '2025-12-02 02:56:06', '2025-12-02 05:04:26', '2025-12-10 21:45:56', 'A LA FOCKIU', '2025-12-09 21:46:09', 'ACEPTADA');

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

--
-- Volcado de datos para la tabla `cotizacion_comentarios_cliente`
--

INSERT INTO `cotizacion_comentarios_cliente` (`id_comentario`, `id_cotizacion`, `autor`, `mensaje`, `creado_en`) VALUES
(1, 1, 'Autor 1', 'Comentario 1', '2025-11-07 01:34:39'),
(2, 1, 'Autor 2', 'Comentario 2', '2025-11-07 01:34:39'),
(3, 1, 'Autor 3', 'Comentario 3', '2025-11-07 01:34:39'),
(4, 1, 'Autor 4', 'Comentario 4', '2025-11-07 01:34:39'),
(5, 1, 'Autor 5', 'Comentario 5', '2025-11-07 01:34:39'),
(6, 1, 'Autor 6', 'Comentario 6', '2025-11-07 01:34:39'),
(7, 1, 'Autor 7', 'Comentario 7', '2025-11-07 01:34:39'),
(8, 1, 'Autor 8', 'Comentario 8', '2025-11-07 01:34:39'),
(9, 1, 'Autor 9', 'Comentario 9', '2025-11-07 01:34:39'),
(10, 1, 'Autor 10', 'Comentario 10', '2025-11-07 01:34:39'),
(12, 38, 'Cliente', 'El cliente ha aceptado la propuesta de reparaciones.', '2025-11-14 04:43:17'),
(13, 37, 'Cliente', 'El cliente ha aceptado la propuesta de reparaciones.', '2025-11-14 04:43:32'),
(14, 39, 'Cliente', 'El cliente ha aceptado la propuesta de reparaciones.', '2025-11-14 04:45:51'),
(15, 56, 'Administrador', 'a la fockiu ', '2025-12-01 23:36:25'),
(16, 57, 'Cliente', 'Solicito cotización para reparar fisuras en el cuadro.', '2025-12-02 02:56:06'),
(17, 57, 'Administrador', 'Revisando las imágenes enviadas.', '2025-12-02 02:56:06'),
(18, 5, 'administrador', 'dfghjklñ', '2025-12-02 05:02:33');

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
(4, 4, 'Img_Servicios/4/img_690c223e95a3b9.61707823.png', 'LogoI.png', 110934, 'image/png', '2025-11-06 04:21:18'),
(5, 1, 'Img_Servicios/5/img_test1.png', 'test1.png', 100000, 'image/png', '2025-11-07 01:34:39'),
(6, 1, 'Img_Servicios/6/img_test2.png', 'test2.png', 200000, 'image/png', '2025-11-07 01:34:39'),
(7, 1, 'Img_Servicios/7/img_test3.png', 'test3.png', 300000, 'image/png', '2025-11-07 01:34:39'),
(8, 1, 'Img_Servicios/8/img_test4.png', 'test4.png', 400000, 'image/png', '2025-11-07 01:34:39'),
(9, 1, 'Img_Servicios/9/img_test5.png', 'test5.png', 500000, 'image/png', '2025-11-07 01:34:39'),
(10, 1, 'Img_Servicios/10/img_test6.png', 'test6.png', 600000, 'image/png', '2025-11-07 01:34:39'),
(11, 1, 'Img_Servicios/11/img_test7.png', 'test7.png', 700000, 'image/png', '2025-11-07 01:34:39'),
(12, 1, 'Img_Servicios/12/img_test8.png', 'test8.png', 800000, 'image/png', '2025-11-07 01:34:39'),
(13, 1, 'Img_Servicios/13/img_test9.png', 'test9.png', 900000, 'image/png', '2025-11-07 01:34:39'),
(14, 1, 'Img_Servicios/14/img_test10.png', 'test10.png', 1000000, 'image/png', '2025-11-07 01:34:39'),
(51, 37, 'Img_Servicios/37/img_6916b1e065a263.29982687.png', 'Imagen2.png', 61327, 'image/png', '2025-11-14 04:36:48'),
(52, 38, 'Img_Servicios/38/img_6916b2c1e87380.29771214.png', 'LogoI.png', 110934, 'image/png', '2025-11-14 04:40:33'),
(53, 39, 'Img_Servicios/39/img_6916b3e4b606f1.14801435.png', 'Gemini_Generated_Image_g80xjyg80xjyg80x.png', 1013216, 'image/png', '2025-11-14 04:45:24'),
(54, 41, 'Img_Servicios/41/img_6916c859780549.89630828.png', 'LogoI.png', 110934, 'image/png', '2025-11-14 06:12:41'),
(55, 42, 'Img_Servicios/42/img_691cdf0c5796a1.27590743.png', 'Imagen2.png', 61327, 'image/png', '2025-11-18 21:03:08'),
(56, 43, 'Img_Servicios/43/img_691d35b42d8d78.63635586.png', 'Imagen133.png', 39065, 'image/png', '2025-11-19 03:12:52'),
(57, 44, 'Img_Servicios/44/img_691d3e3b5c1ec5.62876935.png', '1.png', 48379, 'image/png', '2025-11-19 03:49:15'),
(58, 45, 'Img_Servicios/45/img_6923d21b7e8382.19199500.png', 'Imagen1.png', 30503, 'image/png', '2025-11-24 03:33:47'),
(59, 46, 'Img_Servicios/46/img_6927cec83309b3.34383383.png', '1.png', 48379, 'image/png', '2025-11-27 04:08:40'),
(60, 47, 'Img_Servicios/47/img_6927deb90fbae9.12275003.png', 'Imagen1.png', 51622, 'image/png', '2025-11-27 05:16:41'),
(61, 48, 'Img_Servicios/48/img_6927e042bf11b0.25319621.png', 'Imagen1.png', 51622, 'image/png', '2025-11-27 05:23:14'),
(62, 49, 'Img_Servicios/49/img_6927e0fd11f106.92708064.png', 'Imagen1.png', 51622, 'image/png', '2025-11-27 05:26:21'),
(63, 50, 'Img_Servicios/50/img_6927e21150a935.42765371.png', 'Imagen1.png', 51622, 'image/png', '2025-11-27 05:30:57'),
(64, 51, 'Img_Servicios/51/img_6927e41cc50a96.38344109.png', 'LogoI.png', 110934, 'image/png', '2025-11-27 05:39:40'),
(65, 52, 'Img_Servicios/52/img_6928ae1f890c33.81126240.png', '1.png', 48379, 'image/png', '2025-11-27 20:01:35'),
(66, 53, 'Img_Servicios/53/img_6928cfba7c5a69.53205853.png', '2.png', 59876, 'image/png', '2025-11-27 22:24:58'),
(67, 54, 'Img_Servicios/54/img_69291227eb72d2.39801086.jpg', '123.jpg', 3802217, 'image/jpeg', '2025-11-28 03:08:23'),
(68, 55, 'Img_Servicios/55/img_69291b6b1e2c93.05278622.png', 'Imagen133.png', 39065, 'image/png', '2025-11-28 03:47:55'),
(69, 56, 'Img_Servicios/56/img_692e2637bcd556.11976969.png', 'Gemini_Generated_Image_2al9t2al9t2al9t2.png', 4177030, 'image/png', '2025-12-01 23:35:19'),
(70, 57, 'Img_Servicios/56/img_692e2637bcd556.11976969.png', 'Gemini_Generated_Image_2al9t2al9t2al9t2.png', 4177030, 'image/png', '2025-12-02 02:56:06'),
(71, 57, 'Img_Servicios/52/img_6928ae1f890c33.81126240.png', '1.png', 48379, 'image/png', '2025-12-02 02:56:06'),
(72, 57, 'Img_Servicios/53/img_6928cfba7c5a69.53205853.png', '2.png', 59876, 'image/png', '2025-12-02 02:56:06');

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
(4, 4, 1, 'Cotización Enviada', 1, '2025-11-06 04:21:18'),
(5, 1, 2, 'Paso 2: Revisión', 1, '2025-11-07 01:34:39'),
(6, 1, 3, 'Paso 3: Aprobación', 0, '2025-11-07 01:34:39'),
(7, 1, 4, 'Paso 4: En Proceso', 1, '2025-11-07 01:34:39'),
(8, 1, 5, 'Paso 5: Completado', 0, '2025-11-07 01:34:39'),
(9, 1, 6, 'Paso 6: Entrega', 1, '2025-11-07 01:34:39'),
(10, 1, 7, 'Paso 7: Pago', 0, '2025-11-07 01:34:39'),
(11, 1, 8, 'Paso 8: Feedback', 1, '2025-11-07 01:34:39'),
(12, 1, 9, 'Paso 9: Cierre', 0, '2025-11-07 01:34:39'),
(13, 1, 10, 'Paso 10: Archivo', 1, '2025-11-07 01:34:39'),
(14, 1, 11, 'Paso 11: Extra', 0, '2025-11-07 01:34:39'),
(37, 37, 1, 'Cotización Enviada', 1, '2025-11-14 04:36:48'),
(38, 38, 1, 'Cotización Enviada', 1, '2025-11-14 04:40:33'),
(39, 39, 1, 'Cotización Enviada', 1, '2025-11-14 04:45:24'),
(40, 1, 1, 'Cotizaci├│n Enviada', 1, '2025-11-14 05:56:35'),
(41, 41, 4, 'Cotización Enviada', 1, '2025-11-14 06:12:41'),
(42, 42, 1, 'Cotización Enviada', 1, '2025-11-18 21:03:08'),
(43, 43, 1, 'Cotización Enviada', 1, '2025-11-19 03:12:52'),
(44, 44, 1, 'Cotización Enviada', 1, '2025-11-19 03:49:15'),
(45, 45, 1, 'Cotización Enviada', 1, '2025-11-24 03:33:47'),
(46, 46, 1, 'Cotización Enviada', 1, '2025-11-27 04:08:40'),
(47, 47, 1, 'Cotización Enviada', 1, '2025-11-27 05:16:41'),
(48, 48, 1, 'Cotización Enviada', 1, '2025-11-27 05:23:14'),
(49, 49, 1, 'Cotización Enviada', 1, '2025-11-27 05:26:21'),
(50, 50, 1, 'Cotización Enviada', 1, '2025-11-27 05:30:57'),
(51, 51, 1, 'Cotización Enviada', 1, '2025-11-27 05:39:40'),
(52, 52, 1, 'Cotización Enviada', 1, '2025-11-27 20:01:35'),
(53, 53, 1, 'Cotización Enviada', 1, '2025-11-27 22:24:58'),
(54, 54, 1, 'Cotización Enviada', 1, '2025-11-28 03:08:23'),
(55, 55, 1, 'Cotización Enviada', 1, '2025-11-28 03:47:55'),
(56, 56, 1, 'Cotización Enviada', 1, '2025-12-01 23:35:19'),
(57, 57, 1, 'Cotización Enviada', 1, '2025-12-02 02:56:06'),
(58, 57, 2, 'Revisión Inicial', 0, '2025-12-02 02:56:06');

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
  `estado` enum('pendiente','reclamada','activa','cancelada') NOT NULL DEFAULT 'pendiente',
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `garantias_bicicletas`
--

INSERT INTO `garantias_bicicletas` (`id_garantia`, `id_cotizacion`, `id_usuario`, `tipo_garantia`, `cobertura`, `fecha_inicio`, `fecha_fin`, `estado`, `creado_en`, `actualizado_en`) VALUES
(19, 38, 13, 'Básica', 'cvbnmvfbnm', '2025-11-14', '2026-02-13', '', '2025-11-28 04:32:06', '2025-12-02 05:05:16'),
(20, 57, 51, 'Básica', 'Cubre defectos en la fghjkpor 3 meses', '2025-12-01', '2026-03-01', '', '2025-12-02 02:56:06', '2025-12-02 04:48:22'),
(21, 53, 51, 'Básica', 'dfrgthyjuklñ{-', '2025-12-10', '2026-03-09', 'activa', '2025-12-02 05:06:01', '2025-12-02 05:06:01');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `imagenes_proceso_reparacion`
--

CREATE TABLE `imagenes_proceso_reparacion` (
  `id_imagen_proceso` int(11) NOT NULL,
  `id_cotizacion` int(11) NOT NULL,
  `id_admin` int(11) DEFAULT NULL,
  `ruta_imagen` varchar(255) NOT NULL,
  `nombre_archivo` varchar(255) NOT NULL,
  `tamano_bytes` int(11) DEFAULT NULL,
  `tipo_mime` varchar(100) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha_subida` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `imagenes_proceso_reparacion`
--

INSERT INTO `imagenes_proceso_reparacion` (`id_imagen_proceso`, `id_cotizacion`, `id_admin`, `ruta_imagen`, `nombre_archivo`, `tamano_bytes`, `tipo_mime`, `descripcion`, `fecha_subida`) VALUES
(1, 56, 11, 'Img_Servicios/56/img_692e2637bcd556.11976969.png', 'focky', 12332, 'fddggd', 'dfghj,f', '2025-12-01 23:49:43'),
(2, 57, 13, 'Img_Servicios/56/img_692e2637bcd556.11976969.png', 'proceso_inicial.png', 4177030, 'image/png', 'Imagen inicial de la zona afectada', '2025-12-02 02:56:06');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ingresos_gastos`
--

CREATE TABLE `ingresos_gastos` (
  `id_ingreso_gasto` int(11) NOT NULL,
  `concepto` varchar(255) NOT NULL COMMENT 'Descripción del ingreso o gasto',
  `tipo` enum('INGRESO','SALIDA') NOT NULL COMMENT 'Tipo de registro',
  `monto` decimal(12,2) NOT NULL COMMENT 'Monto del registro',
  `fecha` date NOT NULL COMMENT 'Fecha del registro',
  `descripcion` text DEFAULT NULL COMMENT 'Detalles adicionales',
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ingresos_gastos`
--

INSERT INTO `ingresos_gastos` (`id_ingreso_gasto`, `concepto`, `tipo`, `monto`, `fecha`, `descripcion`, `creado_en`) VALUES
(21, 'Venta de bicicleta Specialized', 'INGRESO', 25000.00, '2025-12-01', 'Venta de bicicleta modelo Allez Sprint', '2025-12-02 20:45:49'),
(22, 'Reparación de cuadro carbono', 'INGRESO', 8500.00, '2025-12-01', 'Reparación completa de cuadro dañado', '2025-12-02 20:45:49'),
(23, 'Servicio de pintura premium', 'INGRESO', 12000.00, '2025-12-02', 'Pintura completa con hoja de oro', '2025-12-02 20:45:49'),
(24, 'Venta de accesorios', 'INGRESO', 3200.00, '2025-12-02', 'Venta de manubrios y sillín', '2025-12-02 20:45:49'),
(26, 'Fabricación de cuadro personalizado', 'INGRESO', 45000.00, '2025-12-03', 'Cuadro a medida para competición', '2025-12-02 20:45:49'),
(27, 'Inspección NDT completa', 'INGRESO', 2800.00, '2025-12-04', 'Análisis estructural completo', '2025-12-02 20:45:49'),
(28, 'Reparación de fractura', 'INGRESO', 15200.00, '2025-12-04', 'Reconstrucción de cuadro fracturado', '2025-12-02 20:45:49'),
(29, 'Servicio de mantenimiento', 'INGRESO', 4200.00, '2025-12-05', 'Mantenimiento preventivo completo', '2025-12-02 20:45:49'),
(30, 'Venta de componentes', 'INGRESO', 8900.00, '2025-12-05', 'Venta de grupo Shimano y ruedas', '2025-12-02 20:45:49'),
(31, 'Compra de resina epoxi', 'SALIDA', 3200.00, '2025-12-01', 'Resina para reparaciones de carbono', '2025-12-02 20:45:49'),
(32, 'Pago de luz eléctrica', 'SALIDA', 1850.00, '2025-12-01', 'Factura mensual de servicios', '2025-12-02 20:45:49'),
(33, 'Compra de pintura PPG', 'SALIDA', 4500.00, '2025-12-02', 'Pintura automotriz premium', '2025-12-02 20:45:49'),
(34, 'Sueldos empleados', 'SALIDA', 25000.00, '2025-12-02', 'Pago quincenal de personal', '2025-12-02 20:45:49'),
(35, 'Compra de fibra de carbono', 'SALIDA', 15800.00, '2025-12-03', 'Hojas de carbono BASF', '2025-12-02 20:45:49'),
(36, 'Mantenimiento equipo', 'SALIDA', 3200.00, '2025-12-03', 'Reparación de cabina de pintura', '2025-12-02 20:45:49'),
(37, 'Compra de herramientas', 'SALIDA', 5200.00, '2025-12-04', 'Herramientas especializadas', '2025-12-02 20:45:49'),
(38, 'Pago de internet', 'SALIDA', 1200.00, '2025-12-04', 'Servicio mensual de internet', '2025-12-02 20:45:49'),
(39, 'Compra de insumos', 'SALIDA', 2800.00, '2025-12-05', 'Limpieza y mantenimiento', '2025-12-02 20:45:49'),
(42, 'CFGHJK.', 'INGRESO', 23456.00, '2025-10-16', 'FGHJKLÑ', '2025-12-02 20:47:11'),
(43, 'CFGHJK.', 'SALIDA', 345678.00, '2025-10-09', 'RTGHYJUKLÑ', '2025-12-02 20:49:20'),
(45, 'RIATA', 'INGRESO', 23454.00, '2025-12-02', 'DFGHJKLÑFG', '2025-12-02 21:10:48'),
(46, 'CFGHJK.', 'INGRESO', 34567.00, '2025-12-02', 'HYUIOÑ', '2025-12-02 21:21:42'),
(47, 'CFGHJK.', 'INGRESO', 232.00, '2025-12-02', 'DFGH', '2025-12-02 21:26:11');

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

--
-- Volcado de datos para la tabla `piezas_movimientos`
--

INSERT INTO `piezas_movimientos` (`id_movimiento`, `id_cotizacion`, `tipo`, `nombre_pieza`, `codigo_pieza`, `cantidad`, `proveedor_id`, `nota`, `creado_en`) VALUES
(1, 1, 'RECIBIDO', 'Pieza 1', 'COD001', 1, 1, 'Nota 1', '2025-11-07 01:34:40'),
(2, 1, 'ENTREGADO', 'Pieza 2', 'COD002', 2, 1, 'Nota 2', '2025-11-07 01:34:40'),
(3, 1, 'RECIBIDO', 'Pieza 3', 'COD003', 3, 1, 'Nota 3', '2025-11-07 01:34:40'),
(4, 1, 'ENTREGADO', 'Pieza 4', 'COD004', 4, 1, 'Nota 4', '2025-11-07 01:34:40'),
(5, 1, 'RECIBIDO', 'Pieza 5', 'COD005', 5, 1, 'Nota 5', '2025-11-07 01:34:40'),
(6, 1, 'ENTREGADO', 'Pieza 6', 'COD006', 6, 1, 'Nota 6', '2025-11-07 01:34:40'),
(7, 1, 'RECIBIDO', 'Pieza 7', 'COD007', 7, 1, 'Nota 7', '2025-11-07 01:34:40'),
(8, 1, 'ENTREGADO', 'Pieza 8', 'COD008', 8, 1, 'Nota 8', '2025-11-07 01:34:40'),
(9, 1, 'RECIBIDO', 'Pieza 9', 'COD009', 9, 1, 'Nota 9', '2025-11-07 01:34:40'),
(10, 1, 'ENTREGADO', 'Pieza 10', 'COD010', 10, 1, 'Nota 10', '2025-11-07 01:34:40'),
(11, 52, 'RECIBIDO', 'DDDDDD', NULL, 3, NULL, '', '2025-11-27 20:01:35'),
(12, 54, 'RECIBIDO', 'Folclu', NULL, 12, NULL, '', '2025-11-28 03:08:23'),
(13, 55, 'RECIBIDO', 'FFFFFF', NULL, 1, NULL, '', '2025-11-28 03:47:55'),
(14, 55, 'RECIBIDO', 'EEEEEEEEEEE', NULL, 1, NULL, '', '2025-11-28 03:47:55'),
(15, 57, 'RECIBIDO', 'Cuadro de bicicleta', 'CUAD-001', 1, NULL, 'Pieza recibida para inspección', '2025-12-02 02:56:06'),
(16, 57, 'RECIBIDO', 'Horquilla', 'HORQ-001', 1, NULL, 'Pieza adicional recibida', '2025-12-02 02:56:06'),
(17, 57, 'RECIBIDO', 'Rueda delantera', 'RUED-001', 1, NULL, 'Pieza recibida para revisión', '2025-12-02 03:05:22'),
(18, 57, 'RECIBIDO', 'Rueda trasera', 'RUED-002', 1, NULL, 'Pieza recibida para revisión', '2025-12-02 03:05:22'),
(19, 57, 'RECIBIDO', 'Manubrio', 'MANU-001', 1, NULL, 'Pieza recibida para revisión', '2025-12-02 03:05:22'),
(20, 57, 'RECIBIDO', 'Asiento', 'ASIE-001', 1, NULL, 'Pieza recibida para revisión', '2025-12-02 03:05:22'),
(21, 57, 'RECIBIDO', 'Cadena', 'CADE-001', 1, NULL, 'Pieza recibida para revisión', '2025-12-02 03:05:22');

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
(1, 'holASEGHJKL.Ñ-HGFGHJKM,.-', 'GHNJM ', 'GHJM', 'crkendok@gmail.com', 'fghjk', '2025-11-06 05:40:32', '2025-11-08 05:29:58', NULL),
(2, 'CDVBNM,', 'FGHJK', 'GHJK', 'crkendok@gmail.com', 'RTYUIKO', '2025-11-06 19:39:09', '2025-11-06 19:39:09', 'TY7UIUIO'),
(3, 'NM,', 'GHNJM ', 'GHJM', 'crkendok@gmail.com', 'fghjk', '2025-11-06 21:13:23', '2025-11-06 21:13:23', NULL),
(4, 'Proveedor A', 'Contacto A', '1234567890', 'provA@example.com', 'Dirección A', '2025-11-07 01:34:40', '2025-11-07 01:34:40', 'Notas A'),
(5, 'Proveedor B', 'Contacto B', '1234567891', 'provB@example.com', 'Dirección B', '2025-11-07 01:34:40', '2025-11-07 01:34:40', 'Notas B'),
(6, 'Proveedor C', 'Contacto C', '1234567892', 'provC@example.com', 'Dirección C', '2025-11-07 01:34:40', '2025-11-07 01:34:40', 'Notas C'),
(7, 'Proveedor D', 'Contacto D', '1234567893', 'provD@example.com', 'Dirección D', '2025-11-07 01:34:40', '2025-11-07 01:34:40', 'Notas D'),
(8, 'Proveedor E', 'Contacto E', '1234567894', 'provE@example.com', 'Dirección E', '2025-11-07 01:34:40', '2025-11-07 01:34:40', 'Notas E'),
(9, 'Proveedor F', 'Contacto F', '1234567895', 'provF@example.com', 'Dirección F', '2025-11-07 01:34:40', '2025-11-07 01:34:40', 'Notas F'),
(10, 'Proveedor G', 'Contacto G', '1234567896', 'provG@example.com', 'Dirección G', '2025-11-07 01:34:40', '2025-11-07 01:34:40', 'Notas G'),
(11, 'Proveedor H', 'Contacto H', '1234567897', 'provH@example.com', 'Dirección H', '2025-11-07 01:34:40', '2025-11-07 01:34:40', 'Notas H'),
(12, 'Proveedor I', 'Contacto I', '1234567898', 'provI@example.com', 'Dirección I', '2025-11-07 01:34:40', '2025-11-07 01:34:40', 'Notas I'),
(13, 'Proveedor J', 'Contacto J', '1234567899', 'provJ@example.com', 'Dirección J', '2025-11-07 01:34:40', '2025-11-07 01:34:40', 'Notas J'),
(17, 'CDVBNM,', 'GHNJM ', 'FGHNJMDFGBHNM,', 'crkendok@gmail.com', 'DFGBHNJM,.', '2025-11-20 23:10:03', '2025-11-20 23:10:03', NULL),
(18, 'NM,', 'GHNJM ', 'FGHNJMDFGBHNM,', '2311111111111456@gmail.com', 'RTYUIKO', '2025-11-20 23:10:16', '2025-11-20 23:10:16', NULL);

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
(11, 'TC00002', 'Julio Cesar', 'Ruiz Pérez', '2481955951@gmail.com', '2481955951', NULL, NULL, NULL, NULL, NULL, NULL, '$2y$10$jM1gmuABEIyNjiV5hg.sYuSbY.5mBfy.ECB5qfk4wcw737s6fREy2', 3, 1, '2025-10-15 05:31:04', '2025-10-15 05:35:25'),
(13, 'TC00004', 'Julio Cesar', 'Ruiz Pérez', '7u7thin@gmail.com', '2481955951', NULL, NULL, NULL, NULL, NULL, NULL, '$2y$10$O6gcR4l4UnT36SGdiIoRB.cHhgPl14lEYigF.0gtpPgV8DfwmUCoy', 1, 1, '2025-10-21 03:30:41', '2025-11-20 21:47:07'),
(14, 'TC00005', 'Julio Cesar', 'Ruiz Pérez', 'AS@gmail.com', '2481955951', NULL, NULL, NULL, NULL, NULL, NULL, '$2y$10$hbLISW20jW3rZ//7fXtu2egDzOPB5RQCx5BF3oqx2suBK8QMZ1ZZO', 2, 1, '2025-10-21 04:27:28', '2025-10-21 04:27:28'),
(18, 'TC00009', 'Julio Cesar', 'Ruiz Pérez', '678@gmail.com', '2481955951', NULL, NULL, NULL, NULL, NULL, NULL, '$2y$10$v0xTI/p/bajtKytv0RTyN.UKx0a/G0nmcYkFdGVKt/glaTs4NH1Tu', 2, 1, '2025-10-27 22:18:22', '2025-10-27 22:18:22'),
(19, 'TC00010', 'Julio Cesar', 'Ruiz Pérez', 'QW@gmail.com', '2481955951', NULL, NULL, NULL, NULL, NULL, NULL, '$2y$10$XVoC14gqhkVDnjuPvb2Vr.0dCy6VL3jpq151Hcl/.oDloGkBrR5r2', 2, 1, '2025-10-27 22:26:17', '2025-10-27 22:26:17'),
(20, 'TC00011', 'AAAAAAA', 'Ruiz Pérez', '123123@gmail.com', '2481955951', NULL, NULL, NULL, NULL, NULL, NULL, '$2y$10$B3IbyJMMBx36bG1vde7GQu4KDlFxoT2J.oPXMH.pM.aaMGChNf3Q6', 2, 1, '2025-10-27 22:52:10', '2025-10-27 22:52:10'),
(21, 'TC00012', 'Julio Cesar', 'Ruiz Pérez', '1211111@gmail.com', '2481955951', 'Fray Pedro de Gante #298', 'Puebla', 'Pue.', '74155', 'México', '2025-10-28', '$2y$10$DnCQAsNu3Q3qIBb1WOvnguWS2ooYfRmZM4fBcwAFYmLLFaOYrKvKe', 2, 1, '2025-10-28 04:15:59', '2025-10-28 04:16:56'),
(22, 'TC00013', 'Julio Cesar', 'Ruiz Pérez', '2345@gmail.com', '2481955951', NULL, NULL, NULL, NULL, NULL, NULL, '$2y$10$1qR47K/ufieqY.cW3L0T0O85bzc7VrUo5wTcZDmb/mR5J/P6QFIg.', 2, 1, '2025-10-30 02:53:32', '2025-10-30 02:53:32'),
(23, 'TC00014', 'Julio Cesar', 'Ruiz Pérez', '1@gmail.com', '2481955951', NULL, NULL, NULL, NULL, NULL, NULL, '$2y$10$kpZjszAvATHMoq2.u0zA1ewprWkn8bNKfL9OSjsmuorxrLT44UTfG', 2, 1, '2025-10-31 04:08:47', '2025-10-31 04:08:47'),
(24, 'TC00015', 'Julio Cesar', 'Ruiz Pérez', '12@gmail.com', '2481955951', NULL, NULL, NULL, NULL, NULL, NULL, '$2y$10$y2OilZKWQ1UXaHrHeSMun.DYayW2cDLUIopNNS.uSW9..4VZSBbPu', 2, 1, '2025-10-31 04:29:05', '2025-10-31 04:29:05'),
(25, 'TC00016', 'Julio Cesar', 'Ruiz Pérez', '111@gmail.com', '2481955951', NULL, NULL, NULL, NULL, NULL, NULL, '$2y$10$at/UnQNZcZ8tbm5Hc57.UeRtmD8wV.Jzkjt5DM8uW6hGEajH0T5US', 2, 1, '2025-11-05 02:17:48', '2025-11-05 02:17:48'),
(27, 'TC00018', 'Julio Cesar', 'Ruiz Pérez', '123@gmail.com', '2481955951', NULL, NULL, NULL, NULL, NULL, NULL, '$2y$10$vNORO3RUIqoJQFgO6LyFn.bMpSy32bik0nmxH7u9tYQQRlPW.gu.u', 2, 1, '2025-11-05 03:36:44', '2025-11-05 03:36:44'),
(28, 'TC00019', 'GHJKL', 'GHJKL', 'GHJ@DFGHJ.COM', '2345678899', NULL, NULL, NULL, NULL, NULL, NULL, '$2y$10$ITZkS3I26hqrReIArRY/HehA7xf5P9S1PYt//al9fgQaPNNw1Ehcu', 1, 1, '2025-11-05 04:20:54', '2025-11-05 04:28:03'),
(29, 'TC00020', 'Julio Cesar', 'Ruiz Pérez', '1234567@gmail.com', '2481955951', NULL, NULL, NULL, NULL, NULL, NULL, '$2y$10$aF4fmuPIUsAaJLaRoQyTcu/lG6SOvBKDNOhHslNkj67TwuPEKmSuq', 1, 1, '2025-11-06 04:20:12', '2025-11-06 04:26:31'),
(31, 'TC00022', 'Usuario B', 'Apellido B', 'userB@example.com', '1234567891', 'Dir B', 'Ciudad B', 'Estado B', '00002', 'País B', '2000-02-02', '$2y$10$examplehashB', 2, 1, '2025-11-07 01:34:40', '2025-11-07 01:34:40'),
(33, 'TC00024', 'IKER', 'Apellido D', 'userD@example.com', '1234567893', 'Dir D', 'Ciudad D', 'Estado D', '00004', 'País D', '2000-04-04', '$2y$10$examplehashD', 2, 1, '2025-11-07 01:34:40', '2025-11-07 01:50:25'),
(34, 'TC00025', 'Usuario E', 'Apellido E', 'userE@example.com', '1234567894', 'Dir E', 'Ciudad E', 'Estado E', '00005', 'País E', '2000-05-05', '$2y$10$examplehashE', 2, 1, '2025-11-07 01:34:40', '2025-11-07 01:34:40'),
(35, 'TC00026', 'Usuario F', 'Apellido F', 'userF@example.com', '1234567895', 'Dir F', 'Ciudad F', 'Estado F', '00006', 'País F', '2000-06-06', '$2y$10$examplehashF', 2, 1, '2025-11-07 01:34:40', '2025-11-07 01:34:40'),
(36, 'TC00027', 'Usuario G', 'Apellido G', 'userG@example.com', '1234567896', 'Dir G', 'Ciudad G', 'Estado G', '00007', 'País G', '2000-07-07', '$2y$10$examplehashG', 2, 1, '2025-11-07 01:34:40', '2025-11-07 01:34:40'),
(37, 'TC00028', 'Usuario H', 'Apellido H', 'userH@example.com', '1234567897', 'Dir H', 'Ciudad H', 'Estado H', '00008', 'País H', '2000-08-08', '$2y$10$examplehashH', 2, 1, '2025-11-07 01:34:40', '2025-11-07 01:34:40'),
(38, 'TC00029', 'Usuario I', 'Apellido I', 'userI@example.com', '1234567898', 'Dir I', 'Ciudad I', 'Estado I', '00009', 'País I', '2000-09-09', '$2y$10$examplehashI', 2, 1, '2025-11-07 01:34:40', '2025-11-07 01:34:40'),
(47, 'TC00031', 'Julio Cesar', 'Ruiz Pérez', '34567890\'@gmail.com', '2481955951', 'Fray Pedro de Gante #298', 'Puebla', 'Pue.', NULL, NULL, NULL, '$2y$10$zzUVparieoiSGu9388eWD.NNuk8zs3P0cfOVEUgJAS3EWfSRCWkvy', 2, 1, '2025-11-07 02:28:51', '2025-11-07 02:28:51'),
(48, 'TC00032', 'EREERERREE', 'Ruiz Pérez', '87654@gmail.com', '2481955951', 'Fray Pedro de Gante #298', 'Puebla', 'Pue.', '74155', 'México', '2025-11-09', '$2y$10$OQVUQRZWsmBGwtLmWBiq1e/6M72Nc8UdwB5HuTrZ2fN/r1JBhHuP.', 2, 1, '2025-11-07 03:46:17', '2025-11-07 04:31:33'),
(49, 'TC00033', 'Julio Cesar', 'Ruiz Pérez', '1234534567@gmail.com', '2481955951', NULL, NULL, NULL, NULL, NULL, NULL, '$2y$10$VQtdsFVGKVOZF1axG6zSzutJ5Di0Wisc5rSDQHP1eVv3a5Yb3un1K', 2, 1, '2025-11-07 06:10:06', '2025-11-07 06:10:06'),
(50, 'TC00034', 'Julio Cesarsss', 'Ruiz Pérez', '234@gmail.com', '2481955951', '', '', '', NULL, NULL, NULL, '$2y$10$iO64aDkpCbGSkumTbG2X5uEsCRS9Hnnk7hKDxoXX5DsnVRa0k.abS', 2, 1, '2025-11-08 04:08:33', '2025-11-08 04:37:35'),
(51, 'TC00035', 'Julio Cesar', 'Ruiz Pérez', '123456789@gmail.com', '2481955951', 'Fray Pedro de Gante #298', 'Puebla', 'Pue.', '74155', 'México', '2025-11-12', '$2y$10$5ZwrKm.oGr5cPFTpi2zb5.Aff1uqImgzZY0L0LN8XZKZ0dBsoQ8f.', 2, 1, '2025-11-18 21:02:40', '2025-11-18 21:03:45'),
(63, 'TC00036', '', '', 'crkendok@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '$2y$10$A5rhkmbBp8Lfz62Le8BGGuNhhXAXooebmHBAWtpJ5sYSapvz6XSeK', 2, 1, '2025-11-24 03:47:44', '2025-11-24 03:47:44'),
(66, 'TC00039', 'Julio Cesar', 'Ruiz Pérez', '23434234@gmail.com', '2481955951', NULL, NULL, NULL, NULL, NULL, NULL, '$2y$10$3DPQxNw3eoYaBjgE2eR0E.DrLzVYce6.8LQzb6ReXYCNmxHvdWgpa', 2, 1, '2025-12-02 05:35:11', '2025-12-02 05:35:11'),
(67, 'TC00040', 'Julio Cesar', 'Ruiz Pérez', '11111@gmail.com', '2481955951', NULL, NULL, NULL, NULL, NULL, NULL, '$2y$10$mbc5Ro/AmZOel6SEeK/sWOjAOaytLg0akrhSrVm3V4JrSNKhEsylq', 2, 1, '2025-12-02 19:10:06', '2025-12-02 19:10:06');

--
-- Índices para tablas volcadas
--

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
-- Indices de la tabla `imagenes_proceso_reparacion`
--
ALTER TABLE `imagenes_proceso_reparacion`
  ADD PRIMARY KEY (`id_imagen_proceso`),
  ADD KEY `idx_id_cotizacion` (`id_cotizacion`),
  ADD KEY `idx_id_admin` (`id_admin`);

--
-- Indices de la tabla `ingresos_gastos`
--
ALTER TABLE `ingresos_gastos`
  ADD PRIMARY KEY (`id_ingreso_gasto`),
  ADD KEY `idx_tipo` (`tipo`),
  ADD KEY `idx_fecha` (`fecha`),
  ADD KEY `idx_tipo_fecha` (`tipo`,`fecha`);

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
-- AUTO_INCREMENT de la tabla `chat_mensajes`
--
ALTER TABLE `chat_mensajes`
  MODIFY `id_mensaje` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT de la tabla `codigos_recuperacion`
--
ALTER TABLE `codigos_recuperacion`
  MODIFY `id_recuperacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=138;

--
-- AUTO_INCREMENT de la tabla `compras_proveedores`
--
ALTER TABLE `compras_proveedores`
  MODIFY `id_compra` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `cotizaciones`
--
ALTER TABLE `cotizaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de la tabla `cotizaciones_cliente`
--
ALTER TABLE `cotizaciones_cliente`
  MODIFY `id_cotizacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT de la tabla `cotizacion_comentarios_cliente`
--
ALTER TABLE `cotizacion_comentarios_cliente`
  MODIFY `id_comentario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `cotizacion_imagenes_cliente`
--
ALTER TABLE `cotizacion_imagenes_cliente`
  MODIFY `id_imagen` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=73;

--
-- AUTO_INCREMENT de la tabla `cotizacion_progreso_cliente`
--
ALTER TABLE `cotizacion_progreso_cliente`
  MODIFY `id_progreso` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT de la tabla `garantias_bicicletas`
--
ALTER TABLE `garantias_bicicletas`
  MODIFY `id_garantia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT de la tabla `imagenes_proceso_reparacion`
--
ALTER TABLE `imagenes_proceso_reparacion`
  MODIFY `id_imagen_proceso` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `ingresos_gastos`
--
ALTER TABLE `ingresos_gastos`
  MODIFY `id_ingreso_gasto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT de la tabla `piezas_movimientos`
--
ALTER TABLE `piezas_movimientos`
  MODIFY `id_movimiento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  MODIFY `id_proveedor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id_rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- Restricciones para tablas volcadas
--

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
-- Filtros para la tabla `imagenes_proceso_reparacion`
--
ALTER TABLE `imagenes_proceso_reparacion`
  ADD CONSTRAINT `fk_ipr_admin` FOREIGN KEY (`id_admin`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ipr_cotizacion` FOREIGN KEY (`id_cotizacion`) REFERENCES `cotizaciones_cliente` (`id_cotizacion`) ON DELETE CASCADE ON UPDATE CASCADE;

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
