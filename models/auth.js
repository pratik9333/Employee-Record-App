const mongoose = require("mongoose");

const authSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password should be atleast 6 characters"],
  },
});

module.exports = mongoose.model("Auth", authSchema);
