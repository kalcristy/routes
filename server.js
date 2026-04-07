const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(express.static("public"));


// ================= DB CONNECTION =================

mongoose.connect("mongodb://localhost:27017/")
//mongodb+srv://kalyankumarsampath_db_users:PibyZPIPd3Kl8Ur1@cluster0.uvzrc5s.mongodb.net/?appName=Cluster0")
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log(err));


// ================= USER MODEL =================

const userSchema = new mongoose.Schema({
  uid:{
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);



const allusers =(req, res) => {
  res.send("Welcome to MoongoDB API 🚀");
}

// ================= HOME =================

app.get("/", allusers);

// ================= USERS CRUD =================

// Create User
app.post("/api/users", async (req, res) => {
  try {
    const newUser = new User({
      uid: req.body.uid,
      name: req.body.name,
      age: req.body.age,
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      message: "User Added ✅",
      data: savedUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Get All Users
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Get User By ID
app.get("/api/users/:uid", async (req, res) => {
  try {
    const user = await User.findOne( {uid: req.params.uid});

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Update User
app.put("/api/users/:uid", async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate({
      uid: req.params.uid},
      req.body,
      { new: true }
    );

    res.json({
      message: "User Updated ✅",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Delete User
app.delete("/api/users/:uid", async (req, res) => {
  try {
    await User.findOneAndDelete({uid: req.params.uid});

    res.json({ message: "User Deleted ✅" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ================= SERVER =================

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

});