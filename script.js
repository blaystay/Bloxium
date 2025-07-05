let user = JSON.parse(localStorage.getItem("bloxUser")) || null;

function toggleAuth() {
  const mode = document.getElementById("authBtn").textContent === "Register" ? "login" : "register";
  document.getElementById("authBtn").textContent = mode === "login" ? "Login" : "Register";
  document.getElementById("switchText").innerHTML =
    mode === "register"
      ? "Already have an account? <span onclick='toggleAuth()'>Login</span>"
      : "Don't have an account? <span onclick='toggleAuth()'>Register</span>";
}

function handleAuth() {
  const name = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  if (!name || !pass) return alert("Fill in all fields");

  if (document.getElementById("authBtn").textContent === "Register") {
    const data = {
      name,
      pass,
      regDate: new Date().toLocaleDateString(),
      friends: [],
      messages: []
    };
    localStorage.setItem("bloxUser", JSON.stringify(data));
    user = data;
  } else {
    const saved = JSON.parse(localStorage.getItem("bloxUser"));
    if (!saved || saved.name !== name || saved.pass !== pass) return alert("Invalid login");
    user = saved;
  }

  loadSite();
}

function loadSite() {
  document.getElementById("auth").classList.add("hidden");
  document.getElementById("main").classList.remove("hidden");
  showPage("home");
  document.getElementById("nickname").textContent = user.name;
  document.getElementById("profileName").textContent = user.name;
  document.getElementById("profileDate").textContent = user.regDate;
  document.getElementById("profileFriends").textContent = user.friends.length;
  renderForum();
}

function showPage(id) {
  document.querySelectorAll("section").forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

function sendMessage() {
  const msg = document.getElementById("forumInput").value;
  if (!msg) return;
  const time = new Date().toLocaleString();
  user.messages.push({ msg, time, name: user.name });
  localStorage.setItem("bloxUser", JSON.stringify(user));
  document.getElementById("forumInput").value = "";
  renderForum();
}

function renderForum() {
  const box = document.getElementById("forumMessages");
  box.innerHTML = "";
  user.messages.forEach(m => {
    box.innerHTML += `<div class='message'><strong>${m.name}</strong> (${m.time})<br>${m.msg}</div>`;
  });
}

function logout() {
  localStorage.removeItem("bloxUser");
  location.reload();
}

function searchSite() {
  const query = document.getElementById("searchBox").value.toLowerCase();
  if (!query) return;

  if (query.includes("home")) return showPage("home");
  if (query.includes("forum")) return showPage("forum");
  if (query.includes("profile")) return showPage("profile");

  let found = false;
  document.querySelectorAll("section").forEach(section => {
    if (section.innerText.toLowerCase().includes(query)) {
      section.scrollIntoView({ behavior: "smooth" });
      section.classList.remove("hidden");
      found = true;
    }
  });

  if (!found) alert("Ничего не найдено.");
}

if (user) loadSite();
