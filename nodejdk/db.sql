CREATE DATABASE IF NOT EXISTS person CHARACTER SET utf8;
use person;
CREATE TABLE `people` (
  `name` varchar(32) primary key,
  `password` varchar(32) NOT NULL,
  `department` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;