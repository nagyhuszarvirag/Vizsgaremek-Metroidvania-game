import { fecthData, oldalTakarito } from "./index.js";
import { modalLetrehoz } from "./bejelentkezes_regisztracio.js";
import { sutiModalKeszit } from "./suti_modal.js";
import { startGame } from "./start_game.js";
import { volume, nyelv } from "./options.js";
import { loadCredits } from "./credits.js";
import { beallitasMenuLetrehoz } from "./beallitas_menu.js";
import { ShowAchivements } from "./achivements.js";

//segédfüggvények
function getUserFromStorage() {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : { id: 0, usernev: "guest", jog: 2 };
}

function setGuestUser() {
  localStorage.setItem("user", JSON.stringify({ id: 0, usernev: "guest", jog: 2 }));
}

//kirajzolja a megfelelő gombot (bejelentkezés vagy kijelentkezés)
async function renderAuthButton(authContainer, data) {
  authContainer.innerHTML = "";

  const user = getUserFromStorage();

  //ha be van jelentkezve
  if (user.id && user.id !== 0) {
    const logoutBtn = document.createElement("button");
    logoutBtn.classList.add("gombok");
    logoutBtn.textContent = data.data.logout;

    logoutBtn.onclick = () => {
      const ok = confirm(data.data.logoutConfirm);
      if (!ok) return;

      setGuestUser();

      window.dispatchEvent(new CustomEvent("authChanged", {
        detail: { loggedIn: false }
      }));

      renderAuthButton(authContainer, data);
    };

    authContainer.appendChild(logoutBtn);
    return;
  }

  //ha guest
  const loginBtn = document.createElement("button");
  loginBtn.classList.add("gombok");
  loginBtn.textContent = data.data.login;

  let authModal = null;
  loginBtn.onclick = async () => {
    if (!authModal) authModal = await modalLetrehoz();
    authModal.style.display = "flex";
  };

  authContainer.appendChild(loginBtn);
}


export async function createMainMenu() {
  oldalTakarito();
  const data = await fecthData("http://127.0.0.1:3000/api/nyelv_alapjan_JSON_olvasas/" + nyelv + "/main_menu.json");

  const VanEZene = document.getElementById('zenemarad');

  if (!VanEZene) {
    zeneLetrehoz(data);
  }

  window.addEventListener("hangeroValtozas", (e) => {
    const zene = document.getElementById("zenemarad");
    if (!zene) return;

    const vol = Number(e.detail.volume);
    if (isNaN(vol)) return;

    zene.volume = Math.min(1, Math.max(0, vol));
  });

  const zene = document.getElementById('zenemarad');

  const zeneGomb = document.createElement("button");
  zeneGomb.id = "zeneGomb";
  zeneGomb.classList.add("gombok");
  zeneGomb.textContent = data.data.music[0];

  zeneGomb.addEventListener("click", () => {
    if (zene.muted) {
      zene.muted = false;
      zene.play(); //user interact ez engedélyezett böngészőkben
      window.dispatchEvent(new CustomEvent("hangeroValtozas", {
        detail: { volume }
      }));
      zeneGomb.textContent = data.data.music[1];
    } else {
      zene.muted = true;
      zeneGomb.textContent = data.data.music[0];
    }
  });

  document.body.appendChild(zeneGomb);


  /*const bejelentkezesGomb = document.createElement("button");
  bejelentkezesGomb.textContent = data.data.login;
  bejelentkezesGomb.classList.add("gombok");
  let authModal = null;
  bejelentkezesGomb.addEventListener("click", async () => {
    if (!authModal) {
      authModal = await modalLetrehoz();
    }
    authModal.style.display = "flex";
  });*/

  const authContainer = document.createElement("div");
  authContainer.id = "authContainer";
  await renderAuthButton(authContainer, data);

  const menu = document.createElement("div");
  menu.id = "menu";

  const title = document.createElement("h1");
  title.id = "menu-cim";
  title.textContent = data.data.title;

  const gombTarolo = document.createElement("div");

  data.data.buttons.forEach((gombText, index) => {

    const gomb = document.createElement("button");
    gomb.classList.add("menu-gomb", "gombok");
    gomb.textContent = data.data.buttons[index];

    gomb.addEventListener("click", () => {
      switch (index) {
        case 0:
          startGame();
          break;

        case 1:
          const userData = JSON.parse(localStorage.getItem('user')) || { id: 0 };
          beallitasMenuLetrehoz(userData.id);
          break;

        case 2:
          ShowAchivements();
          break;

        case 3:
          loadCredits();
          break;

        case 4:
          console.log("Kilépés");
          import("./exit.js");
          break;

        default:
          console.log("Ismeretlen gomb");
          break;
      }
    });

    gombTarolo.appendChild(gomb);
  });

  menu.appendChild(title);
  menu.appendChild(gombTarolo);
  menu.appendChild(zeneGomb);
  //menu.appendChild(bejelentkezesGomb);
  menu.appendChild(authContainer);
  document.body.appendChild(menu);

  //süti modal
  await sutiModalKeszit();
}

function zeneLetrehoz(data) {
  const zene = document.createElement("audio");

  zene.src = "../audio/the_humbling_river.mp3";
  zene.loop = true;
  zene.autoplay = true;
  zene.muted = true; // induláskor némának kell lennie
  zene.preload = "auto";
  zene.id = "zenemarad";

  document.body.appendChild(zene);
}


document.addEventListener("DOMContentLoaded", async () => {
  createMainMenu();
});

window.addEventListener("authChanged", () => {
  createMainMenu();
});