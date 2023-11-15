const express = require('express');
const router = express.Router();
const multer = require('multer');
const { sequelize } = require('../../models');
const {averagePropertyPrices,
    predictPropertyPrices} = require('../../controllers/user/predictionController');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/property-prices', predictPropertyPrices);
router.get('/property-average-prices', averagePropertyPrices);


module.exports = router;
