export function hpRendszerBeallitas(player, kezdoSzivek = 5) {
  player.maxHp = kezdoSzivek * 2;
  player.hp = player.maxHp;

  player.invulnerable = false; //ideiglenes sérthetetlenség
  player.dead = false;
}

export function sebzesAdas(k, player, mennyiseg) {
  if (!player || player.dead) return;
  if (player.invulnerable) return;

  player.hp -= mennyiseg;

  if (player.hp < 0) {
    player.hp = 0;
  }

  console.log(`Player HP: ${player.hp}/${player.maxHp}`);

  //ideiglenes sérthetetlenség, hogy ne kapjon 1 frame alatt 100 sebzést
  player.invulnerable = true;

  k.wait(0.6, () => {
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

  console.log(`Player HP: ${player.hp}/${player.maxHp}`);
}

export function playerHalal(player) {
  player.dead = true;
  console.log("A játékos meghalt");
}