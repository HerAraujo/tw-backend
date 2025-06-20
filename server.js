require("dotenv").config();

const express = require("express");
const routes = require("./routes");
const dbInitialSetup = require("./dbInitialSetup");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const methodOverride = require("method-override");

const APP_PORT = process.env.APP_PORT || 3000;
const app = express();

const user = encodeURIComponent(process.env.DB_USER);
const pass = encodeURIComponent(process.env.DB_PASS);
const host = process.env.DB_HOST;
const uri = `mongodb+srv://${user}:${pass}@${host}/?retryWrites=true&w=majority&appName=Sandbox`;

// Config global
app.use(cors());

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
routes(app);

// ⚠️ Arranque controlado
const startServer = async () => {
  try {
    mongoose.set("strictQuery", false);

    await mongoose.connect(uri);
    console.log("✅ ¡Conexión con la base de datos establecida!");

    await dbInitialSetup();

    app.listen(APP_PORT, () => {
      console.log(`\n🚀 [Express] Servidor corriendo en el puerto ${APP_PORT}!\n`);
    });
  } catch (error) {
    console.error("❌ Error al conectar a la base de datos:", error);
    process.exit(1);
  }
};

startServer();
