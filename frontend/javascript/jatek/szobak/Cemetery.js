import {
  setBackgroundColor,
  MapColliderek,
  SzobakiesesKezelo,
  SzobavaltozatoKezelo,
  Eso,
  EffektTorles,
  LetraCollider,
  szoba_zene_beallitas
} from "./Szobakezelo.js";
import { fecthData } from "../../index.js";
import { jatekos_betolt } from "../entitások/jatekos.js";
import { Kamera_kezelo } from "../entitások/kamera.js";
import { settings } from "../../options.js";
import { aktivMentesAdatok, cutscene_kezeles } from "../kaboomBetolto.js";
import { unlockUzenet } from "../entitások/unlock_uzenet_UI.js";

export async function Cemetery(k, szoba_belepesi_pont = null) {
  console.log("Kapott belépési pont:", szoba_belepesi_pont);

  EffektTorles();

  const lighthouseOn = aktivMentesAdatok.data.mentett_adatok.world_interactions?.["lighthouse-on"] === true;
  const flowersCutsceneSeen = aktivMentesAdatok.data.mentett_adatok.world_interactions?.["lighthouse-sea-of-flowers-cutscene"] === true;

  if (!flowersCutsceneSeen) {
    szoba_zene_beallitas("before the flower cutscene cemetery");
  } else {
    szoba_zene_beallitas("after the flower cutscene cemetery");
  }

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

  if (ladderLayer && ladderLayer.objects) {
    ladderLayer.objects.forEach((obj) => {
      LetraCollider(k, obj, player, settings.controls.interact, settings.controls.jump);
    });
  }

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


  }

  let aktiv_esemeny = null;
  let cutsceeneFut = false;

  player.onCollideUpdate("cemetery_cutscene_trigger", () => {
    if (cutsceeneFut) return;

    aktiv_esemeny = "cemetery_cutscene_trigger";
    console.log("Cemetery cutscene triggerben vagy");

    const world = aktivMentesAdatok?.world_interactions;
    const lighthouseOn = world?.["lighthouse-on"] === true;

    if (!lighthouseOn) {
      soundeffectLetrehoz("Sound_effekt_layer_1");
      soundeffectLetrehoz("Sound_effekt_layer_2");
    }
  });

  player.onCollideEnd("cemetery_cutscene_trigger", () => {
    if (aktiv_esemeny === "cemetery_cutscene_trigger") {
      aktiv_esemeny = null;
    }

    const VanEZene = document.getElementById("Sound_effekt_layer_1");

    if (VanEZene) {
      soundeffectTorol("Sound_effekt_layer_1");
      soundeffectTorol("Sound_effekt_layer_2");
    }

  });

  player.onCollideUpdate("lighthouse_trigger", () => {
    aktiv_esemeny = "lighthouse_trigger";
    console.log("Világítótorony triggerben vagy");
  });

  player.onCollideEnd("lighthouse_trigger", () => {
    if (aktiv_esemeny === "lighthouse_trigger") {
      aktiv_esemeny = null;
    }
  });


  k.onKeyPress((key) => {
    if (key !== settings.controls.interact) return;

    console.log("Interact lenyomva:", key);
    console.log("Aktív esemény:", aktiv_esemeny);

    console.log("World:", aktivMentesAdatok.data.mentett_adatok.world_interactions);

    if (!aktivMentesAdatok.data.mentett_adatok.world_interactions) {
      console.log("Nincs world_interactions!");
      return;
    }

    const lighthouseOn = aktivMentesAdatok.data.mentett_adatok.world_interactions["lighthouse-on"] === true;
    const flowersCutsceneSeen =
      aktivMentesAdatok.data.mentett_adatok.world_interactions["lighthouse-sea-of-flowers-cutscenes"] === true;

    if (aktiv_esemeny === "lighthouse_trigger" && !lighthouseOn) {
      console.log("lighthouse");

      aktivMentesAdatok.data.mentett_adatok.world_interactions["lighthouse-on"] = true;

      soundeffectTorol("Sound_effekt_layer_1");
      soundeffectTorol("Sound_effekt_layer_2");

      return;
    }

    if (
      aktiv_esemeny === "cemetery_cutscene_trigger" &&
      aktivMentesAdatok.data.mentett_adatok.world_interactions["lighthouse-on"] === true &&
      !flowersCutsceneSeen
    ) {
      console.log("cemetery");

      cutsceeneFut = true;

      soundeffectTorol("Sound_effekt_layer_1");
      soundeffectTorol("Sound_effekt_layer_2");

      aktivMentesAdatok.data.mentett_adatok.world_interactions["lighthouse-sea-of-flowers-cutscene"] = true;

      cutscene_kezeles(k, "Transformers_sea_of_flowers", null, () => {
        cutsceeneFut = false;

        const mentett = aktivMentesAdatok.data.mentett_adatok;

        if (!mentett.ability_unlocked) {
          mentett.ability_unlocked = {};
        }

        mentett.ability_unlocked.slash_attack = true;

        unlockUzenet(
          k,
          "Slash attack feloldva!",
          "Használat: Q"
        );

        szoba_zene_beallitas("after the flower cutscene cemetery");
      });
    }

  });

  const esokezelo = Eso();
  window.esokezelo = esokezelo;
  esokezelo.start();
}

function soundeffectLetrehoz(src) {
  if (document.getElementById(src)) return;

  const soundeffekt = document.createElement("audio");

  soundeffekt.src = "../audio/" + src + ".mp3";
  soundeffekt.loop = true;
  soundeffekt.preload = "auto";
  soundeffekt.id = src;
  soundeffekt.volume = settings.volume * 0.5;
  soundeffekt.muted = false;

  document.body.appendChild(soundeffekt);

  soundeffekt.play().catch((err) => {
    console.log("Sound effect indítás hiba:", err);
  });
}

function soundeffectTorol(src) {
  const soundeffekt = document.getElementById(src);

  if (!soundeffekt) return;

  console.log("Soundeffekt törlése:", src);

  soundeffekt.pause();
  soundeffekt.currentTime = 0;
  soundeffekt.remove();
}