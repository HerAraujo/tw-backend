const apiRoutes = require("./apiRoutes");

module.exports = (app) => {
  app.use("/api", apiRoutes);
  app.use("/health", (req, res) => {
    res.status(200).json({ status: "OK" });
  });
  app.use("/", (req, res) => {
    res.status(200).json({ message: "Welcome to the API!" });
  });
};