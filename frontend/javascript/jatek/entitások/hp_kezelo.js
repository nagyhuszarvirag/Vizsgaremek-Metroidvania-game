import {aktivMentesAdatok, respawnSavepointAlapjan} from "../kaboomBetolto.js";

export function hpRendszerBeallitas(player, kezdoSzivek = 5) {
  let plussz_hp_az_alaphoz=0;

  for(let i=0; i<3; i++){
    if(aktivMentesAdatok.data.mentett_adatok.world_interactions[`bonus-hp-${i+1}`]){
      plussz_hp_az_alaphoz++;
    }
  }

  player.maxHp = (kezdoSzivek + plussz_hp_az_alaphoz) * 2;

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

  player.serul = true;

  const irany = player.flipX ? -1 : 1;
  player.knockbackX = irany * 440;
  player.knockbackY = -120;
  player.knockbackTimer = 0.18;

  if (player.play) {
    player.play("hurt");
  }

  k.wait(0.35, () => {
    if (!player.exists() || player.dead) return;

    player.serul = false;
  });

  k.wait(2.5, () => {
    if (player.exists()) {
      player.invulnerable = false;
    }
  });

  if (player.hp <= 0) {
    playerHalal(k, player);
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

export function playerHalal(k, player) {
  if (player.dead) return; // duplahívás védelem
  player.dead = true;

  console.log("A játékos meghalt");

  localStorage.removeItem("player_current_hp");
  
  if (player.exists()) {
    player.destroy();
  }

  k.wait(1, () => {
    const savepoint =
      localStorage.getItem("last_loaded_savepoint") || "kezdomap_1";

    respawnSavepointAlapjan(k, savepoint);
  });
}