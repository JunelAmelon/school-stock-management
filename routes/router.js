const express= require('express');
const router= express.Router();

const directeurcontrolleur= require("../controllers/DirecteurController");
const mediateurcontrolleur= require("../controllers/MediateurControlleur");
const controleurcontrolleur= require("../controllers/ControleurController");
const StockController= require('../controllers/StockController');
const gestionnairecontroleur= require('../controllers/GestionnaireControlleur');
  
//directeur routes
router.post("/inscription", directeurcontrolleur.inscription);
router.post("/login", directeurcontrolleur.login);
router.post("/logout", directeurcontrolleur.logout);
router.get("/informations-personnelles", directeurcontrolleur.informationDirector);
router.get("/nom-de-votre-ecole", directeurcontrolleur.schoolDirector);
router.get("/mediateurs_infos", directeurcontrolleur.info_mediateur);
router.get("/controlleurs_infos", directeurcontrolleur.info_controleur);
router.post("/insérer_un_produit", directeurcontrolleur.insert_product);
router.get("/vos_produits", directeurcontrolleur.product_stock);
router.get("/idMediateur", directeurcontrolleur.mediateurId);
router.get("/bilan-semaine-directeur", directeurcontrolleur.bilanWeek);
router.get("/bilan-mois-directeur", directeurcontrolleur.bilanMonthProduct);

//stock route
router.get("/status", StockController.getProductStatusByIdSchool)

//mediateur routes
router.get("/vos_informations", mediateurcontrolleur.infoMediateur);
router.get("/le_stock_des_ecoles", mediateurcontrolleur.info_stock);
router.get("/informations_des_directeurs", mediateurcontrolleur.info_director);
router.get('/bilan-semaine', mediateurcontrolleur.BilanWeek);
router.get('/bilan-month-product-state', mediateurcontrolleur.BilanMonthByProduct);
router.get("/statuts", mediateurcontrolleur.getProductStatusForSchools);
//controlleurs routes
router.get("/informations_personnelles_controlleurs", controleurcontrolleur.infosControleur);
router.get("/vue_des_stock", controleurcontrolleur.infoStock);
router.get("/informations_directeur", controleurcontrolleur.infoDirecteur);
router.get('/bilan-mensuel', controleurcontrolleur.BilanWeek_mediateurId);
router.get('get-bilan-month-controleur', controleurcontrolleur.getBilanMensuelControleur)

//gestionnaires routes
router.post('/create-school', gestionnairecontroleur.Create_school);
router.post('/create-actor', gestionnairecontroleur.Create_Actor);
router.post('/delete-actor', gestionnairecontroleur.Delete_Actor);
router.post('delete-actor', gestionnairecontroleur.Create_Gestionnaire);
module.exports= router;

