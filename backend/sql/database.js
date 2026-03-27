const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "transcica_jatek",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function osszesUser() {
  const query = `SELECT user_id, username, user_email, user_jog_id FROM felhasznalo ORDER BY user_id;`;
  const [rows] = await pool.execute(query);
  return rows;
}

//user hozzáadás
async function userHozzaAd(usernev, jelszoHash, email, userJogId) {
  const query = `INSERT INTO felhasznalo (username, user_password, user_email, user_jog_id) VALUES (?, ?, ?, ?);`;
  const [row] = await pool.execute(query, [
    usernev,
    jelszoHash,
    email,
    userJogId,
  ]);
  return row.insertId;
}

//felhasználó keresés név alapján
async function usernevKereses(usernev) {
  const query = `SELECT * FROM felhasznalo WHERE username = ?;`;
  const [row] = await pool.execute(query, [usernev]);
  return row[0];
}

//felhasználó beállításainak adatát lekéri
async function felhBeallitasAdatok(userId) {
  const sql = `
    SELECT * 
    FROM felh_beallitasok
    WHERE user_id = ?;
  `;
  const [rows] = await pool.execute(sql, [userId]);
  return rows[0] || null;
}

//lekéri az adott felhasználó fiók adatait
async function felhFiokAdat(userId) {
  const sql = `
    SELECT  user_id, username, user_email
    FROM felhasznalo
    WHERE user_id = ?;
  `;
  const [rows] = await pool.execute(sql, [userId]);
  return rows[0] || null;
}

//menti a változásokat vagy ha még nem volt adata a felhasználónak beszúr egyet
async function felhBeallitasMentes({ user_id, hangero, nyelv_id, kiosztas }) {
  const sql = `
    INSERT INTO felh_beallitasok (user_id, hangero, nyelv_id, kiosztas)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      hangero = VALUES(hangero),
      nyelv_id = VALUES(nyelv_id),
      kiosztas = VALUES(kiosztas);
  `;

  const [result] = await pool.execute(sql, [
    user_id,
    hangero,
    nyelv_id,
    JSON.stringify(kiosztas),
  ]);

  return result.affectedRows;
}

async function updateFelhasznalo(id, username, email) {
  const sql = `
    UPDATE felhasznalo
    SET username = ?, user_email = ?
    WHERE user_id = ?
  `;
  await pool.execute(sql, [username, email, id]);
}

async function felhTorles(id) {
  const sql = `DELETE FROM felhasznalo WHERE user_id = ?`;
  await pool.execute(sql, [id]);
}

//felhasználó beállításainak adatát lekéri
async function felhAchivementAdatok(userId, usernyelv) {
  const sql = `
    SELECT a.achievement_title, a.achievement_text, p.unlocked
    FROM achievements a
    INNER JOIN player_achievements p ON a.id=p.achievement_id
    WHERE p.account_id = ? AND a.nyelv_id=?;
  `;
  const [rows] = await pool.execute(sql, [userId, usernyelv]);
  return rows || null;
}

async function meghivmentes(user_id, mentes_id) {
  let sql = `SELECT *
    FROM mentes
    WHERE user_id = ?`;

  switch (mentes_id) {
    case "0":
      sql = `SELECT *
            FROM mentes
            WHERE user_id = ?
            ORDER BY mentes_id
            LIMIT 1;`;
      break;

    case "1":
      sql = `SELECT *
            FROM mentes
            WHERE user_id = ?
            ORDER BY mentes_id
            LIMIT 1 OFFSET 1;`;
      break;

    case "2":
      sql = `SELECT *
            FROM mentes
            WHERE user_id = ?
            ORDER BY mentes_id
            LIMIT 1 OFFSET 2;`;
      break;

    case "3":
      sql = `SELECT *
            FROM mentes
            WHERE user_id = ?
            ORDER BY mentes_id
            LIMIT 1 OFFSET 3;`;
      break;

    default:
      console.log("Nem ismert mentés id!!!");
      break;
  }
  const [rows] = await pool.execute(sql, [user_id]);

  if (rows.length === 0) {
    return null;
  }

  rows[0].mentett_adatok = JSON.parse(rows[0].mentett_adatok);

  return rows[0];
}

//Updateli az achivementeket
async function UpdatehAchivementAdatok(user_id, achivement_id) {
  const sql = `
    UPDATE player_achievements SET unlocked=1 WHERE account_id=? and achievement_id=?;
  `;
  const [rows] = await pool.execute(sql, [user_id, achivement_id]);
  return rows || null;
}

//Update mentés
async function UpdateMentes(
  user_id,
  mentes_id,
  valtozo_utvonal,
  valtozott_adat,
) {
  /*példa: const sql = `
    UPDATE mentes
    SET mentett_adatok = JSON_SET(
    mentett_adatok,
    '$.NPC_interactions.Ratchet',
    true
    )
    WHERE JSON_EXTRACT(mentett_adatok, '$.NPC_interactions.Ratchet') = false;
  `;*/

  const sql = `
    UPDATE mentes
    SET mentett_adatok = JSON_SET(
    mentett_adatok,
    ?,
    ?
    )
    WHERE user_id=? AND mentes_id=?;
  `;
  const [rows] = await pool.execute(sql, [
    valtozo_utvonal,
    valtozott_adat,
    user_id,
    mentes_id,
  ]);
  return rows || null;
}

//Lehívni az adott achivement unlocked tulajdonságát (NPC kezeléshez kell)
async function FINDhAchivementAdatok(user_id, achivement_id) {
  const sql = `
    SELECT unlocked FROM player_achievements WHERE account_id=? and achievement_id=?;
  `;
  const [rows] = await pool.execute(sql, [user_id, achivement_id]);
  return rows || null;
}

async function FINDhAchivementAdatokFROMSAVE(
  valtozo_utvonal,
  mentes_id,
  user_id
) {
  /*
  const sql = `
    SELECT 
    JSON_EXTRACT(mentett_adatok, '$.NPC_interactions.Ratchet') AS VOLT_E_NPC
  FROM mentes
  WHERE mentes_id=1 AND user_id=1;
  `;*/

  const sql = `
    SELECT 
    JSON_EXTRACT(mentett_adatok, ?) AS VOLT_E_NPC
    FROM mentes
    WHERE mentes_id=? AND user_id=?;
  `;
  const [rows] = await pool.execute(sql, [valtozo_utvonal, mentes_id, user_id]);
  return rows || null;
}

//elfelejtett jelszó kérés mentése
async function elfelejtettJelszoKeresLetrehoz(user_email) {
  const query = `
        INSERT INTO elfelejtett_jelszo_keresek (user_email)
        VALUES (?);
    `;
  const [result] = await pool.execute(query, [user_email]);
  return result.insertId;
}

//összes elfelejtett jelszó kérés lekérése
async function elfelejtettJelszoKeresek() {
  const query = `
        SELECT keres_id, user_email, keres_datum, allapot
        FROM elfelejtett_jelszo_keresek
        ORDER BY keres_datum DESC;
    `;
  const [rows] = await pool.execute(query);
  return rows;
}

//jelszó visszaállítása
async function adminJelszoReset(email, ujHash) {
  const query = `
        UPDATE felhasznalo
        SET user_password = ?, jelszo_csere_kotelezo = 1
        WHERE user_email = ?;
    `;
  const [result] = await pool.execute(query, [ujHash, email]);
  return result.affectedRows;
}

//kérés állapotának módosítása
async function elfelejtettJelszoKeresAllapot(keres_id, allapot) {
  const query = `
        UPDATE elfelejtett_jelszo_keresek
        SET allapot = ?
        WHERE keres_id = ?;
    `;
  const [result] = await pool.execute(query, [allapot, keres_id]);
  return result.affectedRows;
}

//jelszócsere belépés után
async function felhasznaloJelszoCsere(userId, ujHash) {
  const query = `
        UPDATE felhasznalo
        SET user_password = ?, jelszo_csere_kotelezo = 0
        WHERE user_id = ?;
    `;
  const [result] = await pool.execute(query, [ujHash, userId]);
  return result.affectedRows;
}

//felhasználó keresése email alapján
async function emailKereses(email) {
  const query = `
        SELECT * FROM felhasznalo
        WHERE user_email = ?;
    `;
  const [rows] = await pool.execute(query, [email]);
  return rows[0];
}

//!Export
module.exports = {
  userHozzaAd,
  usernevKereses,
  felhBeallitasAdatok,
  felhFiokAdat,
  felhBeallitasMentes,
  updateFelhasznalo,
  felhTorles,
  felhAchivementAdatok,
  osszesUser,
  meghivmentes,
  UpdatehAchivementAdatok,
  FINDhAchivementAdatok,
  elfelejtettJelszoKeresLetrehoz,
  elfelejtettJelszoKeresek,
  adminJelszoReset,
  elfelejtettJelszoKeresAllapot,
  felhasznaloJelszoCsere,
  emailKereses,
  UpdateMentes,
  FINDhAchivementAdatokFROMSAVE,
};
