import {setBackgroundColor, MapColliderek} from "./Szobakezelo.js";
import {fecthData} from "../../index.js";
import {jatekos_betolt} from "../entitások/jatekos.js";

export async function Kezdoszoba(k) {
    setBackgroundColor(k, "#000000");
    const kezdoszoba_data=await fecthData("http://127.0.0.1:3000/api/map_data/kezdomap.json");
    
    const szoba_layerek=kezdoszoba_data.data.layers;
    const map = k.add([k.pos(0, 0), k.sprite("Kezdoszoba")]);

    MapColliderek(k, map, szoba_layerek[1].objects);

    let xpos=191; //ezt majd később rendesen le kell kezelni vagy valami, ez a savepoint_1 kezdopontjai
    let ypos=566; 

    jatekos_betolt(k, xpos, ypos); 
}