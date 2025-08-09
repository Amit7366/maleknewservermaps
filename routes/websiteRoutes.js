const express = require("express");
const router = express.Router();
// const cors = require("cors");
const { getAllWebsites, updateClick } = require("../controllers/websiteController");


//middleware
// router.use(
//     cors({
//         credentials: true,
//         origin: 'http://localhost:5173'
//     })
// )

router.get('/websites', getAllWebsites);
router.put('/updateclick/:id', updateClick);

module.exports = router