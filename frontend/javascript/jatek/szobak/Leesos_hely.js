import {
  setBackgroundColor,
  MapColliderek,
  SzobakiesesKezelo,
  SzobavaltozatoKezelo,
} from "./Szobakezelo.js";
import { fecthData } from "../../index.js";
import { jatekos_betolt } from "../entitások/jatekos.js";

export async function Leesos_hely(k, szoba_belepesi_pont = null) {
  console.log("Kapott belépési pont:", szoba_belepesi_pont);

  setBackgroundColor(k, "#000000");

  const mapW = 32 * 30;
  const mapH = 32 * 50;

  const mapData = await fecthData(
    "http://127.0.0.1:3000/api/map_data/leesos_hely.json",
  );

  let xpos = mapData.data.layers[5].objects[0].x;
  let ypos = mapData.data.layers[5].objects[0].y;

  if (szoba_belepesi_pont != null) {
    switch (szoba_belepesi_pont) {
      case "Falling_down_from_Iacon":
        xpos = mapData.data.layers[5].objects[0].x;
        ypos = mapData.data.layers[5].objects[0].y;
        break;
    }
  }

  const szoba_layerek = mapData.data.layers;

  const heartLayer = k.add([
    k.pos(0, 0),
    k.sprite("Leesos_hely_heart"),
  ]);

  const map = k.add([
    k.pos(0, 0),
    k.sprite("Leesos_hely"),
  ]);

  MapColliderek(k, map, szoba_layerek[2].objects);

  const player = jatekos_betolt(k, xpos, ypos);

  SzobakiesesKezelo(k, map, mapW, mapH);

  SzobavaltozatoKezelo(
    k,
    mapData.data.layers[4].objects[0].x,
    mapData.data.layers[4].objects[0].y,
    mapData.data.layers[4].objects[0].width,
    mapData.data.layers[4].objects[0].height,
    "Smelting_Pits",
    "From_leesos_hely",
    "atjaro_smelting_pits"
  );
}