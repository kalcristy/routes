const apiUrl = "http://localhost:5000/api/users";

const userForm = document.getElementById("userForm");
const userList = document.getElementById("userList");
// Name validation on input

document.getElementById("name").addEventListener("input", function () {
  if (this.value.trim().toLowerCase() === "akash") {
    alert("Tulasi is waiting for you");
    this.value = "";
  }
});

// Fetch Users
async function getUsers() {
  const res = await fetch(apiUrl);
  const data = await res.json();
  
  userList.innerHTML = "";

  data.forEach(user => {
  const li = document.createElement("li");
    li.innerHTML = `${user.uid} ${user.name} (${user.age})
      <button onclick="deleteUser('${user.uid}')">Delete</button>
    `;
    userList.appendChild(li);
  });
}

// Add User
userForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const uid = document.getElementById("uid").value;
  const name = document.getElementById("name").value;
  const age = document.getElementById("age").value;

  await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ uid,name,age })
  });

  userForm.reset();
  getUsers();
});

// Delete User
async function deleteUser(uid) {
  await fetch(`${apiUrl}/${uid}`, {
    method: "DELETE"
  });
  getUsers();
}

// Load users on start
getUsers();