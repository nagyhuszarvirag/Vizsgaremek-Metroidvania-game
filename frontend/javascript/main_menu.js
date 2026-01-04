import { fecthData } from "./index.js";

let nyelv = "hungarian"; //alapértelmezett nyelv

async function createMainMenu() {
    const data = await fecthData("http://127.0.0.1:3000/api/JSONolvas/" + nyelv + "/main_menu.json");

    console.log(data.data);

    const menu = document.createElement("div");
    menu.id = "menu";

    const title = document.createElement("h1");
    title.id = "menu-cim";
    title.textContent = data.data.title;

    const gombTarolo = document.createElement("div");
    gombTarolo.class = "gombok";

    data.data.buttons.forEach((gombText, index) => {

    const gomb = document.createElement("button");
    gomb.className = "menu-gomb";
    gomb.textContent = data.data.buttons[index];

    gomb.addEventListener("click", () => {
      console.log(`Clicked: ${gombText}`);
      //Itt hozzáadni a gombok funkcióit
    });

    gombTarolo.appendChild(gomb);
    });

  
    menu.appendChild(title);
    menu.appendChild(gombTarolo);
    document.body.appendChild(menu);
}

document.addEventListener("DOMContentLoaded", async () => {
    createMainMenu();
});