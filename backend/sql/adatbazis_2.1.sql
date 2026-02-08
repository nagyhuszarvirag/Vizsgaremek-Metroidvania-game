CREATE DATABASE IF NOT EXISTS transcica_jatek
CHARACTER SET utf8mb4
COLLATE utf8mb4_hungarian_ci;

USE transcica_jatek;

CREATE TABLE IF NOT EXISTS being_type (
    type_id INT AUTO_INCREMENT PRIMARY KEY,
    megnevezes VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS being_on_map (
    being_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type_id INT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS sprite_type (
    sprite_type_id INT AUTO_INCREMENT PRIMARY KEY,
    sprite_pos_x INT,
    sprite_pos_y INT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS sprite_size_shelt (
    sprite_size_id INT AUTO_INCREMENT PRIMARY KEY,
    sprite_height INT,
    sprite_width INT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS sprites (
    sprite_id INT AUTO_INCREMENT PRIMARY KEY,
    sprite_size_id INT,
    sprite_name_id INT,
    sprite_type_id INT,
    sprite_length INT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS user_jog (
    user_jog_id INT AUTO_INCREMENT PRIMARY KEY,
    userjog_megnevezes VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS felhasznalo (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    user_password VARCHAR(255),
    user_email VARCHAR(100) NOT NULL UNIQUE,
    user_jog_id INT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS mentes (
    mentes_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    mentett_adatok VARCHAR(255)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS felh_beallitasok (
    user_id INT,
    hangero FLOAT DEFAULT 0.5,
    nyelv VARCHAR(20) DEFAULT 'hungarian',
    kiosztas JSON DEFAULT JSON_OBJECT(
        'playerEloreMegyGombja','d',
        'playerHatraMegyGombja','a',
        'playerUgroGombja','space',
        'playerAttackGombja','left click',
        'playerInteractGombja','e'
))ENGINE=InnoDB;

ALTER TABLE being_on_map
ADD CONSTRAINT fk_being_on_map_being_type
FOREIGN KEY (type_id)
REFERENCES being_type(type_id)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE sprites
ADD CONSTRAINT fk_sprites_sprite_size
FOREIGN KEY (sprite_size_id)
REFERENCES sprite_size_shelt(sprite_size_id)
ON DELETE CASCADE
ON UPDATE CASCADE,
ADD CONSTRAINT fk_sprites_being_on_map
FOREIGN KEY (sprite_name_id)
REFERENCES being_on_map(being_id)
ON DELETE CASCADE
ON UPDATE CASCADE,
ADD CONSTRAINT fk_sprites_sprite_type
FOREIGN KEY (sprite_type_id)
REFERENCES sprite_type(sprite_type_id)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE felhasznalo
ADD CONSTRAINT fk_felhasznalo_user_jog
FOREIGN KEY (user_jog_id)
REFERENCES user_jog(user_jog_id)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE mentes
ADD CONSTRAINT fk_mentes_felhasznalo
FOREIGN KEY (user_id)
REFERENCES felhasznalo(user_id)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE felh_beallitasok
ADD CONSTRAINT fk_felh_beallitas_felhasznalo
FOREIGN KEY (user_id)
REFERENCES felhasznalo(user_id)
ON DELETE CASCADE
ON UPDATE CASCADE;
