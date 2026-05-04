import { cutscene_kezeles, GRAVITY, SPEED, JUMP_FORCE, mentesunk_idja, aktivMentesAdatok } from "../kaboomBetolto.js";
import { settings } from "../../options.js";
import { TeljesMentesLetrehozo, szoba_zene_beallitas } from "../szobak/Szobakezelo.js";
import { hpRendszerBeallitas, gyogyitas } from "./hp_kezelo.js";
import { hpUI } from "./hp_ui.js";
import { beallitasMenuLetrehoz } from "../../beallitas_menu.js";
import { fecthData } from "../../index.js";
import { startGame } from "../../start_game.js";
import { TutorialHint } from "./tutorial_kezelo.js";
import { mentes } from "./unlock_uzenet_UI.js";

export async function jatekos_betolt(k, xpos, ypos, current_map = "semelyik") {
  const player = k.add([
    k.sprite("player"),
    k.pos(xpos, ypos - 30), //a -30 azért kell, hogy a játékos ne a lábánál legyen lerakva, hanem a közepénél
    k.anchor("center"),
    k.area({
      shape: new k.Rect(k.vec2(0, 1), 20, 30), //itt tudod állítgatni a boxát a vec2 az a box pozíciója a másik két szám pedig a szélesség magasság
    }),
    k.body(),
    "player",
  ]);

  let kezdoSzivek = 5; //Majd a mentés adatai-ba bele lesz rakva a két plussz perma hp, úgyhogy majd azt felhasználhatjuk, hogy mindig jó mentés, jó hp-t kapjon

  if (aktivMentesAdatok?.world_interactions?.["bonus-hp-1"] === true) {
    kezdoSzivek += 1;
  }

  if (aktivMentesAdatok?.world_interactions?.["bonus-hp-2"] === true) {
    kezdoSzivek += 1;
  }

  if (aktivMentesAdatok?.world_interactions?.["bonus-hp-3"] === true) {
    kezdoSzivek += 1;
  }


  hpRendszerBeallitas(player, kezdoSzivek);
  player.hpUI = hpUI(k, player);

  const slashBarBg = k.add([
    k.rect(180, 10),
    k.pos(25, 90),
    k.fixed(),
    k.opacity(0.4),
    k.z(999),
  ]);

  const slashBarFill = k.add([
    k.rect(180, 10),
    k.pos(25, 90),
    k.fixed(),
    k.color(0, 255, 100),
    k.z(1000),
  ]);

  k.onUpdate(() => {
    const slashUnlocked =
      aktivMentesAdatok?.data?.mentett_adatok?.ability_unlocked?.slash_attack === true;

    if (!slashUnlocked) {
      slashBarBg.hidden = true;
      slashBarFill.hidden = true;
      return;
    }

    slashBarBg.hidden = false;
    slashBarFill.hidden = false;

    const ratio = 1 - player.slashCooldown / player.slashCooldownMax;
    slashBarFill.width = 180 * Math.max(0, Math.min(1, ratio));
  });

  player.letaranVan = false;
  player.aktivLetra = null;
  player.letraSebesseg = 100;
  player.tamad = false;
  player.tamadasAblakNyitva = false;
  player.serul = false;
  player.knockbackX = 0;
  player.knockbackY = 0;
  player.knockbackTimer = 0;
  player.menuNyitva = false;
  player.menu2Nyitva = false;
  player.slashCooldown = 0;
  player.slashCooldownMax = 15;
  player.dashSpeed = 520;
  player.dashTime = 0.16;

  player.play("idle");

  const tutorial_data = await fecthData(
        "http://127.0.0.1:3000/api/nyelv_alapjan_JSON_olvasas/" +
          settings.nyelv +
          "/tutorial.json",);


  player.tutorial = TutorialHint(k, player);

  player.tutorial.showOnce(
    "movement",
    `${settings.controls.back.toUpperCase()} / ${settings.controls.forward.toUpperCase()} - `+tutorial_data.data.mozgas
  );

  k.wait(5, () => {
    if (player.tutorial) {
      player.tutorial.hideHint();
    }
  });

  let kelleprowl = !aktivMentesAdatok.data.mentett_adatok.NPC_interactions.Prowl;
  let kellerachet = !aktivMentesAdatok.data.mentett_adatok.NPC_interactions.Ratchet;
  let kelleswindle = !aktivMentesAdatok.data.mentett_adatok.NPC_interactions.Swindle;
  let kelletailgate = !aktivMentesAdatok.data.mentett_adatok.NPC_interactions.Tailgate;
  let kelleChromedome_and_Ratchet_combo = !aktivMentesAdatok.data.mentett_adatok.NPC_interactions.Chromedome_and_Ratchet;

  let aktivNPC = null;
  let aktivMentesPont = null;

  player.onCollideUpdate("Prowl", (obj) => {
    if (kelleprowl) {
      aktivNPC = obj;

      if (player.tutorial) {
        player.tutorial.showOnce(
          "npc_interact",
          `${settings.controls.interact.toUpperCase()} - `+tutorial_data.data.beszel
        );
      }
    }
  });

  player.onCollideEnd("Prowl", (obj) => {
    if (aktivNPC === obj) {
      aktivNPC = null;

      if (player.tutorial) {
        player.tutorial.hideHint();
      }
    }
  });

  player.onCollideUpdate("Ratchet", (obj) => {
    if (kellerachet) {
      aktivNPC = obj;
    }
  });

  player.onCollideEnd("Ratchet", (obj) => {
    if (aktivNPC === obj) {
      aktivNPC = null;
    }
  });

  player.onCollideUpdate("Swindle", (obj) => {
    if (kelleswindle) {
      aktivNPC = obj;
    }
  });

  player.onCollideEnd("Swindle", (obj) => {
    if (aktivNPC === obj) {
      aktivNPC = null;
    }
  });

  player.onCollideUpdate("Tailgate", (obj) => {
    if (kelletailgate) {
      aktivNPC = obj;
    }
  });

  player.onCollideEnd("Tailgate", (obj) => {
    if (aktivNPC === obj) {
      aktivNPC = null;
    }
  });

  player.onCollideUpdate("Chromedome_and_Ratchet", (obj) => {
    if (kelleChromedome_and_Ratchet_combo) {
      aktivNPC = obj;
    }
  });

  player.onCollideEnd("Chromedome_and_Ratchet", (obj) => {
    if (aktivNPC === obj) {
      aktivNPC = null;
    }
  });

  player.onCollideUpdate("mentespont", (obj) => {
    aktivMentesPont = obj;
  });

  player.onCollideEnd("mentespont", (obj) => {
    if (aktivMentesPont === obj) {
      aktivMentesPont = null;
    }
  });

  player.onCollideUpdate("attack_tutorial_zone", () => {
    if (!player.tutorial) return;

    player.tutorial.showOnce(
      "attack",
      `${settings.controls.attack.toUpperCase()} - `+tutorial_data.data.tamad
    );
  });

  player.onCollideEnd("attack_tutorial_zone", () => {
    if (!player.tutorial) return;

    player.tutorial.hideHint();
  });

  k.onKeyPress(async (key) => {
    if (key !== settings.controls.interact) return;

    //NPC
    if (aktivNPC) {
      switch (current_map) {
        case "Kezdoszoba":
          if (kelleprowl) {
            if (aktivNPC && player.tutorial) {
              player.tutorial.markDone("npc_interact");
            }
            cutscene_kezeles(k, "prowl_chromedome_and_rewind");
            aktivMentesAdatok.data.mentett_adatok.NPC_interactions.Prowl = 1;
            kelleprowl = false;
          }
          break;

        case "Mitteous_Plateau":
          if (kelleChromedome_and_Ratchet_combo) {
            cutscene_kezeles(k, "tailgate_and_sky_idiots");
            aktivMentesAdatok.data.mentett_adatok.NPC_interactions.Chromedome_and_Ratchet = 1;
            kelleChromedome_and_Ratchet_combo = false;
          }
          break;

        case "Iacon":
          if (kelleswindle) {
            cutscene_kezeles(k, "swindle");
            aktivMentesAdatok.data.mentett_adatok.NPC_interactions.Swindle = 1;
            kelleswindle = false;
          }
          break;

        case "Medbay":
          if (kellerachet) {
            cutscene_kezeles(k, "rigor_morphis");
            aktivMentesAdatok.data.mentett_adatok.NPC_interactions.Ratchet = 1;
            kellerachet = false;
          }
          break;

        case "Leesos_hely":
          if (kelletailgate) {
            cutscene_kezeles(k, "tailgate_a_föld_alatt");
            aktivMentesAdatok.data.mentett_adatok.NPC_interactions.Tailgate = 1;
            kelletailgate = false;
          }
          break;

        default:
          console.log("Ismeretlen szoba");
          break;
      }
      return;
    }

    //mentés
    if (aktivMentesPont) {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        console.log("Nincs user! Nem lehet menteni.");
        return;
      }

      const savepointNev = aktivMentesPont.savepointNev;

      if (!savepointNev) {
        console.log("Nincs savepoint név a mentésponton");
        return;
      }

      if (aktivMentesAdatok) {
        aktivMentesAdatok.savepoint = savepointNev;
        aktivMentesAdatok.data.mentett_adatok.savepoint = savepointNev;
      }

      await TeljesMentesLetrehozo(
        user.id,
        mentesunk_idja,
        aktivMentesAdatok,
        k
      );

      mentes(k);

      localStorage.setItem("last_loaded_savepoint", savepointNev);
    }
  });

  function playerTamadasInditas() {
    if (player.tamad) return;
    if (player.letaranVan) return;
    if (player.dead) return;

    player.tamad = true;
    player.tamadasAblakNyitva = false;
    player.play("attack");

    k.wait(0.12, () => {
      if (!player.exists() || !player.tamad) return;

      player.tamadasAblakNyitva = true;

      const attackHitbox = k.add([
        k.pos(
          player.flipX ? player.pos.x + 18 : player.pos.x - 38,
          player.pos.y - 10
        ),
        k.rect(40, 35),
        k.area(),
        k.opacity(0),
        "player_attack_hitbox",
      ]);

      k.wait(0.12, () => {
        if (attackHitbox.exists()) {
          attackHitbox.destroy();
        }

        player.tamadasAblakNyitva = false;
      });
    });

    k.wait(0.45, () => {
      if (!player.exists()) return;
      player.tamad = false;
    });
  }

  function playerSlashTamadasInditas() {
    const slashUnlocked =
      aktivMentesAdatok?.data?.mentett_adatok?.ability_unlocked?.slash_attack === true;

    if (!slashUnlocked) return;
    if (player.slashCooldown > 0) {
      console.log("Slash még tölt:", player.slashCooldown.toFixed(1));
      return;
    }
    if (player.tamad) return;
    if (player.letaranVan) return;
    if (player.dead) return;

    player.slashCooldown = player.slashCooldownMax;

    player.tamad = true;
    player.play("slash_attack");

    const irany = player.flipX ? 1 : -1;

    const slash = k.add([
      k.sprite("player_slash"),
      k.pos(player.pos.x + irany * 35, player.pos.y - 10),
      k.anchor("center"),
      k.area(),
      k.move(k.vec2(irany, 0), 320),
      k.scale(-irany, 1),
      "player_slash_hitbox",
    ]);

    slash.damage = 3;
    slash.alreadyHit = false;

    if (slash.play) {
      slash.play("fly");
    }

    k.wait(0.6, () => {
      if (slash.exists()) {
        slash.destroy();
      }
    });

    k.wait(0.45, () => {
      if (!player.exists()) return;
      player.tamad = false;
    });
  }

  function playerDashInditas() {
    const dashUnlocked =
      aktivMentesAdatok?.data?.mentett_adatok?.ability_unlocked?.dash === true;

    if (!dashUnlocked) return;
    if (player.dashCooldown > 0) return;
    if (player.dashol) return;
    if (player.tamad) return;
    if (player.letaranVan) return;
    if (player.dead) return;
    if (player.menuNyitva || player.menu2Nyitva) return;

    player.dashol = true;
    player.dashCooldown = player.dashCooldownMax;

    const irany = player.flipX ? 1 : -1;

    if (player.vel) {
      player.vel.x = 0;
      player.vel.y = 0;
    }

    k.setGravity(0);

    const dashUpdate = k.onUpdate(() => {
      if (!player.exists() || player.dead) {
        dashUpdate.cancel();
        return;
      }

      player.move(irany * player.dashSpeed, 0);
    });

    k.wait(player.dashTime, () => {
      dashUpdate.cancel();

      if (!player.exists()) return;

      player.dashol = false;
      k.setGravity(GRAVITY);

      if (player.vel) {
        player.vel.x = 0;
        player.vel.y = 0;
      }
    });
  }

  k.onMousePress(() => {
    if (settings.controls.attack !== "left click") return;

    playerTamadasInditas();
  });

  k.onKeyPress((key) => {
    if (settings.controls.attack === "left click") return;
    if (key !== settings.controls.attack) return;

    playerTamadasInditas();
  });

  k.onKeyPress((key) => {
    if (key !== "q") return;

    playerSlashTamadasInditas();
  });

  k.onKeyPress("escape", async () => {
    const szoveg_adata = await fecthData(
      "http://127.0.0.1:3000/api/nyelv_alapjan_JSON_olvasas/" + settings.nyelv + "/in_game_menu.json"
    );

    In_game_menu(szoveg_adata.data, k, player);
  });

  k.onKeyPress((key) => {
    if (key !== "shift" && key !== "left shift") return;

    playerDashInditas();
  });

  player_mozgas_es_animacio_kezeles(player, k);

  return player;
}


async function player_mozgas_es_animacio_kezeles(player, k) {

  //A billenytűket majd dinamikusan kell kezelni.
  //Fine tuningolni kell a sebességet

  //ideiglenes double jump
  function doubleJumpFeloldva() {
    return (
      aktivMentesAdatok?.data?.mentett_adatok?.ability_unlocked?.double_jump === true
    );
  }

  function maxUgrasokSzama() {
    return doubleJumpFeloldva() ? 2 : 1;
  }

  let jumpsLeft = maxUgrasokSzama();

  if (player.isGrounded()) {
    jumpsLeft = maxUgrasokSzama();
  };

  k.onKeyPress((key) => { //Ezt nem szabad az OnUpdate-ba rakni, mert akkor minden frame-ben megpróbál ugrani a játékos, ha lenyomva tartja a gombot és megszívjuk
    if (key !== settings.controls.jump) return;

    if (player.letaranVan) {
      if (player.tutorial) {
        player.tutorial.markDone("ladder_jump");
      }

      player.letaranVan = false;
      k.setGravity(GRAVITY);

      if (player.vel) {
        player.vel.x = 0;
        player.vel.y = 0;
      }

      player.jump(JUMP_FORCE);
      return;
    }


    if (player.isGrounded()) {
      player.jump(JUMP_FORCE);
      jumpsLeft = maxUgrasokSzama() - 1;
    } else if (jumpsLeft > 0) {
      player.jump(JUMP_FORCE);
      jumpsLeft--;
    }
  });

  let heal_cooldown=1000;

  k.onUpdate(async () => {
    //Optimalizált mozgás (Remélem ez így jó lesz c:)
    if (player.dead) return;

    if (
      player.tutorial &&
      !player.tutorial.isDone("movement") &&
      (k.isKeyDown(settings.controls.forward) || k.isKeyDown(settings.controls.back))
    ) {
      player.tutorial.markDone("movement");
    }

    if (player.slashCooldown > 0) {
      player.slashCooldown -= k.dt();

      if (player.slashCooldown < 0) {
        player.slashCooldown = 0;
      }
    }

    if (player.slashCooldown > 0) {
      player.slashCooldown -= k.dt();

      if (player.slashCooldown < 0) {
        player.slashCooldown = 0;
      }
    }

    if (player.menuNyitva || player.menu2Nyitva) {
      if (player.vel) {
        player.vel.x = 0;
        player.vel.y = 0;
      }

      k.setGravity(0);
      return;
    } else {
      k.setGravity(GRAVITY);
    }

    if (player.knockbackTimer > 0) {
      player.knockbackTimer -= k.dt();

      player.move(player.knockbackX, player.knockbackY);

      player.knockbackX *= 0.88;
      player.knockbackY *= 0.92;
    }

    let moveX = 0;
    let moveY = 0;

    if (player.dashol) {
      return;
    }

    if (player.tamad) {
      return;
    }

    if (player.letaranVan) {
      const climbSpeed = player.letraSebesseg;

      k.setGravity(0);

      if (
        player.tutorial &&
        !player.tutorial.isDone("ladder_climb") &&
        (k.isKeyDown("w") || k.isKeyDown("s"))
      ) {
        player.tutorial.markDone("ladder_climb");

         const tutorial_data = await fecthData(
        "http://127.0.0.1:3000/api/nyelv_alapjan_JSON_olvasas/" +
          settings.nyelv +
          "/tutorial.json",);

        player.tutorial.showOnce(
          "ladder_jump",
          `${settings.controls.jump.toUpperCase()} - `+tutorial_data.data.jump
        );
      }

      if (player.aktivLetra) {
        player.pos.x = player.aktivLetra.pos.x + player.aktivLetra.letraWidth / 2;
      }

      if (player.vel) {
        player.vel.x = 0;
        player.vel.y = 0;
      }

      if (player.aktivLetra) {
        const playerHalfHeight = 15;
        const letraTop = player.aktivLetra.pos.y + playerHalfHeight;
        const letraBottom = player.aktivLetra.pos.y + player.aktivLetra.letraHeight - playerHalfHeight;

        if (k.isKeyDown("w")) { //Ezt áttenni dinamikussá
          player.pos.y -= climbSpeed * k.dt();
        }

        if (k.isKeyDown("s")) {
          player.pos.y += climbSpeed * k.dt();
        }

        if (player.pos.y < letraTop) {
          player.pos.y = letraTop;
        }

        if (player.pos.y > letraBottom) {
          player.pos.y = letraBottom;
        }
      }

      let targetAnim = "idle";
      if (k.isKeyDown("w") || k.isKeyDown("s")) {
        targetAnim = "run";
      }

      if (player.curAnim() !== targetAnim) {
        player.play(targetAnim);
      }

      return;
    }

    if (player.hp < player.maxHp) {
        heal_cooldown=gyogyitas(player,1, heal_cooldown);
      }

    k.setGravity(GRAVITY);

    if (k.isKeyDown(settings.controls.forward)) {
      player.flipX = true;
      moveX += SPEED;
    }
    if (k.isKeyDown(settings.controls.back)) {
      player.flipX = false;
      moveX -= SPEED;
    }

    if (player.isGrounded()) {
      jumpsLeft = maxUgrasokSzama();
    }


    if (k.isKeyDown("up")) {
      moveY -= SPEED;
    }
    if (k.isKeyDown("down")) {
      moveY += SPEED;
    }

    player.move(moveX, moveY);

    //Animációk kezelése

    let targetAnim = "idle";

    if (player.serul) {
      targetAnim = "hurt";
    }
    else if (!player.isGrounded()) {
      targetAnim = "jump";
    }
    else if (moveX !== 0) {
      targetAnim = "run";
    }

    if (player.curAnim() !== targetAnim) {
      player.play(targetAnim);
    }

  });


}

function In_game_menu(szoveg, k, player) {

  player.menuNyitva = true;

  const tarolo = document.getElementById("in_game_menu_tarolo");

  if (!tarolo) {
    console.error("Nincs in_game_menu_tarolo div!");
    return;
  }

  // Ha már van nyitva modal, ne hozzon létre még egyet
  if (document.getElementById("in_game_menu_modal")) {
    return;
  }

  const legkulsobbmodaldiv = document.createElement("div");
  const kulsomodaldiv = document.createElement("div");
  const modaldiv = document.createElement("div");
  const jatek_menu_modal_head = document.createElement("div");
  const jatek_menu_modal_body = document.createElement("div");
  const jatek_menu_modal_foot = document.createElement("div");

  legkulsobbmodaldiv.id = "in_game_menu_modal";

  // Láthatóvá tesszük Bootstrap nélkül is
  legkulsobbmodaldiv.style.position = "fixed";
  legkulsobbmodaldiv.style.inset = "0";
  legkulsobbmodaldiv.style.display = "flex";
  legkulsobbmodaldiv.style.justifyContent = "center";
  legkulsobbmodaldiv.style.alignItems = "center";
  legkulsobbmodaldiv.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  legkulsobbmodaldiv.style.zIndex = "999998";

  kulsomodaldiv.style.width = "500px";
  kulsomodaldiv.style.maxWidth = "90vw";

  modaldiv.style.background = "#111";
  modaldiv.style.border = "3px solid #00cfff";
  modaldiv.style.borderRadius = "16px";
  modaldiv.style.padding = "20px";
  modaldiv.style.color = "white";
  modaldiv.style.boxShadow = "0 0 25px #00cfff";

  jatek_menu_modal_head.style.marginBottom = "20px";
  jatek_menu_modal_body.style.display = "flex";
  jatek_menu_modal_body.style.flexDirection = "column";
  jatek_menu_modal_body.style.gap = "12px";
  jatek_menu_modal_foot.style.marginTop = "20px";

  const h4 = document.createElement("h4");
  h4.innerText = szoveg.valassz || "Válassz";
  h4.style.margin = "0";
  h4.style.textAlign = "center";

  jatek_menu_modal_head.appendChild(h4);

  const beallitasGomb = document.createElement("button");
  beallitasGomb.classList.add("menu-gomb", "gombok");
  beallitasGomb.innerText = szoveg.beallitasok || "Beállítások";

  beallitasGomb.addEventListener("click", async () => {

    jatek_menu_modal_body.innerHTML = "";

    const userData = JSON.parse(localStorage.getItem("user")) || { id: 0 };

    await beallitasMenuLetrehoz(
      userData.id,
      jatek_menu_modal_body,
      true
    );
  });

  jatek_menu_modal_body.appendChild(beallitasGomb);

  const kilepesGomb = document.createElement("button");
  kilepesGomb.classList.add("menu-gomb", "gombok");
  kilepesGomb.innerText = szoveg.kilepes || "Kilépés";

  kilepesGomb.addEventListener("click", async () => {
    biztos_kilep(szoveg, k, player);
  });

  jatek_menu_modal_body.appendChild(kilepesGomb);

  const visszaGomb = document.createElement("button");
  visszaGomb.classList.add("menu-gomb", "gombok");
  visszaGomb.innerText = szoveg.vissza || "Vissza";

  visszaGomb.addEventListener("click", async () => {

    player.menuNyitva = false;
    k.setGravity(GRAVITY);

    if (player.vel) {
      player.vel.x = 0;
      player.vel.y = 0;
    }

    legkulsobbmodaldiv.remove();

    const canvas = document.querySelector("canvas");
    if (canvas) {
      canvas.tabIndex = 0;
      canvas.focus();
    }
  });

  jatek_menu_modal_foot.appendChild(visszaGomb);

  modaldiv.appendChild(jatek_menu_modal_head);
  modaldiv.appendChild(jatek_menu_modal_body);
  modaldiv.appendChild(jatek_menu_modal_foot);

  kulsomodaldiv.appendChild(modaldiv);
  legkulsobbmodaldiv.appendChild(kulsomodaldiv);

  tarolo.appendChild(legkulsobbmodaldiv);
}

function biztos_kilep(szoveg, k, player) { //Megkérdezzük, hogy biztosan ki akar-e lépni a játékból, mert ha igen akkor minden mentés nélkül elveszik, amit eddig csinált.

  const legkulsobbmodaldiv_alap = document.getElementById("in_game_menu_modal");

  if (!legkulsobbmodaldiv_alap) {
    console.error("Nincs in_game_menu_modal div!");
    return;
  }

  legkulsobbmodaldiv_alap.remove();

  player.menuNyitva = false;
  player.menu2Nyitva = true;

  const tarolo = document.getElementById("kilep_menu_tarolo");

  if (!tarolo) {
    console.error("Nincs kilep_menu_tarolo div!");
    return;
  } else {
    tarolo.tabIndex = 0;
    tarolo.focus();
  }

  // Ha már van nyitva modal, ne hozzon létre még egyet
  if (document.getElementById("in_game_menu_modal_kilep")) {
    return;
  }

  const legkulsobbmodaldiv = document.createElement("div");
  const kulsomodaldiv = document.createElement("div");
  const modaldiv = document.createElement("div");
  const jatek_menu_modal_head = document.createElement("div");
  const jatek_menu_modal_body = document.createElement("div");
  const jatek_menu_modal_foot = document.createElement("div");

  legkulsobbmodaldiv.id = "in_game_menu_modal_kilep";

  // Láthatóvá tesszük Bootstrap nélkül is
  legkulsobbmodaldiv.style.position = "fixed";
  legkulsobbmodaldiv.style.inset = "0";
  legkulsobbmodaldiv.style.display = "flex";
  legkulsobbmodaldiv.style.justifyContent = "center";
  legkulsobbmodaldiv.style.alignItems = "center";
  legkulsobbmodaldiv.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  legkulsobbmodaldiv.style.zIndex = "999997";

  kulsomodaldiv.style.width = "500px";
  kulsomodaldiv.style.maxWidth = "90vw";

  modaldiv.style.background = "#111";
  modaldiv.style.border = "3px solid #00cfff";
  modaldiv.style.borderRadius = "16px";
  modaldiv.style.padding = "20px";
  modaldiv.style.color = "white";
  modaldiv.style.boxShadow = "0 0 25px #00cfff";

  jatek_menu_modal_head.style.marginBottom = "20px";
  jatek_menu_modal_body.style.display = "flex";
  jatek_menu_modal_body.style.flexDirection = "column";
  jatek_menu_modal_body.style.gap = "12px";
  jatek_menu_modal_foot.style.marginTop = "20px";

  const h4 = document.createElement("h4");
  h4.innerText = szoveg.biztos || "Biztosan ki akarsz lépni?";
  h4.style.margin = "0";
  h4.style.textAlign = "center";

  jatek_menu_modal_head.appendChild(h4);

  const h3 = document.createElement("h3");
  h3.innerText = szoveg.figyelem || "Figyelem! A játék nem fog mentésre kerülni!!!";

  jatek_menu_modal_body.appendChild(h3);

  const kilepesGomb = document.createElement("button");
  kilepesGomb.classList.add("menu-gomb", "gombok");
  kilepesGomb.innerText = szoveg.yes || "Igen";

  kilepesGomb.addEventListener("click", async () => {
    kilep_jatekbol(k);
  });

  jatek_menu_modal_body.appendChild(kilepesGomb);

  const visszaGomb = document.createElement("button");
  visszaGomb.classList.add("menu-gomb", "gombok");
  visszaGomb.innerText = szoveg.no || "Nem";

  visszaGomb.addEventListener("click", async () => {
    player.menu2Nyitva = false;

    if (!legkulsobbmodaldiv) {
      console.error("Nincs kilep_div!");
      return;
    }

    legkulsobbmodaldiv.remove();

    In_game_menu(szoveg, k, player);
  });

  jatek_menu_modal_foot.appendChild(visszaGomb);

  modaldiv.appendChild(jatek_menu_modal_head);
  modaldiv.appendChild(jatek_menu_modal_body);
  modaldiv.appendChild(jatek_menu_modal_foot);

  kulsomodaldiv.appendChild(modaldiv);
  legkulsobbmodaldiv.appendChild(kulsomodaldiv);

  tarolo.appendChild(legkulsobbmodaldiv);
}

export async function kilep_jatekbol(k) {
  k.quit();
  startGame();
  szoba_zene_beallitas("the_humbling_river");
}