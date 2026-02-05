import { nyelv } from "./options.js";
import { fecthData } from "./index.js";
console.log("sikeres betöltés 4");

//Imi, itt legyen egy popup vagy valami, hogy biztosan ki akar-e lépni a játékból mielőtt bezárja az ablakot
// exit.js

(async function () {
    const dataNyelv = await fecthData("http://127.0.0.1:3000/api/nyelv_alapjan_JSON_olvasas/" + nyelv + "/exit.json");
    const biztos = confirm(dataNyelv.data.felugAblak);

    if (!biztos) return;
    window.close();

    document.body.innerHTML = "";
    document.body.style.background = "black";

    const exitScreen = document.createElement("div");
    exitScreen.style.cssText = `
        color: white;
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-family: sans-serif;
    `;

    exitScreen.innerHTML = `
        <h1>${dataNyelv.data.cim}</h1>
        <p>${dataNyelv.data.szoveg}</p>
    `;

    document.body.appendChild(exitScreen);
})();
