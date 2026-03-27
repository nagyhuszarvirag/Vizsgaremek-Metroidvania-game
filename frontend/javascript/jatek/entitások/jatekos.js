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

export async function jatekos_betolt(k, xpos, ypos) {
  const player = k.add([
    k.sprite("player"),
    k.pos(xpos, ypos),
    k.anchor("center"),
    k.area({
      shape: new k.Rect(k.vec2(0, 1), 20, 30), //itt tudod állítgatni a boxát a vec2 az a box pozíciója a másik két szám pedig a szélesség magasság
    }),
    k.body(),
    "player",
  ]);

  player.play("idle");

  k.camPos(xpos, ypos);
  k.camScale(3);

  const SPEED = 120; //Ezt is lehet JSON-ben tárolni security miatt
  const JUMP_FORCE = 400;

  player.onUpdate(() => {
    k.camPos(player.pos);

    if (player.isGrounded()) {
      k.setGravity(0);
    }
  });

  let kelleprowl = await KellEAzNPC("$.NPC_interactions.Prowl");

  console.log("Kell-e Prowl: "+kelleprowl);

  player.onCollideUpdate("Prowl", () => {
    k.onKeyPress((key) => {
      //const check
      //Removeolni kell az első futatás után, ez az enternél is kell
      if (key == "e" && kelleprowl) {
        console.log("A player beszél: Prowlral");
        kelleprowl = false;
        console.log(kelleprowl);
      }
    });
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

  k.onKeyDown(playerUgroGombja, () => {
    if (player.isGrounded()) {
      k.setGravity(GRAVITY);
      player.jump(JUMP_FORCE);
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
