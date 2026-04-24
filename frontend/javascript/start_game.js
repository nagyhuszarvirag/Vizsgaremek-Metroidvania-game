//Meg kell csinálni az SQL-t, mert addig nem tudok itt haladni
import {
  oldalTakarito,
  fecthData,
  visszaGomb,
  dekor_vonal_blokkal,
} from "./index.js";
import { settings } from "./options.js";
import { KaboomBetolto } from "./jatek/kaboomBetolto.js";

export async function startGame() {
  oldalTakarito();
  const data = await fecthData(
    "http://127.0.0.1:3000/api/nyelv_alapjan_JSON_olvasas/" +
      settings.nyelv +
      "/start_game.json",
  );

  const data_szoba_nevek = await fecthData(
    "http://127.0.0.1:3000/api/nyelv_alapjan_JSON_olvasas/" +
      settings.nyelv +
      "/szoba_nevek.json",
  );

  let fodiv = document.createElement("div");

  fodiv.id = "game-container";
  fodiv.classList.add("container", "mt-5");

  let sor = document.createElement("div");
  let p = document.createElement("p");

  p.innerText = data.data.valassz;

  sor.appendChild(p);
  fodiv.appendChild(sor);

  sor.classList.add("row", "mb-5");
  p.classList.add("text-center");

  fodiv.appendChild(dekor_vonal_blokkal());

  sor = document.createElement("div");

  let user = JSON.parse(localStorage.getItem("user"));
  for (let i = 0; i < 4; i++) {
    let jatekFajlok = document.createElement("div");
    //betölteni metnéseket

    let szoba_nev = data.data.uj_jatek;
    let mentes_szam;

    if(user.id!=0){

      let mentes=await fecthData(
      "http://127.0.0.1:3000/api/mentesmeghiv/" + user.id + "/" + i,
      );

      mentes_szam=mentes.data.mentett_adatok.savepoint;

    }
    else{    
      mentes_szam=JSON.parse(localStorage.getItem("mentes_"+i));
    }

    switch (mentes_szam) {
      case "savepoint_2":
          szoba_nev = data_szoba_nevek.data.mitteous;
          break;

        case "savepoint_2":
          szoba_nev = data_szoba_nevek.data.mitteous;
          break;

        case "savepoint_3":
          szoba_nev = data_szoba_nevek.data.iacon;
          break;

        case "Savepoint_4":
          szoba_nev = data_szoba_nevek.data.medbay;
          break;

        case "Savepoint_5":
          szoba_nev = data_szoba_nevek.data.kaon;
          break;
      }

    
    jatekFajlok.innerText = szoba_nev;
    jatekFajlok.classList.add("jatek_fajlok", "p-4");
    jatekFajlok.id = "jatek_fajlok_" + i;

    jatekFajlok.addEventListener("click", async () => {
      //itt kell majd betölteni a mentett játék fájlokat SQL-ből vagy létrehozni új játékot
      oldalTakarito();
      KaboomBetolto(i);
      console.log("Új játék létrehozva/betöltve Mentés_id: " + i);
    });

    sor.appendChild(jatekFajlok);
  }

  fodiv.appendChild(sor);
  sor.classList.add("row");

  sor = document.createElement("div");

  sor.appendChild(visszaGomb(data.data.vissza));
  sor.classList.add("gombok", "row");

  fodiv.appendChild(sor);

  document.body.appendChild(fodiv);
}
