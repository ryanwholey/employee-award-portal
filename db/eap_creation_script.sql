-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema eap
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `eap` ;

-- -----------------------------------------------------
-- Schema eap
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `eap` DEFAULT CHARACTER SET utf8 ;
USE `eap` ;

-- -----------------------------------------------------
-- Table `eap`.`regions`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `eap`.`regions` ;

CREATE TABLE IF NOT EXISTS `eap`.`regions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `description` VARCHAR(45) NOT NULL,
  `ctime` DATETIME NOT NULL,
  `mtime` DATETIME NULL,
  `dtime` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `description_UNIQUE` (`description` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `eap`.`users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `eap`.`users` ;

CREATE TABLE IF NOT EXISTS `eap`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(128) NOT NULL,
  `first_name` VARCHAR(32) NOT NULL,
  `last_name` VARCHAR(32) NOT NULL,
  `salt` VARCHAR(64) NOT NULL,
  `passhash` CHAR(64) NOT NULL,
  `is_admin` BOOLEAN NULL DEFAULT 0,
  `region` INT NULL,
  `ctime` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `mtime` DATETIME NULL,
  `dtime` DATETIME NULL,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC),
  PRIMARY KEY (`id`),
  INDEX `region_id_idx` (`region` ASC),
  CONSTRAINT `user_region_idx`
    FOREIGN KEY (`region`)
    REFERENCES `eap`.`regions` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `eap`.`awards`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `eap`.`awards` ;

CREATE TABLE IF NOT EXISTS `eap`.`awards` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(45) NOT NULL,
  `creator` INT NOT NULL,
  `recipient` INT NOT NULL,
  `granted` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `scheduled` BINARY NULL DEFAULT 0,
  `ctime` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `mtime` DATETIME NULL,
  `dtime` DATETIME NULL,
  PRIMARY KEY (`id`, `recipient`, `creator`),
  INDEX `award_creator_id_idx` (`creator` ASC),
  INDEX `award_recipient_id_idx` (`recipient` ASC),
  CONSTRAINT `award_recipient_idx`
    FOREIGN KEY (`recipient`)
    REFERENCES `eap`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE,
  CONSTRAINT `award_creator_idx`
    FOREIGN KEY (`creator`)
    REFERENCES `eap`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `eap`.`emails`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `eap`.`emails` ;

CREATE TABLE IF NOT EXISTS `eap`.`emails` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `scheduled_time` DATETIME NOT NULL,
  `sent` DATETIME NULL,
  `award` INT NOT NULL,
  `recipient` INT NOT NULL,
  `ctime` DATETIME NOT NULL,
  `mtime` DATETIME NULL,
  `dtime` DATETIME NULL,
  `state` TINYINT NULL,
  PRIMARY KEY (`id`, `award`, `recipient`),
  INDEX `email_recipient_id_idx` (`recipient` ASC),
  INDEX `email_award_id_idx` (`award` ASC),
  CONSTRAINT `email_award_idx`
    FOREIGN KEY (`award`)
    REFERENCES `eap`.`awards` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `email_recipient_idx`
    FOREIGN KEY (`recipient`)
    REFERENCES `eap`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
