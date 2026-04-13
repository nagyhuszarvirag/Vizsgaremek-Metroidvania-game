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

export async function Kamera_kezelo(k, xpos, ypos, player, mapW, mapH) {

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

  player.onUpdate(() => {
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
    const targetX = player.pos.x + lookAhead;
    const targetY = player.pos.y + verticalLook;

    //kamera target mozgatása (lassú követés)
    cameraTarget.pos.x += (targetX - cameraTarget.pos.x) * followSpeed;
    cameraTarget.pos.y += (targetY - cameraTarget.pos.y) * followSpeed;

    //k.camPos(cameraTarget.pos.x, cameraTarget.pos.y);

    // kamera méret számítás
    const halfW = k.width() / 2 / k.camScale().x;
    const halfH = k.height() / 2 / k.camScale().y;

    let camX = cameraTarget.pos.x;
    let camY = cameraTarget.pos.y;

    camX = Math.max(halfW, camX);
    camX = Math.min(mapW - halfW, camX);

    camY = Math.max(halfH, camY);
    camY = Math.min(mapH - halfH, camY);

    k.camPos(camX, camY);

  });
}