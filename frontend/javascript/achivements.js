import {
  fecthData,
  oldalTakarito,
  visszaGomb,
  dekor_vonal_blokkal,
} from "./index.js";
import { nyelv } from "./options.js";

export async function ShowAchivements() {
  oldalTakarito();
  let userid = JSON.parse(localStorage.getItem("user"));
  const data = await fecthData(
    "http://127.0.0.1:3000/api/nyelv_alapjan_JSON_olvasas/" +
      nyelv +
      "/achivements.json",
  );
  let achivmentAdatok;

  if(userid.id!=0){
     achivmentAdatok = await fecthData(
    "http://127.0.0.1:3000/api/showachivements/" + userid.id + "/" + nyelv,
    );
  }else{
    switch (nyelv) {
      case 1:
         achivmentAdatok = JSON.parse(localStorage.getItem("achivements_hu"));
        break;

      case 2:
         achivmentAdatok = JSON.parse(localStorage.getItem("achivements_en"));
        break;

      default:
        throw new Error("Ismeretlen nyelv!");
        break;
    }
  }

  let fodiv = document.createElement("div");
  let sor = document.createElement("div");
  fodiv.classList.add("achivement_container");

  let cim = document.createElement("h1");
  cim.classList.add("text-center");
  cim.innerText = data.data.cim;
  sor.appendChild(cim);
  fodiv.appendChild(sor);

  sor = document.createElement("div");
  sor.appendChild(dekor_vonal_blokkal());
  fodiv.appendChild(sor);

  let achivementtarolo = document.createElement("div");
  achivementtarolo.classList.add("scrolldiv");

  for (let i = 0; i < achivmentAdatok.data.length; i++) {
    sor = document.createElement("div");
    let achivementdiv = document.createElement("div");
    let achivementclicktorevealdiv = document.createElement("div");
    let achivementshowndiv = document.createElement("div");
    let baldiv = document.createElement("div");
    let jobbdiv = document.createElement("div");
    let achivementkep = document.createElement("img");
    let achivementcim = document.createElement("h3");
    let achivementleiras = document.createElement("p");

    if (achivmentAdatok.data[i].unlocked) {
      achivementkep.src = "../images/achivement_icons/achivement_" + i + ".jpg";
      achivementcim.innerText = achivmentAdatok.data[i].achievement_title;
      achivementleiras.innerText = achivmentAdatok.data[i].achievement_text;

      achivementkep.classList.add("achivement_kep");

      jobbdiv.appendChild(achivementcim);
      jobbdiv.appendChild(achivementleiras);
      baldiv.appendChild(achivementkep);
    } else {
      let p = document.createElement("p");
      p.innerText = data.data.felfed;
      achivementclicktorevealdiv.classList.add("click_to_reveal", "p-2");

      achivementclicktorevealdiv.addEventListener("click", () => {
        achivementclicktorevealdiv.style.display = "none";
        achivementkep.src =
          "../images/achivement_icons/achivement_" + i + ".jpg";
        achivementcim.innerText = achivmentAdatok.data[i].achievement_title;
        achivementleiras.innerText = achivmentAdatok.data[i].achievement_text;

        achivementkep.classList.add("achivement_kep");

        jobbdiv.appendChild(achivementcim);
        jobbdiv.appendChild(achivementleiras);
        baldiv.appendChild(achivementkep);
      });

      achivementclicktorevealdiv.appendChild(p);
      achivementdiv.appendChild(achivementclicktorevealdiv);
    }

    achivementdiv.classList.add("container");
    achivementshowndiv.classList.add("row", "p-2");
    baldiv.classList.add("col-3");
    jobbdiv.classList.add("col-9");

    achivementshowndiv.appendChild(baldiv);
    achivementshowndiv.appendChild(jobbdiv);
    achivementdiv.appendChild(achivementshowndiv);
    sor.appendChild(achivementdiv);
    achivementtarolo.appendChild(sor);
  }

  fodiv.appendChild(achivementtarolo);

  sor = document.createElement("div");
  sor.appendChild(dekor_vonal_blokkal());
  fodiv.appendChild(sor);

  sor = document.createElement("div");
  sor.appendChild(visszaGomb(data.data.vissza));
  fodiv.appendChild(sor);

  document.body.appendChild(fodiv);
}
