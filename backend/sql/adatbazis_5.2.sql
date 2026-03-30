DROP DATABASE IF EXISTS transcica_jatek;

CREATE DATABASE IF NOT EXISTS transcica_jatek
CHARACTER SET utf8mb4
COLLATE utf8mb4_hungarian_ci;

USE transcica_jatek;

CREATE TABLE IF NOT EXISTS user_jog (
    user_jog_id INT AUTO_INCREMENT PRIMARY KEY,
    userjog_megnevezes VARCHAR(100) NOT NULL
);

INSERT INTO user_jog (user_jog_id, userjog_megnevezes) VALUES (1, "admin"), (2, "player");

CREATE TABLE IF NOT EXISTS felhasznalo (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    user_password VARCHAR(255),
    user_email VARCHAR(100) NOT NULL UNIQUE,
    user_jog_id INT NOT NULL,
    jelszo_csere_kotelezo TINYINT(1) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS elfelejtett_jelszo_keresek (
    keres_id INT AUTO_INCREMENT PRIMARY KEY,
    user_email VARCHAR(100) NOT NULL,
    keres_datum DATETIME DEFAULT CURRENT_TIMESTAMP,
    allapot VARCHAR(20) DEFAULT 'uj',
    FOREIGN KEY (user_email) REFERENCES felhasznalo(user_email)
);

CREATE TABLE IF NOT EXISTS mentes (
    mentes_id INT,
    user_id INT,
    mentett_adatok JSON DEFAULT (
        JSON_OBJECT(
            'savepoint', 'kezdomap_1',
            'world_interactions', JSON_OBJECT(
                'mitteous-plateau_breakable-ground1', false
            ),
            'NPC_interactions', JSON_OBJECT(
                'Ratchet', false,
                'Prowl', false
            ),
            'bosses', JSON_OBJECT(
                'Tarn', false
            ),
            'ability_unlocked', JSON_OBJECT(
                'double_jump', false,
                'dash', false
            )
        )
    ),
    PRIMARY KEY (mentes_id, user_id)
);

CREATE TABLE IF NOT EXISTS nyelv (
    nyelv_id INT AUTO_INCREMENT PRIMARY KEY,
    nyelv VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO nyelv (nyelv_id, nyelv) VALUES (1, "hungarian"), (2, "english");

CREATE TABLE IF NOT EXISTS felh_beallitasok (
    user_id INT PRIMARY KEY,
    hangero DECIMAL(2,2) DEFAULT 0.5,
    nyelv_id INT DEFAULT 1 ,
    kiosztas JSON DEFAULT JSON_OBJECT(
        'playerEloreMegyGombja','d',
        'playerHatraMegyGombja','a',
        'playerUgroGombja','space',
        'playerAttackGombja','left click',
        'playerInteractGombja','e'
    ),
    FOREIGN KEY (nyelv_id) REFERENCES nyelv(nyelv_id)
);

CREATE TABLE achievement_definitions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    key_name VARCHAR(50) NOT NULL UNIQUE 
);

CREATE TABLE achievements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nyelv_id INT DEFAULT 1 ,
    definition_id INT NOT NULL,
    achievement_title VARCHAR(255) NOT NULL,
    achievement_text TEXT NOT NULL,
    FOREIGN KEY (nyelv_id) REFERENCES nyelv(nyelv_id),
    FOREIGN KEY (definition_id) REFERENCES achievement_definitions(id)
);

CREATE TABLE player_achievements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    account_id INT NOT NULL,
    achievement_id INT NOT NULL,
    unlocked BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT fk_player_account
        FOREIGN KEY (account_id)
        REFERENCES felhasznalo(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_player_achievement
        FOREIGN KEY (achievement_id)
        REFERENCES achievement_definitions(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_player_achievement
        UNIQUE (account_id, achievement_id)
);

INSERT INTO achievement_definitions (id, key_name) VALUES 
(1, 'prowl_table_throw'),
(2, 'ratchet_fail_save');

INSERT INTO achievements (nyelv_id, definition_id, achievement_title, achievement_text)
VALUES 
(
    1,
    1,
    'Mindig komoly vagyok',
    'Lásd, ahogy Prowl felborít egy asztalt.'
),
(
    2,
    1,
    "I'm always serious",
    'Witness Prowl throw a table'
),
(
    1,
    2,
    'Túl öreg vagyok ehhez!',
    'Nézd végig, ahogy Ratchet nem tud megmenteni valakit.'
),
(
    2,
    2,
    "I'm too old for this!",
    'Watch as Ratchet fails to save someone'
);


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

DELIMITER $$

CREATE TRIGGER felhasznalo_hozzaadas_kezelese
AFTER INSERT ON felhasznalo
FOR EACH ROW
BEGIN

    INSERT INTO player_achievements (account_id, achievement_id, unlocked)
    SELECT NEW.user_id, a.id, FALSE
    FROM achievement_definitions a;

    INSERT INTO felh_beallitasok (user_id)
    VALUES (NEW.user_id);

    INSERT INTO mentes (mentes_id, user_id)
    VALUES (1, NEW.user_id);

    INSERT INTO mentes (mentes_id, user_id)
    VALUES (2, NEW.user_id);

    INSERT INTO mentes (mentes_id, user_id)
    VALUES (3, NEW.user_id);

    INSERT INTO mentes (mentes_id, user_id)
    VALUES (4, NEW.user_id);

END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER before_user_delete 
BEFORE DELETE ON felhasznalo
FOR EACH ROW
BEGIN
    DELETE FROM mentes WHERE user_id = OLD.user_id;
    DELETE FROM felh_beallitasok WHERE user_id = OLD.user_id;
    DELETE FROM player_achievements WHERE account_id = OLD.user_id;
END$$

DELIMITER ;

INSERT INTO felhasznalo(username, user_password, user_email, user_jog_id) VALUES ('admin','$2b$10$3fj8F/YMcizicfEDwQ.qO.b9LlzSDSev.8WQhNEWjfJYO6YOP.Iui','admin@gmail.com',1);
