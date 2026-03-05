export async function jatekos_betolt(k, xpos, ypos) {
    //k.setGravity(800);

    const player = k.add([
        k.sprite("player"),
        k.pos(xpos, ypos),
        k.anchor("center"),
        k.area({
            shape: new k.Rect(k.vec2(0, 1), 35, 32) //itt tudod állítgatni a boxát a vec2 az a box pozíciója a másik két szám pedig a szélesség magasság
        }),
        k.body(),
        "player",
    ]);

    k.camPos(player.pos);

    player.onUpdate(() => {
        k.camPos(player.pos);

        /*if (player.isGrounded()) {
            k.setGravity(0);
        }*/
    });

    k.debug.inspect = true //Ezt a kettőt majd ki kell kapcsolni, ha kész a játék, de most jól jön a teszteléshez
    k.debug.drawArea = true


    const SPEED = 120;
    const JUMP_FORCE = 400;

    //A billenytűket majd dinamikusan kell kezelni.
    //Fine tuningolni kell a sebességet

    k.onKeyDown("right", () => {
        player.flipX = true
        player.move(SPEED, 0)
    });

    k.onKeyDown("left", () => {
        player.flipX = false
        player.move(-SPEED, 0)
    });

    k.onKeyDown("space", () => {
        if (player.isGrounded()) {
            player.jump(JUMP_FORCE)

        }
    });

    return player;

    /*
    //Ezt majd a kötélmászásnál lesz jó, másképp le kéne tiltani a gombot, amikor nem lehet használni
    k.onKeyDown("up", () => { 
    player.move(0, -SPEED)
    })

    onKeyDown("down", () => {
    player.move(0, SPEED)
    })*/
}