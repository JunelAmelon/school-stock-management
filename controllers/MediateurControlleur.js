require("dotenv").config();
const Mediateurmodel = require("../model/MediateurModel");
const getUserIdFromToken = require("../middleware/auth");

class MediateurControlleur {
  static async login(req, res) {
    const { identifiant, password } = req.body;
    try {
      const user = await Mediateurmodel.login(identifiant, password);
      const token = jwt.sign({ identifiant }, process.env.SECRET_KEY, {
        expireIn: "1d",
      });
      res.cookie("token", token, { httpOnly: true });
      res.redirect("/dashboard");
    } catch (error) {
      res.send(error);
    }
  }

  static async inscription(req, res) {
    const {
      id_mediateur,
      password,
      nom,
      prenom,
      contact,
      email,
      adresse,
      id_controleur,
    } = req.body;
    var results = await Mediateurmodel.register(
      id_mediateur,
      password,
      nom,
      prenom,
      contact,
      email,
      adresse,
      id_controleur
    );
    if (results) {
      res.json({ Message: "Inscription effectué avec succès" });
    } else {
      res.json({ Message: "Erreur lors de l'inscription" });
    }
  }
  static async logout(req, res) {
    res.clearCookie("token");
    res.redirect("/");
  }

  static async infoMediateur(req, res) {
    const id_mediateur = getUserIdFromToken(req);
    var results = await Mediateurmodel.getinformationMediateur(id_mediateur);
    if (results) {
      res.send(results);
    }
  }

  static async info_stock(req, res) {
    const id_mediateur = getUserIdFromToken(req);
    var results = Mediateurmodel.getinformationstock_school(id_mediateur);
    if (results) {
      res.send(results);
    }
  }

  static async info_director(req, res) {
    const id_mediateur = getUserIdFromToken(req);

    var results = Mediateurmodel.getinfos_director(id_mediateur);
    if (results) {
      res.send(results);
    }
  }

  static async BilanWeek(req, res) {
    const id_mediateur = getUserIdFromToken(req);
    const result_Bk = await Mediateurmodel.getBilanWeek(id_mediateur);
    if (result_Bk) {
      res.send(result_Bk);
      console.log("Bilan envoyé avec succes");
    }
  }

  static async BilanMonthByProduct(req, res) {
    const id_mediateur = getUserIdFromToken(req);
    const result = await Mediateurmodel.getBilanMensuelWithProduct(
      id_mediateur
    );
    if (result) {
      res.send(result);
      console.log(
        "Bilan mensuel en fonction de l'etat des produits envoyé avec succes"
      );
    }
  }
  // Action pour récupérer le statut des produits des stocks de chaque école supervisée par le médiateur
  static async getProductStatusForSchools(req, res) {
    try {
      const mediateurId = getUserIdFromToken(req);

      // Appeler la méthode du modèle pour récupérer les statuts
      const schoolsStatus = await Mediateurmodel.getProductStatusForSchools(
        mediateurId
      );

      // Renvoyer les statuts en tant que réponse JSON
      res.json({ schoolsStatus });
    } catch (error) {
      // Gérer les erreurs et renvoyer une réponse appropriée
      console.error(error);
      res
        .status(500)
        .json({
          error:
            "Une erreur s'est produite lors de la récupération des statuts des écoles supervisées.",
        });
    }
  }
}

module.exports = MediateurControlleur;
