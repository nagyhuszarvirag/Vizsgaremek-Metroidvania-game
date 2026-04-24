//alapértelmezett felhasználói beállítások
/*let volume = 0.5;
let nyelv = localStorage.getItem("nyelv") || 1; //1 magyar, 2 angol
let playerEloreMegyGombja = "d";
let playerHatraMegyGombja = "a";
let playerUgroGombja = "space";
let playerAttackGombja = "left click";
let playerInteractGombja = "e";
let mobileMode = false;*/

export const settings = {
  volume: 0.5,
  nyelv: localStorage.getItem("nyelv") || 1,

  controls: {
    forward: "d",
    back: "a",
    jump: "space",
    attack: "left click",
    interact: "e",
  },

  mobileMode: false,
};

export function irNyelv(ujNyelv) {
  settings.nyelv = ujNyelv;
}
