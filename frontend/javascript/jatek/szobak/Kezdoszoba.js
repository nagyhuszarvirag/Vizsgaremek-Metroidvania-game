import {
  setBackgroundColor,
  MapColliderek,
  NPCCollider,
  SzobakiesesKezelo,
  SzobavaltozatoKezelo
} from "./Szobakezelo.js";
import { fecthData } from "../../index.js";
import { jatekos_betolt } from "../entitások/jatekos.js";
import { Kamera_kezelo } from "../entitások/kamera.js";

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

  if (szoba_belepesi_pont != null) {
  switch (szoba_belepesi_pont) {
    case "Back_From_Mitteous":
      xpos = kezdoszoba_data.data.layers[1].objects[0].x;
      ypos = kezdoszoba_data.data.layers[1].objects[0].y;
      break;

    default:
      console.log("Ismeretlen belépési pont Kezdoszobába:", szoba_belepesi_pont);
      break;
  }
}

  const szoba_layerek = kezdoszoba_data.data.layers;
  const map = k.add([k.pos(0, 0), k.sprite("Kezdoszoba")]);

  MapColliderek(k, map, szoba_layerek[3].objects);
  NPCCollider(k, szoba_layerek[4].objects, "Prowl");

  const player = await jatekos_betolt(k, xpos, ypos);

  Kamera_kezelo(k, xpos, ypos, player, mapW, mapH);
  
  SzobakiesesKezelo(k, map, mapW, mapH);
  SzobavaltozatoKezelo(k, kezdoszoba_data.data.layers[5].objects[0].x, kezdoszoba_data.data.layers[5].objects[0].y, kezdoszoba_data.data.layers[5].objects[0].width, kezdoszoba_data.data.layers[5].objects[0].height, "Mitteous_Plateau", "Back_From_kezdomap_and_Iacon", "atjaro_mitteous");

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
