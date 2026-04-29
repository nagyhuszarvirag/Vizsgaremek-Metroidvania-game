import { sebzesAdas } from "./hp_kezelo.js";
import { aktivMentesAdatok } from "../kaboomBetolto.js";

export function TarnLetrehozas(k, x, y, player, arenaObj) {
  const boss = k.add([
    k.pos(x, y),
    k.sprite("Tarn"),
    k.anchor("center"),
    k.area({
      shape: new k.Rect(
        k.vec2(2.5, 0), // jobbra + lejjebb tolva
        45,
        55
      ),
    }),
    k.body(),
    "tarn",
    "boss",
  ]);

  boss.hp = 50;
  boss.speed = 65;
  boss.dead = false;
  boss.attacking = false;
  boss.fightActive = false;
  boss.resetting = false;

  boss.shootCooldown = 0;
  boss.stompCooldown = 0;
  boss.jumpCooldown = 0;
  boss.hitCooldown = false;

  function playerArenaBenVan() {
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

    const minX = arenaObj.x + 25;
    const maxX = arenaObj.x + arenaObj.width - 25;

    boss.pos.x = Math.max(minX, Math.min(maxX, boss.pos.x));
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

  function emergencyArenaReset() {
    if (boss.resetting || boss.dead) return;

    boss.resetting = true;
    boss.attacking = false;

    // jobb oldalra visszarakás
    boss.pos.x = arenaObj.x + arenaObj.width - 100;
    boss.pos.y = arenaObj.y + arenaObj.height - 140;

    if (boss.vel) {
      boss.vel.x = 0;
      boss.vel.y = 0;
    }

    // kis késleltetés után felugrás a felső rész felé
    k.wait(0.2, () => {
      if (!boss.exists() || boss.dead) return;

      boss.jump(650);
      boss.move(-260, 0);
    });

    k.wait(1.2, () => {
      if (!boss.exists() || boss.dead) return;
      boss.resetting = false;
    });
  }

  boss.onCollideUpdate("Lava_object", () => {
    emergencyArenaReset();
  });

  function shootAttack() {
    if (boss.attacking || boss.dead || boss.resetting || !boss.fightActive) return;

    boss.attacking = true;
    boss.shootCooldown = 2.2;

    const irany = player.pos.x > boss.pos.x ? 1 : -1;
    boss.flipX = irany < 0;

    k.wait(0.25, () => {
      if (!boss.exists() || boss.dead || boss.resetting || !boss.fightActive) return;

      const bullet = k.add([
        k.pos(boss.pos.x + irany * 35, boss.pos.y - 10),
        k.rect(18, 8),
        k.color(255, 60, 60),
        k.area(),
        k.move(k.vec2(irany, 0), 260),
        "tarn_bullet",
      ]);

      k.wait(2, () => {
        if (bullet.exists()) bullet.destroy();
      });
    });

    k.wait(0.65, () => {
      if (!boss.exists() || boss.dead) return;
      boss.attacking = false;
    });
  }

  function stompAttack() {
    if (boss.attacking || boss.dead || boss.resetting || !boss.fightActive) return;

    boss.attacking = true;
    boss.stompCooldown = 3.4;

    k.wait(0.35, () => {
      if (!boss.exists() || boss.dead || boss.resetting || !boss.fightActive) return;

      const zoneW = 130;
      const zoneH = 45;

      const zone = k.add([
        k.pos(boss.pos.x - zoneW / 2, boss.pos.y + 35),
        k.rect(zoneW, zoneH),
        k.color(255, 120, 0),
        k.opacity(0.35),
        k.area(),
        "tarn_stomp_zone",
      ]);

      k.wait(0.18, () => {
        if (zone.exists()) zone.destroy();
      });
    });

    k.wait(0.9, () => {
      if (!boss.exists() || boss.dead) return;
      boss.attacking = false;
    });
  }

  function jumpMove() {
    if (boss.attacking || boss.dead || boss.resetting || !boss.fightActive) return;

    boss.attacking = true;
    boss.jumpCooldown = 4.5;

    const irany = player.pos.x > boss.pos.x ? 1 : -1;

    boss.jump(430);
    boss.move(irany * 180, 0);

    k.wait(0.9, () => {
      if (!boss.exists() || boss.dead) return;
      boss.attacking = false;
    });
  }

  k.onCollide("player", "tarn_bullet", (playerObj, bullet) => {
    if (boss.dead || !boss.fightActive || boss.resetting) return;

    sebzesAdas(k, playerObj, 3);

    if (bullet.exists()) bullet.destroy();
  });

  k.onCollide("player", "tarn_stomp_zone", (playerObj, zone) => {
    if (boss.dead || !boss.fightActive || boss.resetting) return;
    if (boss.hitCooldown) return;

    boss.hitCooldown = true;

    sebzesAdas(k, playerObj, 2);

    if (zone.exists()) zone.destroy();

    k.wait(0.8, () => {
      boss.hitCooldown = false;
    });
  });

  k.onCollide("player_attack_hitbox", "tarn", (hitbox) => {
    if (boss.dead || boss.resetting) return;

    boss.hp -= 1;
    console.log("Tarn HP:", boss.hp);

    if (hitbox.exists()) hitbox.destroy();

    if (boss.hp <= 0) {
      boss.dead = true;

      const mentett = aktivMentesAdatok?.data?.mentett_adatok;

      if (mentett) {
        if (!mentett.bosses) mentett.bosses = {};
        if (!mentett.ability_unlocked) mentett.ability_unlocked = {};

        mentett.bosses.Tarn = true;
        mentett.ability_unlocked.double_jump = true;
      }

      k.wait(0.5, () => {
        if (boss.exists()) boss.destroy();
      });
    }
  });

  k.onCollide("player_slash_hitbox", "tarn", (slash) => {
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

      const mentett = aktivMentesAdatok?.data?.mentett_adatok;

      if (mentett) {
        if (!mentett.bosses) mentett.bosses = {};
        if (!mentett.ability_unlocked) mentett.ability_unlocked = {};

        mentett.bosses.Tarn = true;
        mentett.ability_unlocked.double_jump = true;
      }

      k.wait(0.5, () => {
        if (boss.exists()) boss.destroy();
      });
    }
  });

  boss.onUpdate(() => {
    if (boss.dead) return;

    boss.fightActive = playerArenaBenVan();

    if (!boss.fightActive) {
      boss.attacking = false;
      return;
    }

    if (boss.resetting) {
      return;
    }

    arenaClamp();

    boss.shootCooldown -= k.dt();
    boss.stompCooldown -= k.dt();
    boss.jumpCooldown -= k.dt();

    if (boss.attacking) return;

    const t = tavolsagPlayerhez();

    boss.flipX = t.dx < 0;

    if (boss.stompCooldown <= 0 && t.dist <= 110 && t.absY <= 70) {
      stompAttack();
      return;
    }

    if (boss.shootCooldown <= 0 && t.dist <= 320) {
      shootAttack();
      return;
    }

    if (boss.jumpCooldown <= 0 && t.dist > 180) {
      jumpMove();
      return;
    }

    if (t.dist > 80) {
      const iranyX = t.dx > 0 ? 1 : -1;
      boss.move(iranyX * boss.speed, 0);
    }
  });

  return boss;
}