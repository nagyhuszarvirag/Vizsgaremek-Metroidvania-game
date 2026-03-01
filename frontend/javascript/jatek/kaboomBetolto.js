import kaboom from "../../libraries/kaboom.mjs";
import {Kezdoszoba} from "./szobak/Kezdoszoba.js";
import {setBackgroundColor} from "./szobak/Szobakezelo.js";
import {fecthData} from "../index.js";

export async function KaboomBetolto(mentes_id) {

    const user = JSON.parse(localStorage.getItem("user"));
    const mentesbetolto=await fecthData("http://127.0.0.1:3000/api/mentesmeghiv/"+user.id+"/"+mentes_id);

    console.log("Mentés betöltve: "+mentesbetolto.data.mentett_adatok.savepoint);

    const scale=3;

    const k = kaboom({ 
        width: window.innerWidth,
        height: window.innerHeight,
        scale: scale,
    });

    k.scene("intro", () => {
        k.add([
            k.text("Intro jelenet"),
            k.pos(120, 80),
        ]);

        k.onKeyPress("enter", () => { //ezt dinamikussá tenni könnyű cancel érdekében, ez lesz majd a skip intro gomb
        //Ide majd zenét elindítását is belerakhatjuk
        console.log("Intro átugorva");
        Kezdoszoba(k);
        });
    });

    k.loadSprite("Kezdoszoba","../../images/maps/kezdomap.png"); //Itt midnig be kell tölteni a szoba spriteját késúbbi kezelésre

    k.loadSprite("player", "../../images/sprites/Main_player.png", { //Ez még csak definiálás, majd le kell programozni a többi cuccot
        sliceX: 12, 
        sliceY: 7,
        animations: {
        idle: { from: 0, to: 7, loop: true },
        walk: { from: 72, to: 84, loop: true },
        run: { from: 24, to: 31, loop: true },
        jump: { from: 36, to: 38, loop: true },
        run_and_jump: { from: 12, to: 14, loop: true },
        attack: { from: 24, to: 28, speed: 16 },
        hurt: { from: 60, to: 63, speed: 16 },
        }
    });

    k.setGravity(800); //Ezt is fine tuningolni kell majd

    switch(mentesbetolto.data.mentett_adatok.savepoint){ //Később itt töltjük be a mentés alapján a megfelelő szobát és mentett pontot
        case "kezdomap_1":
            k.go("intro");
            break;

        default:
            console.log("Ismeretlen savepoint: "+mentesbetolto.data.mentett_adatok.savepoint);
    };

}