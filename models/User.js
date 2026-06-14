const mongoose = require("mongoose");

// Define the schema: shape and rules for each User document in MongoDB
const UserSchema = new mongoose.Schema(
  {
    // User's full name — required string
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    // User's email — required, unique, and stored lowercase
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    // User's age — optional, must be a positive number
    age: {
      type: Number,
      min: [0, "Age cannot be negative"],
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamps to each document
    timestamps: true,
  }
);

// Export the model so server.js can use it to interact with the "users" collection
module.exports = mongoose.model("User", UserSchema);
