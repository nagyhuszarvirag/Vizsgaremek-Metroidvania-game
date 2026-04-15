import {
  setBackgroundColor,
  MapColliderek,
  SzobakiesesKezelo,
  SzobavaltozatoKezelo,
  EffektTorles
} from "./Szobakezelo.js";
import { fecthData } from "../../index.js";
import { jatekos_betolt } from "../entitások/jatekos.js";
import { Kamera_kezelo } from "../entitások/kamera.js";

export async function End_map(k, szoba_belepesi_pont = null) {
  console.log("Kapott belépési pont:", szoba_belepesi_pont);

  EffektTorles();

  setBackgroundColor(k, "#000000");

  const mapW = 32 * 60;
  const mapH = 32 * 50;

  const mapData = await fecthData(
    "http://127.0.0.1:3000/api/map_data/end_map.json",
  );

  let xpos = mapData.data.layers[3].objects[0].x;
  let ypos = mapData.data.layers[3].objects[0].y;

  if (szoba_belepesi_pont != null) {
    switch (szoba_belepesi_pont) {
      case "Back_from_Mitteous":
        xpos = mapData.data.layers[3].objects[0].x;
        ypos = mapData.data.layers[3].objects[0].y;
        break;
    }
  }

  const szoba_layerek = mapData.data.layers;

  const kovekLayer = k.add([
    k.pos(0, 0),
    k.sprite("End_map_kovek"),
  ]);

  const map = k.add([
    k.pos(0, 0),
    k.sprite("End_map"),
  ]);

  MapColliderek(k, map, szoba_layerek[2].objects);

  const player = await jatekos_betolt(k, xpos, ypos);

  Kamera_kezelo(k, xpos, ypos, player, mapW, mapH);

  SzobakiesesKezelo(k, map, mapW, mapH);

  SzobavaltozatoKezelo(
    k,
    mapData.data.layers[4].objects[0].x,
    mapData.data.layers[4].objects[0].y,
    mapData.data.layers[4].objects[0].width,
    mapData.data.layers[4].objects[0].height,
    "Mitteous_Plateau",
    "Back_From_End_Map",
    "atjaro_mitteous"
  );
}