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
    k.pos(collider[0].x, collider[0].y),
    k.anchor("center"),
    k.area({
      shape: new k.Rect(k.vec2(0), collider[0].width, collider[0].height),
    }),
    NPC,
  ]);

  NPC_adder.play("idle");
  }

  
}
