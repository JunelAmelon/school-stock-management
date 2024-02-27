require("dotenv").config();
const directeurModel = require("../model/DirecteurModel");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const getUserIdFromToken = require("../middleware/auth");

class DirecteurController {
  static async login(req, res) {
    const { id_ecole, password } = req.body.values;
    console.log("Values: " + id_ecole + "  " + password);
    try {
      const result = await directeurModel.login(id_ecole, password);
     if(result){
       // Créer un token
       const token = jwt.sign({ id_ecole }, process.env.SECRET_KEY, {
         expiresIn: "1h",
       });

       // Définir le cookie dans la réponse HTTP
       res.cookie("token", token, {
         httpOnly: true,
         maxAge: 3600000, // Durée de vie du cookie en millisecondes (1 heure dans cet exemple)
         sameSite: "strict",
       });
       res.json(result);
     }
     
    } catch (error) {
      res.status(401).json(error);
    }
  }

  static async logout(req, res) {
    res.clearCookie("token");
    res.redirect("/login");
  }

  static async inscription(req, res) {
    const id_directeur = req.body.id_directeur;
    const hash = req.body.password;
    const nom = req.body.nom;
    const prenom = req.body.prenom;
    const grade = req.body.grade;
    const telephone = req.body.telephone;
    const email = req.body.email;
    const id_school = req.body.id_school;
    const id_mediateur = req.body.id_mediateur;

    var results = await directeurModel.register(
      id_directeur,
      hash,
      nom,
      prenom,
      grade,
      telephone,
      email,
      id_school,
      id_mediateur
    );
    if (results) {
      res.json({ Message: "Inscription effectué avec succès" });
      res.send("Data added successfully");
    } else {
      res.json({ Message: "Erreur lors de l'inscription" });
    }
  }
  //l'id du directeur va s'obtenir via le token
  static async informationDirector(req, res) {
    var results = await directeurModel.getinformationDirecteur();
    if (results) {
      res.send(results);
      console.log("data sent with success");
    } else {
      console.log("Error in sendind data");
    }
  }

  static async schoolDirector(req, res) {
    var results = await directeurModel.getSchoolDirector(id_school);
    if (results) console.log("L'école de ce directeur est " + results[0].nom);
  }

  static async info_mediateur(req, res) {
    const id_school = getUserIdFromToken(req);
    var results = await directeurModel.informationMediateur_ofDirecteur(
      id_school
    );
    if (results) res.send(results);
  }

  static async info_controleur(req, res) {
    const id_school = getUserIdFromToken(req);
    var results = await directeurModel.informationControlleur_ofDirecteur(
      id_school
    );
    if (results) res.send(results);
  }

  static async insert_product(req, res) {
    const { nomp, nbre_colis, emballage_produit, poid } = req.body;
    const id_school = getUserIdFromToken(req);
    var results = await directeurModel.insererproduit(
      nomp,
      nbre_colis,
      emballage_produit,
      poid,
      id_school
    );
    if (results) res.send(results);
  }

  static async product_stock(req, res) {
    const id_school = getUserIdFromToken(req);
    var results = await directeurModel.getproductDirector(id_school);
    if (results) res.send(results);
  }

  static async mediateurId(req, res) {
    var results_mId = await directeurModel.getmediateurId();
    if (results_mId) {
      res.send(results_mId);
      console.log(
        "Data sent and id's values is " + results_mId[0].id_mediateur
      );
    }
  }

  static async bilanWeek(req, res) {
    const date_debut = req.body.date_debut;
    const date_fin = req.body.date_fin;
    const id_school = getUserIdFromToken(req);
    var result_bw = await directeurModel.getBilanSemaine(
      date_debut,
      date_fin,
      id_school
    );
    if (result_bw) {
      res.send(result_bw);
      console.log("Le bilan a ete envoye avec succes");
    }
  }

  static async bilanMonthProduct(req, res) {
    const id_mois = req.body.id_mois;
    const id_school = getUserIdFromToken(req);
    var result = await directeurModel.getBilanSemaine(id_mois, id_school);
    if (result) {
      res.send(result);
      console.log("Le bilan du mois pour votre ecole a ete envoye avec succes");
    }
  }
}

module.exports = DirecteurController;
