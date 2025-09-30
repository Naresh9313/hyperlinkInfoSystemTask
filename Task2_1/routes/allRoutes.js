const express = require('express');
const router = express.Router();

const file = require('../routes/files')
router.use(file);

module.exports = router;    