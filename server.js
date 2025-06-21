// require("dotenv").config();

// const express = require("express");
// const routes = require("./routes");
// const dbInitialSetup = require("./dbInitialSetup");
// const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const methodOverride = require("method-override");

// const APP_PORT = process.env.APP_PORT || 3000;
// const app = express();

// const user = encodeURIComponent(process.env.DB_USER);
// const pass = encodeURIComponent(process.env.DB_PASS);
// const host = process.env.DB_HOST;
// const uri = `mongodb+srv://${user}:${pass}@${host}/?retryWrites=true&w=majority&appName=Sandbox`;

// // Config global
// const allowedOrigins = [
//   "http://localhost:3000",
//   "https://tw-frontend.vercel.app",
//   "https://tw-frontend-xi.vercel.app/"
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true
// }));

// app.use(express.static("public"));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.set("view engine", "ejs");
// app.use(methodOverride("_method"));
// routes(app);

// // ⚠️ Arranque controlado
// const startServer = async () => {
//   try {
//     mongoose.set("strictQuery", false);

//     await mongoose.connect(uri);
//     console.log("✅ ¡Conexión con la base de datos establecida!");

//     // await dbInitialSetup();

//     app.listen(APP_PORT, () => {
//       console.log(`\n🚀 [Express] Servidor corriendo en el puerto ${APP_PORT}!\n`);
//     });
//   } catch (error) {
//     console.error("❌ Error al conectar a la base de datos:", error);
//     process.exit(1);
//   }
// };

// startServer();

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

// 🔐 DB URI
const user = encodeURIComponent(process.env.DB_USER);
const pass = encodeURIComponent(process.env.DB_PASS);
const host = process.env.DB_HOST;
const uri = `mongodb+srv://${user}:${pass}@${host}/?retryWrites=true&w=majority&appName=Sandbox`;

const allowedOrigins = [
  "http://localhost:3000",
  "localhost:3000",
  "https://tw-frontend.vercel.app",
  "https://tw-frontend-xi.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// 📦 Middlewares
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use((req, res, next) => {
  console.log("Origin:", req.headers.origin);
  next();
});

// 🚏 Rutas
routes(app);

// 🛡️ Middleware de error (CORS incluso si hay errores)
app.use((err, req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  res.status(err.status || 500).json({ error: err.message });
});

// 🚀 Start server
const startServer = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(uri);
    console.log("✅ ¡Conexión con la base de datos establecida!");

    // await dbInitialSetup();

    app.listen(APP_PORT, () => {
      console.log(`\n🚀 [Express] Servidor corriendo en el puerto ${APP_PORT}!\n`);
    });
  } catch (error) {
    console.error("❌ Error al conectar a la base de datos:", error);
    process.exit(1);
  }
};

startServer();