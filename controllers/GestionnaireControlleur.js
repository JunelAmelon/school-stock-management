const gestionnaireModule = require("../model/GestionnaireModule");

class GestionnaireControlleur {
  static async Create_school(req, res) {
    const { id_ecole, nom_ecole, adresse_ecole } = req.body;
    const result = await gestionnaireModule.CreateSchool(
      id_ecole,
      nom_ecole,
      adresse_ecole
    );
    if (result) {
      console.log("Ecole créer avec succès");
      res.send(result);
    } else {
      console.log("Erreur pendant la création de l'école");
    }
  }

  static async Create_Actor(req, res) {
    const { id, nom, prenom, adresse, type_acteur } = req.body;
    const result = await gestionnaireModule.CreateActor(
      id,
      nom,
      prenom,
      adresse,
      type_acteur
    );
    if (result) {
      console.log("Acteur créer avec succès");
      res.send(result);
    } else {
      console.log("Erreur pendant la création de l'acteur");
    }
  }

  static async Delete_Actor(req, res) {
    const result = await gestionnaireModule.DeleteActor();
    if (result) {
      console.log("Acteur supprimé avec succès");
      res.send(result);
    } else {
      console.log("Erreur lors de la suppression de cet acteur");
    }
  }
  static async Create_Gestionnaire(req, res) {
    const { id, password, sexe } = req.body;
    const result = await gestionnaireModule.createGestionnaire(
      id,
      password,
      sexe
    );
    if (result) {
      console.log("Gestionnaire créer avec succès");
      res.send(result);
    } else {
      console.log("Erreur pendant la création du gestionnaire");
    }
  }

  static async Associate_privilege(req, res) {}
}

module.exports = GestionnaireControlleur;
