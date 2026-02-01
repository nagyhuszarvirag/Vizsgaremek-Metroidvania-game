//alapértelmezett dolgok
let volume = 0.5;
let nyelv = "hungarian"; 
let playerEloreMegyGombja="d";
let playerHatraMegyGombja="a";
let playerUgroGombja="space";
let playerAttackGombja="left click"; //Erre majd meg kell nézni, mi a pontos megnevezése a bal egérgombnak addeventlistener esetén
let playerInteractGombja="e";
let telefonMod=false; //Ez automatikusan átáll mobil eszközökön true-ra, ha a képernyőméret megváltozik--> resize event, vagy a user kiválasztja
export {nyelv,volume,playerEloreMegyGombja,playerHatraMegyGombja,playerUgroGombja,playerAttackGombja,playerInteractGombja,telefonMod}; 
//Ezeket az adatokat majd a bejelentkezest usernél az elmentett cuccaikat kell betölteni => új tábla az SQL-ben