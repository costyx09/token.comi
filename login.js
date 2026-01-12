import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

/* 🔹 CONFIG FIREBASE */
const firebaseConfig = {
  apiKey: "AIzaSyDEN54mTu8CdsWoWvw0sP6xAfL2NRlAN9M",
  authDomain: "assemblea-token.firebaseapp.com",
  projectId: "assemblea-token",
  storageBucket: "assemblea-token.firebasestorage.app",
  messagingSenderId: "682305266240",
  appId: "1:682305266240:web:30a93bb05c10d1a2aeb5a5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* 🔹 PRENDIAMO ELEMENTI HTML */
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");

/* 🔹 VERIFICA SE GIÀ LOGGATO */
const studenteLoggato = localStorage.getItem("studenteID");
if (studenteLoggato) {
  // Se già loggato, vai direttamente alla dashboard
  window.location.href = "index.html";
}

/* 🔹 CLICK LOGIN */
loginBtn.addEventListener("click", async () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  // Validazione base
  if (!username || !password) {
    alert("❌ Inserisci username e password");
    return;
  }

  // Disabilita il bottone durante il caricamento
  loginBtn.disabled = true;
  loginBtn.textContent = "Caricamento...";

  try {
    // Cerchiamo lo studente
    const q = query(
      collection(db, "studenti"),
      where("username", "==", username),
      where("password", "==", password),
      where("attivo", "==", true)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      alert("❌ Credenziali errate o account non attivo");
      loginBtn.disabled = false;
      loginBtn.textContent = "Accedi";
      return;
    }

    // Login OK - Salva l'ID dello studente
    const studenteID = snapshot.docs[0].id;
    const studenteData = snapshot.docs[0].data();
    
    localStorage.setItem("studenteID", studenteID);
    localStorage.setItem("studenteNome", studenteData.nome || "Studente");

    // Redirect alla dashboard
    alert("✅ Login riuscito!");
    window.location.href = "index.html";

  } catch (error) {
    console.error("Errore login:", error);
    alert("❌ Errore di connessione. Riprova.");
    loginBtn.disabled = false;
    loginBtn.textContent = "Accedi";
  }
});

/* 🔹 LOGIN CON ENTER */
passwordInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    loginBtn.click();
  }
});