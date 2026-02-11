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
  width: min(760px, 92vw);
  min-height: 260px;
  background: url("../../backend/img/starting_screen/sutiHatter.jpg") no-repeat center / cover;
  border: 2px solid #00cfff;
  border-radius: 18px;
  position: relative;
  color: #e6f6ff;
  box-shadow: 0 0 22px #00cfff, inset 0 0 18px #00cfff33;
  overflow: hidden;
`;

    const bgDim = document.createElement("div");
    bgDim.style.cssText = `
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(0,0,0,0.65),
    rgba(0,0,0,0.35),
    rgba(0,0,0,0.65)
  );
`;

    //belső tartalom panel
    const contentBox = document.createElement("div");
    contentBox.style.cssText = `
  position: absolute;
  right: 30px;
  top: 60px;
  width: 480px;
  padding: 20px;
`;

    //bezárás
    const bezar = document.createElement("div");
    bezar.textContent = "×";
    bezar.style.cssText = `
  position: absolute;
  top: 10px;
  right: 14px;
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  cursor: pointer;
  font-size: 22px;
  line-height: 1;
  color: #e6f6ff;
  border: 1px solid rgba(0,207,255,0.7);
  border-radius: 10px;
  background: rgba(0,0,0,0.35);
  text-shadow: 0 0 10px #00cfff;
`;

    //cím
    const cim = document.createElement("h2");
    cim.textContent = dataNyelv.data.cim;
    cim.style.cssText = `
  margin: 0 0 10px;
  font-size: 26px;
  font-weight: 800;
  letter-spacing: 0.3px;
  color: #ffffff;
  text-shadow: 0 0 12px rgba(0,207,255,0.9);
`;

    //szöveg
    const szoveg = document.createElement("p");
    szoveg.textContent = dataNyelv.data.szoveg;
    szoveg.style.cssText = `
  margin: 0 0 16px;
  font-size: 15px;
  line-height: 1.55;
  color: #d8f3ff;
  text-shadow: 0 0 6px rgba(0,0,0,0.8);
`;

    //gombok konténere
    const gombSor = document.createElement("div");
    gombSor.style.cssText = `
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 10px;
`;

    //részletek gomb
    const reszletekGomb = document.createElement("button");
    reszletekGomb.textContent = dataNyelv.data.reszletGomb;
    reszletekGomb.style.cssText = sciFiGombStyle(false);
    reszletekGomb.onclick = () => alert(dataNyelv.data.szabalyzat);

    //elfogadás gomb
    const elfogadasGomb = document.createElement("button");
    elfogadasGomb.textContent = dataNyelv.data.elfogadasGomb;
    elfogadasGomb.style.cssText = sciFiGombStyle(true);
    elfogadasGomb.onclick = () => {
        localStorage.setItem("sutiElfogad", "1");
        if (!localStorage.getItem("user")) {
            localStorage.setItem("user", JSON.stringify({
                id: 0,
                usernev: "guest",
                jog: 2
            }));
        }

        window.dispatchEvent(new CustomEvent("authChanged", { detail: { loggedIn: false } }));
        overlay.remove();
    };

    bezar.onclick = () => overlay.remove();

    gombSor.append(reszletekGomb, elfogadasGomb);
    contentBox.append(cim, szoveg, gombSor);

    modal.append(bgDim, contentBox, bezar);
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