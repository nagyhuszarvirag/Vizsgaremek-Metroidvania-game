import {
    setBackgroundColor,
    MapColliderek,
    SzobakiesesKezelo,
    SzobavaltozatoKezelo,
    MentesCollider,
    EffektTorles,
    LetraCollider
} from "./Szobakezelo.js";
import { fecthData } from "../../index.js";
import { jatekos_betolt } from "../entitások/jatekos.js";
import { Kamera_kezelo } from "../entitások/kamera.js";
import { playerInteractGombja, playerUgroGombja } from "../../options.js";
import { maxHpNovelese } from "../entitások/hp_kezelo.js";
import { ScrapletLetrehozas } from "../entitások/enemy_scraplet.js";
import { aktivMentesAdatok } from "../kaboomBetolto.js";

export async function Kaon(k, szoba_belepesi_pont = null) {
    console.log("Kapott belépési pont:", szoba_belepesi_pont);

    EffektTorles();

    setBackgroundColor(k, "#000000");

    const mapW = 32 * 60;
    const mapH = 32 * 50;

    const mapData = await fecthData(
        "http://127.0.0.1:3000/api/map_data/City_of_Kaon.json",
    );

    const szoba_layerek = mapData.data.layers;

    function layerKereses(nev) {
        const layer = szoba_layerek.find((l) => l.name === nev);
        if (!layer) {
            console.error(`Hiányzó layer: ${nev}`);
        }
        return layer;
    }

    const solidLayer = layerKereses("Solid");
    const bonusHeartLayer = layerKereses("Bonus_heart_object");

    const toIacon1Layer = layerKereses("To_Iacon_from_Kaon_1");
    const toIacon2Layer = layerKereses("To_Iacon_from_Kaon_2");
    const backFromIacon1Layer = layerKereses("Back_from_Iacon_to_Kaon_1");
    const backFromIacon2Layer = layerKereses("Back_from_Iacon_to_Kaon_2");

    const toCrystalLayer = layerKereses("To_Kaon_from_Crystal");
    const backFromCrystalLayer = layerKereses("Back_from_Kaon_to_Crystal_city");

    const toCemeteryLayer = layerKereses("To_cemetery");
    const backFromCemeteryLayer = layerKereses("Back_from_the_cemetery_to_Kaon");

    const toSmelting1Layer = layerKereses("To_smelting_pits_1");
    const backFromSmelting1Layer = layerKereses("Back_from_the_smelting_pits_to_Kaon_1");

    const toSmelting2Layer = layerKereses("To_smelting_pits_2");
    const backFromSmelting2Layer = layerKereses("Back_from_the_smelting_pits_to_Kaon_2");

    const savepointLayer = layerKereses("Savepoint_5");

    const ladderLayer = layerKereses("Ladder");

    const scrapletsLayer = layerKereses("Scraplets");

    const bossArenaLayer = layerKereses("Boss_arena");

    let xpos = backFromCrystalLayer.objects[0].x;
    let ypos = backFromCrystalLayer.objects[0].y;

    if (szoba_belepesi_pont != null) {
        switch (szoba_belepesi_pont) {
            case "Back_from_Kaon_to_Crystal_city":
                xpos = backFromCrystalLayer.objects[0].x;
                ypos = backFromCrystalLayer.objects[0].y;
                break;

            case "Back_from_Iacon_to_Kaon_1":
                xpos = backFromIacon1Layer.objects[0].x;
                ypos = backFromIacon1Layer.objects[0].y;
                break;

            case "Back_from_Iacon_to_Kaon_2":
                xpos = backFromIacon2Layer.objects[0].x;
                ypos = backFromIacon2Layer.objects[0].y;
                break;

            case "Back_from_the_cemetery_to_Kaon":
                xpos = backFromCemeteryLayer.objects[0].x;
                ypos = backFromCemeteryLayer.objects[0].y;
                break;

            case "Back_from_the_smelting_pits_to_Kaon_1":
                xpos = backFromSmelting1Layer.objects[0].x;
                ypos = backFromSmelting1Layer.objects[0].y;
                break;

            case "Back_from_the_smelting_pits_to_Kaon_2":
                xpos = backFromSmelting2Layer.objects[0].x;
                ypos = backFromSmelting2Layer.objects[0].y;
                break;

            case "Savepoint_5":
                xpos = savepointLayer.objects[0].x;
                ypos = savepointLayer.objects[0].y;
                break;
        }
    }

    const map = k.add([
        k.pos(0, 0),
        k.sprite("City_of_Kaon"),
    ]);

    const bonusHeartMegvan = aktivMentesAdatok?.world_interactions?.["bonus-hp-1"] === true;

    let bonusHeartSprite = null;
    if (!bonusHeartMegvan) {
        bonusHeartSprite = k.add([
            k.pos(0, 0),
            k.sprite("City_of_Kaon_heart"),
        ]);
    }

    if (solidLayer && solidLayer.objects) {
        MapColliderek(k, map, solidLayer.objects);
    }

    let bossArenaZone = null;

    if (bossArenaLayer && bossArenaLayer.objects && bossArenaLayer.objects[0]) {
        const arena = bossArenaLayer.objects[0];

        bossArenaZone = k.add([
            k.pos(arena.x, arena.y),
            k.rect(arena.width, arena.height),
            k.area(),
            k.opacity(0),
            "boss_arena_zone",
        ]);
    }

    const player = await jatekos_betolt(k, xpos, ypos);

    Kamera_kezelo(k, xpos, ypos, player, mapW, mapH, bossArenaLayer?.objects?.[0] || null);

    if (scrapletsLayer && scrapletsLayer.objects) {
        scrapletsLayer.objects.forEach((obj) => {
            ScrapletLetrehozas(k, obj.x, obj.y, player, 120);
        });
    }

    if (ladderLayer && ladderLayer.objects) {
        ladderLayer.objects.forEach((obj) => {
            LetraCollider(k, obj, player, playerInteractGombja, playerUgroGombja);
        });
    }

    const savepointObj = savepointLayer.objects[0];
    const savepointNev = savepointLayer.name;
    MentesCollider(k, savepointObj, savepointNev);

    SzobakiesesKezelo(k, map, mapW, mapH);

    if (toCrystalLayer && toCrystalLayer.objects && toCrystalLayer.objects[0]) {
        SzobavaltozatoKezelo(
            k,
            toCrystalLayer.objects[0].x,
            toCrystalLayer.objects[0].y,
            toCrystalLayer.objects[0].width,
            toCrystalLayer.objects[0].height,
            "Crystal_city",
            "Back_from_Kaon_to_Crystal_city",
            "atjaro_crystal_city"
        );
    }

    if (toIacon1Layer && toIacon1Layer.objects && toIacon1Layer.objects[0]) {
        SzobavaltozatoKezelo(
            k,
            toIacon1Layer.objects[0].x,
            toIacon1Layer.objects[0].y,
            toIacon1Layer.objects[0].width,
            toIacon1Layer.objects[0].height,
            "Iacon",
            "Back_From_Kaon_1",
            "atjaro_iacon_1"
        );
    }

    if (toIacon2Layer && toIacon2Layer.objects && toIacon2Layer.objects[0]) {
        SzobavaltozatoKezelo(
            k,
            toIacon2Layer.objects[0].x,
            toIacon2Layer.objects[0].y,
            toIacon2Layer.objects[0].width,
            toIacon2Layer.objects[0].height,
            "Iacon",
            "Back_From_Kaon_2",
            "atjaro_iacon_2"
        );
    }

    if (toCemeteryLayer && toCemeteryLayer.objects && toCemeteryLayer.objects[0]) {
        SzobavaltozatoKezelo(
            k,
            toCemeteryLayer.objects[0].x,
            toCemeteryLayer.objects[0].y,
            toCemeteryLayer.objects[0].width,
            toCemeteryLayer.objects[0].height,
            "Cemetery",
            "Back_from_Kaon",
            "atjaro_cemetery"
        );
    }

    if (toSmelting1Layer && toSmelting1Layer.objects && toSmelting1Layer.objects[0]) {
        SzobavaltozatoKezelo(
            k,
            toSmelting1Layer.objects[0].x,
            toSmelting1Layer.objects[0].y,
            toSmelting1Layer.objects[0].width,
            toSmelting1Layer.objects[0].height,
            "Smelting_Pits",
            "Back_from_Kaon_1",
            "atjaro_smelting_pits_1"
        );
    }

    if (toSmelting2Layer && toSmelting2Layer.objects && toSmelting2Layer.objects[0]) {
        SzobavaltozatoKezelo(
            k,
            toSmelting2Layer.objects[0].x,
            toSmelting2Layer.objects[0].y,
            toSmelting2Layer.objects[0].width,
            toSmelting2Layer.objects[0].height,
            "Smelting_Pits",
            "Back_from_Kaon_2",
            "atjaro_smelting_pits_2"
        );
    }

    //bónusz szív
    if (
        !bonusHeartMegvan &&
        bonusHeartLayer &&
        bonusHeartLayer.objects &&
        bonusHeartLayer.objects[0]
    ) {
        const heartObj = bonusHeartLayer.objects[0];

        k.add([
            k.pos(heartObj.x, heartObj.y),
            k.rect(heartObj.width, heartObj.height),
            k.area(),
            k.opacity(0),
            "kaon_bonus_heart_pickup",
        ]);

        k.onCollide("player", "kaon_bonus_heart_pickup", (playerObj, obj) => {
            console.log("Kaon bonus heart felvéve");

            if (aktivMentesAdatok) {
                aktivMentesAdatok.world_interactions["bonus-hp-1"] = true;
            }

            maxHpNovelese(playerObj, 2);

            if (bonusHeartSprite) {
                bonusHeartSprite.destroy();
            }

            obj.destroy();
        });
    }
}