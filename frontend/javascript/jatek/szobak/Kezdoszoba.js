import { setBackgroundColor, MapColliderek } from "./Szobakezelo.js";
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

  const mapW = 30 * 32;
  const mapH = 20 * 32;

  const T = 32;

  //baloldali fal
  map.add([
    k.pos(-T, 0),
    k.rect(T, mapH),
    k.area(),
    k.body({ isStatic: true }),
    k.opacity(0),
    "Solid",
  ]);

  //jobboldali fal
  map.add([
    k.pos(mapW, 0),
    k.rect(T, mapH),
    k.area(),
    k.body({ isStatic: true }),
    k.opacity(0),
    "Solid",
  ]);

  //alsó fal
  map.add([
    k.pos(0, mapH),
    k.rect(mapW, T),
    k.area(),
    k.body({ isStatic: true }),
    k.opacity(0),
    "Solid",
  ]);

  //felső fal
  map.add([
    k.pos(0, -T),
    k.rect(mapW, T),
    k.area(),
    k.body({ isStatic: true }),
    k.opacity(0),
    "Solid",
  ]);

  jatekos_betolt(k, xpos, ypos);
}