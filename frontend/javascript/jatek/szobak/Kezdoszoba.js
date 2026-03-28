import {
  setBackgroundColor,
  MapColliderek,
  NPCCollider,
  SzobakiesesKezelo,
  SzobavaltozatoKezelo
} from "./Szobakezelo.js";
import { fecthData } from "../../index.js";
import { jatekos_betolt } from "../entitások/jatekos.js";

export async function Kezdoszoba(k,  szoba_belepesi_pont = null) {
  setBackgroundColor(k, "#00001b");

  //map méret pixelben
  const mapW = 32 * 60;
  const mapH = 32 * 50;

  const kezdoszoba_data = await fecthData(
    "http://127.0.0.1:3000/api/map_data/kezdomap.json",
  );

  let xpos = kezdoszoba_data.data.layers[2].objects[0].x;
  let ypos = kezdoszoba_data.data.layers[2].objects[0].y;

  const szoba_layerek = kezdoszoba_data.data.layers;
  const map = k.add([k.pos(0, 0), k.sprite("Kezdoszoba")]);

  MapColliderek(k, map, szoba_layerek[3].objects);
  NPCCollider(k, szoba_layerek[4].objects, "Prowl");

  const player = jatekos_betolt(k, xpos, ypos);
  
  SzobakiesesKezelo(k, map, mapW, mapH);
  SzobavaltozatoKezelo(k, kezdoszoba_data.data.layers[5].objects[0].x, kezdoszoba_data.data.layers[5].objects[0].y, kezdoszoba_data.data.layers[5].objects[0].width, kezdoszoba_data.data.layers[5].objects[0].height, "Mitteous_Plateau");

/*

  //átjáró zóna
  k.add([
    k.pos(930, 480), //ez nem biztos hogy jó helyen van
    k.rect(50, 120),
    k.area(),
    k.opacity(0),
    "atjaro",
  ]);

  k.onCollide("player", "atjaro", () => {
    console.log("váltás");
    k.go("mitteous");
  });*/
}
