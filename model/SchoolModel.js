const db = require("../config/db");

class school {
  static async createSchool() {
    return new Promise((resolve, reject) => {
      const requete = "";
      db.query(requete, [], (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  }

  static async getInfoShcool() {
    return new Promise(
      (resolve,
      (reject) => {
        const requete = "";
        db.query(requete, [], (err, results) => {
          if (err) reject(err);
          resolve(results);
        });
      })
    );
  }
}
