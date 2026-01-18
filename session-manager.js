// SESSION MANAGER - Gestione scadenza sessione
// Aggiungi questo script a TUTTE le pagine protette (NON alla pagina login!)

const SESSION_DURATION = 5 * 60 * 60 * 1000; // 5 ore in millisecondi

// Verifica sessione all'avvio
function verificaSessione() {
  const loginTime = localStorage.getItem("loginTime");
  const studenteID = localStorage.getItem("studenteID");

  // Se non c'è studenteID, non è loggato (normale per login page)
  if (!studenteID) {
    return false;
  }

  // Se non c'è login time, è una vecchia sessione (prima dell'update)
  // Accettiamo per retrocompatibilità ma settiamo il timestamp ora
  if (!loginTime && studenteID) {
    console.log("⚠️ Sessione senza timestamp - aggiungo timestamp corrente");
    localStorage.setItem("loginTime", new Date().getTime().toString());
    localStorage.setItem("lastActivity", new Date().getTime().toString());
    return true; // Permetti accesso e salva timestamp
  }

  const now = new Date().getTime();
  const elapsed = now - parseInt(loginTime);

  // Sessione scaduta dopo 5 ore
  if (elapsed > SESSION_DURATION) {
    console.log("⏱️ Sessione scaduta - logout");
    logoutScaduto();
    return false;
  }

  // Aggiorna ultimo accesso
  localStorage.setItem("lastActivity", now.toString());

  return true;
}

// Logout per scadenza
function logoutScaduto() {
  localStorage.clear();
  alert("⏱️ SESSIONE SCADUTA\nEffettua nuovamente il login");
  window.location.href = "login.html";
}

// Aggiorna attività
function aggiornaAttivita() {
  const now = new Date().getTime();
  localStorage.setItem("lastActivity", now.toString());
}

// Event listeners per attività utente
document.addEventListener("click", aggiornaAttivita);
document.addEventListener("keypress", aggiornaAttivita);
document.addEventListener("scroll", aggiornaAttivita);

// Check periodico ogni minuto
setInterval(() => {
  verificaSessione();
}, 60000); // Ogni 60 secondi

// Check alla visibilità pagina
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    // Pagina tornata visibile, controlla sessione
    if (!verificaSessione()) {
      logoutScaduto();
    }
  }
});

// Esporta funzione per uso esterno
window.verificaSessione = verificaSessione;
