import {
  setBackgroundColor,
  MapColliderek,
  NPCCollider,
  SzobakiesesKezelo,
  SzobavaltozatoKezelo,
  EffektTorles,
  LetraCollider,
  szoba_zene_beallitas
} from "./Szobakezelo.js";
import { fecthData } from "../../index.js";
import { jatekos_betolt } from "../entitások/jatekos.js";
import { Kamera_kezelo } from "../entitások/kamera.js";
import { settings } from "../../options.js";
import { aktivMentesAdatok } from "../kaboomBetolto.js";
import { Szobanev } from "../entitások/unlock_uzenet_UI.js";

export async function Kezdoszoba(k, szoba_belepesi_pont = null) {

  EffektTorles();

  szoba_zene_beallitas("Prowls_office_room");

  setBackgroundColor(k, "#00001b");

  k.add([
            k.pos(0, 0),
            k.sprite('Kezdoszoba_bg')
        ]);

  //map méret pixelben
  const mapW = 32 * 60;
  const mapH = 32 * 50;

  const kezdoszoba_data = await fecthData(
    "http://127.0.0.1:3000/api/map_data/kezdomap.json",
  );

  let xpos = kezdoszoba_data.data.layers[2].objects[0].x;
  let ypos = kezdoszoba_data.data.layers[2].objects[0].y;

  if (szoba_belepesi_pont != null) {
    switch (szoba_belepesi_pont) {
      case "Back_From_Mitteous":
        xpos = kezdoszoba_data.data.layers[1].objects[0].x;
        ypos = kezdoszoba_data.data.layers[1].objects[0].y;
        break;

      default:
        console.log("Ismeretlen belépési pont Kezdoszobába:", szoba_belepesi_pont);
        break;
    }
  }

  const szoba_layerek = kezdoszoba_data.data.layers;

  function layerKereses(nev) {
    const layer = szoba_layerek.find((l) => l.name === nev);
    if (!layer) {
      console.error(`Hiányzó layer: ${nev}`);
    }
    return layer;
  }

  const ladderLayer = layerKereses("Ladder");


  const map = k.add([k.pos(0, 0), k.sprite("Kezdoszoba")]);

  MapColliderek(k, map, szoba_layerek[3].objects);

  let kelleprowl =!aktivMentesAdatok.data.mentett_adatok.NPC_interactions.Prowl;
  if(kelleprowl){
    k.add([
            k.pos(0, 0),
            k.sprite('Kezdoszoba_table')
        ]);

    NPCCollider(k, szoba_layerek[4].objects, "Prowl");
    
  }
  else{
    k.add([
            k.pos(0, 0),
            k.sprite('Kezdoszoba_table_flipped')
        ]);
  }
  

  const player = await jatekos_betolt(k, xpos, ypos, "Kezdoszoba");

  Kamera_kezelo(k, xpos, ypos, player, mapW, mapH);

  if (ladderLayer && ladderLayer.objects) {
    ladderLayer.objects.forEach((obj) => {
      LetraCollider(k, obj, player, settings.controls.interact, settings.controls.jump);
    });
  }

  SzobakiesesKezelo(k, map, mapW, mapH);
  SzobavaltozatoKezelo(k, kezdoszoba_data.data.layers[5].objects[0].x, kezdoszoba_data.data.layers[5].objects[0].y, kezdoszoba_data.data.layers[5].objects[0].width, kezdoszoba_data.data.layers[5].objects[0].height, "Mitteous_Plateau", "Back_From_kezdomap_and_Iacon", "atjaro_mitteous");

  Szobanev(k,"kezdo_szoba");
}
