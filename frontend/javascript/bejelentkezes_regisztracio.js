import { fecthData } from "./index.js";
import { settings } from "./options.js";

export async function modalLetrehoz() {
  const dataNyelv = await fecthData(
    "http://127.0.0.1:3000/api/nyelv_alapjan_JSON_olvasas/" +
      settings.nyelv +
      "/bejelentkezes_regisztracio.json",
  );

  const modal = document.createElement("div");
  modal.id = "authModal";
  modal.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.6);
    display: none;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  `;

  //tartalom
  const content = document.createElement("div");
  content.style.cssText = `
    background: #222;
    padding: 20px;
    border-radius: 10px;
    width: 300px;
    color: white;
    position: relative;
    box-shadow: 0 0 10px black;
  `;

  //bezárás
  const close = document.createElement("span");
  close.textContent = "×";
  close.style.cssText = `
    position: absolute;
    right: 12px;
    top: 8px;
    cursor: pointer;
    font-size: 22px;
  `;

  //bejelentkezés
  const loginDiv = document.createElement("div");

  const loginCim = document.createElement("h2");
  loginCim.textContent = dataNyelv.data.loginInput[0];

  const loginUser = document.createElement("input");
  loginUser.placeholder = dataNyelv.data.loginInput[1];
  loginUser.style.width = "100%";
  loginUser.style.marginBottom = "10px";
  loginUser.style.padding = "5px";

  const loginPass = document.createElement("input");
  loginPass.type = "password";
  loginPass.placeholder = dataNyelv.data.loginInput[2];
  loginPass.style.width = "100%";
  loginPass.style.marginBottom = "10px";
  loginPass.style.padding = "5px";

  const loginGomb = document.createElement("button");
  loginGomb.textContent = dataNyelv.data.loginInput[3];
  loginGomb.style.width = "100%";
  loginGomb.style.marginBottom = "10px";
  loginGomb.onclick = async () => {
    const usernev = loginUser.value.trim();
    const jelszo = loginPass.value.trim();

    if (!usernev || !jelszo) {
      alert(dataNyelv.data.loginAlert[0]);
      return;
    }

    const res = await fetch("http://127.0.0.1:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usernev, jelszo }),
    });

    const data = await res.json();

    if (data.success) {
      alert(dataNyelv.data.loginAlert[1]);
      sikeresBelepes(data);

      if (data.jelszoCsereKotelezo) {
        kotelezoJelszoCsereModal(data.userId);
      }
    } else {
      alert(data.message);
    }
  };

  const forgotPass = document.createElement("p");
  forgotPass.textContent = dataNyelv.data.forgotPass;
  forgotPass.style.cursor = "pointer";
  forgotPass.style.color = "#4ea3ff";
  forgotPass.style.marginBottom = "10px";

  const toRegister = document.createElement("p");
  toRegister.innerHTML = `${dataNyelv.data.logToReg[0]} <span style="color:#4ea3ff;cursor:pointer">${dataNyelv.data.logToReg[1]}</span>`;
  toRegister.style.cursor = "pointer";

  loginDiv.append(
    loginCim,
    loginUser,
    loginPass,
    loginGomb,
    forgotPass,
    toRegister,
  );

  //regisztráció
  const registerDiv = document.createElement("div");
  registerDiv.style.display = "none";

  const regCim = document.createElement("h2");
  regCim.textContent = dataNyelv.data.regInput[0];

  const regEmail = document.createElement("input");
  regEmail.type = "email";
  regEmail.placeholder = dataNyelv.data.regInput[1];
  regEmail.style.width = "100%";
  regEmail.style.marginBottom = "10px";
  regEmail.style.padding = "5px";

  const regUser = document.createElement("input");
  regUser.placeholder = dataNyelv.data.regInput[2];
  regUser.style.width = "100%";
  regUser.style.marginBottom = "10px";
  regUser.style.padding = "5px";

  const regPass = document.createElement("input");
  regPass.type = "password";
  regPass.placeholder = dataNyelv.data.regInput[3];
  regPass.style.width = "100%";
  regPass.style.marginBottom = "10px";
  regPass.style.padding = "5px";

  //jelszó követelmények lista
  const passwordInfo = document.createElement("div");
  passwordInfo.style.fontSize = "12px";
  passwordInfo.style.marginBottom = "10px";

  const requirements = [
    { text: dataNyelv.data.pasReq[0], regex: /.{8,}/ },
    { text: dataNyelv.data.pasReq[1], regex: /[A-Z]/ },
    { text: dataNyelv.data.pasReq[2], regex: /\d/ },
    {
      text: dataNyelv.data.pasReq[3],
      regex: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
    },
  ];

  requirements.forEach((req) => {
    const p = document.createElement("div");
    p.textContent = req.text;
    p.style.color = "red";
    p.dataset.regex = req.regex;
    passwordInfo.appendChild(p);
  });

  //valós idejű jelszó ellenőrzés
  regPass.addEventListener("input", () => {
    const value = regPass.value;
    const items = passwordInfo.children;

    requirements.forEach((req, index) => {
      if (req.regex.test(value)) {
        items[index].style.color = "lime";
      } else {
        items[index].style.color = "red";
      }
    });
  });

  const regGomb = document.createElement("button");
  regGomb.textContent = dataNyelv.data.regInput[4];
  regGomb.style.width = "100%";
  regGomb.style.marginBottom = "10px";
  regGomb.onclick = async () => {
    const email = regEmail.value.trim();
    const usernev = regUser.value.trim();
    const jelszo = regPass.value.trim();

    if (!email || !usernev || !jelszo) {
      alert(dataNyelv.data.regAlert[0]);
      return;
    }

    //jelszó ellenőrzése mégegyszer
    const allValid = requirements.every((req) => req.regex.test(jelszo));

    if (!allValid) {
      alert(dataNyelv.data.regAlert[3]);
      return;
    }

    //email regex ellenőrzés
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      alert(dataNyelv.data.regAlert[2]);
      return;
    }

    const res = await fetch("http://127.0.0.1:3000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usernev, jelszo, email }),
    });

    const data = await res.json();

    if (data.success) {
      alert(dataNyelv.data.regAlert[1]);
      sikeresBelepes(data);
    } else {
      alert(data.message);
    }
  };

  const toLogin = document.createElement("p");
  toLogin.innerHTML = `${dataNyelv.data.regToLog[0]} <span style="color:#4ea3ff;cursor:pointer">${dataNyelv.data.regToLog[1]}</span>`;
  toLogin.style.cursor = "pointer";

  registerDiv.append(
    regCim,
    regEmail,
    regUser,
    regPass,
    passwordInfo,
    regGomb,
    toLogin,
  );

  content.append(close, loginDiv, registerDiv);
  modal.appendChild(content);
  document.body.appendChild(modal);

  //események
  close.onclick = () => {
    modal.style.display = "none";
    mezokUrites();
    registerDiv.style.display = "none";
    loginDiv.style.display = "block";
  };

  forgotPass.onclick = () => {
    elfelejtettJelszoModal();
  };

  toRegister.querySelector("span").onclick = () => {
    loginDiv.style.display = "none";
    mezokUrites();
    registerDiv.style.display = "block";
  };

  toLogin.querySelector("span").onclick = () => {
    registerDiv.style.display = "none";
    mezokUrites();
    loginDiv.style.display = "block";
  };

  //segédfüggvények
  function mezokUrites() {
    loginUser.value = "";
    loginPass.value = "";
    regEmail.value = "";
    regUser.value = "";
    regPass.value = "";
  }

  function sikeresBelepes(data) {
    mezokUrites();
    modal.style.display = "none";
    registerDiv.style.display = "none";
    loginDiv.style.display = "block";

    //felhasználó adatainak mentése localstorage-ba
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: data.userId,
        usernev: data.usernev,
        jog: data.userJogId,
      }),
    );

    //kijelentkezés gomb cseréhez kell
    window.dispatchEvent(
      new CustomEvent("authChanged", {
        detail: { loggedIn: true },
      }),
    );
  }

  function elfelejtettJelszoModal() {
    const modal2 = document.createElement("div");
    modal2.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;

    const box = document.createElement("div");
    box.style.cssText = `
        background: #222;
        padding: 20px;
        border-radius: 10px;
        width: 300px;
        color: white;
    `;

    const cim = document.createElement("h3");
    cim.textContent = dataNyelv.data.forgotTitle;

    const emailInput = document.createElement("input");
    emailInput.type = "email";
    emailInput.placeholder = dataNyelv.data.regInput[1];
    emailInput.style.width = "100%";
    emailInput.style.marginBottom = "10px";
    emailInput.style.padding = "5px";

    const kuldesGomb = document.createElement("button");
    kuldesGomb.textContent = dataNyelv.data.forgotSend;
    kuldesGomb.style.width = "100%";
    kuldesGomb.style.marginBottom = "10px";

    const bezar = document.createElement("button");
    bezar.textContent = dataNyelv.data.forgotClose;
    bezar.style.width = "100%";

    kuldesGomb.onclick = async () => {
      const email = emailInput.value.trim();

      if (!email) {
        alert(dataNyelv.data.forgotAlert);
        return;
      }

      const res = await fetch("http://127.0.0.1:3000/api/elfelejtett-jelszo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        alert(data.message);
        modal2.remove();
      } else {
        alert(data.message);
      }
    };

    bezar.onclick = () => modal2.remove();

    box.append(cim, emailInput, kuldesGomb, bezar);
    modal2.appendChild(box);
    document.body.appendChild(modal2);
  }

  function kotelezoJelszoCsereModal(userId) {
    const modal3 = document.createElement("div");
    modal3.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10001;
    `;

    const box = document.createElement("div");
    box.style.cssText = `
        background: #222;
        padding: 20px;
        border-radius: 10px;
        width: 320px;
        color: white;
    `;

    const cim = document.createElement("h3");
    cim.textContent = dataNyelv.data.changeTitle;

    const ujJelszo = document.createElement("input");
    ujJelszo.type = "password";
    ujJelszo.placeholder = dataNyelv.data.changeInput[0];
    ujJelszo.style.width = "100%";
    ujJelszo.style.marginBottom = "10px";
    ujJelszo.style.padding = "5px";

    const ujJelszo2 = document.createElement("input");
    ujJelszo2.type = "password";
    ujJelszo2.placeholder = dataNyelv.data.changeInput[1];
    ujJelszo2.style.width = "100%";
    ujJelszo2.style.marginBottom = "10px";
    ujJelszo2.style.padding = "5px";

    const mentes = document.createElement("button");
    mentes.textContent = dataNyelv.data.changeInput[2];
    mentes.style.width = "100%";

    mentes.onclick = async () => {
      const j1 = ujJelszo.value.trim();
      const j2 = ujJelszo2.value.trim();

      if (!j1 || !j2) {
        alert(dataNyelv.data.changeAlert[0]);
        return;
      }

      if (j1 !== j2) {
        alert(dataNyelv.data.changeAlert[1]);
        return;
      }

      const res = await fetch(
        `http://127.0.0.1:3000/api/user/jelszo-csere/${userId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ujJelszo: j1 }),
        },
      );

      const data = await res.json();

      if (data.success) {
        alert(data.message);
        modal3.remove();
      } else {
        alert(data.message);
      }
    };

    box.append(cim, ujJelszo, ujJelszo2, mentes);
    modal3.appendChild(box);
    document.body.appendChild(modal3);
  }

  return modal;
}
