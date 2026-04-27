import {
  setBackgroundColor,
  MapColliderek,
  SzobakiesesKezelo,
  SzobavaltozatoKezelo,
  EffektTorles,
  szoba_zene_beallitas,
  NPCCollider
} from "./Szobakezelo.js";
import { fecthData } from "../../index.js";
import { jatekos_betolt } from "../entitások/jatekos.js";
import { Kamera_kezelo } from "../entitások/kamera.js";
import { aktivMentesAdatok, cutscene_kezeles } from "../kaboomBetolto.js";
import { settings } from "../../options.js";

export async function End_map(k, szoba_belepesi_pont = null) {
  console.log("Kapott belépési pont:", szoba_belepesi_pont);

  EffektTorles();

  szoba_zene_beallitas("End_room");

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

  k.add([
            k.pos(
                mapData.data.layers[5].objects[0].x,
                mapData.data.layers[5].objects[0].y,
            ),
            k.rect(
                mapData.data.layers[5].objects[0].width,
                mapData.data.layers[5].objects[0].height,
            ),
            k.area(),
            k.opacity(0),
            "end_map_cutscene_helye",
        ]);

  let kelleprowl = aktivMentesAdatok.data.mentett_adatok.NPC_interactions.Prowl;
  let kellerachet = aktivMentesAdatok.data.mentett_adatok.NPC_interactions.Ratchet;
  let kelleswindle = aktivMentesAdatok.data.mentett_adatok.NPC_interactions.Swindle;
  let kelletailgate = aktivMentesAdatok.data.mentett_adatok.NPC_interactions.Tailgate;
  let kelleChromedome_and_Ratchet_combo = aktivMentesAdatok.data.mentett_adatok.NPC_interactions.Chromedome_and_Ratchet;

  let current_ending = "basic_ending";

  if(kellerachet && kelleprowl && kelleswindle && kelletailgate && kelleChromedome_and_Ratchet_combo){
    current_ending = "true_ending";
  }

  if(kelleChromedome_and_Ratchet_combo){
    NPCCollider(k, szoba_layerek[6].objects, "Ratchet");
    NPCCollider(k, szoba_layerek[7].objects, "Chromedome");
    NPCCollider(k, szoba_layerek[8].objects, "Tailgate");
  }

  const player = await jatekos_betolt(k, xpos, ypos);

  let Ending_helyen_van = false;

  player.onCollideUpdate("end_map_cutscene_helye", () => {
    Ending_helyen_van = true;
  });

  player.onCollideEnd("end_map_cutscene_helye", () => {
    Ending_helyen_van = false;
  });

  k.onKeyPress(async (key) => {
      if (key !== settings.controls.interact) return;

      if (Ending_helyen_van) {
        cutscene_kezeles(k, current_ending, "end_game");
      }
    });

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