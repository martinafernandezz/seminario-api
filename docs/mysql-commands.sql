-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: tp
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Create database if not exists
--

CREATE DATABASE IF NOT EXISTS `tp`;
USE `tp`;

--
-- Table structure for table `localidad`
--

DROP TABLE IF EXISTS `localidad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `localidad` (
  `id_localidad` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`id_localidad`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `localidad`
--

LOCK TABLES `localidad` WRITE;
/*!40000 ALTER TABLE `localidad` DISABLE KEYS */;
INSERT INTO `localidad` VALUES (1,'Buenos Aires'),(2,'Rosario'),(3,'Córdoba');
/*!40000 ALTER TABLE `localidad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipocancha`
--

DROP TABLE IF EXISTS `tipocancha`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipocancha` (
  `id_tipo` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `deporte` varchar(50) NOT NULL,
  PRIMARY KEY (`id_tipo`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipocancha`
--

LOCK TABLES `tipocancha` WRITE;
/*!40000 ALTER TABLE `tipocancha` DISABLE KEYS */;
INSERT INTO `tipocancha` VALUES (1,'Cancha Central','Fútbol'),(2,'Cancha Techada','Hockey'),(3,'Cancha de Tenis','Tenis'),(4,'Fútbol 5','Fútbol'),(5,'Fútbol 7','Fútbol'),(6,'Fútbol 11','Fútbol'),(7,'Tenis','Tenis'),(8,'Paddle','Paddle'),(9,'Básquet','Básquet');
/*!40000 ALTER TABLE `tipocancha` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `id_localidad` int NOT NULL,
  `dni` varchar(20) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `rol` enum('administrador','cliente') NOT NULL,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `uk_username` (`username`),
  UNIQUE KEY `uk_email` (`email`),
  KEY `id_localidad` (`id_localidad`),
  CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`id_localidad`) REFERENCES `localidad` (`id_localidad`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,1,'12345678','Martin','Palermo','cliente','cliente','$2b$10$zSSldITAmqI8mY.Kjg1Q5eJsfAoZIKfy3WF8MsBSb9dHm7T9pguIq','cliente@turnosport.com'),(2,2,'87654321','Juan','Perez','administrador','admin','$2b$10$7qsC4TYfV89WG2hXIjdnKO32IKo86Q9qRDQ.7MMt4viV0SG3jxtUm',NULL),(3,3,'11223344','Exequiel','Zeballos','cliente','cliente2','$2b$10$t87YGpInI10/Nhjx3thVc.tv7EZYtXWKGiqgp7/e1Oie7XyyFENDS','cliente2@turnosport.com'),(4,2,'43041113','Martina','Fernandez','administrador','martina','$2b$10$yipYKxTYhNkyvfeKhwqAKeTGob3zbXwMqeFNh9jzLPFJ4pZ/CJGd2','martina@gmail.com');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cancha`
--

DROP TABLE IF EXISTS `cancha`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cancha` (
  `id_cancha` int NOT NULL AUTO_INCREMENT,
  `id_tipo` int NOT NULL,
  `id_localidad` int NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `estado` varchar(50) NOT NULL,
  `precio_hora` decimal(10,2) DEFAULT NULL,
  `hora_apertura` time DEFAULT '08:00:00',
  `hora_cierre` time DEFAULT '22:00:00',
  PRIMARY KEY (`id_cancha`),
  KEY `id_tipo` (`id_tipo`),
  KEY `id_localidad` (`id_localidad`),
  CONSTRAINT `cancha_ibfk_1` FOREIGN KEY (`id_tipo`) REFERENCES `tipocancha` (`id_tipo`),
  CONSTRAINT `cancha_ibfk_2` FOREIGN KEY (`id_localidad`) REFERENCES `localidad` (`id_localidad`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cancha`
--

LOCK TABLES `cancha` WRITE;
/*!40000 ALTER TABLE `cancha` DISABLE KEYS */;
INSERT INTO `cancha` VALUES (5,1,1,'Cancha A - F5','disponible',NULL,'08:00:00','22:00:00'),(6,2,1,'Cancha B - F7','disponible',NULL,'08:00:00','22:00:00'),(7,3,1,'Cancha C - F11','disponible',NULL,'08:00:00','22:00:00'),(8,4,1,'Cancha D - Tenis','disponible',NULL,'08:00:00','22:00:00'),(9,5,1,'Cancha E - Paddle','mantenimiento',NULL,'08:00:00','22:00:00'),(10,1,2,'Cancha F - F5','disponible',NULL,'08:00:00','22:00:00'),(11,2,2,'Cancha G - F7','disponible',NULL,'08:00:00','22:00:00'),(12,4,2,'Cancha H - Tenis','disponible',NULL,'08:00:00','22:00:00'),(13,6,2,'Cancha I - Básquet','disponible',NULL,'08:00:00','22:00:00'),(14,1,3,'Cancha J - F5','disponible',NULL,'08:00:00','22:00:00'),(15,2,3,'Cancha K - F7','disponible',NULL,'08:00:00','22:00:00'),(16,3,3,'Cancha L - F11','disponible',NULL,'08:00:00','22:00:00');
/*!40000 ALTER TABLE `cancha` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reserva`
--

DROP TABLE IF EXISTS `reserva`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reserva` (
  `id_reserva` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `id_cancha` int NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  `fecha` date NOT NULL,
  `precio_total` decimal(10,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id_reserva`),
  KEY `fk_reserva_usuario` (`id_usuario`),
  KEY `fk_reserva_cancha` (`id_cancha`),
  CONSTRAINT `fk_reserva_cancha` FOREIGN KEY (`id_cancha`) REFERENCES `cancha` (`id_cancha`),
  CONSTRAINT `fk_reserva_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reserva`
--

LOCK TABLES `reserva` WRITE;
/*!40000 ALTER TABLE `reserva` DISABLE KEYS */;
INSERT INTO `reserva` VALUES (8,4,5,'11:00:00','12:00:00','2025-11-13',13500.00),(9,2,8,'16:53:00','17:53:00','2025-11-14',14500.00),(10,1,5,'14:00:00','16:00:00','2025-11-17',27000.00);
/*!40000 ALTER TABLE `reserva` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `servicio`
--

DROP TABLE IF EXISTS `servicio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `servicio` (
  `id_servicio` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `precio_servicio` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_servicio`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `servicio`
--

LOCK TABLES `servicio` WRITE;
/*!40000 ALTER TABLE `servicio` DISABLE KEYS */;
INSERT INTO `servicio` VALUES (9,'Estacionamiento',500.00),(10,'Seguridad',800.00),(11,'Filmacion de Partidos',1200.00),(12,'Alquiler de pecheras',600.00),(13,'Barra de bebidas',2000.00),(14,'Snack pack',1500.00),(15,'Entrenador personal',3000.00);
/*!40000 ALTER TABLE `servicio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reserva_servicio`
--

DROP TABLE IF EXISTS `reserva_servicio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reserva_servicio` (
  `id_reserva` int NOT NULL,
  `id_servicio` int NOT NULL,
  PRIMARY KEY (`id_reserva`,`id_servicio`),
  KEY `id_servicio` (`id_servicio`),
  CONSTRAINT `reserva_servicio_ibfk_1` FOREIGN KEY (`id_reserva`) REFERENCES `reserva` (`id_reserva`) ON DELETE CASCADE,
  CONSTRAINT `reserva_servicio_ibfk_2` FOREIGN KEY (`id_servicio`) REFERENCES `servicio` (`id_servicio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reserva_servicio`
--

LOCK TABLES `reserva_servicio` WRITE;
/*!40000 ALTER TABLE `reserva_servicio` DISABLE KEYS */;
INSERT INTO `reserva_servicio` VALUES (9,9),(9,10),(9,11),(8,14),(10,15);
/*!40000 ALTER TABLE `reserva_servicio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `precio`
--

DROP TABLE IF EXISTS `precio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `precio` (
  `id_precio` int NOT NULL AUTO_INCREMENT,
  `id_cancha` int NOT NULL,
  `valor_por_hora` decimal(10,2) NOT NULL,
  `fecha_vigencia` date NOT NULL,
  PRIMARY KEY (`id_precio`),
  KEY `id_cancha` (`id_cancha`),
  CONSTRAINT `precio_ibfk_1` FOREIGN KEY (`id_cancha`) REFERENCES `cancha` (`id_cancha`)
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `precio`
--

LOCK TABLES `precio` WRITE;
/*!40000 ALTER TABLE `precio` DISABLE KEYS */;
INSERT INTO `precio` VALUES (57,5,12000.00,'2025-11-13'),(58,6,12000.00,'2025-11-13'),(59,7,12000.00,'2025-11-13'),(60,8,12000.00,'2025-11-13'),(61,9,12000.00,'2025-11-13'),(62,10,12000.00,'2025-11-13');
/*!40000 ALTER TABLE `precio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pago`
--

DROP TABLE IF EXISTS `pago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pago` (
  `id_pago` int NOT NULL AUTO_INCREMENT,
  `id_reserva` int NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `estado` enum('pendiente','completado','fallido','reembolsado') DEFAULT 'pendiente',
  `metodo_pago` enum('tarjeta','efectivo','transferencia') DEFAULT 'tarjeta',
  `transaccion_id` varchar(100) DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_pago`),
  KEY `idx_reserva` (`id_reserva`),
  KEY `idx_estado` (`estado`),
  CONSTRAINT `pago_ibfk_1` FOREIGN KEY (`id_reserva`) REFERENCES `reserva` (`id_reserva`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pago`
--

LOCK TABLES `pago` WRITE;
/*!40000 ALTER TABLE `pago` DISABLE KEYS */;
/*!40000 ALTER TABLE `pago` ENABLE KEYS */;
UNLOCK TABLES;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-13  1:17:35

