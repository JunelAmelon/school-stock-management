require("dotenv").config();


function login(id, password) {
    return new Promise((resolve, reject) => {
      const requete_s =
        "SELECT * FROM directeur WHERE id_school= ? AND password= ?";
      const requete_m =
        "SELECT * FROM controlleur WHERE id_controleur= ? AND password= ?";
      const requete_c =
        "SELECT * FROM mediateur WHERE id_mediateur= ? AND password= ?";
      db.query(requete_s, [id, password], (err, data) => {
        if (err) {
          db.query(requete_m, [id, password], (err, data) => {
            if (err) {
              db.query(requete_c, [id, password], (err, data) => {
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
            } else {
              if (data.length > 0) {
                resolve(data[0]);
              } else {
                //rejet de la Promise avec message d'erreur
                reject("Invalid username or password");
              }
            }
          });
        } else {
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

// Fonction permettant de récupérer l'ID de l'utilisateur à partir du token JWT dans les cookies de la requête HTTP
function getUserIdFromToken(req) {
  // Récupérer le token d'identification depuis les cookies de la requête
  const token_identifiant = req.cookies.token;

  // Vérifier si le token existe
  if (token_identifiant) {
    try {
      // Décoder le token JWT en utilisant la clé secrète (process.env.SECRET_KEY)
      const decoded = jwt.verify(token_identifiant, process.env.SECRET_KEY);
      // Retourner l'identifiant extrait du token JWT
      return decoded.identifiant; // Mon JWT contient un champ "identifiant".
    } catch (error) {
      // En cas d'erreur lors du décodage du token, retourner null
      return null;
    }
  }
  // Retourner null si le token n'existe pas dans les cookies de la requête
  return null;
}

// Exporter la fonction pour pouvoir l'utiliser dans d'autres fichiers
module.exports = {getUserIdFromToken, login};
