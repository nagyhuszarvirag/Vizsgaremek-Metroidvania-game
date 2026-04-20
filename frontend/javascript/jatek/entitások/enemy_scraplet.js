import { sebzesAdas } from "./hp_kezelo.js";

export function ScrapletLetrehozas(k, x, y, player, patrolRange = 120) {
    const scraplet = k.add([
        k.sprite("scraplet"),
        k.pos(x, y),
        k.anchor("center"),
        k.area({
            shape: new k.Rect(k.vec2(2, 6), 28, 24),
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
    scraplet.hurtCooldown = false;
    scraplet.irany = 1;
    scraplet.turnCooldown = false;

    scraplet.spawnX = x;
    scraplet.spawnY = y;
    scraplet.patrolRange = patrolRange;

    scraplet.play("idle");

    function randomPihenes() {
        if (scraplet.dead || scraplet.chasing) return;

        scraplet.pihenes = true;
        scraplet.play("idle");

        const pihenesIdo = 2 + Math.random();

        k.wait(pihenesIdo, () => {
            if (!scraplet.exists() || scraplet.dead || scraplet.chasing) return;

            scraplet.pihenes = false;

            if (Math.random() < 0.5) {
                scraplet.irany *= -1;
            }

            randomPihenes();
        });
    }

    k.wait(2, () => {
        if (scraplet.exists()) {
            randomPihenes();
        }
    });

    scraplet.onUpdate(() => {
        if (scraplet.dead) return;
        if (scraplet.attacking) return;
        if (scraplet.hurtCooldown) return;

        const tavolsagX = player.pos.x - scraplet.pos.x;
        const tavolsagY = Math.abs(player.pos.y - scraplet.pos.y);
        const absTavolsagX = Math.abs(tavolsagX);
        const tavSpawnTol = Math.abs(scraplet.pos.x - scraplet.spawnX);

        if (absTavolsagX < 180 && tavolsagY < 60 && tavSpawnTol < 220) {
            scraplet.chasing = true;
        } else {
            scraplet.chasing = false;
        }

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
                if (scraplet.curAnim() !== "idle" && !scraplet.attacking) {
                    scraplet.play("idle");
                }
            }
        } else {
            if (!scraplet.pihenes) {
                scraplet.flipX = scraplet.irany < 0;

                if (scraplet.pos.x <= scraplet.spawnX - scraplet.patrolRange) {
                    scraplet.irany = 1;
                    scraplet.flipX = false;
                }

                if (scraplet.pos.x >= scraplet.spawnX + scraplet.patrolRange) {
                    scraplet.irany = -1;
                    scraplet.flipX = true;
                }

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

    scraplet.onCollideUpdate("player", () => {
        if (scraplet.dead) return;
        if (scraplet.damageCooldown) return;
        if (scraplet.hurtCooldown) return;

        scraplet.damageCooldown = true;
        scraplet.attacking = true;

        scraplet.play("attack");

        sebzesAdas(k, player, 1);

        k.wait(0.35, () => {
            if (!scraplet.exists() || scraplet.dead) return;

            scraplet.attacking = false;

            if (scraplet.chasing || !scraplet.pihenes) {
                scraplet.play("walk");
            } else {
                scraplet.play("idle");
            }
        });

        k.wait(1.0, () => {
            if (!scraplet.exists()) return;
            scraplet.damageCooldown = false;
        });
    });

    k.onCollide("player_attack_hitbox", "scraplet", (hitbox, enemy) => {
        if (enemy !== scraplet) return;
        if (scraplet.dead) return;
        if (scraplet.hurtCooldown) return;

        scraplet.hurtCooldown = true;
        scraplet.hp -= 1;

        console.log("Scraplet HP:", scraplet.hp);

        if (scraplet.hp > 0) {
            scraplet.play("hurt");
            scraplet.move(scraplet.flipX ? 120 : -120, 0);

            k.wait(0.2, () => {
                if (!scraplet.exists() || scraplet.dead) return;

                scraplet.hurtCooldown = false;

                if (scraplet.chasing || !scraplet.pihenes) {
                    scraplet.play("walk");
                } else {
                    scraplet.play("idle");
                }
            });
        }

        if (scraplet.hp <= 0) {
            scraplet.dead = true;
            scraplet.play("die");

            k.wait(0.4, () => {
                if (scraplet.exists()) scraplet.destroy();
            });
        }
    });

    return scraplet;
}