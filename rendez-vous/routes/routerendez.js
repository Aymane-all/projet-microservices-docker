const express = require('express');
const router = express.Router();
const {priserRendezvous, annulerRendezvous, reprogrammerRendezvous, historyrendezvous} = require('../controllers/rendez-vousController');
const verifyToken = require('../middlewares/auth');
const { isPatient, isPatientOrMedcin } = require('../middlewares/role');


router.post('/priser',verifyToken,priserRendezvous); // priser un rendez-vous

router.put('/annuler/:id',verifyToken,annulerRendezvous);  // annule un rendez-vous

router.put('/reprogram/:id',reprogrammerRendezvous); // reprograme un rendez-vous

router.get('/history',historyrendezvous); // affiche l'historique des rendez-vous

module.exports = router;