import {
    setBackgroundColor,
    MapColliderek,
    SzobakiesesKezelo,
    SzobavaltozatoKezelo,
    MentesCollider
} from "./Szobakezelo.js";
import { fecthData } from "../../index.js";
import { jatekos_betolt } from "../entitások/jatekos.js";

export async function Iacon(k, szoba_belepesi_pont = null) {
    console.log("Kapott belépési pont:", szoba_belepesi_pont);

    setBackgroundColor(k, "#000000");

    const mapW = 32 * 60;
    const mapH = 32 * 50;

    const mapData = await fecthData(
        "http://127.0.0.1:3000/api/map_data/Iacon_city.json",
    );

    let xpos = mapData.data.layers[9].objects[0].x;
    let ypos = mapData.data.layers[9].objects[0].y;

    if (szoba_belepesi_pont != null) {
        switch (szoba_belepesi_pont) {
            case "Back_from_Mitteous_1_and_Medical_Bay":
                xpos = mapData.data.layers[28].objects[0].x;
                ypos = mapData.data.layers[28].objects[0].y;
                break;

            case "Back_from_iacon_2":
                xpos = mapData.data.layers[29].objects[0].x;
                ypos = mapData.data.layers[29].objects[0].y;
                break;

            case "Back_from_iacon_3":
                xpos = mapData.data.layers[30].objects[0].x;
                ypos = mapData.data.layers[30].objects[0].y;
                break;

            case "Back_From_Kaon_1":
                xpos = mapData.data.layers[21].objects[0].x;
                ypos = mapData.data.layers[21].objects[0].y;
                break;

            case "Back_From_Kaon_2":
                xpos = mapData.data.layers[22].objects[0].x;
                ypos = mapData.data.layers[22].objects[0].y;
                break;

            case "Back_from_crystal_city":
                xpos = mapData.data.layers[14].objects[0].x;
                ypos = mapData.data.layers[14].objects[0].y;
                break;

            case "Falling_from_Mitteous_4":
                xpos = mapData.data.layers[23].objects[0].x;
                ypos = mapData.data.layers[23].objects[0].y;
                break;

            case "savepoint_3":
                xpos = mapData.data.layers[9].objects[0].x;
                ypos = mapData.data.layers[9].objects[0].y;
                break;
        }
    }

    const szoba_layerek = mapData.data.layers;

    const hiddenBreakableWall = k.add([k.pos(0, 0), k.sprite("Iacon_Hidden_wall")]);
    const breakableWall1 = k.add([k.pos(0, 0), k.sprite("Iacon_Breakable_wall_1")]);
    const breakableWall2 = k.add([k.pos(0, 0), k.sprite("Iacon_Breakable_wall_2")]);
    const collapsingGround1 = k.add([k.pos(0, 0), k.sprite("Iacon_Collapsing_ground_1")]);
    const collapsingGround2 = k.add([k.pos(0, 0), k.sprite("Iacon_Collapsing_ground_2")]);

    const map = k.add([k.pos(0, 0), k.sprite("Iacon")]);

    MapColliderek(k, map, szoba_layerek[12].objects);

    const collapseZone1 = mapData.data.layers[11].objects[0];
    const collapsingGroundTrigger1 = k.add([
        k.pos(collapseZone1.x, collapseZone1.y),
        k.rect(collapseZone1.width, collapseZone1.height),
        k.area(),
        k.opacity(0),
        "collapsing_ground_trigger_1",
    ]);

    let collapseTriggered1 = false;

    k.onCollide("player", "collapsing_ground_trigger_1", () => {
        if (collapseTriggered1) return;
        collapseTriggered1 = true;

        console.log("Beomló talaj 1 aktiválva");
        collapsingGround1.destroy();
        collapsingGroundTrigger1.destroy();
    });

    const collapseZone2 = mapData.data.layers[17].objects[0];
    const collapsingGroundTrigger2 = k.add([
        k.pos(collapseZone2.x, collapseZone2.y),
        k.rect(collapseZone2.width, collapseZone2.height),
        k.area(),
        k.opacity(0),
        "collapsing_ground_trigger_2",
    ]);

    let collapseTriggered2 = false;

    k.onCollide("player", "collapsing_ground_trigger_2", () => {
        if (collapseTriggered2) return;
        collapseTriggered2 = true;

        console.log("Beomló talaj 2 aktiválva");
        collapsingGround2.destroy();
        collapsingGroundTrigger2.destroy();
    });

    const savepointObj = mapData.data.layers[9].objects[0];
    const savepointNev = mapData.data.layers[9].name;
    MentesCollider(k, savepointObj, savepointNev);

    const player = jatekos_betolt(k, xpos, ypos);

    SzobakiesesKezelo(k, map, mapW, mapH);

    SzobavaltozatoKezelo(
        k,
        mapData.data.layers[24].objects[0].x,
        mapData.data.layers[24].objects[0].y,
        mapData.data.layers[24].objects[0].width,
        mapData.data.layers[24].objects[0].height,
        "Medbay",
        "Back_From_Iacon",
        "atjaro_medbay"
    );

    SzobavaltozatoKezelo(
        k,
        mapData.data.layers[25].objects[0].x,
        mapData.data.layers[25].objects[0].y,
        mapData.data.layers[25].objects[0].width,
        mapData.data.layers[25].objects[0].height,
        "Mitteous_Plateau",
        "Back_From_Iacon_1",
        "atjaro_mitteous_1"
    );

    SzobavaltozatoKezelo(
        k,
        mapData.data.layers[26].objects[0].x,
        mapData.data.layers[26].objects[0].y,
        mapData.data.layers[26].objects[0].width,
        mapData.data.layers[26].objects[0].height,
        "Mitteous_Plateau",
        "Back_From_Iacon_2",
        "atjaro_mitteous_2"
    );

    SzobavaltozatoKezelo(
        k,
        mapData.data.layers[27].objects[0].x,
        mapData.data.layers[27].objects[0].y,
        mapData.data.layers[27].objects[0].width,
        mapData.data.layers[27].objects[0].height,
        "Mitteous_Plateau",
        "Back_From_Iacon_3",
        "atjaro_mitteous_3"
    );

    SzobavaltozatoKezelo(
        k,
        mapData.data.layers[19].objects[0].x,
        mapData.data.layers[19].objects[0].y,
        mapData.data.layers[19].objects[0].width,
        mapData.data.layers[19].objects[0].height,
        "Kaon",
        "Back_from_Iacon_to_Kaon_1",
        "atjaro_kaon_1"
    );

    SzobavaltozatoKezelo(
        k,
        mapData.data.layers[20].objects[0].x,
        mapData.data.layers[20].objects[0].y,
        mapData.data.layers[20].objects[0].width,
        mapData.data.layers[20].objects[0].height,
        "Kaon",
        "Back_from_Iacon_to_Kaon_2",
        "atjaro_kaon_2"
    );

    SzobavaltozatoKezelo(
        k,
        mapData.data.layers[13].objects[0].x,
        mapData.data.layers[13].objects[0].y,
        mapData.data.layers[13].objects[0].width,
        mapData.data.layers[13].objects[0].height,
        "Crystal_city",
        "Back_from_Iacon_to_Crystal_city",
        "atjaro_crystal_city"
    );

    SzobavaltozatoKezelo(
        k,
        mapData.data.layers[10].objects[0].x,
        mapData.data.layers[10].objects[0].y,
        mapData.data.layers[10].objects[0].width,
        mapData.data.layers[10].objects[0].height,
        "Leesos_hely",
        "Falling_down_from_Iacon",
        "atjaro_leesos_hely"
    );
}