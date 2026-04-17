import { sebzesAdas } from "./hp_kezelo.js";

export function ScrapletLetrehozas(k, x, y, player) {
    const scraplet = k.add([
        k.sprite("scraplet"),
        k.pos(x, y),
        k.anchor("center"),
        k.area({
            shape: new k.Rect(k.vec2(6, 8), 20, 18),
        }),
        k.body(),
        "enemy",
        "scraplet",
    ]);

    scraplet.hp = 4;
    scraplet.dead = false;
    scraplet.attacking = false;
    scraplet.chasing = false;
    scraplet.pihenes = false;
    scraplet.speed = 45;
    scraplet.damageCooldown = false;
    scraplet.irany = 1;
    scraplet.utolsoFordulas = 0;

    scraplet.play("idle");

    function randomPihenes() {
        if (scraplet.dead || scraplet.chasing) return;

        scraplet.pihenes = true;
        scraplet.play("idle");

        const pihenesIdo = 2 + Math.random(); // 2-3 mp

        k.wait(pihenesIdo, () => {
            if (!scraplet.exists() || scraplet.dead || scraplet.chasing) return;
            scraplet.pihenes = false;

            // néha forduljon is
            if (Math.random() < 0.5) {
                scraplet.irany *= -1;
            }

            randomPihenes();
        });
    }

    //pihenés ciklus
    k.wait(2, () => {
        if (scraplet.exists()) {
            randomPihenes();
        }
    });

    scraplet.onUpdate(() => {
        if (scraplet.dead) return;

        const tavolsagX = player.pos.x - scraplet.pos.x;
        const tavolsagY = Math.abs(player.pos.y - scraplet.pos.y);
        const absTavolsagX = Math.abs(tavolsagX);

        //látótáv
        if (absTavolsagX < 180 && tavolsagY < 60) {
            scraplet.chasing = true;
        } else {
            scraplet.chasing = false;
        }

        if (scraplet.attacking) return;

        if (scraplet.chasing) {
            scraplet.pihenes = false;

            if (absTavolsagX > 20) {
                scraplet.irany = tavolsagX > 0 ? 1 : -1;
                scraplet.flipX = scraplet.irany < 0;
                scraplet.move(scraplet.irany * scraplet.speed, 0);

                if (scraplet.curAnim() !== "walk") {
                    scraplet.play("walk");
                }
            } else {
                if (scraplet.curAnim() !== "idle") {
                    scraplet.play("idle");
                }
            }
        } else {
            if (!scraplet.pihenes) {
                scraplet.flipX = scraplet.irany < 0;
                scraplet.move(scraplet.irany * scraplet.speed * 0.5, 0);

                if (scraplet.curAnim() !== "walk") {
                    scraplet.play("walk");
                }
            } else {
                if (scraplet.curAnim() !== "idle") {
                    scraplet.play("idle");
                }
            }
        }
    });

    //player sebzése érintésre
    scraplet.onCollide("player", () => {
        if (scraplet.dead) return;
        if (scraplet.damageCooldown) return;

        scraplet.damageCooldown = true;
        scraplet.attacking = true;

        scraplet.play("attack");

        sebzesAdas(k, player, 1);

        k.wait(0.5, () => {
            if (!scraplet.exists() || scraplet.dead) return;
            scraplet.attacking = false;
        });

        k.wait(1.2, () => {
            if (!scraplet.exists()) return;
            scraplet.damageCooldown = false;
        });
    });

    //player támadása enemyre
    k.onCollide("player_attack_hitbox", "scraplet", (hitbox, enemy) => {
        if (enemy !== scraplet) return;
        if (scraplet.dead) return;

        scraplet.hp -= 1;
        console.log("Scraplet HP:", scraplet.hp);

        // kis knockback
        scraplet.move(scraplet.flipX ? 120 : -120, 0);

        if (scraplet.hp <= 0) {
            scraplet.dead = true;
            scraplet.destroy();
        }
    });

    return scraplet;
}