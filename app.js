let token = parseInt(localStorage.getItem("token")) || 0;

const tokenSpan = document.getElementById("token");
const storico = document.getElementById("listaStorico");
const scanBtn = document.getElementById("scanBtn");

function aggiornaToken() {
  tokenSpan.textContent = token;
}

scanBtn.addEventListener("click", () => {
  if (token <= 0) {
    alert("Token insufficienti ❌");
    return;
  }

  token--;
  localStorage.setItem("token", token);
  aggiornaToken();

  const li = document.createElement("li");
  li.textContent = "Speso 1 token";
  storico.prepend(li);
});

aggiornaToken();



  token -= costo;

  await updateDoc(studenteRef, { token });

  await addDoc(collection(db, "transazioni"), {
    studente: studenteID,
    descrizione: "Panino",
    variazione: -costo,
    timestamp: new Date()
  });




  token -= costo;

  await updateDoc(studenteRef, { token });

  alert("✅ Panino acquistato!");
  caricaToken();

import { collection, addDoc, query, where, orderBy, getDocs } 
from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

await addDoc(collection(db, "transazioni"), {
  studente: studenteID,
  descrizione: "Panino",
  variazione: -1,
  timestamp: new Date()
});


async function caricaStorico() {
  storico.innerHTML = "";

  const q = query(
    collection(db, "transazioni"),
    where("studente", "==", studenteID),
    orderBy("timestamp", "desc")
  );

  const snap = await getDocs(q);

  snap.forEach(doc => {
    const d = doc.data();
    const li = document.createElement("li");
    li.textContent = `${d.descrizione} (${d.variazione})`;
    storico.appendChild(li);
  });
}

caricaStorico();



