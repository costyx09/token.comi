let token = parseInt(localStorage.getItem("token")) || 0;

const tokenSpan = document.getElementById("adminToken");
const addBtn = document.getElementById("addToken");

function aggiornaToken() {
  tokenSpan.textContent = token;
  localStorage.setItem("token", token);
}

addBtn.addEventListener("click", () => {
  token += 4;
  aggiornaToken();
});

aggiornaToken();
