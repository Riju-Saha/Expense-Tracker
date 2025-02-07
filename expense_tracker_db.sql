-- Database: `expense_tracker_db`

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `type` enum('credit','debit') NOT NULL,
  `title` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `phone` varchar(10) NOT NULL,
  `otp` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `otp`, `created_at`) VALUES
(2, 'qwe', 'soumyajitsaha972@gmail.com', 'qwe', '1234567890', 285882, '2025-02-04 14:01:39');

INSERT INTO `transactions` (`id`, `user_id`, `user_name`, `amount`, `type`, `title`, `date`, `time`, `created_at`) VALUES
(1, 2, 'qwe', 123.00, '', 'veg', '2025-02-04', '19:55:00', '2025-02-04 14:25:37'),
(2, 2, 'qwe', 34.00, '', 'sdf', '2025-02-04', '20:28:00', '2025-02-04 14:58:22'),
(3, 2, 'qwe', 345.00, '', 'ghjh', '2025-02-04', '20:35:00', '2025-02-04 15:05:36'),
(4, 2, 'qwe', 752.00, '', 'sdfsdfsdf', '2025-02-04', '20:46:00', '2025-02-04 15:16:19'),
(6, 2, 'qwe', 100.00, '', 'sdfsdf', '2025-02-04', '20:47:00', '2025-02-04 15:17:57'),
(7, 2, 'qwe', 456.00, '', 'dfgdfgdfgd', '2025-02-04', '20:52:00', '2025-02-04 15:22:26'),
(8, 2, 'qwe', 120.00, '', 'bir', '2025-02-07', '20:44:00', '2025-02-07 15:14:21'),
(10, 2, 'qwe', 20.00, 'debit', 'asd', '2025-02-07', '20:52:00', '2025-02-07 15:22:31'),
(11, 2, 'qwe', 999.00, 'credit', 'fees', '2025-02-07', '20:54:00', '2025-02-07 15:24:12');
