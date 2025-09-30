const express = require('express');
const router = express.Router();

const joke = require('../routes/routes')
router.use(joke)


module.exports = router;