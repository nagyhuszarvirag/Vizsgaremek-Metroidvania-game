import { setBackgroundColor, MapColliderek,NPCCollider } from "./Szobakezelo.js";
import { fecthData } from "../../index.js";
import { jatekos_betolt } from "../entitások/jatekos.js";

export async function Kezdoszoba(k) {
    setBackgroundColor(k, "#000000");

    const kezdoszoba_data = await fecthData("http://127.0.0.1:3000/api/map_data/kezdomap.json");

    let xpos = 191; //ezt majd később rendesen le kell kezelni vagy valami, ez a savepoint_1 kezdopontjai
    let ypos = 566;

    /*k.camPos(xpos, ypos);
    k.camScale(3);*/

  
  
    const szoba_layerek = kezdoszoba_data.data.layers;
    const map = k.add([k.pos(0, 0), k.sprite("Kezdoszoba")]);

    MapColliderek(k, map, szoba_layerek[1].objects);
    NPCCollider(k, szoba_layerek[2].objects, "Prowl");

    //MapColliderek(k, map, szoba_layerek[1].objects);


    //map méret pixelben
    const mapW = 30 * 32;
    const mapH = 20 * 32;

    //láthatatlan falak vastagsága
    const T = 32;

    //bal
    map.add([
        k.pos(-T, 0),
        k.rect(T, mapH),
        k.area(),
        k.body({ isStatic: true }),
        k.opacity(0),
        "Solid",
    ]);

    //jobb
    map.add([
        k.pos(mapW, 0),
        k.rect(T, mapH),
        k.area(),
        k.body({ isStatic: true }),
        k.opacity(0),
        "Solid",
    ]);

    //alsó
    map.add([
        k.pos(0, mapH),
        k.rect(mapW, T),
        k.area(),
        k.body({ isStatic: true }),
        k.opacity(0),
        "Solid",
    ]);

    //felső
    map.add([
        k.pos(0, -T),
        k.rect(mapW, T),
        k.area(),
        k.body({ isStatic: true }),
        k.opacity(0),
        "Solid",
    ]);

    const player = jatekos_betolt(k, xpos, ypos);

    //átjáró zóna
    k.add([
        k.pos(930, 480), //ez nem biztos hogy jó helyen van
        k.rect(50, 120),
        k.area(),
        k.opacity(0),
        "atjaro"
    ]);

    k.onCollide("player", "atjaro", () => {
        console.log("váltás");
        k.go("mitteous");
    });
}