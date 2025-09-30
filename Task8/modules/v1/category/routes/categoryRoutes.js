import  express from 'express';
import categoryController from '../controller/categoryController.js';


const router = express.Router();



//category
router.get("/getCategories",categoryController.getCategories)
router.get("/getProductById",categoryController.getProductById)
router.get("/getProducts",categoryController.getProducts)


export default router