const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const database = require("../sql/database.js");
const fs = require("fs");
const fsPromises = require("fs/promises");
const path = require("node:path");
const nyelvMappaUtvonala = path.join(__dirname, "../languages/");
const gamejsonutvonal = path.join(__dirname, "../game_json/");

//log fájl
const uploadFolder = path.join(__dirname, "../http");

const logPath = path.join(uploadFolder, "log.txt");

//log fájl létrehozás ha nincs
if (!fs.existsSync(logPath)) {
  fs.writeFileSync(logPath, "", "utf8");
}

//végpont hívásakor logolás
router.use((req, res, next) => {
  const start = Date.now();
  const now = new Date().toLocaleString("hu-HU");

  res.on("finish", () => {
    const ms = Date.now() - start;

    const line =
      "[" +
      now +
      "] " +
      req.method +
      " " +
      req.originalUrl +
      " -> " +
      res.statusCode +
      " (" +
      ms +
      "ms)\n";

    fs.appendFile(logPath, line, (err) => {
      if (err) console.error("Log hiba:", err);
    });
  });

  next();
});

//!Multer
const multer = require("multer"); //?npm install multer

const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, path.join(__dirname, "../uploads"));
  },
  filename: (request, file, callback) => {
    callback(null, Date.now() + "-" + file.originalname); //?egyedi név: dátum - file eredeti neve
  },
});

const upload = multer({ storage });

//!Endpoints:
//?GET /api/test
router.get("/test", (request, response) => {
  response.status(200).json({
    message: "Ez a végpont működik.",
  });
});

//?GET /api/testsql
router.get("/testsql", async (request, response) => {
  try {
    const selectall = await database.selectall();
    response.status(200).json({
      message: "Ez a végpont működik.",
      results: selectall,
    });
  } catch (error) {
    response.status(500).json({
      message: "Ez a végpont nem működik.",
    });
  }
});

//? GET /api/nyelv_alapjan_JSON_olvasas
router.get(
  "/nyelv_alapjan_JSON_olvasas/:nyelv/:fajl",
  async (request, response) => {
    try {
      const { nyelv, fajl } = request.params;

      // Biztonsági ellenőrzés: csak .json kiterjesztésű fájlok engedélyezése (Mert más fájlokat nem akarunk olvasni és támadások elkerülésének érdekében van itt)
      if (!fajl.endsWith(".json")) {
        return request.status(400).json({
          success: false,
          message: "Csak JSON fájlokat fogadunk el!",
        });
      }

      const fajlUtvonal = path.join(nyelvMappaUtvonala, nyelv, "/", fajl);

      const fajlTartalom = await fsPromises.readFile(fajlUtvonal, "utf8");
      const JSONAdatok = JSON.parse(fajlTartalom);

      response.status(200).json({
        success: true,
        data: JSONAdatok,
      });
    } catch (error) {
      console.error("GET error:", error);

      response.status(404).json({
        success: false,
        message: "A JSON fájl nem létezik!",
      });
    }
  },
);

router.post("/register", async (req, res) => {
  try {
    const { usernev, jelszo, email } = req.body;

    //ellenőrzés hogy a felhasználó szabad
    const letezik = await database.usernevKereses(usernev);
    if (letezik) {
      return res.status(409).json({
        success: false,
        message: "Felhasználónév foglalt",
      });
    }

    //email regex ellenőrzés
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Érvénytelen email formátum",
      });
    }

    //jelszó hash-elése 2^10 (1024) lépésben
    const hash = await bcrypt.hash(jelszo, 10);

    //adminok emailje
    const adminEmailek = [
      "nagyhuszarvirag@gmail.com",
      "imre.huszar6@gmail.com",
    ];

    //jog megkülönböztetése
    const userJogId = adminEmailek.includes(email.toLowerCase()) ? 1 : 2;

    const userId = await database.userHozzaAd(usernev, hash, email, userJogId);

    res.status(200).json({
      success: true,
      userId: userId,
      usernev: usernev,
      userJogId: userJogId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Adatbázis hiba!",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { usernev, jelszo } = req.body;

    const user = await database.usernevKereses(usernev);

    //felhasználónév ellenőrzése
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Felhasználónév nem létezik",
      });
    }

    //jelszó ellenőrzés hash összehasonlítással
    const egyezik = await bcrypt.compare(jelszo, user.user_password);

    if (!egyezik) {
      return res.status(401).json({
        success: false,
        message: "Hibás jelszó",
      });
    }

    res.status(200).json({
      success: true,
      userId: user.user_id,
      usernev: user.username,
      userJogId: user.user_jog_id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Adatbázis hiba",
    });
  }
});

//lekéri az adatbázisból a beállítási adatokat
router.get("/felhasznalo/:id", async (req, res) => {
  try {
    const userId = Number(req.params.id);
    if (!Number.isInteger(userId) || userId <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Hibás user ID." });
    }

    const data = await database.felhBeallitasAdatok(userId);

    if (!data) {
      return res.json({ success: true, data: null });
    }

    return res.json({ success: true, data });
  } catch (err) {
    console.error("GET /api/felhasznalo/:id hiba:", err);
    res.status(500).json({ success: false, message: "Szerverhiba." });
  }
});

//lekéri az adatbázisból a fiók adatokat a beállítás menühöz
router.get("/fiokadat/:id", async (req, res) => {
  try {
    const userId = Number(req.params.id);
    if (!Number.isInteger(userId) || userId <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Hibás user ID." });
    }

    const data = await database.felhFiokAdat(userId);

    if (!data) {
      return res.json({ success: true, data: null });
    }

    return res.json({ success: true, data });
  } catch (err) {
    console.error("GET /api/felhasznalo/:id hiba:", err);
    res.status(500).json({ success: false, message: "Szerverhiba." });
  }
});

//menti vagy ha még nem létezik adott felhasználóhoz akkor beszúrja a beállítások adatai
router.post("/felhasznalo/beallitas", async (req, res) => {
  try {
    const { user_id, key, value } = req.body;

    if (!user_id || user_id <= 0) {
      return res.status(400).json({ success: false, message: "Hibás user." });
    }

    const current = (await database.felhBeallitasAdatok(user_id)) || {
      hangero: 0.5,
      nyelv: "hungarian",
      kiosztas: {},
    };

    if (key === "hangero") current.hangero = Number(value);
    if (key === "nyelv") current.nyelv = String(value);
    if (key === "kiosztas") current.kiosztas = value;

    await database.felhBeallitasMentes({
      user_id,
      hangero: current.hangero,
      nyelv: current.nyelv,
      kiosztas: current.kiosztas,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("POST /api/felhasznalo/beallitasok hiba:", err);
    res.status(500).json({ success: false, message: "Szerverhiba." });
  }
});

//fiók adatainak megváltoztatása
router.patch("/user/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { username, user_email } = req.body;

  if (!username || !user_email) {
    return res.status(422).json({ message: "Hiányzó adat" });
  }

  await database.updateFelhasznalo(id, username, user_email);
  res.json({ success: true });
});

//felhasználói adatok törlése
router.delete("/user/:id", async (req, res) => {
  const id = Number(req.params.id);
  await database.felhTorles(id);
  res.json({ success: true });
});

//lekéri az adatbázisból a achivement adatokat
router.get("/showachivements/:id/:nyelv", async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const usernyelv = req.params.nyelv;
    if (
      !Number.isInteger(userId) ||
      userId <= 0 ||
      typeof usernyelv !== "string" ||
      usernyelv === ""
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Hibás user ID vagy nyelv." });
    }

    const data = await database.felhAchivementAdatok(userId, usernyelv);

    return res.json({ success: true, data });
  } catch (err) {
    console.error("GET /showachivements/:id/:nyelv hiba:", err);
    res.status(500).json({ success: false, message: "Szerverhiba." });
  }
});

//achivements adatainak megváltoztatása
router.patch(
  "/updateachivements/:user_id/:achivement_id_magyar/:achivement_id_angol",
  async (req, res) => {
    const user_id = Number(req.params.user_id);
    const achivement_id_magyar = Number(req.params.achivement_id_magyar);
    const achivement_id_angol = Number(req.params.achivement_id_angol);

    await database.UpdatehAchivementAdatok(
      user_id,
      achivement_id_magyar,
      achivement_id_angol,
    );
    res.json({ success: true });
  },
);

// Összes user lekérése (admin)
router.get("/admin/users", async (req, res) => {
  try {
    const users = await database.osszesUser();

    res.json({
      success: true,
      data: users,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Adatbázis hiba",
    });
  }
});

//A mentés_id alapján meghívni a mentést
router.get("/mentesmeghiv/:user_id/:mentes_id", async (req, res) => {
  try {
    let user_id = req.params.user_id;
    let mentes_id = req.params.mentes_id;
    const meghivmentes = await database.meghivmentes(user_id, mentes_id);

    res.json({
      success: true,
      data: meghivmentes,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Adatbázis hiba",
    });
  }
});

//Map adatbetöltő
router.get("/map_data/:szoba_neve", async (req, res) => {
  try {
    const { szoba_neve } = req.params;

    // Biztonsági ellenőrzés: csak .json kiterjesztésű fájlok engedélyezése (Mert más fájlokat nem akarunk olvasni és támadások elkerülésének érdekében van itt)
    if (!szoba_neve.endsWith(".json")) {
      return res.status(400).json({
        success: false,
        message: "Csak JSON fájlokat fogadunk el!",
      });
    }

    const fajlUtvonal = path.join(gamejsonutvonal, "maps/", szoba_neve);

    const fajlTartalom = await fsPromises.readFile(fajlUtvonal, "utf8");
    const JSONAdatok = JSON.parse(fajlTartalom);

    res.status(200).json({
      success: true,
      data: JSONAdatok,
    });
  } catch (error) {
    console.error("GET error:", error);

    res.status(404).json({
      success: false,
      message: "A JSON fájl nem létezik!",
    });
  }
});

// Kell-e az NPC
router.get("/kelleNPC/:user_id/:achivement_id", async (req, res) => {
  try {
    const user_id = Number(req.params.user_id);
    const achivement_id = Number(req.params.achivement_id);
    const UpdatehAchivementAdatok = await database.UpdatehAchivementAdatok(
      user_id,
      achivement_id,
    );

    if (UpdatehAchivementAdatok[0].unlocked) {
      res.json({
        success: true,
        message: false,
      });
    } else {
      res.json({
        success: true,
        message: true,
      });
    }
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Adatbázis hiba",
    });
  }
});

//ez alá ne írj új apit csak fölé
router.use((err, req, res, next) => {
  const now = new Date().toLocaleString("hu-HU");

  const line =
    "[" +
    now +
    "] ERROR " +
    req.method +
    " " +
    req.originalUrl +
    " -> " +
    err.message +
    "\n";

  fs.appendFile(logPath, line, () => {});

  next(err);
});

module.exports = router;
