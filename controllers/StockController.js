const StockModel = require("./SchoolControlleur");
const getUserIdFromToken = require("../middleware/auth");

class StockController {
  // Action pour récupérer le statut de tous les produits d'une école
  static async getProductStatusByIdSchool(req, res) {
    try {
      // Récupérer l'ID de l'école à partir des paramètres de la requête (si nécessaire)
      const idSchool = getUserIdFromToken(req); // Utilisez le nom correct selon votre route

      // Appeler la méthode du modèle pour récupérer les statuts
      const statuses = await StockModel.getProductStatusByIdSchool(idSchool);

      // Renvoyer les statuts en tant que réponse JSON
      res.json({ statuses });
    } catch (error) {
      // Gérer les erreurs et renvoyer une réponse appropriée
      console.error(error);
      res
        .status(500)
        .json({
          error:
            "Une erreur s'est produite lors de la récupération des statuts.",
        });
    }
  }
}

module.exports = StockController;
