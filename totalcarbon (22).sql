-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 13-11-2025 a las 05:58:23
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

--
-- Volcado de datos para la tabla `chat_historial`
--

INSERT INTO `chat_historial` (`id_historial`, `id_mensaje`, `id_emisor`, `id_receptor`, `mensaje`, `fecha_original`, `accion`, `fecha_accion`, `descripcion_accion`) VALUES
(11, 1, 10, 13, 'Hello, test message 1', '2025-11-07 01:34:39', 'Eliminado', '2025-11-07 01:34:39', 'Deleted by user'),
(12, 2, 10, 13, 'Hello, test message 2', '2025-11-07 01:34:39', 'Editado', '2025-11-07 01:34:39', 'Edited content'),
(13, 3, 10, 13, 'Hello, test message 3', '2025-11-07 01:34:39', 'Archivado', '2025-11-07 01:34:39', 'Archived for storage'),
(14, 4, 10, 13, 'Hello, test message 4', '2025-11-07 01:34:39', 'Recuperado', '2025-11-07 01:34:39', 'Recovered from archive'),
(15, 5, 10, 13, 'Hello, test message 5', '2025-11-07 01:34:39', 'Eliminado', '2025-11-07 01:34:39', 'Permanent delete'),
(16, 6, 10, 13, 'Hello, test message 6', '2025-11-07 01:34:39', 'Editado', '2025-11-07 01:34:39', 'Updated text'),
(17, 7, 10, 13, 'Hello, test message 7', '2025-11-07 01:34:39', 'Archivado', '2025-11-07 01:34:39', 'Moved to archive'),
(18, 8, 10, 13, 'Hello, test message 8', '2025-11-07 01:34:39', 'Recuperado', '2025-11-07 01:34:39', 'Restored'),
(19, 9, 10, 13, 'Hello, test message 9', '2025-11-07 01:34:39', 'Eliminado', '2025-11-07 01:34:39', 'User request'),
(20, 10, 10, 13, 'Hello, test message 10', '2025-11-07 01:34:39', 'Editado', '2025-11-07 01:34:39', 'Corrected error');

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
(1, 10, 13, 1, 'Hello, test message 1', 1, 0, 0, '2025-11-07 01:34:39'),
(2, 10, 13, 1, 'Hello, test message 2', 1, 0, 0, '2025-11-07 01:34:39'),
(3, 10, 13, 1, 'Hello, test message 3', 1, 1, 0, '2025-11-07 01:34:39'),
(4, 10, 13, 1, 'Hello, test message 4', 1, 0, 1, '2025-11-07 01:34:39'),
(5, 10, 13, 1, 'Hello, test message 5', 1, 0, 0, '2025-11-07 01:34:39'),
(6, 10, 13, 1, 'Hello, test message 6', 1, 0, 0, '2025-11-07 01:34:39'),
(7, 10, 13, 1, 'Hello, test message 7', 1, 1, 0, '2025-11-07 01:34:39'),
(8, 10, 13, 1, 'Hello, test message 8', 1, 0, 1, '2025-11-07 01:34:39'),
(9, 10, 13, 1, 'Hello, test message 9', 1, 0, 0, '2025-11-07 01:34:39'),
(10, 10, 13, 1, 'Hello, test message 10', 1, 0, 0, '2025-11-07 01:34:39'),
(11, 10, 13, NULL, 'Hola administrador, tengo una duda sobre mi cotizaci¾n.', 1, 0, 0, '2025-11-07 03:13:13'),
(12, 13, 10, NULL, 'Hola! Claro, ┐en quÚ puedo ayudarte?', 1, 0, 0, '2025-11-07 03:13:13'),
(13, 10, 13, NULL, 'El precio que me dieron me parece un poco alto, ┐podrÝan revisarlo?', 1, 0, 0, '2025-11-07 03:13:13'),
(14, 13, 10, NULL, 'Entiendo tu preocupaci¾n. DÚjame revisar tu cotizaci¾n y te doy una respuesta en breve.', 1, 0, 0, '2025-11-07 03:13:13'),
(15, 24, 13, NULL, 'Buenas tardes, quiero hacer una nueva cotizaci¾n para mi bicicleta.', 1, 0, 0, '2025-11-07 03:13:13'),
(16, 13, 24, NULL, 'íHola! Perfecto, te ayudo con eso. ┐QuÚ tipo de reparaci¾n necesitas?', 1, 0, 0, '2025-11-07 03:13:13'),
(17, 24, 13, NULL, 'Necesito reparar el cuadro, tiene una fisura.', 1, 0, 0, '2025-11-07 03:13:13'),
(18, 13, 10, NULL, 'HOLA', 0, 0, 0, '2025-11-07 03:35:57'),
(19, 13, 14, NULL, 'HOLA', 0, 0, 0, '2025-11-07 03:36:55'),
(20, 13, 10, NULL, 'esta bíen', 0, 0, 0, '2025-11-07 03:48:19'),
(21, 48, 13, NULL, 'HOLA', 1, 0, 0, '2025-11-07 04:03:35'),
(22, 48, 13, NULL, 'HOLA SOY SCARLETT', 1, 0, 0, '2025-11-07 04:05:39'),
(23, 48, 13, NULL, 'HOLA SOY SCARLETT', 1, 0, 0, '2025-11-07 04:19:55'),
(24, 13, 48, NULL, 'HOLAA', 0, 0, 0, '2025-11-07 04:20:06'),
(25, 48, 13, NULL, 'QUE HACES', 1, 0, 0, '2025-11-07 04:20:11'),
(26, 48, 13, NULL, 'Si?', 1, 0, 0, '2025-11-07 04:20:37'),
(27, 48, 13, NULL, 'HOLA', 1, 0, 0, '2025-11-07 04:27:36'),
(28, 48, 13, NULL, 'rtyuio', 1, 0, 0, '2025-11-07 04:35:07'),
(29, 48, 13, NULL, 'HOLA', 1, 0, 0, '2025-11-07 04:48:17'),
(30, 48, 13, NULL, 'DFGTYUIOP', 1, 0, 0, '2025-11-07 04:48:24'),
(31, 48, 13, NULL, 'HOLS', 1, 0, 0, '2025-11-07 04:49:53'),
(32, 48, 13, NULL, 'Fockiu', 1, 0, 0, '2025-11-07 04:52:12'),
(33, 48, 13, NULL, 'ERTYUIO', 1, 0, 0, '2025-11-07 05:09:17'),
(34, 48, 13, NULL, 'HOLAAAA', 1, 0, 0, '2025-11-07 05:22:38'),
(35, 48, 13, NULL, 'Jdjdj', 1, 0, 0, '2025-11-07 05:24:41'),
(36, 13, 48, NULL, 'DFGHJKL', 0, 0, 0, '2025-11-07 05:47:56'),
(37, 13, 48, NULL, 'RTYUIO', 0, 0, 0, '2025-11-07 06:07:44'),
(38, 49, 13, NULL, 'HOLA', 1, 0, 0, '2025-11-07 06:10:19'),
(39, 49, 13, NULL, 'QUIE HACES', 1, 0, 0, '2025-11-07 06:10:40'),
(40, 13, 49, NULL, 'NADA Y TU', 0, 0, 0, '2025-11-07 06:10:46');

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
(108, 13, '278246', '2025-11-06 05:35:00', 1, '2025-11-05 22:20:00'),
(109, 13, '123456', '2025-11-07 00:00:00', 1, '2025-11-06 19:34:39'),
(110, 13, '654321', '2025-11-07 00:00:00', 1, '2025-11-06 19:34:39'),
(111, 13, '789012', '2025-11-07 00:00:00', 1, '2025-11-06 19:34:39'),
(112, 13, '345678', '2025-11-07 00:00:00', 1, '2025-11-06 19:34:39'),
(113, 13, '901234', '2025-11-07 00:00:00', 1, '2025-11-06 19:34:39'),
(114, 13, '567890', '2025-11-07 00:00:00', 1, '2025-11-06 19:34:39'),
(115, 13, '234567', '2025-11-07 00:00:00', 1, '2025-11-06 19:34:39'),
(116, 13, '890123', '2025-11-07 00:00:00', 1, '2025-11-06 19:34:39'),
(117, 13, '456789', '2025-11-07 00:00:00', 1, '2025-11-06 19:34:39'),
(118, 13, '012345', '2025-11-07 00:00:00', 1, '2025-11-06 19:34:39'),
(119, 13, '272357', '2025-11-08 05:17:13', 1, '2025-11-07 22:02:13'),
(120, 13, '573178', '2025-11-08 05:17:15', 1, '2025-11-07 22:02:15'),
(121, 13, '407455', '2025-11-08 05:21:31', 1, '2025-11-07 22:06:31'),
(122, 13, '752316', '2025-11-08 05:27:52', 1, '2025-11-07 22:12:52'),
(123, 13, '420885', '2025-11-08 05:29:22', 1, '2025-11-07 22:14:22'),
(124, 13, '709029', '2025-11-08 05:31:04', 1, '2025-11-07 22:16:04'),
(125, 13, '735162', '2025-11-08 05:38:19', 1, '2025-11-07 22:23:19'),
(126, 13, '280401', '2025-11-08 05:40:41', 1, '2025-11-07 22:25:41'),
(127, 13, '335870', '2025-11-08 05:40:43', 1, '2025-11-07 22:25:43'),
(128, 13, '580928', '2025-11-08 05:46:57', 1, '2025-11-07 22:31:57'),
(129, 13, '356989', '2025-11-13 05:20:03', 1, '2025-11-12 22:05:03'),
(130, 13, '302659', '2025-11-13 05:23:12', 1, '2025-11-12 22:08:12');

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

--
-- Volcado de datos para la tabla `cotizaciones`
--

INSERT INTO `cotizaciones` (`id`, `nombre`, `email`, `telefono`, `servicio`, `mensaje`, `estado`, `fecha`) VALUES
(1, 'fghjm,', '7u7thin@gmail.com', '2345674567', 'reparacion', 'vfghjk,.ghjk', 'PENDIENTE', '2025-10-17 02:59:06'),
(2, 'fghjm,', 'crkendo@gmail.com', '2345674567', 'reparacion', 'setdryfgiyuip9+iyturdy', 'PENDIENTE', '2025-10-17 04:32:11'),
(3, 'fghjm,', '7u7thin@gmail.com', '2345674567', 'reparacion', 'dfghjkhgfghjm,lkjhg', 'PENDIENTE', '2025-10-17 04:53:02'),
(4, 'fghjm,', '7u7thin@gmail.com', '2345674567', 'reparacion', 'vbnm,bhjkghj', 'PENDIENTE', '2025-10-17 04:59:35'),
(5, 'edrfgthyjk', '7u7thin@gmail.com', '2345674563', 'reparacion', 'DERHJKERTHJKLTRGHJ,M.', 'PENDIENTE', '2025-10-27 21:36:04'),
(6, 'Cliente 1', 'cliente1@example.com', '1234567890', 'reparacion', 'Mensaje 1', 'PENDIENTE', '2025-11-07 01:34:39'),
(7, 'Cliente 2', 'cliente2@example.com', '1234567891', 'reparacion', 'Mensaje 2', 'APROBADA', '2025-11-07 01:34:39'),
(8, 'Cliente 3', 'cliente3@example.com', '1234567892', 'reparacion', 'Mensaje 3', 'RECHAZADA', '2025-11-07 01:34:39'),
(9, 'Cliente 4', 'cliente4@example.com', '1234567893', 'reparacion', 'Mensaje 4', 'EN_PROCESO', '2025-11-07 01:34:39'),
(10, 'Cliente 5', 'cliente5@example.com', '1234567894', 'reparacion', 'Mensaje 5', 'PENDIENTE', '2025-11-07 01:34:39'),
(11, 'Cliente 6', 'cliente6@example.com', '1234567895', 'reparacion', 'Mensaje 6', 'APROBADA', '2025-11-07 01:34:39'),
(12, 'Cliente 7', 'cliente7@example.com', '1234567896', 'reparacion', 'Mensaje 7', 'RECHAZADA', '2025-11-07 01:34:39'),
(13, 'Cliente 8', 'cliente8@example.com', '1234567897', 'reparacion', 'Mensaje 8', 'EN_PROCESO', '2025-11-07 01:34:39'),
(14, 'Cliente 9', 'cliente9@example.com', '1234567898', 'reparacion', 'Mensaje 9', 'PENDIENTE', '2025-11-07 01:34:39'),
(15, 'Cliente 10', 'cliente10@example.com', '1234567899', 'reparacion', 'Mensaje 10', 'APROBADA', '2025-11-07 01:34:39'),
(16, 'Djjdjd', '7u7thin@gmail.com', '2489556464', 'pintura', 'Hdbzbskakvsshsjs', 'PENDIENTE', '2025-11-07 04:14:30'),
(17, 'edrfgthyjk', 'crkendo@gmail.com', '2345674563', 'reparacion', 'SDFGHJKLÑ{\r\n12', 'PENDIENTE', '2025-11-08 05:33:09');

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
  `estado` enum('PENDIENTE','APROBADA','RECHAZADA','EN_PROCESO','COMPLETADO') DEFAULT 'PENDIENTE',
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `estado_reparaciones` enum('ACEPTADA','RECHAZADA') NOT NULL DEFAULT 'ACEPTADA',
  `reparacion_aceptada_cliente` enum('ACEPTADA','NO_ACEPTADA') NOT NULL DEFAULT 'ACEPTADA'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cotizaciones_cliente`
--

INSERT INTO `cotizaciones_cliente` (`id_cotizacion`, `id_usuario`, `piezas_enviadas`, `nombre_completo`, `direccion`, `telefono`, `correo_electronico`, `marca_bicicleta`, `modelo_bicicleta`, `zona_afectada`, `tipo_trabajo`, `tipo_reparacion`, `descripcion_otros`, `estado`, `creado_en`, `actualizado_en`, `estado_reparaciones`, `reparacion_aceptada_cliente`) VALUES
(1, 21, 0, 'Julio Cesar Ruiz Pérez', 'Fray Pedro de Gante #298', '2481955951', '1211111@gmail.com', 'fghjk', 'fghjkl', '45t6yui', 'NORMAL', 'FISURA', NULL, 'PENDIENTE', '2025-10-28 04:16:28', '2025-10-28 04:16:28', 'ACEPTADA', 'NO_ACEPTADA'),
(2, 24, 0, 'Julio Cesar Ruiz Pérez', 'Fray Pedro de Gante #298', '2481955951', '12@gmail.com', 'BENOTOO', 'M500', 'CUADRO', 'NORMAL', 'FISURA', NULL, 'PENDIENTE', '2025-10-31 04:41:00', '2025-10-31 04:41:00', 'ACEPTADA', 'NO_ACEPTADA'),
(3, 26, 0, 'Julio Cesar Ruiz Pérez', 'Fray Pedro de Gante #298', '2481955951', 'eecesaree@gmail.com', 'rtyuikl', 'fgthjkl', 'ghjklñ', 'NORMAL', 'FISURA', NULL, 'PENDIENTE', '2025-11-05 02:34:54', '2025-11-05 02:34:54', 'ACEPTADA', 'NO_ACEPTADA'),
(4, 29, 0, 'Julio Cesar Ruiz Pérez', 'Fray Pedro de Gante #298', '2481955951', '1234567@gmail.com', 'drfgthyjukl', 'rtyuiop', 'dfghjui', 'NORMAL', 'FISURA', NULL, 'PENDIENTE', '2025-11-06 04:21:18', '2025-11-06 04:21:18', 'ACEPTADA', 'NO_ACEPTADA'),
(5, 10, 1, 'Cliente A', 'Dirección A', '1234567890', 'clienteA@example.com', 'Marca A', 'Modelo A', 'Zona A', 'NORMAL', 'FISURA', NULL, 'PENDIENTE', '2025-11-07 01:34:39', '2025-11-08 05:20:51', 'ACEPTADA', 'NO_ACEPTADA'),
(6, 10, 2, 'Cliente B', 'Dirección B', '1234567891', 'clienteB@example.com', 'Marca B', 'Modelo B', 'Zona B', 'EXPRESS', 'FRACTURA', NULL, 'APROBADA', '2025-11-07 01:34:39', '2025-11-08 05:20:55', 'ACEPTADA', 'NO_ACEPTADA'),
(7, 10, 3, 'Cliente C', 'Dirección C', '1234567892', 'clienteC@example.com', 'Marca C', 'Modelo C', 'Zona C', 'PINTURA_TOTAL', 'RECONSTRUCCION', NULL, 'RECHAZADA', '2025-11-07 01:34:39', '2025-11-08 05:20:58', 'ACEPTADA', 'NO_ACEPTADA'),
(8, 10, 4, 'Cliente D', 'Dirección D', '1234567893', 'clienteD@example.com', 'Marca D', 'Modelo D', 'Zona D', 'NORMAL', 'ADAPTACION', NULL, 'EN_PROCESO', '2025-11-07 01:34:39', '2025-11-08 05:21:02', 'ACEPTADA', 'NO_ACEPTADA'),
(9, 10, 5, 'Cliente E', 'Dirección E', '1234567894', 'clienteE@example.com', 'Marca E', 'Modelo E', 'Zona E', 'EXPRESS', 'OTROS', NULL, 'COMPLETADO', '2025-11-07 01:34:39', '2025-11-08 05:21:05', 'ACEPTADA', 'NO_ACEPTADA'),
(10, 10, 6, 'Cliente F', 'Dirección F', '1234567895', 'clienteF@example.com', 'Marca F', 'Modelo F', 'Zona F', 'PINTURA_TOTAL', 'FISURA', NULL, 'PENDIENTE', '2025-11-07 01:34:39', '2025-11-08 05:21:08', 'ACEPTADA', 'NO_ACEPTADA'),
(11, 10, 7, 'Cliente G', 'Dirección G', '1234567896', 'clienteG@example.com', 'Marca G', 'Modelo G', 'Zona G', 'NORMAL', 'FRACTURA', NULL, 'APROBADA', '2025-11-07 01:34:39', '2025-11-08 05:21:11', 'ACEPTADA', 'NO_ACEPTADA'),
(12, 10, 8, 'Cliente H', 'Dirección H', '1234567897', 'clienteH@example.com', 'Marca H', 'Modelo H', 'Zona H', 'EXPRESS', 'RECONSTRUCCION', NULL, 'RECHAZADA', '2025-11-07 01:34:39', '2025-11-08 05:21:14', 'ACEPTADA', 'NO_ACEPTADA'),
(13, 10, 9, 'Cliente I', 'Dirección I', '1234567898', 'clienteI@example.com', 'Marca I', 'Modelo I', 'Zona I', 'PINTURA_TOTAL', 'ADAPTACION', NULL, 'EN_PROCESO', '2025-11-07 01:34:39', '2025-11-08 05:21:17', 'ACEPTADA', 'NO_ACEPTADA'),
(14, 10, 10, 'Cliente J', 'Dirección J', '1234567899', 'clienteJ@example.com', 'Marca J', 'Modelo J', 'Zona J', 'NORMAL', 'OTROS', NULL, 'COMPLETADO', '2025-11-07 01:34:39', '2025-11-08 05:21:21', 'ACEPTADA', 'NO_ACEPTADA'),
(15, 48, 0, 'EREERERREE Ruiz Pérez', 'Fray Pedro de Gante #298', '2481955951', '87654@gmail.com', 'drfgthyjukl', 'rtyuiop', '45t6yui', 'EXPRESS', 'FISURA', NULL, 'PENDIENTE', '2025-11-07 04:32:06', '2025-11-07 04:32:06', 'ACEPTADA', 'NO_ACEPTADA'),
(16, 50, 0, 'Julio Cesar Ruiz Pérez', 'Fray Pedro de Gante #298', '2481955951', '234@gmail.com', 'drfgthyjukl', 'fghjkl', 'dfghjui', 'PINTURA_TOTAL', 'FRACTURA', NULL, 'PENDIENTE', '2025-11-08 04:08:59', '2025-11-08 04:08:59', 'ACEPTADA', 'NO_ACEPTADA'),
(21, 13, 0, 'Julio Cesar Ruiz Pérez', 'Fray Pedro de Gante #298', '2481955951', '7u7thin@gmail.com', 'rtyuikl', 'rtyu', 'CUADRO', 'NORMAL', 'FISURA', NULL, 'PENDIENTE', '2025-11-13 04:35:08', '2025-11-13 04:35:08', 'ACEPTADA', 'NO_ACEPTADA');

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
(10, 1, 'Autor 10', 'Comentario 10', '2025-11-07 01:34:39');

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
(15, 15, 'Img_Servicios/15/img_690d764681c003.63536728.png', 'LogoI.png', 110934, 'image/png', '2025-11-07 04:32:06'),
(16, 16, 'Img_Servicios/16/img_690ec25bc94f26.88512216.png', 'Imagen2.png', 61327, 'image/png', '2025-11-08 04:08:59'),
(21, 21, 'Img_Servicios/21/img_69155ffc0dab99.34802534.png', 'LogoI.png', 110934, 'image/png', '2025-11-13 04:35:08');

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
(15, 15, 1, 'Cotización Enviada', 1, '2025-11-07 04:32:06'),
(16, 16, 1, 'Cotización Enviada', 1, '2025-11-08 04:08:59'),
(21, 21, 1, 'Cotización Enviada', 1, '2025-11-13 04:35:08');

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

--
-- Volcado de datos para la tabla `garantias_bicicletas`
--

INSERT INTO `garantias_bicicletas` (`id_garantia`, `id_cotizacion`, `id_usuario`, `tipo_garantia`, `cobertura`, `fecha_inicio`, `fecha_fin`, `estado`, `documento_ruta`, `creado_en`, `actualizado_en`) VALUES
(1, 1, 10, 'Estandar', 'Cobertura básica', '2025-11-06', '2026-11-06', 'Activa', 'docs/garantia1.pdf', '2025-11-07 01:34:40', '2025-11-07 01:34:40'),
(2, 1, 10, 'Extendida', 'Cobertura extendida', '2025-11-06', '2027-11-06', 'Vencida', 'docs/garantia2.pdf', '2025-11-07 01:34:40', '2025-11-07 01:34:40'),
(3, 1, 10, 'Estandar', 'Cobertura premium', '2025-11-06', '2026-11-06', 'Cancelada', 'docs/garantia3.pdf', '2025-11-07 01:34:40', '2025-11-07 01:34:40'),
(4, 1, 10, 'Extendida', 'Cobertura total', '2025-11-06', '2027-11-06', 'Reclamada', 'docs/garantia4.pdf', '2025-11-07 01:34:40', '2025-11-07 01:34:40'),
(5, 1, 10, 'Estandar', 'Cobertura básica', '2025-11-06', '2026-11-06', 'Activa', 'docs/garantia5.pdf', '2025-11-07 01:34:40', '2025-11-07 01:34:40'),
(6, 1, 10, 'Extendida', 'Cobertura extendida', '2025-11-06', '2027-11-06', 'Vencida', 'docs/garantia6.pdf', '2025-11-07 01:34:40', '2025-11-07 01:34:40'),
(7, 1, 10, 'Estandar', 'Cobertura premium', '2025-11-06', '2026-11-06', 'Cancelada', 'docs/garantia7.pdf', '2025-11-07 01:34:40', '2025-11-07 01:34:40'),
(8, 1, 10, 'Extendida', 'Cobertura total', '2025-11-06', '2027-11-06', 'Reclamada', 'docs/garantia8.pdf', '2025-11-07 01:34:40', '2025-11-07 01:34:40'),
(9, 1, 10, 'Estandar', 'Cobertura básica', '2025-11-06', '2026-11-06', 'Activa', 'docs/garantia9.pdf', '2025-11-07 01:34:40', '2025-11-07 01:34:40'),
(10, 1, 10, 'Extendida', 'Cobertura extendida', '2025-11-06', '2027-11-06', 'Vencida', 'docs/garantia10.pdf', '2025-11-07 01:34:40', '2025-11-07 01:34:40'),
(11, 21, 13, 'Estandar', 'Reparación de Cuadro - Tracer LILA', '2025-01-15', '2025-07-15', 'Activa', NULL, '2025-11-14 07:00:00', '2025-11-14 07:00:00'),
(12, 21, 13, 'Pintura', 'Pintura Personalizada - INTENSE', '2025-02-01', '2025-05-01', 'Activa', NULL, '2025-11-14 07:00:00', '2025-11-14 07:00:00'),
(13, 21, 13, 'Horquilla', 'Reparación de Horquilla - ROCKSHOX', '2025-12-10', '2026-12-10', 'Activa', NULL, '2025-11-14 07:00:00', '2025-11-14 07:00:00');

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
(10, 1, 'ENTREGADO', 'Pieza 10', 'COD010', 10, 1, 'Nota 10', '2025-11-07 01:34:40');

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
(13, 'Proveedor J', 'Contacto J', '1234567899', 'provJ@example.com', 'Dirección J', '2025-11-07 01:34:40', '2025-11-07 01:34:40', 'Notas J');

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
(3, 'EMPLEADO', 'Empleado de Total Carbon', '2025-10-14 04:37:50', '2025-10-14 04:37:50'),
(4, 'GERENTE', 'Gerente de operaciones', '2025-11-07 01:34:40', '2025-11-07 01:34:40'),
(5, 'SUPERVISOR', 'Supervisor de equipo', '2025-11-07 01:34:40', '2025-11-07 01:34:40'),
(6, 'TECNICO', 'Técnico especializado', '2025-11-07 01:34:40', '2025-11-07 01:34:40'),
(7, 'VENDEDOR', 'Vendedor de productos', '2025-11-07 01:34:40', '2025-11-07 01:34:40'),
(8, 'CONTADOR', 'Contador financiero', '2025-11-07 01:34:40', '2025-11-07 01:34:40'),
(9, 'MARKETING', 'Especialista en marketing', '2025-11-07 01:34:40', '2025-11-07 01:34:40'),
(10, 'SOPORTE', 'Soporte al cliente', '2025-11-07 01:34:40', '2025-11-07 01:34:40'),
(11, 'LOGISTICA', 'Encargado de logística', '2025-11-07 01:34:40', '2025-11-07 01:34:40'),
(12, 'RRHH', 'Recursos Humanos', '2025-11-07 01:34:40', '2025-11-07 01:34:40'),
(13, 'INVITADO', 'Usuario invitado', '2025-11-07 01:34:40', '2025-11-07 01:34:40');

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
(13, 'TC00004', 'Julio Cesar', 'Ruiz Pérez', '7u7thin@gmail.com', '2481955951', NULL, NULL, NULL, NULL, NULL, NULL, '$2y$10$O6gcR4l4UnT36SGdiIoRB.cHhgPl14lEYigF.0gtpPgV8DfwmUCoy', 2, 1, '2025-10-21 03:30:41', '2025-11-13 04:09:48'),
(14, 'TC00005', 'Julio Cesar', 'Ruiz Pérez', 'AS@gmail.com', '2481955951', NULL, NULL, NULL, NULL, NULL, NULL, '$2y$10$hbLISW20jW3rZ//7fXtu2egDzOPB5RQCx5BF3oqx2suBK8QMZ1ZZO', 2, 1, '2025-10-21 04:27:28', '2025-10-21 04:27:28'),
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
(50, 'TC00034', 'Julio Cesarsss', 'Ruiz Pérez', '234@gmail.com', '2481955951', '', '', '', NULL, NULL, NULL, '$2y$10$iO64aDkpCbGSkumTbG2X5uEsCRS9Hnnk7hKDxoXX5DsnVRa0k.abS', 2, 1, '2025-11-08 04:08:33', '2025-11-08 04:37:35');

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
-- Indices de la tabla `imagenes_proceso_reparacion`
--
ALTER TABLE `imagenes_proceso_reparacion`
  ADD PRIMARY KEY (`id_imagen_proceso`),
  ADD KEY `idx_id_cotizacion` (`id_cotizacion`),
  ADD KEY `idx_id_admin` (`id_admin`);

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
  MODIFY `id_historial` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `chat_mensajes`
--
ALTER TABLE `chat_mensajes`
  MODIFY `id_mensaje` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT de la tabla `codigos_recuperacion`
--
ALTER TABLE `codigos_recuperacion`
  MODIFY `id_recuperacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=131;

--
-- AUTO_INCREMENT de la tabla `compras_proveedores`
--
ALTER TABLE `compras_proveedores`
  MODIFY `id_compra` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `cotizaciones`
--
ALTER TABLE `cotizaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `cotizaciones_cliente`
--
ALTER TABLE `cotizaciones_cliente`
  MODIFY `id_cotizacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT de la tabla `cotizacion_comentarios_cliente`
--
ALTER TABLE `cotizacion_comentarios_cliente`
  MODIFY `id_comentario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `cotizacion_imagenes_cliente`
--
ALTER TABLE `cotizacion_imagenes_cliente`
  MODIFY `id_imagen` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT de la tabla `cotizacion_progreso_cliente`
--
ALTER TABLE `cotizacion_progreso_cliente`
  MODIFY `id_progreso` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT de la tabla `garantias_bicicletas`
--
ALTER TABLE `garantias_bicicletas`
  MODIFY `id_garantia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `imagenes_proceso_reparacion`
--
ALTER TABLE `imagenes_proceso_reparacion`
  MODIFY `id_imagen_proceso` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `piezas_movimientos`
--
ALTER TABLE `piezas_movimientos`
  MODIFY `id_movimiento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  MODIFY `id_proveedor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id_rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

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
