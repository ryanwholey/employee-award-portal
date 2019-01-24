-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `mydb` ;

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`regions`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`regions` ;

CREATE TABLE IF NOT EXISTS `mydb`.`regions` (
  `idregions` INT NOT NULL AUTO_INCREMENT,
  `description` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idregions`),
  UNIQUE INDEX `idregions_UNIQUE` (`idregions` ASC),
  UNIQUE INDEX `description_UNIQUE` (`description` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`users` ;

CREATE TABLE IF NOT EXISTS `mydb`.`users` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(128) NOT NULL,
  `first_name` VARCHAR(32) NOT NULL,
  `last_name` VARCHAR(32) NOT NULL,
  `salt` VARCHAR(32) NOT NULL,
  `passhash` CHAR(64) NOT NULL,
  `isadmin` BINARY NULL DEFAULT 0,
  `region` INT NULL,
  `ctime` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `mtime` DATETIME NULL,
  `dtime` DATETIME NULL,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC),
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `user_id_UNIQUE` (`user_id` ASC),
  INDEX `region_idx` (`region` ASC),
  CONSTRAINT `region`
    FOREIGN KEY (`region`)
    REFERENCES `mydb`.`regions` (`idregions`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`awards`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`awards` ;

CREATE TABLE IF NOT EXISTS `mydb`.`awards` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(45) NOT NULL,
  `creator` VARCHAR(128) NOT NULL,
  `recipient` VARCHAR(128) NOT NULL,
  `granted` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ctime` DATETIME NOT NULL,
  `dtime` DATETIME NULL,
  PRIMARY KEY (`id`, `creator`, `recipient`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  INDEX `email_idx0` (`creator` ASC),
  INDEX `email_idx1` (`recipient` ASC),
  CONSTRAINT `creator_constrain`
    FOREIGN KEY (`creator`)
    REFERENCES `mydb`.`users` (`email`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE,
  CONSTRAINT `recipient_constrain`
    FOREIGN KEY (`recipient`)
    REFERENCES `mydb`.`users` (`email`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`emails`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`emails` ;

CREATE TABLE IF NOT EXISTS `mydb`.`emails` (
  `email_id` INT NOT NULL AUTO_INCREMENT,
  `scheduled_time` DATETIME NOT NULL,
  `sent` DATETIME NULL,
  `award` INT NOT NULL,
  `recipient` INT NOT NULL,
  PRIMARY KEY (`email_id`, `award`, `recipient`),
  UNIQUE INDEX `email_id_UNIQUE` (`email_id` ASC),
  INDEX `award_idx` (`award` ASC),
  INDEX `recipient_idx` (`recipient` ASC),
  CONSTRAINT `award`
    FOREIGN KEY (`award`)
    REFERENCES `mydb`.`awards` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `recipient`
    FOREIGN KEY (`recipient`)
    REFERENCES `mydb`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
