-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : jeu. 23 avr. 2026 à 21:03
-- Version du serveur : 8.3.0
-- Version de PHP : 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `carthago_db`
--

-- --------------------------------------------------------

--
-- Structure de la table `accounts_user`
--

DROP TABLE IF EXISTS `accounts_user`;
CREATE TABLE IF NOT EXISTS `accounts_user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  `role` varchar(20) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=MyISAM AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `accounts_user`
--

INSERT INTO `accounts_user` (`id`, `password`, `last_login`, `is_superuser`, `username`, `first_name`, `last_name`, `email`, `is_staff`, `is_active`, `date_joined`, `role`, `full_name`, `phone`) VALUES
(1, 'pbkdf2_sha256$1200000$8zjYryNmdw6H8oF2UjpKlp$N9i3pv1zv8u3dqsAm2UbaPHGomd7TrIBKPD/T1/fdVk=', '2026-04-10 22:22:18.904330', 1, 'salma', '', '', 'benchaouachasalma8@gmail.com', 1, 1, '2026-04-10 22:05:27.793850', 'user', '', NULL),
(2, 'pbkdf2_sha256$1200000$eJ5D3Q1u3lVFgqVygx8Lx2$gwDhAJh75VZpPD+HpZGcift+ejIujg9YHzLqbkEvDF4=', '2026-04-11 21:55:34.122866', 0, 'salmaa', '', '', 'salma@example.com', 0, 1, '2026-04-11 21:55:33.417844', 'user', 'Salma Ben Ali', '22111222'),
(3, 'pbkdf2_sha256$1200000$jaOHPnuzhbo43Lmntw8aaZ$Cta8jYW6bbGD2/NbTag8HE9MR86Wo7t4m3B47D5J54w=', NULL, 0, 'partner1', '', '', 'partner1@example.com', 0, 1, '2026-04-12 12:32:00.597610', 'partner', 'Partner Test', '22111222'),
(4, 'pbkdf2_sha256$1200000$AcAsb5XHMcoijsd2qyokTX$fZ75FXTonZ1hlg2NU248WsE6YIqiDwMHMi6xp8dLQHs=', NULL, 1, 'admin', '', '', 'admin@test.com', 1, 1, '2026-04-17 15:56:05.727476', 'admin', 'Admin User', '12345678'),
(5, 'pbkdf2_sha256$1200000$B3P6Mtr8AIWawBoS1JMiy3$MmcNCkrhF5E9GNCJGHrJ27LjVMai68xMBXG1GsttRDM=', NULL, 0, 'Salmaaa', '', '', 'benchaouachasalma8@gmail.com', 0, 1, '2026-04-18 21:19:19.488809', 'user', 'Ben chaouacha', '99999955'),
(6, 'pbkdf2_sha256$1200000$V16WGwcI9JpYl5RANTyS48$p2cEDLzSsLyfIE6jmqodKe+E1CIS0Za+XvUh5OrFPMY=', NULL, 0, 'sarra', '', '', 'benchaouachasalma2002@gmail.com', 0, 1, '2026-04-18 21:21:45.195583', 'user', 'sarra', '56565656'),
(7, 'pbkdf2_sha256$1200000$1pG80NB32qQQX9EvUKClEQ$E7yjft7h2SYH3VDs7G5yn/C0dPg+874AWXXDHyWG3K0=', NULL, 0, 'ali', '', '', 'ali@gmail.com', 0, 1, '2026-04-18 21:28:32.718557', 'partner', 'ali', '999573730'),
(10, 'pass', '2026-04-19 15:34:25.000000', 1, 'admin2', 'Admin', 'System', 'admin@carthago.com', 1, 1, '2026-04-19 15:34:25.000000', 'admin', 'Admin System', '20000000'),
(11, 'pass', '2026-04-19 15:34:25.000000', 0, 'client1', 'Ahmed', 'Ben Salah', 'ahmed@gmail.com', 0, 1, '2026-04-19 15:34:25.000000', 'user', 'Ahmed Ben Salah', '22111111'),
(12, 'pass', '2026-04-19 15:34:25.000000', 0, 'client2', 'Ines', 'Trabelsi', 'ines@gmail.com', 0, 1, '2026-04-19 15:34:25.000000', 'user', 'Ines Trabelsi', '22222222'),
(13, 'pass', '2026-04-19 15:34:25.000000', 0, 'partner_new', 'Karim', 'Gharbi', 'karim@gmail.com', 0, 1, '2026-04-19 15:34:25.000000', 'partner', 'Karim Gharbi', '23333333'),
(20, 'pass', NULL, 0, 'partner_restau', '', '', '', 0, 1, '2026-04-19 15:36:10.000000', 'partner', 'Restaurant Owner', NULL),
(21, 'pass', NULL, 0, 'partner_house', '', '', '', 0, 1, '2026-04-19 15:36:10.000000', 'partner', 'Guest House Owner', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `accounts_user_groups`
--

DROP TABLE IF EXISTS `accounts_user_groups`;
CREATE TABLE IF NOT EXISTS `accounts_user_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `accounts_user_groups_user_id_group_id_59c0b32f_uniq` (`user_id`,`group_id`),
  KEY `accounts_user_groups_user_id_52b62117` (`user_id`),
  KEY `accounts_user_groups_group_id_bd11a704` (`group_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `accounts_user_user_permissions`
--

DROP TABLE IF EXISTS `accounts_user_user_permissions`;
CREATE TABLE IF NOT EXISTS `accounts_user_user_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `accounts_user_user_permi_user_id_permission_id_2ab516c2_uniq` (`user_id`,`permission_id`),
  KEY `accounts_user_user_permissions_user_id_e4f0a161` (`user_id`),
  KEY `accounts_user_user_permissions_permission_id_113bb443` (`permission_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
CREATE TABLE IF NOT EXISTS `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
CREATE TABLE IF NOT EXISTS `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissions_group_id_b120cbf9` (`group_id`),
  KEY `auth_group_permissions_permission_id_84c5c92e` (`permission_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
CREATE TABLE IF NOT EXISTS `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  KEY `auth_permission_content_type_id_2f476e4b` (`content_type_id`)
) ENGINE=MyISAM AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `auth_permission`
--

INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES
(1, 'Can add log entry', 1, 'add_logentry'),
(2, 'Can change log entry', 1, 'change_logentry'),
(3, 'Can delete log entry', 1, 'delete_logentry'),
(4, 'Can view log entry', 1, 'view_logentry'),
(5, 'Can add permission', 3, 'add_permission'),
(6, 'Can change permission', 3, 'change_permission'),
(7, 'Can delete permission', 3, 'delete_permission'),
(8, 'Can view permission', 3, 'view_permission'),
(9, 'Can add group', 2, 'add_group'),
(10, 'Can change group', 2, 'change_group'),
(11, 'Can delete group', 2, 'delete_group'),
(12, 'Can view group', 2, 'view_group'),
(13, 'Can add content type', 4, 'add_contenttype'),
(14, 'Can change content type', 4, 'change_contenttype'),
(15, 'Can delete content type', 4, 'delete_contenttype'),
(16, 'Can view content type', 4, 'view_contenttype'),
(17, 'Can add session', 5, 'add_session'),
(18, 'Can change session', 5, 'change_session'),
(19, 'Can delete session', 5, 'delete_session'),
(20, 'Can view session', 5, 'view_session'),
(21, 'Can add user', 6, 'add_user'),
(22, 'Can change user', 6, 'change_user'),
(23, 'Can delete user', 6, 'delete_user'),
(24, 'Can view user', 6, 'view_user'),
(25, 'Can add region', 7, 'add_region'),
(26, 'Can change region', 7, 'change_region'),
(27, 'Can delete region', 7, 'delete_region'),
(28, 'Can view region', 7, 'view_region'),
(29, 'Can add partner profile', 8, 'add_partnerprofile'),
(30, 'Can change partner profile', 8, 'change_partnerprofile'),
(31, 'Can delete partner profile', 8, 'delete_partnerprofile'),
(32, 'Can view partner profile', 8, 'view_partnerprofile'),
(33, 'Can add service', 9, 'add_service'),
(34, 'Can change service', 9, 'change_service'),
(35, 'Can delete service', 9, 'delete_service'),
(36, 'Can view service', 9, 'view_service'),
(37, 'Can add service category', 10, 'add_servicecategory'),
(38, 'Can change service category', 10, 'change_servicecategory'),
(39, 'Can delete service category', 10, 'delete_servicecategory'),
(40, 'Can view service category', 10, 'view_servicecategory'),
(41, 'Can add product category', 12, 'add_productcategory'),
(42, 'Can change product category', 12, 'change_productcategory'),
(43, 'Can delete product category', 12, 'delete_productcategory'),
(44, 'Can view product category', 12, 'view_productcategory'),
(45, 'Can add product', 11, 'add_product'),
(46, 'Can change product', 11, 'change_product'),
(47, 'Can delete product', 11, 'delete_product'),
(48, 'Can view product', 11, 'view_product'),
(49, 'Can add review', 13, 'add_review'),
(50, 'Can change review', 13, 'change_review'),
(51, 'Can delete review', 13, 'delete_review'),
(52, 'Can view review', 13, 'view_review'),
(53, 'Can add booking', 14, 'add_booking'),
(54, 'Can change booking', 14, 'change_booking'),
(55, 'Can delete booking', 14, 'delete_booking'),
(56, 'Can view booking', 14, 'view_booking'),
(57, 'Can add order item', 16, 'add_orderitem'),
(58, 'Can change order item', 16, 'change_orderitem'),
(59, 'Can delete order item', 16, 'delete_orderitem'),
(60, 'Can view order item', 16, 'view_orderitem'),
(61, 'Can add order', 15, 'add_order'),
(62, 'Can change order', 15, 'change_order'),
(63, 'Can delete order', 15, 'delete_order'),
(64, 'Can view order', 15, 'view_order');

-- --------------------------------------------------------

--
-- Structure de la table `bookings_booking`
--

DROP TABLE IF EXISTS `bookings_booking`;
CREATE TABLE IF NOT EXISTS `bookings_booking` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `booking_date` date NOT NULL,
  `guests` int UNSIGNED NOT NULL,
  `status` varchar(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `service_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `bookings_booking_service_id_8d3eedd5` (`service_id`),
  KEY `bookings_booking_user_id_834dfc23` (`user_id`)
) ;

--
-- Déchargement des données de la table `bookings_booking`
--

INSERT INTO `bookings_booking` (`id`, `booking_date`, `guests`, `status`, `created_at`, `service_id`, `user_id`) VALUES
(1, '2026-04-20', 2, 'pending', '2026-04-11 21:04:22.748686', 1, 1),
(2, '2026-04-20', 2, 'pending', '2026-04-12 10:24:37.094607', 1, 2);

-- --------------------------------------------------------

--
-- Structure de la table `catalog_service`
--

DROP TABLE IF EXISTS `catalog_service`;
CREATE TABLE IF NOT EXISTS `catalog_service` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `address` varchar(255) NOT NULL,
  `latitude` decimal(9,6) DEFAULT NULL,
  `longitude` decimal(9,6) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `partner_id` bigint NOT NULL,
  `region_id` bigint DEFAULT NULL,
  `category_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `catalog_service_partner_id_2e76b486` (`partner_id`),
  KEY `catalog_service_region_id_58debd17` (`region_id`),
  KEY `catalog_service_category_id_f7c3a02d` (`category_id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `catalog_service`
--

INSERT INTO `catalog_service` (`id`, `title`, `description`, `price`, `address`, `latitude`, `longitude`, `is_active`, `created_at`, `partner_id`, `region_id`, `category_id`) VALUES
(1, 'jjj', 'jjj', 5.00, '13 rue grand Maghreb Kssibet Sousse', NULL, NULL, 0, '2026-04-10 23:17:06.275458', 1, 1, 1),
(2, 'Dar Tradition Sidi Bou Said', 'Maison d’hôte avec vue sur mer', 180.00, 'Sidi Bou Said, Tunis', 36.871000, 10.341000, 1, '2026-04-12 12:44:26.625672', 2, 1, 1);

-- --------------------------------------------------------

--
-- Structure de la table `catalog_servicecategory`
--

DROP TABLE IF EXISTS `catalog_servicecategory`;
CREATE TABLE IF NOT EXISTS `catalog_servicecategory` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(120) NOT NULL,
  `slug` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `catalog_servicecategory`
--

INSERT INTO `catalog_servicecategory` (`id`, `name`, `slug`) VALUES
(1, 'restau', 'restau');

-- --------------------------------------------------------

--
-- Structure de la table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
CREATE TABLE IF NOT EXISTS `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint UNSIGNED NOT NULL,
  `change_message` longtext NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6` (`user_id`)
) ;

--
-- Déchargement des données de la table `django_admin_log`
--

INSERT INTO `django_admin_log` (`id`, `action_time`, `object_id`, `object_repr`, `action_flag`, `change_message`, `content_type_id`, `user_id`) VALUES
(1, '2026-04-10 22:57:44.871000', '1', 'jerba', 1, '[{\"added\": {}}]', 7, 1),
(2, '2026-04-10 23:16:15.216788', '1', 'hhh', 1, '[{\"added\": {}}]', 8, 1),
(3, '2026-04-10 23:16:51.898077', '1', 'restau', 1, '[{\"added\": {}}]', 10, 1),
(4, '2026-04-10 23:17:06.278465', '1', 'jjj', 1, '[{\"added\": {}}]', 9, 1),
(5, '2026-04-10 23:18:47.491659', '1', 'tapis', 1, '[{\"added\": {}}]', 12, 1),
(6, '2026-04-10 23:18:51.545318', '1', 'Salma Ben chaouacha', 1, '[{\"added\": {}}]', 11, 1);

-- --------------------------------------------------------

--
-- Structure de la table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
CREATE TABLE IF NOT EXISTS `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `django_content_type`
--

INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES
(1, 'admin', 'logentry'),
(2, 'auth', 'group'),
(3, 'auth', 'permission'),
(4, 'contenttypes', 'contenttype'),
(5, 'sessions', 'session'),
(6, 'accounts', 'user'),
(7, 'locations', 'region'),
(8, 'partners', 'partnerprofile'),
(9, 'catalog', 'service'),
(10, 'catalog', 'servicecategory'),
(11, 'marketplace', 'product'),
(12, 'marketplace', 'productcategory'),
(13, 'reviews', 'review'),
(14, 'bookings', 'booking'),
(15, 'orders', 'order'),
(16, 'orders', 'orderitem');

-- --------------------------------------------------------

--
-- Structure de la table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
CREATE TABLE IF NOT EXISTS `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `django_migrations`
--

INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES
(1, 'contenttypes', '0001_initial', '2026-04-10 21:59:45.125854'),
(2, 'contenttypes', '0002_remove_content_type_name', '2026-04-10 21:59:45.208624'),
(3, 'auth', '0001_initial', '2026-04-10 21:59:45.541484'),
(4, 'auth', '0002_alter_permission_name_max_length', '2026-04-10 21:59:45.590112'),
(5, 'auth', '0003_alter_user_email_max_length', '2026-04-10 21:59:45.596995'),
(6, 'auth', '0004_alter_user_username_opts', '2026-04-10 21:59:45.603347'),
(7, 'auth', '0005_alter_user_last_login_null', '2026-04-10 21:59:45.608335'),
(8, 'auth', '0006_require_contenttypes_0002', '2026-04-10 21:59:45.611353'),
(9, 'auth', '0007_alter_validators_add_error_messages', '2026-04-10 21:59:45.619317'),
(10, 'auth', '0008_alter_user_username_max_length', '2026-04-10 21:59:45.626325'),
(11, 'auth', '0009_alter_user_last_name_max_length', '2026-04-10 21:59:45.634096'),
(12, 'auth', '0010_alter_group_name_max_length', '2026-04-10 21:59:45.674866'),
(13, 'auth', '0011_update_proxy_permissions', '2026-04-10 21:59:45.681242'),
(14, 'auth', '0012_alter_user_first_name_max_length', '2026-04-10 21:59:45.686711'),
(15, 'accounts', '0001_initial', '2026-04-10 21:59:46.037340'),
(16, 'admin', '0001_initial', '2026-04-10 21:59:46.269434'),
(17, 'admin', '0002_logentry_remove_auto_add', '2026-04-10 21:59:46.278499'),
(18, 'admin', '0003_logentry_add_action_flag_choices', '2026-04-10 21:59:46.286295'),
(19, 'sessions', '0001_initial', '2026-04-10 21:59:46.338608'),
(20, 'locations', '0001_initial', '2026-04-10 22:15:46.196329'),
(21, 'partners', '0001_initial', '2026-04-10 22:15:46.322614'),
(22, 'catalog', '0001_initial', '2026-04-10 22:21:27.550265'),
(23, 'marketplace', '0001_initial', '2026-04-10 22:23:49.577250'),
(24, 'reviews', '0001_initial', '2026-04-10 22:27:20.672294'),
(25, 'bookings', '0001_initial', '2026-04-10 22:29:17.316563'),
(26, 'orders', '0001_initial', '2026-04-10 22:36:21.281036'),
(27, 'locations', '0002_region_activities_region_specialties', '2026-04-21 12:45:00.286658'),
(28, 'locations', '0003_alter_region_image', '2026-04-21 13:30:25.686633'),
(29, 'marketplace', '0002_product_external_image', '2026-04-22 14:47:34.374429'),
(30, 'marketplace', '0003_remove_product_external_image_alter_product_image', '2026-04-22 15:01:19.376153');

-- --------------------------------------------------------

--
-- Structure de la table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
CREATE TABLE IF NOT EXISTS `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `django_session`
--

INSERT INTO `django_session` (`session_key`, `session_data`, `expire_date`) VALUES
('n07ey4508pkdpg1guhbf5rbg12wvurjw', '.eJxVjMsOwiAQRf-FtSG8ZMCl-34DGWCQqoGktCvjv2uTLnR7zzn3xQJuaw3boCXMmV2YZKffLWJ6UNtBvmO7dZ56W5c58l3hBx186pme18P9O6g46rc-WxuJUgIoaDQkwJicKNpbB0U5BdaIQiTRR-lRGB9BWZBFoS-WNLL3B_OFOBo:1wBKF0:DhOxUVUzfMCQbqufVW8s6KDo1H_lQdh_xy9xlRnyxjI', '2026-04-24 22:22:18.920814'),
('5nnrc9chellfaqb70gw894yl84b43uwa', '.eJxVjEsOAiEQBe_C2pAGBGmX7j0DaT4towaSYWZlvLtOMgvdvqp6LxFoXWpYR5nDlMVZaHH43SKlR2kbyHdqty5Tb8s8RbkpcqdDXnsuz8vu_h1UGvVbe8xYosvMDpJHBSdv1FEzW2WM076QRguMEK0C4AjWeEBCk9EioxLvD8tXNss:1wBgIg:BCOXLMwBCh38X9qD99vE92YCAz0cOs6s9GscKqrtyFs', '2026-04-25 21:55:34.130262');

-- --------------------------------------------------------

--
-- Structure de la table `locations_region`
--

DROP TABLE IF EXISTS `locations_region`;
CREATE TABLE IF NOT EXISTS `locations_region` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(120) NOT NULL,
  `slug` varchar(50) NOT NULL,
  `description` longtext NOT NULL,
  `image` varchar(200) DEFAULT NULL,
  `activities` json NOT NULL DEFAULT (_utf8mb4'[]'),
  `specialties` json NOT NULL DEFAULT (_utf8mb4'[]'),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `locations_region`
--

INSERT INTO `locations_region` (`id`, `name`, `slug`, `description`, `image`, `activities`, `specialties`) VALUES
(1, 'jerba', 'jerba', 'plages ...', 'https://images.pexels.com/photos/6798520/pexels-photo-6798520.jpeg', '[]', '[]');

-- --------------------------------------------------------

--
-- Structure de la table `marketplace_product`
--

DROP TABLE IF EXISTS `marketplace_product`;
CREATE TABLE IF NOT EXISTS `marketplace_product` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int UNSIGNED NOT NULL,
  `image` varchar(200) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `partner_id` bigint NOT NULL,
  `region_id` bigint DEFAULT NULL,
  `category_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `marketplace_product_partner_id_ac3deabf` (`partner_id`),
  KEY `marketplace_product_region_id_7c3d8ef3` (`region_id`),
  KEY `marketplace_product_category_id_2f8b8b50` (`category_id`)
) ;

--
-- Déchargement des données de la table `marketplace_product`
--

INSERT INTO `marketplace_product` (`id`, `name`, `description`, `price`, `stock`, `image`, `is_active`, `created_at`, `partner_id`, `region_id`, `category_id`) VALUES
(1, 'Salma Ben chaouacha', 'nkklk', 55.00, 60, 'https://images.pexels.com/photos/32412845/pexels-photo-32412845.jpeg', 0, '2026-04-10 23:18:51.543298', 1, 1, 1),
(2, 'Poterie de Nabeul', 'Pièce artisanale traditionnelle', 45.00, 10, '', 1, '2026-04-12 12:54:24.646674', 2, 1, 1);

-- --------------------------------------------------------

--
-- Structure de la table `marketplace_productcategory`
--

DROP TABLE IF EXISTS `marketplace_productcategory`;
CREATE TABLE IF NOT EXISTS `marketplace_productcategory` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(120) NOT NULL,
  `slug` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `marketplace_productcategory`
--

INSERT INTO `marketplace_productcategory` (`id`, `name`, `slug`) VALUES
(1, 'tapis', 'tapis');

-- --------------------------------------------------------

--
-- Structure de la table `orders_order`
--

DROP TABLE IF EXISTS `orders_order`;
CREATE TABLE IF NOT EXISTS `orders_order` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `total_amount` decimal(12,2) NOT NULL,
  `status` varchar(20) NOT NULL,
  `shipping_address` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `orders_order_user_id_e9b59eb1` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `orders_order`
--

INSERT INTO `orders_order` (`id`, `total_amount`, `status`, `shipping_address`, `created_at`, `user_id`) VALUES
(1, 0.00, 'pending', 'Tunis, La Marsa', '2026-04-11 21:12:39.665794', 1),
(2, 110.00, 'pending', 'Tunis, La Marsa', '2026-04-12 10:31:38.446991', 2),
(3, 110.00, 'pending', 'Tunis, La Marsa', '2026-04-12 10:31:42.634904', 2),
(4, 110.00, 'pending', 'Tunis, La Marsa', '2026-04-12 10:31:43.842235', 2),
(5, 110.00, 'pending', '13rue maghreb', '2026-04-22 13:44:17.152342', 6),
(6, 165.00, 'pending', '15lljhg', '2026-04-22 15:06:14.575057', 6);

-- --------------------------------------------------------

--
-- Structure de la table `orders_orderitem`
--

DROP TABLE IF EXISTS `orders_orderitem`;
CREATE TABLE IF NOT EXISTS `orders_orderitem` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `quantity` int UNSIGNED NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `order_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `orders_orderitem_order_id_fe61a34d` (`order_id`),
  KEY `orders_orderitem_product_id_afe4254a` (`product_id`)
) ;

--
-- Déchargement des données de la table `orders_orderitem`
--

INSERT INTO `orders_orderitem` (`id`, `quantity`, `unit_price`, `order_id`, `product_id`) VALUES
(1, 2, 55.00, 1, 1),
(2, 2, 55.00, 2, 1),
(3, 2, 55.00, 3, 1),
(4, 2, 55.00, 4, 1),
(5, 2, 55.00, 5, 1),
(6, 3, 55.00, 6, 1);

-- --------------------------------------------------------

--
-- Structure de la table `partners_partnerprofile`
--

DROP TABLE IF EXISTS `partners_partnerprofile`;
CREATE TABLE IF NOT EXISTS `partners_partnerprofile` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `business_name` varchar(255) NOT NULL,
  `activity_type` varchar(30) NOT NULL,
  `description` longtext NOT NULL,
  `address` varchar(255) NOT NULL,
  `latitude` decimal(9,6) DEFAULT NULL,
  `longitude` decimal(9,6) DEFAULT NULL,
  `is_verified` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `region_id` bigint DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `partners_partnerprofile_region_id_62eb1d8c` (`region_id`)
) ENGINE=MyISAM AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `partners_partnerprofile`
--

INSERT INTO `partners_partnerprofile` (`id`, `business_name`, `activity_type`, `description`, `address`, `latitude`, `longitude`, `is_verified`, `created_at`, `region_id`, `user_id`) VALUES
(1, 'hhh', 'restaurant', 'rrrrrr', 'rrrr', NULL, NULL, 0, '2026-04-10 23:16:15.212789', 1, 1),
(2, 'Dar Tradition', 'guest_house', 'Maison d’hôte traditionnelle', 'Sidi Bou Said, Tunis', 36.870000, 10.340000, 0, '2026-04-12 12:32:01.268257', 1, 3),
(3, 'restau baraka', 'restaurant', 'sdfghjkl', 'sousse', NULL, NULL, 0, '2026-04-18 21:28:33.683415', NULL, 7),
(10, 'Dar Sousse', 'guest_house', 'Maison d’hôte moderne avec piscine', 'Sousse', NULL, NULL, 1, '2026-04-19 15:34:25.000000', 1, 13),
(20, 'Restaurant Medina', 'restaurant', 'Cuisine tunisienne', 'Sousse', NULL, NULL, 1, '2026-04-19 15:36:10.000000', 1, 20),
(21, 'Dar Sousse', 'guest_house', 'Maison d’hôte', 'Sousse', NULL, NULL, 1, '2026-04-19 15:36:10.000000', 1, 21);

-- --------------------------------------------------------

--
-- Structure de la table `reviews_review`
--

DROP TABLE IF EXISTS `reviews_review`;
CREATE TABLE IF NOT EXISTS `reviews_review` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `rating` smallint UNSIGNED NOT NULL,
  `comment` longtext NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `product_id` bigint DEFAULT NULL,
  `service_id` bigint DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `reviews_review_product_id_ce2fa4c6` (`product_id`),
  KEY `reviews_review_service_id_8aaf292d` (`service_id`),
  KEY `reviews_review_user_id_875caff2` (`user_id`)
) ;

--
-- Déchargement des données de la table `reviews_review`
--

INSERT INTO `reviews_review` (`id`, `rating`, `comment`, `created_at`, `product_id`, `service_id`, `user_id`) VALUES
(1, 5, 'Très belle expérience.', '2026-04-11 21:08:05.402522', NULL, 1, 1),
(2, 4, 'Produit artisanal de bonne qualité.', '2026-04-12 10:38:26.057006', 1, NULL, 2);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
