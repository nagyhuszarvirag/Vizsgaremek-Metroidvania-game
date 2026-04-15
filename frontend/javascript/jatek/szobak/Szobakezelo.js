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
    const kodkezelo=await Kod();
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

export async function MentesLetrehozo(user_id, mentes_id, savepointNev) {
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

export async function Eso() {
  const container = document.querySelector("body");

  function rainEffect() {
    let rainDrops = document.createElement("span");
    rainDrops.classList.add("rain");
    container.appendChild(rainDrops);
    rainDrops.style.left = Math.random() * 120 + "%";

    setTimeout(function rainEffect() {
      rainDrops.remove();
    }, 5000);
  }

  setInterval(rainEffect, 50);
}

export async function Kod(camScale = 4, camX = 0, camY = 0) { //A fog nem jelenik meg, no idea why. Törölni, ha nem tudjuk megoldani
  const container = document.getElementById("specieffektdoboz");

  function updateFogScale() {
    const fogLayers = ["foglayer_01", "foglayer_02", "foglayer_03"];
    fogLayers.forEach(id => {
      const fog = document.getElementById(id);
      if (fog) {
        fog.style.transform = `scale(${1 / camScale}) translate(${-camX}px, ${-camY}px)`;
      }
    });
  }

  function start() {
    // Check if fog already exists
    if (document.getElementById("foglayer_01")) return;
    
    let fog1 = document.createElement("div");
    let fog2 = document.createElement("div");
    let fog3 = document.createElement("div");

    fog1.classList.add("fog");
    fog2.classList.add("fog");
    fog3.classList.add("fog");

    fog1.id = "foglayer_01";
    fog2.id = "foglayer_02";
    fog3.id = "foglayer_03";

    // Make fog cover the visible area
    const viewWidth = window.innerWidth / camScale;
    const viewHeight = window.innerHeight / camScale;
    
    [fog1, fog2, fog3].forEach(fog => {
      fog.style.position = "fixed";
      fog.style.top = "0";
      fog.style.left = "0";
      fog.style.width = `${viewWidth * 2}px`;
      fog.style.height = `${viewHeight}px`;
      fog.style.pointerEvents = "none";
    });

    let image1 = document.createElement("div");
    let image2 = document.createElement("div");

    image1.classList.add("image01");
    image2.classList.add("image02");

    fog1.appendChild(image1);
    fog1.appendChild(image2);

    image1 = document.createElement("div");
    image2 = document.createElement("div");

    image1.classList.add("image01");
    image2.classList.add("image02");

    fog2.appendChild(image1);
    fog2.appendChild(image2);

    image1 = document.createElement("div");
    image2 = document.createElement("div");

    image1.classList.add("image01");
    image2.classList.add("image02");

    fog3.appendChild(image1);
    fog3.appendChild(image2);

    container.appendChild(fog1);
    container.appendChild(fog2);
    container.appendChild(fog3);
    
    updateFogScale();
  }

  function stop() {
    const fogIds = ["foglayer_01", "foglayer_02", "foglayer_03"];
    fogIds.forEach(id => {
      const fog = document.getElementById(id);
      if (fog && fog.parentNode === container) {
        container.removeChild(fog);
      }
    });
  }

  // Update fog position when camera moves
  function update(cameraScale, cameraX, cameraY) {
    camScale = cameraScale;
    camX = cameraX;
    camY = cameraY;
    updateFogScale();
  }

  return { start, stop, update };
}