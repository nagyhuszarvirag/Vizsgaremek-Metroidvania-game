import { oldalTakarito, dekor_vonal_blokkal, visszaGomb, fecthData } from "./index.js";
import { nyelv } from "./options.js";

export async function adminPanelLetrehoz() {

    oldalTakarito();

    const szoveg = await fecthData("http://127.0.0.1:3000/api/nyelv_alapjan_JSON_olvasas/" + nyelv + "/admin_panel.json");

    console.log(szoveg);

    const content = document.createElement("div");
    content.classList.add("container", "mt-5", "beallitas_menu");

    const cim = document.createElement("h1");
    cim.textContent = szoveg.data.title;
    cim.style.textAlign = "center";

    content.appendChild(cim);
    content.appendChild(dekor_vonal_blokkal());

    const menuSor = document.createElement("div");
    menuSor.style.display = "flex";
    menuSor.style.gap = "10px";
    menuSor.style.marginBottom = "20px";

    const usersTabBtn = document.createElement("button");
    usersTabBtn.textContent = szoveg.data.usersTab;
    usersTabBtn.classList.add("gombok");

    const resetTabBtn = document.createElement("button");
    resetTabBtn.textContent = szoveg.data.resetTab;
    resetTabBtn.classList.add("gombok");

    menuSor.appendChild(usersTabBtn);
    menuSor.appendChild(resetTabBtn);
    content.appendChild(menuSor);

    const panelBody = document.createElement("div");
    content.appendChild(panelBody);

    async function renderUsersPanel() {
        panelBody.innerHTML = "";

        const res = await fetch("http://127.0.0.1:3000/api/admin/users");
        const data = await res.json();

        if (!data.success) {

            content.textContent = szoveg.data.hiba[0];
            document.body.appendChild(content);
            return;

        }

        const scrollDiv = document.createElement("div");
        scrollDiv.classList.add("scrolldiv");

        const tabla = document.createElement("table");
        tabla.style.cssText = `
width:100%;
border-collapse:collapse;
color:white;
`;

        const fejlec = document.createElement("tr");

        [
            szoveg.data.id,
            szoveg.data.users,
            szoveg.data.email,
            szoveg.data.jog,
            szoveg.data.muveletek
        ].forEach(szoveg => {

            const th = document.createElement("th");

            th.textContent = szoveg;
            th.style.cssText = `
padding:10px;
text-align:left;
border-bottom:2px solid #00cfff;
`;

            fejlec.appendChild(th);

        });

        tabla.appendChild(fejlec);

        data.data.forEach(user => {

            const sor = document.createElement("tr");

            const id = document.createElement("td");
            id.textContent = user.user_id;
            id.style.cssText = `
padding:8px;
border-bottom:1px solid rgba(255,255,255,0.2);
`;
            sor.appendChild(id);

            const username = document.createElement("td");
            const usernameInput = document.createElement("input");
            usernameInput.value = user.username;
            username.appendChild(usernameInput);
            username.style.cssText = `
padding:8px;
border-bottom:1px solid rgba(255,255,255,0.2);
`;

            sor.appendChild(username);

            const email = document.createElement("td");
            const emailInput = document.createElement("input");
            emailInput.value = user.user_email;
            email.appendChild(emailInput);
            email.style.cssText = `
padding:8px;
border-bottom:1px solid rgba(255,255,255,0.2);
`;

            sor.appendChild(email);

            const jog = document.createElement("td");
            const jogInput = document.createElement("input");
            jogInput.value = user.user_jog_id;
            jog.appendChild(jogInput);
            jog.style.cssText = `
padding:8px;
border-bottom:1px solid rgba(255,255,255,0.2);
`;

            sor.appendChild(jog);

            const muvelet = document.createElement("td");

            const saveBtn = document.createElement("button");
            saveBtn.textContent = szoveg.data.mentes;
            saveBtn.classList.add("gombok");
            saveBtn.onclick = async () => {

                await fetch(`http://127.0.0.1:3000/api/user/${user.user_id}`, {

                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        username: usernameInput.value,
                        user_email: emailInput.value,
                        user_jog_id: jogInput.value
                    })

                });

                alert(szoveg.data.alert);
            };

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = szoveg.data.torles;
            deleteBtn.classList.add("gombok");
            deleteBtn.onclick = async () => {

                if (!confirm(szoveg.data.confirm)) return;

                await fetch(`http://127.0.0.1:3000/api/user/${user.user_id}`, {

                    method: "DELETE"

                });

                adminPanelLetrehoz();
            };

            muvelet.appendChild(saveBtn);
            muvelet.appendChild(deleteBtn);
            sor.appendChild(muvelet);
            tabla.appendChild(sor);
        });

        scrollDiv.appendChild(tabla);
        panelBody.appendChild(scrollDiv);
    }

    async function renderResetRequestsPanel() {
        panelBody.innerHTML = "";

        const res = await fetch("http://127.0.0.1:3000/api/admin/elfelejtett-jelszo-keresek");
        const data = await res.json();

        if (!data.success) {
            panelBody.textContent = szoveg.data.hiba[1];
            return;
        }

        const scrollDiv = document.createElement("div");
        scrollDiv.classList.add("scrolldiv");

        const tabla = document.createElement("table");
        tabla.style.cssText = `
      width:100%;
      border-collapse:collapse;
      color:white;
    `;

        const fejlec = document.createElement("tr");

        [
            szoveg.data.reqId,
            szoveg.data.email,
            szoveg.data.datum,
            szoveg.data.allapot,
            szoveg.data.muveletek
        ].forEach(szovegElem => {
            const th = document.createElement("th");

            th.textContent = szovegElem;
            th.style.cssText = `
        padding:10px;
        text-align:left;
        border-bottom:2px solid #00cfff;
      `;

            fejlec.appendChild(th);
        });

        tabla.appendChild(fejlec);

        data.data.forEach(keres => {
            const sor = document.createElement("tr");

            const id = document.createElement("td");
            id.textContent = keres.keres_id;
            id.style.cssText = `
        padding:8px;
        border-bottom:1px solid rgba(255,255,255,0.2);
      `;
            sor.appendChild(id);

            const email = document.createElement("td");
            email.textContent = keres.user_email;
            email.style.cssText = `
        padding:8px;
        border-bottom:1px solid rgba(255,255,255,0.2);
      `;
            sor.appendChild(email);

            const datum = document.createElement("td");
            datum.textContent = keres.keres_datum;
            datum.style.cssText = `
        padding:8px;
        border-bottom:1px solid rgba(255,255,255,0.2);
      `;
            sor.appendChild(datum);

            const allapot = document.createElement("td");
            allapot.textContent = keres.allapot;
            allapot.style.cssText = `
        padding:8px;
        border-bottom:1px solid rgba(255,255,255,0.2);
      `;
            sor.appendChild(allapot);

            const muvelet = document.createElement("td");
            muvelet.style.cssText = `
        padding:8px;
        border-bottom:1px solid rgba(255,255,255,0.2);
      `;

            const resetBtn = document.createElement("button");
            resetBtn.textContent = szoveg.data.resetPass;
            resetBtn.classList.add("gombok");

            resetBtn.onclick = async () => {
                if (!confirm("Biztos visszaállítod a jelszót?")) return;

                const resetRes = await fetch("http://127.0.0.1:3000/api/admin/reset-jelszo", {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: keres.user_email,
                        keres_id: keres.keres_id
                    })
                });

                const resetData = await resetRes.json();

                if (resetData.success) {
                    alert(
                        (szoveg.data.resetSuc) +
                        "\nIdeiglenes jelszó: " +
                        resetData.tempPassword
                    );
                    renderResetRequestsPanel();
                } else {
                    alert(resetData.message);
                }
            };

            muvelet.appendChild(resetBtn);
            sor.appendChild(muvelet);
            tabla.appendChild(sor);
        });

        scrollDiv.appendChild(tabla);
        panelBody.appendChild(scrollDiv);
    }

    usersTabBtn.addEventListener("click", renderUsersPanel);
    resetTabBtn.addEventListener("click", renderResetRequestsPanel);

    await renderUsersPanel();
    content.appendChild(dekor_vonal_blokkal());
    content.appendChild(visszaGomb(szoveg.data.vissza));
    document.body.appendChild(content);
}