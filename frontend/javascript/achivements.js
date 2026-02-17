import { fecthData, oldalTakarito, visszaGomb, dekor_vonal_blokkal } from "./index.js";
import { nyelv } from "./options.js";

export async function ShowAchivements() {
    oldalTakarito();
    const data = await fecthData("http://127.0.0.1:3000/api/nyelv_alapjan_JSON_olvasas/" + nyelv + "/achivements.json");

    console.log("Achivements megjelenítése: "+data.data);
    document.body.appendChild(visszaGomb(data.data.vissza));
    
}