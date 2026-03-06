import { KellEAzNPC } from "../kaboomBetolto.js";

export async function jatekos_betolt(k, xpos, ypos) {
  const player = k.add([
    k.sprite("player"),
    k.pos(xpos, ypos),
    k.anchor("center"),
    k.area({
      shape: new k.Rect(k.vec2(0, 1), 20, 30), //itt tudod állítgatni a boxát a vec2 az a box pozíciója a másik két szám pedig a szélesség magasság
      //collisionIgnore: ["Prowl"],
    }),
    k.body(),
    "player",
  ]);

  k.camPos(xpos, ypos);
  k.camScale(3);

  player.onUpdate(() => {
    k.camPos(player.pos);

    if (player.isGrounded()) {
      k.setGravity(0);
    }
  });

  let kelleprowl = await KellEAzNPC(
    JSON.parse(localStorage.getItem("user")).id,
    1,
  );

  console.log(kelleprowl);

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

  k.debug.inspect = true; //Ezt a kettőt majd ki kell kapcsolni, ha kész a játék, de most jól jön a teszteléshez
  k.debug.drawArea = true;

  const SPEED = 120; //Ezt is lehet JSON-ben tárolni security miatt
  const JUMP_FORCE = 400;

  //A billenytűket majd dinamikusan kell kezelni.
  //Fine tuningolni kell a sebességet

  k.onKeyDown("right", () => {
    player.flipX = true;
    player.move(SPEED, 0);
  });

  k.onKeyDown("left", () => {
    player.flipX = false;
    player.move(-SPEED, 0);
  });

  k.onKeyDown("space", () => {
    if (player.isGrounded()) {
      k.setGravity(800);
      player.jump(JUMP_FORCE);
    }
  });

  /*
    //Ezt majd a kötélmászásnál lesz jó, másképp le kéne tiltani a gombot, amikor nem lehet használni
    k.onKeyDown("up", () => { 
	player.move(0, -SPEED)
    })

    onKeyDown("down", () => {
	player.move(0, SPEED)
    })*/
}
