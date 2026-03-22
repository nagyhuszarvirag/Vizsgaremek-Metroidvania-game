//alapértelmezett felhasználói beállítások
let volume = 0.5;
let nyelv = localStorage.getItem("nyelv") || 1; //1 magyar, 2 angol
let playerEloreMegyGombja = "d";
let playerHatraMegyGombja = "a";
let playerUgroGombja = "space";
let playerAttackGombja = "left click";
let playerInteractGombja = "e";
let mobileMode = false;

export {
  volume,
  nyelv,
  playerEloreMegyGombja,
  playerHatraMegyGombja,
  playerUgroGombja,
  playerAttackGombja,
  playerInteractGombja,
  mobileMode
};

export function irNyelv(ujNyelv) {
  nyelv = ujNyelv;
}