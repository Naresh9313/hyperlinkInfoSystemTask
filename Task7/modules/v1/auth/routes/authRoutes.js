import express from "express";

import authController from "../controller/authController.js";

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/setAddress", authController.setAddress);
router.get("/logout", authController.logout);
router.get("/getProfile", authController.getProfile);
router.put("/updateProfile", authController.profileUpdate);
router.post("/forgotPassword", authController.forgotPassword);
router.post("/resetPassword", authController.resetPassword);
router.post("/forgotPassword1", authController.forgotPassword1);
router.post("/resetPassword1", authController.resetPassword1);

export default router;
