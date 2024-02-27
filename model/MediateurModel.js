const db = require("../config/db");

class MediateurModel {
  static async getinformationMediateur(id_mediateur) {
    return new Promise((resolve, reject) => {
      const requete = "SELECT * FROM Mediateur WHERE id_mediateur= ?";
      db.query(requete, [id_mediateur], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  static async getinformationstock_school(id_mediateur) {
    return new Promise((resolve, reject) => {
      const requete =
        "SELECT nom_produit, nombre_colis_recu,poids_unitaire_net, poids_unitaire_totale,stock_restante_produit FROM produit_stock, mediateur WHERE produit_stock.id_mediateur = mediateur.id_mediateur AND id_mediateur= ? ";
      db.query(requete, [id_mediateur], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  static async getinfos_director(id_mediateur) {
    return new Promise((resolve, reject) => {
      const requete =
        "SELECT nom, prenom, telephone, email, nom_mediateur FROM directeur, mediateur WHERE directeur.id_mediateur = mediateur.id_mediateur AND id_mediateur= ?";
      db.query(requete, [id_mediateur], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  static async getBilanWeek(id_mediateur) {
    return new Promise((resolve, reject) => {
      const requete =
        "SELECT nom_menu, qte_p1_use, qte_p2_use, qte_p3_use, qte_p4_use, qte_p5_use, qte_p6_use,date_cook FROM menu_semaine WHERE id_mediateur= ?";
      db.query(requete, [id_mediateur], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  }

  static async getBilanMensuelWithProduct(id_mediateur) {
    return new Promise((resolve, reject) => {
      const requete = `
      SELECT
      e.id_school,
      e.nom_ecole,
      ps.nom_produit,
      ps.stock_finale_physique,
      ps.reception_pam,
      ps.transfert_interne,
      ps.transfert_externe,
      ps.perte_ecole,
      ps.stock_restante_produit,
      ps.stock_initial
      FROM
          Ecole e
      JOIN
          produit_stock ps ON e.id_school = ps.id_ecole
      JOIN
          semaine s ON e.id_school = s.id_ecole
      WHERE
          e.id_mediateur = ?
      
      `;
      db.query(requete, [id_mediateur], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  }
  // Méthode pour récupérer le statut des produits des stocks de chaque école supervisée par le médiateur
  static async getProductStatusForSchools(mediateurId) {
    return new Promise(async (resolve, reject) => {
      try {
        const query = `
                  SELECT e.id_ecole, e.nom_ecole, s.*
                  FROM ecole e
                  JOIN stock s ON e.id_ecole = s.id_ecole
                  JOIN mediateur_ecole me ON e.id_ecole = me.id_ecole
                  WHERE me.id_mediateur = ?;
              `;
        db.query(query, [mediateurId], (err, results) => {
          if (err) {
            reject(err);
          } else {
            const schoolsStatus = results.map((result) => ({
              schoolId: result.id_ecole,
              schoolName: result.nom_ecole,
              productStatus: {
                product1: result.status_product1,
                product2: result.status_product2,
                // Ajoutez d'autres produits ici
              },
            }));
            resolve(schoolsStatus);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = MediateurModel;
