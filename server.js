// Load environment variables from config/.env before anything else
require("dotenv").config({ path: "./config/.env" });

const dns = require("dns");
const express = require("express");
const mongoose = require("mongoose");

// Use public DNS so mongodb+srv SRV lookups work when local/router DNS fails
dns.setServers(["8.8.8.8", "1.1.1.1"]);

// Import the User model (schema defined in models/User.js)
const User = require("./models/User");

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ────────────────────────────────────────────────────────────────

// Parse incoming JSON request bodies so req.body is available in routes
app.use(express.json());

// ─── Database Connection ───────────────────────────────────────────────────────

// Connect to MongoDB using the URI from .env
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ─── Routes ───────────────────────────────────────────────────────────────────

// GET /users — Return all users from the database
app.get("/users", async (req, res) => {
  try {
    // .find() with no arguments returns every document in the users collection
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
});

// POST /users — Add a new user to the database
app.post("/users", async (req, res) => {
  try {
    // Create a new User document from the request body (name, email, age)
    const newUser = new User(req.body);

    // .save() persists the document to MongoDB and runs schema validations
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ message: "Error creating user", error: err.message });
  }
});

// PUT /users/:id — Edit an existing user by their MongoDB _id
app.put("/users/:id", async (req, res) => {
  try {
    // findByIdAndUpdate finds the document by _id, applies the changes from req.body
    // { new: true } returns the updated document instead of the old one
    // { runValidators: true } ensures schema validations run on the updated fields
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    // If no document was found with that id, return 404
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: "Error updating user", error: err.message });
  }
});

// DELETE /users/:id — Remove a user from the database by their MongoDB _id
app.delete("/users/:id", async (req, res) => {
  try {
    // findByIdAndDelete removes the document and returns it if found
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully", user: deletedUser });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user", error: err.message });
  }
});

// ─── Start Server ──────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
