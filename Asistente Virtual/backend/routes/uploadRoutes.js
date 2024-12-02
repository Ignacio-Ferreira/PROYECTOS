const express = require('express');
const multer = require('multer');
const { handleImageUpload } = require('../controllers/uploadController');

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post('/upload', upload.single('image'), handleImageUpload);

module.exports = router;
