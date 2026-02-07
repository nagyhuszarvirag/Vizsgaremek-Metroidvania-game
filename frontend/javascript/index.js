import { createMainMenu } from "./main_menu.js";

export function fecthData(url) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Hálózati hiba: " + response.statusText);
            }
            return response.json();
        })
        .catch(error => {
            console.error('A fetchel van a hiba:', error);
        });
    }

export function masikJSMeghivasa(src)
{
  const script = document.createElement('script');
  script.src = src;
  document.head.prepend(script);
}

export function oldalTakarito()
{
    const Zenemegtarto = document.getElementById('zenemarad'); //Mindig akarunk zenét 
    if (Zenemegtarto) {
   
    Array.from(document.body.children).forEach(child => { //Megnézi az összes gyereket és eltávolítja őket, kivéve a zenét
        if (child !== Zenemegtarto) {
            child.remove();
        }
    });
    
    } else { //Teljes törlés, ha nincs zene
        document.body.innerHTML = "";
    }
}

export function visszaGomb(vissza) {
  let Gomblehetsosegek=document.createElement("button");
  
    Gomblehetsosegek.innerText=vissza;
    Gomblehetsosegek.classList.add("gombok");
    Gomblehetsosegek.id="vissza_gomb";
  
    Gomblehetsosegek.addEventListener("click", async ()=>{
      await createMainMenu();
    });

    return Gomblehetsosegek;
}

export function dekor_vonal_blokkal(){
    const sor=document.createElement("div");
    sor.classList.add("row", "dekor_vonal");

    for(let i=0; i<3; i++)
    {
      let span=document.createElement("span");
      span.classList.add("kocka");
      span.innerText="■";
      sor.appendChild(span);
    }

    return sor;
}