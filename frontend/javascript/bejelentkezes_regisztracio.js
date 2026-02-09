import { fecthData} from "./index.js";
import { nyelv } from "./options.js";

export async function modalLetrehoz() {
    const dataNyelv = await fecthData("http://127.0.0.1:3000/api/nyelv_alapjan_JSON_olvasas/" + nyelv + "/bejelentkezes_regisztracio.json");

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
        const jelszo =  loginPass.value.trim();

        if(!usernev || !jelszo){
            alert(dataNyelv.data.loginAlert[0]);
            return;
        }

        const res = await fetch('http://127.0.0.1:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({usernev, jelszo})
        });

        const data = await res.json();

        if(data.success){
            alert(dataNyelv.data.loginAlert[1]);
            modal.style.display = "none";

            //felhasználó adatainak mentése localstorage-ba
            localStorage.setItem('user', JSON.stringify({
                id: data.userId,
                usernev: data.usernev,
                jog: data.userJogId
            }));
        }else{
            alert(data.message);
        }
    };

    const toRegister = document.createElement("p");
    toRegister.innerHTML = `${dataNyelv.data.logToReg[0]} <span style="color:#4ea3ff;cursor:pointer">${dataNyelv.data.logToReg[1]}</span>`;
    toRegister.style.cursor = "pointer";

    loginDiv.append(loginCim, loginUser, loginPass, loginGomb, toRegister);

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

    const regGomb = document.createElement("button");
    regGomb.textContent = dataNyelv.data.regInput[4];
    regGomb.style.width = "100%";
    regGomb.style.marginBottom = "10px";
    regGomb.onclick = async () => {

        const email = regEmail.value.trim();
        const usernev = regUser.value.trim();
        const jelszo = regPass.value.trim();

        if(!email || !usernev || !jelszo){
            alert(dataNyelv.data.regAlert[0]);
            return;
        }

        const res = await fetch("http://127.0.0.1:3000/api/register", {
           method: 'POST',
           headers: {"Content-Type": "application/json"},
           body: JSON.stringify({usernev, jelszo, email})
        });

        const data = await res.json();

        if(data.success){
            alert(dataNyelv.data.regAlert[1]);
            modal.style.display = "none";
        }else{
            alert(data.message);
        }
    };

    const toLogin = document.createElement("p");
    toLogin.innerHTML = `${dataNyelv.data.regToLog[0]} <span style="color:#4ea3ff;cursor:pointer">${dataNyelv.data.regToLog[1]}</span>`;
    toLogin.style.cursor = "pointer";

    registerDiv.append(regCim, regEmail ,regUser, regPass, regGomb, toLogin);

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
