import { setBackgroundColor, MapColliderek } from "./Szobakezelo.js";
import { fecthData } from "../../index.js";
import { jatekos_betolt } from "../entitások/jatekos.js";

export async function Mitteous(k) {

    //háttér
    setBackgroundColor(k, "#000000");

    // JSON betöltése
    const mapData = await fecthData("http://127.0.0.1:3000/api/map_data/Mitteous_Plateau.json");

    const layers = mapData.data.layers;

    //map sprite
    const map = ([
        k.pos(0, 0),
        k.sprite("Mitteous_Plateau_bal")
    ]);

    //kezdőpojnt a layerbol
    let spawnX = 200;
    let spawnY = 200;

    const spawnLayer = layers.find(l => l.name === "Kezdo_pont");

    if (spawnLayer && spawnLayer.objects.length > 0) {
        spawnX = spawnLayer.objects[0].x;
        spawnY = spawnLayer.objects[0].y;
    }

    const player = await jatekos_betolt(k, spawnX, spawnY);

    MapColliderek(k, map, layers, player);

}