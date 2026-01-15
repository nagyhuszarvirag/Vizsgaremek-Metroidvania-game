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

//!Export
module.exports = {
    userHozzaAd,
    usernevKereses
};
