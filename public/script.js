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
const savedTheme = localStorage.getItem("theme") || "dark";
document.documentElement.setAttribute("data-theme", savedTheme);
themeIcon.textContent = savedTheme === "dark" ? "☀️" : "🌙";

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  themeIcon.textContent = next === "dark" ? "☀️" : "🌙";
});

// ── Toast ──
function showToast(msg, type = "success") {
  toast.textContent = msg;
  toast.className = `toast ${type} show`;
  setTimeout(() => { toast.className = "toast"; }, 3000);
}

// ── Name Easter Egg ──
document.getElementById("name").addEventListener("input", function () {
  if (this.value.trim().toLowerCase() === "vimal") {
    showToast("j bhai is waiting for you 👀", "error");
    this.value = "";
  }
});

// ── Fetch & Render Users ──
async function getUsers() {
  try {
    const res = await fetch(apiUrl);
    allUsers = await res.json();
    totalCount.textContent = allUsers.length;
    renderUsers();
  } catch (err) {
    showToast("Failed to fetch users ❌", "error");
  }
}

function renderUsers() {
  let users = [...allUsers];

  // Search filter
  const query = searchInput.value.trim().toLowerCase();
  if (query) {
    users = users.filter(u =>
      u.name.toLowerCase().includes(query) ||
      String(u.uid).includes(query)
    );
  }

  // Sort
  if (currentSort === "name") users.sort((a, b) => a.name.localeCompare(b.name));
  else if (currentSort === "age") users.sort((a, b) => a.age - b.age);
  else if (currentSort === "uid") users.sort((a, b) => a.uid - b.uid);

  userList.innerHTML = "";

  if (users.length === 0) {
    userList.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <p>${query ? "No users match your search." : "No users yet. Add one!"}</p>
      </div>`;
    return;
  }

  users.forEach(user => {
    const card = document.createElement("div");
    card.className = "user-card";
    const initial = user.name.charAt(0).toUpperCase();
    card.innerHTML = `
      <div class="user-avatar">${initial}</div>
      <div class="user-info">
        <div class="user-name">${user.name}</div>
        <div class="user-meta">ID: ${user.uid} &nbsp;·&nbsp; Age: ${user.age}</div>
      </div>
      <div class="user-actions">
        <button class="btn-edit" onclick="startEdit(${user.uid})" title="Edit">✏️</button>
        <button class="btn-delete" onclick="openDeleteModal(${user.uid})" title="Delete">🗑️</button>
      </div>
    `;
    userList.appendChild(card);
  });
}

// ── Search ──
searchInput.addEventListener("input", renderUsers);

// ── Sort ──
document.querySelectorAll(".sort-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".sort-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentSort = btn.dataset.sort;
    renderUsers();
  });
});

// ── Add User ──
userForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const uid  = document.getElementById("uid").value;
  const name = document.getElementById("name").value;
  const age  = document.getElementById("age").value;

  try {
    if (editingUid !== null) {
      // Update
      await fetch(`${apiUrl}/${editingUid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, name, age })
      });
      showToast(`✅ User "${name}" updated!`);
      stopEdit();
    } else {
      // Create
      await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, name, age })
      });
      showToast(`✅ User "${name}" added!`);
    }
    userForm.reset();
    getUsers();
  } catch (err) {
    showToast("Something went wrong ❌", "error");
  }
});

// ── Edit ──
function startEdit(uid) {
  const user = allUsers.find(u => u.uid == uid);
  if (!user) return;
  editingUid = uid;
  document.getElementById("uid").value   = user.uid;
  document.getElementById("name").value  = user.name;
  document.getElementById("age").value   = user.age;
  btnText.textContent = "💾 Save Changes";
  cancelBtn.classList.remove("hidden");
  document.getElementById("uid").scrollIntoView({ behavior: "smooth", block: "center" });
}

function stopEdit() {
  editingUid = null;
  userForm.reset();
  btnText.textContent = "+ Add User";
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
    showToast("🗑️ User deleted!", "error");
    modalOverlay.classList.add("hidden");
    deleteTargetUid = null;
    getUsers();
  } catch (err) {
    showToast("Delete failed ❌", "error");
  }
});

// Close modal on overlay click
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.classList.add("hidden");
    deleteTargetUid = null;
  }
});

// ── Init ──
getUsers();
