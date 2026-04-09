import {
  setBackgroundColor,
  MapColliderek,
  SzobakiesesKezelo,
  SzobavaltozatoKezelo,
  MentesCollider
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

  let xpos = mapData.data.layers[8].objects[0].x;
  let ypos = mapData.data.layers[8].objects[0].y;

  if (szoba_belepesi_pont != null) {
    switch (szoba_belepesi_pont) {
      case "Back_From_kezdomap_and_Iacon":
        xpos = mapData.data.layers[3].objects[0].x;
        ypos = mapData.data.layers[3].objects[0].y;
        break;

      case "Back_From_Iacon_1":
        xpos = mapData.data.layers[4].objects[0].x;
        ypos = mapData.data.layers[4].objects[0].y;
        break;

      case "Back_From_Iacon_2":
        xpos = mapData.data.layers[5].objects[0].x;
        ypos = mapData.data.layers[5].objects[0].y;
        break;

      case "Back_From_Iacon_3":
        xpos = mapData.data.layers[6].objects[0].x;
        ypos = mapData.data.layers[6].objects[0].y;
        break;

      case "Back_From_End_Map":
        xpos = mapData.data.layers[7].objects[0].x;
        ypos = mapData.data.layers[7].objects[0].y;
        break;
      case "savepoint_2":
        xpos = mapData.data.layers[8].objects[0].x;
        ypos = mapData.data.layers[8].objects[0].y;
    }
  }
  else {
    //mentésből betöltéskor a savepoint alapján állítja be a pozíciót
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


  MapColliderek(k, map, szoba_layerek[15].objects);
  //Collapsing_Ground_logic helye:szoba_layerek[15].objects
  const collapseZone = mapData.data.layers[16].objects[0];

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

  const savepointObj = mapData.data.layers[8].objects[0];
  const savepointNev = mapData.data.layers[8].name;
  console.log("Savepoint objektum neve: ", savepointNev);
  MentesCollider(k, savepointObj, savepointNev);

  const player = jatekos_betolt(k, xpos, ypos);

  SzobakiesesKezelo(k, map, mapW, mapH);

  //Az adatoka azok a savepoint_2-é, de neki majd kell egy külön savepoint kezelő
  //MentesLetrehozo(k, mapData.data.layers[7].objects[0].x, mapData.data.layers[7].objects[0].y, mapData.data.layers[7].objects[0].width, mapData.data.layers[7].objects[0].height,mapData.data.layers[7].name);

  SzobavaltozatoKezelo(
    k,
    mapData.data.layers[13].objects[0].x,
    mapData.data.layers[13].objects[0].y,
    mapData.data.layers[13].objects[0].width,
    mapData.data.layers[13].objects[0].height,
    "Kezdoszoba",
    "Back_From_Mitteous",
    "atjaro_kezdomap"
  );

  SzobavaltozatoKezelo(
    k,
    mapData.data.layers[9].objects[0].x,
    mapData.data.layers[9].objects[0].y,
    mapData.data.layers[9].objects[0].width,
    mapData.data.layers[9].objects[0].height,
    "Iacon",
    "Back_from_Mitteous_1_and_Medical_Bay",
    "atjaro_iacon_1"
  );

  SzobavaltozatoKezelo(
    k,
    mapData.data.layers[10].objects[0].x,
    mapData.data.layers[10].objects[0].y,
    mapData.data.layers[10].objects[0].width,
    mapData.data.layers[10].objects[0].height,
    "Iacon",
    "Back_from_Mitteous_2",
    "atjaro_iacon_2"
  );

  SzobavaltozatoKezelo(
    k,
    mapData.data.layers[11].objects[0].x,
    mapData.data.layers[11].objects[0].y,
    mapData.data.layers[11].objects[0].width,
    mapData.data.layers[11].objects[0].height,
    "Iacon",
    "Back_from_Mitteous_3",
    "atjaro_iacon_3"
  );

  SzobavaltozatoKezelo(
    k,
    mapData.data.layers[12].objects[0].x,
    mapData.data.layers[12].objects[0].y,
    mapData.data.layers[12].objects[0].width,
    mapData.data.layers[12].objects[0].height,
    "Iacon",
    "Falling_from_Mitteous_4",
    "atjaro_iacon_4"
  );

  SzobavaltozatoKezelo(
    k,
    mapData.data.layers[14].objects[0].x,
    mapData.data.layers[14].objects[0].y,
    mapData.data.layers[14].objects[0].width,
    mapData.data.layers[14].objects[0].height,
    "End_map",
    "Back_from_Mitteous",
    "atjaro_end_map"
  );
}