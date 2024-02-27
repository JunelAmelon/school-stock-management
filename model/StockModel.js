const db = require("../config/db");

class StockModel {
  // ...

  // Récupérer toutes les quantités pour une école donnée
  static async getAllQuantitiesByIdSchool(idSchool) {
    return new Promise((resolve, reject) => {
      // Requête SQL pour récupérer les quantités de chaque produit
      const query =
        "SELECT id_product, stock_restante_produit FROM produit_stock WHERE id_ecole = ?";

      // Exécuter la requête dans la base de données
      db.query(query, [idSchool], (err, results) => {
        if (err) {
          // Gérer les erreurs s'il y en a
          reject(err);
        } else {
          // Construire un objet avec les quantités pour chaque produit
          const quantities = Object.fromEntries(
            results.map((result) => [
              result.id_product,
              result.stock_restante_produit,
            ])
          );
          // Renvoyer l'objet quantités
          resolve(quantities);
        }
      });
    });
  }

  // Récupérer l'intervalle de statut en fonction du produit
  static getStatusInterval(product) {
    // Définir les intervalles pour chaque produit
    const intervalMap = {
      mais_stck: [0, 5, 10, 20, 100],
      riz_stck: [0, 5, 10, 20, 100],
      hle_stck: [0, 5, 10, 20, 100],
      // Ajouter d'autres produits ici avec leurs intervalles correspondants
    };
    // Renvoyer l'intervalle pour le produit spécifié
    return intervalMap[product] || [];
  }

  // Récupérer le statut du stock en fonction de la quantité
  static getStockStatus(productId, quantity) {
    // Récupérer l'intervalle de statut pour le produit spécifié
    const interval = this.getStatusInterval(productId);

    // Fonction utilitaire pour déterminer le statut en fonction de la quantité
    const getStatus = (quantity) => {
      if (quantity <= interval[0]) {
        return "Rupture de stock";
      } else if (quantity <= interval[1]) {
        return "Pénurie";
      } else if (quantity <= interval[2]) {
        return "Baisse";
      } else if (quantity <= interval[3]) {
        return "En stock";
      } else if (quantity <= interval[4]) {
        return "Stock important";
      } else {
        return "Quantité inconnue";
      }
    };

    // Renvoyer le statut pour la quantité spécifiée
    return getStatus(quantity);
  }

  // Récupérer le statut de tous les produits pour une école donnée
  static async getProductStatusByIdSchool(idSchool) {
    return new Promise(async (resolve, reject) => {
      try {
        // Récupérer toutes les quantités pour l'école spécifiée
        const quantities = await this.getAllQuantitiesByIdSchool(idSchool);
        // Initialiser un objet pour stocker les statuts de chaque produit
        const statuses = {};

        // Boucle à travers toutes les quantités pour obtenir les statuts de chaque produit
        for (const productId in quantities) {
          if (quantities.hasOwnProperty(productId)) {
            const quantity = quantities[productId];
            const status = this.getStockStatus(productId, quantity);
            // Stocker le statut dans l'objet statuses
            statuses[productId] = status;
          }
        }

        // Renvoyer l'objet contenant les statuts de tous les produits
        resolve(statuses);
      } catch (error) {
        // Gérer les erreurs s'il y en a
        reject(error);
      }
    });
  }
}
