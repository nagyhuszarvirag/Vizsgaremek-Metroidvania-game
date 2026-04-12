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

const GRAVITY = 700;

export { GRAVITY };

export async function KaboomBetolto(mentes_id) {
  const user = JSON.parse(localStorage.getItem("user"));
  let mentesbetolto;
  if (user.usernev === "guest") {
    console.log("Guest mentés betöltése localStorage-ból");
    console.log(localStorage.getItem("mentes_0"));
    //mentesbetolto = JSON.parse(localStorage.getItem("mentes_" + mentes_id));
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

  let kellintro = false;
  //console.log("Mentés betöltve: " + mentesbetolto.data.mentett_adatok.savepoint);
  console.log("Mentés betöltve: ", mentesbetolto);

  const scale = 1;

  const k = kaboom({
    width: window.innerWidth,
    height: window.innerHeight,
    scale: scale,
  });

  /*k.scene("kezdoszoba", (adatok) => {
    Kezdoszoba(k, adatok?.szoba_belepesi_pont ?? null);
  });*/

  /*k.scene("mitteous", (adatok) => {
    Mitteous(k, adatok?.szoba_belepesi_pont ?? null);
  });*/

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

  //console.log("x:"+window.innerWidth+" y:"+window.innerHeight);

  k.scene("intro", () => {
    k.add([
      k.text("Skip Intro"),
      //k.pos(window.innerWidth-50 , window.innerHeight-850),
      k.pos(191, 566),
      k.color(k.Color.fromHex("#000000")),
    ]);

    k.add([
      k.pos(191, 566),
      k.area({
        shape: new k.Rect(k.vec2(0), 200, 60),
      }),
      k.body({ isStatic: true }),
      "SkipIntro",
    ]);


    kellintro = true;

    k.onClick("SkipIntro", () => {
      //ezt dinamikussá tenni könnyű cancel érdekében, ez lesz majd a skip intro gomb
      //Ide majd zenét elindítását is belerakhatjuk
      if (kellintro) {
        console.log("Intro átugorva");
        kellintro = false;
        k.destroyAll("SkipIntro");
        k.go("Kezdoszoba");
      }
    });

    k.onKeyPress("enter", () => {
      //ezt dinamikussá tenni könnyű cancel érdekében, ez lesz majd a skip intro gomb
      //Ide majd zenét elindítását is belerakhatjuk
      if (kellintro) {
        console.log("Intro átugorva");
        kellintro = false;
        k.destroyAll("SkipIntro");
        k.go("Kezdoszoba");
      }
    });
  });


  //kezdőmap sprite
  k.loadSprite("Kezdoszoba", "../../images/maps/kezdomap.png"); //Itt midnig be kell tölteni a szoba spriteját késúbbi kezelésre

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
    "Smelting_Pits_Collapsing_ground",
    "../../images/maps/Smelting pits_collapsing_ground.png",
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
      jump: { from: 36, to: 38, speed: 5 },
      run_and_jump: { from: 12, to: 14, loop: true },
      attack: { from: 24, to: 28, speed: 16 },
      hurt: { from: 60, to: 63, speed: 16 },
    },
  });

  k.loadSprite("Prowl", "../../images/sprites/Prowl.png", {
    sliceX: 8,
    sliceY: 1,
    anims: {
      idle: { from: 0, to: 7, loop: true },
    },
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
  if (user.usernev === "guest") {
    return true;
  }

  const kell = await fecthData(
    "http://127.0.0.1:3000/api/kelleNPC",
    "POST",
    {
      valtozo_utvonal,
      mentes_id: 1,
      user_id: JSON.parse(localStorage.getItem("user")).id
    }
  );

  console.log("kelleNPC válasz:", kell);

  if (!kell.success || !kell.message) {
    return false;
  }

  const ertek = kell.message.VOLT_E_NPC;

  return ertek === 0 || ertek === false || ertek === "false";
}
