const express = require('express');
const router = express.Router();
const database = require('../sql/database.js');
const fs = require('fs/promises');
const path = require('path');
const nyelvMappaUtvonala = path.join(__dirname, '../languages/');

//!Multer
const multer = require('multer'); //?npm install multer


const storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, path.join(__dirname, '../uploads'));
    },
    filename: (request, file, callback) => {
        callback(null, Date.now() + '-' + file.originalname); //?egyedi név: dátum - file eredeti neve
    }
});

const upload = multer({ storage });

//!Endpoints:
//?GET /api/test
router.get('/test', (request, response) => {
    response.status(200).json({
        message: 'Ez a végpont működik.'
    });
});

//?GET /api/testsql
router.get('/testsql', async (request, response) => {
    try {
        const selectall = await database.selectall();
        response.status(200).json({
            message: 'Ez a végpont működik.',
            results: selectall
        });
    } catch (error) {
        response.status(500).json({
            message: 'Ez a végpont nem működik.'
        });
    }
});

//? GET /api/JSONolvas
router.get("/JSONolvas/:nyelv/:fajl", async (request, response) => {
  try {
    const { nyelv, fajl } = request.params;

    // Biztonsági ellenőrzés: csak .json kiterjesztésű fájlok engedélyezése (Mert más fájlokat nem akarunk olvasni és támadások elkerülésének érdekében van itt)
    if (!fajl.endsWith(".json")) {
      return request.status(400).json({
        success: false,
        message: "Csak JSON fájlokat fogadunk el!"
      });
    }

    const fajlUtvonal = path.join(nyelvMappaUtvonala, nyelv, "/"  ,  fajl);

    const fajlTartalom = await fs.readFile(fajlUtvonal, "utf8");
    const JSONAdatok = JSON.parse(fajlTartalom);

    response.status(200).json({
        success: true,
        data: JSONAdatok
    });

  } catch (error) {
    console.error("GET error:", error);

    response.status(404).json({
      success: false,
      message: "A JSON fájl nem létezik!"
    });
  }
});

module.exports = router;
