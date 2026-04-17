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
import { hpRendszerBeallitas } from "./hp_kezelo.js";
import { hpUI } from "./hp_ui.js";

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

  let kezdoSzivek = 5;

  if (localStorage.getItem("kaon_bonus_heart_picked") === "true") {
    kezdoSzivek += 1;
  }

  if (localStorage.getItem("hidden_room_heart_picked") === "true") {
    kezdoSzivek += 1;
  }

  hpRendszerBeallitas(player, kezdoSzivek);
  player.hpUI = hpUI(k, player);

  player.letaranVan = false;
  player.aktivLetra = null;
  player.letraSebesseg = 100;
  player.tamad = false;
  player.tamadasAblakNyitva = false;

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

  k.onMousePress(() => {
    if (playerAttackGombja !== "left click") return;
    if (player.tamad) return;
    if (player.letaranVan) return;

    console.log("Támadás lefutott");

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

        if (k.isKeyDown("w")) {
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