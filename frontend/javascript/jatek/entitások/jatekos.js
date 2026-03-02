export async function jatekos_betolt(k, xpos, ypos) {
    const player=k.add([
        sprite("player"),
        anchor("center"),
		pos(xpos, ypos),
        body(),
        area(),
    ]);

    await camPos(xpos, ypos);
    
    player.onUpdate(() => {
        k.camPos(player.pos);

        if (player.isGrounded()) {
            k.setGravity(0);
		}
    }); 

    k.debug.inspect = true //Ezt a kettőt majd ki kell kapcsolni, ha kész a játék, de most jól jön a teszteléshez
    k.debug.drawArea = true


    const SPEED=120;
    const JUMP_FORCE=400;

    //A billenytűket majd dinamikusan kell kezelni.
    //Fine tuningolni kell a sebességet

    k.onKeyDown("right", () => {
	player.flipX = true
	player.move(SPEED, 0)
    })

    k.onKeyDown("left", () => {
	player.flipX = false
	player.move(-SPEED, 0)
    })

    k.onKeyDown("space", () => { 
	if (player.isGrounded()) {
        k.setGravity(800);
		player.jump(JUMP_FORCE)

		}
    })

    /*
    //Ezt majd a kötélmászásnál lesz jó, másképp le kéne tiltani a gombot, amikor nem lehet használni
    k.onKeyDown("up", () => { 
	player.move(0, -SPEED)
    })

    onKeyDown("down", () => {
	player.move(0, SPEED)
    })*/
}