import { fecthData, masikJSMeghivasa } from "./index.js";

let nyelv = "hungarian"; //alapértelmezett nyelv

async function createMainMenu() {
    const data = await fecthData("http://127.0.0.1:3000/api/JSONolvas/" + nyelv + "/main_menu.json");

    console.log(data.data);

    const zene=document.createElement("audio");

    let zenehelye=document.createElement("source"); //valamiért nem jó, nincs error.
    zenehelye.src="../audio/the_humbling_river.mp3";
    zenehelye.type="audio/mp3";
    zene.appendChild(zenehelye);

    zene.loop=true;
    zene.autoplay=true;
    zene.muted=true;
    
    zene.appendChild(zenehelye);
    document.body.appendChild(zene);

    const zeneGomb = document.createElement("button");

    zeneGomb.id="zeneGomb";
    zeneGomb.classList.add("gombok");
    zeneGomb.textContent=data.data.music[0];
    zeneGomb.addEventListener("click", () => {
      if (zene.muted) {
        zene.muted = false;
        zeneGomb.textContent=data.data.music[1];
      }
      else {
        zene.muted = true;
        zeneGomb.textContent=data.data.music[0];
      }
    });

    const bejelentkezesGomb = document.createElement("button");
    bejelentkezesGomb.textContent=data.data.login;
    bejelentkezesGomb.classList.add("gombok");
    bejelentkezesGomb.addEventListener("click", () => {
      masikJSMeghivasa("../javascript/bejelentkezes_regisztracio.js");
    });

    const menu = document.createElement("div");
    menu.id = "menu";

    const title = document.createElement("h1");
    title.id = "menu-cim";
    title.textContent = data.data.title;

    const gombTarolo = document.createElement("div");
    const centerbe = document.createElement("center");

    data.data.buttons.forEach((gombText, index) => {

    const gomb = document.createElement("button");
    gomb.classList.add("menu-gomb");
    gomb.classList.add("gombok");
    gomb.textContent = data.data.buttons[index];

    gomb.addEventListener("click", () => {
      console.log(`Clicked: ${gombText}, index: ${index}`);
      switch (index) {
        case 0: 
          console.log("Játék indítása");
          masikJSMeghivasa("../javascript/start_game.js");
          break;

        case 1: 
          console.log("Beállítások");
          masikJSMeghivasa("../javascript/options.js");
          break;

        case 2:
          console.log("Extrák");
          masikJSMeghivasa("../javascript/extras.js");
          break;

        case 3: 
          console.log("Kreditek");
          masikJSMeghivasa("../javascript/credits.js");
          break;

        case 4:
          console.log("Kilépés");
          masikJSMeghivasa("../javascript/exit.js");
          break;
        
        default:
          console.log("Ismeretlen gomb");
          break;
    }
    });

    centerbe.appendChild(gomb);
    });
    gombTarolo.appendChild(centerbe);
  
    menu.appendChild(title);
    menu.appendChild(gombTarolo);
    menu.appendChild(zeneGomb);
    menu.appendChild(bejelentkezesGomb);
    document.body.appendChild(menu);
}



document.addEventListener("DOMContentLoaded", async () => {
    createMainMenu();
});