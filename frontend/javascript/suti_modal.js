import { fecthData } from "./index.js";
import { settings } from "./options.js";

export async function sutiModalKeszit() {
  const dataNyelv = await fecthData(
    "http://127.0.0.1:3000/api/nyelv_alapjan_JSON_olvasas/" +
      settings.nyelv +
      "/suti_modal.json",
  );

  if (localStorage.getItem("sutiElfogad")) return;

  //overlay
  const overlay = document.createElement("div");
  overlay.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.75);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        font-family: Arial, sans-serif;
    `;

  //modal
  const modal = document.createElement("div");
  modal.style.cssText = `
  width: min(760px, 92vw);
  min-height: 260px;
  background: url("../../backend/img/starting_screen/sutiHatter.jpg") no-repeat center / cover;
  border: 2px solid #00cfff;
  border-radius: 18px;
  position: relative;
  color: #e6f6ff;
  box-shadow: 0 0 22px #00cfff, inset 0 0 18px #00cfff33;
  overflow: hidden;
`;

  const bgDim = document.createElement("div");
  bgDim.style.cssText = `
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(0,0,0,0.65),
    rgba(0,0,0,0.35),
    rgba(0,0,0,0.65)
  );
`;

  //belső tartalom panel
  const contentBox = document.createElement("div");
  contentBox.style.cssText = `
  position: absolute;
  right: 30px;
  top: 60px;
  width: 480px;
  padding: 20px;
`;

  //bezárás
  const bezar = document.createElement("div");
  bezar.textContent = "×";
  bezar.style.cssText = `
  position: absolute;
  top: 10px;
  right: 14px;
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  cursor: pointer;
  font-size: 22px;
  line-height: 1;
  color: #e6f6ff;
  border: 1px solid rgba(0,207,255,0.7);
  border-radius: 10px;
  background: rgba(0,0,0,0.35);
  text-shadow: 0 0 10px #00cfff;
`;

  //cím
  const cim = document.createElement("h2");
  cim.textContent = dataNyelv.data.cim;
  cim.style.cssText = `
  margin: 0 0 10px;
  font-size: 26px;
  font-weight: 800;
  letter-spacing: 0.3px;
  color: #ffffff;
  text-shadow: 0 0 12px rgba(0,207,255,0.9);
`;

  //szöveg
  const szoveg = document.createElement("p");
  szoveg.textContent = dataNyelv.data.szoveg;
  szoveg.style.cssText = `
  margin: 0 0 16px;
  font-size: 15px;
  line-height: 1.55;
  color: #d8f3ff;
  text-shadow: 0 0 6px rgba(0,0,0,0.8);
`;

  //gombok konténere
  const gombSor = document.createElement("div");
  gombSor.style.cssText = `
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 10px;
`;

  //részletek gomb
  const reszletekGomb = document.createElement("button");
  reszletekGomb.textContent = dataNyelv.data.reszletGomb;
  reszletekGomb.style.cssText = sciFiGombStyle(false);
  reszletekGomb.onclick = () => alert(dataNyelv.data.szabalyzat);

  //elfogadás gomb
  const elfogadasGomb = document.createElement("button");
  elfogadasGomb.textContent = dataNyelv.data.elfogadasGomb;
  elfogadasGomb.style.cssText = sciFiGombStyle(true);
  elfogadasGomb.onclick = () => {
    localStorage.setItem("sutiElfogad", "1");

    localStorage.setItem(
      "mentes_1",
      JSON.stringify({
        success: true,
        data: {
          mentett_adatok: {
            savepoint: "kezdomap_1",
            world_interactions: {
              "mitteous-plateau_breakable-ground1": false,
              'Iacon_breakable-ground1': false,
              'Iacon_breakable-ground2': false,
              'Iacon_breakable-wall1': false,
              'Iacon_breakable-wall2': false,
              'Iacon_breakable-wall3': false,
              'Smelting-pits_breakable-wall1': false,
              'lighthouse-on': false,
              'lighthouse-sea-of-flowers-cutscenes': false,
              'crystal-heart-open_lock': false,
              'crystal-heart-lava-protection': false,
              'bonus-hp-1': false,
              'bonus-hp-2': false,
              'bonus-hp-3': false
            },
            NPC_interactions: {
              Ratchet: false,
              Prowl: false,
              Chromedome_and_Ratchet: false,
              Swindle: false,
              Tailgate: false
            },
            bosses: {
              Tarn: false,
              Sparkeater: false
            },
            ability_unlocked: {
              double_jump: false,
              dash: false,
              slash_attack: false
            },
          },
        },
      }),
    );

    localStorage.setItem(
      "mentes_2",
      JSON.stringify({
        success: true,
        data: {
          mentett_adatok: {
            savepoint: "kezdomap_1",
            world_interactions: {
              "mitteous-plateau_breakable-ground1": false,
              'Iacon_breakable-ground1': false,
              'Iacon_breakable-ground2': false,
              'Iacon_breakable-wall1': false,
              'Iacon_breakable-wall2': false,
              'Iacon_breakable-wall3': false,
              'Smelting-pits_breakable-wall1': false,
              'lighthouse-on': false,
              'lighthouse-sea-of-flowers-cutscenes': false,
              'crystal-heart-open_lock': false,
              'crystal-heart-lava-protection': false,
              'bonus-hp-1': false,
              'bonus-hp-2': false,
              'bonus-hp-3': false
            },
            NPC_interactions: {
              Ratchet: false,
              Prowl: false,
              Chromedome_and_Ratchet: false,
              Swindle: false,
              Tailgate: false
            },
            bosses: {
              Tarn: false,
              Sparkeater: false
            },
            ability_unlocked: {
              double_jump: false,
              dash: false,
              slash_attack: false
            },
          },
        },
      }),
    );

    localStorage.setItem(
      "mentes_3",
      JSON.stringify({
        success: true,
        data: {
          mentett_adatok: {
            savepoint: "kezdomap_1",
            world_interactions: {
              "mitteous-plateau_breakable-ground1": false,
              'Iacon_breakable-ground1': false,
              'Iacon_breakable-ground2': false,
              'Iacon_breakable-wall1': false,
              'Iacon_breakable-wall2': false,
              'Iacon_breakable-wall3': false,
              'Smelting-pits_breakable-wall1': false,
              'lighthouse-on': false,
              'lighthouse-sea-of-flowers-cutscenes': false,
              'crystal-heart-open_lock': false,
              'crystal-heart-lava-protection': false,
              'bonus-hp-1': false,
              'bonus-hp-2': false,
              'bonus-hp-3': false
            },
            NPC_interactions: {
              Ratchet: false,
              Prowl: false,
              Chromedome_and_Ratchet: false,
              Swindle: false,
              Tailgate: false
            },
            bosses: {
              Tarn: false,
              Sparkeater: false
            },
            ability_unlocked: {
              double_jump: false,
              dash: false,
              slash_attack: false
            },
          },
        },
      }),
    );

    localStorage.setItem(
      "mentes_4",
      JSON.stringify({
        success: true,
        data: {
          mentett_adatok: {
            savepoint: "kezdomap_1",
            world_interactions: {
              "mitteous-plateau_breakable-ground1": false,
              'Iacon_breakable-ground1': false,
              'Iacon_breakable-ground2': false,
              'Iacon_breakable-wall1': false,
              'Iacon_breakable-wall2': false,
              'Iacon_breakable-wall3': false,
              'Smelting-pits_breakable-wall1': false,
              'lighthouse-on': false,
              'lighthouse-sea-of-flowers-cutscenes': false,
              'crystal-heart-open_lock': false,
              'crystal-heart-lava-protection': false,
              'bonus-hp-1': false,
              'bonus-hp-2': false,
              'bonus-hp-3': false
            },
            NPC_interactions: {
              Ratchet: false,
              Prowl: false,
              Chromedome_and_Ratchet: false,
              Swindle: false,
              Tailgate: false
            },
            bosses: {
              Tarn: false,
              Sparkeater: false
            },
            ability_unlocked: {
              double_jump: false,
              dash: false,
              slash_attack: false
            },
          },
        },
      }),
    );

    localStorage.setItem(
      "achivements_hu",
      JSON.stringify({
        success: true,
        data: [
    {
      achievement_title: "Mindig komoly vagyok",
      achievement_text: "Lásd, ahogy Prowl felborít egy asztalt.",
      unlocked: 0
    },
    {
      achievement_title: "Túl öreg vagyok ehhez!",
      achievement_text: "Nézd végig, ahogy Ratchet nem tud megmenteni valakit.",
      unlocked: 0
    },
    {
      achievement_title: "Swindle",
      achievement_text: "Vásárolj halálfelvételeket a Swindle-től.",
      unlocked: 0
    },
    {
      achievement_title: "A temető?",
      achievement_text: "Találd meg az \"Eltűntek tiszteletére\" feliratú monolitot",
      unlocked: 0
    },
    {
      achievement_title: "Sparkeater",
      achievement_text: "Győz le egy Sparkeater-t.",
      unlocked: 0
    },
    {
      achievement_title: "Az olvasztó gödrökhöz!",
      achievement_text: "Fogadd el a kristály szív védelmét a láva ellen.",
      unlocked: 0
    },
    {
      achievement_title: "Tarn",
      achievement_text: "Győzd le Tarn-t.",
      unlocked: 0
    },
    {
      achievement_title: "ELKÉSEK!",
      achievement_text: "Találd meg Tailgatet, aki a...Lost Light-hoz megy?",
      unlocked: 0
    },
    {
      achievement_title: "Égbolti idióták",
      achievement_text: "Legyél tanúja egy balesetnek és egy határeseti gyilkosságnak.",
      unlocked: 0
    },
    {
      achievement_title: "The Lost Light",
      achievement_text: "Érd el a Lost Light-ot és kezdd meg az utazást.",
      unlocked: 0
    }
  ],
      }),
    );

    localStorage.setItem(
      "achivements_en",
      JSON.stringify({
        success: true,
        data: [
    {
      achievement_title: "I'm always serious",
      achievement_text: "Witness Prowl throw a table",
      unlocked: 0
    },
    {
      achievement_title: "I'm too old for this!",
      achievement_text: "Watch as Ratchet fails to save someone",
      unlocked: 0
    },
    {
      achievement_title: "Swindle",
      achievement_text: "Purchase some death footages from Swindle",
      unlocked: 0
    },
    {
      achievement_title: "The cemetery?",
      achievement_text: "Witness the monolith labelled \"In Honor of the Dissappeared\"",
      unlocked: 0
    },
    {
      achievement_title: "Sparkeater",
      achievement_text: "Defeat a Sparkeater",
      unlocked: 0
    },
    {
      achievement_title: "To the smelting pits!",
      achievement_text: "Receive the crystal heart's protection against lava",
      unlocked: 0
    },
    {
      achievement_title: "Tarn",
      achievement_text: "Defeat Tarn",
      unlocked: 0
    },
    {
      achievement_title: "I'M LATE!",
      achievement_text: "Find Tailgate, who is going to the...Lost Light?",
      unlocked: 0
    },
    {
      achievement_title: "Sky idiots",
      achievement_text: "Witness an accident and borderline murder",
      unlocked: 0
    },
    {
      achievement_title: "The Lost Light",
      achievement_text: "Reach the Lost Light and start the voyage.",
      unlocked: 0
    }
  ],
      }),
    );

    if (!localStorage.getItem("user")) {
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: 0,
          usernev: "guest",
          jog: 2,
        }),
      );
    }

    window.dispatchEvent(
      new CustomEvent("authChanged", { detail: { loggedIn: false } }),
    );
    overlay.remove();
  };

  bezar.onclick = () => overlay.remove();

  gombSor.append(reszletekGomb, elfogadasGomb);
  contentBox.append(cim, szoveg, gombSor);

  modal.append(bgDim, contentBox, bezar);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

function sciFiGombStyle(primary) {
  if (primary) {
    return `
            padding: 8px 22px;
            background: linear-gradient(145deg, #1fb6ff, #0077cc);
            border: 1px solid #6fd6ff;
            color: #fff;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
            box-shadow: 0 0 15px #3cc7ff99;
        `;
  } else {
    return `
            padding: 8px 22px;
        background: transparent;
        border: 1px solid #3cc7ff;
        color: #7dd9ff;
        border-radius: 6px;
        cursor: pointer;
        `;
  }
}
