export function hpRendszerBeallitas(player, kezdoSzivek = 5) {
  player.maxHp = kezdoSzivek * 2;

  const mentettHp = localStorage.getItem("player_current_hp");

  if (mentettHp !== null) {
    player.hp = Number(mentettHp);
  } else {
    player.hp = player.maxHp;
  }

  if (player.hp > player.maxHp) {
    player.hp = player.maxHp;
  }

  if (player.hp < 0) {
    player.hp = 0;
  }

  player.invulnerable = false;
  player.dead = false;
}

export function sebzesAdas(k, player, mennyiseg) {
  if (!player || player.dead) return;
  if (player.invulnerable) return;

  player.hp -= mennyiseg;

  if (player.hp < 0) {
    player.hp = 0;
  }

  localStorage.setItem("player_current_hp", player.hp);

  if (player.hpUI) {
    player.hpUI.frissit();
  }

  console.log(`Player HP: ${player.hp}/${player.maxHp}`);

  player.invulnerable = true;

  if (player.play) {
    player.play("hurt");
  }

  k.wait(0.35, () => {
    if (!player.exists() || player.dead) return;

    if (player.letaranVan) {
      player.play("idle");
    } else if (!player.isGrounded()) {
      player.play("jump");
    } else {
      player.play("idle");
    }
  });

  k.wait(2.5, () => {
    if (player.exists()) {
      player.invulnerable = false;
    }
  });

  if (player.hp <= 0) {
    playerHalal(player);
  }
}

export function gyogyitas(player, mennyiseg) {
  if (!player || player.dead) return;

  player.hp += mennyiseg;

  if (player.hp > player.maxHp) {
    player.hp = player.maxHp;
  }

  localStorage.setItem("player_current_hp", player.hp);

  if (player.hpUI) {
    player.hpUI.frissit();
  }

  console.log(`Player HP: ${player.hp}/${player.maxHp}`);
}

export function maxHpNovelese(player, mennyiseg) {
  if (!player || player.dead) return;

  player.maxHp += mennyiseg;
  player.hp += mennyiseg;

  if (player.hp > player.maxHp) {
    player.hp = player.maxHp;
  }

  localStorage.setItem("player_current_hp", player.hp);

  if (player.hpUI) {
    player.hpUI.frissit();
  }

  console.log(`Player max HP növelve: ${player.hp}/${player.maxHp}`);
}

export function playerHalal(player) {
  player.dead = true;
  localStorage.setItem("player_current_hp", 0);
  console.log("A játékos meghalt");
}