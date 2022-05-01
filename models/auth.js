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

//encrypt password before save - hooks
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

//validate the password with password user sending
userSchema.methods.validatePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password); // doubt in this
};

//create and return JWT token
userSchema.methods.getJwtToken = function () {
  return jsonwebtoken.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

module.exports = mongoose.model("Auth", authSchema);
