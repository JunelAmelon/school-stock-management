const db = require("../config/db");
const bcrypt = require("bcrypt");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
class DirecteurModel {
  static async register(
    id_directeur,
    password,
    nom,
    prenom,
    grade,
    telephone,
    email,
    id_school,
    id_mediateur
  ) {
    return new Promise((resolve, reject) => {
      let saltRounds = 10;
      const requete =
        "INSERT INTO directeur (`id_directeur`, `password`, `nom`, `prenom`, `grade`, `telephone`, `email`, `id_school`, `id_mediateur`) VALUES (?, ?, ?, ?, ?, ? , ?, ?, ?)";

      bcrypt.hash(password.toString(), saltRounds, function (err, hash) {
        // Store hash in your password DB.
        if (err) return console.log("Error for hashing");
        else {
          db.query(
            requete,
            [
              id_directeur,
              hash,
              nom,
              prenom,
              grade,
              telephone,
              email,
              id_school,
              id_mediateur,
            ],
            (err, result) => {
              if (err) reject(err);
              resolve(result);
            }
          );
        }
      });
    });
  }

  static async login(id_ecole, password) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM ecole WHERE id_school = ?";
      db.query(query, [id_ecole], (err, results) => {
        if (err) {
          reject({ Error: "Login error in server, plz verify your datas" });
        } else {
          if (results.length > 0) {
            console.log(
              "Length is:  " +
                results.length +
                " and my password is:" +
                " " +
                results[0].password
            );
            const hashedPassword = results[0].password;

            // bcrypt.compare(password, hashedPassword, (err, response) => {
            //   if (err) {
            //     console.error("Password comparison error:", err);
            //     reject({ Error: "Password compare error" });
            //   }

            //   if (response) {
            //     resolve({ Status: "Success" });
            //   } else {
            //     reject({ Error: "Password not matched" });
            //   }
            // });
            if (password === hashedPassword) {
              resolve({ Status: "Success" });
              console.log("Mot de passe correct");
            } else {
              console.log("Mot de passe incorrect");
            }
          } else {
            reject({ Error: "No id_ecole existed" });
          }
        }
      });
    });
  }

  static async getinformationDirecteur(id_directeur) {
    return new Promise((resolve, reject) => {
      const requete = "SELECT * FROM directeur WHERE id_directeur= ?";
      db.query(requete, [id_directeur], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  static async getSchoolDirector(id_directeur) {
    return new Promise((resolve, reject) => {
      const requete = "SELECT id_school FROM directeur WHERE id_directeur= ?";
      const requete1 = "SELECT nom FROM SCHOOL WHERE id_school= ?";

      // Première requête pour obtenir l'id_school associé à l'id_directeur
      db.query(requete, [id_directeur], (err, results) => {
        if (err) {
          reject(err);
        } else {
          // Vérifiez si des résultats sont renvoyés
          if (results.length > 0) {
            // Obtenez l'id_school
            const id_school = results[0].id_school;

            // Deuxième requête pour obtenir le nom de l'école en utilisant l'id_school
            db.query(requete1, [id_school], (err, result1) => {
              if (err) {
                reject(err);
              } else {
                // Résolvez la promesse avec les résultats
                resolve(result1);
              }
            });
          } else {
            // Aucun résultat trouvé pour l'id_directeur
            resolve([]);
            res.json("Auncune école trouver pour ce Directeur");
          }
        }
      });
    });
  }

  static async informationMediateur_ofDirecteur(id_mediateur) {
    return new Promise((resolve, reject) => {
      const requete0 =
        "SELECT id_mediateur FROM Directeur WHERE id_directeur= ?";
      db.query(requete0, [id_mediateur], (err, result0) => {
        if (err) reject(err);
        else {
          if (result0 > 0) {
            const id_mediateur = result0[0].id_mediateur;
            const requete =
              "SELECT nom, prenom, telephone, email, nom_mediateur FROM directeur, mediateur WHERE directeur.id_mediateur = mediateur.id_mediateur AND id_mediateur= ?";
            db.query(requete, [id_mediateur], (err, result) => {
              if (err) reject(err);
              else resolve(result);
            });
          }
        }
      });
    });
  }

  static async informationControlleur_ofDirecteur(id_school) {
    return new Promise((resolve, reject) => {
      const requete0 =
        "SELECT id_controlleur FROM Directeur WHERE id_school= ?";
      db.query(requete0, [id_school], (err, result0) => {
        if (err) reject(err);
        else {
          if (result0.length > 0) {
            const id_controlleur = [result0].id_controlleur;
            const requete =
              "SELECT nom, prenom, telephone, email, nom_controlleur FROM directeur, controlleur WHERE directeur.id_controlleur = controlleur.id_controlleur AND id_controlleurr= ?";
            db.query(requete, [id_controlleur], (err, result) => {
              if (err) reject(err);
              else resolve(result);
            });
          }
        }
      });
    });
  }

  static async insererproduit(
    nom,
    nbre_colis,
    emballage_produit,
    poid,
    id_school
  ) {
    return new Promise((resolve, reject) => {
      const requete =
        "INSERT INTO produit_stock(`nom_produit`, `nbre_colis`, `emballage_produit`, `poid_unitaire_net`,`id_school`) VALUES (?, ?, ?, ?, ?)";
      db.query(
        requete,
        [nom, nbre_colis, emballage_produit, poid, id_school],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  }

  //      static async ajoutermenu(nomp, date_cook, qte_cook_p1, qte_cook_p2, qte_cook_p3, qte_cook_p4, qte_cook_p5, qte_cook_p6, id_school){
  //         return new Promise((resolve, reject)=>{
  //             const requete0= "INSERT INTO menu_semaine(`nom_repas`, `date_cook`, `qte_cook_p1`, `qte_cook_p2`, `qte_cook_p3` WHERE id_school= ?) VALUES (?, ?, ?, ?, ?)";
  //             db.query(requete0, [nomp, date_cook, qte_cook_p1, qte_cook_p2, qte_cook_p3,qte_cook_p4, qte_cook_p5, qte_cook_p6, id_school], (err, result)=>{
  //                 if(err) reject(err)
  //                 else{
  //                 console.log('Insertion faite avec succes');
  //                 const sql2= "SELECT stock_restante_produit FROM produit_stock WHERE id_produit = mais_stck";
  //                 const sql3= "SELECT stock_restante_produit FROM produit_stock WHERE id_produit = riz_stck";
  //                 const sql4= "SELECT stock_restante_produit FROM produit_stock WHERE id_produit = hle_stck";
  //                 const sql5= "SELECT stock_restante_produit FROM produit_stock WHERE id_produit = haricot_stck";
  //                 const sql6= "SELECT stock_restante_produit FROM produit_stock WHERE id_produit = lentille_stck";
  //                 const sql7= "SELECT stock_restante_produit FROM produit_stock WHERE id_produit = sel_stck";
  //                 const sql8= "SELECT qte_cook FROM menu_semaine"; //cette requete doit etre faite en fonction d'un menu

  //                 db.query(sql2, [], (err, data1)=>{
  //                     if(err) reject(err)
  //                      else{
  //                     if(data1.length>0){
  //                     var qte_product1_use= qte_cook_p1;
  //                     var  stock_rest_p1= data1[0].stock_restante_produit;
  //                     var stock_new_p1= stock_rest_p1 - qte_product1_use;
  //                     const sql2_1= "UPDATE produit_stock SET stock_restante_produit = ? WHERE id_product = mais_stck";
  //                     db.query(sql2_1, [stock_new_p1], (err, result)=>{
  //                         if(err) reject(err)
  //                          resolve(result)
  //                     })
  //                 }
  //              }
  //           })

  //           db.query(sql3, [], (err, data2)=>{
  //             if(err) reject(err)
  //              else{
  //             if(data2.length>0){
  //             var qte_product2_use= qte_cook_p2;
  //             var  stock_rest_p2= data2[0].stock_restante_produit;
  //             var stock_new_p2= stock_rest_p2 - qte_product2_use;
  //             const sql3_1= "UPDATE produit_stock SET stock_restante_produit = ? WHERE id_product = riz_stck";
  //             db.query(sql3_1, [stock_new_p2], (err, result)=>{
  //                 if(err) reject(err)
  //                  resolve(result)
  //             })
  //         }
  //      }
  //   })

  //         db.query(sql4, [], (err, data3)=>{
  //             if(err) reject(err)
  //             else{
  //             if(data3.length>0){
  //             var qte_product3_use= qte_cook_p3;
  //             var  stock_rest_p3= data3[0].stock_restante_produit;
  //             var stock_new_p3= stock_rest_p3 - qte_product3_use;
  //             const sql4_1= "UPDATE produit_stock SET stock_restante_produit = ? WHERE id_product = hle_stck";
  //             db.query(sql4_1, [stock_new_p3], (err, result)=>{
  //                 if(err) reject(err)
  //                 resolve(result)
  //             })
  //         }
  //         }
  //         })

  //         db.query(sql5, [], (err, data4)=>{
  //             if(err) reject(err)
  //              else{
  //             if(data4.length>0){
  //             var qte_product4_use= qte_cook_p4;
  //             var  stock_rest_p4= data4[0].stock_restante_produit;
  //             var stock_new_p4= stock_rest_p4 - qte_product4_use;
  //             const sql4_1= "UPDATE produit_stock SET stock_restante_produit = ? WHERE id_product = haricot_stck";
  //             db.query(sql4_1, [stock_new_p4], (err, result)=>{
  //                 if(err) reject(err)
  //                  resolve(result)
  //             })
  //         }
  //      }
  //   })

  //             db.query(sql6, [], (err, data5)=>{
  //                 if(err) reject(err)
  //                 else{
  //                 if(data5.length>0){
  //                 var qte_product5_use= qte_cook_p5;
  //                 var  stock_rest_p5= data5[0].stock_restante_produit;
  //                 var stock_new_p5= stock_rest_p5 - qte_product5_use;
  //                 const sql5_1= "UPDATE produit_stock SET stock_restante_produit = ? WHERE id_product = lentille_stck";
  //                 db.query(sql5_1, [stock_new_p5], (err, result)=>{
  //                     if(err) reject(err)
  //                     resolve(result)
  //                 })
  //             }
  //          }
  //     })

  //             db.query(sql7, [], (err, data6)=>{
  //                 if(err) reject(err)
  //                 else{
  //                 if(data6.length>0){
  //                 var qte_product6_use= qte_cook_p6;
  //                 var  stock_rest_p6= data6[0].stock_restante_produit;
  //                 var stock_new_p6= stock_rest_p6 - qte_product6_use;
  //                 const sql6_1= "UPDATE produit_stock SET stock_restante_produit = ? WHERE id_product = sel_stck";
  //                 db.query(sql6_1, [stock_new_p6], (err, result)=>{
  //                     if(err) reject(err)
  //                     resolve(result)
  //                 })
  //              }
  //            }
  //          })

  //         }

  //       })

  //     })
  //  }

  static async ajoutermenu(
    nomp,
    date_cook,
    qte_cook_p1,
    qte_cook_p2,
    qte_cook_p3,
    qte_cook_p4,
    qte_cook_p5,
    qte_cook_p6,
    id_school
  ) {
    return new Promise((resolve, reject) => {
      const requete0 =
        "INSERT INTO menu_semaine(`nom_repas`, `date_cook`, `qte_cook_p1`, `qte_cook_p2`, `qte_cook_p3`, `qte_cook_p4`, `qte_cook_p5`, `qte_cook_p6`,`id_school`) VALUES (?, ?, ?, ?, ?, ?)";
      db.query(
        requete0,
        [
          nomp,
          date_cook,
          qte_cook_p1,
          qte_cook_p2,
          qte_cook_p3,
          qte_cook_p4,
          qte_cook_p5,
          qte_cook_p6,
          id_school,
        ],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            console.log("Insertion faite avec succès");
            const produits = [
              "p001_mais-stck",
              "p002_riz-stck",
              "p003_huile-stck",
              "p004_lentille-stck",
              "p005_haricot-stck",
              "p006_sel-stck",
            ];

            produits.forEach((produit) => {
              const sqlQuantiteCook = `SELECT qte_cook_${
                produit.split("_")[1]
              } FROM menu_semaine WHERE id_menu = ?`;

              db.query(sqlQuantiteCook, [result.insertId], (err, data2) => {
                if (err) {
                  reject(err);
                } else {
                  if (data2.length > 0) {
                    const qte_product_use =
                      data2[0][`qte_cook_${produit.split("_")[0]}`];
                    const stock_rest = data1[0].stock_restante_produit;
                    const stock_new = stock_rest - qte_product_use;

                    const sqlUpdateStock =
                      "UPDATE produit_stock SET stock_restante_produit = ? WHERE id_produit = ?";

                    if (stock_new >= 0) {
                      db.query(
                        sqlUpdateStock,
                        [stock_new, produit],
                        (err, result) => {
                          if (err) {
                            reject(err);
                          } else {
                            resolve(result);
                          }
                        }
                      );
                    } else {
                      reject(`Stock insuffisant pour le produit ${produit}`);
                    }
                  } else {
                    reject(
                      `Quantité introuvable pour le produit ${produit} dans la table menu_semaine`
                    );
                  }
                }
              });
            });
          }
        }
      );
    });
  }

  static async getproductDirector(id_school) {
    return new Promise((resolve, reject) => {
      const requete =
        "SELECT nom_produit, nbre_colis_recu, emballage_produit, poids_unitaire_net, poids_unitaire_totale, stock_restante_produit FROM produit_stock WHERE id_school= ?";
      db.query(requete, [id_school], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  }

  static async getAllProductIds(idSchool) {
    return new Promise((resolve, reject) => {
      const sql = "SELECT id_produit FROM produit_stock WHERE id_school = ?";
      db.query(sql, [idSchool], (err, results) => {
        if (err) reject(err);
        else resolve(results.map((result) => result.id_produit));
      });
    });
  }

  static async getBilanSemaine(date_debut, date_fin, id_school) {
    return new Promise((resolve, reject) => {
      const requete =
        " SELECT m.id_menu, m.nom_menu, m.qte_p1_use, m.qte_p2_use, m.qte_p3_use, m.date_cook FROM menu_semaine m INNER JOIN semaine s ON m.id_semaine = s.id_semaine WHERE s.date_debut >= ? AND s.date_fin <= ? AND m.id_school = ?";
      db.query(requete, [date_debut, date_fin, id_school], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  }

  static async getMonthBilanByproduct(id_mois, id_ecole) {
    return new Promise((resolve, reject) => {
      const requete = `SELECT
            SELECT
            e.id_school,
            e.nom_ecole,
            ps.nom_produit,
            ps.stock_initial,
            sw.stock_finale_physique,
            sw.reception_pam,
            sw.transfert_interne,
            sw.transfert_externe,
            sw.perte_ecole,
            sw.stock_restante_produit
        FROM
            semaine sw
        JOIN produit_stock ps ON sw.id_mois = ps.id_mois AND sw.id_ecole = ps.id_ecole
        JOIN ecole e ON sw.id_ecole = e.id_school
        WHERE
            sw.id_mois = ? AND
            sw.id_ecole = ?
        
        `;

      db.query(requete, [id_mois, id_ecole], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  }
}

module.exports = DirecteurModel;
