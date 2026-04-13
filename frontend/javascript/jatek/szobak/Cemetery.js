import {
  setBackgroundColor,
  MapColliderek,
  SzobakiesesKezelo,
  SzobavaltozatoKezelo,
} from "./Szobakezelo.js";
import { fecthData } from "../../index.js";
import { jatekos_betolt } from "../entitások/jatekos.js";
import { Kamera_kezelo } from "../entitások/kamera.js";

export async function Cemetery(k, szoba_belepesi_pont = null) {
  console.log("Kapott belépési pont:", szoba_belepesi_pont);

  setBackgroundColor(k, "#000000");

  const mapW = 32 * 60;
  const mapH = 32 * 40;

  const mapData = await fecthData(
    "http://127.0.0.1:3000/api/map_data/The_cemetery.json"
  );

  const szoba_layerek = mapData.data.layers;

  function layerKereses(nev) {
    const layer = szoba_layerek.find((l) => l.name === nev);
    if (!layer) {
      console.error(`Hiányzó layer: ${nev}`);
    }
    return layer;
  }

  const solidLayer = layerKereses("Solid");
  const ladderLayer = layerKereses("Ladder");
  const backFromKaonLayer = layerKereses("Back_from_Kaon");
  const toKaonLayer = layerKereses("To_Kaon");
  const cemeteryCutsceneLayer = layerKereses("Cemetery_cutscene");
  const lighthouseLayer = layerKereses("Turn_of_the_lighthouse");

  let xpos = backFromKaonLayer.objects[0].x;
  let ypos = backFromKaonLayer.objects[0].y;

  if (szoba_belepesi_pont != null) {
    switch (szoba_belepesi_pont) {
      case "Back_from_Kaon":
        xpos = backFromKaonLayer.objects[0].x;
        ypos = backFromKaonLayer.objects[0].y;
        break;
    }
  }

  const map = k.add([
    k.pos(0, 0),
    k.sprite("The_cemetery"),
  ]);

  if (solidLayer && solidLayer.objects) {
    MapColliderek(k, map, solidLayer.objects);
  }

  const player = await jatekos_betolt(k, xpos, ypos);

  Kamera_kezelo(k, xpos, ypos, player, mapW, mapH);

  SzobakiesesKezelo(k, map, mapW, mapH);

  if (toKaonLayer && toKaonLayer.objects && toKaonLayer.objects[0]) {
    SzobavaltozatoKezelo(
      k,
      toKaonLayer.objects[0].x,
      toKaonLayer.objects[0].y,
      toKaonLayer.objects[0].width,
      toKaonLayer.objects[0].height,
      "Kaon",
      "Back_from_the_cemetery_to_Kaon",
      "atjaro_kaon_from_cemetery"
    );
  }

  //létra objektum egyelőre csak berakva
  if (ladderLayer && ladderLayer.objects && ladderLayer.objects[0]) {
    const ladderObj = ladderLayer.objects[0];

    k.add([
      k.pos(ladderObj.x, ladderObj.y),
      k.rect(ladderObj.width, ladderObj.height),
      k.area(),
      k.opacity(0),
      "ladder",
    ]);
  }

  //cutscene trigger
  if (cemeteryCutsceneLayer && cemeteryCutsceneLayer.objects && cemeteryCutsceneLayer.objects[0]) {
    const cutsceneObj = cemeteryCutsceneLayer.objects[0];

    k.add([
      k.pos(cutsceneObj.x, cutsceneObj.y),
      k.rect(cutsceneObj.width, cutsceneObj.height),
      k.area(),
      k.opacity(0),
      "cemetery_cutscene_trigger",
    ]);

    k.onCollide("player", "cemetery_cutscene_trigger", () => {
      console.log("Cemetery cutscene trigger aktiválva");
    });
  }

  //lighthouse trigger
  if (lighthouseLayer && lighthouseLayer.objects && lighthouseLayer.objects[0]) {
    const lightObj = lighthouseLayer.objects[0];

    k.add([
      k.pos(lightObj.x, lightObj.y),
      k.rect(lightObj.width, lightObj.height),
      k.area(),
      k.opacity(0),
      "lighthouse_trigger",
    ]);

    k.onCollide("player", "lighthouse_trigger", () => {
      console.log("Világítótorony trigger aktiválva");
    });
  }
}