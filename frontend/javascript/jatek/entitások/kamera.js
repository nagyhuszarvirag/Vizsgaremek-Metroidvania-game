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

export async function Kamera_kezelo(k, xpos, ypos, player) {
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
    
      });
}