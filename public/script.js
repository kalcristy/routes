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
const btnIcon      = document.getElementById("btnIcon");
const cancelBtn    = document.getElementById("cancelBtn");
const modalOverlay = document.getElementById("modalOverlay");
const confirmDelete= document.getElementById("confirmDelete");
const cancelDelete = document.getElementById("cancelDelete");
const toast        = document.getElementById("toast");

// ── Helper: get current theme content ──
function tc() {
  return window.__themeContent || {};
}

// ── Web Canvas ──
const canvas = document.getElementById("webCanvas");
const ctx    = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", () => { resizeCanvas(); drawWeb(); });

function drawWeb() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  // Batman: gold web / Spider-Man: red web
  const lineColor = isDark
    ? "rgba(245,197,24,0.18)"
    : "rgba(227,28,28,0.30)";
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 0.7;

  const origins = isDark
    ? [
        { x: canvas.width / 2, y: 0 },
        { x: 0, y: canvas.height },
        { x: canvas.width, y: canvas.height },
      ]
    : [
        { x: 0, y: 0 },
        { x: canvas.width, y: 0 },
        { x: canvas.width / 2, y: -50 },
      ];

  origins.forEach(origin => {
    const spokes = isDark ? 20 : 16;
    const maxR   = Math.max(canvas.width, canvas.height) * 1.2;
    const rings  = isDark ? 12 : 10;

    for (let i = 0; i < spokes; i++) {
      const angle = (i / spokes) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(origin.x, origin.y);
      ctx.lineTo(origin.x + Math.cos(angle) * maxR, origin.y + Math.sin(angle) * maxR);
      ctx.stroke();
    }

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
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";

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
    const emptyIcon     = isDark ? "🦇" : "🕷️";
    const emptyTitle    = q ? "NO TARGETS FOUND" : (isDark ? "NO TARGETS ON FILE" : "NO AGENTS YET");
    const emptySubtitle = q ? "Try a different search" : (isDark ? "Begin surveillance operations" : "Deploy your first agent!");
    userList.innerHTML = `
      <div class="empty-state">
        <div class="e-spider" id="emptyIcon">${emptyIcon}</div>
        <p>${emptyTitle}</p>
        <span>${emptySubtitle}</span>
      </div>`;
    return;
  }

  users.forEach((user, idx) => {
    const card    = document.createElement("div");
    card.className = "user-card";
    card.style.animationDelay = (idx * 0.05) + "s";

    const initial = user.name.charAt(0).toUpperCase();
    const editIcon = isDark ? "✏️" : "✏️";
    const delIcon  = isDark ? "🗑️" : "🗑️";

    card.innerHTML = `
      <div class="user-avatar">${initial}</div>
      <div class="user-info">
        <div class="user-name">${user.name.toUpperCase()}</div>
        <div class="user-meta">ID: ${String(user.uid).padStart(4,"0")} &nbsp;·&nbsp; AGE: ${user.age} YRS</div>
      </div>
      <div class="user-actions">
        <button class="btn-edit" onclick="startEdit(${user.uid})" title="Edit">${editIcon}</button>
        <button class="btn-del"  onclick="openDeleteModal(${user.uid})" title="Delete">${delIcon}</button>
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
  const c    = tc();

  try {
    if (editingUid !== null) {
      await fetch(`${apiUrl}/${editingUid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, name, age })
      });
      showToast(c.toastUpdate ? c.toastUpdate(name.toUpperCase()) : `✅ "${name.toUpperCase()}" updated!`);
      stopEdit();
    } else {
      await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, name, age })
      });
      showToast(c.toastDeploy ? c.toastDeploy(name.toUpperCase()) : `✅ "${name.toUpperCase()}" added!`);
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

  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  btnText.textContent = isDark ? "UPDATE RECORD" : "UPDATE AGENT";
  btnIcon.textContent = isDark ? "🦇" : "💾";
  cancelBtn.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function stopEdit() {
  editingUid = null;
  userForm.reset();
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  btnText.textContent = isDark ? "FILE TARGET" : "DEPLOY AGENT";
  btnIcon.textContent = isDark ? "🦇" : "🕸️";
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
  const c = tc();
  try {
    await fetch(`${apiUrl}/${deleteTargetUid}`, { method: "DELETE" });
    showToast(c.toastDelete || "Deleted!", "error");
    modalOverlay.classList.add("hidden");
    deleteTargetUid = null;
    getUsers();
  } catch {
    showToast("Operation failed ❌", "error");
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
