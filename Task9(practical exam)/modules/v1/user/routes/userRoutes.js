import express from "express";
import userController from "../controller/userController.js";


const router = express.Router();

router.post("/addFavourite", userController.addFavourite);
router.post("/bookAppointment", userController.bookAppointment);


export default router;
