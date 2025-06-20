const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
require("dotenv").config();

const userSchema = new Schema({
  firstname: { type: String, maxLength: 50, required: true },
  lastname: { type: String, maxLength: 50, required: true },
  username: { type: String, required: true, maxLength: 25, unique: true },
  password: { type: String, minLength: 4, maxLength: 70, required: true },
  email: { type: String, unique: true, required: true },
  description: String,
  profileImage: String,
  tweets: [{ type: Schema.Types.ObjectId, ref: "Tweet" }],
  followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    this.password = await bcrypt.hash(this.password, 10); // Ojo que el 10 está hardcodeado.
  }
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
