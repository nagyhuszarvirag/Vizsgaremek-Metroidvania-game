import { fecthData, oldalTakarito, visszaGomb, dekor_vonal_blokkal } from "./index.js";
import { nyelv } from "./options.js";

export async function loadCredits() {
  oldalTakarito();
  const data = await fecthData("http://127.0.0.1:3000/api/nyelv_alapjan_JSON_olvasas/" + nyelv + "/credits.json");

  let fodiv=document.createElement("div");
  fodiv.classList.add("credits_container");

  let sor=document.createElement("div");
  let h1=document.createElement("h1");
  h1.innerText=data.data.credits;
  sor.appendChild(h1);
  fodiv.appendChild(sor);

  sor=document.createElement("div");
  sor.appendChild(dekor_vonal_blokkal());
  fodiv.appendChild(sor);

  let credittarol=document.createElement("div");
  credittarol.classList.add("scrolldiv");

  sor=document.createElement("div");
 
  credittarol.appendChild(createCreditRow(data.data.Fo_kozremukodok, sor));

  sor=document.createElement("div");
  credittarol.appendChild( createCreditRow(data.data.Tovabbi_segitok, sor));

  fodiv.appendChild(credittarol);

  sor=document.createElement("div");
  sor.appendChild(dekor_vonal_blokkal());
  fodiv.appendChild(sor);

  sor=document.createElement("div");
  sor.appendChild(visszaGomb(data.data.vissza));
  fodiv.appendChild(sor);
  document.body.appendChild(fodiv);
}

function createCreditRow(data, sor) {
    
    for (let i of data) { //Mint kiderült a Javascript ilyet is tud :D ILY Sonarqube
        let p=document.createElement("p");
        p.innerText=i; //itt az i az a loopon kívüli data[i] eleme
        sor.appendChild(p);
    }   

    return sor;
}