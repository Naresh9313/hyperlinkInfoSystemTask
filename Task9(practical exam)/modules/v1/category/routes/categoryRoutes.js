import express from "express";
import categoryController from "../controller/categoryController.js";


const router = express.Router();

router.get("/getAllCategories", categoryController.getAllCategories);
router.get("/getAllDoctors", categoryController.getAllDoctors);

router.get("/getDoctorDetails", categoryController.getDoctorDetails);

export default router;
