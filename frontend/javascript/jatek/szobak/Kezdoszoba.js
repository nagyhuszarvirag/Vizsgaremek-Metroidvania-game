import {
  setBackgroundColor,
  MapColliderek,
  NPCCollider,
} from "./Szobakezelo.js";
import { fecthData } from "../../index.js";
import { jatekos_betolt } from "../entitások/jatekos.js";

export async function Kezdoszoba(k) {
  setBackgroundColor(k, "#000000");

  const kezdoszoba_data = await fecthData(
    "http://127.0.0.1:3000/api/map_data/kezdomap.json",
  );

  let xpos = kezdoszoba_data.data.layers[4].objects[0].x;
  let ypos = kezdoszoba_data.data.layers[4].objects[0].y;

  const szoba_layerek = kezdoszoba_data.data.layers;
  const map = k.add([k.pos(0, 0), k.sprite("Kezdoszoba")]);

  MapColliderek(k, map, szoba_layerek[1].objects);
  NPCCollider(k, szoba_layerek[2].objects, "Prowl");

  jatekos_betolt(k, xpos, ypos);
}
