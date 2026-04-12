import { KellEAzNPC, GRAVITY } from "../kaboomBetolto.js";
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

  k.camPos(xpos, ypos - 30);
  k.camScale(5);

  const SPEED = 120; //Ezt is lehet JSON-ben tárolni security miatt
  const JUMP_FORCE = 400;

  //ideiglenes double jump
  const MAX_JUMPS = 2;
  let jumpsLeft = MAX_JUMPS;

  /*player.onUpdate(() => {
    k.camPos(player.pos);
  });*/
  /*player.onUpdate(() => {
    const cam = k.camPos();

    const celX = player.pos.x;
    const celY = player.pos.y;

    let ujX = cam.x;
    let ujY = cam.y;

    // csak akkor mozduljon vízszintesen, ha már van kis eltérés
    if (Math.abs(celX - cam.x) > 2) {
      ujX = cam.x + (celX - cam.x) * 0.1;
    }

    // függőlegesen mehet normál simítással
    ujY = cam.y + (celY - cam.y) * 0.1;

    k.camPos(Math.round(ujX), Math.round(ujY));
  });*/
  /*player.onUpdate(() => {
  const cam = k.camPos();

  const deadZoneX = 30;
  const deadZoneY = 10;
  const followSpeed = 0.12;

  let targetX = cam.x;
  let targetY = cam.y;

  if (player.pos.x > cam.x + deadZoneX) {
    targetX = player.pos.x - deadZoneX;
  } else if (player.pos.x < cam.x - deadZoneX) {
    targetX = player.pos.x + deadZoneX;
  }

  if (player.pos.y > cam.y + deadZoneY) {
    targetY = player.pos.y - deadZoneY;
  } else if (player.pos.y < cam.y - deadZoneY) {
    targetY = player.pos.y + deadZoneY;
  }

  const ujX = cam.x + (targetX - cam.x) * followSpeed;
  const ujY = cam.y + (targetY - cam.y) * followSpeed;

  k.camPos(ujX, ujY);

  if (player.isGrounded()) {
    jumpsLeft = MAX_JUMPS;
  }
});*/


  //láthatatlan kamera célpont
  const cameraTarget = k.add([
    k.pos(xpos, ypos - 30),
  ]);

  let lookAhead = 0;

  player.onUpdate(() => {
    const followSpeed = 0.08;
    const lookSpeed = 0.1;
    const maxLook = 60;

    //irány alapján cél offset
    let targetLook = 0;

    if (k.isKeyDown(playerEloreMegyGombja)) {
      targetLook = maxLook;
    } else if (k.isKeyDown(playerHatraMegyGombja)) {
      targetLook = -maxLook;
    }

    //lookahead simítás (EZ A VIDEÓ LÉNYEGE)
    lookAhead += (targetLook - lookAhead) * lookSpeed;

    //cél pozíció
    const targetX = player.pos.x + lookAhead;
    const targetY = player.pos.y;

    //kamera target mozgatása (lassú követés)
    cameraTarget.pos.x += (targetX - cameraTarget.pos.x) * followSpeed;
    cameraTarget.pos.y += (targetY - cameraTarget.pos.y) * followSpeed;

    k.camPos(cameraTarget.pos.x, cameraTarget.pos.y);

    if (player.isGrounded()) {
      jumpsLeft = MAX_JUMPS;
    }
  });

  let kelleprowl = await KellEAzNPC("$.NPC_interactions.Prowl");

  console.log("Kell-e Prowl: " + kelleprowl);

  /*player.onCollideUpdate("Prowl", () => {
    k.onKeyPress((key) => {
      //const check
      //Removeolni kell az első futatás után, ez az enternél is kell
      if (key == "e" && kelleprowl) {
        console.log("A player beszél: Prowlral");
        kelleprowl = false;
        console.log(kelleprowl);
      }
    });
  });*/

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

  //A billenytűket majd dinamikusan kell kezelni.
  //Fine tuningolni kell a sebességet

  k.onKeyDown(playerEloreMegyGombja, () => {
    player.flipX = true;
    player.move(SPEED, 0);
  });

  k.onKeyDown(playerHatraMegyGombja, () => {
    player.flipX = false;
    player.move(-SPEED, 0);
  });

  k.onKeyPress(playerUgroGombja, () => {
    /*if (player.isGrounded()) {
      k.setGravity(GRAVITY);
      player.jump(JUMP_FORCE);
    }*/
    if (player.isGrounded()) {
      k.setGravity(GRAVITY);
      player.jump(JUMP_FORCE);
      jumpsLeft = MAX_JUMPS - 1;
    } else if (jumpsLeft > 0) {
      k.setGravity(GRAVITY);
      player.jump(JUMP_FORCE);
      jumpsLeft--;
    }
  });

  [playerHatraMegyGombja, playerEloreMegyGombja, playerUgroGombja].forEach(
    (key) => {
      onKeyPress(key, () => {
        switch (key) {
          case playerUgroGombja:
            player.stop();
            player.play("jump");
            break;

          default:
            player.stop();
            player.play("run");
            break;
        }
      });
      onKeyRelease(key, () => {
        if (
          !isKeyDown(playerHatraMegyGombja) &&
          !isKeyDown(playerEloreMegyGombja) &&
          !isKeyDown("up") &&
          !isKeyDown("down") &&
          !isKeyDown(playerUgroGombja) &&
          player.isGrounded()
        ) {
          player.stop();
          player.play("idle");
        }
      });
    },
  );

  /*
    //Ezt majd a kötélmászásnál lesz jó, másképp le kéne tiltani a gombot, amikor nem lehet használni
    k.onKeyDown("up", () => { 
  player.move(0, -SPEED)
    })

    onKeyDown("down", () => {
  player.move(0, SPEED)
    })*/

  return player;
}
