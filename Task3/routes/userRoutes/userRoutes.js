const express = require('express');
const router = express.Router();

const userController = require('../../controller/userController/userController');

router.post('/userCreate', userController.createUser);
router.put('/userUpdate', userController.updateUser);
router.delete('/softDeleteUser',userController.softDeleteUser)
router.delete('/permanentDeleteUser', userController.permanentDeleteUser);
router.get('/userList', userController.listUsers);
router.get('/getUserById', userController.getUserById);
router.get('/userSearch', userController.searchUsers);
router.post('/userLogin', userController.loginUser);


module.exports = router;
