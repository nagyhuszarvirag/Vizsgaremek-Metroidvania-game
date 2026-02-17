// beallitas_menu.js
import { oldalTakarito, fecthData, visszaGomb, dekor_vonal_blokkal } from "./index.js";
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
  const taroltNyelv = localStorage.getItem("nyelv");
  if (taroltNyelv) {
    window.language = taroltNyelv;
  } else {
    window.language = defaultLanguage;
  }

  if (window.playerEloreMegyGombja === undefined) window.playerEloreMegyGombja = defaultPlayerElore;
  if (window.playerHatraMegyGombja === undefined) window.playerHatraMegyGombja = defaultPlayerHatra;
  if (window.playerUgroGombja === undefined) window.playerUgroGombja = defaultPlayerUgro;
  if (window.playerAttackGombja === undefined) window.playerAttackGombja = defaultPlayerAttack;
  if (window.playerInteractGombja === undefined) window.playerInteractGombja = defaultPlayerInteract;

  if (window.mobileMode === undefined) window.mobileMode = defaultMobileMode;


  //nyelv adatok betöltése JSON-ból
  const nyelvData = await fecthData(`http://127.0.0.1:3000/api/nyelv_alapjan_JSON_olvasas/${nyelv}/beallitas_menu.json`);


  let fodiv = document.createElement("div");
  fodiv.classList.add("container", "mt-5", "beallitas_menu");

  let sor = document.createElement("div");

  //Cím
  const cim = document.createElement("h1");
  cim.textContent = nyelvData.data.cim;
  cim.style.textAlign = "center";
  sor.appendChild(cim);

  fodiv.appendChild(sor);

  //Dekor vonal
  fodiv.appendChild(dekor_vonal_blokkal());

  //Beállítások tartalma (tabok)
  sor = document.createElement("div");
  let tabContainer = document.createElement("div");

  tabContainer.innerText = nyelvData.data.tab[0];
  tabContainer.classList.add("p-3", "center", "gombok");

  tabContainer.addEventListener("click", () => {
    valtasAltalanos(nyelvData.data);
  });

  sor.appendChild(tabContainer);
  fodiv.appendChild(sor);

  sor = document.createElement("div");
  tabContainer = document.createElement("div");

  tabContainer.innerText = nyelvData.data.tab[1];
  tabContainer.classList.add("p-3", "center", "gombok");

  tabContainer.addEventListener("click", () => {
    valtasFiok(nyelvData.data);
  });

  sor.appendChild(tabContainer);
  fodiv.appendChild(sor);

  //Vissza gomb
  sor = document.createElement("div");

  sor.appendChild(visszaGomb(nyelvData.data.vissza));
  sor.classList.add("gombok", "row");

  fodiv.appendChild(sor);

  document.body.appendChild(fodiv);
}

//általános beállítások
async function valtasAltalanos(nyelvData) {
  oldalTakarito();
  let content = document.createElement("div");
  content.classList.add("container", "mt-5", "beallitas_menu");

  const cim = document.createElement("h1");
  cim.textContent = nyelvData.tab[0];
  cim.style.textAlign = "center";
  content.appendChild(cim);

  content.appendChild(dekor_vonal_blokkal());


  //hangerő
  const hangeroLabel = document.createElement("label");
  hangeroLabel.textContent = nyelvData.hangero;
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
  hangeroContainer.style.display = "flex";
  hangeroContainer.style.justifyContent = "space-between";
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
    keyContainer.appendChild(div);
    content.appendChild(keyContainer)
  }

  billenytuInputLetrehoz(nyelvData.billentyu[0], window.playerEloreMegyGombja, v => window.playerEloreMegyGombja = v);
  billenytuInputLetrehoz(nyelvData.billentyu[1], window.playerHatraMegyGombja, v => window.playerHatraMegyGombja = v);
  billenytuInputLetrehoz(nyelvData.billentyu[2], window.playerUgroGombja, v => window.playerUgroGombja = v);
  billenytuInputLetrehoz(nyelvData.billentyu[3], window.playerAttackGombja, v => window.playerAttackGombja = v);
  billenytuInputLetrehoz(nyelvData.billentyu[4], window.playerInteractGombja, v => window.playerInteractGombja = v);

  //oldal nyelvének beállítása
  const nyelvLabel = document.createElement("label");
  nyelvLabel.textContent = nyelvData.nyelv[0];
  const nyelvValaszt = document.createElement("select");
  ["hungarian", "english"].forEach(l => {
    const option = document.createElement("option");
    option.value = l;
    option.textContent = l === "hungarian" ? nyelvData.nyelv[1] : nyelvData.nyelv[2];
    if (l === window.language) option.selected = true;
    nyelvValaszt.appendChild(option);
  });
  nyelvValaszt.addEventListener("change", () => {
    const ujNyelv = nyelvValaszt.value;

    localStorage.setItem("nyelv", ujNyelv);
    window.language = ujNyelv;

    irNyelv(ujNyelv);

    window.dispatchEvent(new CustomEvent("nyelvValtozas", {
      detail: { nyelv: ujNyelv }
    }));
  });
  const nyelvContainer = document.createElement("div");
  nyelvContainer.style.display = "flex";
  nyelvContainer.style.justifyContent = "space-between";
  nyelvContainer.classList.add("p-1");
  nyelvContainer.append(nyelvLabel, nyelvValaszt);
  content.appendChild(nyelvContainer);

  //telefonos mód
  const telefonLabel = document.createElement("label");
  telefonLabel.textContent = nyelvData.mobilMod;
  const telefonCheckbox = document.createElement("input");
  telefonCheckbox.type = "checkbox";
  telefonCheckbox.style.width = "20px";
  telefonCheckbox.style.height = "20px";
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
  telefonContainer.style.display = "flex";
  telefonContainer.style.justifyContent = "space-between";
  content.appendChild(telefonContainer);

  //mentés gomb
  const mentesGomb = document.createElement("button");
  mentesGomb.textContent = nyelvData.mentes;
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
    alert(nyelvData.mentett);
  });
  let sor = document.createElement("div");
  mentesGomb.classList.add("col-6");
  sor.appendChild(mentesGomb);
  let vissza = visszaGomb(nyelvData.vissza);
  vissza.id = "";
  vissza.classList.add("col-6", "gombok");
  sor.appendChild(vissza);
  sor.classList.add("row");

  content.appendChild(sor);
  document.body.appendChild(content);
}

//fiók beállítások
async function valtasFiok(nyelvData) {

  if (!jelenlegiFelh) {
    content.textContent = nyelvData.fiokszoveg;
    return;
  }

  const felhasznalo = await betoltFelhFiok(jelenlegiFelh);

  if (!felhasznalo) {
    content.textContent = "Hiba: nem sikerült betölteni a felhasználó adatait.";
    return;
  }

  oldalTakarito();
  let content = document.createElement("div");
  let h1 = document.createElement("h1");
  h1.textContent = nyelvData.tab[1];
  h1.style.textAlign = "center";
  content.appendChild(h1);
  content.classList.add("container", "mt-5", "beallitas_menu");
  content.appendChild(dekor_vonal_blokkal());
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
  mentesGombFiok.textContent = nyelvData.fiokmentes;
  mentesGombFiok.style.cssText = `
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
  `;

  mentesGombFiok.addEventListener("click", async () => {
    await mentFelhBeallitas(jelenlegiFelh, {
      username: felhInput.value,
      user_email: emailInput.value
    });
    alert(nyelvData.fiokalert);
  });

  //törlés gomb
  const torlesGomb = document.createElement("button");
  torlesGomb.textContent = nyelvData.torles;
  torlesGomb.style.cssText = `
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    color: red;
  `;

  torlesGomb.addEventListener("click", async () => {
    if (confirm(nyelvData.torlesalert)) {
      await fiokTorles(jelenlegiFelh);
    }
  }
  );

  const admin_panel = document.createElement("button");
  admin_panel.textContent = nyelvData.admin;
  admin_panel.style.cssText = `
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    `;

  admin_panel.addEventListener("click", () => {
    console.log("Admin panel megnyitása, de még fejlesztés alatt van");
  });

  admin_panel.classList.add("gombok");
  mentesGombFiok.classList.add("gombok");
  torlesGomb.classList.add("gombok");

  gombContainer.append(mentesGombFiok, torlesGomb, admin_panel);

  felhContainer.append(felhDiv, emailDiv, gombContainer);

  content.appendChild(felhContainer);

  content.appendChild(dekor_vonal_blokkal());
  content.appendChild(visszaGomb(nyelvData.vissza));

  document.body.appendChild(content);
}

window.addEventListener("nyelvValtozas", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  beallitasMenuLetrehoz(user?.id || 0);
});
