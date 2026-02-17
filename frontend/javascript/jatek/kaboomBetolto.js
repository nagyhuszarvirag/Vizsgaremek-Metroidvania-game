import kaboom from "../../libraries/kaboom.mjs";

export async function KaboomBetolto() {
    kaboom();
    add([
    text("Kaboom betöltve"),
    pos(120, 80),
    ]);
    console.log("Kaboom betöltve");
}