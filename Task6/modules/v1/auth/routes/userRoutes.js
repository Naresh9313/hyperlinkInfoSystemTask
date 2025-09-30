import  express from 'express';

import userController from "../controller/userController.js";

const router = express.Router();

router.post("/signup", userController.signup);
router.post("/login",userController.login);
router.post("/logout",userController.logout);
router.get("/getProfile",userController.getProfile);
router.put('/updateProfile',userController.profileUpdate);
router.post('/forgotPassword',userController.forgotPassword);
router.post('/resetPassword',userController.resetPassword);
router.post('/setUserCity',userController.setUserCity);
router.get('/getCities',userController.getCities);
router.get('/getCategories',userController.getCategories);

export default router;
