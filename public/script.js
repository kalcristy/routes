const apiUrl = "/api/users";

// ── State ──
let allUsers = [];
let editingUid = null;
let deleteTargetUid = null;
let currentSort = "default";

// ── Elements ──
const userForm     = document.getElementById("userForm");
const userList     = document.getElementById("userList");
const searchInput  = document.getElementById("searchInput");
const totalCount   = document.getElementById("totalCount");
const submitBtn    = document.getElementById("submitBtn");
const btnText      = document.getElementById("btnText");
const cancelBtn    = document.getElementById("cancelBtn");
const themeToggle  = document.getElementById("themeToggle");
const themeIcon    = document.getElementById("themeIcon");
const modalOverlay = document.getElementById("modalOverlay");
const confirmDelete= document.getElementById("confirmDelete");
const cancelDelete = document.getElementById("cancelDelete");
const toast        = document.getElementById("toast");

// ── Theme ──
const savedTheme = localStorage.getItem("spidey-theme") || "dark";
document.documentElement.setAttribute("data-theme", savedTheme);
themeIcon.textContent = savedTheme === "dark" ? "☀️" : "🌙";

themeToggle.addEventListener("click", () => {
  const cur  = document.documentElement.getAttribute("data-theme");
  const next = cur === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("spidey-theme", next);
  themeIcon.textContent = next === "dark" ? "☀️" : "🌙";
});

// ── Web Canvas ──
const canvas = document.getElementById("webCanvas");
const ctx    = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function drawWeb() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  const lineColor = isDark ? "rgba(227,28,28,0.35)" : "rgba(180,0,0,0.2)";
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 0.7;

  // Draw multiple web origins
  const origins = [
    { x: 0, y: 0 },
    { x: canvas.width, y: 0 },
    { x: canvas.width / 2, y: -50 },
  ];

  origins.forEach(origin => {
    const spokes = 16;
    const maxR   = Math.max(canvas.width, canvas.height) * 1.2;
    const rings  = 10;

    // Spokes
    for (let i = 0; i < spokes; i++) {
      const angle = (i / spokes) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(origin.x, origin.y);
      ctx.lineTo(
        origin.x + Math.cos(angle) * maxR,
        origin.y + Math.sin(angle) * maxR
      );
      ctx.stroke();
    }

    // Concentric rings
    for (let r = 1; r <= rings; r++) {
      const radius = (maxR / rings) * r;
      ctx.beginPath();
      for (let i = 0; i <= spokes; i++) {
        const angle = (i / spokes) * Math.PI * 2;
        const x = origin.x + Math.cos(angle) * radius;
        const y = origin.y + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }
  });
}

drawWeb();
window.addEventListener("resize", drawWeb);
document.getElementById("themeToggle").addEventListener("click", () => setTimeout(drawWeb, 50));

// ── Floating Sparks ──
function createSparks() {
  const container = document.getElementById("particles");
  for (let i = 0; i < 20; i++) {
    const spark = document.createElement("div");
    spark.className = "spark";
    spark.style.left     = Math.random() * 100 + "vw";
    spark.style.top      = Math.random() * 100 + "vh";
    spark.style.animationDuration  = (4 + Math.random() * 8) + "s";
    spark.style.animationDelay     = (Math.random() * 8) + "s";
    spark.style.width    = (2 + Math.random() * 3) + "px";
    spark.style.height   = spark.style.width;
    container.appendChild(spark);
  }
}
createSparks();

// ── Toast ──
function showToast(msg, type = "success") {
  toast.textContent = msg;
  toast.className   = `toast ${type} show`;
  setTimeout(() => { toast.className = "toast"; }, 3200);
}

// ── Easter Egg ──
document.getElementById("name").addEventListener("input", function () {
  if (this.value.trim().toLowerCase() === "vimal") {
    showToast("j bhai is waiting for you 👀", "error");
    this.value = "";
  }
});

// ── Fetch Users ──
async function getUsers() {
  try {
    const res = await fetch(apiUrl);
    allUsers  = await res.json();
    totalCount.textContent = String(allUsers.length).padStart(2, "0");
    renderUsers();
  } catch {
    showToast("Failed to reach server ❌", "error");
  }
}

// ── Render ──
function renderUsers() {
  let users = [...allUsers];

  const q = searchInput.value.trim().toLowerCase();
  if (q) {
    users = users.filter(u =>
      u.name.toLowerCase().includes(q) || String(u.uid).includes(q)
    );
  }

  if (currentSort === "name") users.sort((a, b) => a.name.localeCompare(b.name));
  else if (currentSort === "age") users.sort((a, b) => a.age - b.age);
  else if (currentSort === "uid") users.sort((a, b) => a.uid - b.uid);

  userList.innerHTML = "";

  if (users.length === 0) {
    userList.innerHTML = `
      <div class="empty-state">
        <div class="e-spider">🕷️</div>
        <p>${q ? "NO AGENTS FOUND" : "NO AGENTS YET"}</p>
        <span>${q ? "Try a different search" : "Deploy your first agent!"}</span>
      </div>`;
    return;
  }

  users.forEach((user, idx) => {
    const card    = document.createElement("div");
    card.className = "user-card";
    card.style.animationDelay = (idx * 0.05) + "s";

    const initial = user.name.charAt(0).toUpperCase();
    card.innerHTML = `
      <div class="user-avatar">${initial}</div>
      <div class="user-info">
        <div class="user-name">${user.name.toUpperCase()}</div>
        <div class="user-meta">ID: ${String(user.uid).padStart(4,"0")} &nbsp;·&nbsp; AGE: ${user.age} YRS</div>
      </div>
      <div class="user-actions">
        <button class="btn-edit" onclick="startEdit(${user.uid})" title="Edit agent">✏️</button>
        <button class="btn-del"  onclick="openDeleteModal(${user.uid})" title="Eliminate">🗑️</button>
      </div>
    `;
    userList.appendChild(card);
  });
}

// ── Search ──
searchInput.addEventListener("input", renderUsers);

// ── Sort ──
document.querySelectorAll(".pill").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".pill").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentSort = btn.dataset.sort;
    renderUsers();
  });
});

// ── Add / Update ──
userForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const uid  = document.getElementById("uid").value;
  const name = document.getElementById("name").value;
  const age  = document.getElementById("age").value;

  try {
    if (editingUid !== null) {
      await fetch(`${apiUrl}/${editingUid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, name, age })
      });
      showToast(`✅ Agent "${name.toUpperCase()}" updated!`);
      stopEdit();
    } else {
      await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, name, age })
      });
      showToast(`🕸️ Agent "${name.toUpperCase()}" deployed!`);
    }
    userForm.reset();
    getUsers();
  } catch {
    showToast("Mission failed ❌", "error");
  }
});

// ── Edit ──
function startEdit(uid) {
  const user = allUsers.find(u => u.uid == uid);
  if (!user) return;
  editingUid = uid;
  document.getElementById("uid").value  = user.uid;
  document.getElementById("name").value = user.name;
  document.getElementById("age").value  = user.age;
  btnText.textContent = "💾 UPDATE AGENT";
  cancelBtn.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function stopEdit() {
  editingUid = null;
  userForm.reset();
  btnText.textContent = "DEPLOY AGENT";
  cancelBtn.classList.add("hidden");
}

cancelBtn.addEventListener("click", stopEdit);

// ── Delete Modal ──
function openDeleteModal(uid) {
  deleteTargetUid = uid;
  modalOverlay.classList.remove("hidden");
}

cancelDelete.addEventListener("click", () => {
  modalOverlay.classList.add("hidden");
  deleteTargetUid = null;
});

confirmDelete.addEventListener("click", async () => {
  if (!deleteTargetUid) return;
  try {
    await fetch(`${apiUrl}/${deleteTargetUid}`, { method: "DELETE" });
    showToast("🕸️ Agent eliminated!", "error");
    modalOverlay.classList.add("hidden");
    deleteTargetUid = null;
    getUsers();
  } catch {
    showToast("Elimination failed ❌", "error");
  }
});

modalOverlay.addEventListener("click", e => {
  if (e.target === modalOverlay) {
    modalOverlay.classList.add("hidden");
    deleteTargetUid = null;
  }
});

// ── Boot ──
getUsers();
