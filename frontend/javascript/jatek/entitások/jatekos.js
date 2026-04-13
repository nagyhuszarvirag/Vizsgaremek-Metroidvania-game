import { KellEAzNPC, GRAVITY, SPEED, JUMP_FORCE } from "../kaboomBetolto.js";
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
import { MentesLetrehozo } from "../szobak/Szobakezelo.js";
import { Kamera_kezelo } from "./kamera.js";

export async function jatekos_betolt(k, xpos, ypos) {
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

  player.play("idle");

  /*k.camPos(xpos, ypos - 30);
  k.camScale(4);

  Kamera_kezelo(k, xpos, ypos, player);*/


  let kelleprowl = await KellEAzNPC("$.NPC_interactions.Prowl");

  console.log("Kell-e Prowl: " + kelleprowl);

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
      if (kelleprowl) {
        console.log("A player beszél: Prowlral");
        kelleprowl = false;
      }
      return;
    }

    //mentés
    if (aktivMentesPont) {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || user.usernev === "guest") {
        console.log("Guestként nincs mentés");
        return;
      }

      const savepointNev = aktivMentesPont.savepointNev;

      if (!savepointNev) {
        console.log("Nincs savepoint név a mentésponton");
        return;
      }

      const eredmeny = await MentesLetrehozo(user.id, 1, savepointNev);

      console.log("Mentés eredménye:", eredmeny);
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
        
        let moveX = 0;
        let moveY = 0;

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


        if (!player.isGrounded()) {
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