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
const ruoloLoggato = localStorage.getItem("ruoloUtente");

if (studenteLoggato && ruoloLoggato === "admin") {
  window.location.href = "admin.html";
} else if (studenteLoggato && ruoloLoggato === "venditore") {
  window.location.href = "genera-qr.html";
} else if (studenteLoggato) {
  window.location.href = "index.html";
}

/* 🔹 CLICK LOGIN */
loginBtn.addEventListener("click", async () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  const userType = document.querySelector('input[name="userType"]:checked').value;

  // Validazione base
  if (!username || !password) {
    alert("❌ Inserisci username e password");
    return;
  }

  // Disabilita il bottone durante il caricamento
  loginBtn.disabled = true;
  loginBtn.textContent = "Caricamento...";

  try {
    // Cerca nella collection studenti
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

    // Prendi i dati dell'utente
    const userID = snapshot.docs[0].id;
    const userData = snapshot.docs[0].data();
    const ruolo = userData.ruolo || "studente"; // Default: studente

    // Verifica che il ruolo corrisponda alla selezione
    if (userType === "admin" && ruolo !== "admin") {
      alert("❌ Non hai i permessi di amministratore");
      loginBtn.disabled = false;
      loginBtn.textContent = "Accedi";
      return;
    }

    if (userType === "venditore" && ruolo !== "venditore") {
      alert("❌ Non hai i permessi di venditore");
      loginBtn.disabled = false;
      loginBtn.textContent = "Accedi";
      return;
    }

    if (userType === "studente" && ruolo !== "studente") {
      alert("⚠️ Questo account non è uno studente. Seleziona il ruolo corretto.");
      loginBtn.disabled = false;
      loginBtn.textContent = "Accedi";
      return;
    }

    // Salva i dati in localStorage
    localStorage.setItem("studenteID", userID);
    localStorage.setItem("studenteNome", userData.nome || "Utente");
    localStorage.setItem("ruoloUtente", ruolo);
    
    if (ruolo === "admin") {
      localStorage.setItem("isAdmin", "true");
      alert("✅ Login admin riuscito!");
      window.location.href = "admin.html";
    } else if (ruolo === "venditore") {
      alert("✅ Login venditore riuscito!");
      window.location.href = "genera-qr.html";
    } else {
      localStorage.setItem("isAdmin", "false");
      alert("✅ Login riuscito!");
      window.location.href = "index.html";
    }

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
