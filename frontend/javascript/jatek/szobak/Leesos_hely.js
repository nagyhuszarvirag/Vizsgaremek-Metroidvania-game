import {
  setBackgroundColor,
  MapColliderek,
  SzobakiesesKezelo,
  SzobavaltozatoKezelo,
  EffektTorles,
  NPCCollider,
  szoba_zene_beallitas
} from "./Szobakezelo.js";
import { fecthData } from "../../index.js";
import { jatekos_betolt } from "../entitások/jatekos.js";
import { Kamera_kezelo } from "../entitások/kamera.js";
import { maxHpNovelese } from "../entitások/hp_kezelo.js";
import { aktivMentesAdatok } from "../kaboomBetolto.js";

export async function Leesos_hely(k, szoba_belepesi_pont = null) {
  console.log("Kapott belépési pont:", szoba_belepesi_pont);

  EffektTorles();

  szoba_zene_beallitas("leesos_hely");

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

  const bonusHeartMegvan = aktivMentesAdatok?.data?.mentett_adatok?.world_interactions?.["bonus-hp-3"] === true;

  let bonusHeartSprite = null;
  if (!bonusHeartMegvan) {
    bonusHeartSprite = k.add([
      k.pos(0, 0),
      k.sprite("Leesos_hely_heart"),
    ]);
  }

  const map = k.add([
    k.pos(0, 0),
    k.sprite("Leesos_hely"),
  ]);

  MapColliderek(k, map, szoba_layerek[2].objects);

  let kelletailgate = !aktivMentesAdatok.data.mentett_adatok.NPC_interactions.Tailgate;
  let tailgate_helye_korrektalt=szoba_layerek[6].objects;
  tailgate_helye_korrektalt[0].y=tailgate_helye_korrektalt[0].y-3; //Picit alacsony helyre raktam a sprite kezdőpontját, úgyhogy feljebb kellett vinnem

  if (kelletailgate) {
    NPCCollider(k, tailgate_helye_korrektalt, "Tailgate");
  }

  const player = await jatekos_betolt(k, xpos, ypos, "Leesos_hely");

  if (
    !bonusHeartMegvan &&
    szoba_layerek[3] &&
    szoba_layerek[3].objects &&
    szoba_layerek[3].objects[0]
  ) {
    const heartObj = szoba_layerek[3].objects[0];

    k.add([
      k.pos(heartObj.x, heartObj.y),
      k.rect(heartObj.width, heartObj.height),
      k.area(),
      k.opacity(0),
      "leesos_hely_bonus_heart_pickup",
    ]);

    k.onCollide("player", "leesos_hely_bonus_heart_pickup", (playerObj, obj) => {
      console.log("Leesős hely bonus heart felvéve");

      aktivMentesAdatok.data.mentett_adatok.world_interactions["bonus-hp-3"] = true;

      maxHpNovelese(playerObj, 2);

      if (bonusHeartSprite) {
        bonusHeartSprite.destroy();
      }

      obj.destroy();
    });
  }

  Kamera_kezelo(k, xpos, ypos, player, mapW, mapH);

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