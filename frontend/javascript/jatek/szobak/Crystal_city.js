import {
    setBackgroundColor,
    MapColliderek,
    SzobakiesesKezelo,
    SzobavaltozatoKezelo,
} from "./Szobakezelo.js";
import { fecthData } from "../../index.js";
import { jatekos_betolt } from "../entitások/jatekos.js";
import { Kamera_kezelo } from "../entitások/kamera.js";

export async function Crystal_City(k, szoba_belepesi_pont = null) {
    console.log("Kapott belépési pont:", szoba_belepesi_pont);

    setBackgroundColor(k, "#000000");

    const mapW = 32 * 60;
    const mapH = 32 * 40;

    const mapData = await fecthData(
        "http://127.0.0.1:3000/api/map_data/Crystal_city.json",
    );

    const szoba_layerek = mapData.data.layers;

    function layerKereses(nev) {
        const layer = szoba_layerek.find((l) => l.name === nev);
        if (!layer) {
            console.error(`Hiányzó layer: ${nev}`);
        }
        return layer;
    }

    const foLayer = layerKereses("Fo_layer");
    const solidLayer = layerKereses("Solid");
    const damagingCrystalsLayer = layerKereses("Damaging_crystals");
    const unlockableGateLayer = layerKereses("Unlockable_gate");
    const solidGateLayer = layerKereses("Solid_gate");
    const backFromIaconLayer = layerKereses("Back_from_Iacon_to_Crystal_city");
    const toIaconLayer = layerKereses("To_Iacon_from_Crystal");
    const backFromKaonLayer = layerKereses("Back_from_Kaon_to_Crystal_city");
    const toKaonLayer = layerKereses("To_Kaon_from_Crystal");
    const lavaProtectAbilityObjectLayer = layerKereses("Lava_protect_ability_object");

    let xpos = backFromIaconLayer.objects[0].x;
    let ypos = backFromIaconLayer.objects[0].y;

    if (szoba_belepesi_pont != null) {
        switch (szoba_belepesi_pont) {
            case "Back_from_Iacon_to_Crystal_city":
                xpos = backFromIaconLayer.objects[0].x;
                ypos = backFromIaconLayer.objects[0].y;
                break;

            case "Back_from_Kaon_to_Crystal_city":
                xpos = backFromKaonLayer.objects[0].x;
                ypos = backFromKaonLayer.objects[0].y;
                break;
        }
    }

    const map = k.add([
        k.pos(0, 0),
        k.sprite("Crystal_City"),
    ]);

    const gateSprite = k.add([
        k.pos(0, 0),
        k.sprite("Crystal_City_Gate"),
    ]);

    let lavaProtectionAbilityLayer = null;
    if (!localStorage.getItem("lava_protection_ability")) {
        lavaProtectionAbilityLayer = k.add([
            k.pos(0, 0),
            k.sprite("Crystal_City_heart"),
        ]);
    }

    if (solidLayer && solidLayer.objects) {
        MapColliderek(k, map, solidLayer.objects);
    }

    const player = await jatekos_betolt(k, xpos, ypos);

    Kamera_kezelo(k, xpos, ypos, player, mapW, mapH);

    SzobakiesesKezelo(k, map, mapW, mapH);

    if (toIaconLayer && toIaconLayer.objects && toIaconLayer.objects[0]) {
        SzobavaltozatoKezelo(
            k,
            toIaconLayer.objects[0].x,
            toIaconLayer.objects[0].y,
            toIaconLayer.objects[0].width,
            toIaconLayer.objects[0].height,
            "Iacon",
            "Back_from_crystal_city",
            "atjaro_iacon_from_crystal",
        );
    }

    if (toKaonLayer && toKaonLayer.objects && toKaonLayer.objects[1]) {
        SzobavaltozatoKezelo(
            k,
            toKaonLayer.objects[0].x,
            toKaonLayer.objects[0].y,
            toKaonLayer.objects[0].width,
            toKaonLayer.objects[0].height,
            "Kaon",
            "Back_from_Kaon_to_Crystal_city",
            "atjaro_kaon_from_crystal",
        );
    }

    let unlockableGate = null;
    if (unlockableGateLayer && unlockableGateLayer.objects && unlockableGateLayer.objects[0]) {
        unlockableGate = k.add([
            k.pos(
                unlockableGateLayer.objects[0].x,
                unlockableGateLayer.objects[0].y,
            ),
            k.rect(
                unlockableGateLayer.objects[0].width,
                unlockableGateLayer.objects[0].height,
            ),
            k.area(),
            k.body({ isStatic: true }),
            k.opacity(0),
            "unlockable_gate",
        ]);
    }

    let solidGate = null;
    if (solidGateLayer && solidGateLayer.objects && solidGateLayer.objects[0]) {
        solidGate = k.add([
            k.pos(
                solidGateLayer.objects[0].x,
                solidGateLayer.objects[0].y,
            ),
            k.rect(
                solidGateLayer.objects[0].width,
                solidGateLayer.objects[0].height,
            ),
            k.area(),
            k.body({ isStatic: true }),
            k.opacity(0),
            "solid_gate",
        ]);
    }

    /*if (localStorage.getItem("lava_protection_ability")) {
      if (unlockableGate) unlockableGate.destroy();
      if (gateSprite) gateSprite.destroy();
    }*/

    if (
        !localStorage.getItem("lava_protection_ability") &&
        lavaProtectAbilityObjectLayer &&
        lavaProtectAbilityObjectLayer.objects &&
        lavaProtectAbilityObjectLayer.objects[0]
    ) {
        const pickupObj = lavaProtectAbilityObjectLayer.objects[0];

        k.add([
            k.pos(pickupObj.x, pickupObj.y),
            k.rect(pickupObj.width, pickupObj.height),
            k.area(),
            k.opacity(0),
            "lava_protection_ability_pickup",
        ]);

        k.add([
            k.pos(pickupObj.x, pickupObj.y),
            k.rect(pickupObj.width, pickupObj.height),
            k.color(255, 0, 0),
            k.opacity(0.4),
        ]);

        k.onCollide("player", "lava_protection_ability_pickup", (playerObj, obj) => {
            console.log("Láva védelem képesség felvéve");

            localStorage.setItem("lava_protection_ability", "true");

            if (unlockableGate) unlockableGate.destroy();
            if (gateSprite) gateSprite.destroy();

            if (lavaProtectionAbilityLayer) {
                lavaProtectionAbilityLayer.destroy();
            }

            obj.destroy();
        });
    }

    if (damagingCrystalsLayer && damagingCrystalsLayer.objects) {
        damagingCrystalsLayer.objects.forEach((obj, index) => {
            let x = obj.x;
            let y = obj.y;
            let width = obj.width || 0;
            let height = obj.height || 0;

            if (obj.polygon && obj.polygon.length > 0) {
                const xs = obj.polygon.map((p) => p.x);
                const ys = obj.polygon.map((p) => p.y);

                const minX = Math.min(...xs);
                const maxX = Math.max(...xs);
                const minY = Math.min(...ys);
                const maxY = Math.max(...ys);

                x = obj.x + minX;
                y = obj.y + minY;
                width = maxX - minX;
                height = maxY - minY;
            }

            if (width > 0 && height > 0) {
                k.add([
                    k.pos(x, y),
                    k.rect(width, height),
                    k.area(),
                    k.opacity(0),
                    `damaging_crystal_${index}`,
                    "damaging_crystal",
                ]);
            }
        });

        k.onCollide("player", "damaging_crystal", () => {
            console.log("Sebző kristály!");
            //ide jöhet később a sebzés logika ha úgy jó
        });
    }
}