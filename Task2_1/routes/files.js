const express = require('express'); 
const router = express.Router();
const fileController = require('../controller/file');

router.post('/writeFile', fileController.writeFile);
router.get('/readFile', fileController.readFile);
router.post('/appendFile', fileController.appendFile);


module.exports = router;
