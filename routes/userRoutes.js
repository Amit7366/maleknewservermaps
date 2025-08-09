const express = require("express");
const router = express.Router();
// const cors = require("cors");
const { getAllUsers, deleteUser, getAllStatistics } = require("../controllers/userController");


//middleware
// router.use(
//     cors({
//         credentials: true,
//         origin: 'http://localhost:5173'
//     })
// )

router.get('/users', getAllUsers);
router.get('/statistics', getAllStatistics);
router.delete('/user/:id', deleteUser);

module.exports = router