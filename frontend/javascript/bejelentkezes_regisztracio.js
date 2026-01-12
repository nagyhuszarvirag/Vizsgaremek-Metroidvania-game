import { fecthData, masikJSMeghivasa } from "./index.js";

let nyelv = "hungarian"; //alapértelmezett nyelv

export function createAuthModal() {
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

    const loginTitle = document.createElement("h2");
    loginTitle.textContent = "Bejelentkezés";

    const loginUser = document.createElement("input");
    loginUser.placeholder = "Felhasználónév";
    loginUser.style.width = "100%";
    loginUser.style.marginBottom = "10px";
    loginUser.style.padding = "5px";

    const loginPass = document.createElement("input");
    loginPass.type = "password";
    loginPass.placeholder = "Jelszó";
    loginPass.style.width = "100%";
    loginPass.style.marginBottom = "10px";
    loginPass.style.padding = "5px";

    const loginBtn = document.createElement("button");
    loginBtn.textContent = "Belépés";
    loginBtn.style.width = "100%";
    loginBtn.style.marginBottom = "10px";
    loginBtn.onclick = () => {
        alert(`Bejelentkezés: ${loginUser.value}`);
        modal.style.display = "none";
    };

    const toRegister = document.createElement("p");
    toRegister.innerHTML = `Nincs fiókod? <span style="color:#4ea3ff;cursor:pointer">Regisztráció</span>`;
    toRegister.style.cursor = "pointer";

    loginDiv.append(loginTitle, loginUser, loginPass, loginBtn, toRegister);

    //regisztráció
    const registerDiv = document.createElement("div");
    registerDiv.style.display = "none";

    const regTitle = document.createElement("h2");
    regTitle.textContent = "Regisztráció";

    const regEmail = document.createElement("input");
    regEmail.type = "email";
    regEmail.placeholder = "E-mail";
    regEmail.style.width = "100%";
    regEmail.style.marginBottom = "10px";
    regEmail.style.padding = "5px";

    const regUser = document.createElement("input");
    regUser.placeholder = "Felhasználónév";
    regUser.style.width = "100%";
    regUser.style.marginBottom = "10px";
    regUser.style.padding = "5px";

    const regPass = document.createElement("input");
    regPass.type = "password";
    regPass.placeholder = "Jelszó";
    regPass.style.width = "100%";
    regPass.style.marginBottom = "10px";
    regPass.style.padding = "5px";

    const regBtn = document.createElement("button");
    regBtn.textContent = "Regisztráció";
    regBtn.style.width = "100%";
    regBtn.style.marginBottom = "10px";
    regBtn.onclick = () => {
        alert(`Regisztráció: ${regUser.value}`);
        modal.style.display = "none";
    };

    const toLogin = document.createElement("p");
    toLogin.innerHTML = `Van már fiókod? <span style="color:#4ea3ff;cursor:pointer">Bejelentkezés</span>`;
    toLogin.style.cursor = "pointer";

    registerDiv.append(regTitle, regEmail ,regUser, regPass, regBtn, toLogin);

    content.append(close, loginDiv, registerDiv);
    modal.appendChild(content);
    document.body.appendChild(modal);

    //események
    close.onclick = () => (modal.style.display = "none");

    modal.onclick = (e) => {
        if (e.target === modal) modal.style.display = "none";
    };

    toRegister.querySelector("span").onclick = () => {
        loginDiv.style.display = "none";
        registerDiv.style.display = "block";
    };

    toLogin.querySelector("span").onclick = () => {
        registerDiv.style.display = "none";
        loginDiv.style.display = "block";
    };

    return modal;
}
