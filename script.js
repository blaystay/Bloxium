let user = JSON.parse(localStorage.getItem("bloxUser")) || null;

function toggleAuth() {
  const mode = document.getElementById("authBtn").textContent === "Register" ? "login" : "register";
  document.getElementById("authBtn").textContent = mode === "login" ? "Login" : "Register";
  document.getElementById("switchText").innerHTML =
    mode === "register"
      ? "Already have an account? <span onclick='toggleAuth()'>Login</span>"
      : "Don't have an account? <span onclick='toggleAuth()'>Register</span>";
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




function handleAuth() {
  const name = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();

  if (!name || !pass) return alert("Fill in all fields");

  let userData;

  if (defaultUsers[name] && defaultUsers[name].pass === pass) {
    userData = defaultUsers[name];
  } else {
    const saved = JSON.parse(localStorage.getItem("bloxUser"));
    if (saved && saved.name === name && saved.pass === pass) {
      userData = saved;
    } else {
      // New user registration
      userData = {
        name,
        pass,
        regDate: new Date().toLocaleDateString(),
        friends: [],
        messages: [],
        blooms: 15,
        admin: false
      };
    }
  }

  localStorage.setItem("bloxUser", JSON.stringify(userData));
  loadSite(userData);
}

function loadSite(user) {
  document.getElementById("auth").classList.add("hidden");
  document.getElementById("main").classList.remove("hidden");

  // Показываем ник и дату
  document.getElementById("nickname").textContent = user.name;
  document.getElementById("profileName").textContent = user.name;
  document.getElementById("profileDate").textContent = user.regDate;
  document.getElementById("profileFriends").textContent = user.friends.length;

  // Админ-пометка
  

  // Обновляем токены
  document.getElementById("bloomDisplay").textContent = user.blooms;

  // Автоначисление 15 Blooms раз в сутки
  const lastAward = localStorage.getItem("lastBloomAward");
  const now = Date.now();
  if (!lastAward || now - parseInt(lastAward) > 1000 * 60 * 60 * 24) {
    user.blooms += 15;
    localStorage.setItem("lastBloomAward", now.toString());
    localStorage.setItem("bloxUser", JSON.stringify(user));
  }


  // Сохраняем и запускаем автообновление токенов
  setInterval(() => {
    user.blooms += 15;
    localStorage.setItem("bloxUser", JSON.stringify(user));
    document.getElementById("bloomDisplay").textContent = user.blooms;

  // Автоначисление 15 Blooms раз в сутки
  const lastAward = localStorage.getItem("lastBloomAward");
  const now = Date.now();
  if (!lastAward || now - parseInt(lastAward) > 1000 * 60 * 60 * 24) {
    user.blooms += 15;
    localStorage.setItem("lastBloomAward", now.toString());
    localStorage.setItem("bloxUser", JSON.stringify(user));
  }

  }, 1000 * 60 * 60 * 5); // Каждые 5 часов

  showPage("home");
  renderForum(user);
}
