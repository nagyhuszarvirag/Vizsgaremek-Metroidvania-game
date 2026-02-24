import { oldalTakarito, dekor_vonal_blokkal, visszaGomb } from "./index.js";

export async function adminPanelLetrehoz() {

oldalTakarito();

const content = document.createElement("div");
content.classList.add("container","mt-5","beallitas_menu");

const cim = document.createElement("h1");
cim.textContent = "Admin Panel";
cim.style.textAlign="center";

content.appendChild(cim);
content.appendChild(dekor_vonal_blokkal());


const res=await fetch("http://127.0.0.1:3000/api/admin/users");
const data=await res.json();

if(!data.success){

content.textContent = "Hiba a user lista betöltésekor";
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
"ID",
"Username",
"Email",
"Jog",
"Műveletek"
].forEach(szoveg=>{

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

data.data.forEach(user=>{

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
saveBtn.textContent = "Mentés";
saveBtn.classList.add("gombok");
saveBtn.onclick=async()=>{

await fetch(`http://127.0.0.1:3000/api/user/${user.user_id}`,{

method:"PATCH",
headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

username:usernameInput.value,
user_email:emailInput.value,
user_jog_id:jogInput.value
})

});

alert("Mentve");
};

const deleteBtn = document.createElement("button");
deleteBtn.textContent = "Törlés";
deleteBtn.classList.add("gombok");
deleteBtn.onclick=async()=>{

if(!confirm("Biztos törlöd?"))return;

await fetch(`http://127.0.0.1:3000/api/user/${user.user_id}`,{

    method:"DELETE"

});

adminPanelLetrehoz();
};

muvelet.appendChild(saveBtn);
muvelet.appendChild(deleteBtn);
sor.appendChild(muvelet);
tabla.appendChild(sor);
});

scrollDiv.appendChild(tabla);
content.appendChild(scrollDiv);
content.appendChild(dekor_vonal_blokkal());
content.appendChild(visszaGomb("Vissza"));
document.body.appendChild(content);
}