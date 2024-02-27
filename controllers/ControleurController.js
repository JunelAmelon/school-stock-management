require("dotenv").config();
const jwt = require("jsonwebtoken");
const ControleurModel = require("../model/ControleurModel");
const getUserIdFromToken = require("../middleware/auth");

class ControleurController {
  static async login(req, res) {
    const { identifiant, password } = req.body;
    try {
      const user = await ControleurModel.login(identifiant, password);
      const token = jwt.sign({ identifiant }, process.env.SECRET_KEY, {
        expireIn: "1d",
      });
      res.cookie("token", token, { httpOnly: true });
      res.redirect("/dashboard");
    } catch (error) {
      res.send(error);
    }
  }

  static async logout(req, res) {
    res.clearCookie("token");
    res.redirect("/");
    res.json({Status: "Success"})
  }

  static async inscription(req, res) {
    const { id_controleur, password, nom, prenom, contact, email, adresse } =
      req.body;
    var results = await ControleurModel.register(
      id_controleur,
      password,
      nom,
      prenom,
      contact,
      email,
      adresse
    );
    if (results) {
      res.json({ Message: "Inscription effectué avec succès" });
    } else {
      res.json({ Message: "Erreur lors de l'inscription" });
    }
  }

  static async infosControleur(req, res) {
    var results = await ControleurModel.getinformationControleur();
    if (results) {
      res.send(results);
    }
  }

  static async infoStock(req, res) {
    var results = await ControleurModel.getinformationstock_school();
    if (results) {
      res.send(results);
    }
  }

  static async infoDirecteur(req, res) {
    const id_controleur = getUserIdFromToken(req);
    var results = await ControleurModel.getinfos_director(id_controleur);
    if (results) {
      res.send(results);
    }
  }

  static async BilanWeek_mediateurId(req, res) {
    const jours = new Date().getDate();
    const mois = new Date().getMonth() + 1;
    const annee = new Date().getFullYear();
    const id_controleur = getUserIdFromToken(req);
    const results = await ControleurModel.getWeekBilan_mediateur(
      date_debut,
      date_fin,
      id_controleur
    );
    if (results) {
      res.send(results);
      console.log("Le bilan a ete envoye aux controleurs avec succes");
    }
  }

  static async getMediatorsSchoolProduct_Status(controllerId) {
    try {
      const mediatorsStatus = await ControllerModel.getMediatorsProduct_Status(
        controllerId
      );
      return mediatorsStatus;
    } catch (error) {
      // Gérer les erreurs
      console.error(error);
      throw new Error(
        "Une erreur s'est produite lors de la récupération du statut des médiateurs."
      );
    }
  }

  static async getBilanMensuelControleur(req, res) {
    try {
      // Récupérer l'ID du contrôleur à partir du token ou de la session
      const idControleur = getUserIdFromToken(req); 

      // Appeler la fonction du modèle pour obtenir le bilan mensuel du contrôleur
      const bilanMensuel = await ControleurModel.getBilanMensuelControleur(
        idControleur
      );

      // Envoyer la réponse JSON au client
      res.status(200).json(bilanMensuel);
    } catch (error) {
      // Gérer les erreurs et envoyer une réponse d'erreur au client
      console.error(error);
      res.status(500).json({
        error:
          "Une erreur s'est produite lors de la récupération du bilan mensuel du contrôleur.",
      });
    }
  }
}

module.exports = ControleurController;
