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
import { Kod } from "../szobak/Szobakezelo.js";

export async function Kamera_kezelo(k, xpos, ypos, player, mapW, mapH, bossArenaObj = null) {

  k.camPos(xpos, ypos - 30);
  k.camScale(4);

  //láthatatlan kamera célpont
  const cameraTarget = k.add([
    k.pos(xpos, ypos - 30),
  ]);

  let lookAhead = 0;
  let verticalLook = 0;

  let prevY = player.pos.y;
  let velocityY = 0;

  let bossArenaAktiv = false;

  if (bossArenaObj) {
    player.onCollideUpdate("boss_arena_zone", () => {
      bossArenaAktiv = true;
    });

    player.onCollideEnd("boss_arena_zone", () => {
      bossArenaAktiv = false;
    });
  }

  player.onUpdate(async () => {
    const followSpeed = 0.08;
    const lookSpeed = 0.1;
    const maxLook = 60;

    const verticalLookSpeed = 0.08;
    const maxUpLook = 40;
    const maxDownLook = 60;

    velocityY = player.pos.y - prevY;
    prevY = player.pos.y;

    //irány alapján cél offset
    let targetLook = 0;

    if (k.isKeyDown(playerEloreMegyGombja)) {
      targetLook = maxLook;
    } else if (k.isKeyDown(playerHatraMegyGombja)) {
      targetLook = -maxLook;
    }

    //lookahead simítás (EZ A VIDEÓ LÉNYEGE)
    lookAhead += (targetLook - lookAhead) * lookSpeed;

    let targetVertical = 0;

    if (!player.isGrounded()) {
      if (velocityY < 0) {
        targetVertical = -maxUpLook;
      } else if (velocityY > 0) {
        targetVertical = maxDownLook;
      }
    }

    verticalLook += (targetVertical - verticalLook) * verticalLookSpeed;

    //cél pozíció
    let targetX = player.pos.x + lookAhead;
    let targetY = player.pos.y + verticalLook;

    //k.camPos(cameraTarget.pos.x, cameraTarget.pos.y);

    //kamera méret számítás
    const halfW = k.width() / 2 / k.camScale().x;
    const halfH = k.height() / 2 / k.camScale().y;

    /*if (bossArenaAktiv && bossArenaObj) {
      //boss aréna közepére húzzuk a kamerát
      const arenaCenterX = bossArenaObj.x + bossArenaObj.width / 2;
      const arenaCenterY = bossArenaObj.y + bossArenaObj.height / 2;

      targetX = arenaCenterX;
      targetY = arenaCenterY;
    }*/

    //kamera target mozgatása (lassú követés)
    cameraTarget.pos.x += (targetX - cameraTarget.pos.x) * followSpeed;
    cameraTarget.pos.y += (targetY - cameraTarget.pos.y) * followSpeed;


    let camX = cameraTarget.pos.x;
    let camY = cameraTarget.pos.y;

    if (bossArenaAktiv && bossArenaObj) {
      //boss arénán belüli clamp
      const arenaMinX = bossArenaObj.x + halfW;
      const arenaMaxX = bossArenaObj.x + bossArenaObj.width - halfW;
      const arenaMinY = bossArenaObj.y + halfH;
      const arenaMaxY = bossArenaObj.y + bossArenaObj.height - halfH;

      if (arenaMaxX >= arenaMinX) {
        camX = Math.max(arenaMinX, camX);
        camX = Math.min(arenaMaxX, camX);
      } else {
        camX = bossArenaObj.x + bossArenaObj.width / 2;
      }

      if (arenaMaxY >= arenaMinY) {
        camY = Math.max(arenaMinY, camY);
        camY = Math.min(arenaMaxY, camY);
      } else {
        camY = bossArenaObj.y + bossArenaObj.height / 2;
      }
    } else {
      //normál map clamp
      camX = Math.max(halfW, camX);
      camX = Math.min(mapW - halfW, camX);

      camY = Math.max(halfH, camY);
      camY = Math.min(mapH - halfH, camY);
    }

      k.camPos(camX, camY);


      if(true){
        const kodkezelo = await Kod();
        kodkezelo.update(4, camX, camY);
      }
    });
}