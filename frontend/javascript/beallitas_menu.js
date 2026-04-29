// beallitas_menu.js
import {
  oldalTakarito,
  fecthData,
  visszaGomb,
  dekor_vonal_blokkal,
} from "./index.js";

import { settings, irNyelv } from "./options.js";
import { adminPanelLetrehoz } from "./admin_panel.js";

let jelenlegiFelh = null;

const DEFAULT_SETTINGS = {
  volume: 0.5,
  nyelv: 1,
  controls: {
    forward: "d",
    back: "a",
    jump: "space",
    attack: "left click",
    interact: "e",
  },
  mobileMode: false,
};

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

async function betoltFelhFiok(userId) {
  if (!userId || userId === 0) return null;

  try {
    const res = await fetch(`http://127.0.0.1:3000/api/fiokadat/${userId}`);
    const data = await res.json();

    if (data.success) return data.data;
  } catch (e) {
    console.error("Hiba a felhasználói fiókadatok betöltésénél:", e);
  }

  return null;
}

async function FelhBeallitasMentes(userId, beallitas) {
  if (!userId || userId === 0) return;

  const updates = [
    { key: "hangero", value: beallitas.volume },
    { key: "nyelv_id", value: beallitas.language },
    { key: "kiosztas", value: beallitas.keyBindings },
  ];

  try {
    for (const u of updates) {
      await fetch("http://127.0.0.1:3000/api/felhasznalo/beallitas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          key: u.key,
          value: u.value,
        }),
      });
    }
  } catch (e) {
    console.error("Hiba a felhasználói beállítások mentésénél:", e);
  }
}

async function mentFelhBeallitas(userId, data) {
  await fetch(`http://127.0.0.1:3000/api/user/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

async function fiokTorles(userId) {
  await fetch(`http://127.0.0.1:3000/api/user/${userId}`, {
    method: "DELETE",
  });

  localStorage.clear();
  location.reload();
}

function kiosztasNormalizal(kiosztas) {
  if (!kiosztas) return {};

  if (typeof kiosztas === "string") {
    try {
      return JSON.parse(kiosztas);
    } catch {
      return {};
    }
  }

  return kiosztas;
}

export async function beallitasokBetolteseSettingsbe(userId) {
  const mentettBeallitas = await betoltFelhBeallitas(userId);

  if (mentettBeallitas) {
    settings.volume = Number(mentettBeallitas.hangero ?? DEFAULT_SETTINGS.volume);
    settings.nyelv = Number(mentettBeallitas.nyelv_id ?? DEFAULT_SETTINGS.nyelv);

    localStorage.setItem("nyelv", String(settings.nyelv));

    const kiosztas = kiosztasNormalizal(mentettBeallitas.kiosztas);

    settings.controls.forward =
      kiosztas.playerEloreMegyGombja ?? DEFAULT_SETTINGS.controls.forward;

    settings.controls.back =
      kiosztas.playerHatraMegyGombja ?? DEFAULT_SETTINGS.controls.back;

    settings.controls.jump =
      kiosztas.playerUgroGombja ?? DEFAULT_SETTINGS.controls.jump;

    settings.controls.attack =
      kiosztas.playerAttackGombja ?? DEFAULT_SETTINGS.controls.attack;

    settings.controls.interact =
      kiosztas.playerInteractGombja ?? DEFAULT_SETTINGS.controls.interact;

    if (settings.mobileMode === undefined) {
      settings.mobileMode = DEFAULT_SETTINGS.mobileMode;
    }

    return;
  }

  settings.volume = DEFAULT_SETTINGS.volume;
  settings.nyelv = Number(localStorage.getItem("nyelv") || DEFAULT_SETTINGS.nyelv);

  settings.controls.forward = DEFAULT_SETTINGS.controls.forward;
  settings.controls.back = DEFAULT_SETTINGS.controls.back;
  settings.controls.jump = DEFAULT_SETTINGS.controls.jump;
  settings.controls.attack = DEFAULT_SETTINGS.controls.attack;
  settings.controls.interact = DEFAULT_SETTINGS.controls.interact;

  if (settings.mobileMode === undefined) {
    settings.mobileMode = DEFAULT_SETTINGS.mobileMode;
  }
}

function aktualisBeallitasMentesObjektum() {
  return {
    volume: settings.volume,
    language: settings.nyelv,
    keyBindings: {
      playerEloreMegyGombja: settings.controls.forward,
      playerHatraMegyGombja: settings.controls.back,
      playerUgroGombja: settings.controls.jump,
      playerAttackGombja: settings.controls.attack,
      playerInteractGombja: settings.controls.interact,
    },
  };
}

export async function beallitasMenuLetrehoz(
  userId,
  targetContainer = document.body,
  ingame = false,
) {
  jelenlegiFelh = userId || 0;

  if (!ingame) {
    oldalTakarito();
  }

  await beallitasokBetolteseSettingsbe(jelenlegiFelh);

  const nyelvData = await fecthData(
    `http://127.0.0.1:3000/api/nyelv_alapjan_JSON_olvasas/${settings.nyelv}/beallitas_menu.json`,
  );

  const fodiv = document.createElement("div");
  fodiv.classList.add("container", "mt-5", "beallitas_menu");

  let sor = document.createElement("div");

  const cim = document.createElement("h1");
  cim.textContent = nyelvData.data.cim;
  cim.style.textAlign = "center";
  sor.appendChild(cim);

  fodiv.appendChild(sor);
  fodiv.appendChild(dekor_vonal_blokkal());

  sor = document.createElement("div");
  let tabContainer = document.createElement("div");

  tabContainer.innerText = nyelvData.data.tab[0];
  tabContainer.classList.add("p-3", "center", "gombok");

  tabContainer.addEventListener("click", () => {
    valtasAltalanos(nyelvData.data, targetContainer, ingame);
  });

  sor.appendChild(tabContainer);
  fodiv.appendChild(sor);

  sor = document.createElement("div");
  tabContainer = document.createElement("div");

  tabContainer.innerText = nyelvData.data.tab[1];
  tabContainer.classList.add("p-3", "center", "gombok");

  tabContainer.addEventListener("click", () => {
    valtasFiok(nyelvData.data, targetContainer, ingame);
  });

  sor.appendChild(tabContainer);
  fodiv.appendChild(sor);

  sor = document.createElement("div");
  sor.classList.add("gombok", "row");

  if (!ingame) {
    sor.appendChild(visszaGomb(nyelvData.data.vissza));
  }

  fodiv.appendChild(sor);
  targetContainer.appendChild(fodiv);
}

async function valtasAltalanos(
  nyelvData,
  targetContainer = document.body,
  ingame = false,
) {
  if (ingame) {
    targetContainer.innerHTML = "";
  } else {
    oldalTakarito();
  }

  const content = document.createElement("div");
  content.classList.add("container", "mt-5", "beallitas_menu");

  const cim = document.createElement("h1");
  cim.textContent = nyelvData.tab[0];
  cim.style.textAlign = "center";
  content.appendChild(cim);

  content.appendChild(dekor_vonal_blokkal());

  const hangeroLabel = document.createElement("label");
  hangeroLabel.textContent = nyelvData.hangero;

  const hangeroCsuszka = document.createElement("input");
  hangeroCsuszka.type = "range";
  hangeroCsuszka.min = 0;
  hangeroCsuszka.max = 1;
  hangeroCsuszka.step = 0.01;
  hangeroCsuszka.value = settings.volume;

  hangeroCsuszka.addEventListener("input", () => {
    settings.volume = parseFloat(hangeroCsuszka.value);

    window.dispatchEvent(
      new CustomEvent("hangeroValtozas", {
        detail: { volume: settings.volume },
      }),
    );
  });

  const hangeroContainer = document.createElement("div");
  hangeroContainer.append(hangeroLabel, hangeroCsuszka);
  hangeroContainer.style.display = "flex";
  hangeroContainer.style.justifyContent = "space-between";
  content.appendChild(hangeroContainer);

  const keyContainer = document.createElement("div");
  keyContainer.style.display = "flex";
  keyContainer.style.flexDirection = "column";
  keyContainer.style.gap = "5px";

  const keyInputs = [];
  const tiltottGombok = ["escape", "enter"];

  function normalizaltGomb(gomb) {
    return String(gomb || "").trim().toLowerCase();
  }

  function kiosztasEllenorzes() {
    let vanHiba = false;

    const darabok = {};

    keyInputs.forEach(({ input }) => {
      const ertek = normalizaltGomb(input.value);

      input.style.border = "";
      input.style.backgroundColor = "";

      if (!ertek) {
        vanHiba = true;
        input.style.border = "3px solid red";
        input.style.backgroundColor = "#ffd0d0";
        return;
      }

      if (tiltottGombok.includes(ertek)) {
        vanHiba = true;
        input.style.border = "3px solid red";
        input.style.backgroundColor = "#ffd0d0";
        return;
      }

      darabok[ertek] = (darabok[ertek] || 0) + 1;
    });

    keyInputs.forEach(({ input }) => {
      const ertek = normalizaltGomb(input.value);

      if (darabok[ertek] > 1) {
        vanHiba = true;
        input.style.border = "3px solid red";
        input.style.backgroundColor = "#ffd0d0";
      }
    });

    if (typeof mentesGomb !== "undefined") {
      mentesGomb.disabled = vanHiba;
      mentesGomb.style.opacity = vanHiba ? "0.5" : "1";
      mentesGomb.style.cursor = vanHiba ? "not-allowed" : "pointer";
    }

    return !vanHiba;
  }

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

      if (keyName === " ") {
        keyName = "space";
      }

      keyName = keyName.toLowerCase();

      setter(keyName);
      input.value = keyName;

      kiosztasEllenorzes();
    });

    input.addEventListener("dblclick", (e) => {
      e.preventDefault();

      setter("left click");
      input.value = "left click";

      kiosztasEllenorzes();
    });

    input.addEventListener("click", () => {
      input.value = "";
      input.placeholder = "Nyomj meg egy billentyűt...";
      input.focus();

      kiosztasEllenorzes();
    });

    const div = document.createElement("div");
    div.append(label, input);
    div.style.display = "flex";
    div.style.justifyContent = "space-between";

    keyInputs.push({ input, setter });

    keyContainer.appendChild(div);
  }

  billenytuInputLetrehoz(
    nyelvData.billentyu[0],
    settings.controls.forward,
    (v) => (settings.controls.forward = v),
  );

  billenytuInputLetrehoz(
    nyelvData.billentyu[1],
    settings.controls.back,
    (v) => (settings.controls.back = v),
  );

  billenytuInputLetrehoz(
    nyelvData.billentyu[2],
    settings.controls.jump,
    (v) => (settings.controls.jump = v),
  );

  billenytuInputLetrehoz(
    nyelvData.billentyu[3],
    settings.controls.attack,
    (v) => (settings.controls.attack = v),
  );

  billenytuInputLetrehoz(
    nyelvData.billentyu[4],
    settings.controls.interact,
    (v) => (settings.controls.interact = v),
  );

  content.appendChild(keyContainer);

  setTimeout(() => {
    kiosztasEllenorzes();
  }, 0);

  const nyelvLabel = document.createElement("label");
  nyelvLabel.textContent = nyelvData.nyelv[0];

  const nyelvValaszt = document.createElement("select");

  [1, 2].forEach((lang) => {
    const option = document.createElement("option");
    option.value = String(lang);
    option.textContent = nyelvData.nyelv[lang];
    nyelvValaszt.appendChild(option);
  });

  nyelvValaszt.value = String(settings.nyelv);

  nyelvValaszt.addEventListener("change", () => {
    const ujNyelv = Number(nyelvValaszt.value);

    settings.nyelv = ujNyelv;
    irNyelv(ujNyelv);

    window.dispatchEvent(
      new CustomEvent("nyelvValtozas", {
        detail: { nyelv: ujNyelv },
      }),
    );
  });

  const nyelvContainer = document.createElement("div");
  nyelvContainer.style.display = "flex";
  nyelvContainer.style.justifyContent = "space-between";
  nyelvContainer.classList.add("p-1");
  nyelvContainer.append(nyelvLabel, nyelvValaszt);
  content.appendChild(nyelvContainer);

  const telefonLabel = document.createElement("label");
  telefonLabel.textContent = nyelvData.mobilMod;

  const telefonCheckbox = document.createElement("input");
  telefonCheckbox.type = "checkbox";
  telefonCheckbox.style.width = "20px";
  telefonCheckbox.style.height = "20px";

  settings.mobileMode = window.innerWidth <= 768 || settings.mobileMode;
  telefonCheckbox.checked = settings.mobileMode;

  telefonCheckbox.addEventListener("change", () => {
    settings.mobileMode = telefonCheckbox.checked;
  });

  const telefonContainer = document.createElement("div");
  telefonContainer.append(telefonLabel, telefonCheckbox);
  telefonContainer.style.display = "flex";
  telefonContainer.style.justifyContent = "space-between";
  content.appendChild(telefonContainer);

  const mentesGomb = document.createElement("button");
  mentesGomb.textContent = nyelvData.mentes;
  mentesGomb.classList.add("gombok", "col-6");

  mentesGomb.addEventListener("click", async () => {
    if (!kiosztasEllenorzes()) {
      alert("Hibás billentyűkiosztás! Egy billentyű csak egy funkcióhoz tartozhat, az Enter és Escape pedig nem használható.");
      return;
    }

    const beallitasMentes = aktualisBeallitasMentesObjektum();

    if (jelenlegiFelh !== 0) {
      await FelhBeallitasMentes(jelenlegiFelh, beallitasMentes);
    }

    localStorage.setItem("cachedSettings", JSON.stringify(beallitasMentes));
    alert(nyelvData.mentett);
  });

  const sor = document.createElement("div");
  sor.classList.add("row");

  sor.appendChild(mentesGomb);

  let vissza;

  if (ingame) {
    vissza = document.createElement("button");
    vissza.textContent = nyelvData.vissza;
    vissza.classList.add("col-6", "gombok");

    vissza.addEventListener("click", async () => {
      targetContainer.innerHTML = "";

      const userData = JSON.parse(localStorage.getItem("user")) || { id: 0 };
      await beallitasMenuLetrehoz(userData.id, targetContainer, true);
    });
  } else {
    vissza = visszaGomb(nyelvData.vissza);
    vissza.id = "";
    vissza.classList.add("col-6", "gombok");
  }

  sor.appendChild(vissza);
  content.appendChild(sor);

  targetContainer.appendChild(content);
}

async function valtasFiok(
  nyelvData,
  targetContainer = document.body,
  ingame = false,
) {
  if (ingame) {
    targetContainer.innerHTML = "";
  } else {
    oldalTakarito();
  }

  const content = document.createElement("div");
  content.classList.add("container", "mt-5", "beallitas_menu");

  const h1 = document.createElement("h1");
  h1.textContent = nyelvData.tab[1];
  h1.style.textAlign = "center";
  content.appendChild(h1);

  content.appendChild(dekor_vonal_blokkal());

  if (!jelenlegiFelh || jelenlegiFelh === 0) {
    const p = document.createElement("p");
    p.textContent = nyelvData.fiokszoveg;
    p.style.textAlign = "center";
    content.appendChild(p);

    content.appendChild(dekor_vonal_blokkal());
    content.appendChild(beallitasVisszaGomb(nyelvData, targetContainer, ingame));

    targetContainer.appendChild(content);
    return;
  }

  const felhasznalo = await betoltFelhFiok(jelenlegiFelh);

  if (!felhasznalo) {
    const p = document.createElement("p");
    p.textContent = "Hiba: nem sikerült betölteni a felhasználó adatait.";
    p.style.textAlign = "center";
    content.appendChild(p);

    content.appendChild(dekor_vonal_blokkal());
    content.appendChild(beallitasVisszaGomb(nyelvData, targetContainer, ingame));

    targetContainer.appendChild(content);
    return;
  }

  const felhContainer = document.createElement("div");
  felhContainer.style.cssText = `
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-top: 20px;
  `;

  const felhDiv = document.createElement("div");
  felhDiv.style.cssText = `
    display: flex;
    flex-direction: column;
  `;

  const felhLabel = document.createElement("label");
  felhLabel.textContent = nyelvData.felhasznalonev;

  const felhInput = document.createElement("input");
  felhInput.value = felhasznalo.username || "";
  felhInput.style.cssText = "padding: 8px; font-size: 16px;";

  felhDiv.append(felhLabel, felhInput);

  const emailDiv = document.createElement("div");
  emailDiv.style.cssText = `
    display: flex;
    flex-direction: column;
  `;

  const emailLabel = document.createElement("label");
  emailLabel.textContent = nyelvData.email;

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

  const mentesGombFiok = document.createElement("button");
  mentesGombFiok.textContent = nyelvData.fiokmentes;
  mentesGombFiok.classList.add("gombok");
  mentesGombFiok.style.cssText = `
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
  `;

  mentesGombFiok.addEventListener("click", async () => {
    await mentFelhBeallitas(jelenlegiFelh, {
      username: felhInput.value,
      user_email: emailInput.value,
    });

    alert(nyelvData.fiokalert);
  });

  const torlesGomb = document.createElement("button");
  torlesGomb.textContent = nyelvData.torles;
  torlesGomb.classList.add("gombok");
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
  });

  const admin_panel = document.createElement("button");
  admin_panel.textContent = nyelvData.admin;
  admin_panel.classList.add("gombok");
  admin_panel.style.cssText = `
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
  `;

  admin_panel.addEventListener("click", () => {
    adminPanelLetrehoz();
  });

  const userLS = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = userLS?.jog === 1;

  gombContainer.append(mentesGombFiok, torlesGomb);

  if (isAdmin) {
    gombContainer.append(admin_panel);
  }

  felhContainer.append(felhDiv, emailDiv, gombContainer);

  content.appendChild(felhContainer);
  content.appendChild(dekor_vonal_blokkal());
  content.appendChild(beallitasVisszaGomb(nyelvData, targetContainer, ingame));

  targetContainer.appendChild(content);
}

function beallitasVisszaGomb(nyelvData, targetContainer, ingame) {
  if (!ingame) {
    return visszaGomb(nyelvData.vissza);
  }

  const vissza = document.createElement("button");
  vissza.textContent = nyelvData.vissza;
  vissza.classList.add("menu-gomb", "gombok");

  vissza.addEventListener("click", async () => {
    targetContainer.innerHTML = "";

    const userData = JSON.parse(localStorage.getItem("user")) || { id: 0 };
    await beallitasMenuLetrehoz(userData.id, targetContainer, true);
  });

  return vissza;
}

window.addEventListener("nyelvValtozas", () => {
  const user = JSON.parse(localStorage.getItem("user"));

  beallitasMenuLetrehoz(user?.id || 0);
});