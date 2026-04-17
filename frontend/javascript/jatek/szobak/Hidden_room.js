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
import { maxHpNovelese } from "../entitások/hp_kezelo.js";

export async function Hidden_Room(k, szoba_belepesi_pont = null) {
  console.log("Kapott belépési pont:", szoba_belepesi_pont);

  EffektTorles();

  setBackgroundColor(k, "#000000");

  const mapW = 32 * 20;
  const mapH = 32 * 20;

  const mapData = await fecthData(
    "http://127.0.0.1:3000/api/map_data/hidden_room.json",
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
  const heartObjectLayer = layerKereses("Heart_Object");
  const backFromSmeltingPitsLayer = layerKereses("Back_from_smelting_pits");
  const toSmeltingPitsLayer = layerKereses("To_smelting_pits");

  let xpos = backFromSmeltingPitsLayer.objects[0].x;
  let ypos = backFromSmeltingPitsLayer.objects[0].y;

  if (szoba_belepesi_pont != null) {
    switch (szoba_belepesi_pont) {
      case "Back_from_smelting_pits":
        xpos = backFromSmeltingPitsLayer.objects[0].x;
        ypos = backFromSmeltingPitsLayer.objects[0].y;
        break;
    }
  }

  const map = k.add([
    k.pos(0, 0),
    k.sprite("hidden_room_solid"),
  ]);

  let heartSprite = null;
  if (!localStorage.getItem("hidden_room_heart_picked")) {
    heartSprite = k.add([
      k.pos(0, 0),
      k.sprite("hidden_room_heart"),
    ]);
  }

  if (solidLayer && solidLayer.objects) {
    MapColliderek(k, map, solidLayer.objects);
  }

  const player = await jatekos_betolt(k, xpos, ypos);

  Kamera_kezelo(k, xpos, ypos, player, mapW, mapH);

  SzobakiesesKezelo(k, map, mapW, mapH);

  if (toSmeltingPitsLayer && toSmeltingPitsLayer.objects && toSmeltingPitsLayer.objects[0]) {
    SzobavaltozatoKezelo(
      k,
      toSmeltingPitsLayer.objects[0].x,
      toSmeltingPitsLayer.objects[0].y,
      toSmeltingPitsLayer.objects[0].width,
      toSmeltingPitsLayer.objects[0].height,
      "Smelting_Pits",
      "Back_fom_hidden_room",
      "atjaro_smelting_pits_from_hidden_room"
    );
  }

  if (
    !localStorage.getItem("hidden_room_heart_picked") &&
    heartObjectLayer &&
    heartObjectLayer.objects &&
    heartObjectLayer.objects[0]
  ) {
    const heartObj = heartObjectLayer.objects[0];

    k.add([
      k.pos(heartObj.x, heartObj.y),
      k.rect(heartObj.width, heartObj.height),
      k.area(),
      k.opacity(0),
      "hidden_room_heart_pickup",
    ]);

    k.onCollide("player", "hidden_room_heart_pickup", (playerObj, obj) => {
      console.log("Hidden room bonus heart felvéve");

      localStorage.setItem("hidden_room_heart_picked", "true");

      maxHpNovelese(playerObj, 2);

      if (heartSprite) {
        heartSprite.destroy();
      }

      obj.destroy();
    });
  }
}