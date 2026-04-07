import { connect } from "mongoose";

const uri = "mongodb+srv://kalyankumarsampath_db_users:PibyZPIPd3Kl8Ur1@cluster0.uvzrc5s.mongodb.net/?appName=Cluster0";

connect(uri)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log("DB Error:", err));
  