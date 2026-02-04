import { fecthData, oldalTakarito, visszaGomb } from "./index.js";
import { nyelv } from "./options.js";

export async function loadCredits() {
  oldalTakarito();
  const data = await fecthData("http://127.0.0.1:3000/api/nyelv_alapjan_JSON_olvasas/" + nyelv + "/credits.json");
  console.log(data);

  let fodiv=document.createElement("div");

  let sor=document.createElement("div");
 
  fodiv.appendChild(createCreditRow(data.data.Fo_kozremukodok, sor));

  sor=document.createElement("div");
  fodiv.appendChild( createCreditRow(data.data.Tovabbi_segitok, sor));
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