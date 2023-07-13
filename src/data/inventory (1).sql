-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 13, 2023 at 07:49 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `inventory`
--

-- --------------------------------------------------------

--
-- Table structure for table `employee`
--

CREATE TABLE `employee` (
  `employee_id` varchar(255) NOT NULL,
  `name` varchar(70) NOT NULL,
  `username` varchar(70) NOT NULL,
  `password` varchar(70) NOT NULL,
  `contact_no` varchar(15) NOT NULL,
  `position` varchar(70) NOT NULL,
  `img_src` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee`
--

INSERT INTO `employee` (`employee_id`, `name`, `username`, `password`, `contact_no`, `position`, `img_src`) VALUES
('29bda91f-ec47-4116-a98d-4680cf3c338a', 'Cedric Nigga', 'cedric@gmail.com', '$2b$10$blZsbqwbBy3ymzFcrJU6mOwTUh8uAJK6OMVq7Eh6ORPwqgyS0Srkq', '0982733224', 'employee', 'https://upcdn.io/W142hJk/raw/demo/4mKQ47NuHz.png'),
('2f711073-070a-4fc5-a305-f340a5493359', 'Mark Barnido', 'mark@gmail.com', '$2b$10$J9ZY7w3P6b0fbj1XQ86SneWreXqQHNPjSgVxh3RnEwFdlbmQd7OHu', '0696969699', 'employee', 'https://upcdn.io/W142hJk/raw/demo/4mKQFKjzAL.jpg'),
('3b07133e-c992-46f0-bc5e-5720700bd362', 'tin tin', 'tin@gmail.com', '$2b$10$vf1pi1qFI1/JKSTmg5PxJehaZn/fr4IhKDYAlruZrxMbU1DLTeHca', '09587654986', 'employee', 'https://avatars.githubusercontent.com/u/10021'),
('4b56cda8-cf4f-42e8-ba7d-7c67c90573a1', 'Ervin Pangilinan', 'ervin2002', '$2b$10$3IenC9nEcjzH/2otAD8alujCzn8vdr7zoa6LljSpQsDh9ftpPyxX2', '9645611441', 'owner', 'https://avatars.githubusercontent.com/u/10021'),
('646bb411-4040-4ef9-aa62-bd3e1d79ef05', 'Vin Pangilinan', 'vinvin@gmail.com', '$2b$10$FESISE.LAd/HMuOq4atWTeMi5paVT4qhNf6.GfePotbA.Tv0poKYS', '09458761057', 'employee', 'https://avatars.githubusercontent.com/u/10021'),
('7136c708-54cb-47fb-a269-bb1973810c2c', 'Lue Nigga', 'lue@gmail.com', '$2b$10$.9TOBpCzeaCbZYDVIytX7OwwF2S/adpcWqRLCK1WxnNsYGx5MeOVa', '974824903', 'guest', 'https://avatars.githubusercontent.com/u/10021'),
('9abff3d2-f103-4482-b2d1-8fe0c6752039', 'Anton Sales', 'antonsales@gmail.com', '$2b$10$2sfXYFkrgZx5VLHfrN6ky.gy.50rOG.5oHBfVNh87yubM/dwjMn7a', '09897645808', 'employee', 'https://avatars.githubusercontent.com/u/40146734'),
('c542a16f-a68e-48ab-9adc-f60fe7cb91cc', 'ella rojas', 'ella@gmail.com', '$2b$10$WidSVhDH3ERADDXkJA0vEeGiBSKrzcJWvM/6ATkL5IVOLIpaSrP/a', '09458761058', 'admin', 'https://avatars.githubusercontent.com/u/10021'),
('ed6ed32b-1bcf-4419-a4f9-9d3d11ab5ee4', 'Lorena Ayap', 'lorenaayap@gmail.com', '$2b$10$zqkepAupMxzqiJ92jfqn7ebeqgJ1boz/vIoxAY2mAy3IFcGVxGAAy', '09497824903', 'admin', 'https://avatars.githubusercontent.com/u/26884717'),
('f186ac23-a968-47cf-b6ae-c0c4d3a6dd04', 'Sunshine', 'sunshine@gmail.com', '$2b$10$MZImlXsI1unjb9I8E/.YfuQ5HT4HUtzDX0rUFqMQSAyjgBGhtzHBi', '09423647232', 'guest', 'https://avatars.githubusercontent.com/u/60054411'),
('fad3e6c6-b161-474e-ae3c-82b98709e3db', 'Employee Sample', 'employees@gmail.com', '$2b$10$ww2lWhUB4aq4PvYUcib3T.8EKVaMfQ6BYkVvyDpmyYuxYfWFd0BGq', '0616123123', 'employee', 'https://avatars.githubusercontent.com/u/10021');

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `product_id` varchar(255) NOT NULL,
  `name` varchar(70) NOT NULL,
  `price` float NOT NULL,
  `brand` varchar(70) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`product_id`, `name`, `price`, `brand`) VALUES
('004564ab-997b-4b0e-98cf-7942c554d1ea', 'Macademia', 99, 'Lotte'),
('13259b5c-1932-488e-b1a0-9e40aa6dcf2b', 'Toblerone Original 100g', 150, 'Toblerone '),
('190d019f-5550-4c68-8ea2-b0d08bc1859e', 'Toblerone Dark Chocolate 100g', 160, 'Toblerone '),
('1ee17a4a-ddf2-469e-9174-ef5840524c86', 'Pocky', 40, 'Nestle'),
('220cb994-0a65-4b51-8e3e-442a115e1243', 'kitkat', 40, 'nestle'),
('87457afa-7dc2-4524-a255-2763b403ad04', 'Ferrero Rocher (24pcs)', 800, 'Ferrero'),
('ac0c4b6e-6cbe-44fc-b3b0-ed638952c0dd', 'Ghana', 65, 'Meiji'),
('cb26d4fc-3b57-486a-9fd7-5a78262d1a14', 'CHOCO CHOCO', 20, 'nestle'),
('d06936e1-f831-4c53-aa38-ee071a6c98ba', 'asong nigga', 1000, 'china'),
('e5913f12-2a1a-44ce-b70a-e9332f6e43ae', 'ABC', 80, 'Meiji'),
('e7de6359-3220-4919-b9f0-a1151bd7650f', 'Almonds', 100, 'Lotte');

-- --------------------------------------------------------

--
-- Table structure for table `sales`
--

CREATE TABLE `sales` (
  `sales_id` varchar(255) NOT NULL,
  `product_id` varchar(255) NOT NULL,
  `total_price` float NOT NULL,
  `sales_date` date DEFAULT curdate()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sales`
--

INSERT INTO `sales` (`sales_id`, `product_id`, `total_price`, `sales_date`) VALUES
('12af247e-b968-4ddb-9904-fa07cdd9c87b', '190d019f-5550-4c68-8ea2-b0d08bc1859e', 4000, '2023-02-14'),
('19ece21c-6f18-42d6-9f89-13164ef2e5f1', 'e5913f12-2a1a-44ce-b70a-e9332f6e43ae', 240, '2023-07-12'),
('23ee1d18-bab1-4b28-a957-4891eda7199e', 'ac0c4b6e-6cbe-44fc-b3b0-ed638952c0dd', 8200, '2023-05-10'),
('255d9437-d0e0-4941-b105-5ca0e35b75f6', '87457afa-7dc2-4524-a255-2763b403ad04', 1600, '2023-07-12'),
('2f1587e5-cb05-4e1e-a9df-97072f773bb6', '1ee17a4a-ddf2-469e-9174-ef5840524c86', 7900, '2023-04-14'),
('9c8db787-59e4-4c36-b1dd-19df439d304d', '220cb994-0a65-4b51-8e3e-442a115e1243', 5000, '2023-03-22'),
('9faf6c2c-73e3-423a-8806-eb27fc2b3142', 'e7de6359-3220-4919-b9f0-a1151bd7650f', 700, '2023-07-11'),
('a3056887-95f1-43d7-af64-162f2ed037d5', '1ee17a4a-ddf2-469e-9174-ef5840524c86', 6000, '2023-02-14'),
('bfb0eb6d-1209-4b50-a9db-a9b18c4cc240', '220cb994-0a65-4b51-8e3e-442a115e1243', 7400, '2023-07-10'),
('cdd75851-a60e-4dc5-bcc1-725ae1ad5802', '13259b5c-1932-488e-b1a0-9e40aa6dcf2b', 5500, '2023-03-15'),
('d6552e62-89e0-4434-8e68-3ab5d645c258', '004564ab-997b-4b0e-98cf-7942c554d1ea', 4000, '2023-06-06'),
('d8bfb123-1bf1-4b4c-ad73-53d60c16ce45', '13259b5c-1932-488e-b1a0-9e40aa6dcf2b', 4000, '2023-02-09'),
('f39d8fc1-4b83-4674-9b92-3a418f5342d6', '87457afa-7dc2-4524-a255-2763b403ad04', 2500, '2023-02-10');

-- --------------------------------------------------------

--
-- Table structure for table `stock`
--

CREATE TABLE `stock` (
  `stock_id` varchar(255) NOT NULL,
  `product_id` varchar(255) NOT NULL,
  `quantity` int(100) NOT NULL,
  `production_date` date DEFAULT curdate(),
  `expiration_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stock`
--

INSERT INTO `stock` (`stock_id`, `product_id`, `quantity`, `production_date`, `expiration_date`) VALUES
('11868101-66d3-47a2-8eae-52cf28664164', '004564ab-997b-4b0e-98cf-7942c554d1ea', 20, '2023-06-29', '2027-02-23'),
('16e17a72-36c8-4223-bdd1-ca60d0e239c9', 'ac0c4b6e-6cbe-44fc-b3b0-ed638952c0dd', 20, '2023-06-10', '2024-07-10'),
('1fcef574-895d-44bc-9523-29d312b13ac6', 'd06936e1-f831-4c53-aa38-ee071a6c98ba', 2, '2023-07-11', '2023-07-31'),
('4b41c425-9169-4d2f-96f6-2ec3b2faebdb', '1ee17a4a-ddf2-469e-9174-ef5840524c86', 30, '2023-07-10', '2025-08-10'),
('55439fff-e026-49c4-b5f3-5a78f99bc7f7', '87457afa-7dc2-4524-a255-2763b403ad04', 10, '2023-07-10', '2025-10-13'),
('b6158d16-51ff-4231-b912-a128f714eeb7', '220cb994-0a65-4b51-8e3e-442a115e1243', 4, '2023-07-01', '2025-11-12'),
('cb2c7d94-6cd1-43be-ad6c-246bfeb7e601', 'e7de6359-3220-4919-b9f0-a1151bd7650f', 5, '2023-07-13', '2025-11-13'),
('def67965-4774-4b54-86c5-553adf36f324', 'e5913f12-2a1a-44ce-b70a-e9332f6e43ae', 20, '2023-07-11', '2026-06-24');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `employee`
--
ALTER TABLE `employee`
  ADD PRIMARY KEY (`employee_id`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`product_id`);

--
-- Indexes for table `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`sales_id`),
  ADD KEY `product_sale` (`product_id`);

--
-- Indexes for table `stock`
--
ALTER TABLE `stock`
  ADD PRIMARY KEY (`stock_id`),
  ADD KEY `product_stock` (`product_id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `sales`
--
ALTER TABLE `sales`
  ADD CONSTRAINT `product_sale` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sales_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`);

--
-- Constraints for table `stock`
--
ALTER TABLE `stock`
  ADD CONSTRAINT `product_stock` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
