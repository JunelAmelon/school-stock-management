const db = require("../config/db");

class GestionnaireModule {
  static async CreateSchool(id_ecole, nom_ecole, adresse_ecole) {
    return new Promise((resolve, reject) => {
      const requete =
        "INSERT INTO Ecole(`id_ecole`, `nom_ecole`, `adresse_ecole`) VALUES(?, ?, ?) ";
      db.query(
        requete,
        [id_ecole, nom_ecole, adresse_ecole],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
  }

  static async CreateActor(id, nom, prenom, adresse, type_acteur) {
    return new Promise((resolve, reject) => {
      const requete_m =
        "INSERT INTO Mediateur(`id_mediateur`, `nom_mediateur`, `prenom_mediateur`, `contact_mediateur`, `email_mediateur`, `adresse_mediateur`) VALUES(?, ?, ?, ?, ? , ?)";
      const requete_c =
        "INSERT INTO Controlleur(`id_controleur`, `nom_controleur`, `prenom_controleur`, `contact_controleur`, `email_controleur`, `adresse_controleur``) VALUES(?, ?, ?, ?, ? , ?)";
      if (type_acteur == mediateur) {
        db.query(
          requete_m,
          [id, nom, prenom, contact, email, adresse],
          (err, result) => {
            if (err) return reject(err);
            resolve(result);
          }
        );
      } else {
        if (type_acteur == controleur) {
          db.query(
            requete_m,
            [id, nom, prenom, contact, email, adresse],
            (err, result) => {
              if (err) return reject(err);
              resolve(result);
            }
          );
        }
      }
    });
  }

  static async DeleteActor(type_acteur, id) {
    return new Promise((resolve, reject) => {
      const requete_m = " ";
      const requete_c = " ";
      if (type_acteur == mediateur) {
        db.query(requete_m, [id], (err, result) => {
          if (err) {
            console.log("Erreur lors de la supression de ce mediateur");
            return reject(err);
          }
          resolve(result);
        });
      } else {
        if (type_acteur == controleur) {
          db.query(requete_c, [id], (err, result) => {
            if (err) {
              console.log("Erreur lors de la supression de ce controleur");
              return reject(err);
            } else {
              console.log("Ce controleur a été supprimé avec succès");
              resolve(result);
            }
          });
        }
      }
    });
  }

  static async createGestionnaire(id, password, sexe) {
    return new Promise((resolve, reject) => {
      const requete =
        "INSERT INTO Gestionnaire (`id_gestionnaire`, `password`, `sexe`) VALUES(?, ?, ?)";
      db.query(requete, [id, password, sexe], (err, result) => {
        if (err) {
          console.log("Erreur lors de l'ajout de ce gestionnaire");
          return reject(err);
        } else {
          console.log("Ce gestionnaire a été ajouté avec succès");
          resolve(result);
        }
      });
    });
  }

  static async associatePrivilege() {}
}

module.exports = GestionnaireModule;
