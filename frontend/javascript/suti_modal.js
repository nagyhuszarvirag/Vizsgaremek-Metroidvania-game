import { fecthData } from "./index.js";
import { nyelv } from "./options.js";

export async function sutiModalKeszit() {
    const dataNyelv = await fecthData("http://127.0.0.1:3000/api/nyelv_alapjan_JSON_olvasas/" + nyelv + "/suti_modal.json");

    if (localStorage.getItem("sutiElfogad")) return;

    //overlay
    const overlay = document.createElement("div");
    overlay.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.65);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        font-family: Arial, sans-serif;
    `;

    //modal
    const modal = document.createElement("div");
    modal.style.cssText = `
        width: 480px;
        background: linear-gradient(145deg, #0b1324, #111c33);
        border: 2px solid #3cc7ff;
        border-radius: 12px;
        padding: 20px 24px;
        color: #e6f6ff;
        position: relative;
        box-shadow: 0 0 25px #3cc7ff55;
    `;

    //bezárás
    const bezar = document.createElement("div");
    bezar.textContent = "x";
    bezar.style.cssText = `
        position: absolute;
        top: 10px;
        right: 12px;
        cursor: pointer;
        color: #7dd9ff;
        font-size: 18px;
    `;

    //cím
    const cim = document.createElement("h2");
    cim.textContent = dataNyelv.data.cim;
    cim.style.cssText = `
        margin-top: 0;
        color: #7dd9ff;
        text-shadow: 0 0 6px #3cc7ff;
    `;

    //szöveg
    const szoveg = document.createElement("p");
    szoveg.textContent = dataNyelv.data.szoveg;
    szoveg.style.cssText = `
        font-size: 14px;
        line-height: 1.5;
        margin-bottom: 20px;
        color: #cfefff;
    `;

    //gombok konténere
    const gombSor = document.createElement("div");
    gombSor.style.cssText = `
        display: flex;
        justify-content: flex-end;
        gap: 12px;
    `;

    //részletek gomb
    const reszletekGomb = document.createElement("button");
    reszletekGomb.textContent = dataNyelv.data.reszletGomb;
    reszletekGomb.style.cssText = sciFiGombStyle(false);

    reszletekGomb.onclick = () => {
        alert(dataNyelv.data.szabalyzat);
    };

    //elfogadás gomb
    const elfogadasGomb = document.createElement("button");
    elfogadasGomb.textContent = dataNyelv.data.elfogadasGomb;
    elfogadasGomb.style.cssText = sciFiGombStyle(true);

    elfogadasGomb.onclick = () => {
        // süti elfogadás mentése
        localStorage.setItem("sutiElfogad", "1");


        // guest user létrehozása ha nincs bejelentkezve senki
        if (!localStorage.getItem("user")) {
            localStorage.setItem("user", JSON.stringify({
                id: 0,
                username: "Guest",
                jog: 2
            }));
        }


        overlay.remove();
    };

    bezar.onclick = () => overlay.remove();

    gombSor.append(reszletekGomb, elfogadasGomb);
    modal.append(bezar, cim, szoveg, gombSor);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
}

function sciFiGombStyle(primary) {
    if (primary) {
        return `
            padding: 8px 18px;
            background: linear-gradient(145deg, #1fb6ff, #0077cc);
            border: 1px solid #6fd6ff;
            color: #fff;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
            box-shadow: 0 0 10px #3cc7ff99;
        `;
    } else {
        return `
            padding: 8px 18px;
            background: transparent;
            border: 1px solid #3cc7ff;
            color: #7dd9ff;
            border-radius: 6px;
            cursor: pointer;
        `;
    }
}