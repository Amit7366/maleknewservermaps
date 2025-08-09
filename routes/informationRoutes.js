const express = require("express");
const { getAllInformations, createInformation, updateInformation, deleteInformation, updateCashpin } = require("../controllers/informationController");
const router = express.Router();


router.get('/informations', getAllInformations);
router.post('/informations', createInformation);
router.put('/informations/:id', updateInformation);
router.put('/informations/cashpin/:id', updateCashpin);
router.delete('/informations/:id', deleteInformation);

module.exports = router