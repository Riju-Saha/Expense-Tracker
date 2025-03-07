
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(10) NOT NULL,
  `otp` int(6) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;


INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `otp`, `created_at`) VALUES
(2, 'qwe', 'soumyajitsaha972@gmail.com', 'qwe', '1234567890', 281516, '2025-02-04 08:31:39'),
(3, 'Riju', 'sahasoumyajit21@gmail.com', 'qwe', '3216549870', NULL, '2025-02-19 06:38:28');


CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `type` enum('credit','debit') NOT NULL,
  `title` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `status` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;


INSERT INTO `transactions` (`id`, `user_id`, `user_name`, `amount`, `type`, `title`, `date`, `time`, `status`) VALUES
  (11, 2, 'qwe', 999.00, 'credit', 'fees', '2025-02-07', '20:54:00', 'Partially Paid'),
  (21, 2, 'qwe', 234.00, 'debit', 'dfsdf', '2025-02-19', '09:33:57', 'Paid');


COMMIT;