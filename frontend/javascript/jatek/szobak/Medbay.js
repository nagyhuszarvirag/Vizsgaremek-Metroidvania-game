import {
  setBackgroundColor,
  MapColliderek,
  NPCCollider,
  SzobakiesesKezelo,
  SzobavaltozatoKezelo,
  MentesCollider,
  EffektTorles
} from "./Szobakezelo.js";
import { fecthData } from "../../index.js";
import { jatekos_betolt } from "../entitások/jatekos.js";
import { Kamera_kezelo } from "../entitások/kamera.js";
import { KellEAzNPC } from "../kaboomBetolto.js";

export async function Medbay(k, szoba_belepesi_pont = null) {
  console.log("Kapott belépési pont:", szoba_belepesi_pont);

  EffektTorles();

  setBackgroundColor(k, "#000000");

  const mapW = 32 * 30;
  const mapH = 32 * 20;

  const mapData = await fecthData(
    "http://127.0.0.1:3000/api/map_data/Medbay.json",
  );

  let xpos = mapData.data.layers[2].objects[0].x;
  let ypos = mapData.data.layers[2].objects[0].y;

  if (szoba_belepesi_pont != null) {
    switch (szoba_belepesi_pont) {
      case "Back_from_Iacon":
        xpos = mapData.data.layers[4].objects[0].x;
        ypos = mapData.data.layers[4].objects[0].y;
        break;

      case "Savepoint_4":
        xpos = mapData.data.layers[2].objects[0].x;
        ypos = mapData.data.layers[2].objects[0].y;
        break;
    }
  }

  const szoba_layerek = mapData.data.layers;

  const map = k.add([
    k.pos(0, 0),
    k.sprite("Medbay"),
  ]);

  MapColliderek(k, map, szoba_layerek[1].objects);

  const savepointObj = mapData.data.layers[2].objects[0];
  const savepointNev = mapData.data.layers[2].name;
  MentesCollider(k, savepointObj, savepointNev);

  let kellerachet = await KellEAzNPC("$.NPC_interactions.Ratchet");
  
  //Itt a medbay asztalt be kell tenni

   /*k.add([ 
              k.pos(0, 0),
              k.sprite('Kezdoszoba_table')
    ]);*/

    if(kellerachet){
      NPCCollider(k, szoba_layerek[5].objects, "Ratchet");
    }
   
  const player = await jatekos_betolt(k, xpos, ypos, "Medbay");

  Kamera_kezelo(k, xpos, ypos, player, mapW, mapH);

  SzobakiesesKezelo(k, map, mapW, mapH);

  SzobavaltozatoKezelo(
    k,
    mapData.data.layers[3].objects[0].x,
    mapData.data.layers[3].objects[0].y,
    mapData.data.layers[3].objects[0].width,
    mapData.data.layers[3].objects[0].height,
    "Iacon",
    "Back_from_Mitteous_1_and_Medical_Bay",
    "atjaro_iacon"
  );
}