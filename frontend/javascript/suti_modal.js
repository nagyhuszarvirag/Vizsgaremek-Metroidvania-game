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
        background: rgba(0,0,0,0.75);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        font-family: Arial, sans-serif;
    `;

    //modal
    const modal = document.createElement("div");
    modal.style.cssText = `
        width: 520px;
       background: url("../../backend/img/starting_screen/sutiHatter.jpg") no-repeat center / contain;
        border: 3px solid #00cfff;
        border-radius: 14px;
        padding: 28px 28px 24px 160px;
        position: relative;
        color: #e6f6ff;
        box-shadow:
            0 0 20px #00cfff,
            inset 0 0 25px #00cfff44;
        overflow: hidden;
    `;

    //háttér
    /*const sutiHatter = document.createElement("div");
    sutiHatter.style.cssText = `
       position: absolute;
        left: -60px;
        top: 50%;
        transform: translateY(-50%);
        width: 260px;
        height: 260px;
        
        opacity: 0.18;
        filter:
            blur(1px)
            drop-shadow(0 0 30px #ffb347);
        pointer-events: none;
    `;*/

    //bezárás
    const bezar = document.createElement("div");
    bezar.textContent = "x";
    bezar.style.cssText = `
       position: absolute;
        top: 10px;
        right: 14px;
        cursor: pointer;
        font-size: 22px;
        color: #7dd9ff;
        text-shadow: 0 0 8px #00cfff;
    `;

    //cím
    const cim = document.createElement("h2");
    cim.textContent = dataNyelv.data.cim;
    cim.style.cssText = `
        margin: 0 0 10px;
        font-size: 22px;
        color: #ffffff;
        text-shadow: 0 0 10px #00cfff;
    `;

    //szöveg
    const szoveg = document.createElement("p");
    szoveg.textContent = dataNyelv.data.szoveg;
    szoveg.style.cssText = `
        margin: 0 0 20px;
        font-size: 14px;
        line-height: 1.5;
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
        //süti elfogadás mentése
        localStorage.setItem("sutiElfogad", "1");


        //guest user létrehozása ha nincs bejelentkezve senki
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
            padding: 8px 22px;
            background: linear-gradient(145deg, #1fb6ff, #0077cc);
            border: 1px solid #6fd6ff;
            color: #fff;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
            box-shadow: 0 0 15px #3cc7ff99;
        `;
    } else {
        return `
            padding: 8px 22px;
        background: transparent;
        border: 1px solid #3cc7ff;
        color: #7dd9ff;
        border-radius: 6px;
        cursor: pointer;
        `;
    }
}