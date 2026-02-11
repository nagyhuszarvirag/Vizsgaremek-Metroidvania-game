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
  mobileMode as defaultMobileMode,
  irNyelv,
  nyelv
} from "./options.js";

//globális változó
let jelenlegiFelh = null;
let aktivTab = "általános"

//felhasználói beállítások lekérése backendből
async function betoltFelhBeallitas(userId) {
  if (!userId || userId === 0) return null;
  try {
    const res = await fetch(`http://127.0.0.1:3000/api/felhasznalo/${userId}`);
    const data = await res.json();
    if (data.success) return data.data;
  } catch (e) {
    console.error("Hiba a felhasználói beállítások betöltésénél:", e);
  }
  return null;
}

//felhasználói fiókadatok lekérése backendből
async function betoltFelhFiok(userId) {
  if (!userId || userId === 0) return null;
  try {
    const res = await fetch(`http://127.0.0.1:3000/api/fiokadat/${userId}`);
    const data = await res.json();
    if (data.success) return data.data;
  } catch (e) {
    console.error("Hiba a felhasználói beállítások betöltésénél:", e);
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
      await fetch("http://127.0.0.1:3000/api/felhasznalo/beallitas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          key: u.key,
          value: u.value
        })
      });
    }
  } catch (e) {
    console.error("Hiba a felhasználói beállítások mentésénél:", e);
  }
}

//a felhasználó megváltoztatott fiók adatait menti
async function mentFelhBeallitas(userId, data) {
  await fetch(`http://127.0.0.1:3000/api/user/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

//törli a felhasználó fiókját az adatbázisból
async function fiokTorles(userId) {
  await fetch(`http://127.0.0.1:3000/api/user/${userId}`, {
    method: "DELETE"
  });
  localStorage.clear();
  location.reload();
}

//beállítások menü
export async function beallitasMenuLetrehoz(userId) {
  jelenlegiFelh = userId || 0;

  oldalTakarito();

  //window változók inicializálása alapértelmezett értékekkel
  if (window.volume === undefined) window.volume = defaultVolume;
  if (window.language === undefined) window.language = defaultLanguage;

  if (window.playerEloreMegyGombja === undefined) window.playerEloreMegyGombja = defaultPlayerElore;
  if (window.playerHatraMegyGombja === undefined) window.playerHatraMegyGombja = defaultPlayerHatra;
  if (window.playerUgroGombja === undefined) window.playerUgroGombja = defaultPlayerUgro;
  if (window.playerAttackGombja === undefined) window.playerAttackGombja = defaultPlayerAttack;
  if (window.playerInteractGombja === undefined) window.playerInteractGombja = defaultPlayerInteract;

  if (window.mobileMode === undefined) window.mobileMode = defaultMobileMode;


  //nyelv adatok betöltése JSON-ból
  const nyelvData = await fecthData(`http://127.0.0.1:3000/api/nyelv_alapjan_JSON_olvasas/${nyelv}/beallitas_menu.json`);

  //menü container
  const container = document.createElement("div");
  container.style.cssText = `
    color: white;
    border: 2px solid white;
    padding: 20px;
    width: 500px;
    margin: auto;
    font-size: 18px;
  `;

  //cím
  const cim = document.createElement("h1");
  cim.textContent = nyelvData.data.cim;
  cim.style.textAlign = "center";
  container.appendChild(cim);

  //tab gombok
  const tabContainer = document.createElement("div");
  tabContainer.style.display = "flex";
  tabContainer.style.justifyContent = "space-around";

  const altalanosTab = document.createElement("button");
  altalanosTab.textContent = nyelvData.data.tab[0];
  const fiokTab = document.createElement("button");
  fiokTab.textContent = nyelvData.data.tab[1];

  tabContainer.append(altalanosTab, fiokTab);
  container.appendChild(tabContainer);

  const content = document.createElement("div");
  container.appendChild(content);

  altalanosTab.onclick = () => {
    aktivTab = "általános";
    valtas();
  };
  fiokTab.onclick = () => {
    aktivTab = "fiók";
    valtas();
  };

  async function valtas() {
    content.innerHTML = "";

    if (aktivTab === "általános") {
      valtasAltalanos();
    } else {
      await valtasFiok();
    }
  }

  //általános beállítások
  function valtasAltalanos() {

    //hangerő
    const hangeroLabel = document.createElement("label");
    hangeroLabel.textContent = nyelvData.data.hangero;
    const hangeroCsuszka = document.createElement("input");
    hangeroCsuszka.type = "range";
    hangeroCsuszka.min = 0;
    hangeroCsuszka.max = 1;
    hangeroCsuszka.step = 0.01;
    hangeroCsuszka.value = window.volume;
    hangeroCsuszka.addEventListener("input", () => {
      window.volume = parseFloat(hangeroCsuszka.value);

      window.dispatchEvent(
        new CustomEvent("hangeroValtozas", {
          detail: { volume: parseFloat(hangeroCsuszka.value) }
        })
      );
    });

    const hangeroContainer = document.createElement("div");
    hangeroContainer.append(hangeroLabel, hangeroCsuszka);
    content.appendChild(hangeroContainer);

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
      content.appendChild(keyContainer)
    }

    billenytuInputLetrehoz(nyelvData.data.billentyu[0], window.playerEloreMegyGombja, v => window.playerEloreMegyGombja = v);
    billenytuInputLetrehoz(nyelvData.data.billentyu[1], window.playerHatraMegyGombja, v => window.playerHatraMegyGombja = v);
    billenytuInputLetrehoz(nyelvData.data.billentyu[2], window.playerUgroGombja, v => window.playerUgroGombja = v);
    billenytuInputLetrehoz(nyelvData.data.billentyu[3], window.playerAttackGombja, v => window.playerAttackGombja = v);
    billenytuInputLetrehoz(nyelvData.data.billentyu[4], window.playerInteractGombja, v => window.playerInteractGombja = v);

    //oldal nyelvének beállítása
    const nyelvLabel = document.createElement("label");
    nyelvLabel.textContent = nyelvData.data.nyelv;
    const nyelvValaszt = document.createElement("select");
    ["hungarian", "english"].forEach(l => {
      const option = document.createElement("option");
      option.value = l;
      option.textContent = l === "hungarian" ? "Magyar" : "English";
      if (l === window.language) option.selected = true;
      nyelvValaszt.appendChild(option);
    });
    nyelvValaszt.addEventListener("change", () => {
      const ujNyelv = nyelvValaszt.value;

      irNyelv(ujNyelv);

      window.dispatchEvent(new CustomEvent("nyelvValtozas", {
        detail: { nyelv: ujNyelv }
      }));
    });
    const nyelvContainer = document.createElement("div");
    nyelvContainer.append(nyelvLabel, nyelvValaszt);
    content.appendChild(nyelvContainer);

    //telefonos mód
    const telefonLabel = document.createElement("label");
    telefonLabel.textContent = nyelvData.data.mobilMod;
    const telefonCheckbox = document.createElement("input");
    telefonCheckbox.type = "checkbox";
    window.mobileMode = window.innerWidth <= 768;
    telefonCheckbox.checked = window.mobileMode;
    telefonCheckbox.addEventListener("change", () => { window.mobileMode = telefonCheckbox.checked; });
    window.addEventListener("resize", () => {
      if (window.innerWidth <= 768) {
        window.mobileMode = true;
        telefonCheckbox.checked = true;
      }
    });
    const telefonContainer = document.createElement("div");
    telefonContainer.append(telefonLabel, telefonCheckbox);
    content.appendChild(telefonContainer);

    //mentés gomb
    const mentesGomb = document.createElement("button");
    mentesGomb.textContent = nyelvData.data.mentes;
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
      if (jelenlegiFelh !== 0) {
        await FelhBeallitasMentes(jelenlegiFelh, beallitasMentes);
      }
      localStorage.setItem("cachedSettings", JSON.stringify(beallitasMentes));
      alert(nyelvData.data.mentett);
    });
    
    content.appendChild(mentesGomb);
  }

  //fiók beállítások
  async function valtasFiok() {
    if (!jelenlegiFelh) {
      content.textContent = nyelvData.data.fiokszoveg;
      return;
    }

    const felhasznalo = await betoltFelhFiok(jelenlegiFelh);

    if (!felhasznalo) {
      content.textContent = "Hiba: nem sikerült betölteni a felhasználó adatait.";
      return;
    }

    //fiók adatok konténere
    const felhContainer = document.createElement("div");
    felhContainer.style.cssText = `
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-top: 20px;
  `;

    //felhasználónév inputja
    const felhDiv = document.createElement("div");
    felhDiv.style.cssText = `
    display: flex;
    flex-direction: column;
  `;
    const felhLabel = document.createElement("label");
    felhLabel.textContent = "Felhasználónév";
    const felhInput = document.createElement("input");
    felhInput.value = felhasznalo.username || "";
    felhInput.style.cssText = "padding: 8px; font-size: 16px;";
    felhDiv.append(felhLabel, felhInput);

    //email inputja
    const emailDiv = document.createElement("div");
    emailDiv.style.cssText = `
    display: flex;
    flex-direction: column;
  `;
    const emailLabel = document.createElement("label");
    emailLabel.textContent = "Email";
    const emailInput = document.createElement("input");
    emailInput.value = felhasznalo.user_email || "";
    emailInput.style.cssText = "padding: 8px; font-size: 16px;";
    emailDiv.append(emailLabel, emailInput);

    const gombContainer = document.createElement("div");
    gombContainer.style.cssText = `
    display: flex;
    gap: 10px;
    margin-top: 10px;
  `;

    //mentés gomb
    const mentesGombFiok = document.createElement("button");
    mentesGombFiok.textContent = nyelvData.data.fiokmentes;
    mentesGombFiok.style.cssText = `
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
  `;
    mentesGombFiok.onclick = async () => {
      await mentFelhBeallitas(jelenlegiFelh, {
        username: felhInput.value,
        user_email: emailInput.value
      });
      alert(nyelvData.data.fiokalert);
    };

    //törlés gomb
    const torlesGomb = document.createElement("button");
    torlesGomb.textContent = nyelvData.data.torles;
    torlesGomb.style.cssText = `
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    color: white;
    background-color: red;
  `;
    torlesGomb.onclick = async () => {
      if (confirm(nyelvData.data.torlesalert)) {
        await fiokTorles(jelenlegiFelh);
      }
    };

    gombContainer.append(mentesGombFiok, torlesGomb);

    felhContainer.append(felhDiv, emailDiv, gombContainer);

    content.appendChild(felhContainer);
  }

  //vissza gomb
  const vissza = visszaGomb(nyelvData.data.vissza);
  container.appendChild(vissza);

  document.body.appendChild(container);
}

window.addEventListener("nyelvValtozas", () => {
  beallitasMenuLetrehoz();
});
