import {
    setBackgroundColor,
    MapColliderek,
    SzobakiesesKezelo,
    SzobavaltozatoKezelo,
    EffektTorles,
    LetraCollider,
    szoba_zene_beallitas
} from "./Szobakezelo.js";
import { fecthData } from "../../index.js";
import { jatekos_betolt } from "../entitások/jatekos.js";
import { Kamera_kezelo } from "../entitások/kamera.js";
import { settings } from "../../options.js";
import { aktivMentesAdatok } from "../kaboomBetolto.js";
import { sebzesAdas } from "../entitások/hp_kezelo.js";
import { unlockUzenet, Szobanev } from "../entitások/unlock_uzenet_UI.js";

export async function Crystal_City(k, szoba_belepesi_pont = null) {

    EffektTorles();

    szoba_zene_beallitas("crystal_city_room");

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
    const ladderLayer = layerKereses("Ladder");

    const lavaProtectionUnlocked = aktivMentesAdatok?.data?.mentett_adatok?.world_interactions?.["crystal-heart-lava-protection"] == true;
    const crystalCityKeyUnlocked = aktivMentesAdatok?.data?.mentett_adatok?.world_interactions?.["crystal-city-key"] === true;
    const crystalHeartGateOpen = aktivMentesAdatok?.data?.mentett_adatok?.world_interactions?.["crystal-heart-open_lock"] === true;

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

    k.add([
        k.pos(0, 0),
        k.sprite("Crystal_City_bg"),
    ]);

    const map = k.add([
        k.pos(0, 0),
        k.sprite("Crystal_City"),
    ]);

    let gateSprite = null;

    if (!crystalHeartGateOpen) {
        gateSprite = k.add([
            k.pos(0, 0),
            k.sprite("Crystal_City_Gate"),
        ]);
    }


    let lavaProtectionAbilityLayer = null;
    if (!lavaProtectionUnlocked) {
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

    if (ladderLayer && ladderLayer.objects) {
        ladderLayer.objects.forEach((obj) => {
            LetraCollider(k, obj, player, settings.controls.interact, settings.controls.interact);
        });
    }

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

    if (toKaonLayer && toKaonLayer.objects && toKaonLayer.objects[0]) {
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
    if (!crystalHeartGateOpen && unlockableGateLayer && unlockableGateLayer.objects && unlockableGateLayer.objects[0]) {
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
            //k.body({ isStatic: true }),
            k.opacity(0),
            "unlockable_gate",
        ]);
    }

    let solidGate = null;

    if (!crystalHeartGateOpen && solidGateLayer && solidGateLayer.objects && solidGateLayer.objects[0]) {
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

    let aktivGate = false;

    player.onCollideUpdate("unlockable_gate", () => {
        aktivGate = true;
    });

    player.onCollideEnd("unlockable_gate", () => {
        aktivGate = false;
    });

    k.onKeyPress((key) => {
        if (key !== settings.controls.interact) return;
        if (!aktivGate) return;

        const vanKulcs =
            aktivMentesAdatok?.data?.mentett_adatok?.world_interactions?.["crystal-city-key"] === true;

        if (!vanKulcs) {
            return;
        }

        aktivMentesAdatok.data.mentett_adatok.world_interactions["crystal-heart-open_lock"] = true;

        if (solidGate && solidGate.exists()) {
            solidGate.destroy();
        }

        if (gateSprite && gateSprite.exists()) {
            gateSprite.destroy();
        }

        if (unlockableGate && unlockableGate.exists()) {
            unlockableGate.destroy();
        }
    });

    if (
        !lavaProtectionUnlocked &&
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

        k.onCollide("player", "lava_protection_ability_pickup", async (playerObj, obj) => {

            if (aktivMentesAdatok) {
                aktivMentesAdatok.data.mentett_adatok.world_interactions["crystal-heart-lava-protection"] = true;

                const tutorial_data = await fecthData(
                "http://127.0.0.1:3000/api/nyelv_alapjan_JSON_olvasas/" +
                settings.nyelv +
                "/tutorial.json",);

                unlockUzenet(
                k,
                tutorial_data.data.sziv+"!",
                tutorial_data.data.sziv_szoveg
                );
            }

            if (lavaProtectionAbilityLayer) {
                lavaProtectionAbilityLayer.destroy();
            }

            obj.destroy();
        });
    }

    if (damagingCrystalsLayer && damagingCrystalsLayer.objects) {
        damagingCrystalsLayer.objects.forEach((obj, index) => {
            //ha Tiled-ben polygon / háromszög objektum
            if (obj.polygon && obj.polygon.length > 0) {
                const pontok = obj.polygon.map((p) => k.vec2(p.x, p.y));

                k.add([
                    k.pos(obj.x, obj.y),
                    k.area({
                        shape: new k.Polygon(pontok),
                    }),
                    k.body({ isStatic: true }),
                    k.opacity(0),
                    `damaging_crystal_${index}`,
                    "damaging_crystal",
                ]);

                return;
            }

            //tartalék ha mondjuk a háromszög nem válik be
            if (obj.width > 0 && obj.height > 0) {
                k.add([
                    k.pos(obj.x, obj.y),
                    k.rect(obj.width, obj.height),
                    k.area(),
                    k.body({ isStatic: true }),
                    k.opacity(0),
                    `damaging_crystal_${index}`,
                    "damaging_crystal",
                ]);
            }
        });

        k.onCollide("player", "damaging_crystal", (playerObj) => {
            sebzesAdas(k, playerObj, 1);
        });
    }

    Szobanev(k,"crystal_city");
}