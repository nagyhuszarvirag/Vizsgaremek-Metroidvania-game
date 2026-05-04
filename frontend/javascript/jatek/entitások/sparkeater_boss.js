import { sebzesAdas } from "./hp_kezelo.js";
import { aktivMentesAdatok } from "../kaboomBetolto.js";
import { unlockUzenet } from "./unlock_uzenet_UI.js";
import { soundeffectLetrehoz, soundeffectTorol} from "../szobak/Cemetery.js";
import { fecthData } from "../../index.js";
import { settings } from "../../options.js";

export function SparkeaterLetrehozas(k, x, y, player, arenaObj) {
    const boss = k.add([
        k.sprite("Sparkeater"),
        k.pos(x, y),
        k.anchor("center"),
        k.area({
            shape: new k.Rect(k.vec2(2.5, 0), 45, 55),
        }),
        k.body(),
        "sparkeater",
        "boss",
    ]);

    boss.hp = 30;
    boss.speed = 75;
    boss.dead = false;
    boss.attacking = false;
    boss.damageBoosted = false;
    boss.attackCooldown = 0;
    boss.grappleCooldown = 0;
    boss.screamCooldown = 0;
    boss.hitCooldown = false;
    boss.fightActive = false;
    boss.stuckTimer = 0;
    boss.hopCooldown = 0;

    boss.play("idle");

    function playerArenabanVan() {
        if (!arenaObj) return true;

        return (
            player.pos.x >= arenaObj.x &&
            player.pos.x <= arenaObj.x + arenaObj.width &&
            player.pos.y >= arenaObj.y &&
            player.pos.y <= arenaObj.y + arenaObj.height
        );
    }

    function arenaClamp() {
        if (!arenaObj) return;

        const minX = arenaObj.x + 20;
        const maxX = arenaObj.x + arenaObj.width - 20;
        const minY = arenaObj.y + 25;
        const maxY = arenaObj.y + arenaObj.height - 25;

        boss.pos.x = Math.max(minX, Math.min(maxX, boss.pos.x));
        boss.pos.y = Math.max(minY, Math.min(maxY, boss.pos.y));
    }

    function tavolsagPlayerhez() {
        const dx = player.pos.x - boss.pos.x;
        const dy = player.pos.y - boss.pos.y;
        return {
            dx,
            dy,
            absX: Math.abs(dx),
            absY: Math.abs(dy),
            dist: Math.sqrt(dx * dx + dy * dy),
        };
    }

    function damageErtek(alap) {
        if (!boss.damageBoosted) return alap;

        boss.damageBoosted = false;
        return alap * 2;
    }

    function bossAnim(anim) {
        if (!boss.exists()) return;
        if (boss.curAnim() === anim) return;
        boss.play(anim);
    }

    function normalAttack() {
        if (boss.attacking || boss.dead) return;

        boss.attacking = true;
        boss.attackCooldown = 1.4;

        bossAnim("attack");

        k.wait(0.25, () => {
            if (!boss.exists() || boss.dead) return;

            const irany = player.pos.x > boss.pos.x ? 1 : -1;

            const hitboxW = 55;
            const hitboxH = 45;

            const hitboxX = irany === 1
                ? boss.pos.x + 20
                : boss.pos.x - 20 - hitboxW;

            const hitboxY = boss.pos.y - hitboxH / 2;

            const hitbox = k.add([
                k.pos(hitboxX, hitboxY),
                k.rect(hitboxW, hitboxH),
                k.area(),
                k.opacity(0.4),
                k.color(255, 0, 0),
                "sparkeater_attack_hitbox",
            ]);

            k.wait(0.15, () => {
                if (hitbox.exists()) hitbox.destroy();
            });
        });

        k.wait(0.65, () => {
            if (!boss.exists() || boss.dead) return;

            boss.attacking = false;
        });
    }

    function grappleAttack() {
        if (boss.attacking || boss.dead) return;
        if (!boss.fightActive) return;

        boss.attacking = true;
        boss.grappleCooldown = 3.0;

        bossAnim("grapple");

        k.wait(0.25, () => {
            if (!boss.exists() || boss.dead || !boss.fightActive) return;

            const irany = player.pos.x > boss.pos.x ? 1 : -1;
            boss.flipX = irany < 0;

            const startX = boss.pos.x + irany * 35;
            const startY = boss.pos.y - 8;

            const targetX = player.pos.x;
            const targetY = player.pos.y - 8;

            const dx = targetX - startX;
            const dy = targetY - startY;

            const tav = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx);

            const chainPieces = [];
            const pieceDistance = 18;
            const pieceCount = Math.max(1, Math.floor(tav / pieceDistance));

            for (let i = 0; i < pieceCount; i++) {
                const px = startX + Math.cos(angle) * pieceDistance * i;
                const py = startY + Math.sin(angle) * pieceDistance * i;

                const chain = k.add([
                    k.pos(px, py),
                    k.sprite("sparkeater_chain"),
                    k.anchor("center"),
                    k.rotate(angle * 180 / Math.PI),
                    k.opacity(1),
                    k.z(20),
                ]);

                chain.play("active");
                chainPieces.push(chain);
            }

            const head = k.add([
                k.pos(targetX, targetY),
                k.sprite("sparkeater_chain_head"),
                k.anchor("center"),
                k.rotate(angle * 180 / Math.PI),
                k.opacity(1),
                k.z(21),
            ]);

            head.play("active");

            const grappleHitbox = k.add([
                k.pos(targetX - 22, targetY - 22),
                k.rect(44, 44),
                k.area(),
                k.opacity(0),
                "sparkeater_grapple_hitbox",
            ]);

            k.wait(0.22, () => {
                chainPieces.forEach((piece) => {
                    if (piece.exists()) piece.destroy();
                });

                if (head.exists()) head.destroy();
                if (grappleHitbox.exists()) grappleHitbox.destroy();
            });
        });

        k.wait(0.8, () => {
            if (!boss.exists() || boss.dead) return;
            boss.attacking = false;
        });
    }

    function scream() {
        if (boss.attacking || boss.dead) return;

        boss.attacking = true;
        boss.screamCooldown = 6.0;
        boss.damageBoosted = true;

        soundeffectLetrehoz("Sparkeater_scream", false);

        document.getElementById("Sparkeater_scream").addEventListener("ended", () => {
            soundeffectTorol("Sparkeater_scream");
        });

        bossAnim("scream");

        k.wait(0.9, () => {
            if (!boss.exists() || boss.dead) return;

            boss.attacking = false;
        });
    }

    k.onCollide("player", "sparkeater_attack_hitbox", (playerObj, hitbox) => {

        if (boss.dead) return;
        if (!boss.fightActive) return;
        if (boss.hitCooldown) return;

        boss.hitCooldown = true;

        sebzesAdas(k, playerObj, damageErtek(2));

        if (hitbox.exists()) hitbox.destroy();

        k.wait(0.7, () => {
            boss.hitCooldown = false;
        });
    });

    k.onCollide("player", "sparkeater_grapple_hitbox", (playerObj, hitbox) => {

        if (boss.dead) return;
        if (!boss.fightActive) return;
        if (boss.hitCooldown) return;

        boss.hitCooldown = true;

        const irany = boss.pos.x > playerObj.pos.x ? 1 : -1;

        playerObj.move(irany * 650, -120);
        sebzesAdas(k, playerObj, damageErtek(1));

        if (hitbox.exists()) hitbox.destroy();

        k.wait(0.7, () => {
            boss.hitCooldown = false;
        });
    });

    k.onCollide("player_attack_hitbox", "sparkeater", async (hitbox) => {
        if (boss.dead) return;

        boss.hp -= 1;
        console.log("Sparkeater HP:", boss.hp);

        bossAnim("hurt");

        if (hitbox.exists()) hitbox.destroy();

        if (boss.hp <= 0) {
            boss.dead = true;

            bossAnim("die");

            if (aktivMentesAdatok?.data?.mentett_adatok) {
                const mentett = aktivMentesAdatok.data.mentett_adatok;

                if (!mentett.bosses) mentett.bosses = {};
                if (!mentett.ability_unlocked) mentett.ability_unlocked = {};
                if (!mentett.world_interactions) mentett.world_interactions = {};

                mentett.bosses.Sparkeater = true;
                mentett.ability_unlocked.dash = true;
                mentett.world_interactions["crystal-city-key"] = true;

                const tutorial_data = await fecthData(
                        "http://127.0.0.1:3000/api/nyelv_alapjan_JSON_olvasas/" +
                          settings.nyelv +
                          "/tutorial.json",);

                unlockUzenet(
                    k,
                    tutorial_data.data.uj_kepesseg+"!",
                    "Dash: SHIFT | Crystal City "+tutorial_data.data.kulcs
                );
            }

            k.wait(0.8, () => {
                if (boss.exists()) boss.destroy();
            });
        }
    });

    k.onCollide("player_slash_hitbox", "sparkeater", async (slash) => {
        if (boss.dead) return;
        if (slash.alreadyHit) return;

        slash.alreadyHit = true;

        boss.hp -= slash.damage ?? 3;
        console.log("Sparkeater slash sebzés:", boss.hp);

        if (slash.exists()) {
            slash.destroy();
        }

        if (boss.hp <= 0) {
            boss.dead = true;

            bossAnim("die");

            if (aktivMentesAdatok?.data?.mentett_adatok) {
                const mentett = aktivMentesAdatok.data.mentett_adatok;

                if (!mentett.bosses) mentett.bosses = {};
                if (!mentett.ability_unlocked) mentett.ability_unlocked = {};
                if (!mentett.world_interactions) mentett.world_interactions = {};

                mentett.bosses.Sparkeater = true;
                mentett.ability_unlocked.dash = true;
                mentett.world_interactions["crystal-city-key"] = true;

                const tutorial_data = await fecthData(
                        "http://127.0.0.1:3000/api/nyelv_alapjan_JSON_olvasas/" +
                          settings.nyelv +
                          "/tutorial.json",);

                unlockUzenet(
                    k,
                    tutorial_data.data.uj_kepesseg+"!",
                    "Dash: SHIFT | Crystal City "+tutorial_data.data.kulcs
                );
            }

            k.wait(0.8, () => {
                if (boss.exists()) boss.destroy();
            });
        }
    });


    boss.onUpdate(() => {

        if (boss.dead) {
            return;
        }

        boss.fightActive = playerArenabanVan();

        if (!boss.fightActive) {
            boss.attacking = false;

            if (boss.curAnim() !== "idle") {
                boss.play("idle");
            }

            return;
        }

        arenaClamp();

        boss.attackCooldown -= k.dt();
        boss.grappleCooldown -= k.dt();
        boss.screamCooldown -= k.dt();

        const t = tavolsagPlayerhez();

        if (!boss.attacking) {
            boss.flipX = t.dx < 0;

            if (boss.screamCooldown <= 0 && boss.hp <= 18) {
                scream();
                return;
            }

            if (boss.grappleCooldown <= 0 && t.dist <= 150 && t.dist > 65 && t.absY <= 70) {
                grappleAttack();
                return;
            }

            if (boss.attackCooldown <= 0 && t.dist <= 65 && t.absY <= 55) {
                normalAttack();
                return;
            }

            if (t.dist > 45) {
                const iranyX = t.dx > 0 ? 1 : -1;

                boss.move(iranyX * boss.speed, 0);
                bossAnim("walk");

                return;
            } else {
                bossAnim("idle");
            }
        }
    });

    return boss;
}