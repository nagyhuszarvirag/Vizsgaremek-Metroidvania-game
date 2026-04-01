import {
  setBackgroundColor,
  MapColliderek,
  SzobakiesesKezelo,
  SzobavaltozatoKezelo
} from "./Szobakezelo.js";
import { fecthData } from "../../index.js";
import { jatekos_betolt } from "../entitások/jatekos.js";

export async function Mitteous(k, szoba_belepesi_pont = null) {
  console.log("Kapott belépési pont:", szoba_belepesi_pont);

  //háttér
  setBackgroundColor(k, "#000000");

  //map méret pixelben
  const mapW = 32 * 60;
  const mapH = 32 * 50;

  const mapData = await fecthData(
    "http://127.0.0.1:3000/api/map_data/Mitteous_Plateau.json",
  );

  let xpos = mapData.data.layers[7].objects[0].x;
  let ypos = mapData.data.layers[7].objects[0].y;

  if (szoba_belepesi_pont != null) {
    switch (szoba_belepesi_pont) {
      case "Back_From_kezdomap_and_Iacon":
        xpos = mapData.data.layers[2].objects[0].x;
        ypos = mapData.data.layers[2].objects[0].y;
        break;

      case "Back_From_iacon_1":
        xpos = mapData.data.layers[3].objects[0].x;
        ypos = mapData.data.layers[3].objects[0].y;
        break;

      case "Back_From_Iacon_2":
        xpos = mapData.data.layers[4].objects[0].x;
        ypos = mapData.data.layers[4].objects[0].y;
        break;

      case "Back_From_Iacon_3":
        xpos = mapData.data.layers[5].objects[0].x;
        ypos = mapData.data.layers[5].objects[0].y;
        break;

      case "Back_From_End_Map":
        xpos = mapData.data.layers[6].objects[0].x;
        ypos = mapData.data.layers[6].objects[0].y;
        break;
    }
  }



  const szoba_layerek = mapData.data.layers;
  const Layer_2 = k.add([k.pos(0, 0), k.sprite("Mitteous_Plateau2")]);
  const Layer_3 = k.add([k.pos(0, 0), k.sprite("Mitteous_Plateau3")]);
  const Layer_4 = k.add([k.pos(0, 0), k.sprite("Mitteous_Plateau4")]);
  const map = k.add([k.pos(0, 0), k.sprite("Mitteous_Plateau")]);

  const collapsingGround = k.add([
    k.pos(0, 0),
    k.sprite("Mitteous_Plateau_Collapsing_ground"),
  ]);


  MapColliderek(k, map, szoba_layerek[14].objects);
  //Collapsing_Ground_logic helye:szoba_layerek[15].objects
  const collapseZone = mapData.data.layers[15].objects[0];

  const collapsingGroundTrigger = k.add([
    k.pos(collapseZone.x, collapseZone.y),
    k.rect(collapseZone.width, collapseZone.height),
    k.area(),
    k.opacity(0),
    "collapsing_ground_trigger",
  ]);

  let collapseTriggered = false;

  k.onCollide("player", "collapsing_ground_trigger", () => {
    if (collapseTriggered) return;
    collapseTriggered = true;

    console.log("Beomló talaj aktiválva");

    collapsingGround.destroy();
    collapsingGroundTrigger.destroy();
  });

  const player = jatekos_betolt(k, xpos, ypos);

  SzobakiesesKezelo(k, map, mapW, mapH);
  SzobavaltozatoKezelo(k, mapData.data.layers[7].objects[0].x, mapData.data.layers[7].objects[0].y, mapData.data.layers[7].objects[0].width, mapData.data.layers[7].objects[0].height, "Mitteous_Plateau");
  SzobavaltozatoKezelo(
    k,
    mapData.data.layers[12].objects[0].x,
    mapData.data.layers[12].objects[0].y,
    mapData.data.layers[12].objects[0].width,
    mapData.data.layers[12].objects[0].height,
    "Kezdoszoba",
    "Back_From_Mitteous",
    "atjaro_kezdomap"
  );

}