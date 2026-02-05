// beallitas_menu.js
import { oldalTakarito, fecthData, visszaGomb } from "./index.js";
import {
  volume as defaultVolume,
  nyelv as defaultLanguage,
  playerEloreMegyGombja as defaultPlayerElore,
  playerHatraMegyGombja as defaultPlayerHatra,
  playerUgroGombja as defaultPlayerUgro,
  playerAttackGombja as defaultPlayerAttack,
  playerInteractGombja as defaultPlayerInteract,
  mobileMode as defaultMobileMode
} from "./options.js";

//globális változó
let jelenlegiFelh = null;

//felhasználói beállítások lekérése backendből
async function betoltFelhBeallitas(userId) {
  if (!userId || userId === 0) return null;
  try {
    const res = await fetch(`http://127.0.0.1:3000/api/user/${userId}`);
    const data = await res.json();
    if (data.success) return data.data;
  } catch (e) {
    console.error("Hiba a user beállítások betöltésénél:", e);
  }
  return null;
}

//felhasználói beállítások mentése backendbe
async function FelhBeallitasMentes(userId, beallitas) {
  if (!userId || userId === 0) return;
  const updates = [
    { key: "hangero", value: beallitas.volume },
    { key: "nyelv", value: beallitas.language },
    { key: "kiosztas", value: beallitas.keyBindings }
  ];
  try {
    for (const u of updates) {
      await fetch("http://127.0.0.1:3000/api/user/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(u)
      });
    }
  } catch (e) {
    console.error("Hiba a user beállítások mentésénél:", e);
  }
}

//beállítások menü
export async function beallitasMenuLetrehoz(userId) {
  jelenlegiFelh = userId || 0;

  oldalTakarito();

  //window változók inicializálása alapértelmezett értékekkel
  window.volume = defaultVolume;
  window.language = defaultLanguage;
  window.playerEloreMegyGombja = defaultPlayerElore;
  window.playerHatraMegyGombja = defaultPlayerHatra;
  window.playerUgroGombja = defaultPlayerUgro;
  window.playerAttackGombja = defaultPlayerAttack;
  window.playerInteractGombja = defaultPlayerInteract;
  window.mobileMode = defaultMobileMode;

  //backendből lekérjük a felhasználói beállításokat ha van
  const felhBeallitas = await betoltFelhBeallitas(userId);
  if (felhBeallitas) {
    window.volume = parseFloat(felhBeallitas.hangero) || window.volume;
    window.language = felhBeallitas.nyelv || window.language;

    const kb = felhBeallitas.kiosztas || {};
    window.playerEloreMegyGombja = kb.playerEloreMegyGombja || window.playerEloreMegyGombja;
    window.playerHatraMegyGombja = kb.playerHatraMegyGombja || window.playerHatraMegyGombja;
    window.playerUgroGombja = kb.playerUgroGombja || window.playerUgroGombja;
    window.playerAttackGombja = kb.playerAttackGombja || window.playerAttackGombja;
    window.playerInteractGombja = kb.playerInteractGombja || window.playerInteractGombja;
  }

  //nyelv adatok betöltése JSON-ból
  const nyelvData = await fecthData(`http://127.0.0.1:3000/api/nyelv/${window.language}/options.json`);

  //menü container
  const container = document.createElement("div");
  container.id = "beallitasMenu";
  container.style.cssText = `
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    gap: 15px;
  `;

  //cím
  const cim = document.createElement("h1");
  cim.textContent = nyelvData.data.title || "Beállítások";
  container.appendChild(cim);

  //hangerő
  const hangeroLabel = document.createElement("label");
  hangeroLabel.textContent = nyelvData.data.volume || "Zene hangereje:";
  const hangeroCsuszka = document.createElement("input");
  hangeroCsuszka.type = "range";
  hangeroCsuszka.min = 0;
  hangeroCsuszka.max = 1;
  hangeroCsuszka.step = 0.01;
  hangeroCsuszka.value = window.volume;
  hangeroCsuszka.addEventListener("input", () => { window.volume = parseFloat(hangeroCsuszka.value); });

  const hangeroContainer = document.createElement("div");
  hangeroContainer.append(hangeroLabel, hangeroCsuszka);
  container.appendChild(hangeroContainer);

  //billentyűzet kiosztás
  const keyContainer = document.createElement("div");
  keyContainer.style.display = "flex";
  keyContainer.style.flexDirection = "column";
  keyContainer.style.gap = "5px";

  function billenytuInputLetrehoz(labelText, value, setter) {
    const label = document.createElement("label");
    label.textContent = labelText;
    const input = document.createElement("input");
    input.type = "text";
    input.value = value;
    input.style.width = "120px";
    input.addEventListener("keydown", (e) => {
      e.preventDefault();
      let keyName = e.key;
      if (keyName === " ") keyName = "space";
      if (e.button === 0) keyName = "left click";
      setter(keyName);
      input.value = keyName;
    });
    const div = document.createElement("div");
    div.append(label, input);
    div.style.display = "flex";
    div.style.justifyContent = "space-between";
    div.style.width = "300px";
    keyContainer.appendChild(div);
  }

  billenytuInputLetrehoz(nyelvData.data.keys.forward || "Előre", window.playerEloreMegyGombja, v => window.playerEloreMegyGombja = v);
  billenytuInputLetrehoz(nyelvData.data.keys.backward || "Hátra", window.playerHatraMegyGombja, v => window.playerHatraMegyGombja = v);
  billenytuInputLetrehoz(nyelvData.data.keys.jump || "Ugrás", window.playerUgroGombja, v => window.playerUgroGombja = v);
  billenytuInputLetrehoz(nyelvData.data.keys.attack || "Támadás", window.playerAttackGombja, v => window.playerAttackGombja = v);
  billenytuInputLetrehoz(nyelvData.data.keys.interact || "Interakció", window.playerInteractGombja, v => window.playerInteractGombja = v);

  container.appendChild(keyContainer);

  //nyelv választás
  const nyelvLabel = document.createElement("label");
  nyelvLabel.textContent = nyelvData.data.language || "Nyelv:";
  const nyelvValaszt = document.createElement("select");
  ["magyar","english"].forEach(l => {
    const option = document.createElement("option");
    option.value = l;
    option.textContent = l === "magyar" ? "Magyar" : "English";
    if (l === window.language) option.selected = true;
    nyelvValaszt.appendChild(option);
  });
  nyelvValaszt.addEventListener("change", () => {
    window.language = nyelvValaszt.value;
    beallitasMenuLetrehoz(jelenlegiFelh);
  });
  const nyelvContainer = document.createElement("div");
  nyelvContainer.append(nyelvLabel, nyelvValaszt);
  container.appendChild(nyelvContainer);

  //telefon mód
  const telefonLabel = document.createElement("label");
  telefonLabel.textContent = nyelvData.data.mobileMode || "Telefonos mód:";
  const telefonCheckbox = document.createElement("input");
  telefonCheckbox.type = "checkbox";
  window.mobileMode = window.innerWidth <= 768;
  telefonCheckbox.checked = window.mobileMode;
  telefonCheckbox.addEventListener("change", () => { window.mobileMode = telefonCheckbox.checked; });
  window.addEventListener("resize", () => {
    if(window.innerWidth <= 768) {
      window.mobileMode = true;
      telefonCheckbox.checked = true;
    }
  });
  const telefonContainer = document.createElement("div");
  telefonContainer.append(telefonLabel, telefonCheckbox);
  container.appendChild(telefonContainer);

  //mentés gomb
  const mentesGomb = document.createElement("button");
  mentesGomb.textContent = nyelvData.data.save || "Mentés";
  mentesGomb.classList.add("gombok");
  mentesGomb.addEventListener("click", async () => {
    const beallitasMentes = {
      volume: window.volume,
      language: window.language,
      keyBindings: {
        playerEloreMegyGombja: window.playerEloreMegyGombja,
        playerHatraMegyGombja: window.playerHatraMegyGombja,
        playerUgroGombja: window.playerUgroGombja,
        playerAttackGombja: window.playerAttackGombja,
        playerInteractGombja: window.playerInteractGombja
      }
    };
    await FelhBeallitasMentes(jelenlegiFelh, beallitasMentes);
    alert(nyelvData.data.savedMessage || "Beállítások mentve!");
  });
  container.appendChild(mentesGomb);

  //vissza gomb
  const vissza = visszaGomb(nyelvData.data.back || "Vissza");
  container.appendChild(vissza);

  document.body.appendChild(container);
}
