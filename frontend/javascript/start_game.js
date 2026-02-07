//Meg kell csinálni az SQL-t, mert addig nem tudok itt haladni
import { oldalTakarito, fecthData, visszaGomb, dekor_vonal_blokkal} from "./index.js";
import { nyelv } from "./options.js";

export async function startGame() {
  oldalTakarito();
  const data = await fecthData("http://127.0.0.1:3000/api/nyelv_alapjan_JSON_olvasas/" + nyelv + "/start_game.json");

  let fodiv=document.createElement("div");

  fodiv.id="game-container";
  fodiv.classList.add("container", "mt-5");

  let sor=document.createElement("div");
  let p=document.createElement("p");

  p.innerText=data.data.valassz;

  sor.appendChild(p);
  fodiv.appendChild(sor);

  sor.classList.add("row", "mb-5");
  p.classList.add("text-center");


  fodiv.appendChild(dekor_vonal_blokkal());
  

  sor=document.createElement("div");
  for(let i=0; i<4; i++)
  {
    let jatekFajlok=document.createElement("div");
    //betölteni metnéseket
    jatekFajlok.innerText=data.data.uj_jatek;
    jatekFajlok.classList.add("jatek_fajlok", "p-4");
    jatekFajlok.id="jatek_fajlok_"+i;

    jatekFajlok.addEventListener("click", async ()=>{
      //itt kell majd betölteni a mentett játék fájlokat SQL-ből vagy létrehozni új játékot
      console.log("Új játék létrehozva/betöltve");
    });

    sor.appendChild(jatekFajlok);
  }
  
  fodiv.appendChild(sor);
  sor.classList.add("row");

  sor=document.createElement("div");
  
  sor.appendChild(visszaGomb(data.data.vissza));
  sor.classList.add("gombok", "row");
  
  fodiv.appendChild(sor);

  document.body.appendChild(fodiv);
};