import { KellEAzNPC } from "../kaboomBetolto.js";

export function setBackgroundColor(k, hexColorCode) {
  k.add([
    k.rect(k.width(), k.height()),
    k.color(k.Color.fromHex(hexColorCode)),
    k.fixed(),
  ]);
}

export function MapColliderek(k, map, colliderek) {
  console.log("MapColliderek meghívva");
  console.log("MapColliderek map: " + map);
  console.log("MapColliderek colliderek: " + colliderek);

  for (const collider of colliderek) {
    if (collider.polygon) {
      const coordinates = [];
      for (const point of collider.polygon) {
        coordinates.push(k.vec2(point.x, point.y));
      }

      map.add([
        k.pos(collider.x, collider.y),
        k.area({
          shape: new k.Polygon(coordinates),
          collisionIgnore: ["Solid"],
        }),
        k.body({ isStatic: true }),
        "Solid",
        collider.type,
      ]);
      continue;
    }

    map.add([
      k.pos(collider.x, collider.y),
      k.area({
        shape: new k.Rect(k.vec2(0), collider.width, collider.height),
        collisionIgnore: ["Solid"],
      }),
      k.body({ isStatic: true }),
      "Solid",
      collider.type,
    ]);
  }
}

export function NPCCollider(k, collider, NPC) {
  console.log(collider);
  console.log(collider[0].x);
  console.log(collider[0].y);
  console.log(collider[0].width);
  console.log(collider[0].height);

  //Note to self: Az NPC collider első koordinátája ott legyen, ahol akarom az NPC-t. A kezdőszobát ez alapján átírom

  if (true) {
    let NPC_adder = k.add([
      k.sprite(NPC),
      k.pos(collider[0].x, collider[0].y - 12), //a -30 azért kell, hogy az NPC ne a lábánál legyen lerakva, hanem a közepénél
      k.anchor("center"),
      k.area({
        shape: new k.Rect(k.vec2(0), 200, 100),
      }),
      NPC,
    ]);

    NPC_adder.play("idle");
  }

}

export function SzobakiesesKezelo(k, map, mapW, mapH) { //láthatatlan falak 
  //láthatatlan falak vastagsága

  const T = 32;
  //bal
  map.add([
    k.pos(-T, 0),
    k.rect(T, mapH),
    k.area(),
    k.body({ isStatic: true }),
    k.opacity(0),
    "Solid",
  ]);

  //jobb
  map.add([
    k.pos(mapW, 0),
    k.rect(T, mapH),
    k.area(),
    k.body({ isStatic: true }),
    k.opacity(0),
    "Solid",
  ]);

  //alsó
  map.add([
    k.pos(0, mapH),
    k.rect(mapW, T),
    k.area(),
    k.body({ isStatic: true }),
    k.opacity(0),
    "Solid",
  ]);

  //felső
  map.add([
    k.pos(0, -T),
    k.rect(mapW, T),
    k.area(),
    k.body({ isStatic: true }),
    k.opacity(0),
    "Solid",
  ]);


}

/*export function SzobavaltozatoKezelo(k, atjaroX, atjaroY, atjaroWidth, atjaroHeight, celSzoba, belepesiPont = null){

  console.log("SzobavaltozatoKezelo meghívva");
  console.log("SzobavaltozatoKezelo atjaroX: " + atjaroX);
  console.log("SzobavaltozatoKezelo atjaroY: " + atjaroY);
  console.log("SzobavaltozatoKezelo atjaroWidth: " + atjaroWidth);
  console.log("SzobavaltozatoKezelo atjaroHeight: " + atjaroHeight);
  console.log("SzobavaltozatoKezelo celSzoba: " + celSzoba);

   k.add([
    k.pos(atjaroX, atjaroY), 
    k.rect(atjaroWidth, atjaroHeight),
    k.area(),
    k.opacity(0),
    "atjaro",
  ]);

  k.onCollide("player", "atjaro", () => {
    console.log("váltás");
    k.go(celSzoba, { szoba_belepesi_pont: belepesiPont });
  });
}*/

export function SzobavaltozatoKezelo(
  k,
  atjaroX,
  atjaroY,
  atjaroWidth,
  atjaroHeight,
  celSzoba,
  belepesiPont = null,
  atjaroTag = "atjaro"
) {
  //átjáró hitbox
  k.add([
    k.pos(atjaroX, atjaroY),
    k.rect(atjaroWidth, atjaroHeight),
    k.area(),
    k.opacity(0),
    atjaroTag,
  ]);

  //egyedi tag
  k.onCollide("player", atjaroTag, async () => {
    //console.log("Átjáró aktiválva:", atjaroTag);
    const container = document.querySelector("body");
    container.className = ''
    const kodkezelo = await Kod();
    kodkezelo.stop();
    k.go(celSzoba, { szoba_belepesi_pont: belepesiPont });
  });
}

export function MentesCollider(k, colliderObj, savepointNev) {
  const mentesPont = k.add([
    k.pos(colliderObj.x, colliderObj.y),
    k.area({
      shape: new k.Rect(k.vec2(0), colliderObj.width, colliderObj.height),
    }),
    k.opacity(0),
    "mentespont",
  ]);

  mentesPont.savepointNev = savepointNev;
  console.log("Mentéspont objektum: ", mentesPont);

  return mentesPont;
}

export async function MentesLetrehozo(user_id, mentes_id, savepointNev) { //Ezt ki kell egészíteni a mentett adatokkal
  try {
    const response = await fetch("http://127.0.0.1:3000/api/mentes/update-savepoint", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: user_id,
        mentes_id: mentes_id,
        uj_savepoint: savepointNev,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Mentés hiba:", error);
    return {
      success: false,
      message: "Mentés sikertelen",
    };
  }
}

export function Eso() {
  const container = document.body;

  let intervalId = null;

  function rainEffect() {
    const rainDrops = document.createElement("span");
    rainDrops.classList.add("rain");

    rainDrops.style.left = Math.random() * 120 + "%";

    container.appendChild(rainDrops);

    setTimeout(() => {
      rainDrops.remove();
    }, 3000);
  }

  function start() {
    if (intervalId) return; // ne induljon el többször

    intervalId = setInterval(rainEffect, 50);
  }

  function stop() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }

    // maradék eső eltakarítása
    const rains = document.querySelectorAll(".rain");
    rains.forEach(r => r.remove());
  }

  return { start, stop };
}

export async function Kod() { //A fog nem jelenik meg, no idea why. Törölni, ha nem tudjuk megoldani
  const container = document.getElementById("specieffektdoboz");

  function feltoltFogLayert(fogLayer) {
    for (let i = 0; i < 2; i++) {
      const image1 = document.createElement("div");
      const image2 = document.createElement("div");

      image1.classList.add("image01");
      image2.classList.add("image02");

      fogLayer.appendChild(image1);
      fogLayer.appendChild(image2);
    }
  }

  function start() {
    if (!container) {
      console.error("Nincs specieffektdoboz");
      return;
    }

    if (document.getElementById("foglayer_01")) return;

    const fog1 = document.createElement("div");
    const fog2 = document.createElement("div");
    const fog3 = document.createElement("div");

    fog1.classList.add("fog");
    fog2.classList.add("fog");
    fog3.classList.add("fog");

    fog1.id = "foglayer_01";
    fog2.id = "foglayer_02";
    fog3.id = "foglayer_03";

    [fog1, fog2, fog3].forEach((fog) => {
      fog.style.position = "fixed";
      fog.style.top = "0";
      fog.style.left = "0";
      fog.style.width = "200vw";
      fog.style.height = "100vh";
      fog.style.pointerEvents = "none";
      fog.style.zIndex = "10000";
      fog.style.overflow = "hidden";
    });

    feltoltFogLayert(fog1);
    feltoltFogLayert(fog2);
    feltoltFogLayert(fog3);

    container.appendChild(fog1);
    container.appendChild(fog2);
    container.appendChild(fog3);
  }

  function stop() {
    ["foglayer_01", "foglayer_02", "foglayer_03"].forEach((id) => {
      const fog = document.getElementById(id);
      if (fog && fog.parentNode === container) {
        container.removeChild(fog);
      }
    });
  }

  return { start, stop };
}

export function Hamu() {
  let container = document.getElementById("specieffektdoboz");
  let canvas = null;
  let ctx = null;
  let animationId = null;

  let ashParticles = [];
  let emberParticles = [];

  const ASH_COUNT = 140;
  const EMBER_COUNT = 35;

  function createAsh(width, height) {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 3.2 + 1.2,
      vy: Math.random() * 0.7 + 0.25,
      vx: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.30 + 0.22,
    };
  }

  function createEmber(width, height) {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2.8 + 1.4,
      vy: Math.random() * 0.45 + 0.08,
      vx: (Math.random() - 0.5) * 0.5,
      alpha: Math.random() * 0.35 + 0.55,
      glow: Math.random() * 1.4 + 1.2,
      flicker: Math.random() * Math.PI * 2,
    };
  }

  function resetAsh(p, width) {
    p.x = Math.random() * width;
    p.y = -10;
    p.r = Math.random() * 3.2 + 1.2;
    p.vy = Math.random() * 0.7 + 0.25;
    p.vx = (Math.random() - 0.5) * 0.35;
    p.alpha = Math.random() * 0.30 + 0.22;
  }

  function resetEmber(p, width) {
    p.x = Math.random() * width;
    p.y = -10;
    p.r = Math.random() * 2.8 + 1.4;
    p.vy = Math.random() * 0.45 + 0.08;
    p.vx = (Math.random() - 0.5) * 0.5;
    p.alpha = Math.random() * 0.35 + 0.55;
    p.glow = Math.random() * 1.4 + 1.2;
    p.flicker = Math.random() * Math.PI * 2;
  }

  function resize() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function drawAsh(p) {
    ctx.beginPath();
    ctx.fillStyle = `rgba(150, 150, 150, ${p.alpha})`;
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawEmber(p, time) {
    const pulse = 0.75 + Math.sin(time * 0.005 + p.flicker) * 0.25;
    const alpha = p.alpha * pulse;

    ctx.beginPath();
    ctx.fillStyle = `rgba(255, 110, 20, ${alpha})`;
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = `rgba(255, 180, 80, ${alpha * 0.75})`;
    ctx.arc(p.x, p.y, p.r * p.glow, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = `rgba(255, 230, 140, ${alpha * 0.35})`;
    ctx.arc(p.x, p.y, p.r * p.glow * 1.8, 0, Math.PI * 2);
    ctx.fill();
  }

  function draw(time = 0) {
    if (!canvas || !ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    for (const p of ashParticles) {
      p.x += p.vx + Math.sin((p.y + p.x) * 0.002) * 0.12;
      p.y += p.vy;

      if (p.y > h + 15 || p.x < -20 || p.x > w + 20) {
        resetAsh(p, w);
      }

      drawAsh(p);
    }

    for (const p of emberParticles) {
      p.x += p.vx + Math.sin((p.y + time * 0.02) * 0.01) * 0.18;
      p.y += p.vy;

      if (p.y > h + 15 || p.x < -30 || p.x > w + 30) {
        resetEmber(p, w);
      }

      drawEmber(p, time);
    }

    animationId = requestAnimationFrame(draw);
  }

  function start() {
    if (!container) {
      container = document.createElement("div");
      container.id = "specieffektdoboz";
      container.style.position = "fixed";
      container.style.inset = "0";
      container.style.pointerEvents = "none";
      container.style.zIndex = "9999";
      document.body.appendChild(container);
    }

    if (document.getElementById("hamu_canvas")) return;

    canvas = document.createElement("canvas");
    canvas.id = "hamu_canvas";
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "10001";

    container.appendChild(canvas);
    ctx = canvas.getContext("2d");

    resize();
    ashParticles = [];
    emberParticles = [];

    for (let i = 0; i < ASH_COUNT; i++) {
      ashParticles.push(createAsh(canvas.width, canvas.height));
    }

    for (let i = 0; i < EMBER_COUNT; i++) {
      emberParticles.push(createEmber(canvas.width, canvas.height));
    }

    window.addEventListener("resize", resize);
    draw();
  }

  function stop() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }

    window.removeEventListener("resize", resize);

    const existing = document.getElementById("hamu_canvas");
    if (existing) existing.remove();

    canvas = null;
    ctx = null;
    ashParticles = [];
    emberParticles = [];
  }

  return { start, stop };
}

export function EffektTorles() {
  if (window.kodkezelo) {
    window.kodkezelo.stop();
    window.kodkezelo = null;
  }

  if (window.hamukezelo) {
    window.hamukezelo.stop();
    window.hamukezelo = null;
  }

  if (window.esokezelo) {
    window.esokezelo.stop();
    window.esokezelo = null;
  }
}

export function CollapsingPlatform(k, obj, spriteObj) {
  let playerOn = false;
  let collapsed = false;
  let shaking = false;
  let timer = 0;

  let platform = letrehozCollider();

  function letrehozCollider() {
    const p = k.add([
      k.pos(obj.x, obj.y),
      k.rect(obj.width, obj.height),
      k.area(),
      k.body({ isStatic: true }),
      k.opacity(0),
      "collapsing_platform",
    ]);

    p.onCollide("player", () => {
      if (!collapsed) {
        playerOn = true;
      }
    });

    p.onCollideEnd("player", () => {
      if (!collapsed) {
        playerOn = false;
        timer = 0;
        shaking = false;

        if (spriteObj) {
          spriteObj.pos.x = spriteObj.originalX;
          spriteObj.pos.y = spriteObj.originalY;
        }
      }
    });

    p.onUpdate(() => {
      if (collapsed) return;

      if (playerOn) {
        timer += k.dt();

        //3 mp után remegjen
        if (timer >= 3 && timer < 5) {
          shaking = true;
        }

        if (shaking && spriteObj) {
          spriteObj.pos.x = spriteObj.originalX + (Math.random() * 4 - 2);
          spriteObj.pos.y = spriteObj.originalY + (Math.random() * 4 - 2);
        }

        //5 mp után tűnjön el
        if (timer >= 5) {
          collapsed = true;
          playerOn = false;
          shaking = false;
          timer = 0;

          if (spriteObj) {
            spriteObj.opacity = 0;
            spriteObj.pos.x = spriteObj.originalX;
            spriteObj.pos.y = spriteObj.originalY;
          }

          p.destroy();

          k.wait(3, () => {
            collapsed = false;

            if (spriteObj) {
              spriteObj.opacity = 1;
            }

            platform = letrehozCollider();
          });
        }
      }
    });

    return p;
  }

  return platform;
}

export function LetraCollider(k, letraObj, player, interactKey, jumpKey, upKey = "w", downKey = "s") {
  const letra = k.add([
    k.pos(letraObj.x, letraObj.y),
    k.rect(letraObj.width, letraObj.height),
    k.area(),
    k.opacity(0),
    "letra",
  ]);

  letra.letraWidth = letraObj.width;
  letra.letraHeight = letraObj.height;

  player.onCollideUpdate("letra", (obj) => {
    if (obj === letra) {
      player.aktivLetra = letra;
    }
  });

  player.onCollideEnd("letra", (obj) => {
    if (obj === letra && player.aktivLetra === letra) {
      player.aktivLetra = null;
    }
  });

  k.onKeyPress(interactKey, () => {
    if (player.aktivLetra === letra && !player.letaranVan) {
      player.letaranVan = true;

      player.pos.x = letra.pos.x + letra.letraWidth / 2;

      if (player.vel) {
        player.vel.x = 0;
        player.vel.y = 0;
      }
    }
  });

  k.onKeyPress(jumpKey, () => {
    if (player.letaranVan) {
      player.letaranVan = false;

      if (player.vel) {
        player.vel.x = 0;
        player.vel.y = 0;
      }

      player.jump(350);
    }
  });

  return letra;
}

export function BreakableFal(k, falObj, falSprite, hp = 2, remegjen = true, tag = "breakable_wall") {
  let currentHp = hp;
  let serulhet = true;
  let torott = false;

  const falCollider = k.add([
    k.pos(falObj.x, falObj.y),
    k.rect(falObj.width, falObj.height),
    k.area(),
    k.body({ isStatic: true }),
    k.opacity(0),
    tag,
  ]);

  if (falSprite) {
    falSprite.originalX = falSprite.pos.x;
    falSprite.originalY = falSprite.pos.y;
  }

  k.onCollide("player_attack_hitbox", tag, (hitbox, wall) => {
    if (torott) return;
    if (!serulhet) return;

    serulhet = false;
    currentHp--;

    console.log(`${tag} megütve. Maradék HP: ${currentHp}`);

    if (remegjen && falSprite) {
      let razasIdo = 0.18;

      const razas = k.onUpdate(() => {
        if (!falSprite.exists()) {
          razas.cancel();
          return;
        }

        falSprite.pos.x = falSprite.originalX + (Math.random() * 8 - 4);

        razasIdo -= k.dt();
        if (razasIdo <= 0) {
          falSprite.pos.x = falSprite.originalX;
          razas.cancel();
        }
      });
    }

    if (currentHp <= 0) {
      torott = true;

      if (falSprite && falSprite.exists()) {
        falSprite.destroy();
      }

      if (wall.exists()) {
        wall.destroy();
      }

      if (hitbox.exists()) {
        hitbox.destroy();
      }

      return;
    }

    k.wait(0.2, () => {
      serulhet = true;
    });
  });

  return falCollider;
}