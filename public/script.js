const apiUrl = "/api/users";

const userForm = document.getElementById("userForm");
const userList = document.getElementById("userList");
const toast = document.getElementById("toast");
const searchInput = document.getElementById("searchInput");
const countText = document.getElementById("countText");
const themeToggle = document.getElementById("themeToggle");

let usersData = [];
let editMode = false;
let editUID = null;

/* THEME */

themeToggle.addEventListener("click", () => {

  document.body.classList.toggle("dark");

  if(document.body.classList.contains("dark")){
    themeToggle.innerHTML = "☀️ Light Mode";
    localStorage.setItem("theme","dark");
  }else{
    themeToggle.innerHTML = "🌙 Dark Mode";
    localStorage.setItem("theme","light");
  }

});

window.addEventListener("load",()=>{

  const savedTheme = localStorage.getItem("theme");

  if(savedTheme === "dark"){
    document.body.classList.add("dark");
    themeToggle.innerHTML = "☀️ Light Mode";
  }

});

/* TOAST */

function showToast(message){

  toast.innerText = message;
  toast.style.opacity = "1";

  setTimeout(()=>{
    toast.style.opacity = "0";
  },2500);

}

/* GET USERS */

async function getUsers(){

  const res = await fetch(apiUrl);
  const data = await res.json();

  usersData = data;

  renderUsers(usersData);

}

/* RENDER */

function renderUsers(data){

  userList.innerHTML = "";

  countText.innerText = `${data.length} Users`;

  data.forEach(user=>{

    const li = document.createElement("li");
    li.className = "userItem";

    li.innerHTML = `
    
      <div class="userLeft">

        <div class="avatar">
          ${user.name.charAt(0).toUpperCase()}
        </div>

        <div>
          <h3>${user.name}</h3>
          <p>UID: ${user.uid} • Age: ${user.age}</p>
        </div>

      </div>

      <div class="userBtns">

        <button class="actionBtn editBtn"
        onclick="editUser('${user.uid}')">
        Edit
        </button>

        <button class="actionBtn deleteBtn"
        onclick="deleteUser('${user.uid}')">
        Delete
        </button>

      </div>

    `;

    userList.appendChild(li);

  });

}

/* ADD / UPDATE */

userForm.addEventListener("submit", async(e)=>{

  e.preventDefault();

  const uid = document.getElementById("uid").value;
  const name = document.getElementById("name").value;
  const age = document.getElementById("age").value;

  if(editMode){

    await fetch(`${apiUrl}/${editUID}`,{
      method:"PUT",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({uid,name,age})
    });

    showToast("User Updated 🦇");

    editMode = false;
    editUID = null;

    document.querySelector(".primaryBtn").innerText = "Add User";

  }else{

    await fetch(apiUrl,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({uid,name,age})
    });

    showToast("User Added ⚡");

  }

  userForm.reset();

  getUsers();

});

/* DELETE */

async function deleteUser(uid){

  const confirmDelete = confirm(
    "Delete this user?"
  );

  if(!confirmDelete) return;

  await fetch(`${apiUrl}/${uid}`,{
    method:"DELETE"
  });

  showToast("User Deleted ❌");

  getUsers();

}

/* EDIT */

function editUser(uid){

  const user = usersData.find(
    u => u.uid == uid
  );

  document.getElementById("uid").value = user.uid;
  document.getElementById("name").value = user.name;
  document.getElementById("age").value = user.age;

  editMode = true;
  editUID = uid;

  document.querySelector(".primaryBtn").innerText =
  "Update User";

  window.scrollTo({
    top:0,
    behavior:"smooth"
  });

}

/* SEARCH */

searchInput.addEventListener("input",(e)=>{

  const value = e.target.value.toLowerCase();

  const filtered = usersData.filter(user=>

    user.name.toLowerCase().includes(value) ||
    user.uid.toString().includes(value)

  );

  renderUsers(filtered);

});

/* LOAD */

getUsers();
