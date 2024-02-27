// Importation des modules nécessaires
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cookie = require("cookie");
const route = require("./routes/router");
const bodyparser = require("body-parser");
const cors = require("cors"); // Importation du module cors
const jwt = require("jsonwebtoken");

// Utilisation de middlewares pour la gestion des cookies, du JSON et des URL encodées
app.use(
  cors({ credentials: true, origin: "http://localhost:3000", methods: ["POST", "GET"] })
); // Remplacez YOUR_FRONTEND_PORT par le port de votre application front-end
app.use(express.json());
app.use(cookieParser());
app.use("/api/directeur", route);
app.use("/api/mediateur", route);
app.use("/api/controlleur", route);
app.use("/api/gestionnaire", route);
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

// Route pour la page d'accueil
app.get("/acceuil", (res) => {
  res.json({ message: "Welcome to web application." });
});

// Démarrage du serveur sur le port 8080
app.listen(8080, () => {
  console.log("Server is running now, connect you on http://localhost:8080");
});
