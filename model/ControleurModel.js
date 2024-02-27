const db = require("../config/db");

class ControleurModel {
  static async getinformationControleur() {
    return new Promise((resolve, reject) => {
      const requete = "SELECT * FROM Controleurr";
      db.query(requete, [id], (err, result) => {
        if (err) resolve(requete);
        else reject(err);
      });
    });
  }

  static async getinformationstock_school(id_controleur) {
    return new Promise((resolve, reject) => {
      const requete =
        "SELECT produit_stock.nom_produit, produit_stock.nombre_colis_recu,produit_stock.poids_unitaire_net, produit_stock.poids_unitaire_totale,produit_stock.stock_restante_produit, mediateur.nom_mediateur FROM produit_stock JOIN mediateur ON produit_stock.id_mediateur = mediateur.id_mediateur JOIN controleur ON produit_stock.id_controleur= controleur.id_controleur WHERE id_controleur= ? ";
      db.query(requete, [id_controleur], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  static async getinfos_director(id_controleur) {
    return new Promise((resolve, reject) => {
      const requete =
        "SELECT directeur.nom, directeur.prenom, directeur.telephone, directeur.email, mediateur.nom_mediateur, mediateur.telephone FROM directeur JOIN mediateur ON directeur.id_mediateur = mediateur.id_mediateur WHERE id_controleur= ?";
      db.query(requete, [id_controleur], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  static async login(id_controleur, password) {
    return new Promise((resolve, reject) => {
      const requete =
        "SELECT * FROM controleur WHERE id_controleur= ? AND password= ?";
      db.query(requete, [id_controleur, password], (err, data) => {
        if (err) return reject(err);
        else {
          if (data.length > 0) {
            resolve(data[0]);
          } else {
            //rejet de la Promise avec message d'erreur
            reject("Invalid username or password");
          }
        }
      });
    });
  }

  static async register(identifiant, name, username, password) {
    return new Promise((resolve, reject) => {
      const requete =
        "INSERT INTO controler (`identifiant`, `name`, `username`, `password`) VALUES (?)";
      bcrypt.hash(password.toString(), salt, (err, hash) => {
        if (err) return res.json({ Error: "Error for hashing" });
        db.query(
          requete,
          [identifiant, name, username, hash],
          (err, result) => {
            if (err) reject(err);
            resolve(result);
          }
        );
      });
    });
  }

  static async getWeekBilan_mediateur(date_debut, date_fin, id_controleur) {
    return new Promise((resolve, reject) => {
      const requete =
        "SELECT m.id_menu, m.nom_menu, m.qte_p1_use, m.qte_p2_use, m.qte_p3_use, m.date_cook, s.date_debut, s.date_fin, c.nom_controleur, c.prenom_controleur, c.contact_controleur, c.email_controleur, c.adresse_controleur, md.nom_mediateur, md.prenom_mediateur, md.contact_mediateur, md.email_mediateur, md.adresse_mediateur FROM menu_semaine m INNER JOIN semaine s ON m.id_semaine = s.id_semaine INNER JOIN mediateur md ON m.id_mediateur = md.id_mediateur INNER JOIN controleur c ON md.id_controleur = c.id_controleur WHERE s.date_debut >= ? AND s.date_fin <= ? AND c.id_controleur = ?";
      db.query(
        requete,
        [date_debut, date_fin, id_controleur],
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  }
  static async getMediatorsProduct_Status(controllerId) {
    return new Promise(async (resolve, reject) => {
      try {
        // Requête SQL pour récupérer les informations sur le statut des produits
        const query = `
                    SELECT
                        c.id AS controllerId,
                        c.name AS controllerName,
                        m.id AS mediatorId,
                        m.name AS mediatorName,
                        s.id AS schoolId,
                        s.name AS schoolName,
                        ps.product AS productName,
                        ps.status AS productStatus
                    FROM
                        controllers c
                    JOIN
                        mediators m ON c.id = m.controller_id
                    JOIN
                        supervised_schools ss ON m.id = ss.mediator_id
                    JOIN
                        schools s ON ss.school_id = s.id
                    JOIN
                        product_statuses ps ON s.id = ps.school_id
                    WHERE
                        c.id = ?;
                `;

        // Exécution de la requête
        const mediatorsStatus = await db.query(query, [controllerId]);

        // Structure JSON pour stocker les résultats
        const result = {
          controllerId: controllerId,
          mediatorsStatus: [],
        };

        // Boucle à travers les résultats pour construire la structure JSON
        mediatorsStatus.forEach((row) => {
          let mediator = result.mediatorsStatus.find(
            (m) => m.mediatorId === row.mediatorId
          );

          if (!mediator) {
            mediator = {
              mediatorId: row.mediatorId,
              mediatorName: row.mediatorName,
              supervisedSchoolsStatus: [],
            };
            result.mediatorsStatus.push(mediator);
          }

          const schoolStatus = {
            schoolId: row.schoolId,
            schoolName: row.schoolName,
            productStatus: {
              [row.productName]: row.productStatus,
            },
          };

          mediator.supervisedSchoolsStatus.push(schoolStatus);
        });

        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  static async getBilanMensuelControleur(idControleur) {
    return new Promise((resolve, reject) => {
      const query = `
                SELECT
                    C.nom_controleur,
                    M.id_mediateur,
                    M.nom_mediateur,
                    M.prenom_mediateur,
                    E.nom_ecole,
                    PS.stock_initial,
                    PS.poids_unitaire_totale,
                    PS.stock_finale_physique,
                    PS.reception_pam,
                    PS.transfert_interne,
                    PS.transfert_externe,
                    PS.perte_ecole,
                    PS.stock_restante_produit
                FROM
                    controleur AS C
                JOIN mediateur AS M ON C.id_controleur = M.id_controleur
                JOIN ecole AS E ON M.id_mediateur = E.id_mediateur
                JOIN produit_stock AS PS ON E.id_ecole = PS.id_ecole
                WHERE
                    C.id_controleur = ?`;

      db.query(query, [idControleur], (err, results) => {
        if (err) {
          reject(err);
        } else {
          const controleurBilan = {};

          results.forEach((result) => {
            // Destructuration des résultats pour obtenir des variables plus lisibles
            const {
              nom_controleur,
              id_mediateur,
              nom_mediateur,
              prenom_mediateur,
              nom_ecole,
              ...details
            } = result;

            // Initialisation des structures JSON pour stocker les résultats
            if (!controleurBilan[nom_controleur]) {
              controleurBilan[nom_controleur] = {
                mediateurs: {},
              };
            }

            if (!controleurBilan[nom_controleur].mediateurs[id_mediateur]) {
              controleurBilan[nom_controleur].mediateurs[id_mediateur] = {
                nom_mediateur,
                prenom_mediateur,
                ecoles: {},
              };
            }

            if (
              !controleurBilan[nom_controleur].mediateurs[id_mediateur].ecoles[
                nom_ecole
              ]
            ) {
              controleurBilan[nom_controleur].mediateurs[id_mediateur].ecoles[
                nom_ecole
              ] = { ...details };
            }
          });

          resolve(controleurBilan);
        }
      });
    });
  }
}

module.exports = ControleurModel;
