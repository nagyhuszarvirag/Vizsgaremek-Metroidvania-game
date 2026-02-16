import { fecthData, oldalTakarito, visszaGomb, dekor_vonal_blokkal } from "./index.js";
import { nyelv } from "./options.js";

export async function ShowAchivements() {
    oldalTakarito();
    const data = await fecthData("http://127.0.0.1:3000/api/nyelv_alapjan_JSON_olvasas/" + nyelv + "/achivements.json");

    let fodiv=document.createElement("div");
    let sor=document.createElement("div");
    fodiv.classList.add("achivement_container");

    let cim=document.createElement("h1");
    cim.classList.add("text-center");
    cim.innerText=data.data.cim;
    sor.appendChild(cim);
    fodiv.appendChild(sor);

    sor=document.createElement("div");
    sor.appendChild(dekor_vonal_blokkal());
    fodiv.appendChild(sor);

    sor=document.createElement("div");
    sor.appendChild(visszaGomb(data.data.vissza));
    fodiv.appendChild(sor);

    document.body.appendChild(fodiv);
    
}