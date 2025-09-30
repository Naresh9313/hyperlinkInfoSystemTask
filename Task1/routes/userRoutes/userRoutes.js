const express = require('express');
const router = express.Router();

const userController = require('../../controller/userController/userController');

router.post('/addUser', userController.addUser);
router.get('/getUser', userController.getUsers);
router.delete('/deleteUser', userController.deleteUser);
router.put('/updateUser', userController.updateUser);    

module.exports = router;
