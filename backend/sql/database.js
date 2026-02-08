const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'transcica_jatek',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

//!SQL Queries
async function selectall() {
    const query = 'SELECT * FROM exampletable;';
    const [rows] = await pool.execute(query);
    return rows;
}

//User hozzáadás
async function userHozzaAd(usernev, jelszoHash, email, userJogId) {
    const query = 'INSERT INTO felhasznalo (username, user_password, user_email, user_jog_id) VALUES (?, ?, ?, ?);';
    const [row] = await pool.execute(query, [usernev, jelszoHash, email, userJogId]);
    return row.insertId;
}

//felhasználó keresés név alapján
async function usernevKereses(usernev) {
    const query = 'SELECT * FROM felhasznalo WHERE username = ?;';
    const [row] = await pool.execute(query, [usernev]);
    return row[0];
}

//felhasználó beállításainak adatát lekéri
async function felhBeallitasAdatok(userId) {
    const sql = `
    SELECT user_id, hangero, nyelv, kiosztas
    FROM felh_beallitasok
    WHERE user_id = ?;
  `;
    const [rows] = await pool.execute(sql, [userId]);
    return rows[0] || null;
}

//menti a változásokat vagy ha még nem volt adata a felhasználónak beszúr egyet
async function felhBeallitasMentes({ user_id, hangero, nyelv, kiosztas }) {
    const sql = `
    INSERT INTO felh_beallitasok (user_id, hangero, nyelv, kiosztas)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      hangero = VALUES(hangero),
      nyelv = VALUES(nyelv),
      kiosztas = VALUES(kiosztas);
  `;

    const [result] = await pool.execute(sql, [
        user_id,
        hangero,
        nyelv,
        JSON.stringify(kiosztas)
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

//!Export
module.exports = {
    userHozzaAd,
    usernevKereses,
    felhBeallitasAdatok,
    felhBeallitasMentes,
    updateFelhasznalo,
    felhTorles
};
