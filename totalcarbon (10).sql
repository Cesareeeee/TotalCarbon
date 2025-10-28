-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 28-10-2025 a las 03:37:30
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
(2, 10, '247464', '2025-10-21 07:36:05', 0, '2025-10-21 00:21:05'),
(3, 13, '868054', '2025-10-21 07:36:49', 1, '2025-10-21 00:21:49'),
(4, 13, '109369', '2025-10-21 07:37:10', 1, '2025-10-21 00:22:10'),
(5, 13, '006314', '2025-10-21 07:39:53', 1, '2025-10-21 00:24:53'),
(6, 13, '942796', '2025-10-21 08:09:59', 1, '2025-10-21 00:54:59'),
(7, 13, '426315', '2025-10-21 08:15:11', 1, '2025-10-21 01:00:11'),
(8, 13, '671041', '2025-10-21 08:18:03', 1, '2025-10-21 01:03:03'),
(9, 13, '137729', '2025-10-21 08:19:14', 1, '2025-10-21 01:04:14');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `conversaciones`
--

CREATE TABLE `conversaciones` (
  `id_conversacion` int(11) NOT NULL,
  `id_cliente` int(11) NOT NULL,
  `id_administrador` int(11) DEFAULT NULL,
  `asunto` varchar(200) NOT NULL,
  `estado` enum('abierta','cerrada') NOT NULL DEFAULT 'abierta',
  `creada_en` datetime NOT NULL DEFAULT current_timestamp(),
  `actualizada_en` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `conversaciones`
--

INSERT INTO `conversaciones` (`id_conversacion`, `id_cliente`, `id_administrador`, `asunto`, `estado`, `creada_en`, `actualizada_en`) VALUES
(1, 10, 13, 'Seguimiento cotización #1', 'abierta', '2025-10-27 20:37:11', '2025-10-27 20:37:11');

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
(6, 'Hxjdjd', '7u7thin@gmail.com', '2481955951', 'fabricacion', 'Hdjdbdbbddvdhdb', 'PENDIENTE', '2025-10-28 00:56:14');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cotizaciones_cliente`
--

CREATE TABLE `cotizaciones_cliente` (
  `id_cotizacion` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
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
  `estado_progreso` enum('cotizacion_enviada','aceptada','reparacion_iniciada','pintura','empacado','enviado','completado') NOT NULL DEFAULT 'cotizacion_enviada',
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cotizaciones_cliente`
--

INSERT INTO `cotizaciones_cliente` (`id_cotizacion`, `id_usuario`, `nombre_completo`, `direccion`, `telefono`, `correo_electronico`, `marca_bicicleta`, `modelo_bicicleta`, `zona_afectada`, `tipo_trabajo`, `tipo_reparacion`, `descripcion_otros`, `estado`, `estado_progreso`, `creado_en`, `actualizado_en`) VALUES
(1, 20, 'ertyu', 'Fray Pedro de Gante #298', '2481955951', '7u7thin@gmail.com', 'drfgthyjukl', 'fghjkl', 'dfghjui', 'NORMAL', 'FISURA', NULL, 'EN_PROCESO', 'reparacion_iniciada', '2025-10-27 23:42:41', '2025-10-28 02:37:11'),
(2, 20, 'ertyu', 'Fray Pedro de Gante #298', '2481955951', '7u7thin@gmail.com', 'drfgthyjukl', 'fghjkl', 'dfghjui', 'PINTURA_TOTAL', 'FRACTURA', NULL, 'PENDIENTE', 'cotizacion_enviada', '2025-10-28 00:37:28', '2025-10-28 00:37:28'),
(3, 20, 'ertyu', 'Fray Pedro de Gante #298', '2481955951', '7u7thin@gmail.com', 'drfgthyjukl', 'fghjkl', 'dfghjui', 'PINTURA_TOTAL', 'RECONSTRUCCION', NULL, 'PENDIENTE', 'cotizacion_enviada', '2025-10-28 00:50:51', '2025-10-28 00:50:51'),
(4, 21, 'Hhhh', 'Hhhj', '65646565', 'jdjdjdjd@gmail.com', 'Vvjjjhgg', 'Hhhhjjhggg', 'Vhhhuuh', 'EXPRESS', 'FRACTURA', NULL, 'PENDIENTE', 'cotizacion_enviada', '2025-10-28 01:00:02', '2025-10-28 01:00:02'),
(5, 20, 'ertyu', 'Fray Pedro de Gante #298', '2481955951', '7u7thin@gmail.com', 'drfgthyjukl', 'fghjkl', 'dfghjui', 'NORMAL', 'FRACTURA', NULL, 'PENDIENTE', 'cotizacion_enviada', '2025-10-28 01:04:49', '2025-10-28 01:04:49'),
(6, 22, 'ertyu', 'Fray Pedro de Gante #298', '2481955951', '7u7thin@gmail.com', 'drfgthyjukl', 'rtyu', '45t6yui', 'NORMAL', 'FISURA', NULL, 'PENDIENTE', 'cotizacion_enviada', '2025-10-28 01:22:06', '2025-10-28 01:22:06'),
(7, 22, 'Carlos Alejandro Martinez de la Cruz', 'Fray Pedro de Gante #298', '2481955951', '111111111111111111@gmail.com', 'drfgthyjukl', 'FGHYJUI', 'dfghjui', 'PINTURA_TOTAL', 'FRACTURA', NULL, 'APROBADA', 'cotizacion_enviada', '2025-10-28 01:54:41', '2025-10-28 02:15:23'),
(8, 22, 'Carlos Alejandro Martinez de la Cruz', 'Fray Pedro de Gante #298', '2481955951', '111111111111111111@gmail.com', 'drfgthyjukl', 'FGHYJUI', '45t6yui', 'NORMAL', 'RECONSTRUCCION', NULL, 'APROBADA', 'cotizacion_enviada', '2025-10-28 01:55:24', '2025-10-28 02:15:21'),
(9, 22, 'Carlos Alejandro Martinez de la Cruz', 'Fray Pedro de Gante #298', '2481955951', '111111111111111111@gmail.com', 'drfgthyjukl', 'FGHYJUI', '45t6yui', 'NORMAL', 'FISURA', NULL, 'APROBADA', 'cotizacion_enviada', '2025-10-28 01:56:18', '2025-10-28 02:14:52');

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
(1, 1, 'recursos/img/cotizaciones_cliente/1/img_69000371616d79.78892932.jpeg', 'WhatsApp Image 2025-10-21 at 14.49.32.jpeg', 128660, 'image/jpeg', '2025-10-27 23:42:41'),
(2, 2, 'recursos/img/cotizaciones_cliente/2/img_6900104840f703.54449131.jpeg', 'WhatsApp Image 2025-10-21 at 14.49.32.jpeg', 128660, 'image/jpeg', '2025-10-28 00:37:28'),
(3, 2, 'recursos/img/cotizaciones_cliente/2/img_6900104841ae33.35343836.jpg', 'image.jpg', 59367, 'image/jpeg', '2025-10-28 00:37:28'),
(4, 2, 'recursos/img/cotizaciones_cliente/2/img_69001048423755.86562831.jpg', 'RETICULA BIEEEN_page-0001.jpg', 584267, 'image/jpeg', '2025-10-28 00:37:28'),
(5, 3, 'recursos/Img_Servicios/3/img_6900136be23677.72557329.jpg', 'image.jpg', 59367, 'image/jpeg', '2025-10-28 00:50:51'),
(6, 4, 'recursos/Img_Servicios/4/img_690015928c91a1.22365617.jpg', '33434.jpg', 572485, 'image/jpeg', '2025-10-28 01:00:02'),
(7, 5, 'recursos/Img_Servicios/5/img_690016b18a19a5.74480205.jpeg', 'WhatsApp Image 2025-10-21 at 14.49.32.jpeg', 128660, 'image/jpeg', '2025-10-28 01:04:49'),
(8, 6, 'recursos/Img_Servicios/6/img_69001abeabd9c8.55825294.jpeg', 'WhatsApp Image 2025-10-21 at 14.49.32.jpeg', 128660, 'image/jpeg', '2025-10-28 01:22:06'),
(9, 7, 'Img_Servicios/7/img_69002261d1cc49.73931758.jpg', 'image.jpg', 59367, 'image/jpeg', '2025-10-28 01:54:41'),
(10, 8, 'Img_Servicios/8/img_6900228c060b53.57603910.jpg', 'image.jpg', 59367, 'image/jpeg', '2025-10-28 01:55:24'),
(11, 9, 'Img_Servicios/9/img_690022c23f8279.83794428.jpeg', 'WhatsApp Image 2025-09-25 at 21.23.39.jpeg', 17341, 'image/jpeg', '2025-10-28 01:56:18');

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
(1, 1, 1, 'Cotización Enviada', 1, '2025-10-27 23:42:41'),
(2, 2, 1, 'Cotización Enviada', 1, '2025-10-28 00:37:28'),
(3, 3, 1, 'Cotización Enviada', 1, '2025-10-28 00:50:51'),
(4, 4, 1, 'Cotización Enviada', 1, '2025-10-28 01:00:02'),
(5, 5, 1, 'Cotización Enviada', 1, '2025-10-28 01:04:49'),
(6, 6, 1, 'Cotización Enviada', 1, '2025-10-28 01:22:06'),
(7, 7, 1, 'Cotización Enviada', 1, '2025-10-28 01:54:41'),
(8, 8, 1, 'Cotización Enviada', 1, '2025-10-28 01:55:24'),
(9, 9, 2, 'Cotización Enviada', 1, '2025-10-28 01:56:18');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `imagenes_servicio`
--

CREATE TABLE `imagenes_servicio` (
  `id_imagen` int(11) NOT NULL,
  `id_cotizacion` int(11) NOT NULL,
  `ruta_imagen` varchar(255) NOT NULL,
  `subido_por` int(11) NOT NULL,
  `subido_en` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `imagenes_servicio`
--

INSERT INTO `imagenes_servicio` (`id_imagen`, `id_cotizacion`, `ruta_imagen`, `subido_por`, `subido_en`) VALUES
(1, 1, 'Img_servicios/1/img_demo.jpg', 13, '2025-10-27 20:37:11');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mensajes_chat`
--

CREATE TABLE `mensajes_chat` (
  `id_mensaje` int(11) NOT NULL,
  `id_conversacion` int(11) NOT NULL,
  `id_remitente` int(11) NOT NULL,
  `rol_remitente` enum('cliente','administrador') NOT NULL,
  `contenido` text NOT NULL,
  `leido_por_destinatario` tinyint(1) NOT NULL DEFAULT 0,
  `creado_en` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `mensajes_chat`
--

INSERT INTO `mensajes_chat` (`id_mensaje`, `id_conversacion`, `id_remitente`, `rol_remitente`, `contenido`, `leido_por_destinatario`, `creado_en`) VALUES
(1, 1, 10, 'cliente', 'Hola, ¿cómo va el servicio?', 0, '2025-10-27 20:37:11'),
(2, 1, 13, 'administrador', 'Vamos al 80%, pronto finalizamos.', 0, '2025-10-27 20:37:11');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificaciones`
--

CREATE TABLE `notificaciones` (
  `id_notificacion` int(11) NOT NULL,
  `id_usuario_destino` int(11) NOT NULL,
  `titulo` varchar(150) NOT NULL,
  `mensaje` text NOT NULL,
  `leida` tinyint(1) NOT NULL DEFAULT 0,
  `tipo` enum('info','alerta','sistema') NOT NULL DEFAULT 'info',
  `creada_en` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `notificaciones`
--

INSERT INTO `notificaciones` (`id_notificacion`, `id_usuario_destino`, `titulo`, `mensaje`, `leida`, `tipo`, `creada_en`) VALUES
(1, 10, 'Actualización de servicio', 'Tu servicio avanzó a EN PROCESO.', 0, 'info', '2025-10-27 20:37:11');

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
(20, 'TC00011', 'RERERER', 'DFGHJKLKFDFGHDFGHJKDFGH', '123123@gmail.com', '2481955951', 'Fray Pedro de Gante #298', 'Puebla', 'Pue.', '74155', 'México', '2025-10-07', '$2y$10$A.Zf9ZxLTeGcDB1QgF7y9Ojr63itAex/2cqwj8PrTBG5Xq1VpN6VK', 2, 1, '2025-10-27 22:52:10', '2025-10-28 00:45:58'),
(21, 'TC00012', 'Julio César', 'Ruiz', 'g@gmail.com', '2481955951', 'Dirección', NULL, NULL, NULL, NULL, NULL, '$2y$10$QYpWGc1wFaNS4j4JZZcTi.p..V/Q4Bb1XUFg7.w2pU8KJVDFeTz6a', 2, 1, '2025-10-28 00:58:02', '2025-10-28 00:59:22'),
(22, 'TC00013', 'Carlos Alejandro', 'Martinez de la Cruz', '111111111111111111@gmail.com', '2485522344', NULL, NULL, NULL, NULL, NULL, NULL, '$2y$10$kzEVouWY0/NU0V3T7Kkwk.MH1WLKKceqK2M75Bvmdj8acg3TziyoO', 2, 1, '2025-10-28 01:21:43', '2025-10-28 01:21:43');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `codigos_recuperacion`
--
ALTER TABLE `codigos_recuperacion`
  ADD PRIMARY KEY (`id_recuperacion`),
  ADD KEY `idx_codigo` (`codigo_recuperacion`),
  ADD KEY `idx_usuario` (`id_usuario`),
  ADD KEY `idx_expiracion` (`fecha_expiracion`);

--
-- Indices de la tabla `conversaciones`
--
ALTER TABLE `conversaciones`
  ADD PRIMARY KEY (`id_conversacion`),
  ADD KEY `idx_cliente` (`id_cliente`),
  ADD KEY `fk_conv_admin` (`id_administrador`);

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
  ADD KEY `idx_cotcli_creado_en` (`creado_en`),
  ADD KEY `idx_cotcli_estado_progreso` (`estado_progreso`);

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
-- Indices de la tabla `imagenes_servicio`
--
ALTER TABLE `imagenes_servicio`
  ADD PRIMARY KEY (`id_imagen`),
  ADD KEY `idx_imgserv_cot` (`id_cotizacion`),
  ADD KEY `fk_imgserv_admin` (`subido_por`);

--
-- Indices de la tabla `mensajes_chat`
--
ALTER TABLE `mensajes_chat`
  ADD PRIMARY KEY (`id_mensaje`),
  ADD KEY `idx_conversacion` (`id_conversacion`),
  ADD KEY `fk_msg_usuario` (`id_remitente`);

--
-- Indices de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD PRIMARY KEY (`id_notificacion`),
  ADD KEY `idx_destino_leida` (`id_usuario_destino`,`leida`);

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
-- AUTO_INCREMENT de la tabla `codigos_recuperacion`
--
ALTER TABLE `codigos_recuperacion`
  MODIFY `id_recuperacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `conversaciones`
--
ALTER TABLE `conversaciones`
  MODIFY `id_conversacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `cotizaciones`
--
ALTER TABLE `cotizaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `cotizaciones_cliente`
--
ALTER TABLE `cotizaciones_cliente`
  MODIFY `id_cotizacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `cotizacion_comentarios_cliente`
--
ALTER TABLE `cotizacion_comentarios_cliente`
  MODIFY `id_comentario` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `cotizacion_imagenes_cliente`
--
ALTER TABLE `cotizacion_imagenes_cliente`
  MODIFY `id_imagen` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `cotizacion_progreso_cliente`
--
ALTER TABLE `cotizacion_progreso_cliente`
  MODIFY `id_progreso` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `imagenes_servicio`
--
ALTER TABLE `imagenes_servicio`
  MODIFY `id_imagen` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `mensajes_chat`
--
ALTER TABLE `mensajes_chat`
  MODIFY `id_mensaje` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  MODIFY `id_notificacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id_rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `codigos_recuperacion`
--
ALTER TABLE `codigos_recuperacion`
  ADD CONSTRAINT `codigos_recuperacion_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `conversaciones`
--
ALTER TABLE `conversaciones`
  ADD CONSTRAINT `fk_conv_admin` FOREIGN KEY (`id_administrador`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_conv_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

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
-- Filtros para la tabla `imagenes_servicio`
--
ALTER TABLE `imagenes_servicio`
  ADD CONSTRAINT `fk_imgserv_admin` FOREIGN KEY (`subido_por`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_imgserv_cot` FOREIGN KEY (`id_cotizacion`) REFERENCES `cotizaciones_cliente` (`id_cotizacion`) ON DELETE CASCADE;

--
-- Filtros para la tabla `mensajes_chat`
--
ALTER TABLE `mensajes_chat`
  ADD CONSTRAINT `fk_msg_conv` FOREIGN KEY (`id_conversacion`) REFERENCES `conversaciones` (`id_conversacion`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_msg_usuario` FOREIGN KEY (`id_remitente`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD CONSTRAINT `fk_notif_usuario` FOREIGN KEY (`id_usuario_destino`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
