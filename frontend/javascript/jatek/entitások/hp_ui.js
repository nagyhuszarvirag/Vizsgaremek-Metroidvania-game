export function hpUI(k, player) {
  const hearts = [];

  function rajzol() {
    hearts.forEach((h) => h.destroy());
    hearts.length = 0;

    const maxSzivek = player.maxHp / 2;

    for (let i = 0; i < maxSzivek; i++) {
      let frame = 2; //üres szív

      const aktualisSzivHp = player.hp - i * 2;

      if (aktualisSzivHp >= 2) {
        frame = 0; //tele
      } else if (aktualisSzivHp === 1) {
        frame = 2; //fél
      } else {
        frame = 1; //üres
      }

      const heart = k.add([
        k.sprite("blue_hearts", { frame }),
        k.pos(20 + i * 22, 20),
        k.fixed(),
        k.scale(2),
        "hp_ui",
      ]);

      hearts.push(heart);
    }
  }

  rajzol();

  return {
    frissit: rajzol,
  };
}