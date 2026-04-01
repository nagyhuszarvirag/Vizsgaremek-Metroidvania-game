import {KellEAzNPC} from "../kaboomBetolto.js";

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

  if(true){
    let NPC_adder = k.add([
    k.sprite(NPC),
    k.pos(collider[0].x, collider[0].y -12), //a -30 azért kell, hogy az NPC ne a lábánál legyen lerakva, hanem a közepénél
    k.anchor("center"),
    k.area({
      shape: new k.Rect(k.vec2(0), 200, 100),
    }),
    NPC,
  ]);

  NPC_adder.play("idle");
  }
  
}

export function SzobakiesesKezelo(k, map, mapW, mapH){ //láthatatlan falak 
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
  k.onCollide("player", atjaroTag, () => {
    console.log("Átjáró aktiválva:", atjaroTag);
    k.go(celSzoba, { szoba_belepesi_pont: belepesiPont });
  });
}