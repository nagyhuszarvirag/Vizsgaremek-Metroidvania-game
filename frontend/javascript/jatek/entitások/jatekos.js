import { KellEAzNPC, cutscene_kezeles, GRAVITY, SPEED, JUMP_FORCE, mentesunk_idja, aktivMentesAdatok } from "../kaboomBetolto.js";
import {
  volume,
  nyelv,
  playerEloreMegyGombja,
  playerHatraMegyGombja,
  playerUgroGombja,
  playerAttackGombja,
  playerInteractGombja,
  mobileMode,
} from "../../options.js";
import { MentesLetrehozo, TeljesMentesLetrehozo, szoba_zene_beallitas } from "../szobak/Szobakezelo.js";
import { hpRendszerBeallitas } from "./hp_kezelo.js";
import { hpUI } from "./hp_ui.js";
import {beallitasMenuLetrehoz} from "../../beallitas_menu.js";
import { fecthData } from "../../index.js";
import { startGame } from "../../start_game.js";

export async function jatekos_betolt(k, xpos, ypos, current_map = "semelyik") {
  const player = k.add([
    k.sprite("player"),
    k.pos(xpos, ypos - 30), //a -30 azért kell, hogy a játékos ne a lábánál legyen lerakva, hanem a közepénél
    k.anchor("center"),
    k.area({
      shape: new k.Rect(k.vec2(0, 1), 20, 30), //itt tudod állítgatni a boxát a vec2 az a box pozíciója a másik két szám pedig a szélesség magasság
    }),
    k.body(),
    "player",
  ]);

  let kezdoSzivek = 5; //Majd a mentés adatai-ba bele lesz rakva a két plussz perma hp, úgyhogy majd azt felhasználhatjuk, hogy mindig jó mentés, jó hp-t kapjon

  if (aktivMentesAdatok?.world_interactions?.["bonus-hp-1"] === true) {
    kezdoSzivek += 1;
  }

  if (aktivMentesAdatok?.world_interactions?.["bonus-hp-2"] === true) {
    kezdoSzivek += 1;
  }

  if (aktivMentesAdatok?.world_interactions?.["bonus-hp-3"] === true) {
    kezdoSzivek += 1;
  }


  hpRendszerBeallitas(player, kezdoSzivek);
  player.hpUI = hpUI(k, player);

  player.letaranVan = false;
  player.aktivLetra = null;
  player.letraSebesseg = 100;
  player.tamad = false;
  player.tamadasAblakNyitva = false;
  player.serul = false;
  player.knockbackX = 0;
  player.knockbackY = 0;
  player.knockbackTimer = 0;

  player.play("idle");

  /*k.camPos(xpos, ypos - 30);
  k.camScale(4);

  Kamera_kezelo(k, xpos, ypos, player);*/


  let kelleprowl = await KellEAzNPC("$.NPC_interactions.Prowl");
  let kellerachet = await KellEAzNPC("$.NPC_interactions.Ratchet");
  let kelleswindle = await KellEAzNPC("$.NPC_interactions.Swindle");
  let kelletailgate = await KellEAzNPC("$.NPC_interactions.Tailgate");
  let kelleChromedome_and_Ratchet_combo = await KellEAzNPC("$.NPC_interactions.Chromedome_and_Ratchet");

  //console.log("Kell-e Prowl: " + kelleprowl);

  let aktivNPC = null;
  let aktivMentesPont = null;

  player.onCollideUpdate("Prowl", (obj) => {
    if (kelleprowl) {
      aktivNPC = obj;
    }
  });

  player.onCollideEnd("Prowl", (obj) => {
    if (aktivNPC === obj) {
      aktivNPC = null;
    }
  });

  player.onCollideUpdate("Ratchet", (obj) => {
    if (kellerachet) {
      aktivNPC = obj;
    }
  });

  player.onCollideEnd("Ratchet", (obj) => {
    if (aktivNPC === obj) {
      aktivNPC = null;
    }
  });

  player.onCollideUpdate("Swindle", (obj) => {
    if (kelleswindle) {
      aktivNPC = obj;
    }
  });

  player.onCollideEnd("Swindle", (obj) => {
    if (aktivNPC === obj) {
      aktivNPC = null;
    }
  });

  player.onCollideUpdate("Tailgate", (obj) => {
    if (kelletailgate) {
      aktivNPC = obj;
    }
  });

  player.onCollideEnd("Tailgate", (obj) => {
    if (aktivNPC === obj) {
      aktivNPC = null;
    }
  });

  player.onCollideUpdate("Chromedome_and_Ratchet", (obj) => {
    if (kelleChromedome_and_Ratchet_combo) {
      aktivNPC = obj;
    }
  });

  player.onCollideEnd("Chromedome_and_Ratchet", (obj) => {
    if (aktivNPC === obj) {
      aktivNPC = null;
    }
  });

  player.onCollideUpdate("mentespont", (obj) => {
    aktivMentesPont = obj;
  });

  player.onCollideEnd("mentespont", (obj) => {
    if (aktivMentesPont === obj) {
      aktivMentesPont = null;
    }
  });

  k.onKeyPress(playerInteractGombja, async () => {
    //NPC
    if (aktivNPC) {
      switch (current_map) {
        case "Kezdoszoba":
          if (kelleprowl) {
            cutscene_kezeles(k, "prowl_chromedome_and_rewind");
            kelleprowl = false;
          }
          break;

        case "Mitteous_Plateau":
          if (kelleChromedome_and_Ratchet_combo) {
            cutscene_kezeles(k, "tailgate_a_föld_alatt");
            kelleChromedome_and_Ratchet_combo = false;
          }
          break;

        case "Iacon":
          if (kelleswindle) {
            cutscene_kezeles(k, "swindle");
            kelleswindle = false;
          }
          break;

        case "Medbay":
          if (kellerachet) {
            cutscene_kezeles(k, "rigor_morphis");
            kellerachet = false;
          }
          break;

        case "Leesos_hely":
          if (kelletailgate) {
            cutscene_kezeles(k, "tailgate_a_föld_alatt");
            kelletailgate = false;
          }
          break;

        default:
          console.log("Ismeretlen szoba");
          break;
      }

      return;
    }

    //mentés
    if (aktivMentesPont) {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || user.usernev === "guest") {
        //Guestként lokális mentés van csak
        console.log("Guestként nincs mentés");
        return;
      }

      const savepointNev = aktivMentesPont.savepointNev;

      if (!savepointNev) {
        console.log("Nincs savepoint név a mentésponton");
        return;
      }

      if (aktivMentesAdatok) {
        aktivMentesAdatok.savepoint = savepointNev;
      }

      const eredmeny = await TeljesMentesLetrehozo(
        user.id,
        mentesunk_idja + 1,
        aktivMentesAdatok
      );

      console.log("Mentés létrehozva: ", aktivMentesAdatok);

      console.log("Mentés eredménye:", eredmeny);
    }
  });

  k.onMousePress(() => { //Ezt akkor is le kell kezelni, ha nem a left click a támadás
    if (playerAttackGombja !== "left click") return;
    if (player.tamad) return;
    if (player.letaranVan) return;

    //console.log("Támadás lefutott");

    player.tamad = true;
    player.tamadasAblakNyitva = false;
    player.play("attack");

    k.wait(0.12, () => {
      if (!player.exists() || !player.tamad) return;

      player.tamadasAblakNyitva = true;

      const attackHitbox = k.add([
        k.pos(
          player.flipX ? player.pos.x + 18 : player.pos.x - 38,
          player.pos.y - 10
        ),
        k.rect(40, 25),
        k.area(),
        k.opacity(0),
        "player_attack_hitbox",
      ]);

      k.wait(0.12, () => {
        if (attackHitbox.exists()) {
          attackHitbox.destroy();
        }
        player.tamadasAblakNyitva = false;
      });
    });

    k.wait(0.45, () => {
      if (!player.exists()) return;
      player.tamad = false;
    });
  });

  let nyitott_menu=false;
  k.onKeyPress("escape", async () => {
    if(!nyitott_menu){
      nyitott_menu=true;

      const szoveg_adata = await fecthData("http://127.0.0.1:3000/api/nyelv_alapjan_JSON_olvasas/" +nyelv +"/in_game_menu.json");

      In_game_menu(szoveg_adata.data, k);

      //kilep_jatekbol(k); //Ezt ki kell venni majd

      /*let beallitas_modal_head=document.createElement("div");
      let beallitas_modal_body=document.createElement("div");
      let beallitas_modal_foot=document.createElement("div");

      const userData = JSON.parse(localStorage.getItem("user")) || {id: 0,};
      beallitasMenuLetrehoz(userData.id, beallitas_modal_head, beallitas_modal_body, beallitas_modal_foot);*/
    }
    else{
      return;
    }
  });

  player_mozgas_es_animacio_kezeles(player, k);

  return player;
}


async function player_mozgas_es_animacio_kezeles(player, k) {

  //A billenytűket majd dinamikusan kell kezelni.
  //Fine tuningolni kell a sebességet

  //ideiglenes double jump
  const MAX_JUMPS = 2;
  let jumpsLeft = MAX_JUMPS;

  if (player.isGrounded()) {
    jumpsLeft = MAX_JUMPS;
  };

  k.onKeyPress(playerUgroGombja, () => { //Ezt nem szabad az OnUpdate-ba rakni, mert akkor minden frame-ben megpróbál ugrani a játékos, ha lenyomva tartja a gombot és megszívjuk
    if (player.letaranVan) {
      player.letaranVan = false;
      k.setGravity(GRAVITY);

      if (player.vel) {
        player.vel.x = 0;
        player.vel.y = 0;
      }

      player.jump(JUMP_FORCE);
      return;
    }


    if (player.isGrounded()) {
      player.jump(JUMP_FORCE);
      jumpsLeft = MAX_JUMPS - 1;
    } else if (jumpsLeft > 0) {
      player.jump(JUMP_FORCE);
      jumpsLeft--;
    }
  });

  k.onUpdate(() => {
    //Optimalizált mozgás (Remélem ez így jó lesz c:)

    if (player.knockbackTimer > 0) {
      player.knockbackTimer -= k.dt();

      player.move(player.knockbackX, player.knockbackY);

      player.knockbackX *= 0.88;
      player.knockbackY *= 0.92;
    }

    let moveX = 0;
    let moveY = 0;

    if (player.tamad) {
      return;
    }

    if (player.letaranVan) {
      const climbSpeed = player.letraSebesseg;

      k.setGravity(0);

      if (player.aktivLetra) {
        player.pos.x = player.aktivLetra.pos.x + player.aktivLetra.letraWidth / 2;
      }

      if (player.vel) {
        player.vel.x = 0;
        player.vel.y = 0;
      }

      if (player.aktivLetra) {
        const playerHalfHeight = 15;
        const letraTop = player.aktivLetra.pos.y + playerHalfHeight;
        const letraBottom = player.aktivLetra.pos.y + player.aktivLetra.letraHeight - playerHalfHeight;

        if (k.isKeyDown("w")) { //Ezt áttenni dinamikussá
          player.pos.y -= climbSpeed * k.dt();
        }

        if (k.isKeyDown("s")) {
          player.pos.y += climbSpeed * k.dt();
        }

        if (player.pos.y < letraTop) {
          player.pos.y = letraTop;
        }

        if (player.pos.y > letraBottom) {
          player.pos.y = letraBottom;
        }
      }

      let targetAnim = "idle";
      if (k.isKeyDown("w") || k.isKeyDown("s")) {
        targetAnim = "run";
      }

      if (player.curAnim() !== targetAnim) {
        player.play(targetAnim);
      }

      return;
    }

    k.setGravity(GRAVITY);

    if (k.isKeyDown(playerEloreMegyGombja)) {
      player.flipX = true;
      moveX += SPEED;
    }
    if (k.isKeyDown(playerHatraMegyGombja)) {
      player.flipX = false;
      moveX -= SPEED;
    }

    if (player.isGrounded()) {
      jumpsLeft = MAX_JUMPS;
    }


    if (k.isKeyDown("up")) {
      moveY -= SPEED;
    }
    if (k.isKeyDown("down")) {
      moveY += SPEED;
    }

    player.move(moveX, moveY);

    //Animációk kezelése

    let targetAnim = "idle";

    if (player.serul) {
      targetAnim = "hurt";
    }
    else if (!player.isGrounded()) {
      targetAnim = "jump";
    }
    else if (moveX !== 0) {
      targetAnim = "run";
    }

    if (player.curAnim() !== targetAnim) {
      player.play(targetAnim);
    }

  });

}

function In_game_menu(szoveg, k) { //Nem jelenik meg, meg kell javítani
  //Ez az alapja: https://www.w3schools.com/booTsTrap/tryit.asp?filename=trybs_modal&stacked=h
  console.log("in game menü megnyitva");
    let legkulsobbmodaldiv=document.createElement("div");
    let kulsomodaldiv=document.createElement("div");
    let modaldiv=document.createElement("div");
    let jatek_menu_modal_head=document.createElement("div");
    let jatek_menu_modal_body=document.createElement("div");
    let jatek_menu_modal_foot=document.createElement("div");

    let h4=document.createElement("h4");
    //Modal head
    
    h4.innerText=szoveg.valassz;
    jatek_menu_modal_head.appendChild(h4);

    let gomb=document.createElement("button");
    gomb.classList.add("menu-gomb", "gombok");
    //Modal body - Beállítások

    gomb.addEventListener("click", async () => {
      console.log("Itt a beállítások menüt be kell pakolni a modalba");
    });
    
    h4.innerText=szoveg.valassz;
    jatek_menu_modal_body.appendChild(gomb);

    gomb=document.createElement("button");
    gomb.classList.add("menu-gomb", "gombok");
    //Modal body - Kilépés a játékból

    gomb.addEventListener("click", async () => {
      console.log("Itt ki kell lépni a játékból");
      kilep_jatekbol(k);
    });

    h4.innerText=szoveg.valassz;
    jatek_menu_modal_body.appendChild(gomb);

    gomb=document.createElement("button");
    gomb.classList.add("menu-gomb", "gombok");
    //Modal foot - Vissza a játékba

    gomb.addEventListener("click", async () => {
      console.log("Itt vissza kell lépni a játékba");
    });
    
    gomb.innerText=szoveg.vissza;
    jatek_menu_modal_foot.appendChild(gomb);


    h4.classList.add("modal-title");
    jatek_menu_modal_head.classList.add("modal-header");
    jatek_menu_modal_body.classList.add("modal-body");
    jatek_menu_modal_foot.classList.add("modal-footer");
    modaldiv.classList.add("modal-content");
    kulsomodaldiv.classList.add("modal-dialog");
    legkulsobbmodaldiv.classList.add("modal", "fade", "in_game_modallok");

    modaldiv.appendChild(jatek_menu_modal_head);
    modaldiv.appendChild(jatek_menu_modal_body);
    modaldiv.appendChild(jatek_menu_modal_foot);
    kulsomodaldiv.appendChild(modaldiv);
    legkulsobbmodaldiv.appendChild(kulsomodaldiv);
    document.getElementById("in_game_menu_tarolo").appendChild(legkulsobbmodaldiv);

}

async function kilep_jatekbol(k) {
  k.quit();
  startGame();
  szoba_zene_beallitas("the_humbling_river");
}