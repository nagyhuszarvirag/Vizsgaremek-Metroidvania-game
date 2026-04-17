import {
    setBackgroundColor,
    MapColliderek,
    SzobakiesesKezelo,
    SzobavaltozatoKezelo,
    Hamu,
    EffektTorles,
    CollapsingPlatform,
    BreakableFal
} from "./Szobakezelo.js";
import { fecthData } from "../../index.js";
import { jatekos_betolt } from "../entitások/jatekos.js";
import { Kamera_kezelo } from "../entitások/kamera.js";
import { sebzesAdas } from "../entitások/hp_kezelo.js";

export async function Smelting_Pits(k, szoba_belepesi_pont = null) {
    console.log("Kapott belépési pont:", szoba_belepesi_pont);

    EffektTorles();

    setBackgroundColor(k, "#000000");

    const mapW = 32 * 60;
    const mapH = 32 * 50;

    const mapData = await fecthData(
        "http://127.0.0.1:3000/api/map_data/Smelting_pits.json",
    );

    let xpos = mapData.data.layers[8].objects[0].x;
    let ypos = mapData.data.layers[8].objects[0].y;

    if (szoba_belepesi_pont != null) {
        switch (szoba_belepesi_pont) {
            case "From_leesos_hely":
                xpos = mapData.data.layers[8].objects[0].x;
                ypos = mapData.data.layers[8].objects[0].y;
                break;

            case "Back_from_Kaon_1":
                xpos = mapData.data.layers[10].objects[0].x;
                ypos = mapData.data.layers[10].objects[0].y;
                break;

            case "Back_from_Kaon_2":
                xpos = mapData.data.layers[12].objects[0].x;
                ypos = mapData.data.layers[12].objects[0].y;
                break;

            case "Back_fom_hidden_room":
                xpos = mapData.data.layers[14].objects[0].x;
                ypos = mapData.data.layers[14].objects[0].y;
                break;
        }
    }

    const szoba_layerek = mapData.data.layers;

    const bossArenaLayer = szoba_layerek.find(
        (layer) => layer.name === "Boss_arena"
    );

    const bg = k.add([
        k.pos(0, 0),
        k.sprite("Smelting_Pits_BG_1"),
    ]);

    const map = k.add([
        k.pos(0, 0),
        k.sprite("Smelting_Pits"),
    ]);

    const breakableWallLayer = k.add([
        k.pos(0, 0),
        k.sprite("Smelting_Pits_Breakable_wall"),
    ]);

    /*const collapsingGroundLayer = k.add([
        k.pos(0, 0),
        k.sprite("Smelting_Pits_Collapsing_ground"),
    ]);*/

    const collapsingGroundLayer = [];

    for (let i = 1; i < 23; i++) {
        const g = k.add([
            k.pos(0, 0),
            k.sprite(`Smelting_Pits_Collapsing_ground_${i}`)
        ]);
        collapsingGroundLayer.push(g);
    }

    MapColliderek(k, map, szoba_layerek[4].objects);



    for (let i = 0; i < 22; i++) {
        const obj = szoba_layerek[17 + i].objects[0];
        const sprite = collapsingGroundLayer[i];

        sprite.originalX = sprite.pos.x;
        sprite.originalY = sprite.pos.y;

        CollapsingPlatform(k, obj, sprite);
    }

    MapColliderek(k, map, szoba_layerek[7].objects, "Lava_object");

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

    const breakableWallObj = szoba_layerek[5].objects[0];

    BreakableFal(k, breakableWallObj, breakableWallLayer, 2, true, "smelting_breakable_wall");

    player.onCollideUpdate("Lava_object", () => {
        if (localStorage.getItem("lava_protection_ability") === "true") return;
        sebzesAdas(k, player, 1);
    });

    Kamera_kezelo(k, xpos, ypos, player, mapW, mapH, bossArenaLayer?.objects?.[0] || null);

    SzobakiesesKezelo(k, map, mapW, mapH);

    SzobavaltozatoKezelo(
        k,
        mapData.data.layers[9].objects[0].x,
        mapData.data.layers[9].objects[0].y,
        mapData.data.layers[9].objects[0].width,
        mapData.data.layers[9].objects[0].height,
        "Kaon",
        "Back_from_the_smelting_pits_to_Kaon_1",
        "atjaro_kaon_1",
    );

    SzobavaltozatoKezelo(
        k,
        mapData.data.layers[11].objects[0].x,
        mapData.data.layers[11].objects[0].y,
        mapData.data.layers[11].objects[0].width,
        mapData.data.layers[11].objects[0].height,
        "Kaon",
        "Back_from_the_smelting_pits_to_Kaon_2",
        "atjaro_kaon_2",
    );

    SzobavaltozatoKezelo(
        k,
        mapData.data.layers[13].objects[0].x,
        mapData.data.layers[13].objects[0].y,
        mapData.data.layers[13].objects[0].width,
        mapData.data.layers[13].objects[0].height,
        "Hidden_room",
        "Back_from_smelting_pits",
        "atjaro_hidden_room",
    );

    const hamukezelo = Hamu();
    window.hamukezelo = hamukezelo;
    hamukezelo.start();
}