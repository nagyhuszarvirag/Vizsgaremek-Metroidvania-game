import kaboom from "../../libraries/kaboom.mjs";
import { Kezdoszoba } from "./szobak/Kezdoszoba.js";
import { Mitteous } from "./szobak/Mitteous_Plateau.js";
import { Iacon } from "./szobak/Iacon.js";
import { Medbay } from "./szobak/Medbay.js";
import { Leesos_hely } from "./szobak/Leesos_hely.js";
import { Smelting_Pits } from "./szobak/Smelting_Pits.js";
import { End_map } from "./szobak/End_map.js";
import { Crystal_City } from "./szobak/Crystal_city.js";
import { Kaon } from "./szobak/Kaon.js";
import { Cemetery } from "./szobak/Cemetery.js";
import { Hidden_Room } from "./szobak/Hidden_room.js";
import { setBackgroundColor } from "./szobak/Szobakezelo.js";
import { fecthData } from "../index.js";
import { nyelv } from "../options.js";

const GRAVITY = 700;
const SPEED = 120; //Ezt is lehet JSON-ben tárolni security miatt
const JUMP_FORCE = 400;

export { GRAVITY, SPEED, JUMP_FORCE };

export let mentesunk_idja = null;
export let aktivMentesAdatok = null;

export async function KaboomBetolto(mentes_id) {
  let in_game_menu_tarolo=document.createElement("div");
  in_game_menu_tarolo.id="in_game_menu_tarolo";
  in_game_menu_tarolo.classList.add("in_game_modallok");
  document.body.appendChild(in_game_menu_tarolo);

  specialeffektdoboz();

  localStorage.removeItem("player_current_hp");

  mentesunk_idja = mentes_id;

  const user = JSON.parse(localStorage.getItem("user"));
  let mentesbetolto;
  if (user.usernev === "guest") {
    console.log("Guest mentés betöltése localStorage-ból");
    mentesbetolto = {
      data: {
        mentett_adatok: {
          savepoint: "kezdomap_1",
          world_interactions: {
            "mitteous-plateau_breakable-ground1": false
          },
          NPC_interactions: {
            Ratchet: false,
            Prowl: false
          },
          bosses: {
            Tarn: false
          },
          ability_unlocked: {
            double_jump: false,
            dash: false
          }
        }
      }
    };
  } else {
    console.log("User mentés betöltése az adatbázis-ból");
    mentesbetolto = await fecthData(
      "http://127.0.0.1:3000/api/mentesmeghiv/" + user.id + "/" + mentes_id,
    );
  }

  aktivMentesAdatok = JSON.parse(JSON.stringify(mentesbetolto.data.mentett_adatok));

  let kellintro = false;
  console.log("Mentés betöltve: ", mentesbetolto);

  const scale = 1;

  const k = kaboom({
    width: window.innerWidth,
    height: window.innerHeight,
    scale: scale,
  });

  k.scene("Kezdoszoba", (adatok) => {
    Kezdoszoba(k, adatok?.szoba_belepesi_pont ?? null);
  });

  k.scene("Mitteous_Plateau", (adatok) => {
    Mitteous(k, adatok?.szoba_belepesi_pont ?? null);
  });

  k.scene("Iacon", (adatok) => {
    Iacon(k, adatok?.szoba_belepesi_pont ?? null);
  });

  k.scene("Medbay", (adatok) => {
    Medbay(k, adatok?.szoba_belepesi_pont ?? null);
  });

  k.scene("Leesos_hely", (adatok) => {
    Leesos_hely(k, adatok?.szoba_belepesi_pont ?? null);
  });

  k.scene("Smelting_Pits", (adatok) => {
    Smelting_Pits(k, adatok?.szoba_belepesi_pont ?? null);
  });

  k.scene("End_map", (adatok) => {
    End_map(k, adatok?.szoba_belepesi_pont ?? null);
  });

  k.scene("Crystal_city", (adatok) => {
    Crystal_City(k, adatok?.szoba_belepesi_pont ?? null);
  });

  k.scene("Kaon", (adatok) => {
    Kaon(k, adatok?.szoba_belepesi_pont ?? null);
  });

  k.scene("Cemetery", (adatok) => {
    Cemetery(k, adatok?.szoba_belepesi_pont ?? null);
  });

  k.scene("Hidden_room", (adatok) => {
    Hidden_Room(k, adatok?.szoba_belepesi_pont ?? null);
  });

  k.debug.inspect = true; //Ezt a kettőt majd ki kell kapcsolni, ha kész a játék, de most jól jön a teszteléshez
  k.debug.drawArea = true;

  k.scene("intro", async () => {
    await cutscene_kezeles(k, "intro", "Kezdoszoba");
  });

  //kezdőmap sprite
  k.loadSprite("Kezdoszoba", "../../images/maps/kezdomap.png"); //Itt midnig be kell tölteni a szoba spriteját későbbi kezelésre
  k.loadSprite("Kezdoszoba_table", "../../images/maps/kezdomap_table.png");
  k.loadSprite("Kezdoszoba_table_flipped", "../../images/maps/kezdomap_table_flipped.png");

  //Mitteous map sprite
  k.loadSprite("Mitteous_Plateau", "../../images/maps/Mitteous_Plateau.png");
  k.loadSprite(
    "Mitteous_Plateau_Collapsing_ground",
    "../../images/maps/Mitteous_Plateau_COLLAPSE_GROUND.png",
  );
  k.loadSprite("Mitteous_Plateau2", "../../images/maps/Mitteous_plateau_BG_2.png");
  k.loadSprite("Mitteous_Plateau3", "../../images/maps/Mitteous_plateau_BG_3.png");
  k.loadSprite("Mitteous_Plateau4", "../../images/maps/Mitteous_plateau_BG_4.png");

  //Iacon map sprite
  k.loadSprite("Iacon", "../../images/maps/Iacon_city_fo_layer.png");
  k.loadSprite("Iacon_Breakable_wall_1", "../../images/maps/Iacon_city_breakable_wall1.png");
  k.loadSprite("Iacon_Breakable_wall_2", "../../images/maps/Iacon_city_breakable_wall2.png");
  k.loadSprite("Iacon_Collapsing_ground_1", "../../images/maps/Iacon_city_collapsing_ground_1.png");
  k.loadSprite("Iacon_Collapsing_ground_2", "../../images/maps/Iacon_city_collapsing_ground_2.png");
  k.loadSprite("Iacon_Hidden_wall", "../../images/maps/Iacon_city_hidden_breakable_wall.png");

  //Medbay map sprite
  k.loadSprite("Medbay", "../../images/maps/Medbay.png");

  //Leesos_hely map sprite
  k.loadSprite("Leesos_hely", "../../images/maps/leesos_hely_solid.png");
  k.loadSprite("Leesos_hely_heart", "../../images/maps/leesos_hely_heart.png");

  //Smelting Pits map sprite
  k.loadSprite("Smelting_Pits", "../../images/maps/Smelting pits.png");
  k.loadSprite("Smelting_Pits_BG_1", "../../images/maps/Smelting pits_BG_1.png");
  k.loadSprite(
    "Smelting_Pits_Breakable_wall",
    "../../images/maps/Smelting pits_Breakable_wall.png",
  );
  k.loadSprite(
    "Smelting_Pits_Collapsing_ground_1",
    "../../images/maps/Smelting pits_collapsing_ground_1.png",
  );
  k.loadSprite(
    "Smelting_Pits_Collapsing_ground_2",
    "../../images/maps/Smelting pits_collapsing_ground_2.png",
  );
  k.loadSprite(
    "Smelting_Pits_Collapsing_ground_3",
    "../../images/maps/Smelting pits_collapsing_ground_3.png",
  );
  k.loadSprite(
    "Smelting_Pits_Collapsing_ground_4",
    "../../images/maps/Smelting pits_collapsing_ground_4.png",
  );
  k.loadSprite(
    "Smelting_Pits_Collapsing_ground_5",
    "../../images/maps/Smelting pits_collapsing_ground_5.png",
  );
  k.loadSprite(
    "Smelting_Pits_Collapsing_ground_6",
    "../../images/maps/Smelting pits_collapsing_ground_6.png",
  );
  k.loadSprite(
    "Smelting_Pits_Collapsing_ground_7",
    "../../images/maps/Smelting pits_collapsing_ground_7.png",
  );
  k.loadSprite(
    "Smelting_Pits_Collapsing_ground_8",
    "../../images/maps/Smelting pits_collapsing_ground_8.png",
  );
  k.loadSprite(
    "Smelting_Pits_Collapsing_ground_9",
    "../../images/maps/Smelting pits_collapsing_ground_9.png",
  );
  k.loadSprite(
    "Smelting_Pits_Collapsing_ground_10",
    "../../images/maps/Smelting pits_collapsing_ground_10.png",
  );
  k.loadSprite(
    "Smelting_Pits_Collapsing_ground_11",
    "../../images/maps/Smelting pits_collapsing_ground_11.png",
  );
  k.loadSprite(
    "Smelting_Pits_Collapsing_ground_12",
    "../../images/maps/Smelting pits_collapsing_ground_12.png",
  );
  k.loadSprite(
    "Smelting_Pits_Collapsing_ground_13",
    "../../images/maps/Smelting pits_collapsing_ground_13.png",
  );
  k.loadSprite(
    "Smelting_Pits_Collapsing_ground_14",
    "../../images/maps/Smelting pits_collapsing_ground_14.png",
  );
  k.loadSprite(
    "Smelting_Pits_Collapsing_ground_15",
    "../../images/maps/Smelting pits_collapsing_ground_15.png",
  );
  k.loadSprite(
    "Smelting_Pits_Collapsing_ground_16",
    "../../images/maps/Smelting pits_collapsing_ground_16.png",
  );
  k.loadSprite(
    "Smelting_Pits_Collapsing_ground_17",
    "../../images/maps/Smelting pits_collapsing_ground_17.png",
  );
  k.loadSprite(
    "Smelting_Pits_Collapsing_ground_18",
    "../../images/maps/Smelting pits_collapsing_ground_18.png",
  );
  k.loadSprite(
    "Smelting_Pits_Collapsing_ground_19",
    "../../images/maps/Smelting pits_collapsing_ground_19.png",
  );
  k.loadSprite(
    "Smelting_Pits_Collapsing_ground_20",
    "../../images/maps/Smelting pits_collapsing_ground_20.png",
  );
  k.loadSprite(
    "Smelting_Pits_Collapsing_ground_21",
    "../../images/maps/Smelting pits_collapsing_ground_21.png",
  );
  k.loadSprite(
    "Smelting_Pits_Collapsing_ground_22",
    "../../images/maps/Smelting pits_collapsing_ground_22.png",
  );

  //End map sprite
  k.loadSprite("End_map", "../../images/maps/end_map.png");
  k.loadSprite("End_map_kovek", "../../images/maps/end_map_kovek.png");

  //Crystal_city map sprite
  k.loadSprite("Crystal_City", "../../images/maps/Crystal_city.png");
  k.loadSprite("Crystal_City_Gate", "../../images/maps/Crystal_city_Locked_place.png");
  k.loadSprite("Crystal_City_heart", "../../images/maps/Crystal_city_heart.png");

  //Kaon map sprite
  k.loadSprite("City_of_Kaon", "../../images/maps/City_of_Kaon.png");
  k.loadSprite("City_of_Kaon_heart", "../../images/maps/City_of_Kaon_heart.png");

  //Cemetery map sprite
  k.loadSprite("The_cemetery", "../../images/maps/The_cemetery.png");

  //Hidden room map sprite
  k.loadSprite("hidden_room_solid", "../../images/maps/hidden_room_solid.png");
  k.loadSprite("hidden_room_heart", "../../images/maps/hidden_room_heart.png");

  k.loadSprite("player", "../../images/sprites/Main_player.png", {
    //Ez még csak definiálás, majd le kell programozni a többi cuccot
    sliceX: 12,
    sliceY: 7,
    anims: {
      idle: { from: 0, to: 7, loop: true },
      walk: { from: 72, to: 83, loop: true },
      run: { from: 24, to: 31, loop: true },
      jump: { from: 36, to: 38, speed: 2.5 },
      die: { from: 12, to: 14, loop: true }, //Átrajzolom a meghalás animációt
      attack: { from: 60, to: 67, speed: 16 },
      hurt: { from: 48, to: 51, speed: 6 },
    },
  });

  k.loadSprite("Prowl", "../../images/sprites/NPC/Prowl.png", {
    sliceX: 8,
    sliceY: 1,
    anims: {
      idle: { from: 0, to: 7, loop: true },
    },
  });

  k.loadSprite("Ratchet", "../../images/sprites/NPC/Ratchet.png", {
    sliceX: 8,
    sliceY: 1,
    anims: {
      idle: { from: 0, to: 7, loop: true },
    },
  });

  k.loadSprite("Swindle", "../../images/sprites/NPC/Ratchet.png", { //neki majd a saját képét kéne betölteni
    sliceX: 8,
    sliceY: 1,
    anims: {
      idle: { from: 0, to: 7, loop: true },
    },
  });

  k.loadSprite("Chromedome", "../../images/sprites/NPC/Prowl.png", { //neki majd a saját képét kéne betölteni
    sliceX: 8,
    sliceY: 1,
    anims: {
      idle: { from: 0, to: 7, loop: true },
    },
  });

  k.loadSprite("Tailgate", "../../images/sprites/NPC/Ratchet.png", { //neki majd a saját képét kéne betölteni
    sliceX: 8,
    sliceY: 1,
    anims: {
      idle: { from: 0, to: 7, loop: true },
    },
  });

  k.loadSprite("scraplet", "../../images/sprites/enemies/scraplet.png", {
    sliceX: 8,
    sliceY: 5,
    anims: {
      idle: { from: 0, to: 2, loop: true },
      hurt: { from: 8, to: 9, speed: 0.1 },
      die: { from: 16, to: 18, speed: 0.1 },
      walk: { from: 24, to: 29, loop: true },
      attack: { from: 36, to: 39, speed: 12 },
    },
  });

  k.loadSprite("blue_hearts", "../../images/UI/Blue_hearts.png", {
    sliceX: 3,
    sliceY: 1,
  });

  k.setGravity(GRAVITY); //Ezt is fine tuningolni kell majd

  switch (
  mentesbetolto.data.mentett_adatok.savepoint //Később itt töltjük be a mentés alapján a megfelelő szobát és mentett pontot
  ) {
    case "kezdomap_1":
      k.go("intro");
      break;
    case "savepoint_2":
      k.go("Mitteous_Plateau", {
        szoba_belepesi_pont: "savepoint_2"
      });
      break;
    case "savepoint_3":
      k.go("Iacon", {
        szoba_belepesi_pont: "savepoint_3"
      });
      break;
    case "Savepoint_4":
      k.go("Medbay", {
        szoba_belepesi_pont: "Savepoint_4"
      });
      break;
    case "Savepoint_5":
      k.go("Kaon", {
        szoba_belepesi_pont: "Savepoint_5"
      });
      break;
    default:
      console.log(
        "Ismeretlen savepoint: " + mentesbetolto.data.mentett_adatok.savepoint,
      );
  }
}

export async function KellEAzNPC(valtozo_utvonal) {

  const user = JSON.parse(localStorage.getItem("user"));
  if (user.usernev === "guest") { //EZT LEKEZELNI
    return true;
  }

  console.log(valtozo_utvonal + "     " + mentesunk_idja + "     " + JSON.parse(localStorage.getItem("user")).id)

  const kell = await fecthData(
    "http://127.0.0.1:3000/api/kelleNPC",
    "POST",
    {
      valtozo_utvonal: valtozo_utvonal,
      mentes_id: mentesunk_idja + 1,
      user_id: JSON.parse(localStorage.getItem("user")).id
    }
  );

  console.log("kelleNPC válasz:", kell);

  if (!kell.success) {
    return false;
  }

  const ertek = kell.message[0].VOLT_E_NPC;

  console.log("Volt-e NPC: " + ertek);

  return ertek == 0;
}

async function specialeffektdoboz() {
  const container = document.querySelector("body");

  let specieffekdoboz = document.createElement("div");
  specieffekdoboz.id = "specieffektdoboz";
  container.appendChild(specieffekdoboz);
}

export async function cutscene_kezeles(k, scene_name, nextScene = null) {
  const data = await fecthData(
    "http://127.0.0.1:3000/api/nyelv_alapjan_JSON_olvasas/" + nyelv + "/kaboomBetolto.json"
  );

  const container = document.body;

  const zene = document.getElementById("zenemarad");

  let elozoMuted = true;
  let elozoVolume = 1;

  if (zene) {
    elozoMuted = zene.muted;
    elozoVolume = zene.volume;
    zene.pause();
  }

  const wrapper = document.createElement("div");
  wrapper.id = "cutscene_wrapper";
  wrapper.style.position = "fixed";
  wrapper.style.inset = "0";
  wrapper.style.width = "100vw";
  wrapper.style.height = "100vh";
  wrapper.style.zIndex = "99999";
  wrapper.style.backgroundColor = "black";
  wrapper.style.display = "flex";
  wrapper.style.justifyContent = "center";
  wrapper.style.alignItems = "center";

  const video = document.createElement("video");
  video.id = "videok";
  video.autoplay = true;
  video.playsInline = true;
  video.style.position = "absolute";
  video.style.inset = "0";
  video.style.width = "100vw";
  video.style.height = "100vh";
  video.style.objectFit = "cover";
  video.style.zIndex = "1";
  video.style.backgroundColor = "black";

  const source = document.createElement("source");
  source.src = "../../cutscenes/" + scene_name + ".mp4";
  source.type = "video/mp4";

  video.appendChild(source);

  const skipButton = document.createElement("button");
  skipButton.textContent = data.data.skip;
  skipButton.style.position = "absolute";
  skipButton.style.top = "20px";
  skipButton.style.left = "20px";
  skipButton.style.zIndex = "2";
  skipButton.style.padding = "12px 20px";
  skipButton.style.fontSize = "20px";
  skipButton.style.cursor = "pointer";
  skipButton.style.border = "2px solid black";
  skipButton.style.background = "white";
  skipButton.style.color = "black";

  wrapper.appendChild(video);
  wrapper.appendChild(skipButton);
  container.appendChild(wrapper);

  let closed = false;

  function cleanupAndGo() {
    if (closed) return;
    closed = true;

    wrapper.remove();

    window.focus();

    const canvas = document.querySelector("canvas");
    if (canvas) {
      canvas.tabIndex = 0;
      canvas.focus();
    }

    if (nextScene != null) {
      k.go(nextScene);
    }

    if (zene) {
      zene.pause();
      //zene.src = "../audio/the_humbling_river.mp3";
      zene.currentTime = 0;
      zene.muted = elozoMuted;
      zene.volume = elozoVolume;

      if (!elozoMuted) {
        zene.play().catch(err => {
          console.log("Zene indítás hiba:", err);
        });
      }
    }
  }

  video.addEventListener("ended", cleanupAndGo);
  skipButton.addEventListener("click", cleanupAndGo);

  k.onKeyPress("enter", () => {
    cleanupAndGo();
  });

  video.load();
}