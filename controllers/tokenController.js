require("dotenv").config();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

async function login(req, res) {
  const user = await User.findOne({ username: req.body.username });
  if (!user) {
    return res.status(401).json({ error: "Credenciales incorrectas" });
  }

  const checkPassword = await user.comparePassword(req.body.password);

  if (!checkPassword) {
    return res.status(401).json({ error: "Credenciales incorrectas" });
  }

  const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN);
  return res.json({ user: { id: user.id, username: user.username, accessToken } });
}

module.exports = { login };
