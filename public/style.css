*{
  margin:0;
  padding:0;
  box-sizing:border-box;
}

:root{
  --bg:#f4f7fb;
  --card:#ffffff;
  --text:#111;
  --sub:#666;
  --primary:#5b5cff;
  --shadow:0 10px 30px rgba(0,0,0,.08);
}

body{
  font-family:"Montserrat",sans-serif;
  background:var(--bg);
  color:var(--text);
  min-height:100vh;
  transition:.4s;
  overflow-x:hidden;
}

.backgroundGlow{
  position:fixed;
  width:500px;
  height:500px;
  background:radial-gradient(circle,var(--primary),transparent 70%);
  opacity:.15;
  top:-200px;
  right:-200px;
  pointer-events:none;
}

.topbar{
  width:95%;
  margin:auto;
  padding:25px 0;
  display:flex;
  justify-content:space-between;
  align-items:center;
}

.logo{
  font-size:2rem;
  font-weight:800;
}

.subtitle{
  color:var(--sub);
  margin-top:5px;
}

.themeBtn{
  border:none;
  background:var(--primary);
  color:white;
  padding:14px 24px;
  border-radius:14px;
  cursor:pointer;
  font-weight:700;
  transition:.3s;
}

.themeBtn:hover{
  transform:translateY(-2px);
}

.hero{
  width:95%;
  margin:auto;
  height:280px;
  border-radius:30px;
  overflow:hidden;
  position:relative;

  background:
  linear-gradient(rgba(0,0,0,.4),rgba(0,0,0,.5)),
  url('https://images.unsplash.com/photo-1519608487953-e999c86e7455?q=80&w=1600&auto=format&fit=crop');

  background-size:cover;
  background-position:center;

  box-shadow:var(--shadow);
}

.heroOverlay{
  position:absolute;
  inset:0;
  backdrop-filter:blur(2px);
}

.heroContent{
  position:relative;
  z-index:2;
  height:100%;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  color:white;
  text-align:center;
}

.heroContent h1{
  font-size:3rem;
  margin-bottom:15px;
}

.heroContent p{
  font-size:1.1rem;
}

.mainGrid{
  width:95%;
  margin:40px auto;
  display:grid;
  grid-template-columns:1fr 1.3fr;
  gap:25px;
}

.card{
  background:var(--card);
  border-radius:24px;
  padding:25px;
  box-shadow:var(--shadow);
  transition:.4s;
}

.cardHeader{
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:20px;
}

.liveDot{
  width:14px;
  height:14px;
  border-radius:50%;
  background:#00ff73;
  box-shadow:0 0 12px #00ff73;
}

.inputGroup{
  margin-bottom:18px;
}

.inputGroup label{
  display:block;
  margin-bottom:8px;
  font-weight:600;
}

input{
  width:100%;
  padding:14px;
  border:none;
  border-radius:14px;
  background:#eef2f7;
  font-size:1rem;
  outline:none;
}

.primaryBtn{
  width:100%;
  margin-top:15px;
  border:none;
  padding:16px;
  border-radius:16px;
  background:var(--primary);
  color:white;
  font-size:1rem;
  font-weight:700;
  cursor:pointer;
  transition:.3s;
}

.primaryBtn:hover{
  transform:translateY(-3px);
}

.listTop{
  display:flex;
  justify-content:space-between;
  gap:20px;
  margin-bottom:25px;
  align-items:center;
}

.searchBox{
  width:240px;
}

#userList{
  list-style:none;
}

.userItem{
  background:#f2f5fb;
  margin-bottom:14px;
  padding:18px;
  border-radius:18px;
  display:flex;
  justify-content:space-between;
  align-items:center;
}

.userLeft{
  display:flex;
  align-items:center;
  gap:15px;
}

.avatar{
  width:50px;
  height:50px;
  border-radius:50%;
  background:var(--primary);
  color:white;
  display:flex;
  justify-content:center;
  align-items:center;
  font-weight:800;
  font-size:1.2rem;
}

.userBtns{
  display:flex;
  gap:10px;
}

.editBtn{
  background:#00b894;
}

.deleteBtn{
  background:#ff3b5c;
}

.actionBtn{
  border:none;
  color:white;
  padding:10px 16px;
  border-radius:12px;
  cursor:pointer;
  font-weight:700;
}

#toast{
  position:fixed;
  right:20px;
  bottom:20px;
  background:#111;
  color:white;
  padding:14px 22px;
  border-radius:14px;
  opacity:0;
  transition:.4s;
}

/* BATMAN MODE */

body.dark{
  --bg:#050505;
  --card:#121212;
  --text:#f5f5f5;
  --sub:#aaaaaa;
  --primary:#f5c518;
  --shadow:0 0 30px rgba(245,197,24,.2);

  background:
  radial-gradient(circle at top,#1b1b1b,#050505 70%);
}

body.dark .hero{
  background:
  linear-gradient(rgba(0,0,0,.75),rgba(0,0,0,.85)),
  url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1600&auto=format&fit=crop');

  background-size:cover;
  background-position:center;
}

body.dark .heroContent h1{
  color:#f5c518;
  text-shadow:0 0 25px rgba(245,197,24,.7);
}

body.dark input{
  background:#1d1d1d;
  color:white;
}

body.dark .userItem{
  background:#1a1a1a;
  border:1px solid rgba(245,197,24,.15);
}

body.dark .avatar{
  background:#f5c518;
  color:black;
}

body.dark .themeBtn,
body.dark .primaryBtn{
  color:black;
}

body.dark .card{
  border:1px solid rgba(245,197,24,.15);
}

body.dark .logo{
  color:#f5c518;
}

body.dark .backgroundGlow{
  background:
  radial-gradient(circle,#f5c518,transparent 70%);
}

@media(max-width:900px){

  .mainGrid{
    grid-template-columns:1fr;
  }

  .listTop{
    flex-direction:column;
    align-items:flex-start;
  }

  .searchBox{
    width:100%;
  }

  .heroContent h1{
    font-size:2rem;
  }

}
