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
      await fetch("http://127.0.0.1:3000/api/felhasznalo/beallitasok", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(u)
      });
    }
  } catch (e) {
    console.error("Hiba a felhasználói beállítások mentésénél:", e);
  }
}

//a felhasználó megváltoztatott fiók adatait menti
async function mentFelhBeallitas(userId, data) {
  await fetch(`http://127.0.0.1:3000/api/user/settings/${userId}`, {
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
  window.volume = defaultVolume;
  window.language = defaultLanguage;
  window.playerEloreMegyGombja = defaultPlayerElore;
  window.playerHatraMegyGombja = defaultPlayerHatra;
  window.playerUgroGombja = defaultPlayerUgro;
  window.playerAttackGombja = defaultPlayerAttack;
  window.playerInteractGombja = defaultPlayerInteract;
  window.mobileMode = defaultMobileMode;

  /*backendből lekérjük a felhasználói beállításokat ha van
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
  }*/

  //nyelv adatok betöltése JSON-ból
  const nyelvData = await fecthData(`http://127.0.0.1:3000/api/nyelv_alapjan_JSON_olvasas/${window.language}/beallitas_menu.json`);

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
  altalanosTab.textContent = "Általános";
  const fiokTab = document.createElement("button");
  fiokTab.textContent = "Fiók";

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
    hangeroCsuszka.addEventListener("input", () => { window.volume = parseFloat(hangeroCsuszka.value); });

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
    ["magyar", "english"].forEach(l => {
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
      await FelhBeallitasMentes(jelenlegiFelh, beallitasMentes);
      alert(nyelvData.data.mentett);
    });
    content.appendChild(mentesGomb);
  }

  /*hangerő
  const hangeroLabel = document.createElement("label");
  hangeroLabel.textContent = nyelvData.data.hangero;
  const hangeroCsuszka = document.createElement("input");
  hangeroCsuszka.type = "range";
  hangeroCsuszka.min = 0;
  hangeroCsuszka.max = 1;
  hangeroCsuszka.step = 0.01;
  hangeroCsuszka.value = window.volume;
  hangeroCsuszka.addEventListener("input", () => { window.volume = parseFloat(hangeroCsuszka.value); });

  const hangeroContainer = document.createElement("div");
  hangeroContainer.append(hangeroLabel, hangeroCsuszka);
  container.appendChild(hangeroContainer);*/

  /*billentyűzet kiosztás
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

  billenytuInputLetrehoz(nyelvData.data.billentyu[0], window.playerEloreMegyGombja, v => window.playerEloreMegyGombja = v);
  billenytuInputLetrehoz(nyelvData.data.billentyu[1], window.playerHatraMegyGombja, v => window.playerHatraMegyGombja = v);
  billenytuInputLetrehoz(nyelvData.data.billentyu[2], window.playerUgroGombja, v => window.playerUgroGombja = v);
  billenytuInputLetrehoz(nyelvData.data.billentyu[3], window.playerAttackGombja, v => window.playerAttackGombja = v);
  billenytuInputLetrehoz(nyelvData.data.billentyu[4], window.playerInteractGombja, v => window.playerInteractGombja = v);

  container.appendChild(keyContainer);*/

  /*nyelv választás
  const nyelvLabel = document.createElement("label");
  nyelvLabel.textContent = nyelvData.data.nyelv;
  const nyelvValaszt = document.createElement("select");
  ["magyar", "english"].forEach(l => {
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
  container.appendChild(nyelvContainer);*/

  /*telefon mód
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
  container.appendChild(telefonContainer);*/

  /*mentés gomb
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
    await FelhBeallitasMentes(jelenlegiFelh, beallitasMentes);
    alert(nyelvData.data.mentett);
  });
  container.appendChild(mentesGomb);*/

  async function valtasFiok() {
    if (!jelenlegiFelh) {
      content.textContent = "Vendég módban nincs fiók.";
      return;
    }

    const res = await betoltFelhBeallitas(jelenlegiFelh);
    const felhasznalo = res.data;

    const felhInput = document.createElement("input");
    felhInput.value = user.username;

    const emailInput = document.createElement("input");
    emailInput.value = user.user_email;

    const mentesGombFiok = document.createElement("button");
    mentesGombFiok.textContent = "Fiók mentése";
    mentesGombFiok.onclick = async () => {
      await mentFelhBeallitas(jelenlegiFelh, {
        username: userInput.value,
        user_email: emailInput.value
      });
      alert("Fiók frissítve!");
    };

    const torlesGomb = document.createElement("button");
    torlesGomb.textContent = "Fiók törlése";
    torlesGomb.style.color = "red";
    torlesGomb.onclick = async () => {
      if (confirm("Biztosan törlöd a fiókot?")) {
        await fiokTorles(jelenlegiFelh);
      }
    };

    content.append(
      document.createTextNode("Felhasználónév"),
      felhInput,
      document.createTextNode("Email"),
      emailInput,
      mentesGombFiok,
      torlesGomb
    );
  }

  //vissza gomb
  const vissza = visszaGomb(nyelvData.data.vissza);
  container.appendChild(vissza);

  document.body.appendChild(container);
}
