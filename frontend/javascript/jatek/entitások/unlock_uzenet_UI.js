export function unlockUzenet(k, cim, leiras = "") {
  const box = k.add([
    k.rect(520, 90),
    k.pos(k.width() / 2, 110),
    k.anchor("center"),
    k.fixed(),
    k.opacity(0.85),
    k.z(99999),
  ]);

  const title = k.add([
    k.text(cim, { size: 24 }),
    k.pos(k.width() / 2, 90),
    k.anchor("center"),
    k.fixed(),
    k.z(100000),
  ]);

  const desc = k.add([
    k.text(leiras, { size: 16 }),
    k.pos(k.width() / 2, 125),
    k.anchor("center"),
    k.fixed(),
    k.z(100000),
  ]);

  k.wait(3, () => {
    if (box.exists()) box.destroy();
    if (title.exists()) title.destroy();
    if (desc.exists()) desc.destroy();
  });
}