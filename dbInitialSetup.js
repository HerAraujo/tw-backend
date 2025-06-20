const User = require("./models/User");
const Tweet = require("./models/Tweet");

module.exports = async () => {
  // Ejecutar seeders (datos de prueba):
  await require("./seeders/userSeeder")();
  await require("./seeders/tweetSeeder")();
  console.log("[Database] ¡Los datos de prueba fueron insertados!");
};
