-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 25, 2023 at 10:47 AM
-- Server version: 10.4.19-MariaDB
-- PHP Version: 8.0.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mango_price_dataset`
--

-- --------------------------------------------------------

--
-- Table structure for table `mango_name_list`
--

CREATE TABLE `mango_name_list` (
  `id` int(11) NOT NULL,
  `Mango_name` varchar(30) NOT NULL,
  `is_delete` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `mango_name_list`
--

INSERT INTO `mango_name_list` (`id`, `Mango_name`, `is_delete`) VALUES
(1, 'Amropolli', 1),
(2, 'Asina', 1),
(3, 'Fajli', 1),
(4, 'Gulabkhas', 1),
(5, 'Totapuri', 1),
(6, 'Gutthi', 1),
(7, 'Funia', 1),
(8, 'Khirsapoti', 1),
(9, 'Langra', 1),
(10, 'Lokhna', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_mango_price`
--

CREATE TABLE `tbl_mango_price` (
  `id` int(11) NOT NULL,
  `mango_name` varchar(50) NOT NULL,
  `district` varchar(30) NOT NULL,
  `date` varchar(30) NOT NULL,
  `price` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tbl_mango_price`
--

INSERT INTO `tbl_mango_price` (`id`, `mango_name`, `district`, `date`, `price`) VALUES
(1, 'Amropolli', 'Malda', '2023-05-18', 120),
(2, 'Asina', 'Malda', '2023-05-18', 100),
(3, 'Asina', 'Gazole', '2023-05-18', 200),
(4, 'Asina', 'Balurghat', '2023-05-19', 500),
(5, 'Asina', 'Kolkata', '2023-05-20', 300),
(6, 'Asina', 'Balgachia', '2023-05-21', 100),
(7, 'Asina', 'kathir', '2023-05-20', 235),
(9, 'Gulabkhas', 'Malda', '2023-05-17', 142),
(10, 'Gulabkhas', 'Malda', '2023-05-17', 142.5),
(15, 'Amropolli', 'Malda', '2023-05-16', 1234),
(16, 'Fajli', 'Malda', '2023-05-15', 250),
(18, 'Langra', 'Malda', '2023-05-17', 200),
(19, 'Langra	', 'Malda', '2023-07-19', 150),
(20, 'Langra', 'Kolkata', '2023-07-10', 300),
(21, 'Lokhna', 'Malda', '2023-07-19', 120),
(22, 'Lokhna', 'Malda', '2023-07-03', 500),
(23, 'Lokhna', 'Malda', '2023-07-14', 800),
(24, 'Lokhna', 'Malda', '2023-07-09', 130);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `mango_name_list`
--
ALTER TABLE `mango_name_list`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_mango_price`
--
ALTER TABLE `tbl_mango_price`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `mango_name_list`
--
ALTER TABLE `mango_name_list`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `tbl_mango_price`
--
ALTER TABLE `tbl_mango_price`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
