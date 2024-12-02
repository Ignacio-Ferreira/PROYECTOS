const express = require('express');
const { generateImage } = require('../controllers/imageController');

const router = express.Router();

router.post('/image', generateImage);

module.exports = router;
